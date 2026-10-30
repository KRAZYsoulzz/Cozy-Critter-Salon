// Five cutaway rooms side by side. Each draws its own wall, floor and props in room-local coords (0..RW).
import { shapeS } from './art.js';
import { INK, el, ln, slab, shadow, wood, bottle, comb, scissors, brush, hairdryer, nailClipper, duck, towels, plant, framePic, heart, star } from './props.js';
export const RW = 900, FY = 392, WORLD_W = RW * 5, WALK_Y0 = 418, WALK_Y1 = 512;
export const ROOMS = [
  { id: 'kitchen', name: 'Kitchen', wall: '#ffd36b', wall2: '#ffc447', floor: '#7fc4b0', floor2: '#68b09c', trim: '#fff1c2', accent: '#e8574f' },
  { id: 'spa', name: 'Spa', wall: '#7d6bb3', wall2: '#6a579f', floor: '#d98f7a', floor2: '#c47a67', trim: '#e9d8ff', accent: '#b04c8f' },
  { id: 'lobby', name: 'Lobby', wall: '#ff9db8', wall2: '#ff87a8', floor: '#f6d9a8', floor2: '#e8c68f', trim: '#fff0f4', accent: '#7a4ad8' },
  { id: 'vet', name: 'Clinic', wall: '#9be3d0', wall2: '#85d3be', floor: '#f2f6f8', floor2: '#dde6ea', trim: '#ffffff', accent: '#3fa7a0' },
  { id: 'yard', name: 'Yard', wall: '#9fd8ff', wall2: '#9fd8ff', floor: '#7ccd6a', floor2: '#68b858', trim: '#ffffff', accent: '#ff7a5c' }
];
// Floor footprints (world x, floor y) the avatar cannot enter. circles [x,y,r], boxes [x0,x1,y0,y1]
export const OBSTACLE_CIRCLES = [], OBSTACLE_BOXES = [];
const cc = (r, x, y, rad) => OBSTACLE_CIRCLES.push([r * RW + x, y, rad]);
const bb = (r, x0, x1, y0, y1) => OBSTACLE_BOXES.push([r * RW + x0, r * RW + x1, y0, y1]);
// kitchen
bb(0, 90, 360, 400, 430); cc(0, 640, 468, 56); cc(0, 270, 500, 0.01);
// spa: clawfoot tub centre-left, vanity at back
bb(1, 290, 590, 408, 462); bb(1, 740, 860, 400, 432);
// lobby: reception desk + shop cart
bb(2, 300, 600, 402, 438); cc(2, 790, 436, 26);
// vet: exam table, scale
bb(3, 300, 560, 410, 470); cc(3, 760, 440, 28);
// yard: pond, tree trunk, flower bed
cc(4, 260, 466, 70); cc(4, 560, 426, 24); bb(4, 700, 860, 402, 428);
// partition walls: thin pillars at the back and front strips; the arched doorway stays open between them
for (let k = 1; k < 5; k++) { bb(k, -14, 14, FY, WALK_Y0 + 18); bb(k, -14, 14, WALK_Y1 - 12, 540); }
bb(0, -30, 0, 0, 540); bb(4, 900, 930, 0, 540);

export const STATIONS = [
  { id: 'kitchen', room: 0, x: 450, y: 470, name: 'Kitchen', icon: 'apple', voiceId: 'station_kitchen' },
  { id: 'spa', room: 1, x: 440, y: 488, name: 'Spa Tub', icon: 'bubbles', voiceId: 'station_spa' },
  { id: 'lobby', room: 2, x: 450, y: 482, name: 'Front Desk', icon: 'bell', voiceId: 'station_lobby' },
  { id: 'shop', room: 2, x: 790, y: 488, name: 'Critter Boutique', icon: 'bag', voiceId: 'station_shop' },
  { id: 'photobooth', room: 2, x: 140, y: 488, name: 'Photo Booth', icon: 'camera', voiceId: 'station_photobooth' },
  { id: 'vet', room: 3, x: 430, y: 488, name: 'Pet Clinic', icon: 'stethoscope', voiceId: 'station_vet' },
  { id: 'yard', room: 4, x: 470, y: 480, name: 'Play Yard', icon: 'ball', voiceId: 'station_yard' }
];

function backdrop(c, R, o = {}) {
  c.fillStyle = R.wall; c.fillRect(0, 0, RW, FY);
  c.fillStyle = R.wall2; for (let x = 0; x < RW; x += 56) c.fillRect(x, 0, 28, FY);
  c.fillStyle = 'rgba(0,0,0,.16)'; c.fillRect(0, FY - 40, RW, 40); c.fillStyle = R.trim; c.fillRect(0, FY - 46, RW, 8);
  c.fillStyle = R.floor; c.fillRect(0, FY, RW, 540 - FY);
  c.strokeStyle = R.floor2; c.lineWidth = 3;
  for (let y = FY + 30, i = 0; y < 540; y += 36 + i * 4, i++) { c.beginPath(); c.moveTo(0, y); c.lineTo(RW, y); c.stroke(); for (let x = (i % 2) * 70 + 30; x < RW; x += 140) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 36 + i * 4); c.stroke(); } }
  c.fillStyle = 'rgba(40,10,40,.18)'; c.fillRect(0, FY, RW, 9);
}
function arch(c, cx, w, top, bottom, sky = true) { c.beginPath(); c.moveTo(cx - w / 2, bottom); c.lineTo(cx - w / 2, top + w / 2); c.arc(cx, top + w / 2, w / 2, Math.PI, 0); c.lineTo(cx + w / 2, bottom); c.closePath(); }
function windowArch(c, R, cx, w, top) {
  c.save(); arch(c, cx, w, top, FY - 50); const g = c.createLinearGradient(0, top, 0, FY); g.addColorStop(0, '#9fd8ff'); g.addColorStop(1, '#e6f6ff'); c.fillStyle = g; c.fill(); c.clip();
  c.fillStyle = '#b6dcef'; [[-.4, .12, 90], [-.22, .1, 130], [0, .14, 110], [.2, .1, 150], [.34, .1, 100]].forEach(([x, ww, h]) => c.fillRect(cx + x * w, FY - 50 - h, ww * w, h)); c.restore();
  arch(c, cx, w, top, FY - 50); c.strokeStyle = '#f4e6ff'; c.lineWidth = 9; c.stroke(); c.beginPath(); c.moveTo(cx, top); c.lineTo(cx, FY - 50); c.moveTo(cx - w / 2, top + w * .5 + 20); c.lineTo(cx + w / 2, top + w * .5 + 20); c.lineWidth = 6; c.stroke();
  c.beginPath(); c.arc(cx, top + w / 2, w / 2 + 5, Math.PI, 0); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
}
function curtain(c, x, w, top, bot, sx, col) { const a = x, b = x + sx * w, m = (top + bot) / 2;
  shapeS(c, [[a, top], [(a + b) / 2, top - 6], [b, top + 6], [b + sx * 4, m], [b, bot - 6], [(a + b) / 2, bot + 4], [a, bot - 4], [a - sx * 3, m]], { fill: col, shade: 'rgba(60,10,50,.3)', lw: 4, wob: 3, seed: 4 + sx, shadeDx: sx * 9, shadeDy: 0 }); }

// ---------------------------------------------------------------- SPA
function spa(c, R, t, st) {
  backdrop(c, R); windowArch(c, R, 450, 220, 40); curtain(c, 450 - 116, 66, 90, 350, -1, '#b04c8f'); curtain(c, 450 + 116, 66, 90, 350, 1, '#b04c8f');
  c.fillStyle = '#e9d8ff'; c.fillRect(0, 0, 0, 0);
  // WOODEN TOOL SHELF with hanging-hook rail (left) -- specific props on every tier
  const sx = 40, sy = 78;
  wood(c, sx - 6, sy + 192, 330, 16, { r: 6 }); wood(c, sx - 6, sy + 292, 330, 16, { r: 6 });           // two shelf boards
  wood(c, sx + 14, sy + 208, 12, 84, { r: 3 }); wood(c, sx + 290, sy + 208, 12, 84, { r: 3 });          // tier uprights
  for (const bx of [sx + 36, sx + 266]) { shapeS(c, [[bx - 8, sy + 208], [bx + 8, sy + 208], [bx + 8, sy + 234], [bx - 8, sy + 260]], { fill: '#a96f38', lw: 3.5, wob: .5, seed: 2 }); }
  // peg rail with hanging tools
  wood(c, sx - 6, sy - 10, 330, 22, { r: 8 }); for (const px of [40, 100, 160, 226, 288]) el(c, sx + px - 6 + 6, sy + 1, 4, 4, '#6b4220', INK, 1.5);
  ln(c, [[sx + 40, sy + 12], [sx + 40, sy + 24]], INK, 3); scissors(c, sx + 40, sy + 62, .8, 0, .34);
  ln(c, [[sx + 106, sy + 12], [sx + 106, sy + 26]], INK, 3); comb(c, sx + 106, sy + 56, .78, 1.57);
  ln(c, [[sx + 168, sy + 12], [sx + 168, sy + 24]], INK, 3); brush(c, sx + 168, sy + 82, .9, Math.PI);
  ln(c, [[sx + 230, sy + 12], [sx + 230, sy + 28]], INK, 3); nailClipper(c, sx + 232, sy + 52, .85, 1.5);
  ln(c, [[sx + 290, sy + 12], [sx + 290, sy + 26]], INK, 3); hairdryer(c, sx + 290, sy + 60, .62, -.2);
  // upper shelf (y = sy+114): bottles with different shapes, colours and labels
  bottle(c, sx + 32, sy + 192, .95, 'pump', '#ff8fb7', 'heart'); bottle(c, sx + 82, sy + 192, .95, 'squeeze', '#b589f7', 'star', '#fff6b0');
  bottle(c, sx + 134, sy + 192, .95, 'spray', '#7fe0c8', 'drop', '#3a9a8a'); bottle(c, sx + 188, sy + 192, .95, 'jar', '#ff7aa8');
  bottle(c, sx + 244, sy + 192, .95, 'perfume', '#ffb15f', 'star', '#fff'); bottle(c, sx + 292, sy + 192, .85, 'potion', '#8fd4ff', 'star', '#fff6b0');
  // lower shelf (y = sy+214): towels, duck, tub of treats
  towels(c, sx + 56, sy + 292, 1.05); duck(c, sx + 140, sy + 292, 1.0);
  slab(c, sx + 188, sy + 266, 56, 26, { fill: '#8fd4ff', shade: '#5fb1ee', r: 7, lw: 4 }); for (const [a, b, col] of [[198, 264, '#ff8fb7'], [214, 258, '#ffe27a'], [230, 264, '#b589f7']]) el(c, sx + a, sy + b, 9, 9, col, INK, 2.5);
  slab(c, sx + 258, sy + 270, 46, 22, { fill: '#fff6ea', r: 5, lw: 4 }); ln(c, [[sx + 266, sy + 278], [sx + 296, sy + 278]], '#ff8fb7', 3); ln(c, [[sx + 266, sy + 285], [sx + 288, sy + 285]], '#ff8fb7', 3);
  // vanity with round mirror + brush jar (right)
  slab(c, 740, 300, 120, 86, { fill: '#c98a4b', shade: '#a96f38', r: 6, lw: 4.5 }); ln(c, [[800, 304], [800, 384]], '#9b6330', 3); el(c, 770, 346, 4, 4, '#ffd96b', INK, 2); el(c, 830, 346, 4, 4, '#ffd96b', INK, 2);
  el(c, 800, 228, 58, 62, '#e7f6ff', INK, 5); el(c, 800, 228, 50, 54, null, '#fff', 3); ln(c, [[775, 205], [790, 192]], 'rgba(255,255,255,.9)', 5);
  el(c, 800, 298, 8, 8, '#ffd96b', INK, 2.5); slab(c, 752, 274, 22, 28, { fill: '#8fd4ff', r: 5, lw: 3.5 }); for (let i = 0; i < 3; i++) ln(c, [[758 + i * 7, 274], [756 + i * 7, 254]], i % 2 ? '#ff8fb7' : '#ffd96b', 4);
  // tub (clawfoot, drawn in front of the wall) with bubbles, sits on obstacle footprint
  const tx = 440, ty = 452; shadow(c, tx, ty + 12, 150);
  for (const sx2 of [-1, 1]) for (const dx of [-110, 110]) { if (sx2 > 0) continue; }
  for (const dx of [-108, 108]) shapeS(c, [[tx + dx - 12, ty - 12], [tx + dx + 12, ty - 12], [tx + dx + 16, ty + 14], [tx + dx + (dx > 0 ? 24 : -24), ty + 22], [tx + dx - 14, ty + 18]], { fill: '#ffd96b', shade: '#e8b630', lw: 4, wob: .8, seed: 5 });
  shapeS(c, [[tx - 150, ty - 66], [tx + 150, ty - 66], [tx + 134, ty - 6], [tx + 80, ty + 4], [tx - 80, ty + 4], [tx - 134, ty - 6]], { fill: '#fff6f8', shade: '#f1c9dc', lw: 5.5, wob: 2, seed: 6, shadeDx: -8, shadeDy: -8 });
  shapeS(c, [[tx - 146, ty - 72], [tx + 146, ty - 72], [tx + 150, ty - 60], [tx - 150, ty - 60]], { fill: '#ff9fc7', lw: 4.5, wob: .6, seed: 7 });
  for (const [bx, by, br] of [[-100, -86, 22], [-66, -98, 26], [-20, -92, 20], [30, -104, 28], [80, -90, 22], [110, -84, 16], [-40, -112, 14]]) { el(c, tx + bx, ty + by, br, br, '#ffffff', INK, 3.5); el(c, tx + bx - br * .3, ty + by - br * .3, br * .22, br * .3, 'rgba(160,210,255,.9)', null, 0, .5); }
  slab(c, tx - 18, ty - 120, 12, 28, { fill: '#d0d8e4', r: 4, lw: 3.5 }); ln(c, [[tx - 12, ty - 120], [tx - 12, ty - 144], [tx + 16, ty - 144]], '#d0d8e4', 9); ln(c, [[tx - 12, ty - 120], [tx - 12, ty - 144], [tx + 16, ty - 144]], INK, 2);
  // bath mat & slippers
  c.save(); c.translate(670, 498); c.scale(1, .3); slab(c, -80, -80, 160, 160, { fill: '#8fd4ff', shade: '#5fb1ee', r: 60, lw: 7 }); c.restore();
  heart(c, 670, 498, 12, '#fff'); plant(c, 880, 492, .75, '#7a4ad8');
}
// ---------------------------------------------------------------- KITCHEN
function kitchen(c, R, t) {
  backdrop(c, R); windowArch(c, R, 640, 200, 50); curtain(c, 640 - 106, 56, 100, 330, -1, '#e8574f'); curtain(c, 640 + 106, 56, 100, 330, 1, '#e8574f');
  // checker backsplash
  c.save(); c.beginPath(); c.rect(60, 250, 320, 100); c.clip(); for (let i = 0; i < 12; i++) for (let j = 0; j < 4; j++) { c.fillStyle = (i + j) % 2 ? '#fff6e0' : '#ffd9a0'; c.fillRect(60 + i * 28, 250 + j * 28, 28, 28); } c.restore(); c.strokeStyle = INK; c.lineWidth = 4; c.strokeRect(60, 250, 320, 100);
  // counter + sink + stove
  slab(c, 70, 340, 300, 64, { fill: '#ff8a6b', shade: '#e0674a', r: 6, lw: 5 }); slab(c, 60, 330, 320, 16, { fill: '#fff6ea', shade: '#e8dcc4', r: 6, lw: 4.5 });
  for (const x of [88, 188, 288]) { ln(c, [[x, 352], [x, 400]], '#e0674a', 3); el(c, x + 40, 372, 4, 4, '#ffd96b', INK, 2); }
  // kettle with spout
  shapeS(c, [[110, 328], [100, 296], [120, 276], [152, 276], [170, 296], [158, 328]], { fill: '#6ec3ff', shade: '#4da8eb', lw: 4.5, wob: 1, seed: 8, shadeDx: -6, shadeDy: -6 }); shapeS(c, [[158, 304], [186, 286], [190, 292], [162, 316]], { fill: '#6ec3ff', lw: 4, wob: .5, seed: 9 }); ln(c, [[112, 284], [136, 262], [160, 284]], INK, 5); el(c, 136, 272, 6, 6, '#ffd96b', INK, 2.5);
  // fruit bowl & cookie jar
  shapeS(c, [[220, 314], [210, 330], [296, 330], [286, 314]], { fill: '#fff6ea', shade: '#e8dcc4', lw: 4.5, wob: .6, seed: 12 }); for (const [x, y, col] of [[238, 306, '#ff4d6a'], [260, 302, '#ffb13d'], [280, 308, '#7ed957']]) { el(c, x, y, 13, 13, col, INK, 3.5); }
  shapeS(c, [[308, 328], [304, 292], [316, 284], [348, 284], [360, 292], [356, 328]], { fill: '#fff0c4', shade: '#f0d58a', lw: 4.5, wob: 1, seed: 14, shadeDx: -5, shadeDy: -5 }); el(c, 332, 280, 18, 8, '#ff8a6b', INK, 3.5); el(c, 332, 266, 5, 5, '#ffd96b', INK, 2.5); for (const [x, y] of [[322, 312], [340, 304], [342, 318]]) el(c, x, y, 6, 6, '#c98a4b', INK, 2);
  // hanging pans + utensils rail
  wood(c, 420, 150, 150, 14, { r: 6 }); for (const [x, k] of [[440, 0], [486, 1], [538, 2]]) { ln(c, [[x, 164], [x, 184]], INK, 3); if (k === 0) { el(c, x, 214, 24, 24, '#6b6f80', INK, 4.5); el(c, x, 214, 16, 16, '#4b4f60'); ln(c, [[x, 188], [x, 190]], INK, 3); } if (k === 1) { slab(c, x - 4, 184, 8, 54, { fill: '#c98a4b', r: 3, lw: 3.5 }); el(c, x, 252, 22, 14, '#d0d8e4', INK, 4); } if (k === 2) { shapeS(c, [[x - 18, 188], [x + 18, 188], [x + 12, 250], [x - 12, 250]], { fill: '#ffd96b', shade: '#e8b630', lw: 4, wob: .8, seed: 6 }); ln(c, [[x - 10, 206], [x + 10, 206]], INK, 2.5); } }
  // fridge (right of table) with magnets
  slab(c, 760, 150, 110, 250, { fill: '#b8e6ff', shade: '#8cc6ea', r: 14, lw: 5 }); ln(c, [[760, 250], [870, 250]], INK, 4); slab(c, 848, 180, 8, 50, { fill: '#e8eef5', r: 3, lw: 3 }); slab(c, 848, 276, 8, 70, { fill: '#e8eef5', r: 3, lw: 3 });
  heart(c, 790, 176, 11, '#ff4d6a'); star(c, 814, 192, 10, '#ffd93d'); slab(c, 780, 204, 40, 30, { fill: '#fffdf4', r: 3, lw: 2.5 }); ln(c, [[786, 214], [814, 214]], '#ff8fb7', 3); ln(c, [[786, 222], [804, 222]], '#8fd4ff', 3);
  // round table with checker cloth + strawberries (footprint circle at 640,468)
  const tx = 640, ty = 468; shadow(c, tx, ty + 36, 94); ln(c, [[tx - 40, ty + 34], [tx - 52, ty + 54]], INK, 6); ln(c, [[tx + 40, ty + 34], [tx + 52, ty + 54]], INK, 6);
  el(c, tx, ty + 6, 92, 38, '#c98a4b', INK, 5); el(c, tx, ty - 6, 92, 38, '#fff6ea', INK, 5); c.save(); c.beginPath(); c.ellipse(tx, ty - 6, 88, 34, 0, 0, TAU); c.clip(); for (let i = -4; i < 5; i++) for (let j = -2; j < 3; j++) if ((i + j) % 2) { c.fillStyle = '#ff9fb0'; c.fillRect(tx + i * 22, ty - 6 + j * 16, 22, 16); } c.restore(); el(c, tx, ty - 6, 92, 38, null, INK, 5);
  const sb = (x, y) => { shapeS(c, [[x, y + 12], [x - 11, y + 2], [x - 11, y - 8], [x, y - 12], [x + 11, y - 8], [x + 11, y + 2]], { fill: '#ff4d6a', lw: 3.5, wob: .8, seed: 3 }); ln(c, [[x - 6, y - 12], [x, y - 17], [x + 6, y - 12]], '#3f9a5b', 4); };
  sb(612, 464); sb(640, 470); sb(668, 462); plant(c, 880, 488, .7, '#e8574f');
}
const TAU = Math.PI * 2;
// ---------------------------------------------------------------- LOBBY
function lobby(c, R, t) {
  backdrop(c, R); windowArch(c, R, 450, 200, 44); curtain(c, 450 - 106, 56, 96, 340, -1, '#7a4ad8'); curtain(c, 450 + 106, 56, 96, 340, 1, '#7a4ad8');
  // photo booth (left): striped curtain
  slab(c, 40, 170, 200, 232, { fill: '#7a4ad8', shade: '#5b33b0', r: 12, lw: 5.5 }); slab(c, 60, 220, 160, 182, { fill: '#2a1a33', r: 8, lw: 4 });
  shapeS(c, [[60, 220], [140, 232], [140, 402], [60, 402]], { fill: '#ff5c8a', shade: '#d93e6a', lw: 4, wob: 1.5, seed: 3, shadeDx: 6, shadeDy: 0 }); shapeS(c, [[220, 220], [140, 232], [140, 402], [220, 402]], { fill: '#ffd93d', shade: '#e8b630', lw: 4, wob: 1.5, seed: 4, shadeDx: -6, shadeDy: 0 });
  slab(c, 70, 182, 140, 30, { fill: '#ffd96b', r: 8, lw: 4 }); for (let i = 0; i < 7; i++) el(c, 84 + i * 20, 197, 5, 5, i % 2 ? '#ff5c8a' : '#fff', INK, 1.8);
  el(c, 140, 330, 22, 22, '#2a1a33', '#fff', 4); el(c, 140, 330, 11, 11, '#6ec3ff'); el(c, 135, 325, 3.5, 3.5, '#fff');
  // reception desk (footprint 300..600) with bell + sign
  slab(c, 300, 362, 300, 70, { fill: '#c98a4b', shade: '#a96f38', r: 8, lw: 5 }); slab(c, 288, 346, 324, 22, { fill: '#fff6ea', shade: '#e8dcc4', r: 8, lw: 4.5 });
  for (let i = 0; i < 4; i++) ln(c, [[345 + i * 72, 376], [345 + i * 72, 426]], '#9b6330', 3);
  shapeS(c, [[420, 346], [420, 330], [440, 316], [470, 316], [490, 330], [490, 346]], { fill: '#ffd96b', shade: '#e8b630', lw: 4.5, wob: .8, seed: 4, shadeDx: -5, shadeDy: -4 }); el(c, 455, 312, 6, 6, '#ffd96b', INK, 3); slab(c, 408, 346, 94, 8, { fill: '#a96f38', r: 4, lw: 3.5 });
  slab(c, 330, 268, 96, 72, { fill: '#fffdf4', r: 8, lw: 4.5 }); heart(c, 378, 292, 11, '#ff4d6a'); ln(c, [[348, 316], [408, 316]], '#7a4ad8', 4); ln(c, [[356, 326], [400, 326]], '#8fd4ff', 3.5);
  // small guest book + pen cup
  slab(c, 520, 328, 56, 18, { fill: '#7a4ad8', r: 4, lw: 3.5 }); slab(c, 524, 324, 48, 6, { fill: '#fff6ea', r: 2, lw: 2.5 }); slab(c, 570, 308, 20, 24, { fill: '#8fd4ff', r: 4, lw: 3.5 }); ln(c, [[576, 308], [574, 294]], '#ff5c8a', 4); ln(c, [[584, 308], [588, 296]], '#ffd93d', 4);
  // boutique shelf with hats (right)
  wood(c, 690, 330, 190, 14, { r: 6 }); wood(c, 690, 250, 190, 14, { r: 6 }); wood(c, 696, 264, 10, 66, { r: 3 }); wood(c, 864, 264, 10, 66, { r: 3 });
  // sun hat
  shapeS(c, [[710, 330], [704, 322], [724, 312], [770, 312], [790, 322], [786, 330]], { fill: '#ffe27a', shade: '#f0c040', lw: 4, wob: .8, seed: 5 }); shapeS(c, [[730, 314], [734, 290], [768, 290], [772, 314]], { fill: '#ffe27a', shade: '#f0c040', lw: 4, wob: .6, seed: 6 }); ln(c, [[730, 304], [772, 304]], '#ff5c8a', 6);
  // witch hat
  shapeS(c, [[800, 330], [796, 322], [822, 318], [850, 322], [848, 330]], { fill: '#5b33b0', lw: 4, wob: .6, seed: 7 }); shapeS(c, [[816, 320], [826, 270], [842, 300], [842, 320]], { fill: '#7a4ad8', shade: '#5b33b0', lw: 4, wob: .6, seed: 8 }); star(c, 830, 304, 6, '#ffd93d');
  // bow, crown and glasses on upper shelf
  shapeS(c, [[714, 250], [706, 232], [726, 224], [738, 238], [750, 224], [770, 232], [762, 250]], { fill: '#ff8fb7', shade: '#e0608f', lw: 4, wob: .6, seed: 9 }); el(c, 738, 240, 7, 7, '#ff5c8a', INK, 3);
  shapeS(c, [[790, 250], [788, 222], [800, 234], [812, 214], [824, 234], [836, 222], [836, 250]], { fill: '#ffd93d', shade: '#e8b630', lw: 4, wob: .6, seed: 10 }); el(c, 812, 222, 4, 4, '#ff4d6a', INK, 1.8);
  el(c, 846, 242, 10, 9, null, INK, 4); el(c, 868, 242, 10, 9, null, INK, 4); ln(c, [[856, 242], [858, 242]], INK, 4);
  // price tag + CLOSED / OPEN hanging sign
  slab(c, 700, 196, 70, 28, { fill: '#fffdf4', r: 6, lw: 4 }); el(c, 718, 210, 6, 6, '#ffd93d', INK, 2.5); ln(c, [[730, 210], [760, 210]], INK, 3); ln(c, [[718, 196], [718, 180]], INK, 2.5);
  plant(c, 280, 488, .8, '#7a4ad8'); plant(c, 620, 492, .8, '#ff7a5c', '#3f9a5b'); framePic(c, 20, 66, 140, 90, (c2, x, y, w, h) => { c2.fillStyle = '#ffd96b'; c2.beginPath(); c2.arc(x + w * .75, y + h * .3, 16, 0, TAU); c2.fill(); c2.fillStyle = '#7ccd6a'; c2.beginPath(); c2.moveTo(x, y + h); c2.quadraticCurveTo(x + w * .35, y + h * .3, x + w, y + h); c2.fill(); });
}
// ---------------------------------------------------------------- VET
function vet(c, R, t) {
  backdrop(c, R); windowArch(c, R, 640, 170, 70); curtain(c, 640 - 96, 46, 110, 320, -1, '#3fa7a0'); curtain(c, 640 + 96, 46, 110, 320, 1, '#3fa7a0');
  // eye chart
  slab(c, 70, 90, 120, 150, { fill: '#fffdf4', r: 8, lw: 4.5 }); ['E', 'F P', 'T O Z', 'L P E D'].forEach((s, i) => { c.fillStyle = INK; c.font = `800 ${34 - i * 7}px Fredoka, sans-serif`; c.textAlign = 'center'; c.fillText(s, 130, 130 + i * 30); });
  // bone-xray poster
  slab(c, 220, 100, 130, 110, { fill: '#2a4a68', r: 8, lw: 4.5 }); c.save(); c.strokeStyle = '#e8f6ff'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(250, 180); c.lineTo(320, 130); c.stroke(); for (const [x, y] of [[246, 170], [254, 188], [316, 122], [326, 138]]) { c.beginPath(); c.arc(x, y, 7, 0, TAU); c.fillStyle = '#e8f6ff'; c.fill(); } c.restore();
  // medicine cabinet w/ red cross, door ajar bottles
  slab(c, 420, 110, 150, 190, { fill: '#ffffff', shade: '#dde6ea', r: 10, lw: 5 }); ln(c, [[420, 205], [570, 205]], INK, 4); slab(c, 478, 130, 34, 34, { fill: '#ff5c6c', r: 6, lw: 3.5 }); c.fillStyle = '#fff'; c.fillRect(492, 136, 6, 22); c.fillRect(484, 144, 22, 6);
  bottle(c, 446, 202, .55, 'squeeze', '#7fe0c8', 'leaf', '#2d8a78'); bottle(c, 482, 202, .55, 'potion', '#ffb15f', 'star', '#fff6b0'); bottle(c, 520, 202, .55, 'pump', '#8fd4ff', 'drop', '#2a7ab8'); bottle(c, 552, 202, .5, 'jar', '#ff8fb7');
  // exam table with paw-print mat (footprint 300..560, 410..470)
  const tx = 430, ty = 450; shadow(c, tx, ty + 24, 150); for (const dx of [-110, 110]) slab(c, tx + dx - 10, ty - 6, 20, 40, { fill: '#d0d8e4', shade: '#9aa6ba', r: 5, lw: 4 });
  slab(c, tx - 130, ty - 36, 260, 38, { fill: '#7fe0d0', shade: '#4cc0b0', r: 16, lw: 5.5 }); slab(c, tx - 120, ty - 52, 240, 22, { fill: '#e8fbf6', shade: '#c0e6dc', r: 12, lw: 4 });
  for (const [x, y, s] of [[-52, -42, .8], [-14, -42, .9], [30, -42, .8], [66, -42, .9]]) { el(c, tx + x, y + ty + 1, 9 * s, 7 * s, '#7fe0d0'); for (const [a, b] of [[-9, -7], [-3, -11], [4, -11], [10, -7]]) el(c, tx + x + a * s, ty + y + b * s * .7, 3 * s, 3.4 * s, '#7fe0d0'); }
  // stethoscope hanging, thermometer, bandage roll on wall hook
  ln(c, [[610, 110], [610, 150]], INK, 3); c.beginPath(); c.arc(610, 190, 38, -Math.PI * .85, -Math.PI * .15, true); c.strokeStyle = INK; c.lineWidth = 8; c.stroke(); c.strokeStyle = '#5fb1ee'; c.lineWidth = 4; c.stroke(); el(c, 610, 232, 11, 11, '#d0d8e4', INK, 4);
  // pet scale (circle 760,440) with big dial
  const sx = 760; shadow(c, sx, 458, 50); slab(c, sx - 40, 430, 80, 28, { fill: '#ff9fb0', shade: '#e0707f', r: 10, lw: 5 }); slab(c, sx - 8, 380, 16, 54, { fill: '#d0d8e4', r: 4, lw: 4 }); el(c, sx, 366, 34, 34, '#fffdf4', INK, 5); for (let i = 0; i < 8; i++) { const a = -Math.PI * .9 + i * .35; ln(c, [[sx + Math.cos(a) * 24, 366 + Math.sin(a) * 24], [sx + Math.cos(a) * 30, 366 + Math.sin(a) * 30]], INK, 2.5); } ln(c, [[sx, 366], [sx + 14, 352]], '#ff4d6a', 4); el(c, sx, 366, 4, 4, INK);
  plant(c, 880, 490, .7, '#3fa7a0'); slab(c, 60, 270, 100, 130, { fill: '#fffdf4', shade: '#e8dcc4', r: 8, lw: 4.5 }); slab(c, 70, 282, 80, 26, { fill: '#8fd4ff', r: 5, lw: 3.5 }); slab(c, 70, 316, 80, 26, { fill: '#ff9fc0', r: 5, lw: 3.5 }); slab(c, 70, 350, 80, 26, { fill: '#ffe27a', r: 5, lw: 3.5 });
}
// ---------------------------------------------------------------- YARD
function yard(c, R, t) {
  const g = c.createLinearGradient(0, 0, 0, FY); g.addColorStop(0, '#86cfff'); g.addColorStop(1, '#d8f1ff'); c.fillStyle = g; c.fillRect(0, 0, RW, FY);
  // clouds + hills
  for (const [x, y, s] of [[160, 90, 1], [560, 60, 1.3], [800, 130, .8]]) { c.save(); c.translate(x + Math.sin(t * .1 + x) * 12, y); c.scale(s, s); for (const [a, b, r] of [[0, 0, 30], [32, -10, 38], [68, 0, 28], [30, 12, 34]]) el(c, a, b, r, r * .8, '#fff'); c.restore(); }
  c.fillStyle = '#a3dd8a'; c.beginPath(); c.moveTo(0, FY); c.quadraticCurveTo(220, 250, 440, 330); c.quadraticCurveTo(660, 270, 900, 340); c.lineTo(900, FY); c.fill(); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  c.fillStyle = R.floor; c.fillRect(0, FY, RW, 540 - FY); c.strokeStyle = R.floor2; c.lineWidth = 3; for (let y = FY + 24; y < 540; y += 30) { c.beginPath(); for (let x = 0; x < RW; x += 40) { c.moveTo(x, y); c.lineTo(x + 6, y - 9); c.moveTo(x + 20, y + 8); c.lineTo(x + 24, y - 1); } c.stroke(); }
  // picket fence along back
  for (let x = 6; x < RW; x += 46) { shapeS(c, [[x, FY + 6], [x, FY - 52], [x + 17, FY - 70], [x + 34, FY - 52], [x + 34, FY + 6]], { fill: '#fff6ea', shade: '#e8dcc4', lw: 4, wob: .6, seed: 3 + (x % 7), shadeDx: -4, shadeDy: -2 }); }
  ln(c, [[0, FY - 30], [RW, FY - 30]], INK, 5); c.beginPath(); c.moveTo(0, FY - 30); c.lineTo(RW, FY - 30); c.strokeStyle = '#fff6ea'; c.lineWidth = 2; c.stroke();
  // big apple tree (trunk circle at 560,426)
  const tx = 560; shadow(c, tx, 432, 60); shapeS(c, [[tx - 20, 430], [tx - 14, 340], [tx - 28, 270], [tx - 6, 260], [tx + 12, 280], [tx + 18, 340], [tx + 26, 432]], { fill: '#a96f38', shade: '#8a5326', lw: 5, wob: 2, seed: 4, shadeDx: -7, shadeDy: -2 });
  for (const [a, b, r, col] of [[-70, 220, 70, '#4fb36a'], [70, 210, 76, '#4fb36a'], [0, 160, 86, '#58c274'], [-30, 250, 56, '#3f9a5b'], [48, 250, 50, '#3f9a5b']]) { el(c, tx + a, b, r, r * .85, col, INK, 5); }
  for (const [a, b] of [[-60, 190], [20, 140], [76, 220], [-10, 240], [-90, 244], [40, 190]]) { el(c, tx + a, b, 10, 10, '#ff4d6a', INK, 3.2); ln(c, [[tx + a, b - 10], [tx + a + 3, b - 15]], '#3f9a5b', 3); }
  // pond (circle 260,466)
  const px = 260, py = 466; el(c, px, py + 8, 112, 54, '#6b9a4e', INK, 6); el(c, px, py, 100, 46, '#6ec3ff', INK, 5); el(c, px - 22, py - 12, 40, 12, 'rgba(255,255,255,.4)'); for (const [a, b] of [[-50, 6], [-20, 18], [44, 4]]) { el(c, px + a, py + b, 12, 7, '#4fb36a', INK, 3); } shapeS(c, [[px + 36, py - 4], [px + 44, py - 20], [px + 56, py - 4]], { fill: '#ff8fb7', lw: 3.5, wob: .5, seed: 2 });
  // doghouse-style kennel + flower bed (box 700..860)
  slab(c, 700, 330, 120, 94, { fill: '#e8574f', shade: '#c4403a', r: 6, lw: 5 }); shapeS(c, [[690, 334], [760, 270], [830, 334]], { fill: '#a96f38', shade: '#8a5326', lw: 5, wob: 1, seed: 6 }); c.beginPath(); c.arc(760, 390, 26, Math.PI, 0); c.lineTo(786, 424); c.lineTo(734, 424); c.closePath(); c.fillStyle = '#2a1a33'; c.fill(); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); slab(c, 738, 312, 44, 14, { fill: '#fffdf4', r: 4, lw: 3 }); ln(c, [[748, 319], [772, 319]], '#e8574f', 3);
  for (let i = 0; i < 5; i++) { const x = 820 + i * 14, h = 20 + (i % 3) * 8; ln(c, [[x, 428], [x, 428 - h]], '#3f9a5b', 4); el(c, x, 428 - h - 6, 8, 8, ['#ff8fb7', '#ffd93d', '#fff', '#b589f7', '#ff7a5c'][i], INK, 2.8); }
  // ball + bone toys on lawn
  el(c, 120, 500, 16, 16, '#ff5c8a', INK, 4); ln(c, [[106, 496], [134, 504]], '#fff', 3); slab(c, 380, 505, 50, 12, { fill: '#fff6ea', r: 6, lw: 3.5 });
}
const ROOM_DRAW = [kitchen, spa, lobby, vet, yard];
export function drawRoomN(c, i, t, vis = { x0: 0, x1: 1e9 }) {
  const R = ROOMS[i]; c.save(); c.translate(i * RW, 0); c.beginPath(); c.rect(0, 0, RW, 540); c.clip(); ROOM_DRAW[i](c, R, t); c.restore();
}
export function drawPartition(c, k) { // pillar between rooms k-1 and k with an open arch
  const x = k * RW; c.save(); c.translate(x, 0);
  slab(c, -16, 0, 32, FY + 6, { fill: '#6a4a3a', shade: '#523628', r: 0, lw: 4 }); c.beginPath(); c.rect(-14, FY - 150, 28, 150); c.fillStyle = 'rgba(0,0,0,0)'; c.fill();
  c.restore();
}
