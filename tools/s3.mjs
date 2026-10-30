export default async (page, h) => {
  await h.tap('#btn-play-game'); await h.sleep(900);
  await h.tap('#btn-avatar-done'); await h.sleep(600);
  await h.tap('#btn-save-pet-name'); await h.sleep(1200);
  const petXY = (dy = 0.6) => h.ev((dy) => { const a = window.gameApp; const p = a.pets[a.save.state.activePet]; const v = p.root.position.clone(); v.y += dy; v.project(a.camera); return { x: (v.x*0.5+0.5)*innerWidth, y: (-v.y*0.5+0.5)*innerHeight }; }, dy);
  const state = () => h.ev(() => ({ prog: document.getElementById('activity-progress-fill').style.width, speech: document.getElementById('speech-text').textContent.slice(0,60), reward: !document.getElementById('reward-modal').classList.contains('hidden'), score: document.querySelector('.minigame-score')?.textContent }));
  const closeReward = async () => { if ((await state()).reward) { await h.shot('s3-reward'); await h.tap('#btn-reward-continue'); await h.sleep(900); } };
  const enter = async (st) => { await h.ev((i) => window.gameApp.enterStation(i), st); await h.sleep(1300); };
  const leave = async () => { await h.ev(() => window.gameApp.exitActivity()); await h.sleep(600); };
  const scrub = async (ms, dy) => { const c = await petXY(dy); await page.mouse.move(c.x, c.y); await page.mouse.down(); const t0 = Date.now(); let i = 0; while (Date.now() - t0 < ms) { i++; await page.mouse.move(c.x + Math.cos(i*0.6)*70, c.y + Math.sin(i*0.6)*45); await h.sleep(30); } await page.mouse.up(); };

  // VET
  await enter('vet'); console.log('vet start', JSON.stringify(await state()));
  for (let r = 0; r < 12; r++) { await scrub(1800); const s = await state(); console.log('vet', r, s.prog, s.speech, s.reward); if (s.reward) break; }
  await h.shot('s3-vet-end'); await closeReward(); await leave();

  // KITCHEN
  await enter('kitchen');
  for (let n = 0; n < 3; n++) {
    const c = await petXY(0.6);
    await page.mouse.move(c.x - 250, c.y + 150); await page.mouse.down();
    for (let k = 1; k <= 8; k++) { await page.mouse.move(c.x - 250 + 250*k/8, c.y + 150 - 140*k/8); await h.sleep(40); }
    if (n === 0) { await h.sleep(60); await h.shot('s3-kitchen-feed'); }
    await page.mouse.up(); await h.sleep(250);
    if (n === 0) await h.shot('s3-kitchen-chomp');
    await h.sleep(900);
    console.log('kitchen feed', n, JSON.stringify(await state()));
  }
  await h.sleep(500); await closeReward(); await leave();

  // LOBBY petting timing
  await enter('lobby');
  { const c = await petXY(0.6); await page.mouse.move(c.x, c.y); await page.mouse.down(); const t0 = Date.now(); let i = 0; let shot = false;
    while (Date.now() - t0 < 20000) { i++; await page.mouse.move(c.x + Math.cos(i*0.4)*60, c.y + Math.sin(i*0.4)*40); await h.sleep(30);
      if (!shot && Date.now() - t0 > 2500) { shot = true; await h.shot('s3-lobby-mid'); console.log('lobby 2.5s', JSON.stringify(await state())); }
      if ((await state()).reward) { console.log('lobby complete in ms', Date.now() - t0); break; } }
    await page.mouse.up(); }
  await closeReward(); await leave();

  // YARD toys then minigame
  await enter('yard');
  for (let r = 0; r < 10; r++) { await scrub(1200); const s = await state(); if (s.reward) break; }
  console.log('yard toys', JSON.stringify(await state())); await closeReward();
  await h.ev(() => { const b = [...document.querySelectorAll('.dock-tool-btn')].find(b => /Catch/i.test(b.textContent)); b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true})); });
  await h.sleep(1200);
  { const c = await petXY(0.6); const t0 = Date.now(); let i = 0, shot = 0;
    while (Date.now() - t0 < 12000) { i++; await page.mouse.move(c.x + Math.sin(i*0.05)*220, c.y); await h.sleep(40);
      if (Date.now() - t0 > 1800 && shot === 0) { shot = 1; await h.shot('s3-yard-fall'); }
      if (Date.now() - t0 > 6500 && shot === 1) { shot = 2; await h.shot('s3-yard-score'); console.log('yard', JSON.stringify(await state())); } } }
  await h.sleep(20000); console.log('yard end', JSON.stringify(await state())); await closeReward(); await leave();
};
