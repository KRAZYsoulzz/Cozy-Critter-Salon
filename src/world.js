// ============================================================================
// Cozy Critter Salon & Spa - 3D Diorama World, Cottage & 5 Rooms (world.js)
// ============================================================================
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import {
  toonMat,
  addOutline,
  addWind,
  canvasTexture,
  svgTexture,
  glowTexture,
  fbm,
  setObjectOpacity
} from './gfx.js';
import { iconSVG } from './icons.js';
import { moveWithCollision, pushOut, dynamicCircles } from './collide.js';
import { wallMaterials, ginghamMat, yardTurfMat, vetFloorMat, buildDecor, dressSpaTub } from './decor.js';

export const ROOM_INFO = {
  exterior: { id: 'exterior', name: 'Sunny Garden Path', icon: 'yard' },
  lobby:    { id: 'lobby',    name: 'Lobby & Cuddle Sanctuary', icon: 'lobby' },
  spa:      { id: 'spa',      name: 'Spa & Bubble Bath', icon: 'spa' },
  clinic:   { id: 'clinic',   name: 'Cozy Vet Clinic', icon: 'vet' },
  kitchen:  { id: 'kitchen',  name: 'Sunny Kitchen & Cafe', icon: 'kitchen' },
  yard:     { id: 'yard',     name: 'Play Yard & Toy Garden', icon: 'yard' }
};

export const STATIONS = {
  spa: {
    id: 'spa',
    name: 'Bubble Bath Spa',
    room: 'spa',
    icon: 'spa',
    voiceId: 'station_spa',
    pos: new THREE.Vector3(-7.2, 0, 2.0),
    petPos: new THREE.Vector3(-7.2, 0.58, 1.65),
    petRotY: 0,
    camPos: new THREE.Vector3(-7.2, 3.33, 4.97),
    camLook: new THREE.Vector3(-7.2, 0.85, 1.65)
  },
  vet: {
    id: 'vet',
    name: 'Vet Checkup Table',
    room: 'clinic',
    icon: 'vet',
    voiceId: 'station_vet',
    pos: new THREE.Vector3(7.2, 0, 2.0),
    petPos: new THREE.Vector3(7.2, 0.72, 1.65),
    petRotY: 0,
    camPos: new THREE.Vector3(7.2, 3.42, 4.97),
    camLook: new THREE.Vector3(7.2, 0.95, 1.65)
  },
  kitchen: {
    id: 'kitchen',
    name: 'Snack Bar & Cafe',
    room: 'kitchen',
    icon: 'kitchen',
    voiceId: 'station_kitchen',
    pos: new THREE.Vector3(-7.2, 0, -3.6),
    petPos: new THREE.Vector3(-7.2, 0.62, -4.1),
    petRotY: 0,
    camPos: new THREE.Vector3(-7.2, 3.42, -0.46),
    camLook: new THREE.Vector3(-7.2, 0.9, -4.1)
  },
  lobby: {
    id: 'lobby',
    name: 'Cuddle Cushion',
    room: 'lobby',
    icon: 'lobby',
    voiceId: 'station_lobby',
    pos: new THREE.Vector3(0, 0, 1.6),
    petPos: new THREE.Vector3(0, 0.35, 1.2),
    petRotY: 0,
    camPos: new THREE.Vector3(0.0, 3.4, 4.62),
    camLook: new THREE.Vector3(0, 0.55, 1.2)
  },
  yard: {
    id: 'yard',
    name: 'Play Yard & Toys',
    room: 'yard',
    icon: 'yard',
    voiceId: 'station_yard',
    pos: new THREE.Vector3(7.2, 0, -3.6),
    petPos: new THREE.Vector3(7.2, 0.12, -4.0),
    petRotY: 0,
    camPos: new THREE.Vector3(7.2, 3.36, -0.29),
    camLook: new THREE.Vector3(7.2, 0.5, -4.0)
  },
  shop: {
    id: 'shop',
    name: 'Critter Boutique',
    room: 'lobby',
    icon: 'shop',
    voiceId: 'station_shop',
    pos: new THREE.Vector3(-2.3, 0, 3.3),
    petPos: new THREE.Vector3(-2.3, 0.45, 2.9),
    petRotY: 0.25,
    camPos: new THREE.Vector3(-2.0, 1.85, 5.1),
    camLook: new THREE.Vector3(-2.3, 0.95, 2.9)
  },
  photobooth: {
    id: 'photobooth',
    name: 'Sparkle Photo Booth',
    room: 'lobby',
    icon: 'camera',
    voiceId: 'station_photobooth',
    pos: new THREE.Vector3(2.3, 0, 3.3),
    petPos: new THREE.Vector3(2.3, 0.38, 2.85),
    petRotY: -0.15,
    camPos: new THREE.Vector3(2.3, 2.0, 6.5),
    camLook: new THREE.Vector3(2.3, 0.8, 2.85)
  }
};

export class SalonWorld {
  constructor(scene) {
    this.scene = scene;
    this.root = new THREE.Group();
    this.root.name = 'SalonWorld';
    this.scene.add(this.root);

    this.roofGroup = new THREE.Group();
    this.upgradeGroup = new THREE.Group();
    this.stationMarkers = [];
    this.waterfallMesh = null;
    this.butterflies = [];
    this.ambientBubbles = [];
    this.walkRing = null;
    this.walkRingTimer = 0;

    this.roofOpacity = 0.08;
    this.time = 0;

    this.buildSkyAndHorizon();
    this.buildTerrainAndGarden();
    this.buildCottageStructure();
    this.buildRoomInteriors();
    this.buildRoomProps();
    buildDecor(this);
    this.buildStationMarkers();
    this.buildAmbientParticles();
    this.buildWalkTargetRing();
  }

  // --------------------------------------------------------------------------
  // 1. Warm Sunset Sky Dome & Distant Rolling Hills (Zero Void at Edges)
  // --------------------------------------------------------------------------
  buildSkyAndHorizon() {
    const skyTex = canvasTexture((ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0.0, '#7cc6fe');
      grad.addColorStop(0.42, '#bde0fe');
      grad.addColorStop(0.75, '#ffd6e0');
      grad.addColorStop(1.0, '#ffefca');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }, 256, 256);

    const skyDome = new THREE.Mesh(
      new THREE.SphereGeometry(95, 24, 16),
      new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, depthWrite: false, fog: false })
    );
    this.root.add(skyDome);

    // Fluffy stylized 3D clouds in the sky
    const cloudMat = toonMat(0xffffff, { emissive: 0xfff0f5, emissiveIntensity: 0.35 });
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      const dist = 42 + (i % 3) * 10;
      const cg = new THREE.Group();
      cg.position.set(Math.cos(a) * dist, 14 + (i % 4) * 2.5, Math.sin(a) * dist - 8);
      cg.lookAt(0, 12, 0);
      for (let p = -1; p <= 1; p++) {
        const puff = new THREE.Mesh(
          new THREE.SphereGeometry(p === 0 ? 2.8 : 2.0, 10, 8),
          cloudMat
        );
        puff.scale.set(1.3, 0.75, 0.8);
        puff.position.x = p * 2.1;
        cg.add(puff);
      }
      this.root.add(cg);
    }

    // Ring of distant pastel green rolling hills all around the horizon
    const hillMat1 = toonMat(0x74c69d);
    const hillMat2 = toonMat(0x52b788);
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * Math.PI * 2;
      const r = 34 + (i % 2) * 5;
      const hill = new THREE.Mesh(
        new THREE.SphereGeometry(9 + (i % 3) * 2.5, 16, 12),
        i % 2 === 0 ? hillMat1 : hillMat2
      );
      hill.scale.set(1.6, 0.65, 1.2);
      hill.position.set(Math.cos(a) * r, -1.5, Math.sin(a) * r);
      hill.receiveShadow = true;
      this.root.add(hill);
    }
  }

  // --------------------------------------------------------------------------
  // 2. Rolling Meadow Terrain, Winding Stone Path, Pond & Waterfall, Foliage
  // --------------------------------------------------------------------------
  buildTerrainAndGarden() {
    // Sculpted meadow island
    const groundGeo = new THREE.PlaneGeometry(90, 90, 64, 64);
    groundGeo.rotateX(-Math.PI / 2);
    const pos = groundGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const distFromCenter = Math.hypot(x, z);
      // Keep salon & garden courtyard flat (`dist < 14`), roll softly outside
      if (distFromCenter > 14.5) {
        const factor = Math.min(1, (distFromCenter - 14.5) / 14);
        const h = fbm(x * 0.08, z * 0.08, 3) * 3.2 * factor;
        pos.setY(i, h);
      } else {
        pos.setY(i, 0);
      }
    }
    groundGeo.computeVertexNormals();

    const grassTex = canvasTexture((ctx, w, h) => {
      ctx.fillStyle = '#7be082';
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 400; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#6ad171' : '#8ef095';
        ctx.beginPath();
        ctx.arc(Math.random() * w, Math.random() * h, 2 + Math.random() * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }, 256, 256);
    grassTex.wrapS = grassTex.wrapT = THREE.RepeatWrapping;
    grassTex.repeat.set(14, 14);

    const ground = new THREE.Mesh(groundGeo, toonMat(0xffffff, { map: grassTex }));
    ground.receiveShadow = true;
    this.root.add(ground);

    // Winding stepping-stone garden path (front gate z=11.5 to cottage door z=5.2)
    const stoneMat = toonMat(0xf3e8dc);
    const stoneBorderMat = toonMat(0xd8c3b0);
    const pathPoints = [
      [0, 5.6], [0.2, 6.6], [-0.1, 7.6], [-0.4, 8.6], [-0.2, 9.6], [0.1, 10.6],
      [-2.0, 6.8], [-3.8, 7.2], [-5.4, 7.5], // Branch to pond
      [2.0, 6.8], [3.8, 7.0]
    ];
    pathPoints.forEach(([px, pz], idx) => {
      const s = new THREE.Mesh(
        new THREE.CylinderGeometry(0.62 + (idx % 3) * 0.08, 0.68, 0.08, 12),
        idx % 2 === 0 ? stoneMat : stoneBorderMat
      );
      s.position.set(px, 0.03, pz);
      s.scale.set(1.15, 1, 0.88);
      s.rotation.y = idx * 0.5;
      s.receiveShadow = true;
      this.root.add(s);
    });

    // Cozy Pond with Animated Waterfall & Lily Pads (Front-Left Garden)
    const pondGroup = new THREE.Group();
    pondGroup.position.set(-7.5, 0.02, 8.2);
    this.root.add(pondGroup);

    const waterMat = toonMat(0x4dd4f7, { emissive: 0x106b87, emissiveIntensity: 0.25 });
    const pondWater = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.8, 0.06, 24), waterMat);
    pondWater.scale.set(1.25, 1, 0.95);
    pondGroup.add(pondWater);

    // Rocks & Waterfall on back edge of pond
    const rockMat = toonMat(0x9aa5b1);
    for (let r = 0; r < 14; r++) {
      const a = (r / 14) * Math.PI * 2;
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.45 + (r % 3) * 0.15, 1), rockMat);
      rock.position.set(Math.cos(a) * 3.3, 0.18, Math.sin(a) * 2.5);
      rock.scale.set(1.2, 0.8, 1.1);
      rock.castShadow = true;
      pondGroup.add(rock);
    }
    // Tall rock mound + waterfall
    const cliff = new THREE.Mesh(new THREE.DodecahedronGeometry(1.35, 1), rockMat);
    cliff.position.set(-1.6, 0.95, -1.8);
    cliff.castShadow = true;
    pondGroup.add(cliff);

    this.waterfallMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.68, 1.6, 12),
      toonMat(0x8ce9ff, { emissive: 0x3bc9db, emissiveIntensity: 0.35 })
    );
    this.waterfallMesh.position.set(-1.3, 0.8, -1.2);
    this.waterfallMesh.rotation.x = 0.35;
    pondGroup.add(this.waterfallMesh);

    // Lily pads + pink lotus flowers
    const padMat = toonMat(0x52b788);
    const lotusMat = toonMat(0xff85c0);
    [[-0.8, 0.4], [0.9, -0.3], [0.2, 1.0]].forEach(([lx, lz]) => {
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.04, 14, 1, false, 0, Math.PI * 1.85), padMat);
      pad.position.set(lx, 0.05, lz);
      const lotus = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), lotusMat);
      lotus.position.set(lx, 0.12, lz);
      pondGroup.add(pad, lotus);
    });

    // Instanced Trees & Swaying Flower Beds around the Diorama
    this.buildFoliageAndFlowers();
  }

  buildFoliageAndFlowers() {
    const trunkMat = toonMat(0x8d5b3c);
    const canopyMat1 = addWind(toonMat(0x52b788), 0.12, 1.8);
    const canopyMat2 = addWind(toonMat(0xff9ebb), 0.12, 1.8); // Cherry blossom trees!
    const bushMat = addWind(toonMat(0x40c057), 0.08, 2.2);

    const treeCoords = [
      [-14, 6], [-15, -2], [-14, -9], [-9, -11], [0, -12], [9, -11],
      [14, -9], [15, -2], [14, 6], [12, 11], [-12, 11],
      [-18, 12], [18, 12], [-19, -6], [19, -6], [0, -16], [-8, -16], [8, -16]
    ];

    treeCoords.forEach(([tx, tz], idx) => {
      const tg = new THREE.Group();
      tg.position.set(tx, 0, tz);
      const s = 0.85 + (idx % 4) * 0.18;
      tg.scale.setScalar(s);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.42, 1.8, 10), trunkMat);
      trunk.position.y = 0.9;
      trunk.castShadow = true;
      tg.add(trunk);

      const mat = idx % 3 === 0 ? canopyMat2 : canopyMat1;
      const p1 = new THREE.Mesh(new THREE.SphereGeometry(1.35, 14, 12), mat);
      p1.position.set(0, 2.3, 0);
      p1.castShadow = true;
      const p2 = new THREE.Mesh(new THREE.SphereGeometry(1.0, 12, 10), mat);
      p2.position.set(-0.7, 1.9, 0.4);
      const p3 = new THREE.Mesh(new THREE.SphereGeometry(0.95, 12, 10), mat);
      p3.position.set(0.75, 2.0, -0.3);
      tg.add(p1, p2, p3);

      this.root.add(tg);
    });

    // Hydrangea & Tulip Flower Beds flanking the cottage front
    const flowerColors = [0xff6b9d, 0xffd43b, 0xb197fc, 0x63e6be, 0xff8787];
    const flowerMats = flowerColors.map(c => addWind(toonMat(c), 0.06, 2.5));

    const bedCoords = [
      [-4.8, 5.8], [-3.4, 5.8], [3.4, 5.8], [4.8, 5.8],
      [-11.2, 3.5], [-11.2, 0.5], [11.2, 3.5], [11.2, 0.5],
      [4.5, 8.2], [6.5, 8.5], [8.2, 7.8]
    ];
    bedCoords.forEach(([bx, bz], idx) => {
      const bush = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 10), bushMat);
      bush.scale.set(1.2, 0.75, 1.1);
      bush.position.set(bx, 0.3, bz);
      bush.castShadow = true;
      this.root.add(bush);

      const fMat = flowerMats[idx % flowerMats.length];
      for (let f = 0; f < 5; f++) {
        const a = (f / 5) * Math.PI * 2;
        const blossom = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), fMat);
        blossom.position.set(bx + Math.cos(a) * 0.35, 0.58, bz + Math.sin(a) * 0.35);
        this.root.add(blossom);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. Two-Story Pastel Cottage Salon Building & Cutaway Roof
  // --------------------------------------------------------------------------
  buildCottageStructure() {
    const wallCream = toonMat(0xfff5eb);
    const wallTrim = toonMat(0xff9bb8);
    const woodMat = toonMat(0xa47148);
    const roofMat = toonMat(0xff7597);
    const glassMat = toonMat(0xfff3b0, { emissive: 0xffd43b, emissiveIntensity: 0.45 });

    // Outer cottage back wall (z = -7.0, x = -11..11)
    const kitchenYard = (u) => (u < 11.1 ? 'kitchen' : 'yard'); kitchenYard.id = 'ky';
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(22.2, 3.4, 0.35), wallMaterials(22.2, 3.4, 0.35, { pz: kitchenYard }, wallCream));
    backWall.position.set(0, 1.7, -7.0);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    this.root.add(backWall);

    // Left outer wall (x = -11.0, z = -7..5.3)
    const spaKitchen = (u) => (5.35 - u > -0.7 ? 'spa' : 'kitchen'); spaKitchen.id = 'sk';
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.4, 12.4), wallMaterials(0.35, 3.4, 12.4, { px: spaKitchen }, wallCream));
    leftWall.position.set(-11.0, 1.7, -0.85);
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    this.root.add(leftWall);

    // Right outer wall for Clinic (x = 11.0, z = -0.8..5.3)
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.4, 6.2), wallMaterials(0.35, 3.4, 6.2, { nx: 'vet' }, wallCream));
    rightWall.position.set(11.0, 1.7, 2.25);
    rightWall.castShadow = true;
    this.root.add(rightWall);

    // White picket fence enclosing the back-right Play Yard (x = 3.8..11, z = -7..-0.8)
    const fenceMat = toonMat(0xffffff);
    for (let z = -6.6; z <= -1.0; z += 0.65) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.1, 0.22), fenceMat);
      post.position.set(11.0, 0.55, z);
      post.castShadow = true;
      this.root.add(post);
    }

    // Interior partition walls with arched doorways so the avatar & pets can walk between all 5 rooms
    const dividerPositions = [
      // Between Spa (left) and Lobby (center), leaving doorway at z = 2.2
      { x: -3.7, z: 4.1, w: 0.28, d: 2.2 },
      { x: -3.7, z: 0.2, w: 0.28, d: 2.0 },
      // Between Lobby (center) and Clinic (right), leaving doorway at z = 2.2
      { x: 3.7, z: 4.1, w: 0.28, d: 2.2 },
      { x: 3.7, z: 0.2, w: 0.28, d: 2.0 },
      // Between Front rooms and Back rooms (z = -0.7), leaving doorways at x = -7.2, 0, 7.2
      { x: -9.6, z: -0.7, w: 2.8, d: 0.28 },
      { x: -3.7, z: -0.7, w: 3.6, d: 0.28 },
      { x: 3.7, z: -0.7, w: 3.6, d: 0.28 },
      { x: 9.6, z: -0.7, w: 2.8, d: 0.28 },
      // Between Kitchen (back-left) and Play Yard (back-right)
      { x: 0, z: -3.8, w: 0.28, d: 6.0 }
    ];
    dividerPositions.forEach(p => {
      let faces;
      if (p.w < 0.5 && p.x === -3.7) faces = { px: 'lobby', nx: 'spa' };
      else if (p.w < 0.5 && p.x === 3.7) faces = { nx: 'lobby', px: 'vet' };
      else if (p.w < 0.5) faces = { nx: 'kitchen', px: 'yard' };
      else faces = { pz: p.x < -6 ? 'spa' : (p.x > 6 ? 'vet' : 'lobby'), nz: p.x < 0 ? 'kitchen' : 'yard' };
      const w = new THREE.Mesh(new THREE.BoxGeometry(p.w, 2.5, p.d), wallMaterials(p.w, 2.5, p.d, faces, wallCream));
      w.position.set(p.x, 1.25, p.z);
      w.castShadow = true;
      w.receiveShadow = true;
      this.root.add(w);

      const trim = new THREE.Mesh(new THREE.BoxGeometry(p.w + 0.04, 0.16, p.d + 0.04), wallTrim);
      trim.position.set(p.x, 2.52, p.z);
      this.root.add(trim);
    });

    // Glowing round cottage windows on the back & side walls
    for (const wx of [-7.2, -2.2, 2.2, 7.2]) {
      const win = new THREE.Group();
      win.position.set(wx, 2.0, -6.8);
      const frame = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.09, 10, 20), woodMat);
      const pane = new THREE.Mesh(new THREE.CircleGeometry(0.62, 18), glassMat);
      win.add(frame, pane);
      this.root.add(win);
    }

    // Front Porch Archway, Striped Awning & "Cozy Critter Salon & Spa" Sign
    // Added to roofGroup so it smoothly fades when indoors for a clean dollhouse cutaway!
    const porchGroup = new THREE.Group();
    porchGroup.position.set(0, 0, 5.35);
    this.roofGroup.add(porchGroup);

    for (const side of [-1, 1]) {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 3.2, 12), wallTrim);
      pillar.position.set(side * 2.1, 1.6, 0);
      pillar.castShadow = true;
      porchGroup.add(pillar);
    }

    // Striped Café Awning over front entrance
    const stripeCount = 7;
    for (let i = 0; i < stripeCount; i++) {
      const sx = (i - (stripeCount - 1) / 2) * 0.65;
      const stripe = new THREE.Mesh(
        new THREE.BoxGeometry(0.66, 0.14, 1.25),
        toonMat(i % 2 === 0 ? 0xff6b9d : 0xfff5f8)
      );
      stripe.position.set(sx, 3.15, 0.45);
      stripe.rotation.x = 0.35;
      stripe.castShadow = true;
      porchGroup.add(stripe);
    }

    // 3D Signboard above the awning
    const signTex = canvasTexture((ctx, w, h) => {
      ctx.fillStyle = '#fff5fa';
      ctx.strokeStyle = '#ff6b9d';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.roundRect(10, 10, w - 20, h - 20, 28);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#d6336c';
      ctx.font = '900 42px "Fredoka", "Nunito", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Cozy Critter Salon & Spa', w / 2, h / 2);
    }, 512, 128);

    const signBoard = new THREE.Mesh(
      new RoundedBoxGeometry(4.6, 1.05, 0.22, 4, 0.08),
      toonMat(0xffffff, { map: signTex })
    );
    signBoard.position.set(0, 3.85, 0.2);
    signBoard.castShadow = true;
    porchGroup.add(signBoard);

    // Cutaway Second-Story Roof & Upper Gables (Fades softly when walking inside)
    const mainRoof = new THREE.Mesh(new THREE.ConeGeometry(13.5, 3.2, 4), roofMat);
    mainRoof.rotation.y = Math.PI / 4;
    mainRoof.scale.set(1.25, 1, 0.72);
    mainRoof.position.set(0, 4.9, -0.8);
    this.roofGroup.add(mainRoof);

    this.root.add(this.roofGroup);
    setObjectOpacity(this.roofGroup, this.roofOpacity);
  }

  // --------------------------------------------------------------------------
  // 4. Five Furnished 3D Rooms + Upgrade Tiers 1–3
  // --------------------------------------------------------------------------
  buildRoomInteriors() {
    // 4.1 LOBBY & SANCTUARY FLOOR (Center: x = -3.6..3.6, z = -0.6..5.3)
    const lobbyFloorTex = canvasTexture((ctx, w, h) => {
      ctx.fillStyle = '#ffeef5';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#ffd6e7';
      for (let y = 0; y < h; y += 64) {
        for (let x = 0; x < w; x += 64) {
          if (((x + y) / 64) % 2 === 0) ctx.fillRect(x, y, 64, 64);
        }
      }
    }, 256, 256);
    const lobbyFloor = new THREE.Mesh(
      new THREE.BoxGeometry(7.3, 0.08, 6.0),
      toonMat(0xffffff, { map: lobbyFloorTex })
    );
    lobbyFloor.position.set(0, 0.04, 2.3);
    lobbyFloor.receiveShadow = true;
    this.root.add(lobbyFloor);

    // Cuddle Cushion Stage in Lobby center (`x: 0, z: 1.2`)
    const cuddlePad = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.25, 0.28, 24), toonMat(0xff85c0));
    cuddlePad.position.set(0, 0.18, 1.2);
    cuddlePad.receiveShadow = true; addOutline(cuddlePad, 0.02);
    const cuddleInner = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.32, 24), toonMat(0xfff0f6));
    cuddleInner.position.set(0, 0.19, 1.2);
    this.root.add(cuddlePad, cuddleInner);

    // Critter Boutique Counter (`x: -2.3, z: 2.9`)
    const shopStand = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.72, 0.42, 20), toonMat(0xd08bff));
    shopStand.position.set(-2.3, 0.24, 2.9); addOutline(shopStand, 0.016);
    const shopTop = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.46, 20), toonMat(0xffe066));
    shopTop.position.set(-2.3, 0.24, 2.9);
    this.root.add(shopStand, shopTop);

    // Photo Booth Backdrop Arch (`x: 2.3, z: 2.85`)
    const photoPlatform = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.78, 0.34, 20), toonMat(0x74c0fc));
    photoPlatform.position.set(2.3, 0.2, 2.85);
    const photoArch = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.11, 10, 24, Math.PI), toonMat(0xffd43b));
    photoArch.position.set(2.3, 0.95, 2.35);
    this.root.add(photoPlatform, photoArch);

    // 4.2 SPA & GROOMING FLOOR & TUB (Left Front: x = -10.8..-3.8, z = -0.6..5.3)
    const spaFloorTex = canvasTexture((ctx, w, h) => {
      ctx.fillStyle = '#e3fafc';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#99e9f2';
      ctx.lineWidth = 4;
      for (let i = 0; i <= w; i += 42) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
      }
    }, 256, 256);
    const spaFloor = new THREE.Mesh(
      new THREE.BoxGeometry(7.1, 0.08, 6.0),
      toonMat(0xffffff, { map: spaFloorTex })
    );
    spaFloor.position.set(-7.3, 0.04, 2.3);
    spaFloor.receiveShadow = true;
    this.root.add(spaFloor);

    // Spa Bubble Tub (`x: -7.2, z: 1.65`)
    this.spaTubGroup = new THREE.Group();
    this.spaTubGroup.position.set(-7.2, 0, 1.65);
    this.root.add(this.spaTubGroup);

    // 4.3 VET CLINIC FLOOR & CHECKUP TABLE (Right Front: x = 3.8..10.8, z = -0.6..5.3)
    const vetFloor = new THREE.Mesh(
      new THREE.BoxGeometry(7.1, 0.08, 6.0),
      vetFloorMat()
    );
    vetFloor.position.set(7.3, 0.04, 2.3);
    vetFloor.receiveShadow = true;
    this.root.add(vetFloor);

    this.vetTableGroup = new THREE.Group();
    this.vetTableGroup.position.set(7.2, 0, 1.65);
    this.root.add(this.vetTableGroup);

    // 4.4 KITCHEN & CAFE FLOOR & TABLE (Back Left: x = -10.8..-0.2, z = -6.8..-0.8)
    const kitchenFloorTex = canvasTexture((ctx, w, h) => {
      ctx.fillStyle = '#fff9db';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#ffe8cc';
      for (let y = 0; y < h; y += 64) {
        for (let x = 0; x < w; x += 64) {
          if (((x + y) / 64) % 2 === 0) ctx.fillRect(x, y, 64, 64);
        }
      }
    }, 256, 256);
    const kitchenFloor = new THREE.Mesh(
      new THREE.BoxGeometry(10.6, 0.08, 6.0),
      toonMat(0xffffff, { map: kitchenFloorTex })
    );
    kitchenFloor.position.set(-5.5, 0.04, -3.8);
    kitchenFloor.receiveShadow = true;
    this.root.add(kitchenFloor);

    this.kitchenTableGroup = new THREE.Group();
    this.kitchenTableGroup.position.set(-7.2, 0, -4.1);
    this.root.add(this.kitchenTableGroup);

    // 4.5 PLAY YARD & CLOSET (Back Right: x = 0.2..10.8, z = -6.8..-0.8)
    const yardTurf = new THREE.Mesh(
      new THREE.BoxGeometry(10.6, 0.08, 6.0),
      yardTurfMat()
    );
    yardTurf.position.set(5.5, 0.04, -3.8);
    yardTurf.receiveShadow = true;
    this.root.add(yardTurf);

    // Play Yard Slide & Toy Chest (`x: 8.8, z: -5.2`)
    const slideSteps = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.4, 0.8), toonMat(0xffd43b));
    slideSteps.position.set(9.2, 0.7, -5.2);
    const slideChute = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.14, 2.1), toonMat(0xff6b9d));
    slideChute.position.set(8.2, 0.7, -5.2);
    slideChute.rotation.z = 0.55;
    slideChute.rotation.y = Math.PI / 2;
    this.root.add(slideSteps, slideChute);

    this.lobbyUpgradeGroup = new THREE.Group();
    this.root.add(this.lobbyUpgradeGroup);

    // Build initial Tier 1 furniture for all rooms
    this.applyRoomUpgrades({ spa: 1, clinic: 1, lobby: 1, kitchen: 1 });
  }


  // --------------------------------------------------------------------------
  // 4b. Furniture & props that make every room read as a real place
  // --------------------------------------------------------------------------
  buildRoomProps() {
    const g = new THREE.Group();
    g.name = 'RoomProps';
    this.root.add(g);
    const mats = new Map();
    const M = (c, o) => {
      const k = c + JSON.stringify(o || {});
      if (!mats.has(k)) mats.set(k, toonMat(c, o));
      return mats.get(k);
    };
    const box = (w, h, d, c, x, y, z, parent = g, o) => {
      const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, Math.min(0.035, w / 3, h / 3, d / 3)), M(c, o));
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      if (Math.min(w, h, d) > 0.12) addOutline(m, 0.012);
      parent.add(m);
      return m;
    };
    const cyl = (rt, rb, h, c, x, y, z, parent = g, seg = 18, o) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), M(c, o));
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      if (h > 0.12 && Math.max(rt, rb) > 0.1) addOutline(m, 0.012);
      parent.add(m);
      return m;
    };
    const ball = (r, c, x, y, z, parent = g, o) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 12), M(c, o));
      m.position.set(x, y, z);
      m.castShadow = true;
      parent.add(m);
      return m;
    };
    const glow = { emissive: 0xffd27a, emissiveIntensity: 0.9 };
    const plant = (x, z, s = 1, pot = 0xff9a6c) => {
      cyl(0.26 * s, 0.2 * s, 0.38 * s, pot, x, 0.19 * s, z);
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        const leaf = ball(0.2 * s, i % 2 ? 0x40c057 : 0x69db7c, x + Math.cos(a) * 0.14 * s, 0.62 * s + (i % 2) * 0.12 * s, z + Math.sin(a) * 0.14 * s);
        leaf.scale.set(0.8, 1.35, 0.8);
      }
    };
    const rug = (x, z, r, c1, c2) => {
      cyl(r, r, 0.03, c1, x, 0.1, z, g, 36).castShadow = false;
      cyl(r * 0.78, r * 0.78, 0.035, c2, x, 0.105, z, g, 36).castShadow = false;
      cyl(r * 0.5, r * 0.5, 0.04, c1, x, 0.11, z, g, 36).castShadow = false;
    };
    const frame = (x, y, z, rotY, w, h, c1, c2) => {
      const f = new THREE.Group();
      f.position.set(x, y, z);
      f.rotation.y = rotY;
      box(w, h, 0.07, c1, 0, 0, 0, f);
      box(w * 0.78, h * 0.78, 0.08, c2, 0, 0, 0.02, f);
      ball(Math.min(w, h) * 0.18, 0xff6b9d, 0, 0, 0.07, f);
      g.add(f);
    };

    // ===================== COTTAGE SHELL: wainscot + baseboards ================

    // ===================== LOBBY & CUDDLE SANCTUARY ============================
    rug(0, 1.5, 2.55, 0xff9ec5, 0xffe3ef);
    // sofa on the left
    box(1.7, 0.55, 0.85, 0xb197fc, -2.55, 0.37, 0.05);
    box(1.7, 0.7, 0.28, 0x9775fa, -2.55, 0.75, -0.3);
    box(0.28, 0.65, 0.85, 0x9775fa, -3.3, 0.5, 0.05);
    box(0.28, 0.65, 0.85, 0x9775fa, -1.8, 0.5, 0.05);
    box(0.42, 0.34, 0.2, 0xffd43b, -2.9, 0.78, -0.12);
    box(0.42, 0.34, 0.2, 0xff85c0, -2.15, 0.78, -0.12);
    // toy chest on the right
    box(1.15, 0.6, 0.7, 0xff6b6b, 2.7, 0.33, 0.1);
    box(1.2, 0.2, 0.75, 0xffd43b, 2.7, 0.72, 0.1);
    ball(0.17, 0x74c0fc, 2.35, 0.97, 0.1);
    box(0.22, 0.22, 0.22, 0x69db7c, 2.9, 0.94, 0.1);
    // bookshelf by the wall
    box(0.35, 1.9, 1.5, 0xc08552, -3.3, 0.95, 4.1);
    for (let i = 0; i < 3; i++) {
      box(0.36, 0.06, 1.46, 0xe0a46a, -3.28, 0.55 + i * 0.55, 4.1);
      box(0.2, 0.34, 0.16, [0xff6b9d, 0x74c0fc, 0xffd43b][i], -3.25, 0.76 + i * 0.55, 3.8);
      box(0.2, 0.3, 0.16, [0x69db7c, 0xb197fc, 0xff8787][i], -3.25, 0.74 + i * 0.55, 4.15);
      box(0.2, 0.36, 0.16, [0xffa94d, 0xff6b9d, 0x63e6be][i], -3.25, 0.77 + i * 0.55, 4.45);
    }
    plant(3.1, 4.8, 1.2);
    plant(-3.0, 4.9, 0.9, 0xb197fc);
    frame(-2.8, 1.9, -0.52, 0, 1.0, 0.7, 0xffd43b, 0xfff3bf);
    frame(2.8, 1.9, -0.52, 0, 1.0, 0.7, 0x74c0fc, 0xd0ebff);
    // fairy lights across the lobby
    for (let i = 0; i <= 14; i++) {
      const t = i / 14;
      const x = -3.5 + t * 7;
      const y = 2.35 - Math.sin(t * Math.PI) * 0.35;
      ball(0.07, [0xffd43b, 0xff85c0, 0x74c0fc, 0x69db7c][i % 4], x, y, 4.9, g, { emissive: [0xffd43b, 0xff85c0, 0x74c0fc, 0x69db7c][i % 4], emissiveIntensity: 0.8 }).castShadow = false;
    }

    // ===================== SPA ================================================
    box(2.3, 0.05, 1.4, 0xffffff, -7.2, 0.11, 3.1);
    box(2.1, 0.06, 1.25, 0x74d7ff, -7.2, 0.115, 3.1);
    // towel rack + towels
    box(0.12, 1.6, 0.12, 0xd0a06a, -10.6, 0.9, 0.7);
    box(0.12, 1.6, 0.12, 0xd0a06a, -10.6, 0.9, 2.3);
    box(0.1, 0.1, 1.7, 0xd0a06a, -10.6, 1.62, 1.5);
    box(0.25, 0.8, 0.5, 0xff85c0, -10.45, 1.2, 1.0);
    box(0.25, 0.8, 0.5, 0x74c0fc, -10.45, 1.2, 1.55);
    box(0.25, 0.8, 0.5, 0xffe066, -10.45, 1.2, 2.1);
    // shelf with bottles
    box(0.3, 0.07, 1.6, 0xd0a06a, -10.6, 1.55, 3.6);
    for (let i = 0; i < 4; i++) {
      cyl(0.09, 0.09, 0.34 + (i % 2) * 0.1, [0xff85c0, 0x74c0fc, 0xffd43b, 0xb197fc][i], -10.55, 1.78, 3.05 + i * 0.35, g, 12);
    }
    // stool + soap, rubber duck, plants, mirror
    cyl(0.28, 0.24, 0.42, 0xffa94d, -9.3, 0.21, 0.75);
    box(0.28, 0.1, 0.18, 0xffc2df, -9.3, 0.46, 0.75);
    const duck = new THREE.Group();
    ball(0.13, 0xffd43b, 0, 0, 0, duck).scale.set(1.2, 0.9, 1);
    ball(0.085, 0xffd43b, 0.1, 0.12, 0, duck);
    box(0.08, 0.04, 0.06, 0xff8c1a, 0.19, 0.11, 0, duck);
    duck.position.set(-6.15, 0.74, 1.35);
    g.add(duck);
    plant(-4.4, 4.9, 1.1);
    plant(-10.2, 4.8, 0.9, 0x63e6be);
    cyl(0.5, 0.5, 0.06, 0xfff3bf, -9.6, 1.7, -0.53, g, 24).rotation.x = Math.PI / 2;
    cyl(0.42, 0.42, 0.07, 0xc5f6fa, -9.6, 1.7, -0.51, g, 24, { emissive: 0x99e9f2, emissiveIntensity: 0.3 }).rotation.x = Math.PI / 2;
    // faucet
    cyl(0.07, 0.07, 0.6, 0xc0c8d0, -7.2, 0.95, 0.62, g, 10);
    box(0.1, 0.1, 0.5, 0xc0c8d0, -7.2, 1.25, 0.82);
    ball(0.12, 0xff6b6b, -7.2, 1.28, 0.58);

    // ===================== VET CLINIC =========================================
    rug(7.2, 3.3, 1.5, 0x8ce0c4, 0xe6fcf5);
    // supply cabinet with a red cross
    box(0.55, 1.9, 1.5, 0xffffff, 10.4, 0.95, 1.4);
    box(0.57, 0.06, 1.52, 0x63e6be, 10.4, 1.92, 1.4);
    box(0.06, 0.55, 0.16, 0xff4d4d, 10.1, 1.4, 1.4, g, { emissive: 0xaa0000, emissiveIntensity: 0.4 });
    box(0.06, 0.16, 0.55, 0xff4d4d, 10.1, 1.4, 1.4, g, { emissive: 0xaa0000, emissiveIntensity: 0.4 });
    box(0.06, 0.5, 0.5, 0xb2f2bb, 10.1, 0.55, 1.4);
    // eye chart poster
    box(0.06, 1.0, 0.7, 0xffffff, 10.75, 1.9, 3.5);
    for (let i = 0; i < 5; i++) box(0.07, 0.07, 0.12 + (4 - i) * 0.07, 0x4a2545, 10.7, 2.25 - i * 0.16, 3.5);
    // scale + stool + pet bed
    box(0.9, 0.12, 0.9, 0xffe066, 5.0, 0.15, 3.9);
    cyl(0.1, 0.1, 0.5, 0xc0c8d0, 5.0, 0.45, 3.65, g, 10);
    ball(0.2, 0xffffff, 5.0, 0.8, 3.65);
    cyl(0.3, 0.26, 0.5, 0x74c0fc, 9.4, 0.25, 4.3);
    cyl(0.9, 0.95, 0.28, 0xffadd2, 9.2, 0.18, 4.3, g, 24);
    cyl(0.68, 0.68, 0.3, 0xfff0f6, 9.2, 0.2, 4.3, g, 24);
    plant(4.4, 4.9, 1.1, 0x74c0fc);
    frame(9.6, 1.85, -0.52, 0, 1.3, 0.8, 0x63e6be, 0xffffff);
    box(0.14, 0.4, 0.05, 0xff4d4d, 9.6, 1.85, -0.44, g, { emissive: 0xaa0000, emissiveIntensity: 0.4 });
    box(0.4, 0.14, 0.05, 0xff4d4d, 9.6, 1.85, -0.44, g, { emissive: 0xaa0000, emissiveIntensity: 0.4 });

    // ===================== KITCHEN & CAFE =====================================
    rug(-7.2, -4.1, 2.1, 0xffc078, 0xfff0d9);
    // counter run along the back wall
    box(6.2, 0.95, 0.85, 0xf8f0e3, -6.6, 0.48, -6.35);
    box(6.3, 0.1, 0.95, 0xd0a06a, -6.6, 1.0, -6.35);
    for (let i = 0; i < 6; i++) box(0.9, 0.7, 0.03, 0xff9ec5, -9.2 + i * 1.05, 0.5, -5.9);
    // stove with burners + pot
    box(1.1, 0.12, 0.8, 0x343a40, -5.2, 1.1, -6.35);
    for (const [bx, bz] of [[-0.25, -0.2], [0.25, -0.2], [-0.25, 0.2], [0.25, 0.2]]) cyl(0.12, 0.12, 0.03, 0x868e96, -5.2 + bx, 1.17, -6.35 + bz, g, 14);
    cyl(0.22, 0.2, 0.28, 0xff6b6b, -5.45, 1.34, -6.55, g, 16);
    cyl(0.23, 0.23, 0.04, 0xfa5252, -5.45, 1.5, -6.55, g, 16);
    // fridge
    box(1.0, 2.2, 0.9, 0xc5f6fa, -10.1, 1.1, -6.25);
    box(0.05, 0.9, 0.08, 0x868e96, -9.6, 1.5, -5.78);
    box(0.05, 0.5, 0.08, 0x868e96, -9.6, 0.6, -5.78);
    // wall shelves with jars + hanging pots
    box(2.0, 0.07, 0.4, 0xd0a06a, -9.3, 2.0, -6.6);
    for (let i = 0; i < 4; i++) cyl(0.11, 0.11, 0.26, [0xff8787, 0xffd43b, 0x69db7c, 0xb197fc][i], -9.9 + i * 0.5, 2.17, -6.6, g, 12);
    for (let i = 0; i < 3; i++) {
      cyl(0.015, 0.015, 0.4, 0x868e96, -4.4 + i * 0.5, 2.6, -6.55, g, 6);
      cyl(0.17, 0.14, 0.2, [0xff6b6b, 0xffd43b, 0x74c0fc][i], -4.4 + i * 0.5, 2.35, -6.55, g, 14);
    }
    // stools around the table + pendant lamp
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      cyl(0.26, 0.2, 0.44, [0xff85c0, 0xffd43b, 0x74c0fc, 0x69db7c][i], -7.2 + Math.cos(a) * 1.9, 0.22, -4.1 + Math.sin(a) * 1.5, g, 16);
    }
    cyl(0.012, 0.012, 1.0, 0x4a2545, -7.2, 2.7, -4.1, g, 6);
    cyl(0.45, 0.12, 0.3, 0xffd43b, -7.2, 2.1, -4.1, g, 20, glow);
    frame(-3.7, 1.9, -0.88, Math.PI, 1.0, 0.7, 0xff9ec5, 0xfff0f6);
    plant(-1.0, -1.7, 1.1, 0xffa94d);

    // ===================== PLAY YARD ==========================================
    // picnic blanket (checkered)
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
      box(0.5, 0.03, 0.5, (i + j) % 2 ? 0xff8787 : 0xfff5f5, 2.4 + i * 0.5, 0.1, -2.2 + j * 0.5).castShadow = false;
    }
    // toy chest
    box(1.2, 0.7, 0.8, 0x4dabf7, 2.2, 0.38, -6.1);
    box(1.26, 0.22, 0.86, 0xffd43b, 2.2, 0.82, -6.1);
    ball(0.2, 0xff6b9d, 1.9, 1.08, -6.1);
    box(0.24, 0.24, 0.24, 0x69db7c, 2.45, 1.05, -6.1);
    // sandbox with bucket
    for (const [bx, bz, w, d] of [[4.5, -5.3, 1.8, 0.14], [4.5, -6.3, 1.8, 0.14], [3.6, -5.8, 0.14, 1.1], [5.4, -5.8, 0.14, 1.1]]) box(w, 0.3, d, 0xc08552, bx, 0.25, bz);
    box(1.7, 0.06, 1.0, 0xf6e0a4, 4.5, 0.15, -5.8).castShadow = false;
    cyl(0.14, 0.1, 0.22, 0xff6b9d, 4.2, 0.3, -5.7, g, 12);
    cyl(0.1, 0.1, 0.12, 0x74c0fc, 4.9, 0.24, -5.9, g, 12);
    // seesaw
    box(2.4, 0.1, 0.34, 0xffa94d, 6.0, 0.55, -6.2).rotation.z = 0.12;
    const tri = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.45, 3), M(0x74c0fc));
    tri.position.set(6.0, 0.3, -6.2);
    tri.rotation.y = Math.PI / 2;
    g.add(tri);
    // hedge along the back wall + flowers
    for (let i = 0; i < 8; i++) {
      const b = ball(0.5, i % 2 ? 0x40c057 : 0x51cf66, 1.2 + i * 1.2, 0.45, -6.7);
      b.scale.set(1.3, 0.9, 0.8);
      ball(0.1, [0xff6b9d, 0xffd43b, 0xffffff][i % 3], 1.2 + i * 1.2, 0.95, -6.35);
    }
    // bunting flags
    for (let i = 0; i <= 16; i++) {
      const t = i / 16;
      const fx = 0.5 + t * 10;
      const fy = 2.7 - Math.sin(t * Math.PI) * 0.45;
      const flag = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.34, 3), M([0xff6b9d, 0xffd43b, 0x74c0fc, 0x69db7c][i % 4]));
      flag.position.set(fx, fy, -6.3);
      flag.rotation.z = Math.PI;
      g.add(flag);
    }
    // beach balls
    ball(0.28, 0xff6b9d, 3.4, 0.38, -2.0);
    ball(0.28, 0xffd43b, 9.8, 0.38, -1.8);
    ball(0.22, 0x74c0fc, 1.4, 0.32, -4.6);
    // hopscotch squares
    for (let i = 0; i < 5; i++) box(0.5, 0.03, 0.5, 0xffffff, 10.0, 0.1, -2.4 - i * 0.55).castShadow = false;
    this.propsGroup = g;
  }

  /**
   * Rebuilds the room furniture & magical decor whenever a Room Upgrade (Tier 1-3) is purchased!
   */
  applyRoomUpgrades(upgrades = {}) {
    const spaTier = upgrades.spa || 1;
    const clinicTier = upgrades.clinic || 1;
    const lobbyTier = upgrades.lobby || 1;
    const kitchenTier = upgrades.kitchen || 1;

    // ---- SPA TUB UPGRADES ----
    this.spaTubGroup.clear();
    const tubCol = spaTier === 3 ? 0xe599f7 : (spaTier === 2 ? 0xd99b52 : 0xffffff);
    const rimCol = spaTier === 3 ? 0xffd43b : (spaTier === 2 ? 0xff922b : 0x74c0fc);
    const tubBase = new THREE.Mesh(new THREE.CylinderGeometry(1.18, 0.98, 0.56, 24), toonMat(tubCol));
    tubBase.position.y = 0.28;
    tubBase.castShadow = true; addOutline(tubBase, 0.02);
    const tubRim = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.11, 10, 24), toonMat(rimCol));
    tubRim.rotation.x = Math.PI / 2; addOutline(tubRim, 0.012);
    tubRim.position.y = 0.56;
    const bathWater = new THREE.Mesh(
      new THREE.CylinderGeometry(1.08, 1.08, 0.08, 24),
      toonMat(0x72efdd, { emissive: 0x2ec4b6, emissiveIntensity: 0.25 })
    );
    bathWater.position.y = 0.545;
    this.spaTubGroup.add(tubBase, tubRim, bathWater);

    if (spaTier >= 2) {
      // Floating yuzu tangerines & warm cedar lanterns
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + 0.5;
        const yuzu = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), toonMat(0xff922b));
        yuzu.position.set(Math.cos(a) * 0.78, 0.56, Math.sin(a) * 0.78);
        this.spaTubGroup.add(yuzu);
      }
    }
    if (spaTier >= 3) {
      // Mermaid pearl shell backdrop arch
      const shellArch = new THREE.Mesh(
        new THREE.SphereGeometry(1.35, 16, 12, 0, Math.PI),
        toonMat(0xffadd2, { side: THREE.DoubleSide })
      );
      shellArch.position.set(0, 0.55, -0.85);
      this.spaTubGroup.add(shellArch);
    }

    dressSpaTub(this.spaTubGroup, spaTier);

    // ---- VET CLINIC TABLE UPGRADES ----
    this.vetTableGroup.clear();
    const tableCol = clinicTier === 3 ? 0xffe066 : (clinicTier === 2 ? 0xffadd2 : 0x63e6be);
    const vetBase = new THREE.Mesh(new RoundedBoxGeometry(1.85, 0.68, 1.25, 4, 0.1), toonMat(0xffffff));
    vetBase.position.y = 0.34;
    vetBase.castShadow = true; addOutline(vetBase, 0.016);
    const vetPad = new THREE.Mesh(new RoundedBoxGeometry(1.92, 0.14, 1.32, 4, 0.06), toonMat(tableCol));
    vetPad.position.y = 0.68; addOutline(vetPad, 0.014);
    this.vetTableGroup.add(vetBase, vetPad);

    if (clinicTier >= 2) {
      const rainbowArch = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.12, 10, 24, Math.PI), toonMat(0xff85c0));
      rainbowArch.position.set(0, 0.7, -0.55);
      this.vetTableGroup.add(rainbowArch);
    }
    if (clinicTier >= 3) {
      const crown = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.4, 8), toonMat(0xffd43b));
      crown.position.set(0, 2.15, -0.55);
      this.vetTableGroup.add(crown);
    }

    // ---- KITCHEN TABLE UPGRADES ----
    this.kitchenTableGroup.clear();
    const kCol = kitchenTier === 3 ? 0x74c0fc : (kitchenTier === 2 ? 0xff85c0 : 0xf59f00);
    const kTable = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.05, 0.58, 24), toonMat(kCol));
    kTable.position.y = 0.29;
    kTable.castShadow = true; addOutline(kTable, 0.018);
    const kCloth = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.08, 24), ginghamMat());
    kCloth.position.y = 0.59; addOutline(kCloth, 0.014);
    this.kitchenTableGroup.add(kTable, kCloth);

    if (kitchenTier >= 2) {
      const tower = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.65, 12), toonMat(0xffadd2));
      tower.position.set(-0.85, 0.9, -0.4);
      this.kitchenTableGroup.add(tower);
    }
    if (kitchenTier >= 3) {
      const cloudArch = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.14, 10, 20, Math.PI), toonMat(0x99e9f2));
      cloudArch.position.set(0, 0.6, -0.6);
      this.kitchenTableGroup.add(cloudArch);
    }

    dynamicCircles.length = 0;
    if (lobbyTier >= 2) dynamicCircles.push([-1.6, 0.2, 0.28], [1.6, 0.2, 0.28]);
    // ---- LOBBY UPGRADES ----
    this.lobbyUpgradeGroup.clear();
    if (lobbyTier >= 2) {
      for (const side of [-1, 1]) {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 2.2, 12), toonMat(0xd08bff));
        pillar.position.set(side * 1.6, 1.1, 0.2);
        this.lobbyUpgradeGroup.add(pillar);
      }
    }
    if (lobbyTier >= 3) {
      const blossomCanopy = new THREE.Mesh(new THREE.SphereGeometry(0.95, 12, 10), toonMat(0xff9ebb));
      blossomCanopy.position.set(0, 2.6, 0.2);
      this.lobbyUpgradeGroup.add(blossomCanopy);
    }
  }

  // --------------------------------------------------------------------------
  // 5. Glowing 3D Station Pads & Floating Code-Drawn Badges
  // --------------------------------------------------------------------------
  buildStationMarkers() {
    const glowTex = glowTexture('#ffea79', 'rgba(255, 120, 180, 0)');

    for (const st of Object.values(STATIONS)) {
      const group = new THREE.Group();
      group.position.copy(st.pos);
      group.userData = { stationId: st.id };

      // Glowing floor ring
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.65, 0.85, 24),
        new THREE.MeshBasicMaterial({ color: 0xffd43b, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.09;
      group.add(ring);

      const disc = new THREE.Mesh(
        new THREE.PlaneGeometry(2.1, 2.1),
        new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false })
      );
      disc.rotation.x = -Math.PI / 2;
      disc.position.y = 0.085;
      group.add(disc);

      // Floating 3D icon badge above station
      const svg = iconSVG(st.icon, 96);
      const tex = svgTexture(svg, 96);
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: tex, transparent: true })
      );
      sprite.scale.set(0.78, 0.78, 1);
      sprite.position.set(0, 1.85, 0);
      group.add(sprite);

      this.stationMarkers.push({ station: st, group, ring, sprite });
      this.root.add(group);
    }
  }

  // --------------------------------------------------------------------------
  // 6. Ambient 3D Particles (Spa Bubbles & Garden Butterflies)
  // --------------------------------------------------------------------------
  buildAmbientParticles() {
    const bubbleMat = toonMat(0xe3fafc, { transparent: true, opacity: 0.72, emissive: 0x74c0fc, emissiveIntensity: 0.3 });
    for (let i = 0; i < 18; i++) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.06 + (i % 3) * 0.03, 8, 8), bubbleMat);
      b.position.set(
        -7.2 + (Math.random() - 0.5) * 3.5,
        0.5 + Math.random() * 2.2,
        1.65 + (Math.random() - 0.5) * 3.0
      );
      b.userData = { baseY: b.position.y, speed: 0.4 + Math.random() * 0.5, phase: Math.random() * 6 };
      b.visible = false; this.ambientBubbles.push(b);
      this.root.add(b);
    }

    // Fluttering garden butterflies
    const wingColors = [0xff85c0, 0xffd43b, 0x74c0fc];
    for (let i = 0; i < 8; i++) {
      const bf = new THREE.Group();
      const mat = toonMat(wingColors[i % wingColors.length], { side: THREE.DoubleSide });
      const wL = new THREE.Mesh(new THREE.CircleGeometry(0.11, 8), mat);
      wL.position.x = -0.08;
      const wR = new THREE.Mesh(new THREE.CircleGeometry(0.11, 8), mat);
      wR.position.x = 0.08;
      bf.add(wL, wR);
      bf.userData = {
        wL,
        wR,
        centerX: (i % 2 === 0 ? -5 : 5) + (Math.random() - 0.5) * 4,
        centerZ: 7 + (Math.random() - 0.5) * 3,
        phase: Math.random() * 10
      };
      this.butterflies.push(bf);
      this.root.add(bf);
    }
  }

  buildWalkTargetRing() {
    this.walkRing = new THREE.Mesh(
      new THREE.RingGeometry(0.25, 0.38, 24),
      new THREE.MeshBasicMaterial({ color: 0xff6b9d, side: THREE.DoubleSide, transparent: true, opacity: 0 })
    );
    this.walkRing.rotation.x = -Math.PI / 2;
    this.walkRing.position.y = 0.1;
    this.root.add(this.walkRing);
  }

  showWalkIndicator(x, z) {
    if (!this.walkRing) return;
    this.walkRing.position.set(x, 0.11, z);
    this.walkRingTimer = 0.7;
  }

  /**
   * Clamps any target coordinate `(x, z)` to the playable salon & garden courtyard.
   */
  clampPosition(x, z, fromX, fromZ) {
    const bx = Math.max(-10.2, Math.min(10.2, x));
    const bz = Math.max(-6.2, Math.min(10.8, z));
    if (fromX === undefined) return pushOut(bx, bz);
    return moveWithCollision(fromX, fromZ, bx, bz);
  }

  /**
   * Returns which room `(x, z)` is currently inside so the room banner & music mood update automatically!
   */
  getRoomAt(x, z) {
    if (z > 5.4) return 'exterior';
    if (z < -0.7) {
      return x < 0 ? 'kitchen' : 'yard';
    }
    if (x < -3.7) return 'spa';
    if (x > 3.7) return 'clinic';
    return 'lobby';
  }

  /**
   * Finds the nearest station within `maxDist` of `(x, z)` for the proximity glow button.
   */
  getNearestStation(x, z, maxDist = 2.6) {
    let best = null;
    let bestDist = maxDist;
    for (const st of Object.values(STATIONS)) {
      const d = Math.hypot(x - st.pos.x, z - st.pos.z);
      if (d < bestDist) {
        bestDist = d;
        best = st;
      }
    }
    return best;
  }

  update(dt, avatarPos, inActivityMode = false) {
    this.time += dt;
    if (this.decorTick) this.decorTick(this.time, inActivityMode);

    // Smooth cutaway roof fade: nearly transparent indoors, cozy solid outdoors
    const isIndoors = avatarPos && avatarPos.z < 5.3;
    const targetRoofAlpha = (isIndoors || inActivityMode) ? 0.0 : 0.92;
    if (Math.abs(targetRoofAlpha - this.roofOpacity) > 0.01) {
      this.roofOpacity += (targetRoofAlpha - this.roofOpacity) * Math.min(1, dt * 6);
      setObjectOpacity(this.roofGroup, this.roofOpacity);
    }

    // Hide world station badges during close-up activity scenes so they don't occlude the pet
    for (const m of this.stationMarkers) {
      m.group.visible = !inActivityMode;
      if (!inActivityMode) {
        const pulse = 1 + Math.sin(this.time * 3.5) * 0.08;
        m.ring.scale.set(pulse, pulse, 1);
        m.sprite.position.y = 1.82 + Math.sin(this.time * 3.0 + m.station.pos.x) * 0.09;
      }
    }

    // Waterfall shimmer
    if (this.waterfallMesh) {
      this.waterfallMesh.scale.x = 1 + Math.sin(this.time * 8) * 0.05;
    }

    // Floating Spa bubbles
    for (const b of this.ambientBubbles) {
      b.position.y += b.userData.speed * dt;
      b.position.x += Math.sin(this.time * 2 + b.userData.phase) * 0.004;
      if (b.position.y > 3.1) b.position.y = 0.55;
    }

    // Fluttering garden butterflies
    for (const bf of this.butterflies) {
      const u = bf.userData;
      const t = this.time * 1.4 + u.phase;
      bf.position.set(
        u.centerX + Math.cos(t) * 1.8,
        1.1 + Math.sin(t * 2.3) * 0.35,
        u.centerZ + Math.sin(t * 0.8) * 1.4
      );
      bf.rotation.y = -t;
      const flap = Math.sin(this.time * 18 + u.phase) * 0.65;
      u.wL.rotation.y = flap;
      u.wR.rotation.y = -flap;
    }

    // Walk target ring pulse
    if (this.walkRingTimer > 0) {
      this.walkRingTimer -= dt;
      const p = 1 - this.walkRingTimer / 0.7;
      this.walkRing.scale.setScalar(0.6 + p * 1.1);
      this.walkRing.material.opacity = (1 - p) * 0.85;
    } else if (this.walkRing) {
      this.walkRing.material.opacity = 0;
    }
  }
}
