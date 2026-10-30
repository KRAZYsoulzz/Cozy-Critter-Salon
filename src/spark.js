// ============================================================================
// Spark layer: pulsing ghost-hand tutorial, collapsing speech bubble, pet touch
// reactions (hop / heart eyes), happy dance + coins flying into the jar.
// Pure code, no assets.
// ============================================================================
import * as THREE from 'three';
import { addOutline } from './gfx.js';

export function initSpark(app) {
  const $ = (id) => document.getElementById(id);
  const bar = $('speech-bar');
  const textEl = $('speech-text');
  const activePet = () => app.pets && app.pets[app.save.state.activePet];

  // ---- speech bubble collapses to just the speaker icon after a few seconds ----
  let collapseT = 0;
  const armCollapse = () => {
    if (!bar) return;
    bar.classList.remove('compact');
    clearTimeout(collapseT);
    collapseT = setTimeout(() => bar.classList.add('compact'), 5200);
  };
  if (textEl) new MutationObserver(armCollapse).observe(textEl, { childList: true, characterData: true, subtree: true });
  if (bar) bar.addEventListener('pointerdown', () => { if (bar.classList.contains('compact')) armCollapse(); });

  // ---- ghost hand: shows the drag after a few idle seconds in a close-up ----
  const hand = document.createElement('div');
  hand.id = 'ghost-hand';
  hand.innerHTML = '<svg viewBox="0 0 64 80" width="92" height="115"><g stroke="#3a2420" stroke-width="3.5" stroke-linejoin="round" fill="#fff"><rect x="24" y="4" width="17" height="42" rx="8.5"/><rect x="8" y="32" width="17" height="30" rx="8.5"/><rect x="40" y="30" width="16" height="30" rx="8"/><rect x="12" y="38" width="42" height="36" rx="16"/></g><g fill="none" stroke="#f2a8c4" stroke-width="3" stroke-linecap="round"><path d="M32 12v14"/></g></svg><i class="gh-ring"></i>';
  document.body.appendChild(hand);
  let lastAct = performance.now();
  const bump = () => { lastAct = performance.now(); };
  let lastMode = '';
  const petScreen = () => {
    try {
      const v = activePet().root.position.clone(); v.y += 0.55;
      const p = v.project(app.camera);
      return { x: (p.x * 0.5 + 0.5) * window.innerWidth, y: (-p.y * 0.5 + 0.5) * window.innerHeight };
    } catch (e) { return { x: window.innerWidth / 2, y: window.innerHeight / 2 }; }
  };
  const tick = (now) => {
    if (app.mode !== lastMode) { lastMode = app.mode; bump(); }
    const modalOpen = document.querySelector('.center-modal:not(.hidden), .modal-overlay:not(.hidden)');
    const show = app.mode === 'activity' && !modalOpen && now - lastAct > 4800;
    hand.classList.toggle('on', !!show);
    if (show) {
      const c = petScreen(), t = now / 1000;
      const x = c.x + Math.sin(t * 3.1) * 90, y = c.y + 20 + Math.cos(t * 3.1) * 14;
      hand.style.transform = `translate(${x - 30}px, ${y - 12}px) rotate(-12deg) scale(${1 + Math.sin(t * 6) * 0.05})`;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  window.addEventListener('pointerdown', bump, true);
  window.addEventListener('pointermove', (e) => { if (e.buttons) bump(); }, true);

  // ---- pet reactions ----
  let lastHop = 0;
  const react = (strong) => {
    const pet = activePet(); if (!pet) return;
    const now = performance.now();
    if (now - lastHop < (strong ? 500 : 1500)) return;
    lastHop = now;
    try { pet.setHappy && pet.setHappy(strong ? 2.2 : 1.6); pet.triggerHop && pet.triggerHop(); if (strong && pet.triggerHeartEyes) pet.triggerHeartEyes(1.4); } catch (e) {}
  };
  const origProg = app.ui.updateActivityProgress.bind(app.ui);
  let lastPct = 0;
  app.ui.updateActivityProgress = (pct) => { origProg(pct); if (pct > lastPct + 0.5 && app.mode === 'activity') { bump(); react(false); } lastPct = pct; };
  app.canvas && app.canvas.addEventListener('pointerup', (e) => {
    if (app.mode !== 'world' && app.mode !== 'activity') return;
    const at = petScreen();
    if (Math.hypot(e.clientX - at.x, e.clientY - at.y) < 110) react(true);
  });

  // ---- reward: happy dance + coins fly into the coin jar ----
  const reward = $('reward-modal');
  const flyCoins = () => {
    const jar = document.querySelector('.coin-pill'); if (!jar) return;
    const j = jar.getBoundingClientRect();
    const from = { x: window.innerWidth / 2, y: window.innerHeight * 0.45 };
    for (let i = 0; i < 12; i++) {
      const c = document.createElement('i'); c.className = 'fly-coin';
      c.style.left = from.x + 'px'; c.style.top = from.y + 'px';
      c.style.setProperty('--sx', (Math.random() * 160 - 80) + 'px');
      c.style.setProperty('--sy', (Math.random() * -120 - 20) + 'px');
      c.style.setProperty('--tx', (j.left + j.width * 0.25 - from.x) + 'px');
      c.style.setProperty('--ty', (j.top + j.height / 2 - from.y) + 'px');
      c.style.animationDelay = (i * 70) + 'ms';
      document.body.appendChild(c); setTimeout(() => c.remove(), 2000);
    }
    setTimeout(() => { jar.classList.remove('jar-pop'); void jar.offsetWidth; jar.classList.add('jar-pop'); }, 900);
  };
  if (reward) new MutationObserver(() => {
    if (reward.classList.contains('hidden')) return;
    flyCoins();
    const pet = activePet();
    [0, 650, 1300].forEach((d) => setTimeout(() => { try { pet.triggerHop(); pet.triggerHeartEyes && pet.triggerHeartEyes(1.2); app.fxBurst && app.fxBurst(petScreen(), 6, 4); } catch (e) {} }, d));
  }).observe(reward, { attributes: true, attributeFilter: ['class'] });

  // ---- plush round rugs under each pet in the hub ----
  const RUG = { capybara: ['#a24f92', '#c97bb8'], axolotl: ['#26b3b3', '#6fdcd6'], dikdik: ['#ff7a5c', '#ffb09a'] };
  const makeRug = (petId) => {
    const [c1, c2] = RUG[petId] || ['#a24f92', '#c97bb8'];
    const cv = document.createElement('canvas'); cv.width = cv.height = 256;
    const g = cv.getContext('2d');
    g.fillStyle = c1; g.fillRect(0, 0, 256, 256);
    g.strokeStyle = c2; g.lineWidth = 10; g.beginPath(); g.arc(128, 128, 108, 0, 7); g.stroke();
    g.fillStyle = c2; g.beginPath(); g.moveTo(128, 196); g.bezierCurveTo(40, 130, 78, 70, 128, 108); g.bezierCurveTo(178, 70, 216, 130, 128, 196); g.fill();
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const side = new THREE.MeshToonMaterial({ color: c1 });
    const mats = [side, new THREE.MeshBasicMaterial({ map: tex }), side];
    const rug = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.0, 0.09, 40), mats);
    rug.position.y = 0.045; rug.receiveShadow = true; addOutline(rug, 0.02);
    return rug;
  };
  setInterval(() => {
    const vis = app.mode === 'world';
    for (const id of Object.keys(app.pets || {})) {
      const p = app.pets[id]; if (!p || !p.root) continue;
      if (!p.rug) { p.rug = makeRug(id); p.root.add(p.rug); }
      const onPad = Math.hypot(p.root.position.x, p.root.position.z - 1.2) <= 1.7; p.rug.visible = vis; p.rug.position.y = onPad ? 0.375 : 0.045;
    }
  }, 250);

  // ---- tidy HUD flag for CSS ----
  setInterval(() => document.body.classList.toggle('in-closeup', app.mode === 'activity' && app._station !== 'shop' && app._station !== 'photobooth'), 300);
}
