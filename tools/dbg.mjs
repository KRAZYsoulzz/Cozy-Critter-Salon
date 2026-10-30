export default async (page, h) => {
  await h.sleep(1500); await h.tap('#btn-play-game'); await h.sleep(500); await h.tap('#btn-avatar-done'); await h.sleep(700); await h.tap('#btn-save-pet-name'); await h.sleep(900);
  const cdp = await page.context().newCDPSession(page);
  await page.evaluate(() => { const w = window.flat.world; w.av.x = 1700; w.av.y = 470; w.av.has = false; w.e.cam.x = 1700 - w.e.visW / 2; });
  await h.sleep(600);
  const s = await page.evaluate(() => { const e = window.flat.engine; return { sx: (2080 - e.cam.x) * e.scale, sy: (470 + e.offY) * e.scale, cam: e.cam.x, sc: e.scale, off: e.offY, W: e.W, H: e.H, cvr: JSON.stringify(e.cv.getBoundingClientRect()) }; });
  console.log(JSON.stringify(s));
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: s.sx, y: s.sy, id: 1 }] }); await h.sleep(500);
  console.log(await page.evaluate(() => JSON.stringify({ has: window.flat.world.av.has, hold: !!window.flat.world.holding, x: window.flat.world.av.x, tx: window.flat.world.av.tx, mode: window.app.mode })));
};
