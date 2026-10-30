export default async (page, h) => {
  const cdp = await page.context().newCDPSession(page);
  const touch = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }] });
  await h.tap('#btn-play-game'); await h.sleep(1500); await h.tap('#btn-avatar-done'); await h.sleep(900); await h.tap('#btn-save-pet-name'); await h.sleep(2500);
  const pos = () => h.ev(() => { const p = window.gameApp.avatar.root.position; return [+p.x.toFixed(2), +p.z.toFixed(2)]; });
  const place = (x, z) => h.ev(([x, z]) => { const a = window.gameApp.avatar; a.root.position.set(x, 0, z); a.hasTarget = false; }, [x, z]);
  const scr = (x, z) => h.ev(([x, z]) => { const a = window.gameApp; const v = new a.avatar.root.position.constructor(x, 0, z).project(a.camera); return [(v.x * .5 + .5) * innerWidth, (-v.y * .5 + .5) * innerHeight]; }, [x, z]);
  const drag = async (fx, fz, tx, tz, ms = 2200) => {
    await place(fx, fz); await h.sleep(500);
    const [sx, sy] = await scr(tx, tz);
    await touch('touchStart', sx, sy); await h.sleep(ms); await touch('touchEnd');
    return pos();
  };
  console.log('wall x=-3.7 from lobby, drag left   ->', await drag(-2.5, 4.2, -6, 4.2), '(want x > -3.4)');
  console.log('wall z=-0.7 from lobby, drag up(x=-3.7)->', await drag(-4.6, 0.5, -4.6, -4, 2400), '(want z > -0.3)');
  console.log('doorway x=-3.7 z=2.1 drag left       ->', await drag(-2.5, 2.1, -6, 2.1, 2600), '(want x < -4.5)');
  console.log('doorway z=-0.7 x=0 drag up           ->', await drag(0, 1.5, 0, -4, 3000), '(want z < -1.5)');
  console.log('kitchen table drag through           ->', await drag(-7.2, -2.6, -7.2, -5.2, 2400), '(want stays z > -3)');
  console.log('spa tub drag through                 ->', await drag(-7.2, 3.6, -7.2, 0.8, 2400), '(want z > 2.8)');
  console.log('pushOut after bad teleport            ->', await h.ev(() => { const a = window.gameApp; a.avatar.root.position.set(-7.2, 0, 1.65); a.mode='activity'; a.exitActivity(); const p = a.avatar.root.position; return [+p.x.toFixed(2), +p.z.toFixed(2)]; }));
  await h.shot('main-collide');
};
