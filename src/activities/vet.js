// ============================================================================
// Cozy Critter Salon & Spa - 3D Vet Clinic Activity (activities/vet.js)
// ============================================================================
import * as THREE from 'three';
import { disposeTree } from '../gfx.js';
import { toonMat } from '../gfx.js';

export class VetActivity {
  constructor(app) {
    this.app = app;
    this.id = 'vet';
    this.step = 'stethoscope'; // 'stethoscope' -> 'tweezers' -> 'thermometer' -> 'bandage' -> 'vitamin' -> 'done'
    this.progress = 0;
    this.activeTool = 'stethoscope';
    this.fxGroup = new THREE.Group();
    this.toolMesh = new THREE.Group();
    this.fxGroup.add(this.toolMesh);
    this.particles = [];
    this.lastHeartbeatAt = 0;
    this.order = ['stethoscope', 'tweezers', 'thermometer', 'bandage', 'vitamin'];
    this.sp = { stethoscope: 0, tweezers: 0, thermometer: 0, bandage: 0, vitamin: 0 };
    this.finished = new Set();
    this.holding = false;
    this.gainAt = 0;
    this.sfxAt = 0;

    this.tools = [
      { id: 'stethoscope', label: 'Stethoscope', icon: 'stethoscope', step: 'stethoscope' },
      { id: 'tweezers', label: 'Tweezers', icon: 'tweezers', step: 'tweezers' },
      { id: 'icepack', label: 'Cool Pack', icon: 'icepack', step: 'thermometer' },
      { id: 'bandage', label: 'Star Bandage', icon: 'bandage', step: 'bandage' },
      { id: 'vitamin', label: 'Heart Vitamin', icon: 'vitamin', step: 'vitamin' }
    ];
  }

  start(pet, petState) {
    this.pet = pet;
    this.petState = petState;
    this.app.save.ensureActivityReady(petState.id, 'vet');
    this.app.scene.add(this.fxGroup);

    // Show twigs, scrapes, and fever glow for the checkup
    this.pet.twigMeshes.forEach(t => { t.visible = true; });
    this.pet.scrapeMeshes.forEach(s => { s.visible = true; });
    this.pet.bandageMeshes.forEach(b => { b.visible = false; });
    if (this.pet.feverGlow) this.pet.feverGlow.visible = true;

    this.sp = { stethoscope: 0, tweezers: 0, thermometer: 0, bandage: 0, vitamin: 0 };
    this.finished = new Set();
    this.holding = false;
    this.setStep('stethoscope');
  }

  stop() {
    if (this.pet) {
      this.pet.setSquint(0);
      this.pet.setMouthOpen(0);
      this.pet.bandageMeshes.forEach(b => { b.visible = false; });
      if (this.pet.feverGlow) this.pet.feverGlow.visible = false;
    }
    this.clearParticles();
    this.app.scene.remove(this.fxGroup);
  }

  setStep(step) {
    this.step = step;
    this.progress = this.sp[step] || 0;
    this.holding = false;
    this.pet.setMouthOpen(step === 'vitamin' ? 1 : 0);

    const prompts = {
      stethoscope: ['vet_step_stethoscope', 'Step 1: Hold the Stethoscope on the chest to hear the lub-dub heartbeat!'],
      tweezers: ['vet_step_tweezers', 'Step 2: Gently brush the Tweezers over the little twigs to pluck them out!'],
      thermometer: ['vet_step_thermometer', 'Step 3: Rub the Cool Ice Pack on the warm forehead to cool the fever!'],
      bandage: ['vet_step_bandage', 'Step 4: Place soothing cream and Star Bandages over the boo-boos!'],
      vitamin: ['vet_step_vitamin', 'Step 5: Feed the yummy Pink Heart Vitamin Gummy to feel 100% better!']
    };
    const toolFor = { stethoscope: 'stethoscope', tweezers: 'tweezers', thermometer: 'icepack', bandage: 'bandage', vitamin: 'vitamin' };
    this.activeTool = toolFor[step];
    this.app.ui.setActivityPrompt(prompts[step][0], prompts[step][1]);

    this.build3DToolMesh(this.activeTool);
    this.renderDock();
    this.app.ui.updateActivityProgress(this.progress);
    this.applyVisuals();
  }

  renderDock() {
    const tools = this.tools.map(t => ({ ...t, done: this.finished.has(t.step) }));
    this.app.ui.renderToolDock(tools, this.activeTool, toolId => {
      const t = this.tools.find(x => x.id === toolId);
      if (t && t.step !== this.step) this.setStep(t.step);
    });
  }

  applyVisuals() {
    const tw = this.sp.tweezers / 100, ice = this.sp.thermometer / 100, bd = this.sp.bandage / 100;
    this.pet.twigMeshes.forEach((t, i) => { t.visible = tw < (i + 0.6) / this.pet.twigMeshes.length; });
    if (this.pet.feverGlow) {
      this.pet.feverGlow.visible = ice < 1;
      this.pet.feverGlow.material.opacity = Math.max(0, (1 - ice) * 0.55);
    }
    this.pet.scrapeMeshes.forEach((s, i) => {
      const done = bd >= (i + 0.6) / this.pet.scrapeMeshes.length;
      s.visible = !done;
      if (this.pet.bandageMeshes[i]) this.pet.bandageMeshes[i].visible = done;
    });
  }

  advance(amount) {
    if (this.step === 'done') return;
    const step = this.step;
    const prevTw = this.pet.twigMeshes.filter(t => t.visible).length;
    const prevSc = this.pet.scrapeMeshes.filter(t => t.visible).length;
    this.sp[step] = Math.min(100, (this.sp[step] || 0) + amount);
    this.progress = this.sp[step];
    this.app.ui.updateActivityProgress(this.progress);
    this.applyVisuals();
    if (step === 'tweezers' && this.pet.twigMeshes.filter(t => t.visible).length < prevTw) {
      this.app.sound.playBubblePop();
      if (this.lastPos) this.spawnSparkle(this.lastPos, 0x69db7c);
    }
    if (step === 'bandage' && this.pet.scrapeMeshes.filter(t => t.visible).length < prevSc) {
      this.app.sound.playBandageRip();
      if (this.lastPos) this.spawnSparkle(this.lastPos, 0xff85c0);
    }
    if (this.progress >= 100) {
      this.finished.add(step);
      this.holding = false;
      if (step === 'vitamin') {
        this.app.sound.playMunch();
        this.pet.triggerChew();
        this.completeActivity();
        return;
      }
      this.app.sound.playHeartChime();
      this.pet.triggerHop();
      const next = this.order.find(s => !this.finished.has(s));
      if (!next) this.completeActivity(); else this.setStep(next);
    }
  }

  build3DToolMesh(toolId) {
    disposeTree(this.toolMesh); this.toolMesh.clear();
    this.toolMesh.visible = false;

    if (toolId === 'stethoscope') {
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.05, 16), toonMat(0xff4d79));
      disc.rotation.x = Math.PI / 2;
      this.toolMesh.add(disc);
    } else if (toolId === 'tweezers') {
      const prong1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.32, 0.04), toonMat(0x74c0fc));
      prong1.position.x = -0.04;
      prong1.rotation.z = -0.12;
      const prong2 = prong1.clone();
      prong2.position.x = 0.04;
      prong2.rotation.z = 0.12;
      this.toolMesh.add(prong1, prong2);
    } else if (toolId === 'icepack') {
      const pack = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.2, 0.09), toonMat(0x4dabf7));
      this.toolMesh.add(pack);
    } else if (toolId === 'bandage') {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.11, 0.04), toonMat(0xff85c0));
      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.05, 0), toonMat(0xffe066));
      star.position.z = 0.03;
      this.toolMesh.add(strip, star);
    } else if (toolId === 'vitamin') {
      const heart = new THREE.Mesh(new THREE.OctahedronGeometry(0.14, 1), toonMat(0xff4d8d));
      this.toolMesh.add(heart);
    }
  }

  onPointerMove(worldPos, isNearPet, info = {}) {
    if (!worldPos || this.step === 'done') return;
    this.toolMesh.visible = true;
    this.toolMesh.position.copy(worldPos);
    this.toolMesh.position.y += 0.15;

    if (!isNearPet) {
      this.holding = false;
      return;
    }
    this.holding = true;
    this.lastPos = worldPos.clone();
    const now = performance.now();
    if (now - this.gainAt > 50) {
      this.gainAt = now;
      this.advance(1.0);
      if (this.step === 'done') return;
    }
    this.stepEffects(worldPos, now);
  }

  stepEffects(worldPos, now) {
    if (this.step === 'vitamin') this.pet.setMouthOpen(1);
    if (now - this.sfxAt < 150) return;
    this.sfxAt = now;
    if (this.step === 'stethoscope') {
      if (now - this.lastHeartbeatAt > 460) {
        this.lastHeartbeatAt = now;
        this.app.sound.playHeartbeat();
        this.spawnSparkle(worldPos, 0xff4d79);
      }
    } else if (this.step === 'thermometer') {
      this.app.sound.playScrub();
      this.spawnSparkle(worldPos, 0x74c0fc);
    } else if (this.step === 'tweezers') {
      this.spawnSparkle(worldPos, 0xb2f2bb);
    } else if (this.step === 'bandage') {
      this.spawnSparkle(worldPos, 0xffc2df);
    }
  }

  onPointerUp() {
    this.toolMesh.visible = false;
    this.holding = false;
  }

  completeActivity() {
    this.step = 'done';
    this.holding = false;
    this.toolMesh.visible = false;
    this.pet.setMouthOpen(0);
    this.pet.triggerHop();
    this.pet.triggerHeartEyes(3.0);

    this.petState.ailments = [];
    this.petState.twigs = [];
    this.petState.scrapes = [];
    this.petState.fever = false;
    this.petState.stats.health = 100;
    this.petState.stats.love = Math.min(100, this.petState.stats.love + 15);
    this.pet.syncFromState(this.petState);

    this.app.completeRoutine(
      'vet_complete',
      `${this.petState.customName} is 100% healthy and feeling super strong!`,
      35,
      1
    );
  }

  spawnSparkle(pos, colorHex) {
    const m = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.065, 0),
      toonMat(colorHex)
    );
    m.position.set(
      pos.x + (Math.random() - 0.5) * 0.3,
      pos.y + (Math.random() - 0.5) * 0.25,
      pos.z + 0.15
    );
    m.userData = { vy: 0.7 + Math.random() * 0.4, life: 0.55 };
    this.fxGroup.add(m);
    this.particles.push(m);
  }

  clearParticles() {
    for (const p of this.particles) { this.fxGroup.remove(p); disposeTree(p); }
    this.particles = [];
  }

  update(dt) {
    if (this.holding && this.step !== 'done') {
      const rate = this.step === 'vitamin' ? 70 : 30;
      this.advance(rate * dt);
      if (this.lastPos && this.step !== 'done') this.stepEffects(this.lastPos, performance.now());
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.userData.life -= dt;
      if (p.userData.life <= 0) {
        this.fxGroup.remove(p); disposeTree(p);
        this.particles.splice(i, 1);
      } else {
        p.position.y += p.userData.vy * dt;
        p.rotation.y += dt * 6;
        p.scale.multiplyScalar(0.96);
      }
    }
  }
}
