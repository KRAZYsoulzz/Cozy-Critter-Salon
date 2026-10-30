// Pets: dik-dik art, cosmetics for every shop item, and the follower/home-room behaviour with need bubbles.
import { shapeS, eye, drawCapybara, drawAxolotl, drawBubble, strawberry, sponge } from './art.js';
import { INK, el, ln, slab, shadow, heart, star , drawHand } from './props.js';
import { RW, STATIONS, WALK_Y0, WALK_Y1 } from './rooms.js';

const TAU = Math.PI * 2;
function mouthSmall(c, x, y, s, expr) { c.save(); c.translate(x, y); c.strokeStyle = INK; c.lineWidth = s * .12; c.lineCap = 'round';
  if (expr === 'happy') { c.beginPath(); c.moveTo(-s * .5, 0); c.quadraticCurveTo(0, s * .7, s * .5, 0); c.closePath(); c.fillStyle = '#7a1f2b'; c.fill(); c.stroke(); } else if (expr === 'sad') { c.beginPath(); c.moveTo(-s * .4, s * .3); c.quadraticCurveTo(0, -s * .2, s * .4, s * .3); c.stroke(); } else { c.beginPath(); c.moveTo(-s * .4, 0); c.quadraticCurveTo(0, s * .4, s * .4, 0); c.stroke(); } c.restore(); }

/** Tiny dik-dik: pocket antelope, giant eyes, twitchy ears, little horns, long snout, spindly legs. */
export function drawDikdik(c, t = 0, expr = 'idle', blinkT = 0) {
  const b = Math.sin(t * 2.6), hop = expr === 'happy' ? Math.abs(Math.sin(t * 5)) * 24 : expr === 'wow' ? 12 : 0, tw = Math.sin(t * 7) * (expr === 'idle' ? .06 : .16);
  c.save(); c.translate(0, -hop); c.scale(1 - b * .014, 1 + b * .026);
  const FUR = '#d8a35c', FUR2 = '#b27d3c', BEL = '#fff0d2', DK = '#8a5a2a';
  c.save(); c.scale(1, .22); el(c, 0, 0, 120, 100, 'rgba(60,20,40,.28)'); c.restore();
  // spindly folded legs + hooves
  for (const sx of [-1, 1]) { shapeS(c, [[sx * 44, -70], [sx * 66, -50], [sx * 68, -14], [sx * 54, -4], [sx * 36, -8], [sx * 36, -40]], { fill: FUR, shade: FUR2, lw: 5, seed: 3 + sx, wob: 1.5, shadeDx: -5, shadeDy: -3 }); shapeS(c, [[sx * 36, -4], [sx * 78, -4], [sx * 80, 4], [sx * 36, 4]], { fill: '#3a2216', lw: 4, wob: .6, seed: 5 }); }
  // tiny tail
  shapeS(c, [[84, -86], [108, -100], [114, -84], [94, -74]], { fill: BEL, lw: 4, wob: .8, seed: 7 });
  // body (plump pear) + belly
  shapeS(c, [[-84, -62], [-92, -118], [-60, -176], [0, -196], [60, -176], [92, -118], [84, -62], [50, -18], [0, -10], [-50, -18]], { fill: FUR, shade: FUR2, lw: 6, wob: 3, seed: 9, shadeDx: -13, shadeDy: -9 });
  shapeS(c, [[-40, -58], [-48, -112], [-26, -164], [0, -172], [26, -164], [48, -112], [40, -58], [0, -30]], { fill: BEL, shade: '#f0d6a4', lw: 4, wob: 2, seed: 12, shadeDx: -6, shadeDy: -5 });
  for (const sx of [-1, 1]) shapeS(c, [[sx * 74, -170], [sx * 98, -134], [sx * 96, -92], [sx * 76, -84], [sx * 58, -112], [sx * 60, -150]], { fill: FUR, shade: FUR2, lw: 5, wob: 1, seed: 14 + sx, shadeDx: sx * 6, shadeDy: -6 });
  const hy = -236;
  // ears: big leaf ears with pink inside
  for (const sx of [-1, 1]) { c.save(); c.translate(sx * 66, hy - 36); c.rotate(sx * (.75 + tw)); shapeS(c, [[0, 8], [-18, -14], [-14, -66], [6, -90], [24, -62], [22, -14]], { fill: FUR, shade: FUR2, lw: 5, wob: 1, seed: 20 + sx, shadeDx: -4, shadeDy: -5 }); shapeS(c, [[2, -6], [-8, -22], [-4, -56], [8, -66], [14, -40], [12, -18]], { fill: '#ffb3c1', lw: 0, wob: .8, seed: 22 }); c.restore(); }
  // horns
  for (const sx of [-1, 1]) shapeS(c, [[sx * 18, hy - 70], [sx * 24, hy - 100], [sx * 30, hy - 106], [sx * 30, hy - 94], [sx * 28, hy - 68]], { fill: '#3a2a22', lw: 3.5, wob: .5, seed: 25 + sx });
  // head: wedge shaped, long snout
  shapeS(c, [[-84, hy - 8], [-72, hy - 56], [-30, hy - 78], [0, hy - 80], [30, hy - 78], [72, hy - 56], [84, hy - 8], [56, hy + 44], [24, hy + 80], [0, hy + 86], [-24, hy + 80], [-56, hy + 44]], { fill: FUR, shade: FUR2, lw: 6, wob: 3, seed: 30, shadeDx: -11, shadeDy: -9 });
  shapeS(c, [[-30, hy + 14], [-20, hy - 6], [0, hy - 10], [20, hy - 6], [30, hy + 14], [20, hy + 66], [0, hy + 76], [-20, hy + 66]], { fill: BEL, shade: '#f0d6a4', lw: 4, wob: 1.5, seed: 33, shadeDx: -5, shadeDy: -5 });
  // dark forehead stripe + big wet nose
  shapeS(c, [[-8, hy - 78], [8, hy - 78], [10, hy - 34], [0, hy - 24], [-10, hy - 34]], { fill: DK, lw: 0, wob: .6, seed: 36 });
  shapeS(c, [[-12, hy + 52], [12, hy + 52], [14, hy + 70], [0, hy + 78], [-14, hy + 70]], { fill: '#3a1a14', lw: 3.5, wob: .5, seed: 38 }); el(c, -4, hy + 58, 4, 3, '#fff');
  mouthSmall(c, 0, hy + 80, 20, expr === 'idle' ? 'happy' : expr);
  const ex = expr === 'wow' ? 'wow' : (blinkT > 0 ? 'blink' : expr); eye(c, -48, hy - 14, 40, ex, -1); eye(c, 48, hy - 14, 40, ex, 1);
  c.fillStyle = 'rgba(255,110,130,.55)'; el(c, -62, hy + 30, 14, 9, 'rgba(255,110,130,.55)'); el(c, 62, hy + 30, 14, 9, 'rgba(255,110,130,.55)');
  c.restore();
}

const ANCH = {
  capybara: { top: -392, eyeY: -308, eyeDX: 66, neckY: -196, bodyY: -140, handX: 128, handY: -96, headW: 120 },
  axolotl: { top: -358, eyeY: -266, eyeDX: 58, neckY: -196, bodyY: -140, handX: 118, handY: -92, headW: 112 },
  dikdik: { top: -326, eyeY: -250, eyeDX: 48, neckY: -176, bodyY: -120, handX: 98, handY: -86, headW: 80 }
};
const orange = (c, x, y, r) => { el(c, x, y, r, r * .9, '#ff9f2e', INK, 4); el(c, x - r * .3, y - r * .3, r * .22, r * .16, 'rgba(255,255,255,.6)'); shapeS(c, [[x, y - r * .8], [x + r * .5, y - r * 1.2], [x + r * .3, y - r * .6]], { fill: '#4fb36a', lw: 3, wob: .5, seed: 2 }); };
const COS = {
  princess_tiara: (c, a) => { shapeS(c, [[-44, a.top + 14], [-40, a.top - 26], [-22, a.top - 4], [0, a.top - 44], [22, a.top - 4], [40, a.top - 26], [44, a.top + 14]], { fill: '#ffd93d', shade: '#e8b630', lw: 4.5, wob: .6, seed: 4 }); el(c, 0, a.top - 8, 7, 7, '#ff4d8a', INK, 3); el(c, -26, a.top, 4.5, 4.5, '#6ec3ff', INK, 2.5); el(c, 26, a.top, 4.5, 4.5, '#6ec3ff', INK, 2.5); },
  giant_pink_bow: (c, a) => { for (const sx of [-1, 1]) shapeS(c, [[0, a.top + 6], [sx * 46, a.top - 32], [sx * 58, a.top + 4], [sx * 40, a.top + 24]], { fill: '#ff8fb7', shade: '#e0608f', lw: 4.5, wob: .8, seed: 5 + sx, shadeDx: 0, shadeDy: -6 }); el(c, 0, a.top + 4, 13, 14, '#ff5c8a', INK, 4); },
  daisy_crown: (c, a) => { for (let i = -3; i <= 3; i++) { const x = i * 22, y = a.top + 18 - Math.abs(i) * 4; for (let k = 0; k < 6; k++) el(c, x + Math.cos(k * 1.05) * 9, y + Math.sin(k * 1.05) * 9, 6, 6, '#fff', INK, 2.2); el(c, x, y, 5, 5, '#ffd93d', INK, 2); } },
  unicorn_horn: (c, a) => { shapeS(c, [[-12, a.top + 10], [0, a.top - 56], [12, a.top + 10]], { fill: '#fff6ff', shade: '#e8c9f5', lw: 4.5, wob: .5, seed: 6 }); for (let i = 0; i < 3; i++) ln(c, [[-9 + i * 2, a.top - 4 - i * 14], [9 - i * 2, a.top - 12 - i * 14]], '#d9a0f0', 3); star(c, 22, a.top - 20, 8, '#ffd93d'); },
  strawberry_beret: (c, a) => { shapeS(c, [[-56, a.top + 18], [-46, a.top - 14], [0, a.top - 24], [48, a.top - 12], [58, a.top + 18], [0, a.top + 26]], { fill: '#ff4d6a', shade: '#d62f52', lw: 4.5, wob: .8, seed: 7 }); for (const [x, y] of [[-24, 0], [4, -8], [30, 2], [-6, 10]]) el(c, x, a.top + y, 2.6, 3.4, '#ffe9a8'); shapeS(c, [[0, a.top - 22], [-8, a.top - 34], [0, a.top - 30], [8, a.top - 34]], { fill: '#4fb36a', lw: 3, wob: .5, seed: 8 }); },
  tangerine_stack: (c, a) => { orange(c, 0, a.top + 4, 34); orange(c, 0, a.top - 32, 26); orange(c, 0, a.top - 58, 18); },
  propeller_beanie: (c, a) => { shapeS(c, [[-50, a.top + 22], [-40, a.top - 20], [0, a.top - 34], [40, a.top - 20], [50, a.top + 22]], { fill: '#5fb1ee', shade: '#3f8ecc', lw: 4.5, wob: .8, seed: 9 }); for (const [x, col] of [[-26, '#ff5c8a'], [0, '#ffd93d'], [26, '#7ed957']]) shapeS(c, [[x - 10, a.top + 18], [x - 8, a.top - 26], [x + 8, a.top - 26], [x + 10, a.top + 18]], { fill: col, lw: 0, wob: .3, seed: 3 }); el(c, 0, a.top - 36, 5, 5, '#ffd93d', INK, 3); ln(c, [[-30, a.top - 44], [30, a.top - 52]], '#ff5c8a', 8); ln(c, [[-30, a.top - 44], [30, a.top - 52]], INK, 2); },
  chef_toque: (c, a) => { for (const [x, y, r] of [[-26, -36, 26], [0, -50, 30], [26, -36, 26]]) el(c, x, a.top + y, r, r, '#fffdf4', INK, 4.5); slab(c, -34, a.top - 20, 68, 36, { fill: '#fffdf4', shade: '#e4e4ee', r: 6, lw: 4.5 }); },
  heart_sunglasses: (c, a) => { for (const sx of [-1, 1]) { c.save(); c.translate(sx * a.eyeDX, a.eyeY); heart(c, 0, -2, 30, '#ff4d8a'); c.beginPath(); c.moveTo(0, 30); c.bezierCurveTo(-48, -6, -20, -42, 0, -14); c.bezierCurveTo(20, -42, 48, -6, 0, 30); c.strokeStyle = INK; c.lineWidth = 4.5; c.stroke(); el(c, -8, -10, 7, 5, 'rgba(255,255,255,.6)', null, 0, -.5); c.restore(); } ln(c, [[-a.eyeDX + 24, a.eyeY - 6], [a.eyeDX - 24, a.eyeY - 6]], INK, 5); },
  mustache_monocle: (c, a) => { el(c, a.eyeDX, a.eyeY, 38, 38, 'rgba(210,240,255,.35)', '#d9a52a', 7); el(c, a.eyeDX, a.eyeY, 38, 38, null, INK, 2); ln(c, [[a.eyeDX, a.eyeY + 38], [a.eyeDX + 14, a.eyeY + 80]], '#d9a52a', 3.5); shapeS(c, [[-40, a.eyeY + 80], [-20, a.eyeY + 66], [0, a.eyeY + 74], [20, a.eyeY + 66], [40, a.eyeY + 80], [20, a.eyeY + 90], [0, a.eyeY + 82], [-20, a.eyeY + 90]], { fill: '#3a2216', lw: 3.5, wob: .5, seed: 11 }); },
  cucumber_masks: (c, a) => { for (const sx of [-1, 1]) { el(c, sx * a.eyeDX, a.eyeY, 38, 38, '#9be37a', INK, 5); el(c, sx * a.eyeDX, a.eyeY, 28, 28, '#d3f7a8', null); for (let k = 0; k < 6; k++) el(c, sx * a.eyeDX + Math.cos(k * 1.05) * 14, a.eyeY + Math.sin(k * 1.05) * 14, 3, 3, '#b8e890'); } },
  star_shades: (c, a) => { for (const sx of [-1, 1]) { star(c, sx * a.eyeDX, a.eyeY, 38, '#ffd93d'); c.beginPath(); for (let i = 0; i < 10; i++) { const an = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 19 : 38; c.lineTo(sx * a.eyeDX + Math.cos(an) * r, a.eyeY + Math.sin(an) * r); } c.closePath(); c.strokeStyle = INK; c.lineWidth = 4.5; c.lineJoin = 'round'; c.stroke(); } ln(c, [[-a.eyeDX + 30, a.eyeY - 6], [a.eyeDX - 30, a.eyeY - 6]], INK, 5); },
  fluffy_pink_boa: (c, a) => { for (let i = -5; i <= 5; i++) el(c, i * 22, a.neckY + 20 - Math.abs(i) * 3 + (i % 2) * 8, 20, 20, i % 2 ? '#ff9fc0' : '#ffb3cc', INK, 3.5); },
  pearl_collar: (c, a) => { for (let i = -5; i <= 5; i++) el(c, i * 18, a.neckY + 10 + (25 - Math.abs(i) * 4.5), 8, 8, '#fffdf4', INK, 2.6); },
  ballet_tutu: (c, a) => { for (let i = 0; i < 9; i++) { const x = -92 + i * 23; shapeS(c, [[x, a.bodyY + 20], [x - 10, a.bodyY + 66], [x + 12, a.bodyY + 72], [x + 26, a.bodyY + 20]], { fill: i % 2 ? '#ffb3d9' : '#ffc9e5', shade: '#e892c0', lw: 3, wob: .6, seed: i + 2, shadeDx: 0, shadeDy: -6 }); } },
  dino_hoodie: (c, a) => { for (let i = 0; i < 4; i++) shapeS(c, [[-24 + i * 16, a.bodyY - 62 - i % 2 * 4], [-16 + i * 16, a.bodyY - 92], [-8 + i * 16, a.bodyY - 62]], { fill: '#ffd93d', lw: 3.5, wob: .4, seed: i }); shapeS(c, [[-78, a.bodyY - 44], [-60, a.bodyY - 80], [0, a.bodyY - 90], [60, a.bodyY - 80], [78, a.bodyY - 44], [70, a.bodyY + 38], [0, a.bodyY + 54], [-70, a.bodyY + 38]], { fill: '#6ed39a', shade: '#44b076', lw: 5, wob: 1.5, seed: 4, shadeDx: -9, shadeDy: -7, }); slab(c, -34, a.bodyY + 8, 68, 30, { fill: '#52bf85', r: 8, lw: 3.5 }); },
  fairy_wand: (c, a) => { c.save(); c.translate(a.handX, a.handY); c.rotate(.35); slab(c, -3.5, -10, 7, 70, { fill: '#e8c25a', r: 3, lw: 3 }); star(c, 0, -30, 20, '#ffd93d'); c.beginPath(); for (let i = 0; i < 10; i++) { const an = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 10 : 20; c.lineTo(Math.cos(an) * r, -30 + Math.sin(an) * r); } c.closePath(); c.strokeStyle = INK; c.lineWidth = 3.5; c.stroke(); c.restore(); },
  mini_ukulele: (c, a) => { c.save(); c.translate(a.handX - 4, a.handY - 16); c.rotate(-.5); el(c, 0, 24, 24, 20, '#ffb15f', INK, 4); el(c, 0, 6, 17, 15, '#ffb15f', INK, 4); el(c, 0, 18, 6, 6, '#4a2a1c'); slab(c, -4, -44, 8, 50, { fill: '#a96f38', r: 3, lw: 3 }); slab(c, -8, -56, 16, 14, { fill: '#7a4ad8', r: 3, lw: 3 }); for (const x of [-2, 2]) ln(c, [[x, -42], [x * 1.5, 38]], '#fff', 1.5); c.restore(); },
  boba_tea_cup: (c, a) => { c.save(); c.translate(a.handX, a.handY); shapeS(c, [[-18, -40], [18, -40], [14, 20], [-14, 20]], { fill: 'rgba(255,225,200,.95)', shade: '#f0c0a0', lw: 4, wob: .5, seed: 3 }); slab(c, -20, -48, 40, 10, { fill: '#fff', r: 4, lw: 3 }); ln(c, [[6, -46], [12, -84]], '#ff5c8a', 6); for (const [x, y] of [[-8, 10], [2, 12], [8, 8], [-2, 4]]) el(c, x, y, 4.5, 4.5, '#4a2a1c'); c.restore(); },
  flower_pinwheel: (c, a) => { c.save(); c.translate(a.handX, a.handY - 36); ln(c, [[0, 0], [0, 76]], '#a96f38', 5); const sp = performance.now() / 300; for (let i = 0; i < 4; i++) { c.save(); c.rotate(sp + i * Math.PI / 2); shapeS(c, [[0, 0], [28, -4], [26, -26]], { fill: ['#ff5c8a', '#ffd93d', '#6ec3ff', '#7ed957'][i], lw: 3.5, wob: .3, seed: i }); c.restore(); } el(c, 0, 0, 5, 5, '#fff', INK, 2.5); c.restore(); },
  superhero_cape: (c, a) => { shapeS(c, [[-80, a.neckY], [80, a.neckY], [112, a.bodyY + 70], [60, a.bodyY + 96], [0, a.bodyY + 84], [-60, a.bodyY + 96], [-112, a.bodyY + 70]], { fill: '#ff4d6a', shade: '#c4304f', lw: 5, wob: 1.5, seed: 12, shadeDx: -10, shadeDy: -6 }); star(c, 0, a.bodyY + 50, 18, '#ffd93d'); }
};
const BACK = new Set(['superhero_cape']);
export function drawPet(c, species, t, expr, blink, eq = {}, st = null) {
  const a = ANCH[species]; c.save();
  if (eq.outfit && BACK.has(eq.outfit)) COS[eq.outfit](c, a);
  ({ capybara: drawCapybara, axolotl: drawAxolotl, dikdik: drawDikdik })[species](c, t, expr, blink);
  if (st && st.cleanliness < 60) for (const [x, y, r] of [[-70, -110, 16], [64, -170, 14], [-40, -200, 12], [50, -90, 13], [-96, -150, 10]]) { el(c, x, y, r, r * .8, '#8a5a2a', INK, 3); el(c, x - r * .3, y - r * .3, r * .22, r * .18, 'rgba(255,255,255,.35)'); }
  if (eq.outfit && !BACK.has(eq.outfit)) COS[eq.outfit]?.(c, a);
  for (const k of ['neck', 'glasses', 'hat', 'heldProp']) if (eq[k] && COS[eq[k]]) COS[eq[k]](c, a);
  c.restore();
}

/** Needs -> thought bubble. Returns { station, icon } or null. */
// Most urgent need wins (not a fixed order), so a pet that is always dirty can't hide hunger forever.
export function petNeed(p) { const s = p.stats, c = [[p.ailments?.length || p.fever ? 100 : 70 - s.health, { station: 'vet', icon: 'cross' }], [60 - s.cleanliness, { station: 'spa', icon: 'sponge' }], [60 - s.hunger, { station: 'kitchen', icon: 'berry' }]].filter(x => x[0] > 0).sort((a, b) => b[0] - a[0]); return c.length ? c[0][1] : null; }
const ICONS = { sponge: (c, x, y, s) => sponge(c, x, y, s * 1.2), berry: (c, x, y, s) => strawberry(c, x, y, s * 1.2), cross: (c, x, y, s) => { slab(c, x - 22 * s, y - 22 * s, 44 * s, 44 * s, { fill: '#ff5c6c', r: 10 * s, lw: 4 }); c.fillStyle = '#fff'; c.fillRect(x - 4 * s, y - 16 * s, 8 * s, 32 * s); c.fillRect(x - 16 * s, y - 4 * s, 32 * s, 8 * s); } };

export class PetManager {
  constructor(world) {
    this.w = world; this.pets = {}; this.override = {}; this.callAll = false; this.t = 0; world.hooks.pick = (pt, p) => this.pick(pt); world.hooks.stationGo = world.hooks.stationGo || null;
    const st = world.save.state, home = { capybara: 1, axolotl: 0, dikdik: 4 };
    for (const id of ['capybara', 'axolotl', 'dikdik']) { const h = home[id], hx = h * RW + (id === 'capybara' ? 250 : id === 'axolotl' ? 300 : 360);
      const o = { id, x: hx, y: 488, hx, hy: 488, face: 1, react: 0, reactExpr: 'happy', moving: 0, blink: 0, sprite: null }; o.sprite = { get y() { return o.y; }, draw: c => this.draw(c, o) }; this.pets[id] = o; world.sprites.push(o.sprite); }
    world.e.updaters.push(dt => this.update(dt)); world.e.layers.push((c, e) => this.drawBubbles(c, e));
  }
  state(id) { return this.w.save.state.pets[id]; }
  get active() { return this.pets[this.w.save.state.activePet]; }
  update(dt) {
    this.t += dt; const w = this.w, av = w.av, act = this.w.save.state.activePet;
    for (const o of Object.values(this.pets)) {
      o.react = Math.max(0, o.react - dt); let tx, ty;
      if (o.id === act || this.callAll) { const behind = -av.face * (78 + (o.id === act ? 0 : 56 + ['capybara', 'axolotl', 'dikdik'].indexOf(o.id) * 14)); tx = av.x + behind; ty = Math.max(WALK_Y0, Math.min(WALK_Y1, av.y + 6)); } else { tx = o.hx + Math.sin(this.t * .4 + o.hx) * 26; ty = o.hy; }
      const dx = tx - o.x, dy = ty - o.y, d = Math.hypot(dx, dy); let mv = 0;
      if (d > ((o.id === act || this.callAll) ? 38 : 4)) { const st = Math.min(d, ((o.id === act || this.callAll) ? 215 : 40) * dt), r = w.col.move(o.x, o.y, o.x + dx / d * st, o.y + dy / d * st); mv = Math.hypot(r.x - o.x, r.z - o.y); o.x = r.x; o.y = r.z; if (Math.abs(dx) > 8) o.face = dx > 0 ? 1 : -1; }
      o.moving += ((mv > .1 ? 1 : 0) - o.moving) * Math.min(1, dt * 8); o.blink -= dt; if (o.blink < -.14) o.blink = 2.4 + Math.random() * 2.4;
    }
  }
  mood(o) { if (o.react > 0) return o.reactExpr; const s = this.state(o.id).stats; return Math.min(s.health, s.cleanliness, s.hunger) < 50 ? 'sad' : (s.love + s.energy) / 2 > 85 ? 'happy' : 'idle'; }
  scaleAt(y) { return .78 + (y - WALK_Y0) / (WALK_Y1 - WALK_Y0) * .2; }
  draw(c, o) { const p = this.state(o.id), s = this.scaleAt(o.y) * .5, hop = Math.abs(Math.sin(this.t * 10)) * 6 * o.moving;
    c.save(); c.translate(o.x, o.y - hop); c.scale(s * o.face * (o.id === 'axolotl' ? 1 : 1), s); drawPet(c, o.id, this.t, this.mood(o), o.blink > 0 ? 0 : 1, this.override[o.id] || p.equipped, p.stats); c.restore(); }
  bubbleAt(o) { return { x: o.x + 10, y: o.y - 300 * this.scaleAt(o.y) * .5 - 90 }; }
  drawBubbles(c, e) { c.translate(0, e.offY); for (const o of Object.values(this.pets)) { const n = petNeed(this.state(o.id)); if (!n || o.x < e.cam.x - 80 || o.x > e.cam.x + e.visW + 80) continue; const b = this.bubbleAt(o), bob = Math.sin(this.t * 2.2 + o.x) * 4; drawBubble(c, b.x - 8, b.y + bob - 30, .8, ICONS[n.icon]); if (!(this.w.save.state.routinesCompleted > 0) && o.id === this.w.save.state.activePet) drawHand(c, b.x - 2, b.y + bob + 18 + Math.sin(this.t * 6) * 6, .8); } }
  pick(w) {
    for (const o of Object.values(this.pets)) { const n = petNeed(this.state(o.id)), b = this.bubbleAt(o);
      if (n && Math.hypot(w.x - b.x, w.y - (b.y)) < 62) { const st = STATIONS.find(s => s.id === n.station); this.w.walkTo(st.room * RW + st.x, st.y); return true; }
      const s = this.scaleAt(o.y) * .5; if (Math.abs(w.x - o.x) < 70 * s * 2 && w.y < o.y + 14 && w.y > o.y - 320 * s) { o.react = 1.4; o.reactExpr = 'happy'; if (this.w.save.state.activePet !== o.id) { this.w.save.state.activePet = o.id; this.w.save.save?.(); } return true; } }
    return false;
  }
}
