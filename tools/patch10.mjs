import fs from 'node:fs';
const patch = (file, fn) => { let s = fs.readFileSync(file,'utf8'); const t = fn(s); if (t === s) console.log('NOCHANGE', file); fs.writeFileSync(file, t); };
const need = (s, a, b) => { if (!s.includes(a)) { console.log('MISS', a.slice(0,70)); return s; } return s.replace(a, b); };
patch('src/gfx.js', s => {
  s = need(s, /const data = new Uint8Array\(\[96[^\]]*\]\);/.exec(s)[0], "const data = new Uint8Array([150, 150, 150, 255, 214, 214, 214, 255, 255, 255, 255, 255]);");
  s = need(s, "gradientTex = new THREE.DataTexture(data, 5, 1, THREE.RGBAFormat);\n  gradientTex.minFilter = THREE.LinearFilter;\n  gradientTex.magFilter = THREE.LinearFilter;", "gradientTex = new THREE.DataTexture(data, 3, 1, THREE.RGBAFormat);\n  gradientTex.minFilter = THREE.NearestFilter;\n  gradientTex.magFilter = THREE.NearestFilter;");
  s = need(s, "color: new THREE.Color(color),\n    gradientMap", "color: satColor(color),\n    gradientMap");
  s = need(s, "/** Warm rim-lit soft-toon material. */", "const _hsl = {};\nfunction satColor(c, k = 1.2) { const col = new THREE.Color(c); if (col.r === 1 && col.g === 1 && col.b === 1) return col; col.getHSL(_hsl); col.setHSL(_hsl.h, Math.min(1, _hsl.s * k), _hsl.l); return col; }\n\n/** Cel-shaded toon material: hard 3-step light, crisp rim. */");
  s = need(s, "float rimF = pow(1.0 - saturate(dot(normal, normalize(vViewPosition))), 2.6);", "float rimF = smoothstep(0.66, 0.72, 1.0 - saturate(dot(normal, normalize(vViewPosition))));");
  s = s.split("'#4a2a3a'").join("'#3a2420'");
  s = need(s, "export function outlineMaterial(color = '#3a2420', thickness = 0.012)", "export function outlineMaterial(color = '#3a2420', thickness = 0.014)");
  s = need(s, "export function addOutline(mesh, thickness = 0.012,", "export function addOutline(mesh, thickness = 0.014,");
  s += `
/** Hard-edged contact shadow decal under a character. */
export function addContactShadow(root, rx = 0.55, rz = 0.5) {
  const m = new THREE.Mesh(new THREE.CircleGeometry(1, 28), new THREE.MeshBasicMaterial({ color: 0x3a2420, transparent: true, opacity: 0.30, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.y = 0.025; m.scale.set(rx, rz, 1); m.renderOrder = 2; m.userData.isContactShadow = true;
  root.add(m); return m;
}
`;
  return s;
});
patch('src/main.js', s => {
  s = need(s, "Math.min(window.devicePixelRatio || 1, 1.5));\n    this.renderer.shadowMap.enabled = true;", "Math.min(window.devicePixelRatio || 1, 2));\n    this.renderer.shadowMap.enabled = true;");
  s = s.split("Math.min(window.devicePixelRatio || 1, 1.5)").join("Math.min(window.devicePixelRatio || 1, 2)");
  s = need(s, "new THREE.FogExp2(0xf6d7b8, 0.0085)", "new THREE.FogExp2(0xf6d7b8, 0.0018)");
  s = need(s, "new THREE.DirectionalLight(0xfffaed, 0.5)", "new THREE.DirectionalLight(0xfffaed, 0.22)");
  s = need(s, "new THREE.HemisphereLight(0xfff1dc, 0x7fcf8d, 1.0)", "new THREE.HemisphereLight(0xfff1dc, 0x9bd89f, 0.62)");
  s = need(s, "new THREE.DirectionalLight(0xffd9a0, 1.9)", "new THREE.DirectionalLight(0xffe6bd, 2.2)");
  s = need(s, "this.sunLight.position.set(10, 26, 18);", "this.sunLight.position.set(-9, 24, 18);");
  s = need(s, "0.16, // Subtle warm glow (only truly bright highlights bloom)\n      0.35,\n      1.15", "0.05, // barely-there glow: crisp, not soft\n      0.2,\n      0.96");
  s = need(s, "this.scene.add(pet.root);", "this.scene.add(pet.root);\n      addContactShadow(pet.root, petId === 'capybara' ? 0.62 : petId === 'axolotl' ? 0.55 : 0.42, petId === 'capybara' ? 0.5 : 0.46);");
  s = need(s, "this.scene.add(this.avatar.root);", "this.scene.add(this.avatar.root);\n    addContactShadow(this.avatar.root, 0.36, 0.3);");
  return s;
});
