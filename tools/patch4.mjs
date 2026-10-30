import fs from 'node:fs';
let s = fs.readFileSync('src/characters.js','utf8');
const a = s.indexOf('    const gloss = new THREE.Mesh'); const b = s.indexOf('\n', s.indexOf('add(gloss);'));
s = s.slice(0,a) + "    const gl1 = blob(0.07, -0.13, 0.37, 0.14, 1.9, 0.45, 1.0, hiMat); gl1.rotation.set(-0.9, 0, 0.35);\n    const gl2 = blob(0.045, 0.1, 0.39, 0.1, 1.5, 0.4, 1.0, hiMat); gl2.rotation.set(-0.8, 0, -0.3);" + s.slice(b);
s = s.replace('Math.PI * 0.18, Math.PI * 1.64', 'Math.PI * 0.35, Math.PI * 1.3').replace('Math.PI * 0.12, Math.PI * 1.76','Math.PI * 0.3, Math.PI * 1.4').replace('Math.PI * 0.22, Math.PI * 1.56','Math.PI * 0.35, Math.PI * 1.3');
fs.writeFileSync('src/characters.js', s);
