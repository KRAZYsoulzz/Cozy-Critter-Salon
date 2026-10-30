// Stylist avatar, flat 2D. Origin = feet, front view, ~150 units tall. Driven by save.js avatar state.
import { shapeS, eye } from './art.js';
import { INK, el, ln, slab, shadow, star, heart } from './props.js';
import { SKIN_TONES, HAIR_COLORS, AVATAR_OUTFITS } from '../save.js';
const hex = n => '#' + n.toString(16).padStart(6, '0');
const shade = (css, k = .82) => { const n = parseInt(css.slice(1), 16); return '#' + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => Math.round(v * k).toString(16).padStart(2, '0')).join(''); };
export function drawAvatar(c, a, o = {}) {
  const { t = 0, walking = 0, face = 1, wave = 0, expr = 'idle', blink = 0 } = o;
  const skin = SKIN_TONES.find(s => s.id === a.skinTone) || SKIN_TONES[0], hair = HAIR_COLORS.find(h => h.id === a.hairColor) || HAIR_COLORS[0], fit = AVATAR_OUTFITS.find(f => f.id === a.outfit) || AVATAR_OUTFITS[0];
  const S = skin.css, S2 = shade(S, .86), H = hair.css, H2 = shade(H, .72), P = hex(fit.primary), P2 = shade(P, .8), K = hex(fit.skirt), Kd = shade(K, .8), SH = hex(fit.shoes), SE = hex(fit.secondary);
  const sw = Math.sin(t * 9) * walking, bob = Math.abs(Math.sin(t * 9)) * 4 * walking + Math.sin(t * 2.2) * 1.2 * (1 - walking);
  c.save(); c.scale(1, 1); shadow(c, 0, 2, 38);
  c.translate(0, -bob);
  const hs = a.hairStyle;
  // hair back layer
  if (hs === 'long_waves') shapeS(c, [[-46, -118], [-56, -70], [-50, -22], [-30, -16], [30, -16], [50, -22], [56, -70], [46, -118]], { fill: H, shade: H2, lw: 4, wob: 1.5, seed: 3 });
  if (hs === 'braids') for (const sx of [-1, 1]) { for (let i = 0; i < 5; i++) el(c, sx * (50 - i * 1.5), -100 + i * 17, 9 - i * .6, 10, i % 2 ? H : H2, INK, 3); el(c, sx * 44, -16, 6, 6, '#ff8fb7', INK, 2.5); }
  if (hs === 'high_pony') { c.save(); c.translate(0, -164); c.rotate(Math.sin(t * 3) * .1 * (.4 + walking)); shapeS(c, [[0, 0], [30, -2], [58, 30], [52, 80], [34, 100], [28, 54], [8, 22]], { fill: H, shade: H2, lw: 4, wob: 1, seed: 5 }); c.restore(); }
  if (hs === 'pigtails') for (const sx of [-1, 1]) { c.save(); c.translate(sx * 52, -128); c.rotate(sx * (.25 + Math.sin(t * 4 + sx) * .08 * (.4 + walking))); shapeS(c, [[0, -4], [14, 6], [24, 40], [14, 66], [-2, 60], [-10, 30]], { fill: H, shade: H2, lw: 4, wob: 1, seed: 6 + sx }); c.restore(); }
  // legs + shoes
  for (const sx of [-1, 1]) { const ly = sx > 0 ? sw : -sw; slab(c, sx * 14 - 7, -42, 14, 30 + Math.max(0, ly * 4), { fill: S, shade: S2, r: 5, lw: 3.5 }); shapeS(c, [[sx * 14 - 15, -10 + ly * 4], [sx * 14 + 15, -10 + ly * 4], [sx * 14 + 17, 2 + ly * 4], [sx * 14 - 17, 2 + ly * 4]], { fill: SH, shade: shade(SH, .78), lw: 4, wob: .8, seed: 9 + sx, shadeDx: 0, shadeDy: -4 }); }
  // dress: bodice + flared skirt
  shapeS(c, [[-20, -102], [-26, -78], [-40, -40], [-30, -30], [0, -26], [30, -30], [40, -40], [26, -78], [20, -102]], { fill: K, shade: Kd, lw: 4.5, wob: 1.2, seed: 12, shadeDx: -6, shadeDy: -5 });
  shapeS(c, [[-22, -104], [-24, -72], [-8, -62], [8, -62], [24, -72], [22, -104], [0, -110]], { fill: P, shade: P2, lw: 4.5, wob: 1, seed: 13, shadeDx: -5, shadeDy: -4 });
  slab(c, -26, -64, 52, 7, { fill: SE, r: 3, lw: 2.8 }); heart(c, 0, -84, 6, SE);
  // arms
  for (const sx of [-1, 1]) { c.save(); c.translate(sx * 24, -98); const up = sx > 0 && wave ? -2.1 + Math.sin(t * 12) * .35 : sx * (.18 + sw * .05 * sx); c.rotate(up * (sx > 0 && wave ? 1 : 1)); slab(c, -6, 0, 12, 44, { fill: S, shade: S2, r: 6, lw: 3.5 }); el(c, 0, 46, 8, 8, S, INK, 3); c.restore(); }
  // head
  const hy = -146;
  shapeS(c, [[-46, hy - 6], [-44, hy - 36], [-22, hy - 52], [0, hy - 54], [22, hy - 52], [44, hy - 36], [46, hy - 6], [36, hy + 30], [0, hy + 42], [-36, hy + 30]], { fill: S, shade: S2, lw: 5, wob: 1.8, seed: 21, shadeDx: -7, shadeDy: -6 });
  el(c, -46, hy + 6, 7, 10, S, INK, 3.5); el(c, 46, hy + 6, 7, 10, S, INK, 3.5);
  const ex = blink ? 'blink' : expr === 'idle' ? 'idle' : expr; eye(c, -19, hy + 4, 13.5, ex, -1); eye(c, 19, hy + 4, 13.5, ex, 1);
  el(c, -31, hy + 22, 8, 5, 'rgba(255,110,130,.55)'); el(c, 31, hy + 22, 8, 5, 'rgba(255,110,130,.55)'); ln(c, [[-9, hy + 26], [-4, hy + 31], [3, hy + 31], [9, hy + 26]], INK, 3);
  // hair front by style
  const cap = () => shapeS(c, [[-48, hy - 8], [-44, hy - 44], [-20, hy - 62], [8, hy - 64], [38, hy - 52], [48, hy - 14], [30, hy - 26], [4, hy - 34], [-26, hy - 24]], { fill: H, shade: H2, lw: 5, wob: 1.5, seed: 33, shadeDx: -7, shadeDy: -6 });
  if (hs === 'curly_puff') { for (const [x, y, r] of [[-40, -22, 22], [-16, -48, 26], [18, -50, 26], [42, -24, 22], [-52, 8, 16], [52, 8, 16]]) el(c, x, hy + y, r, r, H, INK, 4.5); }
  if (hs === 'space_buns') for (const sx of [-1, 1]) { el(c, sx * 34, hy - 70, 20, 20, H, INK, 4.5); el(c, sx * 34, hy - 70, 8, 8, H2); el(c, sx * 34, hy - 52, 9, 5, '#ff8fb7', INK, 2.5); }
  if (hs === 'afro_puffs') for (const sx of [-1, 1]) { el(c, sx * 48, hy - 56, 26, 26, H, INK, 4.5); star(c, sx * 48, hy - 56, 8, '#ffd93d'); }
  if (hs === 'bob_bangs') { for (const sx of [-1, 1]) shapeS(c, [[sx * 44, hy - 30], [sx * 56, hy + 6], [sx * 50, hy + 40], [sx * 30, hy + 38], [sx * 34, hy]], { fill: H, shade: H2, lw: 4.5, wob: 1, seed: 40 + sx }); }
  cap();
  if (hs === 'bob_bangs' || hs === 'pigtails' || hs === 'braids' || hs === 'long_waves') shapeS(c, [[-44, hy - 22], [-26, hy - 10], [-12, hy - 22], [0, hy - 8], [14, hy - 22], [28, hy - 10], [44, hy - 22], [34, hy - 44], [0, hy - 50], [-34, hy - 44]], { fill: H, shade: H2, lw: 4, wob: 1, seed: 36 });
  if (hs === 'half_up' || hs === 'high_pony') { el(c, 0, hy - 62, 8, 8, '#ff5c8a', INK, 3); if (hs === 'half_up') { shapeS(c, [[0, hy - 64], [-24, hy - 80], [-24, hy - 56]], { fill: '#ff5c8a', lw: 3.5, wob: .5, seed: 2 }); shapeS(c, [[0, hy - 64], [24, hy - 80], [24, hy - 56]], { fill: '#ff5c8a', lw: 3.5, wob: .5, seed: 3 }); } }
  if (hs === 'pixie') shapeS(c, [[-44, hy - 28], [-30, hy - 46], [0, hy - 70], [36, hy - 48], [46, hy - 22], [28, hy - 30], [4, hy - 26], [-24, hy - 24]], { fill: H, shade: H2, lw: 5, wob: 1, seed: 48 });
  c.restore();
}
