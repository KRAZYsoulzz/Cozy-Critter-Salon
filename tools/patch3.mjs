import fs from 'node:fs';
let s = fs.readFileSync('src/characters.js','utf8');
const a = s.indexOf('  buildHairStyle(styleId'); const b = s.indexOf('  setTarget(x, z)');
s = s.slice(0,a) + fs.readFileSync('tools/newhair.txt','utf8') + s.slice(b);
fs.writeFileSync('src/characters.js', s);
