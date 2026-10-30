export default async (page, h) => {
  await h.sleep(1500); await h.tap('#btn-play-game'); await h.sleep(500); await h.tap('#btn-avatar-done'); await h.sleep(700); await h.tap('#btn-save-pet-name'); await h.sleep(900);
  for (const id of ['kitchen', 'yard']) {
    await page.evaluate(i => window.app.enterStation(i), id); await h.sleep(1500);
    for (let k = 0; k < 14; k++) { await page.evaluate(() => { const s = window.flat.scene, e = window.flat.engine; const a = s.active; if (a) { const px = 300 + Math.random() * 400, py = 300 + Math.random() * 150; for (const t of ['down', 'move', 'up']) s.pointer(t, { x: px, y: py, sx: 0, sy: 0 }); } }); await h.sleep(120); }
    await h.shot('m-' + id); console.log(id, await page.evaluate(() => JSON.stringify({ mode: window.app.mode, act: !!window.flat.scene.active })));
    await page.evaluate(() => window.app.exitActivity()); await h.sleep(500);
  }
};
