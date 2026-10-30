export default async (page, h) => {
  await page.evaluate(() => localStorage.removeItem('cozy_daily'));
  await h.sleep(1500); await h.tap('#btn-play-game'); await h.sleep(500); await h.tap('#btn-avatar-done'); await h.sleep(700); await h.tap('#btn-save-pet-name'); await h.sleep(900);
  await page.evaluate(() => { window.app.ui.speechBar.classList.add('hidden'); });
  await h.sleep(4500); await h.shot('o-world-hint');
  const S = () => page.evaluate(() => JSON.stringify({ coins: window.app.save.state.coins, rc: window.app.save.state.routinesCompleted, stars: window.app.save.state.stars }));
  console.log('start', await S());
  await page.evaluate(() => window.app.enterStation('spa')); await h.sleep(4800); await h.shot('o-spa-hint');
  await page.evaluate(() => window.flat.scene.finish()); await h.sleep(900); await h.shot('o-result-a'); await h.sleep(1900); await h.shot('o-result-b');
  console.log('after spa', await S());
  await page.evaluate(() => window.app.exitActivity()); await h.sleep(400);
  for (const id of ['kitchen', 'vet', 'yard']) { await page.evaluate(i => window.app.enterStation(i), id); await h.sleep(4800); await h.shot('o-' + id + '-hint'); await page.evaluate(() => window.app.exitActivity()); await h.sleep(300); }
  // second spa right away: pet is clean so reward should be halved
  await page.evaluate(() => window.app.enterStation('spa')); await h.sleep(300); await page.evaluate(() => window.flat.scene.finish()); await h.sleep(200); console.log('after 2nd spa', await S(), JSON.stringify(await page.evaluate(() => window.flat.scene.active.result)));
};
