export default async (page, h) => {
  await page.goto(new URL(page.url()).origin + '/flat-game.html'); await h.sleep(900);
  await page.evaluate(() => { const f = window.flat; f.save.state.activePet = 'capybara'; f.save.state.pets.capybara.equipped.hat = 'tangerine_stack'; f.scene.enter('spa'); });
  await h.sleep(500); await h.shot('spa-start');
  const S = () => page.evaluate(() => { const a = window.flat.scene.active; return a ? { step: a.step, done: a.done } : null; });
  const sc = (x, y) => page.evaluate(([x, y]) => { const e = window.flat.engine, S = Math.min(e.W / 1000, e.H / 540); return [(e.W - 1000 * S) / 2 + x * S, (e.H - 540 * S) / 2 + y * S]; }, [x, y]);
  const scrub = async (pts, reps = 6) => { const [x0, y0] = await sc(...pts[0]); await page.mouse.move(x0, y0); await page.mouse.down(); for (let r = 0; r < reps; r++) for (const p of pts) { const [x, y] = await sc(...p); await page.mouse.move(x, y, { steps: 6 }); } await page.mouse.up(); };
  const zig = [[420, 330], [580, 360], [420, 390], [580, 420], [420, 300], [580, 280], [440, 260], [560, 230]];
  const names = ['scrub', 'rinse', 'dry', 'brush'];
  for (let k = 0; k < 4; k++) { let n = 0; while ((await S()).step === k && n < 80) { await scrub(zig, 1); n++; if (n === 2) await h.shot('spa-' + names[k]); } console.log(names[k], 'strokes', n, await S()); }
  await h.sleep(600); await h.shot('spa-done');
  console.log('coins', await page.evaluate(() => window.flat.save.state.coins), 'routines', await page.evaluate(() => window.flat.save.state.routinesCompleted));
};
