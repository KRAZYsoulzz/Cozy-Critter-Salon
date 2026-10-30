import fs from 'node:fs';
let d = fs.readFileSync('src/decor.js','utf8');
const a = d.indexOf('export function yardTurfMat()'); const b = d.indexOf('export function vetFloorMat()');
d = d.slice(0,a) + `export function yardTurfMat() {
  const tex = canvasTexture((ctx, w, h) => {
    ctx.fillStyle = '#8fe39b'; ctx.fillRect(0, 0, w, h);
    let s = 7; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 70; i++) { ctx.fillStyle = r() > 0.5 ? 'rgba(70,170,90,0.20)' : 'rgba(210,255,200,0.22)'; ctx.beginPath(); ctx.arc(r() * w, r() * h, 10 + r() * 22, 0, 7); ctx.fill(); }
    for (let i = 0; i < 520; i++) {
      const x = r() * w, y = r() * h, c = r() > 0.5 ? 'rgba(52,150,78,0.75)' : 'rgba(205,255,190,0.85)';
      ctx.strokeStyle = c; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
      for (let k = -1; k <= 1; k++) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + k * 4, y - 7 - r() * 5); ctx.stroke(); }
    }
    for (let i = 0; i < 14; i++) { ctx.fillStyle = ['#ffffff', '#ffe066', '#ffb3d1'][i % 3]; ctx.beginPath(); ctx.arc(r() * w, r() * h, 2.6, 0, 7); ctx.fill(); }
  }, 256, 256, { repeat: [4, 2.4] });
  return toonMat(0xffffff, { map: tex, rim: 0.1 });
}
export function ginghamMat() {
  const tex = canvasTexture((ctx, w, h) => {
    ctx.fillStyle = '#fff7f9'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,107,157,0.55)';
    for (let i = 0; i < 8; i += 2) { ctx.fillRect(i * w / 8, 0, w / 8, h); ctx.fillRect(0, i * h / 8, w, h / 8); }
  }, 128, 128, { repeat: [3, 3] });
  return toonMat(0xffffff, { map: tex });
}
` + d.slice(b);
fs.writeFileSync('src/decor.js', d);
let w = fs.readFileSync('src/world.js','utf8');
w = w.replace("wallMaterials, yardTurfMat,", "wallMaterials, ginghamMat, yardTurfMat,");
w = w.replace("new THREE.CylinderGeometry(1.3, 1.3, 0.08, 24), toonMat(0xfff5f8)", "new THREE.CylinderGeometry(1.3, 1.3, 0.08, 24), ginghamMat()");
fs.writeFileSync('src/world.js', w);
let p = fs.readFileSync('src/pets.js','utf8');
const i0 = p.indexOf('buildDikdik() {'); let head = p.slice(0,i0), t = p.slice(i0);
const R = (x,y)=>{ if(!t.includes(x)) console.log('MISS',x.slice(0,50)); t=t.replace(x,y); };
R("new THREE.CapsuleGeometry(0.25, 0.36, 14, 18), fawnMat", "new THREE.CapsuleGeometry(0.28, 0.32, 14, 18), fawnMat");
R("new THREE.CylinderGeometry(0.048, 0.036, 0.32, 10)", "new THREE.CylinderGeometry(0.062, 0.046, 0.32, 10)");
R("new THREE.CylinderGeometry(0.04, 0.046, 0.08, 10)", "new THREE.CylinderGeometry(0.05, 0.058, 0.08, 10)");
R("this.headGroup.position.set(0, 0.94, 0.24);", "this.headGroup.position.set(0, 0.96, 0.24);\n    this.headGroup.scale.setScalar(1.2);");
R("new THREE.ConeGeometry(0.14, 0.24, 14), fawnMat);\n    snout.rotation.x = Math.PI / 2 - 0.15;\n    snout.position.set(0, -0.05, 0.28);\n    this.headGroup.add(snout);",
  "new THREE.ConeGeometry(0.12, 0.2, 14), fawnMat);\n    snout.rotation.x = Math.PI / 2 - 0.15;\n    snout.position.set(0, -0.06, 0.27);\n    this.headGroup.add(snout);\n    const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 12), creamMat);\n    muzzle.scale.set(1.15, 0.8, 1.0); muzzle.position.set(0, -0.09, 0.3); this.headGroup.add(muzzle);");
R("new THREE.SphereGeometry(0.038, 10, 8), darkMat);\n    noseTip.position.set(0, -0.03, 0.39);", "new THREE.SphereGeometry(0.05, 12, 10), darkMat);\n    noseTip.scale.set(1.2, 0.85, 0.9);\n    noseTip.position.set(0, -0.045, 0.39);");
R("new THREE.ConeGeometry(0.12, 0.34, 12), fawnMat);", "new THREE.ConeGeometry(0.14, 0.4, 12), fawnMat);");
R("new THREE.SphereGeometry(0.095, 12, 10), creamMat);\n      ring.scale.set(1.0, 1.05, 0.4);\n      ring.position.set(side * 0.16, 0.04, 0.21);", "new THREE.SphereGeometry(0.115, 14, 12), creamMat);\n      ring.scale.set(1.0, 1.05, 0.4);\n      ring.position.set(side * 0.15, 0.06, 0.2);");
R("eyeX: 0.16,\n      eyeY: 0.04,\n      eyeZ: 0.24,\n      eyeRadius: 0.078,", "eyeX: 0.15,\n      eyeY: 0.06,\n      eyeZ: 0.235,\n      eyeRadius: 0.097,");
fs.writeFileSync('src/pets.js', head + t);
