export default async (page, h) => {
  await h.sleep(1500); await h.tap('#btn-play-game'); await h.sleep(500); await h.tap('#btn-avatar-done'); await h.sleep(700); await h.tap('#btn-save-pet-name'); await h.sleep(900); await page.evaluate(() => { window.app.ui.speechBar.classList.add('hidden'); window.app.world.hooks.pick = null; });
  const cdp = await page.context().newCDPSession(page);
  const touch = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }] });
  const av = () => page.evaluate(() => { const a = window.flat.world.av; return [Math.round(a.x), Math.round(a.y)]; });
  const place = (x, y) => page.evaluate(([x, y]) => { const w = window.flat.world; w.av.x = x; w.av.y = y; w.av.has = false; w.e.cam.x = x - w.e.visW / 2; w.e.cam.x = Math.max(0, w.e.cam.x); }, [x, y]);
  const scr = (wx, wy) => page.evaluate(([wx, wy]) => { const e = window.flat.engine; return [(wx - e.cam.x) * e.scale, Math.min((wy + e.offY) * e.scale, innerHeight - 80)]; }, [wx, wy]);
  const drag = async (fx, fy, tx, ty, ms = 2000) => { await place(fx, fy); await h.sleep(600); const [sx, sy] = await scr(tx, ty); await touch('touchStart', sx, sy); await h.sleep(ms); await touch('touchEnd'); return av(); };
  const D = await page.evaluate(() => Math.min(380, window.flat.engine.visW * .3));
  console.log('start', await av());
  console.log('hold right 1.5s', await drag(2000, 480, 2000 + D, 480, 1500), '(want x>2150)');
  console.log('tub from front, drag up into it (x1190..1490,y408..462)', await drag(1340, 500, 1340, 400, 1800), '(want y>=476)');
  console.log('tub from left, drag right: want x<1280', await drag(1000, 440, 1000 + D, 440, 2200));
  console.log('doorway x=1800 y=470 hold right: want x>1850', await drag(1700, 470, 1700 + D, 470, 1500));
  console.log('partition back strip y=425 hold right: want x<1790', await drag(1700, 425, 1700 + D, 425, 1500));
  console.log('world wall hold left: want x>=30', await drag(300, 470, 300 - D, 470, 2200));
  console.log('release stops', await (async () => { const a = await av(); await h.sleep(500); const b = await av(); return [a, b]; })());
  await place(1350, 500); await h.sleep(900); await h.shot('spa-hub2');
};
