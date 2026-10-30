import fs from 'node:fs';
let g = fs.readFileSync('src/gfx.js','utf8');
g = g.replace("if (srgb) tex.colorSpace = THREE.SRGBColorSpace;", "if (srgb) tex.colorSpace = THREE.SRGBColorSpace;\n  tex.anisotropy = 8;");
fs.writeFileSync('src/gfx.js', g);
let s = fs.readFileSync('src/characters.js','utf8');
if (!s.includes('RoundedBoxGeometry')) s = s.replace("import * as THREE from 'three';", "import * as THREE from 'three';\nimport { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';");
const a = s.indexOf('    // ---- Legs & Cute Shoes ----'); const b = s.indexOf('    // ---- Hair Styles ----');
const body = `    const INK = '#3a2420';
    const rb = (w, h, d, r, mat, ol = 0.012) => { const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, r), mat); if (ol) addOutline(m, ol); return m; };
    const sockMat = toonMat(0xffffff);

    // ---- Legs, socks & structured shoes ----
    for (const [side, legGroup] of [[-1, this.leftLeg], [1, this.rightLeg]]) {
      legGroup.position.set(side * 0.13, 0.42, 0);
      const legMesh = rb(0.12, 0.3, 0.12, 0.045, skinMat, 0.01);
      legMesh.position.y = -0.14;
      const sockMesh = rb(0.135, 0.1, 0.135, 0.04, sockMat, 0.01);
      sockMesh.position.y = -0.25;
      const shoeMesh = rb(0.16, 0.1, 0.25, 0.045, shoeMat, 0.012);
      shoeMesh.position.set(0, -0.34, 0.045);
      const strap = rb(0.17, 0.03, 0.07, 0.012, secondaryMat, 0);
      strap.position.set(0, -0.31, 0.02);
      legGroup.add(legMesh, sockMesh, shoeMesh, strap);
      this.bodyGroup.add(legGroup);
    }

    // ---- Torso: boxy smock with a visible waist belt ----
    const torso = rb(0.42, 0.46, 0.3, 0.1, primaryMat, 0.014);
    torso.position.y = 0.69;
    this.bodyGroup.add(torso);
    const belt = rb(0.43, 0.06, 0.31, 0.02, secondaryMat, 0.008);
    belt.position.y = 0.52;
    this.bodyGroup.add(belt);

    // Neck (hides the head/torso seam) + collar
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.1, 0.16, 14), skinMat);
    neck.position.y = 0.97;
    this.bodyGroup.add(neck);
    const collar = rb(0.3, 0.06, 0.24, 0.025, secondaryMat, 0.008);
    collar.position.y = 0.9;
    this.bodyGroup.add(collar);

    // Heart pocket badge
    const badge = rb(0.1, 0.1, 0.03, 0.03, secondaryMat, 0.006);
    badge.rotation.z = Math.PI / 4;
    badge.position.set(0.09, 0.74, 0.155);
    this.bodyGroup.add(badge);

    // Structured A-line skirt: faceted body + contrasting hem band
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.38, 0.28, 12), skirtMat);
    skirt.position.y = 0.43;
    addOutline(skirt, 0.014);
    this.bodyGroup.add(skirt);
    const hem = new THREE.Mesh(new THREE.CylinderGeometry(0.385, 0.39, 0.05, 12), secondaryMat);
    hem.position.y = 0.3;
    addOutline(hem, 0.01);
    this.bodyGroup.add(hem);

    // ---- Arms: puff sleeve, forearm, mitten hand ----
    for (const [side, armGroup] of [[-1, this.leftArm], [1, this.rightArm]]) {
      armGroup.position.set(side * 0.27, 0.86, 0);
      const sleeve = rb(0.15, 0.13, 0.15, 0.05, secondaryMat, 0.01);
      sleeve.position.set(side * 0.01, -0.03, 0);
      const arm = rb(0.1, 0.24, 0.1, 0.04, skinMat, 0.01);
      arm.position.set(side * 0.03, -0.17, 0);
      arm.rotation.z = side * 0.1;
      const hand = rb(0.115, 0.115, 0.1, 0.05, skinMat, 0.01);
      hand.position.set(side * 0.05, -0.3, 0.015);
      armGroup.add(sleeve, arm, hand);
      this.bodyGroup.add(armGroup);
    }

    this.propAnchor.position.set(0.08, -0.3, 0.08);
    this.rightArm.add(this.propAnchor);

    // ---- Head: bevelled rounded-box skull ----
    this.headGroup.position.set(0, 1.24, 0);
    this.bodyGroup.add(this.headGroup);

    const head = rb(0.66, 0.6, 0.6, 0.23, skinMat, 0.018);
    this.headGroup.add(head);

    // Ears
    for (const side of [-1, 1]) {
      const ear = rb(0.07, 0.12, 0.09, 0.03, skinMat, 0.008);
      ear.position.set(side * 0.335, -0.01, 0);
      this.headGroup.add(ear);
    }

    // Big glossy eyes (1.2x) + dark upper lid line + catchlights
    const eyeDarkMat = new THREE.MeshBasicMaterial({ color: 0x1c1020 });
    const shineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const browMat = toonMat(hairCol.hex); browMat.color.multiplyScalar(0.55);
    for (const side of [-1, 1]) {
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(side * 0.14, 0.01, 0.3);

      const white = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      white.scale.set(1, 1.12, 0.3); eyeGroup.add(white);
      const iris = new THREE.Mesh(new THREE.SphereGeometry(0.068, 16, 12), eyeDarkMat);
      iris.scale.set(1, 1.16, 0.4); iris.position.z = 0.012;
      eyeGroup.add(iris);

      const shineBig = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 8), shineMat);
      shineBig.position.set(side * 0.018, 0.03, 0.035);
      eyeGroup.add(shineBig);
      const shineSmall = new THREE.Mesh(new THREE.SphereGeometry(0.013, 6, 6), shineMat);
      shineSmall.position.set(-side * 0.02, -0.024, 0.035);
      eyeGroup.add(shineSmall);

      // dark eyelid line with a little flick
      const lash = rb(0.13, 0.024, 0.02, 0.008, eyeDarkMat, 0);
      lash.position.set(side * 0.012, 0.085, 0.02);
      lash.rotation.z = -side * 0.14;
      eyeGroup.add(lash);

      const brow = rb(0.12, 0.028, 0.03, 0.01, browMat, 0);
      brow.position.set(side * 0.14, 0.145, 0.3);
      brow.rotation.z = -side * 0.12;
      this.headGroup.add(brow);

      this.headGroup.add(eyeGroup);
      if (side === -1) this.eyeLeft = eyeGroup;
      else this.eyeRight = eyeGroup;
    }

    // Rosy blush cheeks
    for (const side of [-1, 1]) {
      const cheek = new THREE.Mesh(new THREE.CircleGeometry(0.058, 16), blushMat);
      cheek.scale.set(1.3, 0.8, 1);
      cheek.position.set(side * 0.21, -0.075, 0.304);
      this.headGroup.add(cheek);
    }

    // Button nose + smile with a tiny open mouth
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), skinMat);
    nose.position.set(0, -0.04, 0.318);
    addOutline(nose, 0.006);
    this.headGroup.add(nose);

    const smile = new THREE.Mesh(
      new THREE.TorusGeometry(0.06, 0.016, 8, 16, Math.PI),
      new THREE.MeshBasicMaterial({ color: 0xc2185b })
    );
    smile.rotation.x = Math.PI;
    smile.position.set(0, -0.11, 0.302);
    this.headGroup.add(smile);

`;
s = s.slice(0,a) + body + s.slice(b);
// anchors updated for box head
s = s.replace("this.hatAnchor.position.set(0, 0.31, 0);", "this.hatAnchor.position.set(0, 0.3, 0);").replace("this.glassesAnchor.position.set(0, 0.02, 0.31);", "this.glassesAnchor.position.set(0, 0.02, 0.32);");
// hair: outline every piece, pointed lobes for locks
s = s.replace("const add = (m) => { G.add(m); return m; };", "const add = (m) => { if (m.geometry && !m.userData.noInk) addOutline(m, 0.011); G.add(m); return m; };\n    const lobe = (r, len, x, y, z, rx, rz, mat = hairMat) => { const grp = new THREE.Group(); const top = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), mat); const tip = new THREE.Mesh(new THREE.ConeGeometry(r * 0.99, len, 10), mat); tip.rotation.x = Math.PI; tip.position.y = -len / 2; addOutline(top, 0.011); addOutline(tip, 0.011); grp.add(top, tip); grp.position.set(x, y, z); grp.rotation.set(rx, 0, rz); G.add(grp); return grp; };");
s = s.replace(/const fringe = \(side, i\) => \{[\s\S]*?\n    \};\n    for \(const side of \[-1, 1\]\) for \(let i = 0; i < 3; i\+\+\) fringe\(side, i\);/, "for (const side of [-1, 1]) for (let i = 0; i < 3; i++) lobe(0.07 - i * 0.004, 0.16 + (i === 0 ? 0.06 : 0), side * (0.05 + i * 0.09), 0.3 - i * 0.045, 0.29 - i * 0.045, -0.35, side * (0.12 + i * 0.3));");
s = s.replace(/for \(let k = 0; k < 3; k\+\+\) \{\n            const tail = [\s\S]*?add\(tail\);\n          \}/, "for (let k = 0; k < 2; k++) lobe(0.11 - k * 0.012, 0.42 - k * 0.04, side * (0.46 + k * 0.05), 0.0 - k * 0.02, -0.03 + k * 0.05, 0, side * (0.28 + k * 0.2));");
s = s.replace(/for \(const side of \[-1, 1\]\) for \(let k = 0; k < 4; k\+\+\) blob\(0\.11[^\n]*\n/, "for (const side of [-1, 1]) for (let k = 0; k < 2; k++) lobe(0.13 - k * 0.015, 0.5 - k * 0.08, side * (0.36 + k * 0.05), 0.0, 0.02 + k * 0.05, 0, side * (0.06 + k * 0.1));\n");
fs.writeFileSync('src/characters.js', s);
