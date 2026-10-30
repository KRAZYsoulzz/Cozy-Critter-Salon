export default async (page, h) => {
  await h.sleep(600);
  await h.tap('#btn-play-game'); await h.sleep(1500);
  await h.tap('#btn-avatar-done'); await h.sleep(900);
  await h.tap('#btn-save-pet-name'); await h.sleep(1800);
  for (const pet of ['dikdik', 'axolotl', 'capybara']) {
    await h.ev((p) => { window.gameApp.selectPet(p); }, pet); await h.sleep(500);
    try { await h.tap('#btn-save-pet-name'); } catch (e) {} await h.sleep(900);
    await h.ev(() => window.gameApp.enterStation('yard')); await h.sleep(3200);
    await h.shot('face-' + pet);
    await h.ev(() => window.gameApp.exitActivity()); await h.sleep(500);
  }
};
