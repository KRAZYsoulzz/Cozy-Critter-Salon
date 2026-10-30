// Flat 2D cartoon art, drawn entirely in code (canvas 2D). No external assets.
const LINE = '#4a2a1c';
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

/** Closed smooth spline through points (Catmull-Rom -> bezier) with optional hand wobble. */
export function spline(ctx, pts, wob = 0, seed = 1, closed = true) {
  const r = rng(seed), P = pts.map(([x, y]) => [x + (r() - .5) * wob, y + (r() - .5) * wob]);
  const n = P.length; ctx.beginPath();
  const g = i => P[(i + n) % n];
  ctx.moveTo(P[0][0], P[0][1]);
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = closed ? g(i - 1) : P[Math.max(0, i - 1)], p1 = g(i), p2 = g(i + 1), p3 = closed ? g(i + 2) : P[Math.min(n - 1, i + 2)];
    ctx.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
  }
  if (closed) ctx.closePath();
}

/** Fill + one shade step (bottom-right crescent) + wobbly dark outline. */
export function shape(ctx, pts, o = {}) {
  const { fill = '#c98a4b', shade, line = LINE, lw = 5, wob = 3, seed = 1, shadeDx = -9, shadeDy = -11 } = o;
  spline(ctx, pts, wob, seed);
  ctx.fillStyle = fill; ctx.fill();
  if (shade) {
    ctx.save(); ctx.clip(); ctx.fillStyle = shade; ctx.beginPath();
    ctx.rect(-2000, -2000, 4000, 4000);
    // shade = everything of the shape not covered by an offset copy of itself (even-odd)
    ctx.translate(shadeDx, shadeDy); spline(ctx, pts, wob, seed);
    ctx.restore(); ctx.save(); spline(ctx, pts, wob, seed); ctx.clip();
    ctx.fillStyle = shade; ctx.fillRect(-2000, -2000, 4000, 4000);
    ctx.translate(shadeDx, shadeDy); spline(ctx, pts, wob, seed);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.restore();
  }
  if (lw) { spline(ctx, pts, wob, seed); ctx.strokeStyle = line; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); }
}

/** Simpler, robust shade: draw shape, then shade crescent via offscreen mask. */
export function shapeS(ctx, pts, o = {}) {
  const { fill = '#c98a4b', shade, line = LINE, lw = 5, wob = 3, seed = 1, shadeDx = -9, shadeDy = -11 } = o;
  spline(ctx, pts, wob, seed); ctx.fillStyle = fill; ctx.fill();
  if (shade) {
    const c = ctx.canvas, off = shapeS._off || (shapeS._off = document.createElement('canvas'));
    off.width = c.width; off.height = c.height;
    const m = off.getContext('2d'); m.setTransform(ctx.getTransform());
    m.clearRect(-5000, -5000, 10000, 10000); m.save();
    m.fillStyle = shade; spline(m, pts, wob, seed); m.fill();
    m.globalCompositeOperation = 'destination-out'; m.translate(shadeDx, shadeDy); spline(m, pts, wob, seed); m.fill(); m.restore();
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(off, 0, 0); ctx.restore();
  }
  if (lw) { spline(ctx, pts, wob, seed); ctx.strokeStyle = line; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.stroke(); }
}

function ellipse(ctx, x, y, rx, ry, fill, line, lw = 0, rot = 0) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (line && lw) { ctx.strokeStyle = line; ctx.lineWidth = lw; ctx.stroke(); }
}

/** Huge cartoon eye. expr: 'happy' | 'sad' | 'wow' | 'idle' | 'blink' */
export function eye(ctx, x, y, s, expr = 'idle', side = 1, look = [0, 0]) {
  ctx.save(); ctx.translate(x, y); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (expr === 'happy' || expr === 'blink') {
    ctx.strokeStyle = LINE; ctx.lineWidth = s * .16;
    ctx.beginPath(); ctx.arc(0, s * .12, s * .5, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    // lash flick
    ctx.beginPath(); ctx.moveTo(side * s * .46, -s * .02); ctx.lineTo(side * s * .72, -s * .16); ctx.stroke();
    ctx.restore(); return;
  }
  const big = expr === 'wow' ? 1.15 : 1;
  ellipse(ctx, 0, 0, s * .62 * big, s * .72 * big, '#fffdf6', LINE, s * .1);
  const ix = look[0] * s * .14, iy = look[1] * s * .14 + (expr === 'sad' ? s * .1 : 0);
  ellipse(ctx, ix, iy, s * .46 * big, s * .56 * big, '#5a2e1c');
  ellipse(ctx, ix, iy + s * .06, s * .3 * big, s * .38 * big, '#2a120c');
  ellipse(ctx, ix - s * .16, iy - s * .22, s * .17, s * .2, '#fff', null, 0, -.3);   // main highlight
  ellipse(ctx, ix + s * .15, iy + s * .2, s * .08, s * .09, '#fff');                   // small highlight
  // lashes
  ctx.strokeStyle = LINE; ctx.lineWidth = s * .12;
  ctx.beginPath(); ctx.moveTo(side * s * .5, -s * .38); ctx.lineTo(side * s * .78, -s * .55); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(side * s * .56, -s * .16); ctx.lineTo(side * s * .86, -s * .24); ctx.stroke();
  // upper lid
  ctx.lineWidth = s * .13; ctx.beginPath(); ctx.arc(0, 0, s * .66 * big, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
  if (expr === 'sad') { // drooping lid + tear
    ctx.fillStyle = 'rgba(90,50,30,.0)';
    ellipse(ctx, side * s * .3, s * .85, s * .1, s * .15, '#bfe6ff', LINE, s * .04);
  }
  ctx.restore();
}

function mouth(ctx, x, y, s, expr) {
  ctx.save(); ctx.translate(x, y); ctx.strokeStyle = LINE; ctx.lineWidth = s * .09; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (expr === 'happy') { ctx.beginPath(); ctx.moveTo(-s * .6, 0); ctx.quadraticCurveTo(0, s * .85, s * .6, 0); ctx.closePath(); ctx.fillStyle = '#7a1f2b'; ctx.fill(); ctx.stroke();
    ctx.save(); ctx.clip(); ellipse(ctx, 0, s * .55, s * .32, s * .24, '#ff7a93'); ctx.restore(); }
  else if (expr === 'wow') { ellipse(ctx, 0, s * .2, s * .26, s * .34, '#7a1f2b', LINE, s * .09); ellipse(ctx, 0, s * .34, s * .15, s * .12, '#ff7a93'); }
  else if (expr === 'sad') { ctx.beginPath(); ctx.moveTo(-s * .4, s * .3); ctx.quadraticCurveTo(0, -s * .2, s * .4, s * .3); ctx.stroke(); }
  else { ctx.beginPath(); ctx.moveTo(-s * .4, 0); ctx.quadraticCurveTo(0, s * .45, s * .4, 0); ctx.stroke(); }
  ctx.restore();
}

function blush(ctx, x, y, s) { ellipse(ctx, x, y, s, s * .62, 'rgba(255,110,130,.55)'); }

/** Squash-stretch: returns [sx, sy] from time + reaction. */
function squash(t, expr) {
  const b = Math.sin(t * 2.4), k = expr === 'happy' ? 1.8 : expr === 'wow' ? 0 : 1;
  const hop = expr === 'happy' ? Math.abs(Math.sin(t * 5)) : 0;
  return { sx: 1 - b * .018 * k - hop * .06, sy: 1 + b * .03 * k + hop * .1, hop: hop * 26 + (expr === 'wow' ? 14 : 0) };
}

/** Capybara, sitting, front view. Origin = bottom-centre between feet. Size ~ 300 x 330. */
export function drawCapybara(ctx, t = 0, expr = 'idle', blinkT = 0) {
  const q = squash(t, expr); ctx.save(); ctx.translate(0, -q.hop); ctx.scale(q.sx, q.sy);
  const FUR = '#b97a3f', FUR2 = '#8f5a2c', BELLY = '#e8bd82', EAR = '#9a6230';
  // ground shadow
  ctx.save(); ctx.scale(1, .22); ellipse(ctx, 0, 0, 150, 120, 'rgba(60,20,40,.28)'); ctx.restore();
  // feet
  for (const sx of [-1, 1]) shapeS(ctx, [[sx * 70, -4], [sx * 118, -8], [sx * 126, -34], [sx * 98, -52], [sx * 62, -40]], { fill: FUR2, lw: 5, seed: 3 + sx });
  // tail nub / body
  shapeS(ctx, [[-124, -70], [-132, -150], [-108, -230], [-52, -270], [52, -270], [108, -230], [132, -150], [124, -70], [84, -18], [0, -8], [-84, -18]], { fill: FUR, shade: FUR2, lw: 6, seed: 7, shadeDx: -14, shadeDy: -10, wob: 4 });
  shapeS(ctx, [[-62, -60], [-76, -130], [-50, -200], [0, -218], [50, -200], [76, -130], [62, -60], [0, -34]], { fill: BELLY, shade: '#d4a468', lw: 4, seed: 11, wob: 3 });
  // arms
  for (const sx of [-1, 1]) {
    shapeS(ctx, [[sx * 104, -214], [sx * 134, -170], [sx * 138, -110], [sx * 112, -92], [sx * 88, -120], [sx * 84, -180]], { fill: FUR, shade: FUR2, lw: 5, seed: 20 + sx, shadeDx: sx * 8, shadeDy: -8 });
    for (let k = 0; k < 3; k++) { ctx.strokeStyle = LINE; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(sx * (96 + k * 12), -100); ctx.lineTo(sx * (96 + k * 12), -90); ctx.stroke(); }
  }
  // head: big, boxy-round
  const hy = -268;
  // ears
  for (const sx of [-1, 1]) { shapeS(ctx, [[sx * 86, hy - 70], [sx * 118, hy - 92], [sx * 132, hy - 62], [sx * 110, hy - 38]], { fill: EAR, lw: 5, seed: 30 + sx });
    ellipse(ctx, sx * 112, hy - 66, 9, 12, '#e79a8a'); }
  shapeS(ctx, [[-122, hy - 10], [-118, hy - 74], [-78, hy - 112], [0, hy - 122], [78, hy - 112], [118, hy - 74], [122, hy - 10], [100, hy + 52], [40, hy + 74], [-40, hy + 74], [-100, hy + 52]], { fill: FUR, shade: FUR2, lw: 6, seed: 41, shadeDx: -12, shadeDy: -10, wob: 4 });
  // snout
  shapeS(ctx, [[-62, hy + 12], [-50, hy - 14], [0, hy - 22], [50, hy - 14], [62, hy + 12], [46, hy + 56], [0, hy + 66], [-46, hy + 56]], { fill: '#d9a569', shade: '#b98348', lw: 4, seed: 52, shadeDx: -6, shadeDy: -6 });
  ellipse(ctx, 0, hy + 2, 20, 13, '#3a1a14');      // nose
  ellipse(ctx, -5, hy - 2, 6, 3.5, '#fff', null, 0, -.3);
  ctx.strokeStyle = LINE; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, hy + 14); ctx.lineTo(0, hy + 30); ctx.stroke();
  mouth(ctx, 0, hy + 30, 30, expr === 'idle' ? 'idle' : expr);
  // eyes
  const ex = expr === 'wow' ? 'wow' : (blinkT > 0 ? 'blink' : expr);
  eye(ctx, -66, hy - 40, 40, ex, -1); eye(ctx, 66, hy - 40, 40, ex, 1);
  // brows
  ctx.strokeStyle = LINE; ctx.lineWidth = 5; ctx.lineCap = 'round';
  const bl = expr === 'sad' ? [-14, 0, 10, -10] : [-12, -10, 12, -10];
  ctx.beginPath(); ctx.moveTo(-92, hy - 92); ctx.quadraticCurveTo(-66, hy - 108 + (expr === 'sad' ? 10 : 0), -38, hy - 94 - (expr === 'sad' ? 10 : 0)); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(92, hy - 92); ctx.quadraticCurveTo(66, hy - 108 + (expr === 'sad' ? 10 : 0), 38, hy - 94 - (expr === 'sad' ? 10 : 0)); ctx.stroke();
  blush(ctx, -94, hy + 14, 20); blush(ctx, 94, hy + 14, 20);
  // whisker dots
  ctx.fillStyle = LINE; for (const [x, y] of [[-26, 6], [-18, 14], [26, 6], [18, 14]]) ellipse(ctx, x, hy + y, 2.4, 2.4, LINE);
  ctx.restore();
}

/** Axolotl, sitting, front view. */
export function drawAxolotl(ctx, t = 0, expr = 'idle', blinkT = 0) {
  const q = squash(t + 1.3, expr); ctx.save(); ctx.translate(0, -q.hop); ctx.scale(q.sx, q.sy);
  const SK = '#ff9fc0', SK2 = '#f27aa5', BEL = '#ffd6e4', GILL = '#ff5f93';
  ctx.save(); ctx.scale(1, .22); ellipse(ctx, 0, 0, 140, 110, 'rgba(60,20,40,.28)'); ctx.restore();
  // tail curling right
  shapeS(ctx, [[60, -50], [130, -40], [176, -76], [170, -122], [146, -108], [140, -80], [96, -78]], { fill: SK, shade: SK2, lw: 5, seed: 61 });
  for (const sx of [-1, 1]) shapeS(ctx, [[sx * 56, -6], [sx * 108, -8], [sx * 116, -34], [sx * 90, -54], [sx * 54, -42]], { fill: SK2, lw: 5, seed: 62 + sx });
  shapeS(ctx, [[-108, -70], [-114, -140], [-84, -210], [0, -236], [84, -210], [114, -140], [108, -70], [70, -16], [0, -8], [-70, -16]], { fill: SK, shade: SK2, lw: 6, seed: 66, shadeDx: -13, shadeDy: -10, wob: 4 });
  shapeS(ctx, [[-52, -60], [-62, -130], [-34, -190], [0, -200], [34, -190], [62, -130], [52, -60], [0, -34]], { fill: BEL, shade: '#f5b9cc', lw: 4, seed: 70 });
  for (const sx of [-1, 1]) shapeS(ctx, [[sx * 92, -190], [sx * 128, -150], [sx * 130, -100], [sx * 108, -84], [sx * 82, -112], [sx * 78, -160]], { fill: SK, shade: SK2, lw: 5, seed: 72 + sx, shadeDx: sx * 7, shadeDy: -7 });
  const hy = -246;
  // gills: 3 frilly fronds per side
  for (const sx of [-1, 1]) for (let k = 0; k < 3; k++) {
    const a = (-.35 + k * .42), L = 78 - k * 8, bx = sx * 100, by = hy - 20 + k * 30;
    const tx = bx + sx * L * Math.cos(a) , ty = by + L * Math.sin(a) - 20;
    shapeS(ctx, [[bx, by - 10], [bx + sx * L * .55, ty - 20], [tx + sx * 8, ty - 8], [tx, ty + 14], [bx + sx * L * .5, ty + 20], [bx, by + 12]], { fill: GILL, shade: '#d93e78', lw: 4.5, seed: 80 + k + sx * 5, shadeDx: 0, shadeDy: -7 });
    for (let j = 0; j < 3; j++) ellipse(ctx, tx + sx * 6 - sx * j * 10, ty - 6 + j * 8, 6, 6, '#ff8fb5', LINE, 2.5);
  }
  shapeS(ctx, [[-122, hy - 4], [-110, hy - 66], [-60, hy - 100], [0, hy - 108], [60, hy - 100], [110, hy - 66], [122, hy - 4], [96, hy + 58], [0, hy + 80], [-96, hy + 58]], { fill: SK, shade: SK2, lw: 6, seed: 90, shadeDx: -12, shadeDy: -10, wob: 4 });
  const ex = expr === 'wow' ? 'wow' : (blinkT > 0 ? 'blink' : expr);
  eye(ctx, -58, hy - 20, 42, ex, -1); eye(ctx, 58, hy - 20, 42, ex, 1);
  ctx.fillStyle = LINE; ellipse(ctx, -9, hy + 22, 3.2, 3.2, LINE); ellipse(ctx, 9, hy + 22, 3.2, 3.2, LINE);
  mouth(ctx, 0, hy + 34, 34, expr === 'idle' ? 'happy' : expr);
  blush(ctx, -88, hy + 28, 20); blush(ctx, 88, hy + 28, 20);
  ctx.restore();
}

/** Rug, plant, window and a flat illustrated room. W,H = canvas css size. */
export function drawRoom(ctx, W, H, o = {}) {
  const { wall = '#7d6bb3', wall2 = '#6a579f', floor = '#d98f7a', floor2 = '#c47a67', accent = '#b04c8f' } = o;
  const fy = H * .5;
  ctx.fillStyle = wall; ctx.fillRect(0, 0, W, fy);
  // wallpaper stripes + dado rail
  ctx.fillStyle = wall2; for (let x = 0; x < W; x += 54) ctx.fillRect(x, 0, 27, fy);
  ctx.fillStyle = '#5b478f'; ctx.fillRect(0, fy - 34, W, 34); ctx.fillStyle = '#e9d8ff'; ctx.fillRect(0, fy - 40, W, 8);
  // floor planks
  ctx.fillStyle = floor; ctx.fillRect(0, fy, W, H - fy);
  ctx.strokeStyle = floor2; ctx.lineWidth = 3;
  for (let y = fy + 36; y < H; y += 44 + (y - fy) * .08) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  const r = rng(5); for (let y = fy; y < H; y += 44 + (y - fy) * .08) for (let x = r() * 160; x < W; x += 120 + r() * 160) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 44 + (y - fy) * .08); ctx.stroke(); }
  ctx.fillStyle = 'rgba(40,10,40,.18)'; ctx.fillRect(0, fy, W, 10);
  // arched window
  const wx = W * .5, ww = W * .26, wt = fy * .1;
  ctx.save(); ctx.beginPath(); ctx.moveTo(wx - ww / 2, fy - 50); ctx.lineTo(wx - ww / 2, wt + ww / 2); ctx.arc(wx, wt + ww / 2, ww / 2, Math.PI, 0); ctx.lineTo(wx + ww / 2, fy - 50); ctx.closePath();
  const sky = ctx.createLinearGradient(0, wt, 0, fy); sky.addColorStop(0, '#9fd8ff'); sky.addColorStop(1, '#e6f6ff'); ctx.fillStyle = sky; ctx.fill(); ctx.clip();
  ctx.fillStyle = '#b6dcef'; for (const [x, w, h] of [[-.4, .12, .5], [-.22, .1, .72], [.0, .14, .6], [.2, .1, .8], [.34, .1, .55]]) ctx.fillRect(wx + x * ww, fy - 50 - h * fy * .5, w * ww, h * fy * .5);
  ctx.restore();
  ctx.strokeStyle = '#f4e6ff'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(wx - ww / 2, fy - 50); ctx.lineTo(wx - ww / 2, wt + ww / 2); ctx.arc(wx, wt + ww / 2, ww / 2, Math.PI, 0); ctx.lineTo(wx + ww / 2, fy - 50); ctx.closePath(); ctx.stroke();
  ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(wx, wt); ctx.lineTo(wx, fy - 50); ctx.moveTo(wx - ww / 2, fy * .5); ctx.lineTo(wx + ww / 2, fy * .5); ctx.stroke();
  ctx.strokeStyle = LINE; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(wx, wt + ww / 2, ww / 2 + 5, Math.PI, 0); ctx.stroke();
  // curtains
  for (const sx of [-1, 1]) { const a = wx + sx * (ww / 2 + 6), b = wx + sx * (ww / 2 + 70), top = wt + 30, bot = fy - 36, m = (top + bot) / 2;
    shapeS(ctx, [[a, top], [(a + b) / 2, top - 6], [b, top + 6], [b + sx * 4, m], [b, bot - 6], [(a + b) / 2, bot + 4], [a, bot - 4], [a - sx * 3, m]], { fill: accent, shade: '#8f3b72', lw: 4, seed: 4 + sx, wob: 3, shadeDx: sx * 9, shadeDy: 0 });
    ctx.strokeStyle = '#8f3b72'; ctx.lineWidth = 3; for (let k = 1; k < 3; k++) { const x = a + (b - a) * k / 3; ctx.beginPath(); ctx.moveTo(x, top + 8); ctx.lineTo(x + sx * 2, bot - 6); ctx.stroke(); } }
  // shelf (left) with bottles
  const sx0 = W * .03, sy0 = fy * .42;
  shapeS(ctx, [[sx0, sy0], [sx0 + W * .11, sy0], [sx0 + W * .11, sy0 + fy * .5], [sx0, sy0 + fy * .5]], { fill: '#8c6bd0', lw: 5, wob: 2, seed: 9, shade: '#6f52b0', shadeDx: -6, shadeDy: -6 });
  ctx.fillStyle = '#5b3fa0'; ctx.fillRect(sx0 + 6, sy0 + fy * .24, W * .11 - 12, 8);
  shapeS(ctx, [[sx0 + 24, sy0 + fy * .24], [sx0 + 22, sy0 + fy * .1], [sx0 + 34, sy0 + fy * .02], [sx0 + 46, sy0 + fy * .1], [sx0 + 44, sy0 + fy * .24]], { fill: '#ff8fd0', lw: 3.5, seed: 12, wob: 1.5 });
  shapeS(ctx, [[sx0 + 62, sy0 + fy * .24], [sx0 + 60, sy0 + fy * .13], [sx0 + 82, sy0 + fy * .13], [sx0 + 80, sy0 + fy * .24]], { fill: '#8ff0d0', lw: 3.5, seed: 13, wob: 1.5 });
  // plant
  const px = W * .24, py = fy + 30;
  for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * .34; const lx = px + Math.cos(a) * 82, ly = py - 40 + Math.sin(a) * 100;
    shapeS(ctx, [[px, py - 40], [(px + lx) / 2 - 24 * Math.sign(lx - px || 1), (py + ly) / 2 - 40], [lx, ly], [(px + lx) / 2 + 20 * Math.sign(lx - px || 1), (py + ly) / 2 - 30]], { fill: i % 2 ? '#3f9a5b' : '#4fb36a', shade: '#2d7a47', lw: 4, seed: 20 + i, wob: 2, shadeDx: -4, shadeDy: -4 }); }
  shapeS(ctx, [[px - 40, py - 44], [px + 40, py - 44], [px + 30, py + 36], [px - 30, py + 36]], { fill: '#b04c8f', shade: '#8f3b72', lw: 5, seed: 31, wob: 2, shadeDx: -8, shadeDy: -4 });
  ctx.fillStyle = 'rgba(40,10,40,.18)'; ctx.save(); ctx.scale(1, .25); ellipse(ctx, px, (py + 40) * 4, 60, 40, 'rgba(40,10,40,.2)'); ctx.restore();
}

export function drawRug(ctx, x, y, rx, ry, c1 = '#a8479a', c2 = '#c45db0') {
  ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx);
  ellipse(ctx, 0, 6, rx, rx, 'rgba(40,10,40,.25)'); ellipse(ctx, 0, 0, rx, rx, c1, LINE, 5);
  ellipse(ctx, 0, 0, rx * .78, rx * .78, c2, null); ctx.setLineDash([10, 12]); ellipse(ctx, 0, 0, rx * .66, rx * .66, null, '#ffd9f2', 3); ctx.setLineDash([]);
  ctx.restore();
}

export function drawBubble(ctx, x, y, s, icon) {
  ctx.save(); ctx.translate(x, y);
  ellipse(ctx, 40 * s, 66 * s, 7 * s, 7 * s, '#fff', LINE, 3); ellipse(ctx, 26 * s, 84 * s, 4.5 * s, 4.5 * s, '#fff', LINE, 3);
  shapeS(ctx, [[-60 * s, 20 * s], [-34 * s, -22 * s], [10 * s, -34 * s], [52 * s, -16 * s], [66 * s, 22 * s], [38 * s, 54 * s], [-8 * s, 58 * s], [-46 * s, 48 * s]], { fill: '#fffdf9', shade: '#e4ecf5', lw: 4, seed: 3, wob: 2, shadeDx: -5, shadeDy: -5 });
  if (icon) icon(ctx, 3 * s, 12 * s, s);
  ctx.restore();
}

export function strawberry(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  shapeS(ctx, [[0, 28], [-24, 10], [-26, -14], [-8, -24], [8, -24], [26, -14], [24, 10]], { fill: '#ff4d6a', shade: '#d62f52', lw: 4, seed: 7, wob: 1.5, shadeDx: -5, shadeDy: -5 });
  shapeS(ctx, [[0, -22], [-16, -30], [-6, -36], [0, -30], [6, -36], [16, -30]], { fill: '#4fb36a', lw: 3, seed: 8, wob: 1 });
  ctx.fillStyle = '#ffe9a8'; for (const [a, b] of [[-10, -4], [6, -8], [-2, 6], [12, 4], [-14, 8]]) ellipse(ctx, a, b, 2, 3, '#ffe9a8'); ctx.restore();
}
export function sponge(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  shapeS(ctx, [[-28, -12], [0, -18], [28, -12], [30, 10], [0, 16], [-30, 10]], { fill: '#ffd34d', shade: '#f0a928', lw: 4, seed: 3, wob: 1.5, shadeDx: -4, shadeDy: -5 });
  for (const [a, b] of [[-14, -3], [4, 4], [14, -6], [-4, -8]]) ellipse(ctx, a, b, 3.5, 3, '#c98a14'); ctx.restore();
}
