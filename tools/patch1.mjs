import fs from 'node:fs';
const rd = f => fs.readFileSync(f, 'utf8'); const wr = (f, s) => fs.writeFileSync(f, s);
function rep(s, a, b, label) { if (!s.includes(a)) { console.log('MISSING', label); return s; } return s.replace(a, b); }
const icon = rd('icons/icon.svg').replace(/<\?xml[^>]*>/, '');

// ---------- index.html ----------
let h = rd('index.html');
h = rep(h, '<link rel="icon" type="image/svg+xml" href="./favicon.svg" />', '<link rel="icon" type="image/svg+xml" href="./favicon.svg" />\n  <link rel="apple-touch-icon" href="./icons/apple-touch-icon.png" />\n  <link rel="preload" href="./vendor/fonts/Fredoka.ttf" as="font" type="font/ttf" crossorigin />', 'icons');
h = rep(h, '<link rel="stylesheet" href="./styles.css" />', '<link rel="stylesheet" href="./styles.css" />\n  <link rel="stylesheet" href="./polish.css" />', 'css');
// boot splash + new title
const titleStart = h.indexOf('<!-- Title Screen Overlay -->'); const titleEnd = h.indexOf('<!-- Top HUD Bar -->');
const newTitle = `<!-- Boot splash (shown instantly while the 3D engine loads) -->
  <div id="boot" class="boot-splash">
    <div class="boot-logo">${icon}</div>
    <div class="boot-name">Cozy Critter<span>Salon &amp; Spa</span></div>
    <div class="boot-bar"><i></i></div>
  </div>
  <div id="wipe" class="wipe" aria-hidden="true"></div>
  <div id="confetti" class="confetti-layer" aria-hidden="true"></div>

  <!-- Title Screen Overlay -->
  <section id="title-screen" class="title-overlay">
    <div class="title-sparkles" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
    <div class="title-logo">
      <div class="title-mark">${icon}</div>
      <h1 class="title-heading"><span class="t1">Cozy Critter</span><span class="t2">Salon &amp; Spa</span></h1>
    </div>
    <button id="btn-play-game" class="play-hero-btn">
      <span id="icon-play-btn"></span>
      <span>PLAY!</span>
    </button>
    <div class="title-foot">Made with love for Lilah</div>
  </section>

  `;
h = h.slice(0, titleStart) + newTitle + h.slice(titleEnd);
// mojibake close buttons -> clean X glyph
h = h.split('<button id="btn-close-clipboard" class="close-x-btn">\uFFFDo</button>').join('<button id="btn-close-clipboard" class="close-x-btn" aria-label="Close">&#10005;</button>');
h = h.split('<button id="btn-close-settings" class="close-x-btn">\uFFFDo</button>').join('<button id="btn-close-settings" class="close-x-btn" aria-label="Close">&#10005;</button>');
if (h.includes('\uFFFD')) console.log('still has FFFD at', [...h.matchAll(/.{30}\uFFFD.{10}/g)].map(m=>m[0]));
wr('index.html', h);

// ---------- manifest ----------
const man = JSON.parse(rd('manifest.json'));
man.icons = [
  { src: './icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
  { src: './icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
  { src: './icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  { src: './favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }
];
man.name = 'Cozy Critter Salon & Spa'; man.short_name = 'Critter Salon'; man.description = 'Adopt, pamper and play with your Capybara, Axolotl and Dik-dik!';
man.background_color = '#ffb3d9'; man.categories = ['kids','games','entertainment'];
wr('manifest.json', JSON.stringify(man, null, 2));

// ---------- sw.js ----------
let sw = rd('sw.js');
sw = sw.replace(/cozy-critter-3d-v\d+/, 'cozy-critter-3d-v5');
sw = rep(sw, "'./styles.css',", "'./styles.css',\n  './polish.css',\n  './vendor/fonts/Fredoka.ttf',\n  './icons/icon-192.png',\n  './icons/icon-512.png',\n  './icons/icon-maskable-512.png',\n  './icons/apple-touch-icon.png',\n  './src/polish.js',", 'sw');
wr('sw.js', sw);

// ---------- world.js: tub z-fight ----------
let w = rd('src/world.js');
w = rep(w, 'bathWater.position.y = 0.52;', 'bathWater.position.y = 0.545;', 'water');
wr('src/world.js', w);

// ---------- main.js: MSAA composer, polish hook ----------
let m = rd('src/main.js');
m = rep(m, "import { UIManager } from './ui.js';", "import { UIManager } from './ui.js';\nimport { initPolish } from './polish.js';", 'import');
m = rep(m, 'this.composer = new EffectComposer(this.renderer);', "{\n      const pr = Math.min(window.devicePixelRatio || 1, 1.5);\n      const rt = new THREE.WebGLRenderTarget(window.innerWidth * pr, window.innerHeight * pr, { type: THREE.HalfFloatType, samples: 4 });\n      this.composer = new EffectComposer(this.renderer, rt);\n      this.composer.setPixelRatio(pr);\n      this.composer.setSize(window.innerWidth, window.innerHeight);\n    }", 'composer');
m = rep(m, "this.renderer.setPixelRatio(low ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));\n    if (this.bloomPass)", "this.renderer.setPixelRatio(low ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));\n    if (this.composer) { this.composer.setPixelRatio(low ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)); this.composer.setSize(window.innerWidth, window.innerHeight); }\n    if (this.bloomPass)", 'gfxsettings');
m = rep(m, 'this.ui.syncHUD();\n\n    this.bindCanvasInput();', 'this.ui.syncHUD();\n    initPolish(this);\n\n    this.bindCanvasInput();', 'initPolish');
m = rep(m, "this.camTargetPos.set(\n        Math.sin(this.titleAngle) * 6.5,\n        6.8,\n        12.5 + Math.cos(this.titleAngle) * 2.0\n      );\n      this.camTargetLook.set(0, 1.4, 2.0);", "this.camTargetPos.set(\n        Math.sin(this.titleAngle) * 3.2,\n        4.1,\n        10.6 + Math.cos(this.titleAngle) * 0.8\n      );\n      this.camTargetLook.set(0, 0.7, 3.0);", 'titlecam');
wr('src/main.js', m);

// ---------- pets.js: capybara face ----------
let p = rd('src/pets.js');
p = rep(p, "const furMat = toonMat(0x9c6639);\n    const bellyMat = toonMat(0xb88252);\n    const snoutMat = toonMat(0x734827);", "const furMat = toonMat(0xad7241);\n    const bellyMat = toonMat(0xc9935f);\n    const snoutMat = toonMat(0x8a5830);\n    const muzzleMat = toonMat(0xe0b88a);", 'capy mats');
p = rep(p, "const skull = new THREE.Mesh(new THREE.SphereGeometry(0.34, 20, 16), furMat);\n    skull.scale.set(1.02, 0.96, 1.05);", "const skull = new THREE.Mesh(new THREE.SphereGeometry(0.4, 24, 18), furMat);\n    skull.scale.set(1.04, 0.92, 0.98);", 'skull');
p = rep(p, "new RoundedBoxGeometry(0.42, 0.34, 0.38, 5, 0.11), snoutMat);\n    snout.position.set(0, -0.03, 0.25);", "new RoundedBoxGeometry(0.4, 0.28, 0.3, 5, 0.12), muzzleMat);\n    snout.position.set(0, -0.09, 0.3);", 'snout');
p = rep(p, "nostril.position.set(side * 0.09, 0.04, 0.44);", "nostril.position.set(side * 0.07, 0.01, 0.455);", 'nostril');
p = rep(p, "cheek.position.set(side * 0.22, -0.07, 0.36);", "cheek.position.set(side * 0.27, -0.05, 0.3);", 'cheek');
p = rep(p, "ear.position.set(side * 0.24, 0.28, -0.06);", "ear.position.set(side * 0.28, 0.3, -0.08);", 'ear');
p = rep(p, "eyeX: 0.22,\n      eyeY: 0.1,\n      eyeZ: 0.24,\n      eyeRadius: 0.062,\n      lidColor: 0x734827,\n      defaultHalfLid: true,\n      mouthY: -0.14,\n      mouthZ: 0.43", "eyeX: 0.2,\n      eyeY: 0.11,\n      eyeZ: 0.27,\n      eyeRadius: 0.088,\n      lidColor: 0xad7241,\n      defaultHalfLid: true,\n      mouthY: -0.17,\n      mouthZ: 0.445", 'capy eyes');
p = rep(p, "const lidScaleY = isExcited ? 0.05 : 0.62;", "const lidScaleY = isExcited ? 0.05 : 0.28;", 'lid');
// nose pad
p = rep(p, "// Cute nostrils & nose bridge", "const nosePad = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 10), toonMat(0x4a2a1c));\n    nosePad.scale.set(1.25, 0.75, 0.7);\n    nosePad.position.set(0, 0.035, 0.435);\n    this.headGroup.add(nosePad);\n\n    // Cute nostrils & nose bridge", 'nosepad');
p = rep(p, "const s1 = new THREE.Mesh(new THREE.SphereGeometry(cfg.eyeRadius * 0.36, 8, 8), shineMat);", "const s1 = new THREE.Mesh(new THREE.SphereGeometry(cfg.eyeRadius * 0.4, 10, 10), shineMat);", 'shine');
wr('src/pets.js', p);
