import fs from 'node:fs';
let s = fs.readFileSync('src/world.js','utf8');
s = s.replace("    this.time += dt;", "    this.time += dt;\n    if (this.decorTick) this.decorTick(this.time);");
fs.writeFileSync('src/world.js', s);
let c = fs.readFileSync('src/characters.js','utf8');
c = c.replace("const skinMat = toonMat(skin.hex);", "const skinMat = toonMat(skin.hex, { emissive: skin.blush, emissiveIntensity: 0.16, rim: 0.18 });");
c = c.replace("const hiMat = toonMat(hairMat.color.clone().lerp(new THREE.Color(1, 1, 1), 0.3).getHex());",
 "const hiCol = hairMat.color.clone(); const hsl = {}; hiCol.getHSL(hsl); hiCol.setHSL(hsl.h, Math.min(1, hsl.s * 0.9 + 0.1), Math.min(0.72, hsl.l + 0.2));\n    const hiMat = toonMat(hiCol.getHex(), { emissive: hiCol.getHex(), emissiveIntensity: 0.35, rim: 0.1 });");
fs.writeFileSync('src/characters.js', c);
