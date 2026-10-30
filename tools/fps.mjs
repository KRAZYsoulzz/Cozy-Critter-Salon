// FPS probe: HEADED=1 node tools/probe.mjs tools/fps.mjs tools/out/fps
export default async (page, h) => {
  const meas = (ms) => h.ev((ms) => new Promise(res => { const ts = []; const t0 = performance.now(); const f = (t) => { ts.push(t); if (t - t0 < ms) requestAnimationFrame(f); else { const d = []; for (let i = 1; i < ts.length; i++) d.push(ts[i] - ts[i-1]); d.sort((a,b)=>a-b); const avg = (ts[ts.length-1]-ts[0])/(ts.length-1); res({ fps: +(1000/avg).toFixed(1), avgMs: +avg.toFixed(1), p95Ms: +d[Math.floor(d.length*0.95)].toFixed(1), maxMs: +d[d.length-1].toFixed(1) }); } }; requestAnimationFrame(f); }), ms);
  const info = await h.ev(() => { const a = window.gameApp; const gl = a.renderer.getContext(); const e = gl.getExtension('WEBGL_debug_renderer_info'); return { gpu: e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : '?', dpr: window.devicePixelRatio, pr: a.renderer.getPixelRatio(), w: innerWidth, h: innerHeight }; });
  console.log('ENV', JSON.stringify(info));
  const R = {};
  const log = async (name, ms = 3000) => { await h.sleep(500); const m = await meas(ms); const ri = await h.ev(() => { const i = window.gameApp.renderer.info; return { calls: i.render.calls, tris: i.render.triangles, geos: i.memory.geometries, tex: i.memory.textures }; }); R[name] = { ...m, ...ri }; console.log('FPS', name, JSON.stringify(R[name])); };
  await log('title');
  await h.tap('#btn-play-game'); await h.sleep(1500); await log('creator');
  await h.tap('#btn-avatar-done'); await h.sleep(900); await h.tap('#btn-save-pet-name'); await h.sleep(1800);
  await log('world');
  await h.ev(() => window.gameApp.enterStation('spa')); await h.sleep(1500); await log('spa-idle');
  const c = await h.ev(() => { const a = window.gameApp; const p = a.pets[a.save.state.activePet]; const v = p.root.position.clone(); v.y += 0.6; v.project(a.camera); return { x: (v.x*0.5+0.5)*innerWidth, y: (-v.y*0.5+0.5)*innerHeight }; });
  await page.mouse.move(c.x, c.y); await page.mouse.down();
  let stop = false; const mover = (async () => { let i = 0; while (!stop) { i++; await page.mouse.move(c.x + Math.cos(i*0.6)*70, c.y + Math.sin(i*0.6)*45); await h.sleep(30); } })();
  await log('spa-scrub'); stop = true; await mover; await page.mouse.up();
  await h.ev(() => window.gameApp.exitActivity()); await h.sleep(700);
  await h.ev(() => window.gameApp.enterStation('kitchen')); await h.sleep(1500); await log('kitchen');
  await h.ev(() => window.gameApp.exitActivity()); await h.sleep(700);
  await h.ev(() => window.gameApp.enterStation('shop')); await h.sleep(1500); await log('shop');
  await h.ev(() => window.gameApp.exitActivity()); await h.sleep(700);
  await log('world-after');
  console.log('FPSJSON', JSON.stringify(R));
};
