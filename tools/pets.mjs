export default async (page, h) => {
  const o = new URL(page.url()).origin; await page.goto(o + '/flat-game.html'); await h.sleep(900);
  const go = (x, y) => page.evaluate(([x, y]) => { const w = window.flat.world; w.av.x = x; w.av.y = y; w.av.has = false; w.e.cam.x = x - w.e.visW / 2; const p = window.flat.pets; for (const o of Object.values(p.pets)) { o.x = x - 80; o.y = y; } }, [x, y]);
  await go(1350, 500); await page.evaluate(() => { const s = window.flat.save.state; s.activePet = 'capybara'; s.pets.capybara.equipped.hat = 'tangerine_stack'; }); await h.sleep(1500); await h.shot('pet-capy-dirty');
  await page.evaluate(() => { const s = window.flat.save.state; s.activePet = 'dikdik'; s.pets.dikdik.stats = { health: 95, cleanliness: 90, hunger: 90, love: 95, energy: 95 }; s.pets.dikdik.ailments = []; s.pets.dikdik.equipped.glasses = 'heart_sunglasses'; s.pets.dikdik.equipped.hat = 'daisy_crown'; s.pets.axolotl.equipped.hat = 'princess_tiara'; s.pets.axolotl.equipped.neck = 'fluffy_pink_boa'; }); await go(4500 - 450, 500); await h.sleep(1500); await h.shot('pet-dikdik');
};
