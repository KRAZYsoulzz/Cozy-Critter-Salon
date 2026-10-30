export default async (page, h) => {
  await h.sleep(600);
  await h.tap('#btn-play-game'); await h.sleep(1500);
  await h.tap('#btn-avatar-done'); await h.sleep(900);
  await h.tap('#btn-save-pet-name'); await h.sleep(2500);
  const info = await h.ev(() => { const a = window.gameApp; const p = a.pets.capybara; return { rug: p && p.rug && p.rug.visible, thought: p && p.thoughtSprite && p.thoughtSprite.visible, icon: p && p.currentBubbleIcon, mode: a.mode }; });
  console.log('INFO', JSON.stringify(info));
  await h.shot('world');
  await h.ev(() => window.gameApp.enterStation('vet')); await h.sleep(7500);
  await h.shot('vet-ghost');
};
