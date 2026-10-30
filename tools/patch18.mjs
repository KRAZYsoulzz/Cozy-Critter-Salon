import fs from 'node:fs';
let s = fs.readFileSync('src/pets.js','utf8');
const rep = (a, b) => { if (!s.includes(a)) { console.log('MISS', a.slice(0,80)); return; } s = s.replace(a, b); };
const i0 = s.indexOf('const bubbleSvg = `'); const i1 = s.indexOf('</svg>`;', i0) + 8;
s = s.slice(0,i0) + "const bubbleSvg = `<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"160\" height=\"160\" viewBox=\"0 0 160 160\">\n      <g fill=\"#ffffff\" stroke=\"#3a2420\" stroke-width=\"9\"><circle cx=\"50\" cy=\"62\" r=\"30\"/><circle cx=\"82\" cy=\"42\" r=\"36\"/><circle cx=\"114\" cy=\"62\" r=\"30\"/><circle cx=\"82\" cy=\"76\" r=\"30\"/><circle cx=\"52\" cy=\"128\" r=\"9\"/><circle cx=\"40\" cy=\"146\" r=\"6\"/></g>\n      <g fill=\"#ffffff\"><circle cx=\"50\" cy=\"62\" r=\"30\"/><circle cx=\"82\" cy=\"42\" r=\"36\"/><circle cx=\"114\" cy=\"62\" r=\"30\"/><circle cx=\"82\" cy=\"76\" r=\"30\"/></g>\n      <g transform=\"translate(50, 22) scale(1.0)\">${innerContent}</g>\n    </svg>`;" + s.slice(i1);
rep("const tex = svgTexture(bubbleSvg, 128);", "const tex = svgTexture(bubbleSvg, 160);");
rep("this.thoughtSprite.scale.set(0.72, 0.72, 1);", "this.thoughtSprite.scale.set(1.05, 1.05, 1);");
rep("this.thoughtSprite.position.set(0, 1.55, 0);", "this.thoughtSprite.position.set(0, 1.75, 0);");
rep("this.thoughtSprite.position.y = 1.52 +", "this.thoughtSprite.position.y = 1.72 +");
// lashes on the pets' eyes
rep("lidLine.position.z = R * 0.1; lidLine.rotation.z = -side * 0.12; eg.add(lidLine);", "lidLine.position.z = R * 0.1; lidLine.rotation.z = -side * 0.12; eg.add(lidLine);\n      for (let k = 0; k < 3; k++) { const lash = new THREE.Mesh(new THREE.BoxGeometry(R * 0.5, R * 0.12, R * 0.1), new THREE.MeshBasicMaterial({ color: 0x1e1424 })); lash.position.set(side * (R * 0.98 + k * 0.004), R * (0.42 - k * 0.3), R * 0.12); lash.rotation.z = side * (0.35 - k * 0.5) * -1; eg.add(lash); }");
fs.writeFileSync('src/pets.js', s);
