// ============================================================================
// Cozy Critter Salon & Spa - Main 3D Engine & Game Orchestrator (main.js)
// ============================================================================
import * as THREE from 'three';

import { tickWind, addContactShadow } from './gfx.js';
import { SaveManager } from './save.js';
import { SoundEngine } from './audio.js';
import { VoiceEngine } from './voice.js';
import { StylistAvatar } from './characters.js';
import { CritterPet } from './pets.js';
import { SalonWorld, STATIONS } from './world.js';
import { SpaActivity } from './activities/spa.js';
import { VetActivity } from './activities/vet.js';
import { KitchenActivity } from './activities/kitchen.js';
import { LobbyActivity } from './activities/lobby.js';
import { YardActivity } from './activities/yard.js';
import { UIManager } from './ui.js';
import { initPolish } from './polish.js';
import { initSpark } from './spark.js';
import { initSpark2 } from './spark2.js';
import { initThumbs } from './thumbs.js';

export class CozyCritterApp {
  constructor() {
    this.save = new SaveManager();
    this.sound = new SoundEngine(this.save);
    this.voice = new VoiceEngine(this.save, this.sound);

    this.mode = 'title'; // 'title' | 'world' | 'avatar_preview' | 'activity' | 'shop' | 'photobooth'
    this.activeActivity = null;
    this.activeStation = null;
    this.isPointerDown = false;
    this.joystickVec = { x: 0, y: 0 };
    this.clock = { _t: performance.now(), elapsedTime: 0, getDelta() { const n = performance.now(); const d = (n - this._t) / 1000; this._t = n; this.elapsedTime += d; return d; } };
    this.titleAngle = 0;

    this.initThree();
    this.world = new SalonWorld(this.scene);
    this.world.applyRoomUpgrades(this.save.state.roomUpgrades);

    this.initCharactersAndPets();
    this.initActivities();
    this.ui = new UIManager(this);
    this.ui.syncHUD();
    initPolish(this);
    initSpark(this); initSpark2(this); initThumbs(this);

    this.bindCanvasInput();
    this.startNeedTicker();

    // Register service worker for offline PWA support
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  // --------------------------------------------------------------------------
  // 1. Three.js Renderer, Warm Sunset Lighting, Shadows, Fog & Bloom
  // --------------------------------------------------------------------------
  initThree() {
    this.canvas = document.getElementById('webgl-canvas');
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.gfxTier = 0;
    this.maxPR = Math.min(window.devicePixelRatio || 1, 1.5);
    this.renderer.setPixelRatio(this.maxPR);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.92;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf7d9b0);
    this.scene.fog = new THREE.FogExp2(0xf6d7b8, 0.0018);

    this.camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      160
    );
    this.camCurrentPos = new THREE.Vector3(0, 8.5, 16.5);
    this.camCurrentLook = new THREE.Vector3(0, 1.2, 2.0);
    this.viewShift = { x: 0, y: 0 };
    this.camTargetPos = this.camCurrentPos.clone();
    this.camTargetLook = this.camCurrentLook.clone();
    this.camera.position.copy(this.camCurrentPos);
    this.camera.lookAt(this.camCurrentLook);

    // Camera fill light to keep faces brightly and flatteringly lit in all close-ups
    this.camFillLight = new THREE.DirectionalLight(0xfffaed, 0.22);
    this.camFillLight.position.set(0, 0.4, 2);
    this.camera.add(this.camFillLight);
    this.scene.add(this.camera);

    // Warm Golden-Hour Hemisphere + Sun + Cozy Interior Fill Lights
    const hemi = new THREE.HemisphereLight(0xfff1dc, 0x9bd89f, 0.62);
    this.scene.add(hemi);

    this.sunLight = new THREE.DirectionalLight(0xffe6bd, 2.2);
    this.sunLight.position.set(-9, 24, 18);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.camera.near = 2;
    this.sunLight.shadow.camera.far = 55;
    const d = 16;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    // Warm interior room glow lights
    this.pointLights = [];
    const roomLightCoords = [
      [0, 3.2, 2.0, 0xfff0f6],
      [-7.2, 3.2, 2.0, 0xe3fafc],
      [7.2, 3.2, 2.0, 0xe6fcf5],
      [-7.2, 3.2, -3.6, 0xfff9db]
    ];
    roomLightCoords.forEach(([x, y, z, col]) => {
      const pl = new THREE.PointLight(col, 0.55, 10, 1.2);
      pl.position.set(x, y, z);
      this.scene.add(pl);
      this.pointLights.push(pl);
    });

    // No post-processing (bloom/composer removed for speed): straight render, adaptive pixel ratio.

    this.applyGraphicsSettings();

    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  applyGraphicsSettings() {
    const low = Boolean(this.save.state.settings.lowGraphics);
    this.applyTier(low ? Math.max(2, this.gfxTier) : this.gfxTier);
  }

  /** Quality tiers: 0 = pr<=1.5 + shadows, 1 = pr 1, 2 = no shadows/point lights, 3 = pr 0.75. */
  applyTier(t) {
    this.gfxTier = t;
    const pr = t >= 3 ? 0.75 : t >= 1 ? Math.min(1, this.maxPR) : this.maxPR;
    this.renderer.setPixelRatio(pr);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const wasShadow = this.renderer.shadowMap.enabled;
    this.renderer.shadowMap.enabled = t < 2;
    if (this.sunLight) this.sunLight.castShadow = t < 2;
    if (this.pointLights) this.pointLights.forEach(p => { p.visible = t < 2; });
    if (wasShadow !== this.renderer.shadowMap.enabled || t === 2) this.scene.traverse(o => { if (o.material) [].concat(o.material).forEach(m => { m.needsUpdate = true; }); });
  }

  /** Adaptive quality: if the average frame time stays over ~20ms, drop a tier (never climbs back). */
  monitorPerf(rawDt) {
    if (document.hidden) { this._pf = 0; this._pn = 0; return; }
    this._pf = (this._pf || 0) + rawDt; this._pn = (this._pn || 0) + 1;
    if (this._pn >= 40 || this._pf >= 1.2) {
      const avg = this._pf / this._pn; this._pf = 0; this._pn = 0;
      this._pw = (this._pw || 0) + 1;
      if (this._pw < 2) return; // ignore the first window (shader compile hitch)
      if (avg > 0.02 && this.gfxTier < 3) this.applyTier(Math.min(3, this.gfxTier + (avg > 0.07 ? 2 : 1)));
    }
  }

  // --------------------------------------------------------------------------
  // 2. 3D Avatar & 3 Articulated Pets Setup
  // --------------------------------------------------------------------------
  initCharactersAndPets() {
    const savedPos = this.save.state.playerPosition || { x: 0, z: 3.5 };
    this.avatar = new StylistAvatar(this.save.state.avatar);
    this.avatar.root.position.set(savedPos.x || 0, 0, savedPos.z || 3.5);
    this.scene.add(this.avatar.root);
    addContactShadow(this.avatar.root, 0.36, 0.3);

    this.pets = {};
    const homeCoords = {
      capybara: new THREE.Vector3(-1.4, 0, 2.2),
      axolotl:  new THREE.Vector3(1.4, 0, 2.2),
      dikdik:   new THREE.Vector3(0, 0, 4.4)
    };

    for (const petId of ['capybara', 'axolotl', 'dikdik']) {
      const petState = this.save.state.pets[petId];
      const pet = new CritterPet(petId, petState);
      pet.homePos.copy(homeCoords[petId]);
      pet.root.position.copy(homeCoords[petId]);
      this.pets[petId] = pet;
      this.scene.add(pet.root);
      addContactShadow(pet.root, petId === 'capybara' ? 0.62 : petId === 'axolotl' ? 0.55 : 0.42, petId === 'capybara' ? 0.5 : 0.46);
    }
    this.updatePetThoughtBubbles();
  }

  rebuildAvatar() {
    this.avatar.buildRig(this.save.state.avatar);
  }

  updatePetThoughtBubbles() {
    for (const petId of ['capybara', 'axolotl', 'dikdik']) {
      const pet = this.pets[petId];
      if (!pet) continue;
      if (this.mode !== 'world') {
        pet.setThoughtBubble(null);
      } else {
        const need = this.save.getPetPrimaryNeed(petId);
        pet.setThoughtBubble(need ? need.icon : null);
      }
    }
  }

  initActivities() {
    this.activities = {
      spa: new SpaActivity(this),
      vet: new VetActivity(this),
      kitchen: new KitchenActivity(this),
      lobby: new LobbyActivity(this),
      yard: new YardActivity(this)
    };
  }

  // --------------------------------------------------------------------------
  // 3. Game Flow: Title -> Avatar Creator -> Adoption -> World -> Activities
  // --------------------------------------------------------------------------
  onGameStart() {
    this.ui.titleScreen.classList.add('hidden');
    this.ui.hudTop.classList.remove('hidden');
    this.ui.speechBar.classList.remove('hidden');
    this.ui.worldHudBottom.classList.remove('hidden');
    if (!this.save.state.avatarCreated) {
      this.ui.openAvatarModal();
    } else {
      this.mode = 'world';
      this.checkInitialPetAdoption();
    }
  }

  checkInitialPetAdoption() {
    this.mode = 'world';
    const capy = this.save.state.pets.capybara;
    if (!capy.adopted) {
      this.ui.openPetAdoptionModal('capybara', false);
    } else {
      this.ui.setSpeechPrompt(
        'enter_salon_first',
        'Welcome to your Cozy Critter Salon! Tap anywhere to walk around, or tap a glowing station!',
        true
      );
    }
  }

  setAvatarPreviewCamera(enabled) {
    if (enabled) {
      this.mode = 'avatar_preview';
      this.avatar.hasTarget = false;
      this.avatar.root.position.set(0, 0, 3.2);
      this.avatar.root.rotation.y = 0.25;
      this.avatar.root.visible = true;
      for (const p of Object.values(this.pets)) p.root.visible = false;
      // Frame avatar on the left half of the screen so the right-side creator card never covers her
      // (the view-shift in the render loop moves her into the free left side of the screen)
      this.camTargetPos.set(0.0, 1.55, 6.15);
      this.camTargetLook.set(0.0, 1.0, 3.2);
    } else {
      this.mode = 'world';
      for (const p of Object.values(this.pets)) p.root.visible = true;
    }
  }

  selectPet(petId) {
    this.save.setActivePet(petId);
    this.ui.syncHUD();
    const petState = this.save.state.pets[petId];
    const pet = this.pets[petId];
    if (pet) {
      pet.triggerHop();
      pet.triggerHeartEyes(1.5);
    }
    if (!petState.adopted) {
      this.ui.openPetAdoptionModal(petId, false);
    } else {
      const need = this.save.getPetPrimaryNeed(petId);
      if (need) {
        this.ui.setSpeechPrompt(need.voiceId, need.text, true);
      }
    }

    // If we are inside an activity/shop/photobooth, swap the pet on the station stage!
    if (this.activeStation) {
      this.positionPetAtStation(this.activeStation);
      if (this.activeActivity) {
        this.activeActivity.stop();
        this.activeActivity.start(this.pets[petId], petState);
      }
    }
  }

  toggleCallPets() {
    const anyFollowing = Object.values(this.pets).some(p => p.followingPlayer);
    const nextState = !anyFollowing;
    for (const pet of Object.values(this.pets)) {
      pet.followingPlayer = nextState;
      pet.triggerHop();
    }
    if (nextState) {
      this.ui.setSpeechPrompt('call_pets', 'Here critters! Come follow me!', true);
    }
  }

  walkToOrEnterStation(stationId) {
    const st = STATIONS[stationId];
    if (!st) return;
    if (this.mode !== 'world') {
      this.exitActivity();
    }
    // Walk avatar near station and enter it!
    this.avatar.root.position.set(st.pos.x, 0, st.pos.z + 1.1);
    this.enterStation(stationId);
  }

  enterStation(stationId) {
    const st = STATIONS[stationId];
    if (!st) return;

    if (this.activeActivity) {
      this.activeActivity.stop();
      this.activeActivity = null;
    }

    this.activeStation = st;
    this.ui.showStationProximity(null);
    this.ui.worldHudBottom.classList.add('hidden');
    this.ui.avatarModal.classList.add('hidden');
    this.ui.clipboardModal.classList.add('hidden');
    this.ui.settingsModal.classList.add('hidden');
    if (stationId !== 'shop') this.ui.shopModal.classList.add('hidden');
    if (stationId !== 'photobooth') this.ui.photoModal.classList.add('hidden');
    if (stationId === 'shop' || stationId === 'photobooth') {
      this.ui.activityHud.classList.add('hidden');
    }
    // One Back button, always top-left (the shop has its own Back inside its panel)
    this.ui.btnBackSalon?.classList.toggle('hidden', stationId === 'shop');
    this.positionPetAtStation(st);
    // The stylist steps out of frame so she never blocks the pet or the tub. Photo booth keeps her in the shot.
    this.avatar.root.visible = stationId === 'photobooth';

    this.camTargetPos.copy(st.camPos);
    this.camTargetLook.copy(st.camLook);
    this.sound.setRoomMood(st.room);
    this.ui.updateRoomBanner(st.room);

    const activePetId = this.save.state.activePet;
    const pet = this.pets[activePetId];
    const petState = this.save.state.pets[activePetId];

    if (stationId === 'shop') {
      this.mode = 'shop';
      // Offset camera slightly right so pet is framed on the left while Shop panel is on the right
      this.camTargetPos.set(st.petPos.x, st.petPos.y + 1.1, st.petPos.z + 2.6);
    this.camTargetLook.set(st.petPos.x, st.petPos.y + 0.62, st.petPos.z);
      this.ui.openShopModal();
    } else if (stationId === 'photobooth') {
      this.mode = 'photobooth';
      // Place avatar right next to the pet for adorable duo photos!
      this.avatar.hasTarget = false;
      this.avatar.root.position.set(st.petPos.x - 0.65, 0, st.petPos.z - 0.1);
      this.avatar.root.rotation.y = 0.2;
      this.ui.openPhotoBoothModal();
    } else if (this.activities[stationId]) {
      this.mode = 'activity';
      this.ui.activityHud.classList.remove('hidden');
      this.activeActivity = this.activities[stationId];
      this.activeActivity.start(pet, petState);
    }

    this.updatePetThoughtBubbles();
  }

  positionPetAtStation(st) {
    const activePetId = this.save.state.activePet;
    // Reset all pets to their home spots first
    for (const [id, p] of Object.entries(this.pets)) {
      p.hasTarget = false;
      p.isWalking = false;
      p.root.visible = id === activePetId; // other critters step out of the shot
      if (id === activePetId) {
        p.root.position.copy(st.petPos);
        p.root.rotation.y = st.petRotY || 0;
      } else {
        p.root.position.copy(p.homePos);
      }
    }
  }

  exitActivity() {
    if (this.activeActivity) {
      this.activeActivity.stop();
      this.activeActivity = null;
    }
    this.activeStation = null;
    this.mode = 'world';
    this.avatar.root.visible = true;
    for (const p of Object.values(this.pets)) p.root.visible = true;

    this.ui.activityHud.classList.add('hidden');
    this.ui.btnBackSalon?.classList.add('hidden');
    this.ui.avatarModal.classList.add('hidden');
    this.ui.shopModal.classList.add('hidden');
    this.ui.photoModal.classList.add('hidden');
    this.ui.clipboardModal.classList.add('hidden');
    this.ui.worldHudBottom.classList.remove('hidden');

    // Return pets to ground level
    for (const p of Object.values(this.pets)) {
      p.root.position.y = 0;
    }
    this.updatePetThoughtBubbles();
    this.ui.syncHUD();
  }

  completeRoutine(voiceId, message, coins, stars) {
    this.save.addReward(coins, stars);
    this.sound.playFanfare();
    this.ui.syncHUD();
    this.ui.setSpeechPrompt(voiceId, message, true);
    this.ui.showRewardModal(message, coins, stars);
  }

  // --------------------------------------------------------------------------
  // 4. Photo Booth Snapshot Compositor (WebGL Canvas + Decorative Frame)
  // --------------------------------------------------------------------------
  snapPhoto(frameStyle = 'hearts') {
    this.sound.playShutter();
    this.voice.speak('photobooth_snap', 'Cheese! What a superstar picture!');

    // Render one fresh frame immediately so preserveDrawingBuffer has the latest pose
    this.renderFrame();

    const outCanvas = document.createElement('canvas');
    outCanvas.width = 640;
    outCanvas.height = 420;
    const ctx = outCanvas.getContext('2d');

    // Crop exactly what is inside the on-screen frame (so the saved photo matches the viewfinder)
    const frameEl = document.getElementById('photo-frame-overlay');
    const cv = this.canvas;
    const sx = cv.width / (cv.clientWidth || cv.width);
    const sy = cv.height / (cv.clientHeight || cv.height);
    if (frameEl) {
      const r = frameEl.getBoundingClientRect();
      const inset = 14;
      const cx = (r.left + inset) * sx;
      const cy = (r.top + inset) * sy;
      const cw = (r.width - inset * 2) * sx;
      const ch = (r.height - inset * 2) * sy;
      outCanvas.height = Math.max(200, Math.round(outCanvas.width * (ch / cw)));
      ctx.drawImage(cv, cx, cy, cw, ch, 0, 0, outCanvas.width, outCanvas.height);
    } else {
      ctx.drawImage(cv, 0, 0, outCanvas.width, outCanvas.height);
    }

    // Decorative frame border
    const borderColors = {
      hearts: '#ff6b9d',
      gold: '#ffd43b',
      ocean: '#4dabf7',
      flowers: '#69db7c'
    };
    ctx.strokeStyle = borderColors[frameStyle] || '#ff6b9d';
    ctx.lineWidth = 22;
    ctx.strokeRect(11, 11, outCanvas.width - 22, outCanvas.height - 22);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px "Fredoka", sans-serif';
    const petName = this.save.getActivePet().customName;
    ctx.fillText(`â˜… ${this.save.state.avatar.name} & ${petName} â˜…`, 28, outCanvas.height - 26);

    const dataUrl = outCanvas.toDataURL('image/jpeg', 0.86);
    this.save.state.photoAlbum.unshift({
      id: Date.now(),
      dataUrl,
      caption: `${this.save.state.avatar.name} & ${petName}`
    });
    this.save.state.photoAlbum = this.save.state.photoAlbum.slice(0, 16);
    this.save.addReward(15, 0);
    this.ui.syncHUD();
    this.ui.photoFlash();
  }

  // --------------------------------------------------------------------------
  // 5. Unified PointerEvents Input (World Tap-to-Walk & 3D Activity Dragging)
  // --------------------------------------------------------------------------
  bindCanvasInput() {
    this.raycaster = new THREE.Raycaster();
    this.pointerNDC = new THREE.Vector2();
    this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this.activityPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    const updateNDC = e => {
      const rect = this.canvas.getBoundingClientRect();
      this.pointerNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointerNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.pointerNDC, this.camera);
    };

    this.canvas.addEventListener('pointerdown', e => {
      this.sound.ensureContext();
      this.isPointerDown = true;
      updateNDC(e);

      if (this.mode === 'world') {
        // Check if she tapped directly on a 3D Pet
        for (const [petId, pet] of Object.entries(this.pets)) {
          const hits = this.raycaster.intersectObject(pet.root, true);
          if (hits.length > 0) {
            this.sound.playHeartChime();
            this.selectPet(petId);
            return;
          }
        }

        // Intersect ground plane to walk there
        const hitPoint = new THREE.Vector3();
        if (this.raycaster.ray.intersectPlane(this.groundPlane, hitPoint)) {
          const clamped = this.world.clampPosition(hitPoint.x, hitPoint.z);
          this.avatar.setTarget(clamped.x, clamped.z);
          this.world.showWalkIndicator(clamped.x, clamped.z);
          this.save.state.playerPosition = {
            room: this.world.getRoomAt(clamped.x, clamped.z),
            x: clamped.x,
            z: clamped.z
          };
        }
      } else if (this.mode === 'activity' && this.activeActivity) {
        this.handleActivityPointer();
      }
    });

    this.canvas.addEventListener('pointermove', e => {
      const hover = this.mode === 'activity' && this.activeActivity?.wantsHover?.();
      if (!this.isPointerDown && !hover) return;
      updateNDC(e);
      if (this.mode === 'activity' && this.activeActivity) {
        this.handleActivityPointer();
      }
    });

    const endPointer = () => {
      this.isPointerDown = false;
      if (this.activeActivity) {
        this.activeActivity.onPointerUp();
      }
    };
    window.addEventListener('pointerup', endPointer);
    window.addEventListener('pointercancel', endPointer);
  }

  handleActivityPointer() {
    if (!this.activeStation || !this.activeActivity) return;
    const petPos = this.pets[this.save.state.activePet].root.position;
    // Set plane facing camera passing through the pet's front
    this.activityPlane.setFromNormalAndCoplanarPoint(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(petPos.x, petPos.y + 0.65, petPos.z + 0.35)
    );
    const hitPoint = new THREE.Vector3();
    if (this.raycaster.ray.intersectPlane(this.activityPlane, hitPoint)) {
      const dist = Math.hypot(hitPoint.x - petPos.x, hitPoint.y - (petPos.y + 0.65));
      const isNearPet = dist < 1.0; // Generous kid-friendly drop/scrub hitbox!
      // Mouth position on the same plane (for feeding / toothbrushing)
      const mouthPos = this._mouthTmp || (this._mouthTmp = new THREE.Vector3());
      const pet = this.pets[this.save.state.activePet];
      pet.mouthAnchor.getWorldPosition(mouthPos);
      const mouthDist = Math.hypot(hitPoint.x - mouthPos.x, hitPoint.y - mouthPos.y);
      this.activeActivity.onPointerMove(hitPoint, isNearPet, { mouthDist, nearMouth: mouthDist < 0.7, mouthPos });
    }
  }

  /** World-space point where the ray through NDC (x, y) meets the plane z = planeZ. */
  ndcToPlaneZ(ndcX, ndcY, planeZ, out = new THREE.Vector3()) {
    const ray = new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2(ndcX, ndcY), this.camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -planeZ);
    return ray.ray.intersectPlane(plane, out) || out.set(0, 1, planeZ);
  }

  /** Screen pixel position of a world point (for floating "+1" popups). */
  worldToScreen(v3) {
    const p = v3.clone().project(this.camera);
    return { x: (p.x * 0.5 + 0.5) * window.innerWidth, y: (-p.y * 0.5 + 0.5) * window.innerHeight };
  }

  /** Floating text pop (DOM) at a world position, e.g. "+1" or "Yum!". */
  popText(v3, text, color = '#ff4d8d') {
    const el = document.createElement('div');
    el.className = 'float-pop';
    el.textContent = text;
    el.style.color = color;
    const s = this.worldToScreen(v3);
    el.style.left = `${s.x}px`;
    el.style.top = `${s.y}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }

  setJoystickInput(vx, vy) {
    this.joystickVec.x = vx;
    this.joystickVec.y = vy;
  }

  startNeedTicker() {
    setInterval(() => {
      if (this.mode === 'world') {
        this.save.tickNeeds();
        this.updatePetThoughtBubbles();
        this.ui.syncHUD();
      }
    }, 45000);
  }

  // --------------------------------------------------------------------------
  // 6. Main Animation & Render Loop
  // --------------------------------------------------------------------------
  animate() {
    requestAnimationFrame(this.animate);
    const rawDt = Math.min(0.1, this.clock.getDelta());
    this.monitorPerf(rawDt);
    const dt = Math.min(0.05, rawDt);
    const elapsed = this.clock.elapsedTime;

    tickWind(elapsed);

    // Joystick movement override in world mode
    if (this.mode === 'world' && (Math.abs(this.joystickVec.x) > 0.08 || Math.abs(this.joystickVec.y) > 0.08)) {
      const tx = this.avatar.root.position.x + this.joystickVec.x * 1.2;
      const tz = this.avatar.root.position.z + this.joystickVec.y * 1.2;
      const clamped = this.world.clampPosition(tx, tz);
      this.avatar.setTarget(clamped.x, clamped.z);
    }

    // Update Avatar
    this.avatar.update(
      dt,
      this.mode === 'world' ? this.sound : null,
      (x, z) => this.world.clampPosition(x, z)
    );

    // Update Pets
    for (const pet of Object.values(this.pets)) {
      pet.update(
        dt,
        this.mode === 'world' ? this.avatar.root.position : null,
        this.mode === 'world' ? (x, z) => this.world.clampPosition(x, z) : null
      );
    }

    // Update World & Room Detection
    const inCloseUp = this.mode === 'activity' || this.mode === 'shop' || this.mode === 'photobooth';
    this.world.update(dt, this.avatar.root.position, inCloseUp);

    if (this.mode === 'world') {
      const pos = this.avatar.root.position;
      const room = this.world.getRoomAt(pos.x, pos.z);
      this.sound.setRoomMood(room);
      this.ui.updateRoomBanner(room);

      const nearSt = this.world.getNearestStation(pos.x, pos.z, 2.35);
      this.ui.showStationProximity(nearSt);

      // Smooth Isometric Follow Camera
      const isIndoors = pos.z < 5.3;
      this.camTargetPos.set(
        pos.x * 0.82,
        isIndoors ? 6.2 : 7.4,
        pos.z + (isIndoors ? 6.8 : 8.2)
      );
      this.camTargetLook.set(pos.x * 0.88, 0.85, pos.z - 0.4);
    } else if (this.mode === 'title') {
      this.titleAngle += dt * 0.18;
      this.camTargetPos.set(
        Math.sin(this.titleAngle) * 3.2,
        4.1,
        10.6 + Math.cos(this.titleAngle) * 0.8
      );
      this.camTargetLook.set(0, 2.1, 3.0);
    } else if (this.mode === 'avatar_preview') {
      this.avatar.root.rotation.y = Math.sin(elapsed * 0.9) * 0.35;
    } else if (this.mode === 'shop') {
      const activePet = this.pets[this.save.state.activePet];
      if (activePet) {
        activePet.root.rotation.y = Math.sin(elapsed * 1.1) * 0.45;
      }
    }

    if (this.activeActivity) {
      this.activeActivity.update(dt);
    }

    // Smooth camera damping
    // Frame-rate independent: close-ups settle in well under a second, the world follow-cam stays floaty.
    const camRate = (this.mode === 'world' || this.mode === 'title') ? 5.5 : 12;
    const camK = 1 - Math.exp(-camRate * rawDt);
    this.camCurrentPos.lerp(this.camTargetPos, camK);
    this.camCurrentLook.lerp(this.camTargetLook, Math.min(1, camK * 1.15));
    this.camera.position.copy(this.camCurrentPos);
    this.camera.lookAt(this.camCurrentLook);
    this.applyViewShift(rawDt);
    if (this._bodyMode !== this.mode) {
      this._bodyMode = this.mode;
      document.body.dataset.mode = this.mode;
    }

    this.renderFrame();
  }

  /**
   * Slides the rendered picture so the subject sits in the part of the screen that is NOT covered by
   * a side panel / HUD (side panels on the right, prompt on top, tool dock at the bottom).
   */
  applyViewShift(rawDt) {
    const W = this.renderer.domElement.clientWidth || window.innerWidth;
    const H = this.renderer.domElement.clientHeight || window.innerHeight;
    let tx = 0;
    let ty = 0;
    const panelFrac = Math.min(520, W * 0.5) / 2 / W + 0.01;
    if (this.mode === 'avatar_preview') { tx = panelFrac; ty = 0.02; }
    else if (this.mode === 'shop') { tx = panelFrac; ty = 0.03; }
    else if (this.mode === 'activity') { ty = 0.06; }
    else if (this.mode === 'photobooth') { ty = 0.0; }
    const k = 1 - Math.exp(-12 * rawDt);
    this.viewShift.x += (tx - this.viewShift.x) * k;
    this.viewShift.y += (ty - this.viewShift.y) * k;
    if (Math.abs(this.viewShift.x) < 0.0005 && Math.abs(this.viewShift.y) < 0.0005) {
      if (this.camera.view && this.camera.view.enabled) {
        this.camera.clearViewOffset();
      }
    } else {
      this.camera.setViewOffset(W, H, this.viewShift.x * W, -this.viewShift.y * H, W, H);
    }
  }

  renderFrame() {
    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.gameApp = new CozyCritterApp();
});


