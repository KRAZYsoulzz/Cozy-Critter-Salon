// ============================================================================
// Spark 2 (Loop 4): dimmed close-ups + stir/cut hints, big love heart, sad/happy
// moods, thought-bubble taps, sticker book, hand-drawn grain, shelf scroll cue.
// ============================================================================
import * as THREE from 'three';

export function initSpark2(app) {
  const $ = (id) => document.getElementById(id);
  const activePet = () => app.pets && app.pets[app.save.state.activePet];
  const say = (m) => {
    let t = document.querySelector('.lock-toast');
    if (!t) { t = document.createElement('div'); t.className = 'lock-toast'; document.body.appendChild(t); }
    t.textContent = m; t.classList.remove('on'); void t.offsetWidth; t.classList.add('on');
    clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), 3200);
  };
  app.toast = say;

  // ---- station tracking + immediate closeup class ----
  const enter0 = app.enterStation.bind(app);
  const exit0 = app.exitActivity.bind(app);
  let enteredAt = 0;
  app.enterStation = (id, ...r) => {
    app._station = id; enteredAt = performance.now();
    const cu = id !== 'shop' && id !== 'photobooth';
    document.body.classList.toggle('in-closeup', cu);
    document.body.dataset.station = id;
    document.body.classList.toggle('station-lobby', id === 'lobby');
    return enter0(id, ...r);
  };
  app.exitActivity = (...r) => {
    app._station = null; delete document.body.dataset.station;
    document.body.classList.remove('in-closeup', 'station-lobby');
    return exit0(...r);
  };

  // ---- dim the whole background to ~45%: camera-facing dark plane behind the pet ----
  const dim = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 50),
    new THREE.MeshBasicMaterial({ color: 0x1a0c2a, transparent: true, opacity: 0, depthWrite: false, fog: false, toneMapped: false })
  );
  dim.frustumCulled = false; dim.renderOrder = 2; dim.visible = false;
  app.scene.add(dim);
  const dir = new THREE.Vector3();

  // ---- curved stir arrows / dashed cut line ----
  const hints = document.createElement('div'); hints.id = 'closeup-hints';
  const ink = '#3a2420';
  const arc = (d) => `<path d="${d}" fill="none" stroke="${ink}" stroke-width="17" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/>`;
  const head = (pts) => `<polygon points="${pts}" fill="#fff" stroke="${ink}" stroke-width="6" stroke-linejoin="round"/>`;
  const dash = (d) => `<path d="${d}" fill="none" stroke="${ink}" stroke-width="13" stroke-linecap="round" stroke-dasharray="2 24"/><path d="${d}" class="dash-anim" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-dasharray="2 24"/>`;
  const STIR = `<g class="spin">${arc('M70 190 A120 120 0 0 1 190 70')}${head('190,40 232,70 190,100')}${arc('M310 190 A120 120 0 0 1 190 310')}${head('190,280 148,310 190,340')}</g>`;
  const CUT = `${dash('M30 250 Q190 170 350 250')}${head('350,222 372,254 336,266')}`;
  const HINT = { spa: STIR, kitchen: STIR, lobby: STIR, vet: CUT, yard: CUT };
  hints.innerHTML = '<svg viewBox="0 0 380 380" width="380" height="380"></svg>';
  document.body.appendChild(hints);
  const hsvg = hints.firstChild; let hintFor = null;

  let lastAct = performance.now();
  const bump = () => { lastAct = performance.now(); };
  window.addEventListener('pointerdown', bump, true);
  window.addEventListener('pointermove', (e) => { if (e.buttons) bump(); }, true);

  const petScreen = (dy = 0.45) => {
    try {
      const v = activePet().root.position.clone(); v.y += dy;
      const p = v.project(app.camera);
      return { x: (p.x * 0.5 + 0.5) * innerWidth, y: (-p.y * 0.5 + 0.5) * innerHeight };
    } catch (e) { return { x: innerWidth / 2, y: innerHeight / 2 }; }
  };

  const loop = (now) => {
    const act = app.mode === 'activity' && app._station && app._station !== 'shop' && app._station !== 'photobooth';
    const target = act ? 0.52 : 0;
    dim.material.opacity += (target - dim.material.opacity) * 0.12;
    if (dim.material.opacity > 0.01 && act) {
      dim.visible = true;
      const pet = activePet();
      app.camera.getWorldDirection(dir);
      const p = pet.root.position;
      dim.position.set(p.x, p.y + 0.5, p.z).addScaledVector(dir, 1.25);
      dim.quaternion.copy(app.camera.quaternion);
    } else dim.visible = false;
    if (now - (window.__mq || 0) > 250) { window.__mq = now; window.__mo = document.querySelector('.center-modal:not(.hidden), .modal-overlay:not(.hidden)'); }
    const modalOpen = window.__mo;
    const want = act && !modalOpen && (now - enteredAt < 5200 || now - lastAct > 4800);
    hints.classList.toggle('on', !!want);
    if (act) {
      if (hintFor !== app._station) { hintFor = app._station; hsvg.innerHTML = HINT[hintFor] || STIR; }
      const c = petScreen(0.4);
      hints.style.transform = `translate(${c.x - 190}px, ${c.y - 190}px)`;
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  // ---- big love heart in the cuddle room ----
  const H = 'M50 84 C8 54 2 30 18 15 C32 3 46 10 50 24 C54 10 68 3 82 15 C98 30 92 54 50 84 Z';
  const heart = document.createElement('div'); heart.id = 'love-heart';
  heart.innerHTML = `<svg viewBox="-6 -6 112 102" width="190" height="173"><defs><clipPath id="lh-clip"><rect id="lh-rect" x="-6" y="96" width="120" height="100"/></clipPath><linearGradient id="lh-g" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff3b7f"/><stop offset="1" stop-color="#ff8fb8"/></linearGradient></defs><path d="${H}" fill="#fff3f8" stroke="none"/><path d="${H}" fill="url(#lh-g)" clip-path="url(#lh-clip)"/><path d="M24 22 C20 28 20 36 24 42" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/><path d="${H}" fill="none" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/></svg>`;
  document.body.appendChild(heart);
  const lhRect = heart.querySelector('#lh-rect');
  let lastP = 0;
  const prog0 = app.ui.updateActivityProgress.bind(app.ui);
  app.ui.updateActivityProgress = (pct) => {
    prog0(pct);
    const f = Math.max(0, Math.min(100, pct)) / 100;
    lhRect.setAttribute('y', String(96 - 102 * f));
    if (pct > lastP + 0.5) {
      heart.classList.remove('beat'); void heart.offsetWidth; heart.classList.add('beat');
      const pet = activePet(); if (pet && pet.setHappy && app.mode === 'activity') pet.setHappy(1.8);
    }
    lastP = pct;
  };

  // ---- moods: sad when the pet needs something ----
  setInterval(() => {
    const live = app.mode === 'world' || app.mode === 'activity';
    if (app.mode === 'world') { try { app.updatePetThoughtBubbles(); } catch (e) {} }
    for (const id of Object.keys(app.pets || {})) {
      const p = app.pets[id]; if (!p) continue;
      let sad = false;
      try { sad = live && !!app.save.getPetPrimaryNeed(id) && (app.mode === 'world' || id === app.save.state.activePet); } catch (e) {}
      p.sad = sad;
    }
  }, 300);

  // ---- tapping a thought bubble opens that room ----
  const v3 = new THREE.Vector3();
  app.canvas && app.canvas.addEventListener('pointerup', (e) => {
    if (app.mode !== 'world') return;
    for (const id of Object.keys(app.pets || {})) {
      const p = app.pets[id]; const sp = p && p.thoughtSprite;
      if (!sp || !sp.visible) continue;
      sp.getWorldPosition(v3); v3.project(app.camera);
      const x = (v3.x * 0.5 + 0.5) * innerWidth, y = (-v3.y * 0.5 + 0.5) * innerHeight;
      if (Math.hypot(e.clientX - x, e.clientY - y) < 62) {
        const need = app.save.getPetPrimaryNeed(id);
        if (!need) continue;
        app.selectPet && app.selectPet(id);
        app.sound && app.sound.playBubblePop && app.sound.playBubblePop();
        (app.walkToOrEnterStation ? app.walkToOrEnterStation(need.type) : app.enterStation(need.type));
        break;
      }
    }
  });

  // ---- sticker book (fed by the photo booth) ----
  const KEY = 'cozy_critter_stickers_v1';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
  const store = (a) => { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) { try { localStorage.setItem(KEY, JSON.stringify(a.slice(0, 8))); } catch (e2) {} } };
  const makeSticker = (src) => new Promise((res) => {
    const im = new Image(); im.onload = () => {
      const S = 200, cv = document.createElement('canvas'); cv.width = cv.height = S;
      const g = cv.getContext('2d'); const c = S / 2;
      g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 6; g.shadowOffsetY = 3;
      g.fillStyle = '#fff'; g.beginPath(); g.arc(c, c, c - 8, 0, 7); g.fill();
      g.shadowColor = 'transparent';
      g.strokeStyle = ink; g.lineWidth = 3; g.beginPath(); g.arc(c, c, c - 8, 0, 7); g.stroke();
      g.save(); g.beginPath(); g.arc(c, c, c - 20, 0, 7); g.clip();
      const sc = Math.max(S / im.height, S / im.width) * 1.05;
      g.drawImage(im, c - im.width * sc / 2, c - im.height * sc / 2 + 6, im.width * sc, im.height * sc);
      g.restore();
      g.fillStyle = '#ffd43b'; g.strokeStyle = ink; g.lineWidth = 3;
      g.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 7 : 16, a = -Math.PI / 2 + i * Math.PI / 5; g.lineTo(S - 34 + Math.cos(a) * r, 34 + Math.sin(a) * r); } g.closePath(); g.fill(); g.stroke();
      res(cv.toDataURL('image/webp', 0.82));
    }; im.onerror = () => res(null); im.src = src;
  });
  let lastPhoto = (app.save.state.photoAlbum[0] || {}).id;
  setInterval(async () => {
    const a = app.save.state.photoAlbum; if (!a[0] || a[0].id === lastPhoto) return;
    lastPhoto = a[0].id;
    const url = await makeSticker(a[0].dataUrl); if (!url) return;
    const list = load(); list.unshift({ id: a[0].id, url, rot: Math.round(Math.random() * 20 - 10), cap: a[0].caption }); store(list.slice(0, 20));
    const fl = document.createElement('img'); fl.src = url; fl.className = 'sticker-pop'; document.body.appendChild(fl); setTimeout(() => fl.remove(), 2200);
    say('New sticker in your Sticker Book!'); renderBook();
  }, 500);

  const ex = document.querySelector('.world-extras');
  if (ex) {
    const b = document.createElement('button'); b.id = 'btn-open-stickers'; b.className = 'world-icon-btn'; b.title = 'Sticker Book';
    b.innerHTML = `<span class="nav-ico"><svg viewBox="0 0 40 40" width="38" height="38"><path d="M6 8h22l8 8v18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z" fill="#ffd0e4" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/><path d="M28 8v8h8" fill="#fff" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/><path d="M20 17l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z" fill="#ffd43b" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/></svg></span><span class="nav-label">Stickers</span>`;
    ex.appendChild(b);
    b.addEventListener('pointerdown', (e) => { e.stopPropagation(); app.sound && app.sound.playBubblePop && app.sound.playBubblePop(); renderBook(); book.classList.remove('hidden'); });
  }
  const book = document.createElement('section'); book.id = 'sticker-book'; book.className = 'hidden';
  book.innerHTML = '<div class="sb-panel"><h2>My Sticker Book</h2><div class="sb-grid"></div><p class="sb-hint"></p><button class="sb-close" aria-label="Close">&#10005;</button></div>';
  document.body.appendChild(book);
  const renderBook = () => {
    const list = load(), grid = book.querySelector('.sb-grid'); grid.innerHTML = '';
    for (let i = 0; i < 12; i++) {
      const s = document.createElement('div'); s.className = 'sb-slot';
      if (list[i]) { const im = document.createElement('img'); im.src = list[i].url; im.style.transform = `rotate(${list[i].rot || 0}deg)`; s.appendChild(im); }
      else s.innerHTML = '<span>&#9733;</span>';
      grid.appendChild(s);
    }
    book.querySelector('.sb-hint').textContent = list.length ? `${list.length} sticker${list.length > 1 ? 's' : ''} collected!` : 'Take a picture in the Photo Booth to get your first sticker!';
  };
  book.querySelector('.sb-close').addEventListener('pointerdown', (e) => { e.stopPropagation(); book.classList.add('hidden'); });
  book.addEventListener('pointerdown', (e) => { if (e.target === book) book.classList.add('hidden'); });
  renderBook();

  // ---- unlock celebration ----
  let lastRoutines = app.save.state.routinesCompleted || 0;
  setInterval(() => {
    const r = app.save.state.routinesCompleted || 0;
    if (r !== lastRoutines) { if ((r >= 3 && lastRoutines < 3) || (r >= 6 && lastRoutines < 6)) say('New sparkle snacks unlocked in the Kitchen!'); lastRoutines = r; }
  }, 700);

  // ---- hand-drawn feel: static tiled paper grain (no SVG filters) ----
  const gc = document.createElement('canvas'); gc.width = gc.height = 128; const gg = gc.getContext('2d'); const id = gg.createImageData(128, 128);
  for (let i = 0; i < id.data.length; i += 4) { const dk = Math.random() < 0.5; id.data[i] = id.data[i + 1] = id.data[i + 2] = dk ? 40 : 255; id.data[i + 3] = Math.random() * (dk ? 26 : 22); }
  gg.putImageData(id, 0, 0);
  const grain = document.createElement('div'); grain.id = 'paper-grain'; grain.style.backgroundImage = `url(${gc.toDataURL()})`; document.body.appendChild(grain);

  // ---- shelf scroll cue ----
  const dock = $('activity-tool-dock');
  const more = document.createElement('button'); more.id = 'shelf-more'; more.innerHTML = '&#9660;'; document.body.appendChild(more);
  more.addEventListener('pointerdown', (e) => { e.stopPropagation(); dock.scrollBy({ top: 180, behavior: 'smooth' }); });
  setInterval(() => {
    if (!dock || app.mode !== 'activity') { more.classList.remove('on'); return; }
    const r = dock.getBoundingClientRect();
    const can = dock.scrollHeight - dock.scrollTop - dock.clientHeight > 8;
    more.classList.toggle('on', can);
    more.style.left = (r.left + r.width / 2 - 24) + 'px'; more.style.top = (r.bottom - 34) + 'px';
  }, 250);
}

