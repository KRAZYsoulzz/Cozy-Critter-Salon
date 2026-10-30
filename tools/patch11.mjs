import fs from 'node:fs';
const patch = (file, fn) => { let s = fs.readFileSync(file,'utf8'); fs.writeFileSync(file, fn(s)); };
const need = (s, a, b) => { if (!s.includes(a)) { console.log('MISS', a.slice(0,70)); return s; } return s.replace(a, b); };
patch('src/main.js', s => need(s, "import { tickWind } from './gfx.js';", "import { tickWind, addContactShadow } from './gfx.js';"));
patch('src/world.js', s => {
  s = need(s, "this.ambientBubbles.push(b);", "b.visible = false; this.ambientBubbles.push(b);");
  // room-props helpers: tighter bevel + ink outline
  s = need(s, "new RoundedBoxGeometry(w, h, d, 2, Math.min(0.06, w / 3, h / 3, d / 3)), M(c, o));\n      m.position.set(x, y, z);\n      m.castShadow = true;\n      m.receiveShadow = true;\n      parent.add(m);", "new RoundedBoxGeometry(w, h, d, 3, Math.min(0.035, w / 3, h / 3, d / 3)), M(c, o));\n      m.position.set(x, y, z);\n      m.castShadow = true;\n      m.receiveShadow = true;\n      if (Math.min(w, h, d) > 0.12) addOutline(m, 0.012);\n      parent.add(m);");
  s = need(s, "new THREE.CylinderGeometry(rt, rb, h, seg), M(c, o));\n      m.position.set(x, y, z);\n      m.castShadow = true;\n      m.receiveShadow = true;\n      parent.add(m);", "new THREE.CylinderGeometry(rt, rb, h, seg), M(c, o));\n      m.position.set(x, y, z);\n      m.castShadow = true;\n      m.receiveShadow = true;\n      if (h > 0.12 && Math.max(rt, rb) > 0.1) addOutline(m, 0.012);\n      parent.add(m);");
  // bold ink on big furniture in room interiors
  s = need(s, "cuddlePad.receiveShadow = true;", "cuddlePad.receiveShadow = true; addOutline(cuddlePad, 0.02);");
  s = need(s, "shopStand.position.set(-2.3, 0.24, 2.9);", "shopStand.position.set(-2.3, 0.24, 2.9); addOutline(shopStand, 0.016);");
  s = need(s, "tubBase.castShadow = true;", "tubBase.castShadow = true; addOutline(tubBase, 0.02);");
  s = need(s, "tubRim.rotation.x = Math.PI / 2;", "tubRim.rotation.x = Math.PI / 2; addOutline(tubRim, 0.012);");
  s = need(s, "vetBase.castShadow = true;", "vetBase.castShadow = true; addOutline(vetBase, 0.016);");
  s = need(s, "vetPad.position.y = 0.68;", "vetPad.position.y = 0.68; addOutline(vetPad, 0.014);");
  s = need(s, "kTable.castShadow = true;", "kTable.castShadow = true; addOutline(kTable, 0.018);");
  s = need(s, "kCloth.position.y = 0.59;", "kCloth.position.y = 0.59; addOutline(kCloth, 0.014);");
  return s;
});
patch('src/decor.js', s => {
  const T = {
    lobby: "{ paper: '#ffeaf2', stripe: '#ffdbe8', wain: '#ff7fae', panel: '#ff9cc2', line: '#c2457a', dot: '#ff6fa3', motif: 'heart' }",
    spa: "{ paper: '#dff6fa', stripe: '#c9eef5', wain: '#27c4d6', panel: '#4fd6e4', line: '#0d8a9a', dot: '#4aa8ff', motif: 'bubble' }",
    vet: "{ paper: '#e4fbef', stripe: '#d0f6e2', wain: '#33cf98', panel: '#5ee0b2', line: '#12896a', dot: '#33cf98', motif: 'cross' }",
    kitchen: "{ paper: '#fff0c6', stripe: '#ffe6a0', wain: '#ffc93a', panel: '#ffd965', line: '#c98a00', dot: '#ff9f1c', motif: 'check' }",
    yard: "{ paper: '#e1f7d8', stripe: '#cdf0bf', wain: '#5fcf5a', panel: '#85de7c', line: '#2f8f2f', dot: '#ffcf33', motif: 'flower' }",
  };
  for (const [k, v] of Object.entries(T)) s = s.replace(new RegExp(`  ${k}: +\\{[^\\n]*\\},?\\n`), `  ${k}: ${v},\n`);
  s = s.replace("const PPM = 84;", "const PPM = 118;").replace("Math.min(2048, Math.round(lengthM * PPM))", "Math.min(4096, Math.round(lengthM * PPM))");
  return s;
});
patch('src/gfx.js', s => need(s, "const { repeat = null, srgb = true, mipmaps = true } = opts || {};", "const { repeat = null, srgb = true, mipmaps = true } = opts || {};\n  const _aniso = 8;"));
