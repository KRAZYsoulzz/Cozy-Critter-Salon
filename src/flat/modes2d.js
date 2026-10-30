// Kitchen / vet / yard close-up modes for ActivityScene. Each mode: {label, pointer, update, draw}.
import { drawPet } from './pets2d.js';
import { strawberry, shapeS } from './art.js';
import { INK, el, ln, slab, heart, star } from './props.js';
const TAU = Math.PI * 2;
const dist = (a, b, x, y) => Math.hypot(a - x, b - y);

// ---------- food + tool props (each one drawn specifically) ----------
export function drawFood(c, id, x, y, s = 1, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  if (id === 'watermelon') { shapeS(c, [[-34, -14], [34, -14], [24, 18], [0, 30], [-24, 18]], { fill: '#ff5f6d', shade: '#e03e55', lw: 4, wob: .6, seed: 2, shadeDx: -5, shadeDy: -5 });
    ln(c, [[-30, 16], [0, 28], [30, 16]], '#4ea84a', 7); ln(c, [[-31, -13], [31, -13]], '#d9f2c4', 4);
    for (const [dx, dy] of [[-14, -2], [2, 4], [14, -3], [-4, 14]]) el(c, dx, dy, 2.6, 4, '#2b1a2e', null, 0, .5); }
  else if (id === 'carrot') { shapeS(c, [[-14, -22], [14, -22], [4, 30], [0, 34], [-4, 30]], { fill: '#ff9f2e', shade: '#e07a10', lw: 4, wob: .5, seed: 3, shadeDx: -4, shadeDy: -4 });
    for (const y of [-10, 2, 14]) ln(c, [[-8, y], [-1, y + 2]], '#c8650a', 3); for (const dx of [-10, 0, 10]) { shapeS(c, [[dx - 5, -22], [dx + 5, -22], [dx + dx * .5, -42]], { fill: '#6fcf5a', shade: '#47a840', lw: 3.5, wob: .4, seed: 5 + dx }); } }
  else if (id === 'shrimp') { c.scale(.82, .82); c.translate(0, -8); for (let i = 0; i < 5; i++) { const a = i * .5 - .2, x = Math.cos(a * 2) * 22 - 6 + i * 4, y = -22 + i * 11; el(c, x, y, 17 - i * 1.6, 11, i % 2 ? '#ff9a8d' : '#ff7e73', INK, 3.5, a); }
    shapeS(c, [[-4, 36], [-22, 52], [-6, 48], [4, 54], [10, 38]], { fill: '#ff7e73', shade: '#e0574d', lw: 3.5, wob: .4, seed: 8 }); el(c, 14, -30, 9, 9, '#ff9a8d', INK, 3.5); el(c, 18, -33, 2.6, 2.6, '#2b1a2e'); ln(c, [[18, -38], [34, -52]], INK, 2.5); ln(c, [[14, -39], [20, -56]], INK, 2.5); }
  else if (id === 'leaf') { ln(c, [[0, 30], [0, -34]], '#3f8f3a', 5); for (let i = 0; i < 3; i++) for (const sd of [-1, 1]) { const y = 16 - i * 17; shapeS(c, [[0, y], [sd * 26, y - 14], [sd * 34, y - 4], [sd * 22, y + 5]], { fill: i % 2 ? '#7ddc5e' : '#62c94c', shade: '#3fa63a', lw: 3.5, wob: .4, seed: i * 3 + sd + 9 }); ln(c, [[sd * 4, y - 1], [sd * 22, y - 7]], '#3a8f35', 2); } shapeS(c, [[-8, -34], [8, -34], [0, -52]], { fill: '#7ddc5e', shade: '#3fa63a', lw: 3.5, wob: .3, seed: 14 }); }
  else if (id === 'berry') strawberry(c, 0, 0, 1.15);
  else if (id === 'cookie') { el(c, 0, 0, 26, 26, '#e8b567', INK, 4); el(c, -4, -5, 20, 20, '#f2c97f'); for (const [dx, dy] of [[-10, -8], [8, -12], [12, 6], [-6, 10], [2, 0]]) el(c, dx, dy, 4, 3.4, '#6a3b24', null, 0, dx); }
  c.restore(); }
const FOODS = ['watermelon', 'carrot', 'shrimp', 'leaf', 'berry'], FAV = { capybara: 'watermelon', axolotl: 'shrimp', dikdik: 'leaf' };
const FOOD_NAME = { watermelon: 'watermelon', carrot: 'carrot', shrimp: 'shrimp', leaf: 'leafy sprig', berry: 'strawberry' };

export function drawTweezers(c, x, y, s = 1, rot = 0, open = .2) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); for (const sd of [-1, 1]) shapeS(c, [[sd * 3, 0], [sd * (7 + open * 12), -44], [sd * (4 + open * 12), -46], [sd * 0, -4]], { fill: '#cfd8e6', shade: '#98a6bd', lw: 3.5, wob: .2, seed: 20 + sd }); el(c, 0, 4, 6, 8, '#98a6bd', INK, 3.5); c.restore(); }
export function drawBandage(c, x, y, s = 1, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); slab(c, -26, -11, 52, 22, { fill: '#ffd0a8', shade: '#f0aa78', r: 9, lw: 3.5 }); slab(c, -9, -11, 18, 22, { fill: '#fff1e2', r: 2, lw: 2.5 }); for (const dx of [-17, 17]) for (const dy of [-4, 4]) el(c, dx, dy, 1.4, 1.4, '#d98a56'); c.restore(); }
export function drawThermo(c, x, y, s = 1, rot = 0, reading = null) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); slab(c, -44, -8, 88, 16, { fill: '#f4f8ff', shade: '#c9d6ec', r: 8, lw: 3.5 }); slab(c, -44, -8, 26, 16, { fill: '#7fd0ff', shade: '#4fa8e0', r: 8, lw: 3.5 }); for (let i = 0; i < 4; i++) ln(c, [[-6 + i * 11, -8], [-6 + i * 11, i % 2 ? -3 : -1]], INK, 2); el(c, 40, 0, 4, 4, '#ff6b81', INK, 2); c.restore(); }
export function drawStetho(c, x, y, s = 1, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.beginPath(); c.moveTo(-18, -30); c.bezierCurveTo(-30, 10, 30, 10, 18, -30); c.strokeStyle = INK; c.lineWidth = 9; c.lineCap = 'round'; c.stroke(); c.strokeStyle = '#6a7fa0'; c.lineWidth = 4.5; c.stroke(); ln(c, [[0, 16], [0, 34]], INK, 9); ln(c, [[0, 16], [0, 34]], '#6a7fa0', 4.5); el(c, 0, 40, 16, 16, '#d0d8e8', INK, 4.5); el(c, 0, 40, 8, 8, '#8fa2c4', INK, 2.5); for (const sd of [-1, 1]) el(c, sd * 18, -33, 5, 5, '#ffd93d', INK, 3); c.restore(); }
export function drawPill(c, x, y, s = 1, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); slab(c, -20, -10, 40, 20, { fill: '#ffd93d', shade: '#f0b020', r: 10, lw: 4 }); c.save(); c.beginPath(); c.roundRect(-20, -10, 20, 20, [10, 0, 0, 10]); c.fillStyle = '#ff7aa8'; c.fill(); c.restore(); slab(c, -20, -10, 40, 20, { fill: null, r: 10, lw: 4 }); el(c, -9, -4, 3, 2, 'rgba(255,255,255,.7)'); c.restore(); }
export function drawTool(c, id, x, y, s, rot = 0) { if (id === 'tweezers') drawTweezers(c, x, y + 20, s, rot); else if (id === 'bandage') drawBandage(c, x, y, s * 1.2, rot); else if (id === 'thermo') drawThermo(c, x, y, s * .8, rot); else if (id === 'stetho') drawStetho(c, x, y - 8, s * .9, rot); else if (id === 'pill') drawPill(c, x, y, s * 1.3, rot); else drawFood(c, id, x, y, s * .9, rot); }

function tray(c, sc, items, cur, doneN, size = .9) {
  items.forEach((id, i) => { const tx = 500 + (i - (items.length - 1) / 2) * 120, isCur = id === cur, dn = i < doneN; c.save(); c.translate(tx, 500); el(c, 0, 0, 46, 46, dn ? '#b9f0b0' : isCur ? '#fffdf4' : 'rgba(255,255,255,.4)', INK, isCur ? 6 : 4); if (isCur) { c.strokeStyle = '#ffd93d'; c.lineWidth = 4; c.beginPath(); c.arc(0, 0, 54 + Math.sin(sc.t * 6) * 3, 0, TAU); c.stroke(); } c.globalAlpha = dn ? .45 : 1; drawTool(c, id, 0, 0, size); c.globalAlpha = 1; if (dn) ln(c, [[-14, 0], [-4, 12], [18, -12]], '#2f9a3f', 7); c.restore(); }); }
function petAt(c, sc, a, x, y, s, expr, extra) { const ps = sc.w.save.state.pets[a.pid]; c.save(); c.translate(x, y); c.scale(s * (extra?.sx || 1), s * (extra?.sy || 1)); drawPet(c, a.pid, sc.t, expr, (Math.sin(sc.t * 1.3) > .96) ? 0 : 1, ps.equipped, ps.stats); c.restore(); }
function counter(c, label) { slab(c, 40, 462, 920, 100, { fill: '#c98a54', shade: '#a86a3a', r: 20, lw: 6 }); for (let i = 0; i < 7; i++) ln(c, [[90 + i * 130, 474], [100 + i * 130, 556]], 'rgba(120,70,30,.35)', 3); slab(c, 40, 452, 920, 22, { fill: '#e8b078', shade: '#c98a54', r: 11, lw: 5 }); }

// ---------------- KITCHEN ----------------
export function kitchenMode(sc, a) {
  const fav = FAV[a.pid]; a.fed = 0; a.need = 3; a.food = null; a.chew = 0; a.eaten = []; a.tmsg = 0; a.favHit = false;
  const slot = i => ({ x: 500 + (i - 2) * 140, y: 500 });
  sc.say('kitchen_intro', 'Time to eat! Drag food to the mouth!');
  return { label: `Feed me! I really love ${FOOD_NAME[fav]}!`,
    pointer(k, pt) {
      if (k === 'down') FOODS.forEach((id, i) => { const s = slot(i); if (!a.eaten.includes(id) && dist(pt.x, pt.y, s.x, s.y) < 56) a.food = { id, x: pt.x, y: pt.y }; });
      else if (k === 'move' && a.food) { a.food.x = pt.x; a.food.y = pt.y; }
      else if (k === 'up' && a.food) { const f = a.food; a.food = null; if (Math.abs(f.x - 500) < 130 && f.y > 150 && f.y < 340) this.eat(f.id); }
    },
    eat(id) { a.fed++; a.chew = 1.1; a.eaten.push(id); const st = sc.w.save.state.pets[a.pid].stats; const isFav = id === fav; st.hunger = Math.min(100, st.hunger + (isFav ? 35 : 22)); st.love = Math.min(100, st.love + (isFav ? 8 : 3));
      sc.audio.sound?.playMarimbaNote?.(); for (let i = 0; i < (isFav ? 9 : 4); i++) sc.parts.push({ type: 'heart', x: 500 + (Math.random() - .5) * 120, y: 230, vx: (Math.random() - .5) * 60, vy: -80 - Math.random() * 60, life: 1.3, r: 9 + Math.random() * 6 });
      if (isFav && !a.favHit) { a.favHit = true; sc.say('kitchen_fav', 'My favorite!!'); }
      if (a.fed >= a.need) setTimeout(() => sc.finishMode(a, { coins: 12 + (a.favHit ? 6 : 0), text: 'Tummy full!  +' + (12 + (a.favHit ? 6 : 0)), voice: 'kitchen_complete', stats: { hunger: 100 } }), 900); },
    update(dt) { a.chew = Math.max(0, a.chew - dt); },
    draw(c) { const ch = a.chew > 0 ? Math.sin(sc.t * 22) * .05 : 0; petAt(c, sc, a, 500, 470, .8, a.chew > 0 || a.done ? 'happy' : 'idle', { sy: 1 + ch, sx: 1 - ch * .6 });
      counter(c); FOODS.forEach((id, i) => { const s = slot(i); if (a.eaten.includes(id)) return; el(c, s.x, s.y + 12, 46, 14, 'rgba(60,30,10,.25)'); drawFood(c, id, s.x, s.y - 4, 1.05); if (id === fav) { star(c, s.x + 32, s.y - 30, 11 + Math.sin(sc.t * 5) * 2, '#fff6a0'); } });
      if (a.food) { drawFood(c, a.food.id, a.food.x, a.food.y, 1.3, Math.sin(sc.t * 10) * .12); }
      // progress hearts
      for (let i = 0; i < a.need; i++) { c.globalAlpha = i < a.fed ? 1 : .35; heart(c, 440 + i * 60, 108, 16, i < a.fed ? '#ff5c8a' : '#fff'); c.globalAlpha = 1; } }
  };
}

// ---------------- VET ----------------
const VET_STEPS = [
  { id: 'tweezers', type: 'drag', at: [-62, -150], label: 'Pull out the thorn with the tweezers!', voice: 'vet_step_tweezers' },
  { id: 'bandage', type: 'tap', at: [58, -200], label: 'Put a bandage on the scrape!', voice: 'vet_step_bandage' },
  { id: 'thermo', type: 'hold', at: [0, -245], label: 'Hold the thermometer to check the temperature!', voice: 'vet_step_thermometer' },
  { id: 'stetho', type: 'hold', at: [0, -130], label: 'Listen to the heartbeat with the stethoscope!', voice: 'vet_step_stethoscope' },
  { id: 'pill', type: 'drop', at: [0, -235], label: 'Give the vitamin \u2014 drop it in the mouth!', voice: 'vet_step_vitamin' }];
export function vetMode(sc, a) {
  a.vstep = 0; a.vprog = 0; a.pill = null; a.thorn = true; a.band = false; a.reading = null; a.beat = 0; a.reactT = 0; let ptr = null;
  const S = () => VET_STEPS[a.vstep], P = () => { const q = S().at; return { x: 500 + q[0] * .8, y: 488 + q[1] * .8 }; };
  const adv = () => { a.vprog = 0; a.vstep++; sc.audio.sound?.playMarimbaNote?.(); if (a.vstep >= VET_STEPS.length) return setTimeout(() => sc.finishMode(a, { coins: 20, text: 'All better!  +20', voice: 'vet_complete', stats: { health: 100 }, cure: true }), 700); sc.say(S().voice, S().label); };
  sc.say(VET_STEPS[0].voice, VET_STEPS[0].label);
  const m = {
    get label() { return a.vstep < VET_STEPS.length ? S().label : ''; },
    pointer(k, pt) {
      if (a.vstep >= VET_STEPS.length) return; const s = S(), p = P();
      if (k === 'down') { ptr = { ...pt }; if (s.type === 'drop') { a.pill = { x: pt.x, y: pt.y }; } if (s.type === 'tap' && dist(pt.x, pt.y, p.x, p.y) < 70) { a.band = true; a.reactT = .6; adv(); } }
      else if (k === 'move' && ptr) { const d = dist(pt.x, pt.y, ptr.x, ptr.y); ptr = { ...pt }; if (a.pill) { a.pill.x = pt.x; a.pill.y = pt.y; } if (s.type === 'drag' && dist(pt.x, pt.y, p.x, p.y) < 70) { a.vprog += d; a.reactT = .2; if (a.vprog > 200) { a.thorn = false; sc.spark(p.x, p.y); sc.spark(p.x, p.y); adv(); } } }
      else if (k === 'up') { if (s.type === 'drop' && a.pill) { if (dist(a.pill.x, a.pill.y, p.x, p.y) < 70) { a.pill = null; a.reactT = 1; adv(); } else a.pill = null; } ptr = null; }
    },
    update(dt) { if (a.vstep >= VET_STEPS.length) return; a.reactT = Math.max(0, a.reactT - dt); const s = S(), p = P();
      if (s.type === 'hold' && ptr && dist(ptr.x, ptr.y, p.x, p.y) < 70) { a.vprog += dt; a.beat += dt; if (s.id === 'stetho' && Math.sin(a.beat * 9) > .95) sc.parts.push({ type: 'heart', x: p.x + (Math.random() - .5) * 20, y: p.y, vx: 0, vy: -50, life: .8, r: 9 }); if (s.id === 'thermo') a.reading = (96 + Math.min(1, a.vprog / 1.6) * 2.6).toFixed(1); if (a.vprog >= (s.id === 'thermo' ? 1.7 : 1.9)) { adv(); } } else if (s.type === 'hold') a.vprog = Math.max(0, a.vprog - dt * .5); },
    draw(c) { petAt(c, sc, a, 500, 488, .8, a.reactT > 0 || a.done ? 'happy' : a.vstep < 3 ? 'sad' : 'idle');
      if (a.vstep < VET_STEPS.length) { const s = S(), p = P(), pulse = 1 + Math.sin(sc.t * 6) * .12; if (!(s.id === 'pill' && a.pill && false)) { c.strokeStyle = 'rgba(255,255,255,.9)'; c.setLineDash([10, 8]); c.lineWidth = 4; c.beginPath(); c.arc(p.x, p.y, 40 * pulse, 0, TAU); c.stroke(); c.setLineDash([]); } }
      if (a.thorn) { const p = { x: 500 + VET_STEPS[0].at[0] * .8, y: 488 + VET_STEPS[0].at[1] * .8 }; shapeS(c, [[p.x - 5, p.y + 4], [p.x + 5, p.y + 4], [p.x + 2, p.y - 28]], { fill: '#8bc34a', shade: '#5e9a28', lw: 3, wob: .2, seed: 33 }); el(c, p.x, p.y + 5, 9, 5, '#ff7a85', INK, 2.5); }
      if (a.vstep <= 1 && a.vstep > 0 || a.band) { /* scrape under bandage */ }
      if (!a.band) { const p = { x: 500 + VET_STEPS[1].at[0] * .8, y: 488 + VET_STEPS[1].at[1] * .8 }; ln(c, [[p.x - 14, p.y - 4], [p.x + 12, p.y + 6]], '#e0485a', 5); ln(c, [[p.x - 6, p.y + 8], [p.x + 8, p.y - 8]], '#e0485a', 4); } else { const p = { x: 500 + VET_STEPS[1].at[0] * .8, y: 488 + VET_STEPS[1].at[1] * .8 }; drawBandage(c, p.x, p.y, 1.1, -.4); }
      if (a.reading && a.vstep <= 2) { const p = P(); slab(c, p.x + 50, p.y - 70, 96, 44, { fill: '#e8ffe0', r: 14, lw: 4 }); c.font = '700 26px Fredoka, system-ui'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#2a7a3a'; c.fillText(a.reading + '\u00b0', p.x + 98, p.y - 47); }
      if (a.pill) drawPill(c, a.pill.x, a.pill.y, 1.4, Math.sin(sc.t * 8) * .2);
      // tool tray with current tool highlighted
      const ids = VET_STEPS.map(s => s.id); tray(c, sc, ids, a.vstep < 5 ? ids[a.vstep] : null, a.vstep, .85);
      if (ptr && !a.pill && a.vstep < 5 && VET_STEPS[a.vstep].type !== 'tap') drawTool(c, ids[a.vstep], ptr.x + 22, ptr.y - 10, 1.1, -.5); }
  };
  return m;
}

// ---------------- YARD: catch the treats ----------------
export function yardMode(sc, a) {
  a.px = 500; a.tx = 500; a.treats = []; a.spawned = 0; a.caught = 0; a.total = 12; a.spawnT = .6; a.hopT = 0; a.missT = 0; let down = false;
  sc.say('yard_minigame_start', 'Catch the treats!');
  return { label: 'Slide to catch the falling treats!',
    pointer(k, pt) { if (k === 'down') { down = true; a.tx = pt.x; } else if (k === 'move' && down) a.tx = pt.x; else if (k === 'up') down = false; },
    update(dt) { if (a.done) return; a.px += (a.tx - a.px) * Math.min(1, dt * 10); a.px = Math.max(210, Math.min(790, a.px)); a.hopT = Math.max(0, a.hopT - dt);
      a.spawnT -= dt; if (a.spawnT <= 0 && a.spawned < a.total) { a.spawned++; a.spawnT = .85 + Math.random() * .4; a.treats.push({ id: FOODS[Math.floor(Math.random() * 5)], x: 200 + Math.random() * 600, y: -30, vy: 190 + a.spawned * 6, rot: 0, sp: (Math.random() - .5) * 4 }); }
      for (const t of a.treats) { t.y += t.vy * dt; t.rot += t.sp * dt; if (Math.abs(t.x - a.px) < 80 && t.y > 330 && t.y < 470 && !t.got) { t.got = true; a.caught++; a.hopT = .35; sc.audio.sound?.playMarimbaNote?.(); for (let i = 0; i < 4; i++) sc.spark(t.x, t.y); } }
      a.treats = a.treats.filter(t => !t.got && t.y < 580);
      if (a.spawned >= a.total && !a.treats.length && !a.finishing) { a.finishing = true; const co = 4 + a.caught * 2; sc.finishMode(a, { coins: co, text: `Caught ${a.caught} of ${a.total}!  +${co}`, voice: 'yard_minigame_complete', stats: { love: 10 }, energy: -8 }); } },
    draw(c) { 
      for (const t of a.treats) { el(c, t.x, t.y + 34, 20, 6, 'rgba(0,0,0,.18)'); drawFood(c, t.id, t.x, t.y, 1.1, t.rot); }
      const hop = a.hopT > 0 ? Math.sin(a.hopT / .35 * Math.PI) * 30 : 0; petAt(c, sc, a, a.px, 500 - hop, .56, a.hopT > 0 || a.done ? 'happy' : 'idle');
      slab(c, 420, 18, 160, 46, { fill: '#fff8e6', r: 23, lw: 4 }); c.font = '700 26px Fredoka, system-ui'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = INK; c.fillText(`${a.caught} / ${a.total}`, 500, 42); }
  };
}
export const MODES = { kitchen: kitchenMode, vet: vetMode, yard: yardMode };

