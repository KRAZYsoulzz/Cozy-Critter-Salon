export default async (page, h) => {
  const vp = await h.ev(() => innerWidth + 'x' + innerHeight); const tag = vp;
  await h.shot(tag + '-0title');
  const portraitPhone = await h.ev(() => getComputedStyle(document.getElementById('rotate-hint')).display !== 'none');
  await h.tap('#btn-play-game'); await h.sleep(1500);
  await h.tap('#btn-avatar-done'); await h.sleep(900);
  await h.tap('#btn-save-pet-name'); await h.sleep(2500);
  await h.shot(tag + '-1hub');
  const r = await h.ev(() => { const o = []; for (const s of ['.hud-top','#pet-switcher','.coin-pill','.hud-right-cluster','#speech-bar','.world-action-strip','.world-extras','#btn-station-prompt']) { const e = document.querySelector(s); if (!e) { o.push(s+': none'); continue; } const b = e.getBoundingClientRect(); o.push(s+' '+[b.left,b.top,b.right,b.bottom].map(Math.round).join(',')+(getComputedStyle(e).display==='none'?' HIDDEN':'')); } return o; });
  console.log(tag, 'rotateHint', portraitPhone, '\n' + r.join('\n'));
  await h.ev(() => window.gameApp.enterStation('spa')); await h.sleep(3500);
  await h.shot(tag + '-2spa');
};

