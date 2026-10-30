// Close-up activity scenes on a 1000x540 stage over a dimmed room backdrop. Spa is first; others register the same way.
import { drawRoomN, RW } from './rooms.js';
import { drawPet } from './pets2d.js';
import { sponge, shapeS } from './art.js';
import { INK, el, ln, slab, towels, brush, comb, hairdryer, heart, star } from './props.js';
const TAU = Math.PI * 2, SW = 1000, SH = 540;
export const ROOM_OF = { spa: 1, kitchen: 0, vet: 3, yard: 4, lobby: 2 };

export function drawShower(c, x, y, s, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  slab(c, -5, -4, 10, 52, { fill: '#d0d8e4', shade: '#9aa6ba', r: 4, lw: 3.5 });
  shapeS(c, [[-34, -8], [-26, -30], [0, -38], [26, -30], [34, -8], [22, 4], [-22, 4]], { fill: '#8fd4ff', shade: '#5fb1ee', lw: 4.5, wob: .7, seed: 4, shadeDx: -5, shadeDy: -6 });
  for (let i = -2; i <= 2; i++) el(c, i * 11, -14, 2.4, 2.4, '#2a7ab8'); c.restore(); }
export function drawToolIcon(c, id, x, y, s, rot = 0) {
  if (id === 'sponge') { c.save(); c.translate(x, y); c.rotate(rot); sponge(c, 0, 0, s * 1.4); c.restore(); }
  else if (id === 'shower') drawShower(c, x, y + 8, s * 1.1, rot);
  else if (id === 'towel') { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s * 1.2, s * 1.2); slab(c, -34, -20, 68, 40, { fill: '#ffe27a', shade: '#f0c040', r: 8, lw: 4 }); for (const dx of [-18, 0, 18]) ln(c, [[dx, -14], [dx, 14]], '#ff8fb7', 5); c.restore(); }
  else if (id === 'brush') brush(c, x, y, s * 1.1, rot); else if (id === 'comb') comb(c, x, y, s * 1.1, rot); else if (id === 'dryer') hairdryer(c, x, y, s * .9, rot);
}
const pill = (c, x, y, w, h, fill = '#fff8e6') => slab(c, x - w / 2, y - h / 2, w, h, { fill, r: h / 2, lw: 4 });
function text(c, str, x, y, size = 26, col = INK) { c.font = `700 ${size}px Fredoka, system-ui, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = col; c.fillText(str, x, y); }

const SPOTS = [[-70, -110, 18], [64, -170, 16], [-40, -200, 14], [50, -90, 15], [-96, -150, 12], [20, -130, 16]];
const SPA_STEPS = [
  { id: 'scrub', tool: 'sponge', label: 'Scrub the muddy spots with the sponge!', voice: 'spa_step_soap' },
  { id: 'rinse', tool: 'shower', label: 'Rinse off the bubbles with the shower!', voice: 'spa_step_rinse' },
  { id: 'dry', tool: 'towel', label: 'Rub with the towel to dry!', voice: 'spa_step_dry' },
  { id: 'brush', tool: 'brush', label: 'Brush the fur until it sparkles!', voice: 'spa_step_teeth' }
];

export class ActivityScene {
  constructor(world, pets, audio) {
    this.w = world; this.pets = pets; this.audio = audio; this.active = null; this.parts = []; this.t = 0; this.ptr = null; this.banner = 0;
    world.e.layers.push((c, e) => this.draw(c, e)); world.e.updaters.push(dt => this.update(dt)); world.scene = this;
  }
  map(p) { const e = this.w.e, S = Math.min(e.W / SW, e.H / SH); return { x: (p.sx - (e.W - SW * S) / 2) / S, y: (p.sy - (e.H - SH * S) / 2) / S, S }; }
  enter(kind) {
    const pid = this.w.save.state.activePet, st = this.w.save.state.pets[pid];
    this.active = { kind, pid, steps: kind === 'spa' ? SPA_STEPS : [], step: 0, done: false, spots: SPOTS.map(s => ({ x: s[0], y: s[1], r: s[2], hp: 1 })), foam: [], wet: 0, shine: 0, stroke: 0, rubbed: 0, reaction: 0, t0: this.t, exitBtn: false };
    this.active.tool = this.active.steps[0].tool; this.say(this.active.steps[0].voice, this.active.steps[0].label);
    document.getElementById('prompt')?.classList.remove('on'); this.audio.sound?.playBubblePop?.(); this.w.av.has = false; this.w.holding = null;
  }
  exit() { this.active = null; this.ptr = null; document.getElementById('prompt')?.classList.remove('on'); }
  say(id, text) { try { this.audio.voice?.speak(id, text); } catch (e) { /* voice optional */ } }
  pointer(kind, p) {
    const a = this.active; if (!a) return; const m = this.map(p), pt = { x: m.x, y: m.y };
    if (kind === 'down') {
      if (Math.hypot(pt.x - 56, pt.y - 48) < 40) { this.exit(); return; }
      if (a.done) { if (Math.abs(pt.x - 500) < 150 && Math.abs(pt.y - 380) < 40) this.exit(); return; }
      a.steps.forEach((s, i) => { const tx = 500 + (i - (a.steps.length - 1) / 2) * 120; if (Math.hypot(pt.x - tx, pt.y - 500) < 52 && i <= a.step) a.tool = s.tool; });
      this.ptr = { ...pt, down: true, lx: pt.x, ly: pt.y }; return;
    }
    if (!this.ptr) return;
    if (kind === 'move') { const d = Math.hypot(pt.x - this.ptr.x, pt.y - this.ptr.y); this.ptr.lx = this.ptr.x; this.ptr.ly = this.ptr.y; this.ptr.x = pt.x; this.ptr.y = pt.y; if (d > 0 && !a.done) this.work(pt, d); }
    if (kind === 'up') this.ptr = null;
  }
  petPt(pt) { return { x: (pt.x - 500) / .8, y: (pt.y - 488) / .8 }; }
  work(pt, d) {
    const a = this.active, s = a.steps[a.step]; if (!s || a.tool !== s.tool) return; const q = this.petPt(pt);
    const onPet = Math.abs(q.x) < 150 && q.y < 0 && q.y > -380; if (!onPet) return; a.reaction = .25;
    if (s.id === 'scrub') { for (const sp of a.spots) if (sp.hp > 0 && Math.hypot(q.x - sp.x, q.y - sp.y) < 55) { sp.hp -= d * .0028; this.sud(pt.x, pt.y); if (sp.hp <= 0) a.foam.push({ x: sp.x, y: sp.y, r: sp.r * 2.1, a: 1 }); }
      if (Math.random() < .3) this.audio.sound?.playScrub?.(); if (a.spots.every(sp => sp.hp <= 0)) this.next(); }
    else if (s.id === 'rinse') { this.drops(pt.x, pt.y + 20, 3); for (const f of a.foam) if (Math.hypot(q.x - f.x, q.y - f.y) < 70) f.a -= d * .0022; if (Math.random() < .2) this.audio.sound?.playSplash?.(); if (a.foam.every(f => f.a <= 0)) { a.wet = 1; this.next(); } }
    else if (s.id === 'dry') { a.wet = Math.max(0, a.wet - d * .0006); if (Math.random() < .5) this.drops(pt.x, pt.y, 1); if (a.wet <= 0) this.next(); }
    else if (s.id === 'brush') { a.stroke += d; a.shine = Math.min(1, a.stroke / 2800); if (Math.random() < .4) this.spark(pt.x, pt.y); if (a.shine >= 1) this.finish(); }
  }
  next() { const a = this.active; a.step++; this.audio.sound?.playMarimbaNote?.(); if (a.step >= a.steps.length) return this.finish(); a.tool = a.steps[a.step].tool; this.say(a.steps[a.step].voice, a.steps[a.step].label); }
  finish() {
    const a = this.active, sv = this.w.save, st = sv.state.pets[a.pid]; a.done = true; a.step = a.steps.length;
    st.stats.cleanliness = 100; st.stats.love = Math.min(100, st.stats.love + 8); st.dirtSpots = []; st.teethSparkly = true;
    const before = sv.state.routinesCompleted || 0; sv.addReward(15, 1); if ((sv.state.routinesCompleted || 0) === before) sv.state.routinesCompleted = before + 1; sv.save();
    document.getElementById('coin-n') && (document.getElementById('coin-n').textContent = sv.state.coins);
    for (let i = 0; i < 60; i++) this.parts.push({ type: 'conf', x: 500 + (Math.random() - .5) * 500, y: 40, vx: (Math.random() - .5) * 120, vy: 60 + Math.random() * 160, life: 3, c: ['#ff5c8a', '#ffd93d', '#6ec3ff', '#7ed957', '#b589f7'][i % 5], rot: Math.random() * 6 });
    this.audio.sound?.playFanfare?.(); this.say('spa_complete', 'All sparkly clean!');
  }
  sud(x, y) { if (Math.random() < .6) this.parts.push({ type: 'bub', x: x + (Math.random() - .5) * 40, y: y + (Math.random() - .5) * 30, vx: (Math.random() - .5) * 20, vy: -30 - Math.random() * 30, life: 1.2, r: 6 + Math.random() * 10 }); }
  drops(x, y, n) { for (let i = 0; i < n; i++) this.parts.push({ type: 'drop', x: x + (Math.random() - .5) * 50, y, vx: (Math.random() - .5) * 30, vy: 200 + Math.random() * 100, life: .7 }); }
  spark(x, y) { this.parts.push({ type: 'star', x: x + (Math.random() - .5) * 60, y: y + (Math.random() - .5) * 40, vx: (Math.random() - .5) * 40, vy: -40, life: .9, r: 8 + Math.random() * 8 }); }
  update(dt) { this.t += dt; if (!this.active) return; const a = this.active; a.reaction = Math.max(0, a.reaction - dt);
    for (const p of this.parts) { p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; if (p.type === 'conf') { p.vy += 40 * dt; p.rot += dt * 6; } }
    this.parts = this.parts.filter(p => p.life > 0); }
  draw(c, e) {
    const a = this.active; if (!a) return; const S = Math.min(e.W / SW, e.H / SH), ox = (e.W - SW * S) / 2, oy = (e.H - SH * S) / 2, dpr = e.dpr;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    // dimmed room backdrop, scaled to cover the screen
    c.save(); const kb = Math.max(e.W / RW, e.H / SH); c.translate((e.W - RW * kb) / 2, (e.H - SH * kb) / 2); c.scale(kb, kb); c.translate(-ROOM_OF[a.kind] * RW, 0); drawRoomN(c, ROOM_OF[a.kind], e.time); c.restore();
    c.fillStyle = 'rgba(30,10,50,.58)'; c.fillRect(0, 0, e.W, e.H);
    const vg = c.createRadialGradient(e.W / 2, e.H / 2, Math.min(e.W, e.H) * .3, e.W / 2, e.H / 2, Math.max(e.W, e.H) * .72); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(20,0,30,.6)'); c.fillStyle = vg; c.fillRect(0, 0, e.W, e.H);
    c.translate(ox, oy); c.scale(S, S);
    const pet = this.pets.pets[a.pid], ps = this.w.save.state.pets[a.pid];
    // pet + task visuals
    c.save(); c.translate(500, 488); c.scale(.8, .8);
    const expr = a.done ? 'happy' : a.reaction > 0 ? 'happy' : a.step === 0 ? 'sad' : 'idle';
    drawPet(c, a.pid, this.t, expr, 1, ps.equipped, { ...ps.stats, cleanliness: 100 });
    if (a.kind === 'spa') {
      if (a.step <= 0 || (a.step === 1 && false)) { }
      for (const sp of a.spots) if (sp.hp > 0) { el(c, sp.x, sp.y, sp.r * 1.4, sp.r * 1.1, '#8a5a2a', INK, 3); el(c, sp.x - sp.r * .4, sp.y - sp.r * .4, sp.r * .3, sp.r * .22, 'rgba(255,255,255,.35)'); c.globalAlpha = sp.hp; el(c, sp.x + 3, sp.y + 3, sp.r * .8, sp.r * .6, '#6e4420'); c.globalAlpha = 1; }
      for (const f of a.foam) if (f.a > 0) { c.globalAlpha = Math.min(1, f.a); for (const [dx, dy, k] of [[0, 0, 1], [-.8, .3, .7], [.8, .2, .75], [.1, -.7, .65]]) el(c, f.x + dx * f.r * .6, f.y + dy * f.r * .5, f.r * .5 * k, f.r * .5 * k, '#fff', INK, 3); c.globalAlpha = 1; }
      if (a.wet > 0) for (let i = 0; i < 9; i++) { const x = ((i * 53) % 220) - 110, y = -60 - ((i * 77) % 300), dy = (this.t * 30 + i * 20) % 26; el(c, x, y + dy, 5, 7, 'rgba(120,200,255,.85)', null, 0); }
      if (a.shine > 0) for (let i = 0; i < Math.floor(a.shine * 6); i++) { const x = ((i * 67) % 240) - 120, y = -80 - ((i * 91) % 280); star(c, x, y, 9 + Math.sin(this.t * 6 + i) * 3, '#fff6a0'); }
    }
    c.restore();
    // tub front covers pet's feet
    if (a.kind === 'spa') { shapeS(c, [[130, 470], [870, 470], [850, 548], [150, 548]], { fill: '#fff6f8', shade: '#f1c9dc', lw: 6, wob: 2, seed: 6, shadeDx: -8, shadeDy: -8 }); slab(c, 120, 452, 760, 26, { fill: '#ff9fc7', shade: '#e0608f', r: 13, lw: 5 }); for (const [x, y, r] of [[170, 450, 26], [240, 440, 22], [330, 452, 20], [680, 448, 24], [770, 440, 28], [840, 454, 20], [600, 456, 16]]) { el(c, x, y, r, r, '#fff', INK, 3.5); el(c, x - r * .3, y - r * .3, r * .2, r * .28, 'rgba(160,210,255,.9)', null, 0, .5); } }
    // particles
    for (const p of this.parts) { c.globalAlpha = Math.min(1, p.life * 1.5);
      if (p.type === 'bub') { el(c, p.x, p.y, p.r, p.r, 'rgba(255,255,255,.9)', INK, 2.5); el(c, p.x - p.r * .3, p.y - p.r * .3, p.r * .25, p.r * .3, 'rgba(160,210,255,.9)'); }
      else if (p.type === 'drop') el(c, p.x, p.y, 3.4, 6, 'rgba(120,200,255,.95)');
      else if (p.type === 'star') star(c, p.x, p.y, p.r, '#fff6a0');
      else { c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.fillStyle = p.c; c.fillRect(-6, -4, 12, 8); c.restore(); } c.globalAlpha = 1; }
    // HUD: exit, prompt, progress, tool tray
    pill(c, 56, 48, 64, 64, '#ff8fb7'); ln(c, [[42, 34], [70, 62]], '#fff', 7); ln(c, [[70, 34], [42, 62]], '#fff', 7);
    const s = a.steps[a.step];
    if (!a.done && s) { pill(c, 500, 44, Math.min(900, 40 + s.label.length * 15), 54); text(c, s.label, 500, 45, 26); }
    a.steps.forEach((st, i) => { const tx = 500 + (i - (a.steps.length - 1) / 2) * 120, cur = i === a.step && !a.done, done = i < a.step || a.done;
      c.save(); c.translate(tx, 500); el(c, 0, 0, 46, 46, done ? '#b9f0b0' : cur ? '#fffdf4' : 'rgba(255,255,255,.35)', INK, cur ? 6 : 4); if (cur) { c.strokeStyle = '#ffd93d'; c.lineWidth = 4; c.beginPath(); c.arc(0, 0, 54 + Math.sin(this.t * 6) * 3, 0, TAU); c.stroke(); }
      c.globalAlpha = done ? .45 : 1; drawToolIcon(c, st.tool, 0, 0, .9); c.globalAlpha = 1; if (done) { ln(c, [[-14, 0], [-4, 12], [18, -12]], '#2f9a3f', 7); } c.restore(); });
    if (a.done) { pill(c, 500, 150, 520, 80, '#fffdf4'); text(c, 'All sparkly clean!  +15', 500, 150, 38, '#ff5c8a'); pill(c, 500, 380, 300, 70, '#7ed957'); text(c, 'Yay!', 500, 380, 34, '#fff'); }
    // held tool at pointer
    if (this.ptr && !a.done) drawToolIcon(c, a.tool, this.ptr.x + 18, this.ptr.y - 14, 1.1, -.5 + Math.sin(this.t * 14) * .12);
  }
}

