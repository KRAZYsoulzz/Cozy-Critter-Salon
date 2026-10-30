export default async (page, h) => {
  await h.sleep(2000);
  const log = async (t) => console.log(t, JSON.stringify(await h.ev(() => ({ mode: window.app.mode, x: Math.round(window.app.world.av.x), st: window.app.world.station?.id, coins: window.app.save.state.coins }))));
  await h.tap('#btn-play-game'); await h.sleep(600);
  await h.tap('#btn-avatar-surprise'); await h.sleep(400); await h.shot('creator2');
  await h.tap('#btn-avatar-done'); await h.sleep(900); await log('after creator'); await h.shot('adopt');
  await h.tap('#btn-save-pet-name'); await h.sleep(900); await log('after adopt'); await h.shot('world');
  // walk to spa station
  await h.ev(() => window.app.walkToOrEnterStation('spa')); await h.sleep(1200); await log('spa'); await h.shot('app-spa');
  await h.ev(() => window.app.exitActivity()); await h.sleep(500);
  await h.ev(() => window.app.walkToOrEnterStation('shop')); await h.sleep(1200); await log('shop'); await h.shot('app-shop');
  await h.tap('#btn-close-shop'); await h.sleep(600); await log('after shop close');
  await h.ev(() => window.app.walkToOrEnterStation('photobooth')); await h.sleep(1000); await h.shot('app-photo'); await h.tap('#btn-snap-photo'); await h.sleep(900); await log('photo');
  await h.tap('#btn-back-salon'); await h.sleep(500); await log('after photo back');
  await h.ev(() => window.app.walkToOrEnterStation('lobby')); await h.sleep(1000); await h.shot('app-clip'); await log('clip');
  await h.tap('#btn-close-clipboard'); await h.sleep(500); await log('after clip');
  console.log('album', await h.ev(() => window.app.save.state.photoAlbum.length));
};
