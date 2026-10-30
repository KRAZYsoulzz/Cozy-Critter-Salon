import fs from 'node:fs';
let d = fs.readFileSync('src/decor.js','utf8');
d = d.replace("world.decorTick = (t) => {", "world.decorTick = (t, close) => { beamMat.opacity += ((close ? 0 : 0.2) - beamMat.opacity) * 0.1;");
fs.writeFileSync('src/decor.js', d);
let w = fs.readFileSync('src/world.js','utf8');
w = w.replace("this.decorTick(this.time);", "this.decorTick(this.time, inActivityMode);");
fs.writeFileSync('src/world.js', w);
