import fs from 'node:fs';
let s = fs.readFileSync('src/pets.js','utf8');
const rep = (a, b) => { if (!s.includes(a)) { console.log('MISS', a.slice(0,80)); return; } s = s.replace(a, b); };
rep("const heart = new THREE.Mesh(new THREE.OctahedronGeometry(R * 0.95, 0), heartMat);\n      heart.scale.set(1.1, 1.1, 0.45);\n      heart.position.z = R * 0.45;", "const hs = new THREE.Shape(); hs.moveTo(0, -0.8); hs.bezierCurveTo(-1.6, 0.1, -0.9, 1.0, 0, 0.35); hs.bezierCurveTo(0.9, 1.0, 1.6, 0.1, 0, -0.8);\n      const heart = new THREE.Mesh(new THREE.ExtrudeGeometry(hs, { depth: 0.25, bevelEnabled: false }), heartMat);\n      heart.scale.setScalar(R * 0.95);\n      heart.position.z = R * 0.35;");
fs.writeFileSync('src/pets.js', s);
let c = fs.readFileSync('polish.css','utf8');
c = c.replace("grid-template-columns: 112px; grid-auto-rows: 112px;", "grid-template-columns: 104px; grid-auto-rows: 104px;").replace("grid-template-columns: 112px 112px; }", "grid-template-columns: 104px 104px; }").replace("width: 112px !important; min-width: 112px !important; max-width: 112px !important; height: 112px; min-height: 112px !important;", "width: 104px !important; min-width: 104px !important; max-width: 104px !important; height: 104px; min-height: 104px !important;");
fs.writeFileSync('polish.css', c);
