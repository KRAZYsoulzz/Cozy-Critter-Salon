// Dev harness: node tools/probe.mjs <scenario.mjs> [outDir]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';
const require = createRequire('C:/Users/gagee/.gemini/antigravity/brain/3abf2b96-e04a-4729-bc4b-51690ab7d8a5/scratch/shots/package.json');
const { chromium } = require('playwright-core');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MIME = { '.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.mjs':'application/javascript','.json':'application/json','.mp3':'audio/mpeg','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon' };
const scenario = process.argv[2];
const outDir = path.resolve(process.argv[3] || path.join(ROOT, 'screens', 'v3'));
fs.mkdirSync(outDir, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  const f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(f, (e, d) => { if (e) { res.writeHead(404); return res.end('nf'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); res.end(d); });
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const chrome = process.env.EDGE ? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' : fs.existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe') ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const browser = await chromium.launch({ executablePath: chrome, headless: !process.env.HEADED, args: process.env.HEADED ? ['--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required','--mute-audio','--window-size=1300,900','--window-position=0,0', ...(process.env.SOFT ? ['--disable-gpu','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] : [])] : ['--use-gl=angle','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required','--mute-audio'] });
const vp = (process.env.VP || '1280x800').split('x').map(Number);
const ctx = await browser.newContext({ viewport: { width: vp[0], height: vp[1] }, deviceScaleFactor: +(process.env.DSF||1) });
const page = await ctx.newPage();
await page.addInitScript(() => { const noop = () => {}; const stub = { speak: noop, cancel: noop, pause: noop, resume: noop, getVoices: () => [], speaking: false, pending: false, paused: false, onvoiceschanged: null, addEventListener: noop, removeEventListener: noop }; try { Object.defineProperty(window, 'speechSynthesis', { value: stub, configurable: true }); } catch (e) {} window.SpeechSynthesisUtterance = function () {}; HTMLMediaElement.prototype.play = function () { return Promise.resolve(); }; });
const errors = [], warns = [], failed = [];
page.on('pageerror', e => { errors.push('PAGEERR ' + e.message); console.log('[PAGEERR]', e.message, (e.stack||'').split('\n').slice(0,4).join(' | ')); });
page.on('console', m => { if (m.type() === 'error') { errors.push(m.text()); console.log('[ERR]', m.text()); } else if (m.type() === 'warning') { warns.push(m.text()); console.log('[WARN]', m.text().slice(0,200)); } else if (process.env.LOGS) console.log('[log]', m.text().slice(0,200)); });
page.on('requestfailed', r => { failed.push(r.url()); console.log('[REQFAIL]', r.url()); });
page.on('response', r => { if (r.status() >= 400) console.log('[HTTP', r.status() + ']', r.url()); });
const h = {
  sleep, outDir, port,
  shot: async (name) => { await page.screenshot({ path: path.join(outDir, name + '.png') }); console.log('shot', name); },
  tap: async (sel) => { await page.dispatchEvent(sel, 'pointerdown'); await page.dispatchEvent(sel, 'pointerup'); },
  ev: (fn, arg) => page.evaluate(fn, arg),
};
await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: 'networkidle' });
await sleep(800);
try {
  const mod = await import(pathToFileURL(path.resolve(scenario)).href);
  await mod.default(page, h);
} catch (e) { console.log('SCENARIO FAIL', e); errors.push('scenario: ' + e.message); }
await browser.close(); server.close();
console.log('ERRORS:', errors.length, JSON.stringify(errors.slice(0, 10)));
console.log('WARNS:', warns.length);
process.exit(0);






