import fs from 'node:fs';
let s = fs.readFileSync('src/world.js','utf8');
const rep = (a,b,all=false) => { if(!s.includes(a)) { console.log('MISS', a.slice(0,60)); return; } s = all ? s.split(a).join(b) : s.replace(a,b); };
rep("import { iconSVG } from './icons.js';", "import { iconSVG } from './icons.js';\nimport { wallMaterials, yardTurfMat, vetFloorMat, buildDecor, dressSpaTub } from './decor.js';");
rep("this.buildRoomProps();\n    this.buildStationMarkers();", "this.buildRoomProps();\n    buildDecor(this);\n    this.buildStationMarkers();");
// walls
rep("const backWall = new THREE.Mesh(new THREE.BoxGeometry(22.2, 3.4, 0.35), wallCream);",
    "const kitchenYard = (u) => (u < 11.1 ? 'kitchen' : 'yard'); kitchenYard.id = 'ky';\n    const backWall = new THREE.Mesh(new THREE.BoxGeometry(22.2, 3.4, 0.35), wallMaterials(22.2, 3.4, 0.35, { pz: kitchenYard }, wallCream));");
rep("const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.4, 12.4), wallCream);",
    "const spaKitchen = (u) => (5.35 - u > -0.7 ? 'spa' : 'kitchen'); spaKitchen.id = 'sk';\n    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.4, 12.4), wallMaterials(0.35, 3.4, 12.4, { px: spaKitchen }, wallCream));");
rep("const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.4, 6.2), wallCream);",
    "const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.4, 6.2), wallMaterials(0.35, 3.4, 6.2, { nx: 'vet' }, wallCream));");
rep("const w = new THREE.Mesh(new THREE.BoxGeometry(p.w, 2.5, p.d), wallCream);",
`let faces;
      if (p.w < 0.5 && p.x === -3.7) faces = { px: 'lobby', nx: 'spa' };
      else if (p.w < 0.5 && p.x === 3.7) faces = { nx: 'lobby', px: 'vet' };
      else if (p.w < 0.5) faces = { nx: 'kitchen', px: 'yard' };
      else faces = { pz: p.x < -6 ? 'spa' : (p.x > 6 ? 'vet' : 'lobby'), nz: p.x < 0 ? 'kitchen' : 'yard' };
      const w = new THREE.Mesh(new THREE.BoxGeometry(p.w, 2.5, p.d), wallMaterials(p.w, 2.5, p.d, faces, wallCream));`);
rep("const wallTrim = toonMat(0xffb3c6);","const wallTrim = toonMat(0xff9bb8);");
// remove outer wainscot boxes
s = s.split('\n').filter(l => !/^\s*box\((21\.6|0\.12|0\.16), (0\.95|0\.08), /.test(l)).join('\n');
// floors
rep("new THREE.BoxGeometry(10.6, 0.08, 6.0),\n      toonMat(0x8ce99a)", "new THREE.BoxGeometry(10.6, 0.08, 6.0),\n      yardTurfMat()");
rep("new THREE.BoxGeometry(7.1, 0.08, 6.0),\n      toonMat(0xe6fcf5)", "new THREE.BoxGeometry(7.1, 0.08, 6.0),\n      vetFloorMat()");
// tub dressing
rep("    // ---- VET CLINIC TABLE UPGRADES ----", "    dressSpaTub(this.spaTubGroup, spaTier);\n\n    // ---- VET CLINIC TABLE UPGRADES ----");
fs.writeFileSync('src/world.js', s);
console.log('done');
