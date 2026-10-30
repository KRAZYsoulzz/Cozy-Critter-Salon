export default async (page, h) => {
  await h.tap('#btn-play-game'); await h.sleep(1000);
  const hairA = () => h.ev(() => document.querySelectorAll('#swatches-hair-style button').length);
  console.log('hair style buttons', await hairA());
  for (const [tab, sel, n, name] of [['style','#swatches-hair-style button',6,'hairstyle'],['color','#swatches-hair-color button',3,'haircolor'],['outfit','#swatches-outfit button',3,'outfit']]) {
    await h.ev((t) => document.querySelector(`[data-creator-tab="${t}"]`).dispatchEvent(new PointerEvent('pointerdown',{bubbles:true})), tab);
    await h.tap(`[data-creator-tab="${tab}"]`);
    await h.sleep(300);
    await h.tap(`${sel}:nth-child(${n})`); await h.sleep(600);
    await h.shot('s5-avatar-' + name);
  }
  await h.tap('#btn-avatar-done'); await h.sleep(600);
  await h.tap('#btn-save-pet-name'); await h.sleep(1200);
  // gate
  const modalOpen = () => h.ev(() => !document.getElementById('settings-modal').classList.contains('hidden'));
  const g = await page.locator('#btn-settings-gate').boundingBox();
  await page.mouse.move(g.x + g.width/2, g.y + g.height/2); await page.mouse.down(); await h.sleep(1500);
  console.log('gate at 1.5s open?', await modalOpen()); await page.mouse.up(); await h.sleep(300);
  console.log('after release open?', await modalOpen());
  await page.mouse.move(g.x + g.width/2, g.y + g.height/2); await page.mouse.down(); await h.sleep(3400);
  console.log('gate at 3.4s open?', await modalOpen()); await page.mouse.up(); await h.shot('s5-gate-settings');
  await h.ev(() => document.getElementById('settings-modal').classList.add('hidden'));
  // shop
  await h.ev(() => window.gameApp.enterStation('shop')); await h.sleep(1300);
  const coins0 = await h.ev(() => window.gameApp.save.state.coins);
  await h.ev(() => document.querySelectorAll('.shop-card')[1].dispatchEvent(new PointerEvent('pointerdown', {bubbles:true}))); await h.sleep(900);
  await h.shot('s5-shop-preview');
  await h.ev(() => document.getElementById('shop-act-btn').dispatchEvent(new PointerEvent('pointerdown', {bubbles:true}))); await h.sleep(900);
  await h.ev(() => document.getElementById('shop-act-btn').dispatchEvent(new PointerEvent('pointerup', {bubbles:true})));
  console.log('coins', coins0, '->', await h.ev(() => window.gameApp.save.state.coins), 'inv', await h.ev(() => window.gameApp.save.state.inventory.join(',')));
  await h.shot('s5-shop-bought');
  await h.ev(() => document.querySelector('[data-shop-tab="silly"]').dispatchEvent(new PointerEvent('pointerdown', {bubbles:true}))); await h.sleep(500);
  await h.shot('s5-shop-silly');
  await h.ev(() => document.querySelector('[data-shop-tab="upgrades"]').dispatchEvent(new PointerEvent('pointerdown', {bubbles:true}))); await h.sleep(500);
  await h.shot('s5-shop-upgrades');
  await h.ev(() => window.gameApp.exitActivity()); await h.sleep(600);
  await h.shot('s5-world-after-shop');
  // photo
  await h.ev(() => window.gameApp.enterStation('photobooth')); await h.sleep(1300);
  await h.shot('s5-photo-before');
  for (let i = 0; i < 4; i++) { await h.tap('#btn-snap-photo'); await h.sleep(1100); }
  await h.shot('s5-photo-4snaps');
};
