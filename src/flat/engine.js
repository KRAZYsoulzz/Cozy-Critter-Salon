// Canvas-2D engine: resize/dpr, camera, game loop, pointer input in world coords, film grain.
export class Engine {
  constructor(canvas, { designH = 540, minVisW = 460, worldW = 4500 } = {}) {
    this.cv = canvas; this.ctx = canvas.getContext('2d');
    Object.assign(this, { designH, minVisW, worldW, cam: { x: 0 }, time: 0, scale: 1, W: 1, H: 1, layers: [], updaters: [], handlers: {}, shake: 0 });
    this.grain = Engine.makeGrain();
    this._resize = () => this.resize(); addEventListener('resize', this._resize); this.resize();
    const p = e => { const r = this.cv.getBoundingClientRect(); return { sx: e.clientX - r.left, sy: e.clientY - r.top, x: (e.clientX - r.left) / this.scale + this.cam.x, y: (e.clientY - r.top) / this.scale, id: e.pointerId, t: performance.now() }; };
    for (const k of ['down', 'move', 'up']) this.cv.addEventListener('pointer' + k, e => { if (k === 'down') this.cv.setPointerCapture?.(e.pointerId); this.handlers[k]?.(p(e), e); });
    this.cv.addEventListener('pointercancel', e => this.handlers.up?.(p(e), e));
    this.cv.style.touchAction = 'none';
    this.last = performance.now(); this.running = true;
    const loop = now => { if (!this.running) return; const dt = Math.min(.05, (now - this.last) / 1000); this.last = now; this.tick(dt); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }
  static makeGrain() { const g = document.createElement('canvas'); g.width = g.height = 200; const x = g.getContext('2d'), d = x.createImageData(200, 200);
    for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 12; } x.putImageData(d, 0, 0); return g; }
  resize() {
    const dpr = Math.min(2, devicePixelRatio || 1), W = this.cv.clientWidth || innerWidth, H = this.cv.clientHeight || innerHeight;
    this.W = W; this.H = H; this.dpr = dpr; this.cv.width = Math.round(W * dpr); this.cv.height = Math.round(H * dpr);
    this.scale = Math.min(H / this.designH, W / this.minVisW); this.visW = W / this.scale; this.visH = H / this.scale;
  }
  on(k, fn) { this.handlers[k] = fn; }
  clampCam() { this.cam.x = Math.max(0, Math.min(this.worldW - this.visW, this.cam.x)); }
  tick(dt) {
    this.time += dt; for (const u of this.updaters) u(dt, this);
    this.clampCam(); this.shake = Math.max(0, this.shake - dt * 30);
    const c = this.ctx, s = this.scale * this.dpr;
    c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#2a1a33'; c.fillRect(0, 0, this.cv.width, this.cv.height);
    const sh = this.shake ? (Math.random() - .5) * this.shake : 0;
    const oy = Math.max(0, (this.visH - this.designH) / 2); // letterbox: centre vertically on tall screens
    c.setTransform(s, 0, 0, s, (-this.cam.x + sh) * s, (oy + sh) * s);
    for (const l of this.layers) { c.save(); l(c, this); c.restore(); }
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    c.save(); c.globalCompositeOperation = 'multiply'; c.globalAlpha = .55; c.fillStyle = c.createPattern(this.grain, 'repeat'); c.fillRect(0, 0, this.W, this.H); c.restore();
  }
  get offY() { return Math.max(0, (this.visH - this.designH) / 2); }
  // convert pointer (screen) coords to world, accounting for letterbox
  toWorld(px) { return { x: px.sx / this.scale + this.cam.x, y: px.sy / this.scale - this.offY }; }
}
