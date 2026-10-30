import fs from 'node:fs';
let s = fs.readFileSync('src/pets.js','utf8');
const rep = (a, b) => { if (!s.includes(a)) { console.log('MISS', a.slice(0,80)); return; } s = s.replace(a, b); };
// ---- capybara
rep("new THREE.Mesh(new THREE.CapsuleGeometry(0.38, 0.46, 14, 20), furMat);\n    barrel.rotation.x = Math.PI / 2;\n    barrel.position.set(0, 0.48, -0.05);\n    barrel.scale.set(1.08, 1.0, 0.96);", "new THREE.Mesh(new RoundedBoxGeometry(0.82, 0.76, 1.14, 5, 0.3), furMat);\n    barrel.position.set(0, 0.48, -0.05);");
rep("new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 14), bellyMat);\n    belly.scale.set(0.95, 0.72, 1.18);\n    belly.position.set(0, 0.38, -0.02);", "new THREE.Mesh(new RoundedBoxGeometry(0.64, 0.36, 0.9, 4, 0.16), bellyMat);\n    belly.position.set(0, 0.31, 0.0);");
rep("new THREE.Mesh(new THREE.CapsuleGeometry(0.095, 0.16, 8, 10), furMat);\n      limb.position.y = -0.08;\n      const paw = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), snoutMat);\n      paw.scale.set(1.0, 0.65, 1.25);\n      paw.position.set(0, -0.18, 0.03);\n      lg.add(limb, paw);", "new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.24, 0.2, 3, 0.07), furMat);\n      limb.position.y = -0.08; addOutline(limb, 0.012);\n      const paw = new THREE.Mesh(new RoundedBoxGeometry(0.22, 0.1, 0.29, 3, 0.045), snoutMat);\n      paw.position.set(0, -0.19, 0.045); addOutline(paw, 0.01);\n      lg.add(limb, paw);");
rep("new THREE.Mesh(new THREE.SphereGeometry(0.4, 24, 18), furMat);\n    skull.scale.set(1.04, 0.92, 0.98);", "new THREE.Mesh(new RoundedBoxGeometry(0.84, 0.74, 0.78, 5, 0.25), furMat);");
rep("const muzzleMat = toonMat(0xe0b88a);", "const muzzleMat = toonMat(0xe9bf86);");
rep("eyeX: 0.2,\n      eyeY: 0.11,\n      eyeZ: 0.27,", "eyeX: 0.2,\n      eyeY: 0.11,\n      eyeZ: 0.365,");
rep("cheek.position.set(side * 0.27, -0.05, 0.3);\n      this.headGroup.add(cheek);\n    }\n\n    // Small round ears", "cheek.position.set(side * 0.28, -0.05, 0.355);\n      this.headGroup.add(cheek);\n    }\n\n    // Small round ears");
rep("ear.add(outer, inner);\n      this.ears.push(ear);", "addOutline(outer, 0.01);\n      ear.add(outer, inner);\n      this.ears.push(ear);");
// ---- axolotl
rep("new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.42, 14, 20), bodyMat);\n    torso.rotation.x = Math.PI / 2;\n    torso.position.set(0, 0.42, -0.04);\n    torso.scale.set(1.08, 1.0, 0.92);", "new THREE.Mesh(new RoundedBoxGeometry(0.68, 0.6, 1.0, 5, 0.24), bodyMat);\n    torso.position.set(0, 0.42, -0.04);");
rep("new THREE.Mesh(new THREE.SphereGeometry(0.31, 16, 12), bellyMat);\n    belly.scale.set(0.96, 0.7, 1.2);\n    belly.position.set(0, 0.34, 0);", "new THREE.Mesh(new RoundedBoxGeometry(0.56, 0.3, 0.84, 4, 0.13), bellyMat);\n    belly.position.set(0, 0.28, 0.0);");
rep("new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.13, 8, 10), bodyMat);\n      limb.position.y = -0.06;\n      lg.add(limb);", "new THREE.Mesh(new RoundedBoxGeometry(0.16, 0.2, 0.16, 3, 0.06), bodyMat);\n      limb.position.y = -0.06; addOutline(limb, 0.012);\n      const foot = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.07, 0.24, 3, 0.03), finMat);\n      foot.position.set(0, -0.17, 0.04); addOutline(foot, 0.01);\n      lg.add(limb, foot);");
rep("new THREE.Mesh(new THREE.SphereGeometry(0.36, 22, 18), bodyMat);\n    head.scale.set(1.22, 0.92, 0.98);", "new THREE.Mesh(new RoundedBoxGeometry(0.88, 0.68, 0.74, 5, 0.22), bodyMat);");
rep("cheek.position.set(side * 0.26, -0.05, 0.3);\n      this.headGroup.add(cheek);\n    }\n\n    this.buildEyesAndMouth({\n      eyeX: 0.19,\n      eyeY: 0.05,\n      eyeZ: 0.32,", "cheek.position.set(side * 0.27, -0.06, 0.352);\n      this.headGroup.add(cheek);\n    }\n    const axMuzzle = new THREE.Mesh(new THREE.CircleGeometry(1, 24), bellyMat);\n    axMuzzle.scale.set(0.19, 0.12, 1); axMuzzle.position.set(0, -0.1, 0.372); this.headGroup.add(axMuzzle);\n\n    this.buildEyesAndMouth({\n      eyeX: 0.2,\n      eyeY: 0.06,\n      eyeZ: 0.365,");
rep("mouthY: -0.07,\n      mouthZ: 0.35\n    });", "mouthY: -0.11,\n      mouthZ: 0.378\n    });");
// ---- dikdik torso
rep("new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.32, 14, 18), fawnMat);\n    torso.rotation.x = Math.PI / 2;", "new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.5, 0.86, 5, 0.2), fawnMat);");
// ---- eyes
const i0 = s.indexOf('buildEyesAndMouth(cfg) {'); const i1 = s.indexOf('// Closed smiling mouth', i0);
let f = s.slice(i0, i1);
f = f.replace("buildEyesAndMouth(cfg) {", "buildEyesAndMouth(cfg) {\n    const R = cfg.eyeRadius * 1.2;");
f = f.split('cfg.eyeRadius').join('R');
f = f.replace("R * 0.4, 10, 10), shineMat);", "R * 0.52, 10, 10), shineMat);").replace("R * 0.18, 6, 6), shineMat);", "R * 0.26, 8, 8), shineMat);");
f = f.replace("eg.add(s1, s2);", "eg.add(s1, s2);\n      const lidLine = new THREE.Mesh(new THREE.TorusGeometry(R * 0.98, R * 0.17, 6, 16, Math.PI), new THREE.MeshBasicMaterial({ color: 0x1e1424 }));\n      lidLine.position.z = R * 0.1; lidLine.rotation.z = -side * 0.12; eg.add(lidLine);");
s = s.slice(0, i0) + f + s.slice(i1);
fs.writeFileSync('src/pets.js', s);
