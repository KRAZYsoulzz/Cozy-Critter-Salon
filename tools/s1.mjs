export default async (page, h) => {
  await h.shot('s1-title');
  await h.tap('#btn-play-game'); await h.sleep(1200);
  await h.shot('s1-avatar-a');
  await h.tap('#swatches-hair-style button:nth-child(3)'); await h.sleep(500);
  await h.tap('#swatches-hair-color button:nth-child(5)'); await h.sleep(600);
  await h.shot('s1-avatar-b');
  const ov = await h.ev(() => { const p = document.querySelector('#avatar-modal .side-panel-card'); return { sh: p.scrollHeight, ch: p.clientHeight }; });
  console.log('avatar panel', ov);
  await h.tap('#btn-avatar-done'); await h.sleep(800);
  await h.tap('#btn-save-pet-name'); await h.sleep(1500);
  await h.shot('s1-world');
  for (const id of ['spa','vet','kitchen','lobby','yard','shop','photobooth']) {
    await h.ev((i) => window.gameApp.enterStation(i), id);
    await h.sleep(1300);
    await h.shot('s1-st-' + id);
    if (id === 'shop') {
      await h.ev(() => document.querySelector('.shop-card').dispatchEvent(new PointerEvent('pointerdown', {bubbles:true})));
      await h.sleep(700); await h.shot('s1-shop-try');
    }
    if (id === 'photobooth') {
      await h.tap('#btn-snap-photo'); await h.sleep(120); await h.shot('s1-photo-flash');
      await h.sleep(900); await h.shot('s1-photo-after');
    }
    await h.ev(() => window.gameApp.exitActivity());
    await h.sleep(500);
  }
};
