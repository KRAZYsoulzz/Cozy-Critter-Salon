import fs from 'node:fs';
let s = fs.readFileSync('src/pets.js','utf8');
const rep = (a, b) => { if (!s.includes(a)) { console.log('MISS', a.slice(0,80)); return; } s = s.replace(a, b); };
rep("new RoundedBoxGeometry(0.88, 0.68, 0.74, 5, 0.22), bodyMat)", "new RoundedBoxGeometry(1.0, 0.6, 0.74, 5, 0.26), bodyMat)");
rep("stalkGroup.position.set(side * 0.38, 0.14 - idx * 0.1, -0.02);", "stalkGroup.position.set(side * 0.46, 0.12 - idx * 0.09, -0.02);");
rep("cheek.position.set(side * 0.27, -0.06, 0.352);", "cheek.position.set(side * 0.32, -0.06, 0.34);");
rep("eyeX: 0.2,\n      eyeY: 0.06,\n      eyeZ: 0.365,", "eyeX: 0.23,\n      eyeY: 0.05,\n      eyeZ: 0.355,");
rep("R * 0.52, 10, 10), shineMat);", "R * 0.42, 10, 10), shineMat);");
fs.writeFileSync('src/pets.js', s);
