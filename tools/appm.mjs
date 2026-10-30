export default async (page, h) => {
  await h.sleep(2000);
  const log = async (t) => console.log(t, JSON.stringify(await h.ev(() => ({ mode: window.app.mode, x: Math.round(window.app.world.av.x), st: window.app.world.station?.id, W: innerWidth, H: innerHeight }))));
  await h.tap('#btn-play-game'); await h.sleep(600); await h.shot('m-creator');
  await h.tap('#btn-avatar-done'); await h.sleep(900); await h.tap('#btn-save-pet-name'); await h.sleep(900); await h.shot('m-world'); await log('world');
  await h.ev(() => window.app.walkToOrEnterStation('shop')); await h.sleep(1200); await h.shot('m-shop');
  await h.tap('#btn-close-shop'); await h.sleep(500);
  await h.ev(() => window.app.walkToOrEnterStation('spa')); await h.sleep(1200); await h.shot('m-spa'); await log('spa');
  await h.ev(() => window.app.exitActivity()); await h.sleep(300);
  await h.ev(() => window.app.walkToOrEnterStation('kitchen')); await h.sleep(1000); await h.shot('m-kitchen');
  await h.ev(() => window.app.exitActivity()); await h.sleep(300); await h.ev(() => window.app.walkToOrEnterStation('lobby')); await h.sleep(500); await h.tap('#btn-close-clipboard'); await h.sleep(400); await log('after clip');
};
