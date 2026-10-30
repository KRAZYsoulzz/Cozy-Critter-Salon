import fs from 'node:fs';
let s = fs.readFileSync('src/spark.js','utf8');
s = s.replace("import * as THREE from 'three';", "import * as THREE from 'three';\nimport { addOutline } from './gfx.js';");
s = s.replace("  // ---- tidy HUD flag for CSS ----", `  // ---- plush round rugs under each pet in the hub ----
  const RUG = { capybara: ['#a24f92', '#c97bb8'], axolotl: ['#26b3b3', '#6fdcd6'], dikdik: ['#ff7a5c', '#ffb09a'] };
  const makeRug = (petId) => {
    const [c1, c2] = RUG[petId] || ['#a24f92', '#c97bb8'];
    const cv = document.createElement('canvas'); cv.width = cv.height = 256;
    const g = cv.getContext('2d');
    g.fillStyle = c1; g.fillRect(0, 0, 256, 256);
    g.strokeStyle = c2; g.lineWidth = 10; g.beginPath(); g.arc(128, 128, 108, 0, 7); g.stroke();
    g.fillStyle = c2; g.beginPath(); g.moveTo(128, 196); g.bezierCurveTo(40, 130, 78, 70, 128, 108); g.bezierCurveTo(178, 70, 216, 130, 128, 196); g.fill();
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const side = new THREE.MeshToonMaterial({ color: c1 });
    const mats = [side, new THREE.MeshBasicMaterial({ map: tex }), side];
    const rug = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.0, 0.09, 40), mats);
    rug.position.y = 0.045; rug.receiveShadow = true; addOutline(rug, 0.02);
    return rug;
  };
  setInterval(() => {
    const vis = app.mode === 'world';
    for (const id of Object.keys(app.pets || {})) {
      const p = app.pets[id]; if (!p || !p.root) continue;
      if (!p.rug) { p.rug = makeRug(id); p.root.add(p.rug); }
      p.rug.visible = vis;
    }
  }, 250);

  // ---- tidy HUD flag for CSS ----`);
fs.writeFileSync('src/spark.js', s);
