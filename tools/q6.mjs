export default async (page, h) => {
  await h.sleep(600);
  await h.tap('#btn-play-game'); await h.sleep(1500);
  await h.tap('#btn-avatar-done'); await h.sleep(900);
  await h.tap('#btn-save-pet-name'); await h.sleep(2200);
  await h.ev(() => window.gameApp.enterStation('spa')); await h.sleep(1300);
  await h.shot('banner-spa');
  await h.sleep(1800);
  await h.ev(() => { const a = window.gameApp; const p = a.pets[a.save.state.activePet]; const v = p.root.position.clone(); v.y += 1; v.project(a.camera); a.fxBurst({ x: (v.x*0.5+0.5)*innerWidth, y: (-v.y*0.5+0.5)*innerHeight }, 10, 5); });
  await h.sleep(380);
  await h.shot('burst-spa');
  await h.ev(() => window.gameApp.exitActivity()); await h.sleep(1800);
  await h.ev(() => window.gameApp.enterStation('kitchen')); await h.sleep(1300);
  await h.shot('banner-kitchen');
};
