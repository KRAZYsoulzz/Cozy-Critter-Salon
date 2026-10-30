export default async (page, h) => {
  await h.sleep(600);
  await h.tap('#btn-play-game'); await h.sleep(1200);
  await h.tap('#btn-avatar-done'); await h.sleep(800);
  await h.tap('#btn-save-pet-name'); await h.sleep(1500);
  await h.ev(() => { const a = window.gameApp; a.save.state.pets[a.save.state.activePet].stats.cleanliness = 30; a.save.state.pets.axolotl && (a.save.state.pets.axolotl.stats.hunger = 20); a.updatePetThoughtBubbles(); });
  await h.sleep(1200);
  await h.shot('f-need-world');
  const pt = await h.ev(() => { const a = window.gameApp; for (const id of Object.keys(a.pets)) { const sp = a.pets[id].thoughtSprite; if (sp && sp.visible) { const V = a.camera.position.constructor; const v = sp.getWorldPosition(new V()); v.project(a.camera); return { id, x: (v.x*0.5+0.5)*innerWidth, y: (-v.y*0.5+0.5)*innerHeight }; } } return null; });
  console.log('bubble', JSON.stringify(pt));
  if (pt) { await page.mouse.click(pt.x, pt.y); await h.sleep(4000); console.log('after tap', await h.ev(() => window.gameApp.mode + ':' + window.gameApp._station)); await h.shot('g-after-bubble'); await h.ev(() => window.gameApp.exitActivity()); await h.sleep(700); }
  await h.ev(() => window.gameApp.enterStation('lobby')); await h.sleep(1500);
  console.log(await h.ev(() => { const e = document.getElementById('love-heart'); const r = e.getBoundingClientRect(); return JSON.stringify({d: getComputedStyle(e).display, r: [r.x,r.y,r.width,r.height], cls: document.body.className}); }));
};

