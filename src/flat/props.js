// Hand-drawn flat props: every one is a specific, characterful object (no filler shapes).
import { shapeS } from './art.js';
export const INK = '#4a2a1c';
const TAU = Math.PI * 2;
export function el(c, x, y, rx, ry, fill, line, lw = 0, rot = 0) { c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, TAU); if (fill) { c.fillStyle = fill; c.fill(); } if (line && lw) { c.strokeStyle = line; c.lineWidth = lw; c.stroke(); } }
export function ln(c, pts, col = INK, lw = 3, close = false) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); if (close) c.closePath(); c.strokeStyle = col; c.lineWidth = lw; c.lineCap = c.lineJoin = 'round'; c.stroke(); }
/** Rounded slab with one-step bottom shade and ink outline. (x,y) top-left. */
export function slab(c, x, y, w, h, o = {}) {
  const { fill = '#c98a4b', shade, r = 6, lw = 4, line = INK, shadeH = .22 } = o;
  const path = () => { c.beginPath(); c.roundRect(x, y, w, h, r); };
  path(); c.fillStyle = fill; c.fill();
  if (shade) { c.save(); path(); c.clip(); c.fillStyle = shade; c.fillRect(x, y + h * (1 - shadeH), w, h * shadeH); c.restore(); }
  if (lw) { path(); c.strokeStyle = line; c.lineWidth = lw; c.lineJoin = 'round'; c.stroke(); }
}
export function shadow(c, x, y, rx, ry = rx * .22) { el(c, x, y, rx, ry, 'rgba(50,20,50,.24)'); }
export function wood(c, x, y, w, h, o = {}) {
  slab(c, x, y, w, h, { fill: '#c98a4b', shade: '#a96f38', r: 5, ...o });
  c.save(); c.beginPath(); c.roundRect(x, y, w, h, 5); c.clip(); c.strokeStyle = '#9b6330'; c.lineWidth = 2; c.lineCap = 'round';
  for (let i = 0; i < 3; i++) { const gy = y + h * (.25 + i * .25); c.beginPath(); c.moveTo(x + 8 + i * 9, gy); c.bezierCurveTo(x + w * .3, gy - 3, x + w * .6, gy + 3, x + w - 10 - i * 14, gy - 1); c.stroke(); }
  c.restore(); if (w > 60) { el(c, x + w * .78, y + h * .5, 5, 3.5, null, '#9b6330', 2); }
}
const fillLabel = (c, x, y, w, h, col, glyph) => { slab(c, x, y, w, h, { fill: '#fffdf4', r: 3, lw: 2.5 }); if (glyph === 'heart') heart(c, x + w / 2, y + h / 2, Math.min(w, h) * .3, col); else if (glyph === 'star') star(c, x + w / 2, y + h / 2, Math.min(w, h) * .32, col); else if (glyph === 'drop') { c.beginPath(); c.moveTo(x + w / 2, y + h * .2); c.quadraticCurveTo(x + w * .8, y + h * .6, x + w / 2, y + h * .8); c.quadraticCurveTo(x + w * .2, y + h * .6, x + w / 2, y + h * .2); c.fillStyle = col; c.fill(); } else if (glyph === 'leaf') { el(c, x + w / 2, y + h / 2, w * .2, h * .3, col, null, 0, .7); } else if (glyph === 'bubbles') { el(c, x + w * .38, y + h * .6, w * .12, w * .12, col); el(c, x + w * .6, y + h * .4, w * .16, w * .16, col); } };
export function heart(c, x, y, s, col) { c.beginPath(); c.moveTo(x, y + s * .9); c.bezierCurveTo(x - s * 1.6, y - s * .2, x - s * .6, y - s * 1.2, x, y - s * .3); c.bezierCurveTo(x + s * .6, y - s * 1.2, x + s * 1.6, y - s * .2, x, y + s * .9); c.fillStyle = col; c.fill(); }
export function star(c, x, y, s, col) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * .5 : s; c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } c.closePath(); c.fillStyle = col; c.fill(); }

/** Bottles. origin = bottom-centre. kind: pump | squeeze | spray | jar | perfume | potion */
export function bottle(c, x, y, s, kind, col, glyph = 'heart', col2 = '#fff') {
  c.save(); c.translate(x, y); c.scale(s, s);
  const sh = { fill: col, shade: 'rgba(0,0,0,0)', lw: 4 };
  const darker = (h => h)(col);
  if (kind === 'pump') {       // tall shampoo bottle with pump head
    shapeS(c, [[-17, 0], [-19, -34], [-14, -62], [-8, -66], [8, -66], [14, -62], [19, -34], [17, 0]], { fill: col, shade: 'rgba(60,20,70,.22)', lw: 4, seed: 4, wob: 1.2, shadeDx: -6, shadeDy: -2 });
    slab(c, -6, -76, 12, 12, { fill: '#fff6ea', r: 3, lw: 3 }); ln(c, [[0, -76], [0, -84], [14, -84], [18, -80]], INK, 4); fillLabel(c, -12, -50, 24, 34, col2, glyph);
  } else if (kind === 'squeeze') { // tube conditioner standing on cap
    shapeS(c, [[-16, 0], [-18, -14], [-20, -62], [-10, -74], [10, -74], [20, -62], [18, -14], [16, 0]], { fill: col, shade: 'rgba(60,20,70,.22)', lw: 4, seed: 7, wob: 1, shadeDx: -6, shadeDy: -2 });
    slab(c, -13, 0, 26, -8, { fill: '#fff6ea', r: 3, lw: 3 }); ln(c, [[-16, -74], [-12, -80], [12, -80], [16, -74]], INK, 3.5); ln(c, [[-17, -70], [17, -70]], 'rgba(60,20,70,.4)', 2); fillLabel(c, -11, -58, 22, 32, col2, glyph);
  } else if (kind === 'spray') { // trigger spray bottle
    shapeS(c, [[-16, 0], [-17, -36], [-10, -48], [10, -48], [17, -36], [16, 0]], { fill: col, shade: 'rgba(40,40,80,.2)', lw: 4, seed: 9, wob: 1, shadeDx: -6, shadeDy: -2 });
    slab(c, -9, -60, 18, 14, { fill: '#ffffff', r: 3, lw: 3 }); shapeS(c, [[-9, -64], [22, -62], [26, -52], [10, -52], [8, -56], [-9, -56]], { fill: '#ffffff', lw: 3.5, wob: .6, seed: 3 });
    ln(c, [[14, -52], [18, -42]], INK, 4); fillLabel(c, -11, -34, 22, 26, col2, glyph);
  } else if (kind === 'jar') {   // cotton-puff jar with lid
    shapeS(c, [[-22, 0], [-25, -26], [-22, -40], [22, -40], [25, -26], [22, 0]], { fill: 'rgba(210,240,255,.9)', shade: 'rgba(120,170,210,.4)', lw: 4, seed: 11, wob: 1, shadeDx: -6, shadeDy: -2 });
    for (let i = 0; i < 4; i++) el(c, -13 + i * 9, -14 - (i % 2) * 8, 8, 7, '#fff8fb', INK, 2);
    slab(c, -24, -52, 48, 14, { fill: col, shade: 'rgba(60,20,70,.25)', r: 5, lw: 4 }); el(c, 0, -57, 8, 3, 'rgba(255,255,255,.55)');
  } else if (kind === 'perfume') {
    shapeS(c, [[-20, 0], [-24, -22], [-16, -44], [16, -44], [24, -22], [20, 0]], { fill: col, shade: 'rgba(60,20,70,.22)', lw: 4, seed: 13, wob: 1, shadeDx: -6, shadeDy: -3 });
    slab(c, -6, -56, 12, 12, { fill: '#e8c25a', r: 3, lw: 3 }); el(c, 0, -66, 11, 11, '#ffd96b', INK, 3.5); star(c, 0, -66, 5, '#fff'); heart(c, 0, -20, 7, col2);
  } else {                        // potion: round-bellied flask with cork + sparkle
    shapeS(c, [[-8, -64], [-8, -50], [-24, -30], [-22, -8], [-8, 0], [8, 0], [22, -8], [24, -30], [8, -50], [8, -64]], { fill: col, shade: 'rgba(60,20,70,.22)', lw: 4, seed: 15, wob: 1, shadeDx: -6, shadeDy: -3 });
    slab(c, -9, -76, 18, 14, { fill: '#c98a4b', r: 3, lw: 3.5 }); el(c, -9, -24, 5, 8, 'rgba(255,255,255,.7)', null, 0, .4); star(c, 9, -26, 6, col2);
  }
  c.restore();
}

/** Tools. origin = centre, ~70 px long unless scaled. */
export function comb(c, x, y, s, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  slab(c, -36, -9, 72, 14, { fill: '#ff8fb7', shade: '#e0608f', r: 6, lw: 4 });
  for (let i = 0; i < 9; i++) slab(c, -33 + i * 8, 5, 5, 17, { fill: '#ff8fb7', r: 2, lw: 2.8 }); el(c, -28, -2, 3.5, 3.5, '#fff'); c.restore(); }
export function scissors(c, x, y, s, rot = 0, open = .3) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  for (const sg of [-1, 1]) { c.save(); c.rotate(sg * open * .5);
    shapeS(c, [[0, 2], [-4, -22], [0, -50], [6, -22]], { fill: '#e8eef5', shade: '#b8c4d4', lw: 3.5, wob: .5, seed: 2 + sg, shadeDx: sg * 3, shadeDy: 0 });
    el(c, sg * 11, 22, 11, 14, null, '#ff6f9d', 6.5); el(c, sg * 11, 22, 11, 14, null, INK, 1.8); c.restore(); }
  el(c, 0, 0, 4, 4, '#ffd96b', INK, 2.5); c.restore(); }
export function brush(c, x, y, s, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shapeS(c, [[-12, -50], [12, -50], [14, -34], [8, -26], [-8, -26], [-14, -34]], { fill: '#8fd4ff', shade: '#5fb1ee', lw: 4, wob: .8, seed: 5, shadeDx: -3, shadeDy: -3 });
  slab(c, -6, -26, 12, 52, { fill: '#c98a4b', shade: '#a96f38', r: 5, lw: 4 }); c.fillStyle = INK; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) el(c, -7 + j * 7, -44 + i * 7, 1.8, 1.8, INK); c.restore(); }
export function hairdryer(c, x, y, s, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shapeS(c, [[-34, -14], [10, -20], [34, -10], [34, 12], [10, 18], [-34, 10]], { fill: '#b97fe8', shade: '#8d56c4', lw: 4, wob: .8, seed: 6, shadeDx: -4, shadeDy: -6 });
  slab(c, -42, -12, 10, 22, { fill: '#e8eef5', shade: '#b8c4d4', r: 3, lw: 3.5 }); slab(c, 6, 10, 15, 34, { fill: '#8d56c4', shade: '#6d3ea2', r: 5, lw: 4 });
  el(c, 20, -4, 5, 5, '#ffd96b', INK, 2.5); for (let i = 0; i < 3; i++) ln(c, [[-26 + i * 6, -8], [-26 + i * 6, 6]], 'rgba(255,255,255,.55)', 2.5); c.restore(); }
export function nailClipper(c, x, y, s, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shapeS(c, [[-28, 4], [-26, -6], [10, -10], [30, -4], [30, 6], [10, 6]], { fill: '#d0d8e4', shade: '#9aa6ba', lw: 3.8, wob: .5, seed: 8, shadeDx: -3, shadeDy: -3 });
  shapeS(c, [[-26, -8], [8, -20], [28, -12], [10, -12]], { fill: '#e8eef5', lw: 3.5, wob: .4, seed: 9 }); el(c, -29, 0, 5, 5, null, '#ff6f9d', 3.5); c.restore(); }
export function duck(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s);
  shapeS(c, [[-26, -4], [-28, -22], [-10, -32], [14, -30], [30, -20], [28, -4], [0, 4]], { fill: '#ffd93d', shade: '#f0b11c', lw: 4, wob: 1, seed: 21, shadeDx: -5, shadeDy: -5 });
  shapeS(c, [[-6, -40], [-10, -56], [6, -66], [22, -58], [22, -40], [10, -30]], { fill: '#ffd93d', shade: '#f0b11c', lw: 4, wob: .8, seed: 22, shadeDx: -4, shadeDy: -4 });
  shapeS(c, [[20, -52], [34, -50], [34, -44], [20, -44]], { fill: '#ff8a3d', lw: 3, wob: .4, seed: 23 }); el(c, 12, -54, 3, 3.6, INK); el(c, 11, -55, 1, 1, '#fff'); el(c, 4, -46, 4, 3, 'rgba(255,110,130,.6)'); c.restore(); }
export function towels(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s);
  [['#8fd4ff', 0, 60], ['#ff9fc0', -14, 54], ['#ffe27a', -26, 62]].forEach(([col, dy, w], i) => { slab(c, -w / 2, dy - 18, w, 16, { fill: col, shade: 'rgba(40,20,80,.18)', r: 5, lw: 3.8 }); ln(c, [[-w / 2 + 10, dy - 12], [w / 2 - 10, dy - 12]], 'rgba(255,255,255,.7)', 2.4); }); c.restore(); }
export function towelsStackOrigin() {}
export function plant(c, x, y, s, pot = '#b04c8f', leaf = '#3f9a5b', leaf2 = '#4fb36a') { c.save(); c.translate(x, y); c.scale(s, s);
  shadow(c, 0, 4, 46);
  for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .36, lx = Math.cos(a) * 80, ly = -44 + Math.sin(a) * 100, sg = Math.sign(lx || 1);
    shapeS(c, [[0, -44], [lx / 2 - 22 * sg, (-44 + ly) / 2 - 10], [lx, ly], [lx / 2 + 18 * sg, (-44 + ly) / 2 - 2]], { fill: i % 2 ? leaf : leaf2, shade: 'rgba(20,80,40,.35)', lw: 4, wob: 2, seed: 20 + i, shadeDx: -4, shadeDy: -4 }); }
  shapeS(c, [[-38, -48], [38, -48], [30, 0], [-30, 0]], { fill: pot, shade: 'rgba(60,10,50,.3)', lw: 5, seed: 31, wob: 2, shadeDx: -8, shadeDy: -4 }); slab(c, -42, -56, 84, 12, { fill: pot, shade: 'rgba(60,10,50,.3)', r: 5, lw: 4.5 }); c.restore(); }
export function framePic(c, x, y, w, h, draw) { slab(c, x, y, w, h, { fill: '#fff8ea', r: 6, lw: 4.5 }); slab(c, x + 8, y + 8, w - 16, h - 16, { fill: '#cfeaf7', r: 3, lw: 2.5 }); c.save(); c.beginPath(); c.rect(x + 9, y + 9, w - 18, h - 18); c.clip(); draw?.(c, x + 9, y + 9, w - 18, h - 18); c.restore(); }
