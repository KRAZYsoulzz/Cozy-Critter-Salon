// ============================================================================
// Cozy Critter Salon & Spa 3D - Offline PWA Service Worker (sw.js)
// ============================================================================
const CACHE_NAME = 'cozy-critter-3d-v10';
const CORE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './polish.css',
  './vendor/fonts/Fredoka.ttf',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './src/polish.js',
  './src/decor.js',
  './src/spark.js', './src/spark2.js', './src/thumbs.js',
  './manifest.json',
  './favicon.svg',
  './favicon.ico',
  './vendor/three.module.js',
  './vendor/three.core.js',
  './vendor/jsm/geometries/RoundedBoxGeometry.js',
  './vendor/jsm/utils/BufferGeometryUtils.js',
  './vendor/jsm/postprocessing/EffectComposer.js',
  './vendor/jsm/postprocessing/RenderPass.js',
  './vendor/jsm/postprocessing/UnrealBloomPass.js',
  './vendor/jsm/postprocessing/OutputPass.js',
  './vendor/jsm/postprocessing/ShaderPass.js',
  './vendor/jsm/postprocessing/Pass.js',
  './vendor/jsm/postprocessing/MaskPass.js',
  './vendor/jsm/shaders/CopyShader.js',
  './vendor/jsm/shaders/LuminosityHighPassShader.js',
  './vendor/jsm/shaders/OutputShader.js',
  './src/main.js',
  './src/gfx.js',
  './src/icons.js',
  './src/itemicons.js',
  './src/save.js',
  './src/shop-data.js',
  './src/audio.js',
  './src/voice.js',
  './src/characters.js',
  './src/pets.js',
  './src/world.js',
  './src/ui.js',
  './src/activities/spa.js',
  './src/activities/vet.js',
  './src/activities/kitchen.js',
  './src/activities/lobby.js',
  './src/activities/yard.js',
  './audio/voice/lines.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first: a newly saved game file always wins; the cache only keeps it playable offline.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(res => {
        if (res && res.ok && new URL(event.request.url).origin === self.location.origin) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html')))
  );
});


