export default async (page, h) => {
  await h.sleep(600);
  await h.tap('#btn-play-game'); await h.sleep(1500);
  await h.shot('a-creator');
  await h.tap('#btn-avatar-done'); await h.sleep(900);
  await h.tap('#btn-save-pet-name'); await h.sleep(1800);
  // thought bubble tap
  const pt = await h.ev(() => { const a = window.gameApp; for (const id of Object.keys(a.pets)) { const sp = a.pets[id].thoughtSprite; if (sp && sp.visible) { const v = sp.getWorldPosition(new sp.position.constructor()); v.project(a.camera); return { id, x: (v.x*0.5+0.5)*innerWidth, y: (-v.y*0.5+0.5)*innerHeight }; } } return null; });
  console.log('bubble', JSON.stringify(pt));
  if (pt) { await page.mouse.click(pt.x, pt.y); await h.sleep(3500); console.log('mode after bubble tap', await h.ev(() => window.gameApp.mode + ':' + window.gameApp._station)); await h.shot('b-after-bubble'); await h.ev(() => window.gameApp.exitActivity()); await h.sleep(700); }
  // lobby heart
  await h.ev(() => window.gameApp.enterStation('lobby')); await h.sleep(1500);
  const c = await h.ev(() => { const a = window.gameApp; const p = a.pets[a.save.state.activePet]; const v = p.root.position.clone(); v.y += 0.6; v.project(a.camera); return { x: (v.x*0.5+0.5)*innerWidth, y: (-v.y*0.5+0.5)*innerHeight }; });
  await page.mouse.move(c.x, c.y); await page.mouse.down();
  const t0 = Date.now(); let i = 0; while (Date.now() - t0 < 1800) { i++; await page.mouse.move(c.x + Math.cos(i*0.6)*70, c.y + Math.sin(i*0.6)*45); await h.sleep(30); }
  await h.shot('c-lobby-heart'); await page.mouse.up();
  await h.ev(() => { document.querySelectorAll('.center-modal,.modal-overlay').forEach(m=>m.classList.add('hidden')); window.gameApp.exitActivity(); }); await h.sleep(700);
  // sticker
  await h.ev(() => window.gameApp.enterStation('photobooth')); await h.sleep(1300);
  await h.tap('#btn-snap-photo'); await h.sleep(1000); await h.shot('d-sticker-pop'); await h.sleep(1500);
  await h.ev(() => window.gameApp.exitActivity()); await h.sleep(700);
  await h.tap('#btn-open-stickers'); await h.sleep(600); await h.shot('e-sticker-book');
};
