// 2D world: cutaway cottage, stylist avatar with tap + follow-finger movement, collision, station prompts.
import { drawRoomN, drawPartition, ROOMS, RW, WORLD_W, WALK_Y0, WALK_Y1, OBSTACLE_BOXES, OBSTACLE_CIRCLES, STATIONS } from './rooms.js';
import { makeCollider } from './collide2d.js';
import { drawAvatar } from './avatar.js';
import { drawUpgrades } from './upgrades2d.js';
const SPEED = 230;
export class World2D {
  constructor(engine, save, hooks = {}) {
    this.e = engine; this.save = save; this.hooks = hooks; this.col = makeCollider(OBSTACLE_BOXES, OBSTACLE_CIRCLES, 14);
    this.av = { x: 2 * RW + 450, y: 500, tx: 0, ty: 0, has: false, face: 1, walking: 0, wave: 0, t: 0 };
    this.holding = null; this.station = null; this.followers = []; this.sprites = []; this.seen = new Set(); this.blinkAt = 3;
    engine.layers.push((c, e) => this.draw(c, e)); engine.updaters.push((dt) => this.update(dt));
    engine.on('down', (p, ev) => this.down(p, ev)); engine.on('move', p => this.move(p)); engine.on('up', p => this.up(p));
    engine.cam.x = this.av.x - engine.visW / 2;
  }
  floorTarget(w) { return { x: Math.max(30, Math.min(WORLD_W - 30, w.x)), y: Math.max(WALK_Y0, Math.min(WALK_Y1, w.y)) }; }
  down(p, ev) { if (this.scene?.active) return this.scene.pointer('down', p);
    const w = this.e.toWorld(p); if (this.hooks.pick?.(w, p)) return;
    this.holding = { id: p.id, t: p.t, sx: p.sx, sy: p.sy, moved: false }; this.setTarget(w);
  }
  move(p) { if (this.scene?.active) return this.scene.pointer('move', p); if (!this.holding || p.id !== this.holding.id) return; if (Math.hypot(p.sx - this.holding.sx, p.sy - this.holding.sy) > 8) this.holding.moved = true; this.setTarget(this.e.toWorld(p)); }
  up(p) { if (this.scene?.active) return this.scene.pointer('up', p); const h = this.holding; if (!h || p.id !== h.id) return; this.holding = null;
    // quick tap keeps walking to the spot; a held drag stops where the finger lifts
    if (h.moved || p.t - h.t > 280) this.av.has = false; }
  walkTo(x, y) { this.setTarget({ x, y }); }
  setTarget(w) { const t = this.floorTarget(w), q = this.col.pushOut(t.x, t.y); this.av.tx = q.x; this.av.ty = q.z; this.av.has = true; }
  nearestStation() { let best = null, bd = 1e9; for (const s of STATIONS) { const sx = s.room * RW + s.x, d = Math.hypot(this.av.x - sx, (this.av.y - s.y) * 1.4); if (d < 100 && d < bd) { bd = d; best = s; } } return best; }
  update(dt) {
    const a = this.av; a.t += dt; a.wave = Math.max(0, a.wave - dt);
    const j = this.joy; if (j && Math.hypot(j.x, j.y) > .18) { this.setTarget({ x: a.x + j.x * 140, y: a.y + j.y * 70 }); this.joyOn = true; } else if (this.joyOn) { this.joyOn = false; a.has = false; }
    if (a.has) { const dx = a.tx - a.x, dy = a.ty - a.y, d = Math.hypot(dx, dy);
      if (d < 6) { a.has = false; } else { const st = Math.min(d, SPEED * dt); let r = this.col.move(a.x, a.y, a.x + dx / d * st, a.y + dy / d * st); if (r.z < WALK_Y0 - 1 || r.z > WALK_Y1 + 1) r = { x: a.x, z: a.y }; const moved = Math.hypot(r.x - a.x, r.z - a.y); a.x = r.x; a.y = r.z; if (moved < st * .15) { a.stall = (a.stall || 0) + dt; if (a.stall > .35 && !this.holding) a.has = false; } else a.stall = 0; if (Math.abs(dx) > 6) a.face = dx > 0 ? 1 : -1; } }
    a.walking += ((a.has ? 1 : 0) - a.walking) * Math.min(1, dt * 10);
    const want = a.x - this.e.visW / 2; this.e.cam.x += (want - this.e.cam.x) * Math.min(1, dt * 4);
    const st = this.nearestStation(); if (st?.id !== this.station?.id) { this.station = st; this.hooks.station?.(st, !this.seen.has(st?.id)); if (st) this.seen.add(st.id); }
    this.blinkAt -= dt; if (this.blinkAt < -.14) this.blinkAt = 2.5 + Math.random() * 2;
  }
  draw(c, e) {
    const t = e.time, x0 = e.cam.x, x1 = x0 + e.visW, oy = e.offY; c.translate(0, oy);
    for (let i = 0; i < 5; i++) if (i * RW < x1 && (i + 1) * RW > x0) { const R = ROOMS[i]; c.fillStyle = R.wall; c.fillRect(i * RW - 1, -oy - 40, RW + 2, oy + 41); c.fillStyle = R.floor2; c.fillRect(i * RW - 1, 539, RW + 2, e.visH + 40); }
    for (let i = 0; i < 5; i++) if (i * RW < x1 && (i + 1) * RW > x0) { drawRoomN(c, i, t); drawUpgrades(c, i, this.save.state.roomUpgrades, t, RW); }
    for (let k = 1; k < 5; k++) if (Math.abs(k * RW - (x0 + e.visW / 2)) < e.visW / 2 + 40) drawPartition(c, k);
    // depth-sorted sprites (avatar + followers)
    const list = [{ y: this.av.y, draw: () => { const s = .86 + (this.av.y - WALK_Y0) / (WALK_Y1 - WALK_Y0) * .24; c.save(); c.translate(this.av.x, this.av.y); c.scale(s * this.av.face * 1, s); drawAvatar(c, this.save.state.avatar, { t: this.av.t, walking: this.av.walking, wave: this.av.wave > 0, blink: this.blinkAt < 0 }); c.restore(); } }, ...this.sprites];
    list.sort((a, b) => a.y - b.y).forEach(s => s.draw(c));
    // glowing pad under the nearest station
    for (const s of STATIONS) { const sx = s.room * RW + s.x; if (sx < x0 - 60 || sx > x1 + 60) continue; const on = this.station?.id === s.id; c.save(); c.translate(sx, s.y + 18); c.scale(1, .26); c.beginPath(); c.arc(0, 0, 54 + (on ? Math.sin(t * 5) * 4 : 0), 0, 6.283); c.fillStyle = on ? 'rgba(255,255,255,.55)' : 'rgba(255,255,255,.22)'; c.fill(); c.lineWidth = 6; c.strokeStyle = on ? '#fff' : 'rgba(255,255,255,.4)'; c.setLineDash([14, 12]); c.stroke(); c.restore(); }
  }
}



