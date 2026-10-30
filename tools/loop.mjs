export default async (page, h) => {
  const T = (id) => h.ev((id) => document.getElementById(id).dispatchEvent(new PointerEvent('pointerdown',{bubbles:true})), id);
  await h.sleep(600);
  await h.shot('01-title');
  await h.tap('#btn-play-game'); await h.sleep(1500);
  await h.shot('02-avatar-hair');
  const nHair = await h.ev(() => document.querySelectorAll('#swatches-hair-style button').length);
  console.log('hair styles', nHair);
  for (let i = 1; i <= nHair; i++) { await h.tap(`#swatches-hair-style button:nth-child(${i})`); await h.sleep(450); await h.shot('03-hair-' + i); }
  for (const t of ['color','skin','outfit']) { await h.tap(`[data-creator-tab="${t}"]`); await h.sleep(300); await h.tap(`#swatches-${t==='color'?'hair-color':t==='skin'?'skin':'outfit'} > :nth-child(2)`); await h.sleep(500); await h.shot('04-avatar-' + t); }
  await h.tap('#btn-avatar-done'); await h.sleep(900);
  await h.shot('05-adopt');
  await h.tap('#btn-save-pet-name'); await h.sleep(1800);
  await h.shot('06-world');
  for (const id of ['spa','vet','kitchen','lobby','yard']) {
    await h.ev((i) => window.gameApp.enterStation(i), id); await h.sleep(1500);
    await h.shot('07-room-' + id);
    // interact: scrub on pet
    const c = await h.ev(() => { const a = window.gameApp; const p = a.pets[a.save.state.activePet]; const v = p.root.position.clone(); v.y += 0.6; v.project(a.camera); return { x: (v.x*0.5+0.5)*innerWidth, y: (-v.y*0.5+0.5)*innerHeight }; });
    await page.mouse.move(c.x, c.y); await page.mouse.down();
    const t0 = Date.now(); let i = 0; while (Date.now() - t0 < 1500) { i++; await page.mouse.move(c.x + Math.cos(i*0.6)*70, c.y + Math.sin(i*0.6)*45); await h.sleep(30); }
    await h.shot('08-act-' + id);
    await page.mouse.up(); await h.sleep(300);
    await h.ev(() => window.gameApp.exitActivity()); await h.sleep(700);
  }
  // catch treats
  await h.ev(() => window.gameApp.enterStation('yard')); await h.sleep(1300);
  await h.ev(() => { const b = [...document.querySelectorAll('.dock-tool-btn')].find(b => /Catch/i.test(b.textContent)); b && b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true})); });
  await h.sleep(3800); await h.shot('09-catch-treats');
  await h.ev(() => window.gameApp.exitActivity()); await h.sleep(700);
  await h.ev(() => window.gameApp.enterStation('shop')); await h.sleep(1300);
  await h.shot('10-shop');
  await h.ev(() => document.querySelectorAll('.shop-card')[1].dispatchEvent(new PointerEvent('pointerdown', {bubbles:true}))); await h.sleep(900);
  await h.shot('11-shop-preview');
  await h.ev(() => document.querySelector('[data-shop-tab="upgrades"]').dispatchEvent(new PointerEvent('pointerdown', {bubbles:true}))); await h.sleep(500);
  await h.shot('12-shop-upgrades');
  await h.ev(() => window.gameApp.exitActivity()); await h.sleep(700);
  await h.ev(() => window.gameApp.enterStation('photobooth')); await h.sleep(1300);
  await h.shot('13-photo');
  await h.tap('#btn-snap-photo'); await h.sleep(1200); await h.shot('14-photo-after');
  await h.ev(() => window.gameApp.exitActivity()); await h.sleep(700);
  await h.tap('#btn-open-clipboard'); await h.sleep(600); await h.shot('15-clipboard');
  await h.tap('#btn-close-clipboard'); await h.sleep(300);
  const g = await page.locator('#btn-settings-gate').boundingBox();
  await page.mouse.move(g.x + g.width/2, g.y + g.height/2); await page.mouse.down(); await h.sleep(1500); await h.shot('16-gate-progress'); await h.sleep(2000); await page.mouse.up(); await h.sleep(400);
  await h.shot('17-settings');
};
