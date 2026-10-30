// ============================================================================
// Cozy Critter Salon & Spa - store-ready polish layer (transitions, tap sounds,
// confetti, boot splash, title life, first-run hint). Pure code, no assets.
// ============================================================================
import { iconSVG } from './icons.js';
import { ROOM_INFO } from './world.js';
import * as THREE from 'three';

export function initPolish(app) {
  const $ = (id) => document.getElementById(id);

  // ---- boot splash: fade once the first frames are on screen ----
  const boot = $('boot');
  if (boot) {
    const t0 = performance.now();
    const hide = () => { boot.classList.add('gone'); setTimeout(() => boot.remove(), 700); };
    requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(hide, Math.max(0, 900 - (performance.now() - (window.__bootStart || t0))))));
  }

  // ---- soft pop on every button press ----
  document.addEventListener('pointerdown', (e) => {
    const el = e.target.closest && e.target.closest('button, .shop-card, .choice-pill, .color-swatch, .frame-btn');
    if (!el || el.disabled) return;
    app.sound.playUITap && app.sound.playUITap(el.id === 'btn-play-game');
  }, true);

  // ---- iris wipe when stepping into / out of a room ----
  const wipe = $('wipe');
  const runWipe = () => {
    if (!wipe) return;
    wipe.classList.remove('go', 'done'); void wipe.offsetWidth; wipe.classList.add('go');
    clearTimeout(runWipe.t); runWipe.t = setTimeout(() => { wipe.classList.remove('go'); wipe.classList.add('done'); }, 700);
    app.sound.playWhoosh && app.sound.playWhoosh();
  };
  const origEnter = app.enterStation.bind(app);
  const origExit = app.exitActivity.bind(app);
  app.enterStation = (id) => { runWipe(); origEnter(id); try { localStorage.setItem('cc_onboarded', '1'); removeHint(); } catch (e) {} };
  app.exitActivity = () => { const was = app.mode !== 'world'; if (was) runWipe(); origExit(); };

  // ---- confetti on reward ----
  const conf = $('confetti');
  const burst = () => {
    if (!conf) return;
    const cols = ['#ff5fa2', '#ffd43b', '#51cf66', '#845ef7', '#4dabf7', '#ff922b'];
    for (let i = 0; i < 46; i++) {
      const b = document.createElement('b');
      b.style.left = (Math.random() * 100) + '%';
      b.style.background = cols[i % cols.length];
      b.style.animationDuration = (1.6 + Math.random() * 1.6) + 's';
      b.style.animationDelay = (Math.random() * 0.45) + 's';
      b.style.width = (8 + Math.random() * 10) + 'px';
      conf.appendChild(b);
      setTimeout(() => b.remove(), 4200);
    }
  };
  const rm = $('reward-modal');
  if (rm) new MutationObserver(() => { if (!rm.classList.contains('hidden')) burst(); }).observe(rm, { attributes: true, attributeFilter: ['class'] });

  // ---- coin / star counter bump ----
  for (const id of ['coin-count', 'star-count']) {
    const el = $(id); if (!el) continue;
    const pill = el.closest('.stat-pill');
    new MutationObserver(() => { pill.classList.remove('bump'); void pill.offsetWidth; pill.classList.add('bump'); }).observe(el, { childList: true, characterData: true, subtree: true });
  }

  // ---- title life: critters hop to say hi ----
  setInterval(() => {
    if (app.mode !== 'title') return;
    const ids = ['capybara', 'axolotl', 'dikdik'];
    const p = app.pets[ids[Math.floor(Math.random() * 3)]];
    if (p && p.triggerHop) p.triggerHop();
  }, 1700);

  // ---- first-run hint: hand pointing at the Spa button until the first room visit ----
  let hand = null;
  function removeHint() { if (hand) { hand.remove(); hand = null; } document.querySelectorAll('.hint-glow').forEach(e => e.classList.remove('hint-glow')); }
  function showHint() {
    try { if (localStorage.getItem('cc_onboarded')) return; } catch (e) {}
    const btn = document.querySelector('[data-jump-station="spa"]');
    if (!btn || app.mode !== 'world') return;
    const r = btn.getBoundingClientRect();
    if (!r.width) return;
    btn.classList.add('hint-glow');
    if (!hand) { hand = document.createElement('div'); hand.className = 'hint-hand'; hand.innerHTML = handSVG(); document.body.appendChild(hand); }
    hand.style.left = (r.left + r.width / 2) + 'px'; hand.style.top = (r.top - 70) + 'px';
  }
  setInterval(() => { if (app.mode === 'world') showHint(); else removeHint(); }, 900);

  // ---- room-name banner: slides in when you enter a room, then tucks away ----
  const banner = document.createElement('div');
  banner.id = 'room-title'; banner.className = 'room-title';
  banner.innerHTML = '<span class="rt-ico"></span><span class="rt-name"></span>';
  document.body.appendChild(banner);
  let lastRoom = null, bannerT = 0;
  const showBanner = (roomId) => {
    const info = ROOM_INFO[roomId]; if (!info) return;
    banner.querySelector('.rt-ico').innerHTML = iconSVG(info.icon, 40);
    banner.querySelector('.rt-name').textContent = info.name;
    banner.classList.remove('show'); void banner.offsetWidth; banner.classList.add('show');
    clearTimeout(bannerT); bannerT = setTimeout(() => banner.classList.remove('show'), 2300);
  };
  const origBanner = app.ui.updateRoomBanner.bind(app.ui);
  app.ui.updateRoomBanner = (roomId) => {
    origBanner(roomId);
    if (app.mode === 'title' || document.body.classList.contains('on-title')) { lastRoom = roomId; return; }
    if (roomId !== lastRoom) { lastRoom = roomId; showBanner(roomId); }
  };
  // re-announce the room when stepping into a close-up
  const enterWrap = app.enterStation;
  app.enterStation = (id) => { lastRoom = null; enterWrap(id); };

  // ---- close-up vignette (focus on the pet) ----
  const vig = document.createElement('div'); vig.className = 'closeup-vignette'; document.body.appendChild(vig);
  setInterval(() => vig.classList.toggle('on', app.mode === 'activity' || app.mode === 'shop'), 250);

  // ---- heart / sparkle bursts on care + progress ----
  const fx = document.createElement('div'); fx.id = 'fx-layer'; document.body.appendChild(fx);
  const petScreen = () => {
    try {
      const pet = app.pets[app.save.state.activePet];
      const v = pet.root.position.clone(); v.y += app.mode === 'world' ? 0.9 : 1.0;
      const p = v.project(app.camera);
      return { x: (p.x * 0.5 + 0.5) * window.innerWidth, y: (-p.y * 0.5 + 0.5) * window.innerHeight };
    } catch (e) { return { x: window.innerWidth / 2, y: window.innerHeight / 2 }; }
  };
  const heartSVG = (c) => '<svg viewBox="0 0 24 22" width="100%" height="100%"><path d="M12 21 C-6 9 4 -3 12 5 C20 -3 30 9 12 21Z" fill="' + c + '" stroke="#fff" stroke-width="2"/></svg>';
  const starSVG = (c) => '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M12 1.5l3 7 7.5.7-5.7 5 1.8 7.4L12 17.7 5.4 21.6l1.8-7.4-5.7-5L9 8.5z" fill="' + c + '" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  const sparkle = (at, n = 9, hearts = 4) => {
    const cols = ['#ff5fa2', '#ff8fb1', '#ffd43b', '#fff3a0', '#9be7ff'];
    for (let i = 0; i < n + hearts; i++) {
      const el = document.createElement('i');
      const isHeart = i < hearts;
      el.className = 'fx-bit ' + (isHeart ? 'fx-heart' : 'fx-star');
      el.innerHTML = isHeart ? heartSVG(cols[i % 2]) : starSVG(cols[2 + (i % 3)]);
      const a = Math.random() * Math.PI * 2, d = 50 + Math.random() * 90;
      el.style.left = at.x + 'px'; el.style.top = at.y + 'px';
      el.style.setProperty('--dx', Math.cos(a) * d + 'px');
      el.style.setProperty('--dy', (Math.sin(a) * d - (isHeart ? 70 : 20)) + 'px');
      el.style.setProperty('--s', (isHeart ? 22 + Math.random() * 16 : 14 + Math.random() * 14) + 'px');
      el.style.setProperty('--r', (Math.random() * 120 - 60) + 'deg');
      el.style.animationDelay = (i * 18) + 'ms';
      fx.appendChild(el); setTimeout(() => el.remove(), 1400);
    }
  };
  app.fxBurst = sparkle;
  let lastPct = 0;
  const origProg = app.ui.updateActivityProgress.bind(app.ui);
  app.ui.updateActivityProgress = (pct) => {
    origProg(pct);
    if (pct > lastPct + 0.5 && pct < 100 && app.mode === 'activity') sparkle(petScreen(), 7, 3);
    lastPct = pct;
  };
  // happy tap on the pet in the world
  const wasMode = () => app.mode;
  app.canvas && app.canvas.addEventListener('pointerup', (e) => {
    if (wasMode() !== 'world') return;
    const at = petScreen();
    if (Math.hypot(e.clientX - at.x, e.clientY - at.y) < 70) sparkle(at, 5, 5);
  });
}

function handSVG() {
  return '<svg viewBox="0 0 64 64" width="64" height="64"><path d="M32 54 L14 32 H25 V10 a7 7 0 0 1 14 0 V32 H50 Z" fill="#fff" stroke="#d6407f" stroke-width="5" stroke-linejoin="round" transform="rotate(180 32 32)"/></svg>';
}
