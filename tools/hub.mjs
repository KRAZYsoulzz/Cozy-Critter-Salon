export default async (page, h) => {
  const o = new URL(page.url()).origin;
  await page.goto(o + '/flat-game.html'); await h.sleep(1200);
  for (const [i, name] of [[0,'kitchen'],[1,'spa'],[2,'lobby'],[3,'vet'],[4,'yard']]) {
    await page.evaluate(i => { const w = window.flat.world; w.av.x = i*900+450; w.av.y = 500; w.e.cam.x = i*900+450 - w.e.visW/2; }, i); await h.sleep(700); await h.shot('hub-' + name);
  }
};
