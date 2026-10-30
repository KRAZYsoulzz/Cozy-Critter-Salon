// ============================================================================
// decor.js - loop-3 richness pass: wallpaper + wainscot per room, windows with
// curtains / flower boxes / light shafts, twinkling fairy lights, a dressed spa
// tub, a lived-in yard. Pure code, zero assets.
// ============================================================================
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { toonMat, canvasTexture, glowTexture } from './gfx.js';

const PPM = 118; // texture pixels per metre
export const THEMES = {
  lobby: { paper: '#ffeaf2', stripe: '#ffdbe8', wain: '#ff7fae', panel: '#ff9cc2', line: '#c2457a', dot: '#ff6fa3', motif: 'heart' },
  spa: { paper: '#dff6fa', stripe: '#c9eef5', wain: '#27c4d6', panel: '#4fd6e4', line: '#0d8a9a', dot: '#4aa8ff', motif: 'bubble' },
  vet: { paper: '#e4fbef', stripe: '#d0f6e2', wain: '#33cf98', panel: '#5ee0b2', line: '#12896a', dot: '#33cf98', motif: 'cross' },
  kitchen: { paper: '#fff0c6', stripe: '#ffe6a0', wain: '#ffc93a', panel: '#ffd965', line: '#c98a00', dot: '#ff9f1c', motif: 'check' },
  yard: { paper: '#e1f7d8', stripe: '#cdf0bf', wain: '#5fcf5a', panel: '#85de7c', line: '#2f8f2f', dot: '#ffcf33', motif: 'flower' },
  plain:   { paper: '#fff3e6', stripe: '#ffe8d2', wain: '#ffc9b0', panel: '#ffdccb', line: '#d9835f', dot: '#ffb199', motif: 'dot' }
};

const texCache = new Map();
/** Wallpaper+wainscot texture sized to a wall face (lengthM x heightM). themeAt(xMetre)->theme key. */
function wallTexture(lengthM, heightM, themeAt) {
  const key = lengthM + '|' + heightM + '|' + (themeAt.key || themeAt);
  if (texCache.has(key)) return texCache.get(key);
  const W = Math.min(4096, Math.round(lengthM * PPM)), H = Math.round(heightM * PPM);
  const px = W / lengthM;
  const tex = canvasTexture((ctx, w, h) => {
    const wainH = 0.95 * px;
    for (let x = 0; x < w; x++) { /* column-wise theme so one long wall can hold two rooms */ }
    const segs = [];
    let cur = null;
    for (let x = 0; x <= w; x += 4) {
      const t = typeof themeAt === 'function' ? themeAt(x / px) : themeAt;
      if (!cur || cur.t !== t) { cur = { t, x0: x }; segs.push(cur); }
      cur.x1 = x + 4;
    }
    for (const s of segs) {
      const T = THEMES[s.t];
      const x0 = s.x0, sw = Math.min(w, s.x1) - x0;
      ctx.save(); ctx.beginPath(); ctx.rect(x0, 0, sw, h); ctx.clip();
      ctx.fillStyle = T.paper; ctx.fillRect(x0, 0, sw, h);
      // soft vertical stripes
      ctx.fillStyle = T.stripe;
      for (let x = x0 - (x0 % (0.5 * px)); x < x0 + sw; x += 0.5 * px) ctx.fillRect(x, 0, 0.25 * px, h - wainH);
      // motif pattern on a brick grid
      ctx.fillStyle = T.dot; ctx.strokeStyle = T.dot; ctx.lineWidth = 2; ctx.globalAlpha = 0.55;
      const step = 0.5 * px;
      for (let row = 0, y = 0.28 * px; y < h - wainH - 0.2 * px; y += 0.42 * px, row++) {
        for (let x = x0 - (x0 % step) + (row % 2) * step / 2; x < x0 + sw; x += step) {
          const r = 0.045 * px;
          if (T.motif === 'heart') { ctx.beginPath(); ctx.moveTo(x, y + r); ctx.bezierCurveTo(x - r * 2, y - r * 0.4, x - r * 0.6, y - r * 1.6, x, y - r * 0.5); ctx.bezierCurveTo(x + r * 0.6, y - r * 1.6, x + r * 2, y - r * 0.4, x, y + r); ctx.fill(); }
          else if (T.motif === 'bubble') { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke(); }
          else if (T.motif === 'cross') { ctx.fillRect(x - r * 0.3, y - r, r * 0.6, r * 2); ctx.fillRect(x - r, y - r * 0.3, r * 2, r * 0.6); }
          else if (T.motif === 'check') { ctx.fillRect(x - r * 0.8, y - r * 0.8, r * 1.6, r * 1.6); }
          else if (T.motif === 'flower') { for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.arc(x + Math.cos(k * 1.256) * r * 0.8, y + Math.sin(k * 1.256) * r * 0.8, r * 0.55, 0, 7); ctx.fill(); } }
          else { ctx.beginPath(); ctx.arc(x, y, r * 0.7, 0, 7); ctx.fill(); }
        }
      }
      ctx.globalAlpha = 1;
      // wainscot with raised panels
      const wy = h - wainH;
      ctx.fillStyle = T.wain; ctx.fillRect(x0, wy, sw, wainH);
      const pw = 0.72 * px;
      for (let x = x0 - (x0 % pw) + 0.08 * px; x < x0 + sw; x += pw) {
        ctx.fillStyle = T.panel; ctx.beginPath(); ctx.roundRect(x, wy + 0.16 * px, pw - 0.16 * px, wainH - 0.34 * px, 10); ctx.fill();
        ctx.strokeStyle = T.line; ctx.globalAlpha = 0.4; ctx.lineWidth = 3; ctx.stroke(); ctx.globalAlpha = 1;
      }
      // chair rail + baseboard
      ctx.fillStyle = '#ffffff'; ctx.fillRect(x0, wy - 0.035 * px, sw, 0.075 * px);
      ctx.fillStyle = 'rgba(0,0,0,0.10)'; ctx.fillRect(x0, wy + 0.04 * px, sw, 0.04 * px);
      ctx.fillStyle = '#fffaf2'; ctx.fillRect(x0, h - 0.11 * px, sw, 0.11 * px);
      ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(x0, h - 0.115 * px, sw, 0.012 * px);
      // crown moulding
      ctx.fillStyle = '#ffffff'; ctx.fillRect(x0, 0, sw, 0.1 * px);
      ctx.fillStyle = T.line; ctx.globalAlpha = 0.45; ctx.fillRect(x0, 0.1 * px, sw, 0.025 * px); ctx.globalAlpha = 1;
      // ambient occlusion at floor + ceiling
      const g1 = ctx.createLinearGradient(0, h - 0.5 * px, 0, h); g1.addColorStop(0, 'rgba(90,40,60,0)'); g1.addColorStop(1, 'rgba(90,40,60,0.16)');
      ctx.fillStyle = g1; ctx.fillRect(x0, h - 0.5 * px, sw, 0.5 * px);
      const g2 = ctx.createLinearGradient(0, 0, 0, 0.55 * px); g2.addColorStop(0, 'rgba(90,40,60,0.14)'); g2.addColorStop(1, 'rgba(90,40,60,0)');
      ctx.fillStyle = g2; ctx.fillRect(x0, 0, sw, 0.55 * px);
      ctx.restore();
    }
  }, W, H);
  texCache.set(key, tex);
  return tex;
}
const matCache = new Map();
export function wallFaceMat(lengthM, heightM, themeAt, name) {
  const k = lengthM + '|' + heightM + '|' + name;
  if (!matCache.has(k)) { themeAt.key = name; matCache.set(k, toonMat(0xffffff, { map: wallTexture(lengthM, heightM, themeAt), rim: 0.12 })); }
  return matCache.get(k);
}
/** Box face materials order: +x, -x, +y, -y, +z, -z */
export function wallMaterials(w, h, d, faces, base) {
  const long = Math.max(w, d);
  const m = [base, base, base, base, base, base];
  const idx = { px: 0, nx: 1, pz: 4, nz: 5 };
  for (const [f, theme] of Object.entries(faces)) {
    const length = (f === 'px' || f === 'nx') ? d : w;
    const themeAt = typeof theme === 'function' ? theme : () => theme;
    m[idx[f]] = wallFaceMat(+length.toFixed(2), h, themeAt, (typeof theme === 'function' ? theme.id : theme) + f);
  }
  return m;
}

// ---- floors ---------------------------------------------------------------
export function yardTurfMat() {
  const tex = canvasTexture((ctx, w, h) => {
    ctx.fillStyle = '#8fe39b'; ctx.fillRect(0, 0, w, h);
    let s = 7; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 70; i++) { ctx.fillStyle = r() > 0.5 ? 'rgba(70,170,90,0.20)' : 'rgba(210,255,200,0.22)'; ctx.beginPath(); ctx.arc(r() * w, r() * h, 10 + r() * 22, 0, 7); ctx.fill(); }
    for (let i = 0; i < 520; i++) {
      const x = r() * w, y = r() * h, c = r() > 0.5 ? 'rgba(52,150,78,0.75)' : 'rgba(205,255,190,0.85)';
      ctx.strokeStyle = c; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
      for (let k = -1; k <= 1; k++) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + k * 4, y - 7 - r() * 5); ctx.stroke(); }
    }
    for (let i = 0; i < 14; i++) { ctx.fillStyle = ['#ffffff', '#ffe066', '#ffb3d1'][i % 3]; ctx.beginPath(); ctx.arc(r() * w, r() * h, 2.6, 0, 7); ctx.fill(); }
  }, 256, 256, { repeat: [4, 2.4] });
  return toonMat(0xffffff, { map: tex, rim: 0.1 });
}
export function ginghamMat() {
  const tex = canvasTexture((ctx, w, h) => {
    ctx.fillStyle = '#fff7f9'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,107,157,0.55)';
    for (let i = 0; i < 8; i += 2) { ctx.fillRect(i * w / 8, 0, w / 8, h); ctx.fillRect(0, i * h / 8, w, h / 8); }
  }, 128, 128, { repeat: [3, 3] });
  return toonMat(0xffffff, { map: tex });
}
export function vetFloorMat() {
  const tex = canvasTexture((ctx, w, h) => {
    ctx.fillStyle = '#e9fbf3'; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#a4ecc9'; ctx.lineWidth = 5;
    for (let i = 0; i <= w; i += 64) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }
    ctx.fillStyle = '#ffffff';
    for (let y = 0; y < h; y += 128) for (let x = 0; x < w; x += 128) ctx.fillRect(x + 8, y + 8, 48, 48);
  }, 256, 256);
  return toonMat(0xffffff, { map: tex });
}

// ---- decor ------------------------------------------------------------------
export function buildDecor(world) {
  const g = new THREE.Group(); g.name = 'Decor'; world.root.add(g);
  const mc = new Map();
  const M = (c, o) => { const k = c + JSON.stringify(o || {}); if (!mc.has(k)) mc.set(k, toonMat(c, o)); return mc.get(k); };
  const rbox = (w, h, d, c, x, y, z, parent = g, o) => { const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, Math.min(0.05, w / 3, h / 3, d / 3)), M(c, o)); m.position.set(x, y, z); m.castShadow = true; parent.add(m); return m; };
  const ball = (r, c, x, y, z, parent = g, o, sx = 1, sy = 1, sz = 1) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), M(c, o)); m.position.set(x, y, z); m.scale.set(sx, sy, sz); parent.add(m); return m; };
  const cap = (r, l, c, x, y, z, rx = 0, rz = 0, parent = g) => { const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, l, 5, 8), M(c)); m.position.set(x, y, z); m.rotation.set(rx, 0, rz); parent.add(m); return m; };

  // windows: curtains, valance, flower box, sunbeam
  const beamTex = glowTexture('rgba(255,236,170,0.9)', 'rgba(255,236,170,0)');
  const beamMat = new THREE.MeshBasicMaterial({ map: beamTex, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const flowers = [0xff6b9d, 0xffd43b, 0xffffff, 0xb197fc, 0xff922b];
  for (const wx of [-7.2, -2.2, 2.2, 7.2]) {
    const win = new THREE.Group(); win.position.set(wx, 0, -6.7); g.add(win);
    cap(0.025, 1.9, 0xa47148, 0, 2.85, 0, 0, Math.PI / 2, win);
    for (const s of [-1, 1]) {
      const cur = cap(0.17, 1.15, 0xff8fb1, s * 0.86, 1.95, 0.02, 0, s * 0.05, win); cur.scale.set(1, 1, 0.55);
      cap(0.045, 0.2, 0xffd43b, s * 0.66, 1.8, 0.1, 0, Math.PI / 2, win);
    }
    rbox(1.5, 0.24, 0.3, 0xc58b52, 0, 1.17, 0.06, win);
    for (let i = 0; i < 7; i++) { const fx = (i - 3) * 0.2; ball(0.085, 0x40c057, fx, 1.37, 0.06, win, undefined, 1, 0.9, 1); ball(0.07, flowers[(i + (wx > 0 ? 2 : 0)) % flowers.length], fx + (i % 2) * 0.05, 1.5 + (i % 3) * 0.04, 0.08, win); }
    const beam = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 3.4), beamMat);
    beam.position.set(wx, 1.2, -5.55); beam.rotation.x = -0.8; beam.renderOrder = 3; g.add(beam);
  }

  // fairy lights (twinkling)
  const bulbCols = [0xffe066, 0xff9ec5, 0xa5d8ff, 0xb2f2bb];
  const bulbMats = bulbCols.map(c => toonMat(c, { emissive: c, emissiveIntensity: 1.3, rim: 0 }));
  const wireMat = new THREE.LineBasicMaterial({ color: 0x7a5a48 });
  const swag = (x0, x1, y, z, sag = 0.22, axis = 'x') => {
    const n = Math.max(5, Math.round(Math.abs(x1 - x0) / 0.4)); const pts = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, a = x0 + (x1 - x0) * t, yy = y - Math.sin(t * Math.PI) * sag;
      pts.push(axis === 'x' ? new THREE.Vector3(a, yy, z) : new THREE.Vector3(z, yy, a));
      if (i > 0 && i < n) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), bulbMats[i % 4]); b.position.copy(pts[i]); b.position.y -= 0.06; g.add(b); }
    }
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), wireMat));
  };
  const bx = [-10.6, -7.2, -2.2, 2.2, 7.2, 10.6];
  for (let i = 0; i < bx.length - 1; i++) swag(bx[i], bx[i + 1], 3.1, -6.72, 0.3);
  for (const [a, b] of [[-10.7, -8.3], [-5.4, -2.0], [2.0, 5.4], [8.3, 10.7]]) swag(a, b, 2.28, -0.5, 0.2);
  swag(-6.3, 4.4, 2.22, -10.7, 0.2, 'z'); // left wall run (z axis)
  world.decorTick = (t, close) => { beamMat.opacity += ((close ? 0 : 0.2) - beamMat.opacity) * 0.1; bulbMats.forEach((m, i) => { m.emissiveIntensity = 1.0 + 0.55 * Math.sin(t * 2.1 + i * 1.7); }); };

  // spa: round mirror + towel stack basket ; vet: wall clock ; lobby: sconces
  const mirror = new THREE.Group(); mirror.position.set(-9.6, 1.65, -0.5); g.add(mirror);
  const mf = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.07, 10, 28), M(0xffd43b)); mirror.add(mf);
  const mg = new THREE.Mesh(new THREE.CircleGeometry(0.5, 24), M(0xcdf4ff, { emissive: 0x9fe4f5, emissiveIntensity: 0.55 })); mg.position.z = 0.01; mirror.add(mg);
  const sh = new THREE.Mesh(new THREE.CircleGeometry(0.13, 16), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 })); sh.position.set(-0.2, 0.22, 0.02); mirror.add(sh);
  for (const sx of [-2.5, 2.6]) {
    const s = new THREE.Group(); s.position.set(sx, 1.55, -0.5); g.add(s);
    rbox(0.24, 0.1, 0.12, 0xffd43b, 0, -0.18, 0.04, s);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 10), M(0xfff0b5, { emissive: 0xffd27a, emissiveIntensity: 1.4, rim: 0 })); lamp.scale.set(1, 1.2, 1); lamp.position.z = 0.08; s.add(lamp);
  }
  const clock = new THREE.Group(); clock.position.set(8.9, 2.1, -0.5); g.add(clock);
  clock.add(new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 8, 22), M(0xff6b6b)));
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.28, 22), M(0xffffff)); face.position.z = 0.01; clock.add(face);
  cap(0.015, 0.2, 0x3a2a3a, 0, 0.1, 0.03, 0, 0, clock); cap(0.015, 0.14, 0x3a2a3a, 0.07, 0, 0.03, 0, Math.PI / 2, clock);

  // yard life: flowers, stepping stones, mushrooms
  let s = 11; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const patches = [[1.0, -1.4], [3.2, -1.3], [9.9, -1.5], [10.2, -3.2], [0.8, -5.5], [1.2, -3.6], [6.0, -6.4], [9.6, -6.3]];
  for (const [px0, pz0] of patches) for (let i = 0; i < 7; i++) {
    const fx = px0 + (rnd() - 0.5) * 0.9, fz = pz0 + (rnd() - 0.5) * 0.6, c = flowers[(rnd() * flowers.length) | 0];
    const st = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.2, 5), M(0x2f9e44)); st.position.set(fx, 0.14, fz); g.add(st);
    for (let k = 0; k < 5; k++) ball(0.045, c, fx + Math.cos(k * 1.26) * 0.05, 0.26, fz + Math.sin(k * 1.26) * 0.05);
    ball(0.035, 0xffd43b, fx, 0.27, fz);
    ball(0.1, 0x51cf66, fx + 0.06, 0.1, fz, g, undefined, 1, 0.5, 1);
  }
  for (let i = 0; i < 6; i++) { const st = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, 0.05, 12), M(i % 2 ? 0xffe0c2 : 0xffd0e0)); st.position.set(2.3 + i * 0.28 + Math.sin(i) * 0.12, 0.1, -1.4 - i * 0.62); g.add(st); }
  for (const [mx, mz, ms] of [[0.9, -2.2, 1], [10.3, -4.3, 0.8]]) { const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04 * ms, 0.05 * ms, 0.14 * ms, 8), M(0xfff5e6)); stem.position.set(mx, 0.14, mz); g.add(stem); const capm = ball(0.12 * ms, 0xff5c7a, mx, 0.23 * ms + 0.08, mz, g, undefined, 1, 0.7, 1); for (let k = 0; k < 4; k++) ball(0.025 * ms, 0xffffff, mx + Math.cos(k * 1.6) * 0.07 * ms, 0.28 * ms + 0.1, mz + Math.sin(k * 1.6) * 0.07 * ms); }

  // kitchen: hanging herb pots by the window + cosy pendant glow on table
  for (let i = 0; i < 4; i++) { const px1 = -9.6 + i * 0.5; const p = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.16, 10), M(0xff9a6c)); p.position.set(px1, 2.5, -6.6); g.add(p); ball(0.13, 0x69db7c, px1, 2.68, -6.6, g, undefined, 1, 0.8, 1); }
  return g;
}

/** Tub dressing: foam, taps, candles, soap tray. group is world.spaTubGroup (already cleared). */
export function dressSpaTub(group, tier) {
  const white = toonMat(0xffffff, { emissive: 0xdff6ff, emissiveIntensity: 0.25 });
  const foam = [[0.0, 0.0, 0.5], [0.45, 0.2, 0.34], [-0.5, 0.15, 0.4], [0.2, -0.55, 0.3], [-0.3, -0.5, 0.28], [0.65, -0.35, 0.22], [-0.7, -0.2, 0.2], [0.1, 0.55, 0.26], [-0.1, 0.35, 0.3]];
  for (const [x, z, r] of foam) { const m = new THREE.Mesh(new THREE.SphereGeometry(r * 0.5, 12, 10), white); m.scale.y = 0.7; m.position.set(x, 0.62 + r * 0.12, z); group.add(m); }
  for (let i = 0; i < 9; i++) { const a = i * 0.7, m = new THREE.Mesh(new THREE.SphereGeometry(0.05 + (i % 3) * 0.02, 8, 6), toonMat(0xe9fbff, { transparent: true, opacity: 0.8, emissive: 0x9fe4f5, emissiveIntensity: 0.4 })); m.position.set(Math.cos(a) * (0.3 + (i % 4) * 0.15), 0.95 + (i % 5) * 0.16, Math.sin(a) * (0.3 + (i % 3) * 0.2)); m.userData.bub = i; group.add(m); }
  const chrome = toonMat(0xe9ecef, { rim: 0.6 });
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 10), chrome); pipe.position.set(0, 0.88, -1.16); group.add(pipe);
  const spout = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.045, 8, 14, Math.PI), chrome); spout.position.set(0, 1.13, -0.99); spout.rotation.set(0, Math.PI / 2, 0); spout.rotation.z = 0; group.add(spout);
  for (const s of [-1, 1]) { const k = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), toonMat(0xff6b9d)); k.position.set(s * 0.28, 0.8, -1.16); group.add(k); }
  // candles on the rim + soap tray
  for (const [x, z] of [[0.85, -0.78], [-0.9, -0.7], [1.0, 0.1]]) {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.16, 10), toonMat(0xfff0f6)); c.position.set(x, 0.74, z); group.add(c);
    const f = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), toonMat(0xffd27a, { emissive: 0xffb347, emissiveIntensity: 2.2, rim: 0 })); f.scale.y = 1.6; f.position.set(x, 0.88, z); group.add(f);
  }
  const mat = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.03, 28), toonMat(0xffc2dc)); mat.position.y = 0.1; mat.receiveShadow = true; group.add(mat);
  const mat2 = new THREE.Mesh(new THREE.TorusGeometry(1.42, 0.03, 6, 32), toonMat(0xffffff)); mat2.rotation.x = Math.PI / 2; mat2.position.y = 0.12; group.add(mat2);
}
