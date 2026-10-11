// `npm run dev`: build, serve dist/ on http://localhost:3000, and rebuild when
// content-md-files/ or src/ changes.
// `npm run preview:pages` does the same under /<repo>/, the way a GitHub Pages
// project site serves it, to catch links that ignore the base path.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');
let port = Number(process.env.PORT) || 3000;
const baseArg = process.argv.find((a) => a.startsWith('--base='));
const BASE = (baseArg ? baseArg.slice(7) : process.env.BASE_PATH || '').trim().replace(/\/+$/, '').replace(/^(?=[^/])/, '/');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

let running = false;
let queued = false;
function rebuild() {
  if (running) { queued = true; return; }
  running = true;
  const child = spawn(process.execPath, [path.join(ROOT, 'build.mjs')], {
    stdio: 'inherit',
    env: { ...process.env, BASE_PATH: BASE, SITE_URL: `http://localhost:${port}${BASE}` },
  });
  child.on('exit', () => {
    running = false;
    if (queued) { queued = false; rebuild(); }
  });
}

function send(res, status, file) {
  res.writeHead(status, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(file).pipe(res);
}

const server = http.createServer((req, res) => {
  let urlPath;
  try { urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400).end(); return; }
  if (BASE) {
    // Only answer under the base folder, like GitHub Pages does.
    if (urlPath === '/' || urlPath === BASE) { res.writeHead(302, { Location: `${BASE}/` }).end(); return; }
    if (!urlPath.startsWith(`${BASE}/`)) { res.writeHead(404, { 'Content-Type': 'text/plain' }).end(`Not found. This preview serves the site under ${BASE}/.`); return; }
    urlPath = urlPath.slice(BASE.length);
  }
  let file = path.join(DIST, urlPath);
  if (file !== DIST && !file.startsWith(DIST + path.sep)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!urlPath.endsWith('/')) { res.writeHead(301, { Location: `${BASE}${urlPath}/` }).end(); return; }
    file = path.join(file, 'index.html');
  }
  if (fs.existsSync(file)) return send(res, 200, file);
  const notFound = path.join(DIST, '404.html');
  if (fs.existsSync(notFound)) return send(res, 404, notFound);
  res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found. The site may still be building.');
});

// If the port is taken (for example by another dev server), try the next one.
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE' && port < 3010) {
    console.log(`Port ${port} is in use, trying ${port + 1}...`);
    port += 1;
    server.listen(port);
  } else {
    console.error(e.message);
    process.exit(1);
  }
});
server.on('listening', () => {
  console.log(`Serving dist/ at http://localhost:${port}${BASE}/  (press Ctrl+C to stop)`);
  rebuild();
});
server.listen(port);

let timer;
for (const dir of ['content-md-files', 'src']) {
  fs.watch(path.join(ROOT, dir), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(rebuild, 150);
  });
}
