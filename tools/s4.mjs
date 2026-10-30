export default async (page, h) => {
  await h.tap('#btn-play-game'); await h.sleep(900);
  await h.tap('#btn-avatar-done'); await h.sleep(600);
  await h.tap('#btn-save-pet-name'); await h.sleep(1200);
  const petXY = (dy = 0.6) => h.ev((dy) => { const a = window.gameApp; const p = a.pets[a.save.state.activePet]; const v = p.root.position.clone(); v.y += dy; v.project(a.camera); return { x: (v.x*0.5+0.5)*innerWidth, y: (-v.y*0.5+0.5)*innerHeight }; }, dy);
  const state = () => h.ev(() => ({ prog: document.getElementById('activity-progress-fill').style.width, speech: document.getElementById('speech-text').textContent.slice(0,60), reward: !document.getElementById('reward-modal').classList.contains('hidden'), score: document.querySelector('.minigame-score')?.textContent, mode: window.gameApp.mode }));
  const enter = async (st) => { await h.ev((i) => window.gameApp.enterStation(i), st); await h.sleep(1300); };
  // LOBBY
  await enter('lobby');
  { const c = await petXY(0.6); await page.mouse.move(c.x, c.y); await page.mouse.down(); const t0 = Date.now(); let i = 0; let shot = false;
    while (Date.now() - t0 < 20000) { i++; await page.mouse.move(c.x + Math.cos(i*0.4)*60, c.y + Math.sin(i*0.4)*40); await h.sleep(30);
      if (!shot && Date.now() - t0 > 3000) { shot = true; await h.shot('s4-lobby-mid'); console.log('lobby 3s', JSON.stringify(await state())); }
      if ((await state()).reward) { console.log('lobby complete in ms', Date.now() - t0); break; } }
    await page.mouse.up(); }
  await h.tap('#btn-reward-continue'); await h.sleep(900);
  console.log('after reward mode', (await state()).mode);
  // YARD minigame
  await enter('yard');
  await h.ev(() => { const b = [...document.querySelectorAll('.dock-tool-btn')].find(b => /Catch/i.test(b.textContent)); b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true})); });
  await h.sleep(1200);
  { const c = await petXY(0.6); const t0 = Date.now(); let i = 0, shot = 0;
    while (Date.now() - t0 < 30000) { i++; await page.mouse.move(c.x + Math.sin(i*0.05)*220, c.y); await h.sleep(40);
      if (Date.now() - t0 > 1800 && shot === 0) { shot = 1; await h.shot('s4-yard-fall'); }
      if (Date.now() - t0 > 7000 && shot === 1) { shot = 2; await h.shot('s4-yard-score'); console.log('yard', JSON.stringify(await state())); }
      if ((await state()).reward) { console.log('yard done ms', Date.now() - t0); break; } } }
  console.log('yard end', JSON.stringify(await state())); await h.shot('s4-yard-end');
};
