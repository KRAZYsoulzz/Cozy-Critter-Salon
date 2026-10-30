export default async (page, h) => {
  await h.sleep(2500);
  await h.shot('01-title');
  await h.tap('#btn-play-game'); await h.sleep(1500);
  await h.shot('02-avatar-hair');
  await h.tap('#btn-avatar-done'); await h.sleep(900);
  await h.tap('#btn-save-pet-name'); await h.sleep(1800);
  await h.shot('06-world');
  await h.ev(() => window.gameApp.enterStation('spa')); await h.sleep(250); await h.shot('06b-wipe'); await h.sleep(1200);
  await h.shot('07-room-spa');
};
