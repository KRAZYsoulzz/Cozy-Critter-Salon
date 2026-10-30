import fs from 'node:fs';
let s = fs.readFileSync('src/polish.js','utf8');
s = s.replace("import { iconSVG } from './icons.js';", "import { iconSVG } from './icons.js';\nimport { ROOM_INFO } from './world.js';\nimport * as THREE from 'three';");
const add = `
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
`;
const i = s.lastIndexOf('}\n\nfunction handSVG');
s = s.slice(0,i) + add + s.slice(i);
fs.writeFileSync('src/polish.js', s);
