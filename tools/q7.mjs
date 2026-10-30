export default async (page, h) => {
  await h.sleep(600);
  await h.tap('#btn-play-game'); await h.sleep(1500);
  await h.tap('#btn-avatar-done'); await h.sleep(900);
  await h.tap('#btn-save-pet-name'); await h.sleep(2200);
  await h.ev(() => window.gameApp.enterStation('spa')); await h.sleep(3000);
  await h.ev(() => { window.gameApp.fxBurst({ x: 640, y: 380 }, 10, 5); });
  for (const t of [100, 300, 300]) { await h.sleep(t); console.log(JSON.stringify(await h.ev(() => { const b = [...document.querySelectorAll('.fx-bit')].slice(0,3).map(x => { const c = getComputedStyle(x); return [c.transform, c.opacity, x.style.getPropertyValue('--dx')]; }); return b; }))); }
};
