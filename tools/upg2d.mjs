export default async (page, h) => {
  await h.sleep(1500);
  await h.tap('#btn-play-game'); await h.sleep(500); await h.tap('#btn-avatar-done'); await h.sleep(700); await h.tap('#btn-save-pet-name'); await h.sleep(700);
  await h.ev(() => { const a = window.app; a.save.state.roomUpgrades = { spa: 3, clinic: 3, lobby: 3, kitchen: 3, yard: 1 }; a.world.hooks.station = () => {}; a.ui.hudTop.classList.add('hidden'); a.ui.speechBar.classList.add('hidden'); a.ui.worldHudBottom.classList.add('hidden'); });
  const look = async (name, room) => { await h.ev(r => { const a = window.app; a.world.av.x = r * 900 + 450; a.world.av.y = 470; a.world.e.cam.x = r * 900 + 450 - a.world.e.visW / 2; window.__room = r; }, room); await h.sleep(900); await h.shot(name); };
  for (const [n, r] of [['up-kitchen', 0], ['up-spa', 1], ['up-lobby', 2], ['up-vet', 3]]) await look(n, r);
  await h.ev(() => { window.app.save.state.roomUpgrades = { spa: 2, clinic: 2, lobby: 2, kitchen: 2, yard: 1 }; }); await look('up2-spa', 1); await look('up2-vet', 3);
};
