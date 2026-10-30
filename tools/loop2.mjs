export default async (page, h) => {
  await page.evaluate(() => { localStorage.setItem('cozy_seen', String(Date.now() - 6 * 60000)); });
  await page.reload(); await h.sleep(1800); await h.tap('#btn-play-game'); await h.sleep(500); await h.tap('#btn-avatar-done'); await h.sleep(700); await h.tap('#btn-save-pet-name'); await h.sleep(900);
  const r = await page.evaluate(async () => { const { petNeed } = await import('./src/flat/pets2d.js'); const sv = window.app.save, P = sv.state.pets, out = {};
    out.afterAway = Object.fromEntries(Object.entries(P).map(([k, p]) => [k, [p.stats.cleanliness, p.stats.hunger]]));
    // reset to full, tick until need appears
    for (const p of Object.values(P)) { p.stats.cleanliness = 100; p.stats.hunger = 100; p.stats.health = 100; p.ailments = []; p.twigs = []; p.scrapes = []; p.fever = false; p.dirtSpots = []; }
    let n = 0; while (!petNeed(P.capybara) && n < 60) { sv.tickNeeds(); n++; } out.ticksToNeed = n; out.need = petNeed(P.capybara);
    // rotation: dirty AND hungrier -> picks the more urgent
    P.axolotl.stats.cleanliness = 55; P.axolotl.stats.hunger = 40; out.rot = petNeed(P.axolotl);
    // vet cure clears everything
    const a = window.app; a.world.hooks.station = () => {}; const pid = sv.state.activePet; const st = P[pid]; st.ailments = ['x']; st.twigs = [0]; st.scrapes = [0]; st.fever = true; st.stats.health = 50;
    a.enterStation('vet'); await new Promise(r => setTimeout(r, 300)); const sc = window.flat.scene; sc.finishMode(sc.active, { coins: 20, text: 't', cure: true, stats: { health: 100 } }); out.vetNeedAfter = sv.getPetPrimaryNeed(pid).type; out.petNeedAfter = petNeed(st);
    return out; });
  console.log(JSON.stringify(r));
};
