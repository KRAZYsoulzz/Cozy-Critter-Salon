// ============================================================================
// Cozy Critter Salon & Spa - Local Dev Server (zero dependencies)
// ============================================================================
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = process.env.PORT || 8089;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const cleanUrl = decodeURIComponent(req.url.split('?')[0]);
  const relPath = cleanUrl === '/' ? '/index.html' : cleanUrl;
  const fullPath = path.join(ROOT_DIR, relPath);

  if (!fullPath.startsWith(path.resolve(ROOT_DIR))) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(fullPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found: ' + relPath);
      return;
    }

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(fullPath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Cozy Critter Salon & Spa running at http://localhost:${PORT}`);
  console.log(`On your local network (e.g. Android tablet): http://<YOUR_IP>:${PORT}`);
});
