// ============================================================================
// Cozy Critter Salon & Spa - 3D Articulated Stylist Avatar (characters.js)
// ============================================================================
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { toonMat, addOutline } from './gfx.js';
import { SKIN_TONES, HAIR_COLORS, AVATAR_OUTFITS } from './save.js';
import { buildCosmeticMesh } from './shop-data.js';

export class StylistAvatar {
  constructor(config = {}) {
    this.root = new THREE.Group();
    this.root.name = 'StylistAvatar';

    this.bodyGroup = new THREE.Group();
    this.root.add(this.bodyGroup);

    this.headGroup = new THREE.Group();
    this.hairGroup = new THREE.Group();
    this.hatAnchor = new THREE.Group();
    this.glassesAnchor = new THREE.Group();
    this.propAnchor = new THREE.Group();

    this.leftLeg = new THREE.Group();
    this.rightLeg = new THREE.Group();
    this.leftArm = new THREE.Group();
    this.rightArm = new THREE.Group();

    this.eyeLeft = null;
    this.eyeRight = null;
    this.walkPhase = 0;
    this.idleTime = Math.random() * 10;
    this.isWalking = false;
    this.waveTimer = 0;

    this.targetPos = new THREE.Vector3();
    this.hasTarget = false;
    this.moveSpeed = 4.2;

    this.buildRig(config);
  }

  buildRig(config = {}) {
    this.bodyGroup.clear();
    this.headGroup.clear();
    this.hairGroup.clear();
    this.hatAnchor.clear();
    this.glassesAnchor.clear();
    this.propAnchor.clear();
    this.leftLeg.clear();
    this.rightLeg.clear();
    this.leftArm.clear();
    this.rightArm.clear();

    const skin = SKIN_TONES.find(s => s.id === config.skinTone) || SKIN_TONES[0];
    const hairCol = HAIR_COLORS.find(c => c.id === config.hairColor) || HAIR_COLORS[0];
    const outfit = AVATAR_OUTFITS.find(o => o.id === config.outfit) || AVATAR_OUTFITS[0];

    const skinMat = toonMat(skin.hex, { emissive: skin.blush, emissiveIntensity: 0.16, rim: 0.18 });
    const blushMat = toonMat(skin.blush);
    const hairMat = toonMat(hairCol.hex);
    const primaryMat = toonMat(outfit.primary);
    const secondaryMat = toonMat(outfit.secondary);
    const skirtMat = toonMat(outfit.skirt);
    const shoeMat = toonMat(outfit.shoes);

    const INK = '#3a2420';
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

    // ---- Hair Styles ----
    this.headGroup.add(this.hairGroup);
    this.buildHairStyle(config.hairStyle || 'pigtails', hairMat, secondaryMat);

    // ---- Cosmetic Anchors ----
    this.hatAnchor.position.set(0, 0.3, 0);
    this.headGroup.add(this.hatAnchor);

    this.glassesAnchor.position.set(0, 0.02, 0.32);
    this.headGroup.add(this.glassesAnchor);

    if (config.hat) {
      this.hatAnchor.add(buildCosmeticMesh(config.hat));
    }
    if (config.glasses) {
      this.glassesAnchor.add(buildCosmeticMesh(config.glasses));
    }
    if (config.heldProp) {
      this.propAnchor.add(buildCosmeticMesh(config.heldProp));
    }

    this.root.traverse(c => {
      if (c.isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });
  }

﻿  buildHairStyle(styleId, hairMat, ribbonMat) {
    const G = this.hairGroup;
    const hiCol = hairMat.color.clone(); const hsl = {}; hiCol.getHSL(hsl); hiCol.setHSL(hsl.h, Math.min(1, hsl.s * 0.9 + 0.1), Math.min(0.72, hsl.l + 0.2));
    const hiMat = toonMat(hiCol.getHex(), { emissive: hiCol.getHex(), emissiveIntensity: 0.35, rim: 0.1 });
    const add = (m) => { if (m.geometry && !m.userData.noInk) addOutline(m, 0.011); G.add(m); return m; };
    const lobe = (r, len, x, y, z, rx, rz, mat = hairMat) => { const grp = new THREE.Group(); const top = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), mat); const tip = new THREE.Mesh(new THREE.ConeGeometry(r * 0.99, len, 10), mat); tip.rotation.x = Math.PI; tip.position.y = -len / 2; addOutline(top, 0.011); addOutline(tip, 0.011); grp.add(top, tip); grp.position.set(x, y, z); grp.rotation.set(rx, 0, rz); G.add(grp); return grp; };
    const blob = (r, x, y, z, sx = 1, sy = 1, sz = 1, mat = hairMat) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 12), mat); m.position.set(x, y, z); m.scale.set(sx, sy, sz); return add(m); };

    // Full, fluffy crown: a bigger volume than the skull so it reads as hair, not a cap
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.375, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.52), hairMat);
    cap.rotation.x = -0.28; cap.position.set(0, 0.07, -0.05); add(cap);
    // soft back volume so the silhouette is never a plain dome
    blob(0.3, 0, 0.0, -0.17, 1.12, 1.0, 0.85);
    // glossy highlight arc (the single biggest "cartoon hair" cue)
    const gl1 = blob(0.07, -0.13, 0.37, 0.14, 1.9, 0.45, 1.0, hiMat); gl1.rotation.set(-0.9, 0, 0.35);
    const gl2 = blob(0.045, 0.1, 0.39, 0.1, 1.5, 0.4, 1.0, hiMat); gl2.rotation.set(-0.8, 0, -0.3);

    // Side-swept fringe: overlapping rounded locks with a centre part, not a straight row
    for (const side of [-1, 1]) for (let i = 0; i < 3; i++) lobe(0.07 - i * 0.004, 0.16 + (i === 0 ? 0.06 : 0), side * (0.05 + i * 0.09), 0.3 - i * 0.045, 0.29 - i * 0.045, -0.35, side * (0.12 + i * 0.3));
    const part = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.012, 0.2), toonMat(0x3a2218)); part.position.set(0, 0.368, 0.02); part.rotation.x = -0.1; add(part);
    // little side tufts in front of the ears so hair frames the face
    for (const side of [-1, 1]) blob(0.075, side * 0.33, 0.05, 0.1, 0.8, 1.5, 0.8);

    switch (styleId) {
      case 'pigtails': {
        for (const side of [-1, 1]) {
          const tie = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), ribbonMat); tie.position.set(side * 0.36, 0.1, -0.03); add(tie);
          for (let k = 0; k < 2; k++) lobe(0.11 - k * 0.012, 0.42 - k * 0.04, side * (0.46 + k * 0.05), 0.0 - k * 0.02, -0.03 + k * 0.05, 0, side * (0.28 + k * 0.2));
          blob(0.075, side * 0.52, -0.3, -0.0, 1, 1, 1);
        }
        break;
      }
      case 'space_buns': {
        for (const side of [-1, 1]) {
          blob(0.17, side * 0.26, 0.34, -0.04);
          const sc = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.03, 8, 16), ribbonMat); sc.position.set(side * 0.22, 0.26, -0.03); sc.rotation.set(0.3, side * 0.6, 0.0); add(sc);
          const bunHi = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), hiMat); bunHi.position.set(side * 0.3, 0.41, 0.03); bunHi.scale.set(1.3, 0.7, 0.8); add(bunHi);
        }
        break;
      }
      case 'long_waves': {
        const back = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.42, 0.62, 20, 1, true, Math.PI * 0.35, Math.PI * 1.3), hairMat);
        back.material = back.material.clone(); back.material.side = THREE.DoubleSide;
        back.position.set(0, -0.2, -0.04); add(back);
        for (const side of [-1, 1]) for (let k = 0; k < 2; k++) lobe(0.13 - k * 0.015, 0.5 - k * 0.08, side * (0.36 + k * 0.05), 0.0, 0.02 + k * 0.05, 0, side * (0.06 + k * 0.1));
        for (let k = 0; k < 5; k++) blob(0.1, (k - 2) * 0.14, -0.5 + Math.abs(k - 2) * 0.03, -0.2, 1, 1.2, 0.9);
        break;
      }
      case 'curly_puff':
      case 'afro_puffs': {
        const golden = [[0, 0.3, -0.02, 0.2], [-0.2, 0.26, 0.02, 0.17], [0.2, 0.26, 0.02, 0.17], [-0.32, 0.12, -0.02, 0.15], [0.32, 0.12, -0.02, 0.15], [-0.14, 0.34, -0.1, 0.16], [0.14, 0.34, -0.1, 0.16], [0, 0.2, -0.28, 0.2], [-0.3, 0.0, -0.14, 0.14], [0.3, 0.0, -0.14, 0.14]];
        for (const [x, y, z, r] of golden) blob(r, x, y, z);
        blob(0.07, -0.12, 0.44, 0.0, 1, 0.7, 1, hiMat);
        break;
      }
      case 'bob_bangs': {
        const bob = new THREE.Mesh(new THREE.CylinderGeometry(0.37, 0.43, 0.3, 22, 1, true, Math.PI * 0.3, Math.PI * 1.4), hairMat);
        bob.material = bob.material.clone(); bob.material.side = THREE.DoubleSide; bob.position.set(0, -0.06, -0.03); add(bob);
        for (const side of [-1, 1]) { blob(0.16, side * 0.36, -0.2, 0.0, 1, 0.65, 1.1); blob(0.1, side * 0.3, -0.2, 0.14, 1, 0.6, 1); }
        blob(0.2, 0, -0.2, -0.3, 1.5, 0.6, 0.8);
        // straight cut fringe
        for (let i = -3; i <= 3; i++) { const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.052, 0.07, 6, 8), hairMat); b.position.set(i * 0.075, 0.2, 0.3 - Math.abs(i) * 0.02); b.rotation.x = -0.15; add(b); }
        break;
      }
      case 'high_pony': {
        const tie = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.034, 8, 16), ribbonMat); tie.position.set(0, 0.3, -0.2); tie.rotation.x = 0.5; add(tie);
        for (let k = 0; k < 5; k++) { const t = new THREE.Mesh(new THREE.CapsuleGeometry(0.095 - k * 0.012, 0.16, 6, 10), hairMat); t.position.set(Math.sin(k * 0.9) * 0.03, 0.2 - k * 0.1, -0.36 - k * 0.07); t.rotation.x = -0.9 - k * 0.1; add(t); }
        const bow = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), ribbonMat); bow.scale.set(1.8, 1, 0.8); bow.position.set(0, 0.34, -0.23); add(bow);
        break;
      }
      case 'braids': {
        for (const side of [-1, 1]) {
          for (let b = 0; b < 5; b++) {
            const bead = new THREE.Mesh(new THREE.SphereGeometry(0.085 - b * 0.008, 10, 8), b % 2 ? hairMat : hiMat);
            bead.scale.set(1.1, 0.82, 1); bead.position.set(side * (0.34 + Math.sin(b * 1.1) * 0.03), -0.02 - b * 0.1, 0.07); add(bead);
          }
          const bow = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), ribbonMat); bow.scale.set(1.7, 1, 0.9); bow.position.set(side * 0.34, -0.55, 0.07); add(bow);
        }
        break;
      }
      case 'half_up': {
        blob(0.17, 0, 0.36, -0.07);
        const sc = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 8, 16), ribbonMat); sc.position.set(0, 0.27, -0.07); sc.rotation.x = 0.4; add(sc);
        const bow = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), ribbonMat); bow.scale.set(1.9, 1, 0.8); bow.position.set(0, 0.46, -0.04); add(bow);
        const back = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.4, 0.5, 20, 1, true, Math.PI * 0.35, Math.PI * 1.3), hairMat);
        back.material = back.material.clone(); back.material.side = THREE.DoubleSide; back.position.set(0, -0.16, -0.05); add(back);
        for (let k = 0; k < 4; k++) blob(0.1, (k - 1.5) * 0.15, -0.42, -0.22, 1, 1.3, 0.9);
        break;
      }
      case 'pixie':
      default: {
        const spikes = [[0.12, 0.36, 0.1, -0.5], [-0.1, 0.38, 0.08, 0.45], [0.0, 0.4, -0.02, 0.0], [0.22, 0.3, -0.04, -0.9], [-0.22, 0.3, -0.04, 0.9], [0.1, 0.34, -0.2, -0.3], [-0.1, 0.34, -0.2, 0.3]];
        for (const [x, y, z, rz] of spikes) { const t = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.2, 8), hairMat); t.position.set(x, y, z); t.rotation.z = rz; add(t); }
        const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.07, 0), ribbonMat); star.scale.set(1, 1, 0.5); star.position.set(0.24, 0.3, 0.2); add(star);
        break;
      }
    }
  }

  setTarget(x, z) {
    this.targetPos.set(x, 0, z);
    this.hasTarget = true;
  }

  triggerWave() {
    this.waveTimer = 1.4;
  }

  update(dt, soundEngine = null, boundsFn = null) {
    this.idleTime += dt;

    // Blinking
    const blinkCycle = this.idleTime % 3.8;
    const isBlinking = blinkCycle > 3.65;
    if (this.eyeLeft && this.eyeRight) {
      const sy = isBlinking ? 0.12 : 1.0;
      this.eyeLeft.scale.y = sy;
      this.eyeRight.scale.y = sy;
    }

    // Propeller beanie and pinwheel spin
    const hatBlade = this.hatAnchor.getObjectByName('propeller_blade');
    if (hatBlade) hatBlade.rotation.y += dt * 10;
    const propWheel = this.propAnchor.getObjectByName('pinwheel_blades');
    if (propWheel) propWheel.rotation.z += dt * 8;

    // Walking movement
    if (this.hasTarget) {
      const cur = this.root.position;
      const dx = this.targetPos.x - cur.x;
      const dz = this.targetPos.z - cur.z;
      const dist = Math.hypot(dx, dz);

      if (dist > 0.12) {
        this.isWalking = true;
        const step = Math.min(dist, this.moveSpeed * dt);
        let nx = cur.x + (dx / dist) * step;
        let nz = cur.z + (dz / dist) * step;
        if (boundsFn) {
          const clamped = boundsFn(nx, nz);
          nx = clamped.x;
          nz = clamped.z;
        }
        cur.x = nx;
        cur.z = nz;

        // Smoothly rotate toward movement direction
        const targetAngle = Math.atan2(dx, dz);
        let diff = targetAngle - this.root.rotation.y;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        this.root.rotation.y += diff * Math.min(1, dt * 12);

        this.walkPhase += dt * 11;
        this.bodyGroup.position.y = Math.abs(Math.sin(this.walkPhase)) * 0.08;
        this.bodyGroup.rotation.z = Math.sin(this.walkPhase) * 0.04;
        this.leftLeg.rotation.x = Math.sin(this.walkPhase) * 0.55;
        this.rightLeg.rotation.x = -Math.sin(this.walkPhase) * 0.55;
        this.leftArm.rotation.x = -Math.sin(this.walkPhase) * 0.45;
        this.rightArm.rotation.x = Math.sin(this.walkPhase) * 0.45;

        if (soundEngine) soundEngine.playFootstep();
      } else {
        this.hasTarget = false;
        this.isWalking = false;
      }
    } else {
      this.isWalking = false;
    }

    if (!this.isWalking) {
      // Gentle breathing idle
      this.bodyGroup.position.y = Math.sin(this.idleTime * 2.4) * 0.02;
      this.bodyGroup.rotation.z = Math.sin(this.idleTime * 1.2) * 0.015;
      this.leftLeg.rotation.x *= 0.85;
      this.rightLeg.rotation.x *= 0.85;
      this.leftArm.rotation.x *= 0.85;

      if (this.waveTimer > 0) {
        this.waveTimer -= dt;
        this.rightArm.rotation.z = -2.2 + Math.sin(this.idleTime * 14) * 0.35;
        this.rightArm.rotation.x = 0;
      } else {
        this.rightArm.rotation.z *= 0.85;
        this.rightArm.rotation.x *= 0.85;
      }
    }
  }
}
