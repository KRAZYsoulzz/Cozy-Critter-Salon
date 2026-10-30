export default async (page, h) => {
  await h.sleep(600);
  await h.tap('#btn-play-game'); await h.sleep(1500);
  await h.tap('#btn-avatar-done'); await h.sleep(900);
  await h.tap('#btn-save-pet-name'); await h.sleep(1800);
  for (const pet of ['axolotl', 'dikdik']) {
    for (const st of ['spa', 'kitchen', 'vet', 'yard', 'lobby']) {
      await h.ev((p) => { const a = window.gameApp; if (a.mode !== 'world') a.exitActivity(); a.selectPet(p); }, pet);
      await h.sleep(500); try { await h.tap('#btn-save-pet-name'); } catch (e) {} await h.sleep(900);
      await h.ev((s) => window.gameApp.enterStation(s), st);
      await h.sleep(2000);
      await h.shot(`${pet}-${st}`);
      await h.ev(() => window.gameApp.exitActivity()); await h.sleep(500);
    }
  }
};

