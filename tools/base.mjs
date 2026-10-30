export default async (page, h) => {
  await h.shot('base-title');
  await h.tap('#btn-play-game'); await h.sleep(900);
  await h.tap('#btn-avatar-surprise'); await h.sleep(500);
  await h.shot('base-avatar');
  await h.tap('#btn-avatar-done'); await h.sleep(800);
  await h.tap('#btn-save-pet-name'); await h.sleep(1200);
  await h.shot('base-world');
  const info = await h.ev(() => { const a = window.gameApp; return {fog: !!a.scene.fog, ex: a.renderer.toneMappingExposure, bloom: a.bloomPass.strength}; });
  console.log(info);
  // test: disable fog
  await h.ev(() => { window.gameApp.scene.fog = null; });
  await h.sleep(300); await h.shot('t-nofog');
  await h.ev(() => { window.gameApp.bloomPass.enabled = false; });
  await h.sleep(300); await h.shot('t-nobloom');
  await h.ev(() => { window.gameApp.renderer.toneMappingExposure = 0.7; });
  await h.sleep(300); await h.shot('t-exp07');
};
