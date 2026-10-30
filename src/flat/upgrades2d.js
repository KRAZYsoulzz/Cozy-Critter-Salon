// Room upgrade tiers (shop "Room Upgrades"): extra decor drawn over each room. Tier 1 = base room.
import { INK, el, ln, slab, heart, star } from './props.js';
import { shapeS } from './art.js';
const TAU = Math.PI * 2;
const lantern = (c, x, y, t, col = '#ff9a3c', col2 = '#ffd27a') => { const sw = Math.sin(t * 1.4 + x) * 5; c.save(); c.translate(x + sw * .3, 0); ln(c, [[0, 0], [0, y - 44]], INK, 3); c.translate(0, y); c.rotate(sw * .01);
  slab(c, -14, -50, 28, 8, { fill: '#7a4a2a', r: 3, lw: 3 }); el(c, 0, -4, 34, 44, col, INK, 4.5); el(c, -8, -12, 14, 26, col2, null, 0, .2); for (const dx of [-14, 0, 14]) ln(c, [[dx * .8, -46], [dx, 38]], 'rgba(150,60,10,.5)', 2.4); slab(c, -14, 38, 28, 8, { fill: '#7a4a2a', r: 3, lw: 3 }); ln(c, [[0, 46], [0, 66]], '#e8574f', 3); el(c, 0, 70, 5, 7, '#e8574f', INK, 2); c.restore(); };
const yuzu = (c, x, y, t, i) => { const b = Math.sin(t * 2 + i * 1.7) * 4; el(c, x, y + b + 5, 15, 5, 'rgba(60,30,80,.22)'); el(c, x, y + b, 15, 14, '#ffc23c', INK, 3.5); el(c, x - 4, y + b - 4, 5, 4, 'rgba(255,255,255,.55)'); shapeS(c, [[x, y + b - 13], [x + 10, y + b - 20], [x + 7, y + b - 11]], { fill: '#5fc25a', lw: 2.5, wob: .2, seed: i + 3 }); };
const steam = (c, x, y, t, i) => { c.save(); c.globalAlpha = .5 + Math.sin(t * 2 + i) * .2; ln(c, [[x, y], [x + 9, y - 16], [x - 6, y - 34], [x + 8, y - 52]], '#fff', 5); c.restore(); };

function spa(c, tier, t) {
  lantern(c, 230, 150, t); lantern(c, 660, 130, t + 2); for (let i = 0; i < 5; i++) yuzu(c, 355 + i * 42, 436 + (i % 2) * 8, t, i); for (let i = 0; i < 3; i++) steam(c, 380 + i * 60, 420, t, i);
  if (tier < 3) return;
  // mermaid jacuzzi: giant scallop shell + pearl arch + rainbow mist
  for (let k = 0; k < 6; k++) { c.beginPath(); c.arc(440, 392, 190 - k * 9, Math.PI * 1.07, Math.PI * 1.93); c.strokeStyle = ['#ff7aa8', '#ffb86b', '#fff08a', '#8be28b', '#74c8ff', '#b589f7'][k]; c.globalAlpha = .45; c.lineWidth = 9; c.stroke(); } c.globalAlpha = 1;
  const rays = 9; for (let i = 0; i < rays; i++) { const a = Math.PI * (1.08 + i * .105), a2 = a + Math.PI * .105; shapeS(c, [[440, 398], [440 + Math.cos(a) * 150, 398 + Math.sin(a) * 150], [440 + Math.cos((a + a2) / 2) * 162, 398 + Math.sin((a + a2) / 2) * 162], [440 + Math.cos(a2) * 150, 398 + Math.sin(a2) * 150]], { fill: i % 2 ? '#ffc4dc' : '#e9b8ff', shade: i % 2 ? '#ff9cc4' : '#c98cf2', lw: 4, wob: .4, seed: 40 + i }); }
  for (let i = 0; i < 11; i++) { const a = Math.PI * (1.12 + i * .076); el(c, 440 + Math.cos(a) * 176, 398 + Math.sin(a) * 176, 8, 8, '#fff', INK, 3); el(c, 440 + Math.cos(a) * 176 - 2, 398 + Math.sin(a) * 176 - 2, 2.5, 2.5, 'rgba(160,210,255,.9)'); }
  for (const [x, y] of [[120, 300], [780, 260], [700, 340]]) { c.save(); c.translate(x, y); c.rotate(Math.sin(t + x) * .1); star(c, 0, 0, 20, '#ff9f7a'); el(c, 0, 0, 5, 5, '#fff2c8'); c.restore(); }
}
function clinic(c, tier, t) {
  for (let k = 0; k < 6; k++) { c.beginPath(); c.arc(450, 300, 150 - k * 12, Math.PI, 0); c.strokeStyle = ['#ff6b81', '#ffa94d', '#ffe066', '#69db7c', '#4dabf7', '#b197fc'][k]; c.lineWidth = 12; c.stroke(); } el(c, 300, 300, 22, 14, '#fff', INK, 3.5); el(c, 600, 300, 22, 14, '#fff', INK, 3.5); el(c, 322, 304, 20, 12, '#fff', INK, 3.5);
  for (const [x, col] of [[210, '#ff8fb7'], [700, '#a78bfa']]) { c.save(); c.translate(x, 478); el(c, 0, 8, 46, 12, 'rgba(60,30,60,.2)'); heart(c, 0, -16, 34, col); c.restore(); ln(c, [[x - 10, 468], [x + 6, 478]], 'rgba(255,255,255,.5)', 4); }
  if (tier < 3) return;
  // royal: crown canopy + velvet swags + crystal heart monitor
  for (const sd of [-1, 1]) { const X = x => 450 + sd * (450 - x); shapeS(c, [[X(46), 0], [X(150), 0], [X(138), 70], [X(112), 128], [X(92), 96], [X(46), 118]], { fill: '#b3243f', shade: '#85182e', lw: 5, wob: .5, seed: 60 + sd, shadeDx: sd * 6, shadeDy: 0 }); el(c, X(48), 112, 7, 7, '#ffd43b', INK, 3); }
  c.save(); c.translate(450, 62); shapeS(c, [[-70, 30], [-70, -14], [-38, 10], [0, -34], [38, 10], [70, -14], [70, 30]], { fill: '#ffd43b', shade: '#e8a417', lw: 5, wob: .6, seed: 66 }); slab(c, -72, 26, 144, 18, { fill: '#ffd43b', shade: '#e8a417', r: 8, lw: 4.5 }); for (const [x, col] of [[-44, '#ff6b81'], [0, '#4dabf7'], [44, '#69db7c']]) el(c, x, 35, 7, 7, col, INK, 2.5); for (const x of [-70, 0, 70]) el(c, x, x ? -16 : -36, 7, 7, '#ff6b81', INK, 3); c.restore();
  c.save(); c.translate(790, 470); slab(c, -26, -6, 52, 12, { fill: '#cfd8e6', shade: '#98a6bd', r: 5, lw: 4 }); ln(c, [[0, -6], [0, -50]], INK, 9); ln(c, [[0, -6], [0, -50]], '#98a6bd', 4); const g = 1 + Math.sin(t * 4) * .06; c.save(); c.translate(0, -88); c.scale(g, g); heart(c, 0, 0, 36, '#ff7aa8'); heart(c, -6, -8, 12, 'rgba(255,255,255,.6)'); c.restore(); ln(c, [[-34, -60], [-18, -60], [-12, -76], [-2, -48], [6, -66], [34, -66]], '#7ee0a0', 3); c.restore();
}
function lobby(c, tier, t) {
  // crystal chandelier
  const sw = Math.sin(t * 1.2) * 3; c.save(); c.translate(450 + sw, 0); ln(c, [[0, 0], [0, 78]], INK, 4); slab(c, -8, 70, 16, 14, { fill: '#ffd43b', r: 4, lw: 3 }); ln(c, [[-86, 112], [-40, 92], [0, 88], [40, 92], [86, 112]], '#e8a417', 6);
  for (const x of [-86, -43, 0, 43, 86]) { const y = x === 0 ? 94 : Math.abs(x) === 43 ? 98 : 114; slab(c, x - 6, y - 4, 12, 8, { fill: '#ffd43b', r: 3, lw: 2.5 }); ln(c, [[x, y - 4], [x, y - 20]], '#fff2c8', 5); el(c, x, y - 28, 5, 8 + Math.sin(t * 9 + x) * 1.5, '#ffb347', null, 0); }
  for (let i = 0; i < 9; i++) { const x = -80 + i * 20, y = 116 + (i % 2) * 14; shapeS(c, [[x, y], [x + 7, y + 14], [x, y + 28], [x - 7, y + 14]], { fill: 'rgba(210,240,255,.9)', shade: 'rgba(160,210,250,.9)', lw: 2.8, wob: .15, seed: 70 + i }); } star(c, 0, 150 + Math.sin(t * 3) * 2, 12, '#fff'); c.restore();
  if (tier < 3) { for (const sd of [-1, 1]) shapeS(c, [[sd * 360 + 450, 0], [sd * 440 + 450, 0], [sd * 430 + 450, 160], [sd * 400 + 450, 330], [sd * 370 + 450, 160]], { fill: '#c58bff', shade: '#9a5be0', lw: 5, wob: .8, seed: 80 + sd, shadeDx: -6, shadeDy: 0 }); return; }
  // treehouse: blossom tree + fairy lights + flower swing
  c.save(); c.translate(110, 0); shapeS(c, [[-22, 400], [22, 400], [14, 230], [30, 150], [-4, 190], [-20, 240]], { fill: '#a9743f', shade: '#7e5228', lw: 5, wob: .8, seed: 90, shadeDx: -6, shadeDy: 0 }); for (const [x, y, r] of [[-50, 160, 52], [10, 110, 60], [64, 160, 50], [-10, 190, 54], [40, 210, 40], [-60, 230, 36]]) { el(c, x, y, r, r * .85, '#ffb6d3', INK, 4.5); el(c, x - r * .3, y - r * .3, r * .4, r * .3, '#ffd6e8'); } for (let i = 0; i < 9; i++) { const x = -70 + (i * 37) % 150, y = 100 + (i * 53) % 130; star(c, x, y, 7, '#fff'); } c.restore();
  c.beginPath(); c.moveTo(0, 20); c.quadraticCurveTo(225, 80, 450, 24); c.quadraticCurveTo(675, 80, 900, 20); c.strokeStyle = INK; c.lineWidth = 3; c.stroke(); for (let i = 0; i < 14; i++) { const u = (i + .5) / 14, x = u * 900, y = 20 + Math.sin(u * Math.PI * 2 + 0) * 0 + (u < .5 ? 60 * Math.sin(u * 2 * Math.PI) * .9 : 60 * Math.sin((u - .5) * 2 * Math.PI) * .9) + 4; const col = ['#ffe066', '#ff8fb7', '#7ee0ff', '#9be58b'][i % 4]; c.globalAlpha = .6 + Math.sin(t * 3 + i) * .3; el(c, x, y + 8, 7, 9, col, INK, 2.5); c.globalAlpha = 1; }
  c.save(); c.translate(300, 0); ln(c, [[-34, 0], [-34, 292]], '#d9a15a', 4); ln(c, [[34, 0], [34, 292]], '#d9a15a', 4); const a = Math.sin(t * 1.5) * .08; c.translate(0, 292); c.rotate(a); slab(c, -48, 0, 96, 14, { fill: '#e8b078', shade: '#c98a54', r: 7, lw: 4 }); for (const [x, col] of [[-30, '#ff8fb7'], [-10, '#ffe066'], [10, '#fff'], [30, '#c58bff']]) { el(c, x, -4, 8, 8, col, INK, 2.5); el(c, x, -4, 3, 3, '#ffb347'); } c.restore();
}
function kitchen(c, tier, t) {
  // striped awning + macaron tower
  c.save(); for (let i = 0; i < 12; i++) { const x = i * 75; c.beginPath(); c.moveTo(x, 0); c.lineTo(x + 75, 0); c.lineTo(x + 75, 30); c.arc(x + 37.5, 30, 37.5, 0, Math.PI); c.closePath(); c.fillStyle = i % 2 ? '#fff' : '#ff7eb6'; c.fill(); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); } c.restore();
  c.save(); c.translate(780, 470); slab(c, -34, -2, 68, 10, { fill: '#e8b078', r: 5, lw: 3.5 }); ln(c, [[0, 8], [0, -2]], INK, 6); c.restore(); c.save(); c.translate(780, 468);
  [['#ff9fc7', 30], ['#b9a0ff', 26], ['#8fe0c4', 22], ['#ffe27a', 18]].forEach(([col, r], i) => { const y = -i * 22 - 12; el(c, 0, y + 6, r, 7, '#fff3e0', INK, 3.5); el(c, 0, y, r, 10, col, INK, 4); el(c, -r * .35, y - 3, r * .2, 3, 'rgba(255,255,255,.55)'); }); star(c, 0, -104, 10, '#ff5c8a'); c.restore();
  if (tier < 3) return;
  // candy cloud diner: neon shake sign + cotton-candy clouds
  for (const [x, y, s, col] of [[160, 100, 1, '#ffd0ea'], [700, 90, 1.2, '#bfe7ff'], [310, 60, .8, '#e0ccff']]) { c.save(); c.translate(x, y + Math.sin(t * .8 + x) * 4); c.scale(s, s); for (const [dx, dy, r] of [[-30, 6, 22], [0, -6, 28], [30, 6, 22], [0, 10, 24]]) el(c, dx, dy, r, r * .8, col, INK, 3.5); star(c, 20, -22, 6, '#fff'); c.restore(); }
  c.save(); c.translate(450, 170); const glow = .75 + Math.sin(t * 5) * .25; slab(c, -96, -46, 192, 92, { fill: '#2a1a4a', r: 22, lw: 5 }); c.shadowColor = '#ff4fa3'; c.shadowBlur = 16 * glow; c.strokeStyle = '#ff79bf'; c.lineWidth = 5; c.lineCap = c.lineJoin = 'round'; c.beginPath(); c.moveTo(-66, -24); c.lineTo(-52, 26); c.lineTo(-24, 26); c.lineTo(-10, -24); c.closePath(); c.stroke(); c.beginPath(); c.arc(-38, -26, 12, 0, TAU); c.stroke(); c.shadowColor = '#4de1ff'; c.strokeStyle = '#7cecff'; c.font = '700 30px Fredoka, system-ui'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.lineWidth = 2.5; c.strokeText('SHAKES', 4, 2); c.shadowBlur = 0; c.fillStyle = 'rgba(255,255,255,.85)'; c.fillText('SHAKES', 4, 2); c.restore();
}
const FN = { 0: ['kitchen', kitchen], 1: ['spa', spa], 2: ['lobby', lobby], 3: ['clinic', clinic] };
export function drawUpgrades(c, roomIdx, tiers, t, RW) { const f = FN[roomIdx]; if (!f) return; const tier = tiers?.[f[0]] || 1; if (tier < 2) return; c.save(); c.translate(roomIdx * RW, 0); f[1](c, tier, t); c.restore(); }
