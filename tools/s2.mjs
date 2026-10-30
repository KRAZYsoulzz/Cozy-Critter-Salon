export default async (page, h) => {
  await h.tap('#btn-play-game'); await h.sleep(900);
  await h.tap('#btn-avatar-done'); await h.sleep(600);
  await h.tap('#btn-save-pet-name'); await h.sleep(1200);
  const petXY = () => h.ev(() => { const a = window.gameApp; const p = a.pets[a.save.state.activePet]; const v = p.root.position.clone(); v.y += 0.6; v.project(a.camera); return { x: (v.x*0.5+0.5)*innerWidth, y: (-v.y*0.5+0.5)*innerHeight }; });
  const state = () => h.ev(() => ({ prog: document.getElementById('activity-progress-fill').style.width, speech: document.getElementById('speech-text').textContent.slice(0,70), dock: [...document.querySelectorAll('.dock-tool-btn')].map(b => (b.classList.contains('active')?'*':'')+b.textContent.trim().slice(0,12)+(b.classList.contains('done')?'✓':'')).join(' | '), reward: !document.getElementById('reward-modal').classList.contains('hidden') }));
  const scrub = async (ms) => { const c = await petXY(); await page.mouse.move(c.x, c.y); await page.mouse.down(); const t0 = Date.now(); let i = 0; while (Date.now() - t0 < ms) { i++; await page.mouse.move(c.x + Math.cos(i*0.6)*70, c.y + Math.sin(i*0.6)*45); await h.sleep(30); } await page.mouse.up(); };
  for (const st of ['spa','vet']) {
    await h.ev((i) => window.gameApp.enterStation(i), st); await h.sleep(1200);
    console.log(st, 'start', JSON.stringify(await state()));
    for (let round = 0; round < 8; round++) {
      await scrub(1800);
      const s = await state();
      console.log(st, 'round', round, JSON.stringify(s));
      if (s.reward) break;
    }
    await h.shot('s2-' + st + '-end');
    // scrub-through check: switch tool via dock
    if (!(await state()).reward) {
      await h.ev(() => document.querySelectorAll('.dock-tool-btn')[2].dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))); await h.sleep(500);
      console.log(st, 'after tool switch', JSON.stringify(await state()));
      await h.shot('s2-' + st + '-switch');
    }
    await h.ev(() => window.gameApp.exitActivity()); await h.sleep(500);
  }
};
