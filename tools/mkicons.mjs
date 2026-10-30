import fs from 'node:fs'; import { createRequire } from 'node:module';
const require = createRequire('C:/Users/gagee/.gemini/antigravity/brain/3abf2b96-e04a-4729-bc4b-51690ab7d8a5/scratch/shots/package.json');
const { chromium } = require('playwright-core');
const svg = fs.readFileSync('icons/icon.svg','utf8');
const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const p = await b.newPage();
async function render(size, name, scale=1) {
  await p.setViewportSize({width:size,height:size});
  const inner = scale===1 ? svg : svg.replace('<svg ','<svg ').replace(/<rect width="512" height="512" fill="url\(#bg\)"\/>/, '<rect width="512" height="512" fill="url(#bg)"/><g transform="translate(256 256) scale('+scale+') translate(-256 -256)">') .replace('</svg>','</g></svg>');
  await p.setContent(`<body style="margin:0;background:transparent"><div style="width:${size}px;height:${size}px">${inner.replace('<svg ','<svg width="'+size+'" height="'+size+'" ')}</div></body>`);
  await p.screenshot({ path: 'icons/'+name, omitBackground: true });
}
await render(512,'icon-512.png'); await render(192,'icon-192.png'); await render(180,'apple-touch-icon.png'); await render(512,'icon-maskable-512.png',0.74); await render(48,'icon-48.png');
await b.close();
