export default async (page, h) => {
  await page.goto(new URL(page.url()).origin + '/flat-game.html'); await h.sleep(900);
  const sc = (x, y) => page.evaluate(([x, y]) => { const e = window.flat.engine, S = Math.min(e.W / 1000, e.H / 540); return [(e.W - 1000 * S) / 2 + x * S, (e.H - 540 * S) / 2 + y * S]; }, [x, y]);
  const mv = async (x, y, st = 8) => { const [a, b] = await sc(x, y); await page.mouse.move(a, b, { steps: st }); };
  const drag = async (x0, y0, x1, y1) => { await mv(x0, y0, 2); await page.mouse.down(); await mv(x1, y1, 10); await page.mouse.up(); };
  const A = () => page.evaluate(() => { const a = window.flat.scene.active; return a ? JSON.stringify({ done: a.done, fed: a.fed, vstep: a.vstep, caught: a.caught, sp: a.spawned }) : null; });
  const go = (k, pid) => page.evaluate(([k, pid]) => { const f = window.flat; f.save.state.activePet = pid; f.scene.exit(); f.scene.enter(k); }, [k, pid]);
  // kitchen
  await go('kitchen', 'capybara'); await h.sleep(400); await h.shot('kitchen-start');
  await drag(360, 500, 500, 250); await h.sleep(250); await h.shot('kitchen-eat'); console.log('k1', await A());
  await drag(640, 500, 500, 250); await drag(500, 500, 500, 250); console.log('k3', await A()); await h.sleep(1600); await h.shot('kitchen-done'); console.log('k done', await A());
  // vet
  await go('vet', 'axolotl'); await h.sleep(400); await h.shot('vet-start');
  await page.evaluate(() => { const a = window.flat.scene.active; });
  await drag(480, 380, 436, 370); await mv(446, 370, 4); await page.mouse.down(); for (let i = 0; i < 6; i++) { await mv(430, 362, 4); await mv(462, 378, 4); } await page.mouse.up(); console.log('v thorn', await A());
  await h.shot('vet-bandage'); { const [x, y] = await sc(500 + 58 * .8, 488 - 200 * .8); await page.mouse.click(x, y); } console.log('v band', await A());
  await mv(500, 292, 3); await page.mouse.down(); await h.sleep(2000); await h.shot('vet-thermo'); await page.mouse.up(); console.log('v thermo', await A());
  await mv(500, 384, 3); await page.mouse.down(); await h.sleep(2300); await page.mouse.up(); console.log('v stetho', await A());
  await drag(500, 500, 500, 300); await h.sleep(1500); await h.shot('vet-done'); console.log('v done', await A());
  // yard
  await go('yard', 'dikdik'); await h.sleep(300);
  for (let i = 0; i < 40; i++) { await page.evaluate(() => { const a = window.flat.scene.active; const t = a.treats.sort((p, q) => q.y - p.y)[0]; if (t) a.tx = t.x; }); await h.sleep(380); if (i === 6) await h.shot('yard-play'); const s = await A(); if (s?.done) break; }
  await h.sleep(500); await h.shot('yard-done'); console.log('y', await A()); console.log('coins', await page.evaluate(() => window.flat.save.state.coins));
};

