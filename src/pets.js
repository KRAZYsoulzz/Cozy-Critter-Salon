// ============================================================================
// Cozy Critter Salon & Spa - 3D Articulated Pets & Care Overlays (pets.js)
// Capybara, Pink Axolotl, and Tiny Dik-dik
// ============================================================================
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { toonMat, addOutline, svgTexture } from './gfx.js';
import { buildCosmeticMesh } from './shop-data.js';
import { iconSVG } from './icons.js';

export class CritterPet {
  constructor(speciesId, petState = {}) {
    this.speciesId = speciesId;
    this.root = new THREE.Group();
    this.root.name = `Pet_${speciesId}`;

    this.bodyGroup = new THREE.Group();
    this.root.add(this.bodyGroup);

    this.headGroup = new THREE.Group();
    this.ears = [];
    this.gillStalks = [];
    this.legs = [];
    this.tail = null;

    this.eyeLeft = null;
    this.eyeRight = null;
    this.eyelidLeft = null;
    this.eyelidRight = null;
    this.heartEyeLeft = null;
    this.heartEyeRight = null;
    this.mouthClosed = null;
    this.mouthOpen = null;
    this.teethSparkle = null;

    // Cosmetic anchors
    this.hatAnchor = new THREE.Group();
    this.glassesAnchor = new THREE.Group();
    this.neckAnchor = new THREE.Group();
    this.bodyAnchor = new THREE.Group();
    this.propAnchor = new THREE.Group();

    // Activity target anchors (world space lookup helpers)
    this.mouthAnchor = new THREE.Group();
    this.chestAnchor = new THREE.Group();
    this.foreheadAnchor = new THREE.Group();

    // 3D Care Overlays
    this.overlayGroup = new THREE.Group();
    this.mudMeshes = [];
    this.foamMeshes = [];
    this.dropMeshes = [];
    this.twigMeshes = [];
    this.scrapeMeshes = [];
    this.bandageMeshes = [];
    this.feverGlow = null;

    // Thought bubble in world
    this.thoughtSprite = null;
    this.currentBubbleIcon = null;

    // Animation state
    this.animTime = Math.random() * 10;
    this.walkPhase = 0;
    this.isWalking = false;
    this.followingPlayer = false;
    this.homePos = new THREE.Vector3(0, 0, 0);
    this.targetPos = new THREE.Vector3(0, 0, 0);
    this.hasTarget = false;
    this.wanderTimer = 2 + Math.random() * 4;

    // Expressive reactions
    this.hopTimer = 0;
    this.shakeTimer = 0;
    this.chewTimer = 0;
    this.squintAmount = 0;
    this.mouthOpenAmount = 0;
    this.heartEyesTimer = 0;

    this.buildSpeciesMesh();
    this.buildCareOverlays();
    this.syncFromState(petState);
  }

  buildSpeciesMesh() {
    this.bodyGroup.clear();
    this.headGroup.clear();
    this.ears = [];
    this.gillStalks = [];
    this.legs = [];

    if (this.speciesId === 'capybara') {
      this.buildCapybara();
    } else if (this.speciesId === 'axolotl') {
      this.buildAxolotl();
    } else {
      this.buildDikdik();
    }

    this.headGroup.add(this.hatAnchor, this.glassesAnchor, this.mouthAnchor, this.foreheadAnchor);
    this.bodyGroup.add(this.neckAnchor, this.bodyAnchor, this.propAnchor, this.chestAnchor, this.overlayGroup);

    this.root.traverse(c => {
      if (c.isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });
  }

  // --------------------------------------------------------------------------
  // 1. CAPYBARA: Chubby barrel body, blunt boxy snout, small round ears, calm eyes
  // --------------------------------------------------------------------------
  buildCapybara() {
    const furMat = toonMat(0xad7241);
    const bellyMat = toonMat(0xc9935f);
    const snoutMat = toonMat(0x8a5830);
    const muzzleMat = toonMat(0xe9bf86);
    const darkMat = toonMat(0x261710);
    const blushMat = toonMat(0xff8da1);

    // Chubby barrel body
    const barrel = new THREE.Mesh(new RoundedBoxGeometry(0.82, 0.76, 1.14, 8, 0.37), furMat);
    barrel.position.set(0, 0.48, -0.05);
    addOutline(barrel, 0.02);
    this.bodyGroup.add(barrel);

    // Soft lighter belly
    const belly = new THREE.Mesh(new RoundedBoxGeometry(0.64, 0.36, 0.9, 4, 0.16), bellyMat);
    belly.position.set(0, 0.31, 0.0);
    this.bodyGroup.add(belly);

    // 4 stubby legs with cute toes
    const legCoords = [
      [-0.24, 0.22, 0.22],
      [0.24, 0.22, 0.22],
      [-0.24, 0.22, -0.28],
      [0.24, 0.22, -0.28]
    ];
    legCoords.forEach(([lx, ly, lz]) => {
      const lg = new THREE.Group();
      lg.position.set(lx, ly, lz);
      const limb = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.24, 0.2, 3, 0.07), furMat);
      limb.position.y = -0.08; addOutline(limb, 0.012);
      const paw = new THREE.Mesh(new RoundedBoxGeometry(0.22, 0.1, 0.29, 3, 0.045), snoutMat);
      paw.position.set(0, -0.19, 0.045); addOutline(paw, 0.01);
      lg.add(limb, paw);
      this.legs.push(lg);
      this.bodyGroup.add(lg);
    });

    // Head & signature blunt boxy snout
    this.headGroup.position.set(0, 0.74, 0.34);
    this.bodyGroup.add(this.headGroup);

    const skull = new THREE.Mesh(new RoundedBoxGeometry(0.84, 0.74, 0.78, 8, 0.34), furMat);
    addOutline(skull, 0.02);
    this.headGroup.add(skull);

    const snout = new THREE.Mesh(new RoundedBoxGeometry(0.4, 0.28, 0.3, 6, 0.13), muzzleMat);
    snout.position.set(0, -0.09, 0.3);
    addOutline(snout, 0.016);
    this.headGroup.add(snout);

    const nosePad = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 10), toonMat(0x4a2a1c));
    nosePad.scale.set(1.25, 0.75, 0.7);
    nosePad.position.set(0, 0.035, 0.435);
    this.headGroup.add(nosePad);

    // Cute nostrils & nose bridge
    for (const side of [-1, 1]) {
      const nostril = new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 8), darkMat);
      nostril.scale.set(0.8, 1.2, 0.6);
      nostril.position.set(side * 0.07, 0.01, 0.455);
      this.headGroup.add(nostril);

      const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 8), blushMat);
      cheek.scale.set(1.1, 0.7, 0.4);
      cheek.position.set(side * 0.28, -0.05, 0.355);
      this.headGroup.add(cheek);
    }

    // Small round ears on top-back of head
    for (const side of [-1, 1]) {
      const ear = new THREE.Group();
      ear.position.set(side * 0.28, 0.3, -0.08);
      const outer = new THREE.Mesh(new THREE.SphereGeometry(0.095, 10, 8), snoutMat);
      outer.scale.set(0.85, 1.1, 0.55);
      outer.rotation.z = -side * 0.3;
      const inner = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), blushMat);
      inner.position.set(0, 0, 0.03);
      addOutline(outer, 0.01);
      ear.add(outer, inner);
      this.ears.push(ear);
      this.headGroup.add(ear);
    }

    // Expressive eyes with calm half-lids that widen when happy
    this.buildEyesAndMouth({
      eyeX: 0.2,
      eyeY: 0.11,
      eyeZ: 0.365,
      eyeRadius: 0.088,
      lidColor: 0xad7241,
      defaultHalfLid: true,
      mouthY: -0.17,
      mouthZ: 0.445
    });

    // Anchors
    this.hatAnchor.position.set(0, 0.33, 0.02);
    this.glassesAnchor.position.set(0, 0.1, 0.32);
    this.neckAnchor.position.set(0, 0.56, 0.22);
    this.bodyAnchor.position.set(0, 0.56, -0.05);
    this.propAnchor.position.set(0.34, 0.42, 0.26);
    this.mouthAnchor.position.set(0, -0.13, 0.45);
    this.chestAnchor.position.set(0, 0.48, 0.32);
    this.foreheadAnchor.position.set(0, 0.24, 0.26);
  }

  // --------------------------------------------------------------------------
  // 2. PINK AXOLOTL: Frilly pink gill stalks, wide smile, swishy finned tail
  // --------------------------------------------------------------------------
  buildAxolotl() {
    const bodyMat = toonMat(0xffa8cc);
    const bellyMat = toonMat(0xffd6e8);
    const gillMat = toonMat(0xff4d8d);
    const finMat = toonMat(0xff7eb6);
    const blushMat = toonMat(0xff5c99);

    // Plump amphibian body
    const torso = new THREE.Mesh(new RoundedBoxGeometry(0.68, 0.6, 1.0, 8, 0.29), bodyMat);
    torso.position.set(0, 0.42, -0.04);
    addOutline(torso, 0.02);
    this.bodyGroup.add(torso);

    const belly = new THREE.Mesh(new RoundedBoxGeometry(0.56, 0.3, 0.84, 4, 0.13), bellyMat);
    belly.position.set(0, 0.28, 0.0);
    this.bodyGroup.add(belly);

    // Swishy finned tail
    this.tail = new THREE.Group();
    this.tail.position.set(0, 0.4, -0.38);
    const tailCore = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.58, 12), bodyMat);
    tailCore.rotation.x = -Math.PI / 2;
    tailCore.scale.set(0.55, 1.0, 1.1);
    tailCore.position.z = -0.25;
    const tailFin = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.64, 12), finMat);
    tailFin.rotation.x = -Math.PI / 2;
    tailFin.scale.set(0.18, 1.0, 1.25);
    tailFin.position.z = -0.28;
    this.tail.add(tailCore, tailFin);
    this.bodyGroup.add(this.tail);

    // 4 cute stubby feet
    const legCoords = [
      [-0.25, 0.2, 0.18],
      [0.25, 0.2, 0.18],
      [-0.24, 0.2, -0.22],
      [0.24, 0.2, -0.22]
    ];
    legCoords.forEach(([lx, ly, lz]) => {
      const lg = new THREE.Group();
      lg.position.set(lx, ly, lz);
      const limb = new THREE.Mesh(new RoundedBoxGeometry(0.16, 0.2, 0.16, 3, 0.06), bodyMat);
      limb.position.y = -0.06; addOutline(limb, 0.012);
      const foot = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.07, 0.24, 3, 0.03), finMat);
      foot.position.set(0, -0.17, 0.04); addOutline(foot, 0.01);
      lg.add(limb, foot);
      this.legs.push(lg);
      this.bodyGroup.add(lg);
    });

    // Wide round axolotl head
    this.headGroup.position.set(0, 0.68, 0.28);
    this.bodyGroup.add(this.headGroup);

    const head = new THREE.Mesh(new RoundedBoxGeometry(1.0, 0.6, 0.74, 8, 0.29), bodyMat);
    addOutline(head, 0.02);
    this.headGroup.add(head);

    // 6 signature feathery pink gill stalks (3 on each side)
    const gillAngles = [0.48, 0.05, -0.38];
    for (const side of [-1, 1]) {
      gillAngles.forEach((ang, idx) => {
        const stalkGroup = new THREE.Group();
        stalkGroup.position.set(side * 0.46, 0.12 - idx * 0.09, -0.02);
        stalkGroup.rotation.z = -side * (Math.PI * 0.36 - ang);
        stalkGroup.userData = { baseRotZ: stalkGroup.rotation.z, side, idx };

        const stalk = new THREE.Mesh(new THREE.CapsuleGeometry(0.038, 0.22, 6, 8), bodyMat);
        stalk.position.y = 0.12;
        stalkGroup.add(stalk);

        // Feathery filaments along each stalk
        for (let f = 0; f < 4; f++) {
          const feather = new THREE.Mesh(new THREE.SphereGeometry(0.048, 8, 6), gillMat);
          feather.scale.set(1.5, 0.65, 0.65);
          feather.position.set((f % 2 === 0 ? 1 : -1) * 0.045, 0.07 + f * 0.055, 0);
          stalkGroup.add(feather);
        }

        this.gillStalks.push(stalkGroup);
        this.headGroup.add(stalkGroup);
      });

      const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.068, 10, 8), blushMat);
      cheek.scale.set(1.25, 0.72, 0.4);
      cheek.position.set(side * 0.32, -0.06, 0.34);
      this.headGroup.add(cheek);
    }
    const axMuzzle = new THREE.Mesh(new THREE.CircleGeometry(1, 24), bellyMat);
    axMuzzle.scale.set(0.19, 0.12, 1); axMuzzle.position.set(0, -0.1, 0.372); this.headGroup.add(axMuzzle);

    this.buildEyesAndMouth({
      eyeX: 0.23,
      eyeY: 0.05,
      eyeZ: 0.355,
      eyeRadius: 0.068,
      lidColor: 0xff85b3,
      defaultHalfLid: false,
      mouthY: -0.11,
      mouthZ: 0.378
    });

    // Anchors
    this.hatAnchor.position.set(0, 0.32, 0);
    this.glassesAnchor.position.set(0, 0.05, 0.36);
    this.neckAnchor.position.set(0, 0.5, 0.18);
    this.bodyAnchor.position.set(0, 0.5, -0.04);
    this.propAnchor.position.set(0.32, 0.38, 0.22);
    this.mouthAnchor.position.set(0, -0.07, 0.37);
    this.chestAnchor.position.set(0, 0.42, 0.28);
    this.foreheadAnchor.position.set(0, 0.2, 0.28);
  }

  // --------------------------------------------------------------------------
  // 3. TINY DIK-DIK: Huge glossy eyes, tiny snout, big ears, crown tuft, stick legs
  // --------------------------------------------------------------------------
  buildDikdik() {
    const fawnMat = toonMat(0xc98a55);
    const creamMat = toonMat(0xfff0de);
    const darkMat = toonMat(0x281a14);
    const pinkMat = toonMat(0xff9eb5);
    const tuftMat = toonMat(0xa66532);

    // Slender dainty body
    const torso = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.5, 0.86, 8, 0.245), fawnMat);
    torso.position.set(0, 0.56, -0.04);
    addOutline(torso, 0.018);
    this.bodyGroup.add(torso);

    const chest = new THREE.Mesh(new THREE.SphereGeometry(0.23, 14, 12), creamMat);
    chest.scale.set(0.88, 0.92, 1.05);
    chest.position.set(0, 0.52, 0.12);
    this.bodyGroup.add(chest);

    // Tiny tail
    this.tail = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.16, 8), fawnMat);
    this.tail.position.set(0, 0.62, -0.36);
    this.tail.rotation.x = -0.6;
    this.bodyGroup.add(this.tail);

    // 4 slender stick legs with dark hooves
    const legCoords = [
      [-0.15, 0.38, 0.16],
      [0.15, 0.38, 0.16],
      [-0.15, 0.38, -0.22],
      [0.15, 0.38, -0.22]
    ];
    legCoords.forEach(([lx, ly, lz]) => {
      const lg = new THREE.Group();
      lg.position.set(lx, ly, lz);
      const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.046, 0.32, 10), fawnMat);
      upper.position.y = -0.16;
      const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.058, 0.08, 10), darkMat);
      hoof.position.y = -0.34;
      lg.add(upper, hoof);
      this.legs.push(lg);
      this.bodyGroup.add(lg);
    });

    // Slender neck + expressive head
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.26, 12), fawnMat);
    neck.position.set(0, 0.76, 0.18);
    neck.rotation.x = 0.25;
    this.bodyGroup.add(neck);

    this.headGroup.position.set(0, 0.96, 0.24);
    this.headGroup.scale.setScalar(1.2);
    this.bodyGroup.add(this.headGroup);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 16), fawnMat);
    head.scale.set(0.96, 0.95, 1.05);
    addOutline(head, 0.018);
    this.headGroup.add(head);

    // Characteristic tiny mobile pointed snout
    const snout = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.2, 14), fawnMat);
    snout.rotation.x = Math.PI / 2 - 0.15;
    snout.position.set(0, -0.06, 0.27);
    this.headGroup.add(snout);
    const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 12), creamMat);
    muzzle.scale.set(1.15, 0.8, 1.0); muzzle.position.set(0, -0.09, 0.3); this.headGroup.add(muzzle);

    const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), darkMat);
    noseTip.scale.set(1.2, 0.85, 0.9);
    noseTip.position.set(0, -0.045, 0.39);
    this.headGroup.add(noseTip);

    // Fluffy crown tuft on forehead
    const tuftGroup = new THREE.Group();
    tuftGroup.position.set(0, 0.26, 0.04);
    for (let i = -1; i <= 1; i++) {
      const lock = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.19, 8), tuftMat);
      lock.position.set(i * 0.045, 0.05, 0);
      lock.rotation.z = -i * 0.25;
      tuftGroup.add(lock);
    }
    this.headGroup.add(tuftGroup);

    // Oversized twitchy antelope ears + white eye rings
    for (const side of [-1, 1]) {
      const ear = new THREE.Group();
      ear.position.set(side * 0.2, 0.2, -0.04);
      ear.rotation.z = -side * 0.48;
      ear.userData = { baseRotZ: -side * 0.48, side };

      const outer = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.4, 12), fawnMat);
      outer.scale.set(0.85, 1.0, 0.45);
      outer.position.y = 0.14;
      const inner = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.25, 10), pinkMat);
      inner.scale.set(0.8, 1.0, 0.4);
      inner.position.set(0, 0.13, 0.025);
      ear.add(outer, inner);
      this.ears.push(ear);
      this.headGroup.add(ear);

      // White eye ring characteristic of dik-diks
      const ring = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12), creamMat);
      ring.scale.set(1.0, 1.05, 0.4);
      ring.position.set(side * 0.15, 0.06, 0.2);
      this.headGroup.add(ring);

      const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.052, 8, 8), pinkMat);
      cheek.scale.set(1.1, 0.7, 0.4);
      cheek.position.set(side * 0.19, -0.06, 0.24);
      this.headGroup.add(cheek);
    }

    // Giant glossy dik-dik eyes
    this.buildEyesAndMouth({
      eyeX: 0.15,
      eyeY: 0.06,
      eyeZ: 0.235,
      eyeRadius: 0.078, noLash: true,
      lidColor: 0xc98a55,
      defaultHalfLid: false,
      mouthY: -0.12,
      mouthZ: 0.32
    });

    // Anchors
    this.hatAnchor.position.set(0, 0.3, 0.02);
    this.glassesAnchor.position.set(0, 0.04, 0.29);
    this.neckAnchor.position.set(0, 0.68, 0.18);
    this.bodyAnchor.position.set(0, 0.6, -0.04);
    this.propAnchor.position.set(0.26, 0.5, 0.22);
    this.mouthAnchor.position.set(0, -0.11, 0.35);
    this.chestAnchor.position.set(0, 0.54, 0.24);
    this.foreheadAnchor.position.set(0, 0.18, 0.22);
  }

  // --------------------------------------------------------------------------
  // Shared Eyes, Heart Eyes, Eyelids & Open/Closed Mouth
  // --------------------------------------------------------------------------
  setHappy(sec = 1.6) { this.happyTimer = Math.max(this.happyTimer || 0, sec); }

  buildEyesAndMouth(cfg) {
    const R = cfg.eyeRadius * 1.2;
    const darkMat = toonMat(0x1e1424);
    const shineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const lidMat = toonMat(cfg.lidColor);
    const heartMat = toonMat(0xff3b7f, { emissive: 0xff1e62, emissiveIntensity: 0.35 });

    for (const side of [-1, 1]) {
      const eg = new THREE.Group();
      eg.position.set(side * cfg.eyeX, cfg.eyeY, cfg.eyeZ);

      const eyeball = new THREE.Mesh(new THREE.SphereGeometry(R, 14, 12), darkMat);
      eyeball.scale.set(1, 1.08, 0.55);
      eg.add(eyeball);

      const s1 = new THREE.Mesh(new THREE.SphereGeometry(R * 0.42, 10, 10), shineMat);
      s1.position.set(side * R * 0.25, R * 0.3, R * 0.45);
      const s2 = new THREE.Mesh(new THREE.SphereGeometry(R * 0.26, 8, 8), shineMat);
      s2.position.set(-side * R * 0.25, -R * 0.22, R * 0.45);
      eg.add(s1, s2);
      const lidLine = new THREE.Mesh(new THREE.TorusGeometry(R * 0.98, R * (cfg.noLash ? 0.07 : 0.17), 6, 16, Math.PI), new THREE.MeshBasicMaterial({ color: 0x1e1424 }));
      lidLine.position.z = R * 0.1; lidLine.rotation.z = -side * 0.12; eg.add(lidLine);
      for (let k = 0; k < (cfg.noLash ? 0 : 3); k++) { const lash = new THREE.Mesh(new THREE.BoxGeometry(R * 0.5, R * 0.12, R * 0.1), new THREE.MeshBasicMaterial({ color: 0x1e1424 })); lash.position.set(side * (R * 0.98 + k * 0.004), R * (0.42 - k * 0.3), R * 0.12); lash.rotation.z = side * (0.35 - k * 0.5) * -1; eg.add(lash); }

      // Eyelid for calm capybara look / squinting
      const lid = new THREE.Mesh(
        new THREE.SphereGeometry(R * 1.08, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5),
        lidMat
      );
      lid.scale.set(1.05, cfg.defaultHalfLid ? 0.65 : 0.01, 0.65);
      eg.add(lid);

      // 3D Heart Eye overlay (hidden unless loved/petted)
      const hs = new THREE.Shape(); hs.moveTo(0, -0.8); hs.bezierCurveTo(-1.6, 0.1, -0.9, 1.0, 0, 0.35); hs.bezierCurveTo(0.9, 1.0, 1.6, 0.1, 0, -0.8);
      const heart = new THREE.Mesh(new THREE.ExtrudeGeometry(hs, { depth: 0.25, bevelEnabled: false }), heartMat);
      heart.scale.setScalar(R * 0.95);
      heart.position.z = R * 0.35;
      heart.visible = false;
      eg.add(heart);

      const arc = new THREE.Mesh(new THREE.TorusGeometry(R * 0.78, R * 0.2, 8, 20, Math.PI), new THREE.MeshBasicMaterial({ color: 0x1e1424 }));
      arc.position.z = R * 0.3; arc.visible = false; eg.add(arc);
      eg.userData.arc = arc; eg.userData.heart = heart;
      (this.eyeGroups = this.eyeGroups || []).push(eg);
      this.headGroup.add(eg);
      if (side === -1) {
        this.eyeLeft = eg;
        this.eyelidLeft = lid;
        this.heartEyeLeft = heart;
      } else {
        this.eyeRight = eg;
        this.eyelidRight = lid;
        this.heartEyeRight = heart;
      }
    }

    // Closed smiling mouth
    this.mouthClosed = new THREE.Mesh(
      new THREE.TorusGeometry(0.055, 0.014, 8, 16, Math.PI),
      darkMat
    );
    this.mouthClosed.rotation.x = Math.PI;
    this.mouthClosed.position.set(0, cfg.mouthY, cfg.mouthZ);
    this.headGroup.add(this.mouthClosed);
    this.mouthBaseY = cfg.mouthY;
    this.tear = new THREE.Mesh(new THREE.SphereGeometry(R * 0.28, 8, 8), new THREE.MeshBasicMaterial({ color: 0x7fd0ff }));
    this.tear.scale.set(0.8, 1.3, 0.6);
    this.tear.position.set(-cfg.eyeX * 1.05, cfg.eyeY - R * 1.35, cfg.eyeZ + R * 0.25);
    this.tear.visible = false;
    this.headGroup.add(this.tear);

    // Open mouth + pink tongue + white teeth (for Kitchen feeding & Spa toothbrushing)
    this.mouthOpen = new THREE.Group();
    this.mouthOpen.position.set(0, cfg.mouthY - 0.01, cfg.mouthZ);
    const cavity = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 10), toonMat(0x7a1c36));
    cavity.scale.set(1.2, 0.95, 0.45);
    const tongue = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), toonMat(0xff7aa2));
    tongue.scale.set(1.1, 0.6, 0.5);
    tongue.position.set(0, -0.025, 0.02);
    const teeth = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.032, 0.03), toonMat(0xffffff));
    teeth.position.set(0, 0.035, 0.025);
    this.teethSparkle = teeth;
    this.mouthOpen.add(cavity, tongue, teeth);
    this.mouthOpen.visible = false;
    this.headGroup.add(this.mouthOpen);
  }

  // --------------------------------------------------------------------------
  // 3D Care Overlays: Mud, Foam, Water Drops, Twigs, Scrapes, Bandages, Fever
  // --------------------------------------------------------------------------
  buildCareOverlays() {
    this.overlayGroup.clear();
    this.mudMeshes = [];
    this.foamMeshes = [];
    this.dropMeshes = [];
    this.twigMeshes = [];
    this.scrapeMeshes = [];
    this.bandageMeshes = [];

    const mudMat = toonMat(0x5c3a21);
    const foamMat = toonMat(0xffffff, { emissive: 0xd8f3ff, emissiveIntensity: 0.25 });
    const dropMat = toonMat(0x4dabf7, { emissive: 0x1c7ed6, emissiveIntensity: 0.2 });
    const twigMat = toonMat(0x6b4423);
    const leafMat = toonMat(0x52b788);
    const scrapeMat = toonMat(0xff5a79);
    const bandMat = toonMat(0xff85c0);
    const starMat = toonMat(0xffe066);

    const spotCoords = [
      [-0.24, 0.56, 0.14],
      [0.24, 0.54, 0.12],
      [0, 0.68, -0.05],
      [-0.2, 0.48, -0.18],
      [0.22, 0.5, -0.16]
    ];

    spotCoords.forEach(([x, y, z], idx) => {
      // Mud splat
      const mud = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), mudMat);
      mud.scale.set(1.2, 0.45, 1.1);
      mud.position.set(x, y, z);
      mud.visible = false;
      mud.userData = { spotIndex: idx };
      this.mudMeshes.push(mud);
      this.overlayGroup.add(mud);

      // Fluffy soap foam cluster
      const foam = new THREE.Group();
      foam.position.set(x, y + 0.03, z);
      for (let b = 0; b < 4; b++) {
        const bubble = new THREE.Mesh(new THREE.SphereGeometry(0.075 - b * 0.01, 10, 8), foamMat);
        bubble.position.set((b - 1.5) * 0.04, (b % 2) * 0.03, (b % 3 - 1) * 0.03);
        foam.add(bubble);
      }
      foam.visible = false;
      this.foamMeshes.push(foam);
      this.overlayGroup.add(foam);

      // Water droplets
      const drop = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.11, 8), dropMat);
      drop.position.set(x, y + 0.04, z);
      drop.visible = false;
      this.dropMeshes.push(drop);
      this.overlayGroup.add(drop);
    });

    // 3 Twigs for Vet Clinic tweezers
    const twigCoords = [
      [-0.22, 0.66, 0.05],
      [0.24, 0.62, -0.08],
      [0.04, 0.72, -0.2]
    ];
    twigCoords.forEach(([x, y, z], idx) => {
      const tg = new THREE.Group();
      tg.position.set(x, y, z);
      tg.rotation.z = (idx - 1) * 0.45;
      const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.024, 0.22, 7), twigMat);
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.045, 7, 6), leafMat);
      leaf.scale.set(1.5, 0.4, 0.8);
      leaf.position.set(0.04, 0.08, 0);
      tg.add(stick, leaf);
      tg.visible = false;
      tg.userData = { twigIndex: idx };
      this.twigMeshes.push(tg);
      this.overlayGroup.add(tg);
    });

    // 2 Scrapes + Bandages for Vet Clinic
    const scrapeCoords = [
      [-0.25, 0.48, 0.18],
      [0.25, 0.48, 0.04]
    ];
    scrapeCoords.forEach(([x, y, z], idx) => {
      const sc = new THREE.Mesh(new THREE.SphereGeometry(0.085, 10, 8), scrapeMat);
      sc.scale.set(1.1, 0.7, 0.35);
      sc.position.set(x, y, z);
      sc.visible = false;
      this.scrapeMeshes.push(sc);
      this.overlayGroup.add(sc);

      const bg = new THREE.Group();
      bg.position.set(x, y, z + 0.02);
      const strip = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.075, 0.025), bandMat);
      strip.rotation.z = 0.25;
      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.038, 0), starMat);
      star.position.z = 0.02;
      bg.add(strip, star);
      bg.visible = false;
      this.bandageMeshes.push(bg);
      this.overlayGroup.add(bg);
    });

    // Fever forehead glow
    this.feverGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 12, 10),
      toonMat(0xff4d6d, { transparent: true, opacity: 0.55, emissive: 0xff2a55, emissiveIntensity: 0.4 })
    );
    this.feverGlow.scale.set(1.3, 0.65, 0.5);
    this.feverGlow.visible = false;
    this.foreheadAnchor.add(this.feverGlow);
  }

  // --------------------------------------------------------------------------
  // Sync Equipped Cosmetics & Care State from SaveManager
  // --------------------------------------------------------------------------
  syncFromState(petState = {}) {
    // Cosmetics
    const eq = petState.equipped || {};
    this.hatAnchor.clear();
    this.glassesAnchor.clear();
    this.neckAnchor.clear();
    this.bodyAnchor.clear();
    this.propAnchor.clear();

    if (eq.hat) this.hatAnchor.add(buildCosmeticMesh(eq.hat));
    if (eq.glasses) this.glassesAnchor.add(buildCosmeticMesh(eq.glasses));
    if (eq.neck) this.neckAnchor.add(buildCosmeticMesh(eq.neck));
    if (eq.outfit) this.bodyAnchor.add(buildCosmeticMesh(eq.outfit));
    if (eq.heldProp) this.propAnchor.add(buildCosmeticMesh(eq.heldProp));

    // Mud spots
    const dirt = new Set(petState.dirtSpots || []);
    this.mudMeshes.forEach((m, idx) => {
      m.visible = dirt.has(idx);
    });

    // Twigs
    const twigs = new Set(petState.twigs || []);
    this.twigMeshes.forEach((t, idx) => {
      t.visible = twigs.has(idx);
    });

    // Scrapes
    const scrapes = new Set(petState.scrapes || []);
    this.scrapeMeshes.forEach((s, idx) => {
      s.visible = scrapes.has(idx);
    });

    if (this.feverGlow) {
      this.feverGlow.visible = Boolean(petState.fever);
    }
  }

  /**
   * Updates the floating 3D thought-bubble icon above the pet in the world.
   */
  setThoughtBubble(iconName) {
    if (!iconName) {
      if (this.thoughtSprite) this.thoughtSprite.visible = false;
      this.currentBubbleIcon = null;
      return;
    }
    if (this.currentBubbleIcon === iconName && this.thoughtSprite) {
      this.thoughtSprite.visible = true;
      return;
    }
    this.currentBubbleIcon = iconName;

    const innerSvg = iconSVG(iconName, 64);
    const innerContent = innerSvg.replace(/<svg[^>]*>|<\/svg>/g, '');
    const bubbleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <g fill="#ffffff" stroke="#3a2420" stroke-width="9"><circle cx="50" cy="62" r="30"/><circle cx="82" cy="42" r="36"/><circle cx="114" cy="62" r="30"/><circle cx="82" cy="76" r="30"/><circle cx="52" cy="128" r="9"/><circle cx="40" cy="146" r="6"/></g>
      <g fill="#ffffff"><circle cx="50" cy="62" r="30"/><circle cx="82" cy="42" r="36"/><circle cx="114" cy="62" r="30"/><circle cx="82" cy="76" r="30"/></g>
      <g transform="translate(50, 22) scale(1.0)">${innerContent}</g>
    </svg>`;

    const tex = svgTexture(bubbleSvg, 160);
    if (!this.thoughtSprite) {
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
      this.thoughtSprite = new THREE.Sprite(mat);
      this.thoughtSprite.scale.set(1.05, 1.05, 1);
      this.thoughtSprite.position.set(0, 1.75, 0);
      this.thoughtSprite.renderOrder = 10;
      this.root.add(this.thoughtSprite);
    } else {
      this.thoughtSprite.material.map = tex;
      this.thoughtSprite.material.needsUpdate = true;
      this.thoughtSprite.visible = true;
    }
  }

  // --------------------------------------------------------------------------
  // Reactions: Hop, Shake, Chew, Squint, MouthOpen, HeartEyes
  // --------------------------------------------------------------------------
  triggerHop() {
    this.hopTimer = 0.65;
  }

  triggerShake() {
    this.shakeTimer = 0.75;
  }

  triggerChew() {
    this.chewTimer = 0.9;
  }

  triggerHeartEyes(duration = 1.8) {
    this.heartEyesTimer = duration;
  }

  setSquint(amount) {
    this.squintAmount = Math.max(0, Math.min(1, amount));
  }

  setMouthOpen(amount) {
    this.mouthOpenAmount = Math.max(0, Math.min(1, amount));
  }

  // --------------------------------------------------------------------------
  // Frame Update (Idle breathing, gills/ears, walking, squash & stretch)
  // --------------------------------------------------------------------------
  update(dt, playerPos = null, boundsFn = null) {
    this.animTime += dt;

    // Propeller beanie spin if equipped
    const blade = this.hatAnchor.getObjectByName('propeller_blade');
    if (blade) blade.rotation.y += dt * 10;

    // Pinwheel blades spin if equipped
    const pinwheel = this.propAnchor.getObjectByName('pinwheel_blades');
    if (pinwheel) pinwheel.rotation.z += dt * 8;

    // Thought bubble bobbing
    if (this.thoughtSprite && this.thoughtSprite.visible) {
      this.thoughtSprite.position.y = 1.72 + Math.sin(this.animTime * 3.2) * 0.07;
    }

    // Gill stalks wave (Axolotl)
    for (const gill of this.gillStalks) {
      const { baseRotZ, side, idx } = gill.userData;
      gill.rotation.z = baseRotZ + Math.sin(this.animTime * 4.2 + idx * 0.9) * 0.12 * side;
    }

    // Ear twitches (Capybara & Dik-dik)
    this.ears.forEach((ear, idx) => {
      const twitch = Math.sin(this.animTime * 3.5 + idx * 1.7) > 0.92 ? 0.18 : 0;
      ear.rotation.x = twitch;
    });

    // Tail wag
    if (this.tail) {
      this.tail.rotation.y = Math.sin(this.animTime * 4.5) * 0.25;
    }

    // Blinking & Squinting & Heart Eyes
    if (this.heartEyesTimer > 0) {
      this.heartEyesTimer -= dt;
      if (this.heartEyeLeft) this.heartEyeLeft.visible = true;
      if (this.heartEyeRight) this.heartEyeRight.visible = true;
    } else {
      if (this.heartEyeLeft) this.heartEyeLeft.visible = false;
      if (this.heartEyeRight) this.heartEyeRight.visible = false;
    }

    if (this.happyTimer > 0) this.happyTimer -= dt;
    const happy = this.happyTimer > 0;
    const sad = !!this.sad && !happy;
    if (this.eyeGroups) {
      for (const eg of this.eyeGroups) {
        const hv = eg.userData.heart && eg.userData.heart.visible;
        for (const c of eg.children) {
          if (c === eg.userData.heart) continue;
          if (c === eg.userData.arc) c.visible = happy && !hv;
          else c.visible = !(happy && !hv);
        }
      }
    }
    if (this.mouthClosed) {
      const ms = happy ? 1.65 : (sad ? 0.85 : 1);
      this.mouthClosed.scale.set(ms, happy ? 1.5 : 1, 1);
      this.mouthClosed.rotation.x = sad ? 0 : Math.PI;
      this.mouthClosed.position.y = this.mouthBaseY + (sad ? -0.035 : 0);
    }
    if (this.tear) { this.tear.visible = sad; if (sad) this.tear.position.y -= 0; }
    const blink = (this.animTime % 4.1) > 3.95;
    const eyeScaleY = blink ? 0.12 : Math.max(0.22, (sad ? 0.82 : 1.0) - this.squintAmount * 0.68);
    if (this.eyeLeft && this.eyeRight) {
      this.eyeLeft.scale.y = eyeScaleY;
      this.eyeRight.scale.y = eyeScaleY;
    }
    if (this.eyelidLeft && this.eyelidRight && this.speciesId === 'capybara') {
      // Capybara calm half-lids widen when happy/hop/heart-eyes!
      const isExcited = this.hopTimer > 0 || this.heartEyesTimer > 0 || this.mouthOpenAmount > 0.2;
      const lidScaleY = isExcited ? 0.05 : 0.28;
      this.eyelidLeft.scale.y = lidScaleY;
      this.eyelidRight.scale.y = lidScaleY;
    }

    // Mouth Open / Chew
    let showOpenMouth = this.mouthOpenAmount > 0.25;
    if (this.chewTimer > 0) {
      this.chewTimer -= dt;
      showOpenMouth = Math.sin(this.animTime * 18) > 0;
      this.headGroup.scale.set(
        1 + Math.sin(this.animTime * 18) * 0.05,
        1 - Math.sin(this.animTime * 18) * 0.05,
        1
      );
    } else {
      this.headGroup.scale.set(1, 1, 1);
    }
    if (this.mouthClosed && this.mouthOpen) {
      this.mouthClosed.visible = !showOpenMouth;
      this.mouthOpen.visible = showOpenMouth;
    }

    // World AI movement (follow player or gentle room wander)
    if (this.followingPlayer && playerPos) {
      const dx = playerPos.x - this.root.position.x;
      const dz = playerPos.z - this.root.position.z;
      const dist = Math.hypot(dx, dz);
      if (dist > 1.45) {
        this.targetPos.set(
          playerPos.x - (dx / dist) * 1.15,
          0,
          playerPos.z - (dz / dist) * 1.15
        );
        this.hasTarget = true;
      } else {
        this.hasTarget = false;
      }
    } else if (boundsFn) {
      this.wanderTimer -= dt;
      if (this.wanderTimer <= 0) {
        this.wanderTimer = 4 + Math.random() * 5;
        const angle = Math.random() * Math.PI * 2;
        const r = 0.6 + Math.random() * 1.2;
        const tx = this.homePos.x + Math.cos(angle) * r;
        const tz = this.homePos.z + Math.sin(angle) * r;
        const clamped = boundsFn(tx, tz);
        this.targetPos.set(clamped.x, 0, clamped.z);
        this.hasTarget = true;
      }
    }

    if (this.hasTarget) {
      const cur = this.root.position;
      const dx = this.targetPos.x - cur.x;
      const dz = this.targetPos.z - cur.z;
      const dist = Math.hypot(dx, dz);
      if (dist > 0.1) {
        this.isWalking = true;
        const speed = this.followingPlayer ? 3.4 : 1.65;
        const step = Math.min(dist, speed * dt);
        let px = cur.x + (dx / dist) * step, pz = cur.z + (dz / dist) * step;
        if (boundsFn) { const c = boundsFn(px, pz, cur.x, cur.z); px = c.x; pz = c.z; }
        cur.x = px; cur.z = pz;

        const targetAngle = Math.atan2(dx, dz);
        let diff = targetAngle - this.root.rotation.y;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        this.root.rotation.y += diff * Math.min(1, dt * 10);

        this.walkPhase += dt * (this.followingPlayer ? 12 : 7);
      } else {
        this.hasTarget = false;
        this.isWalking = false;
      }
    } else {
      this.isWalking = false;
    }

    // Leg swing & body bounce
    if (this.isWalking) {
      this.bodyGroup.position.y = Math.abs(Math.sin(this.walkPhase)) * 0.06;
      this.legs.forEach((lg, idx) => {
        const dir = idx % 2 === 0 ? 1 : -1;
        lg.rotation.x = Math.sin(this.walkPhase) * 0.45 * dir;
      });
    } else {
      this.legs.forEach(lg => {
        lg.rotation.x *= 0.85;
      });
      this.bodyGroup.position.y = Math.sin(this.animTime * 2.6) * 0.018;
    }

    // Squash & stretch hop reaction
    if (this.hopTimer > 0) {
      this.hopTimer -= dt;
      const p = 1 - this.hopTimer / 0.65;
      const jumpArc = Math.sin(p * Math.PI);
      this.bodyGroup.position.y = jumpArc * 0.34;
      const stretch = 1 + jumpArc * 0.14;
      this.bodyGroup.scale.set(1 / Math.sqrt(stretch), stretch, 1 / Math.sqrt(stretch));
    } else if (this.shakeTimer > 0) {
      this.shakeTimer -= dt;
      this.bodyGroup.rotation.z = Math.sin(this.animTime * 36) * 0.18;
      this.bodyGroup.scale.set(1, 1, 1);
    } else {
      this.bodyGroup.rotation.z = Math.sin(this.animTime * 1.5) * 0.015;
      this.bodyGroup.scale.set(1, 1, 1);
    }
  }
}
