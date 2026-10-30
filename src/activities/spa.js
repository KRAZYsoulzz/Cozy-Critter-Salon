// ============================================================================
// Cozy Critter Salon & Spa - 3D Spa & Grooming Activity (activities/spa.js)
// ============================================================================
import * as THREE from 'three';
import { disposeTree } from '../gfx.js';
import { toonMat } from '../gfx.js';

export class SpaActivity {
  constructor(app) {
    this.app = app;
    this.id = 'spa';
    this.step = 'soap'; // 'soap' -> 'rinse' -> 'dry' -> 'teeth' -> 'done'
    this.progress = 0;
    this.activeTool = 'soap';
    this.isDragging = false;
    this.particles = [];
    this.order = ['soap', 'rinse', 'dry', 'teeth'];
    this.sp = { soap: 0, rinse: 0, dry: 0, teeth: 0 };
    this.finished = new Set();
    this.holding = false;
    this.sfxAt = 0;
    this.gainAt = 0;
    this.fxGroup = new THREE.Group();
    this.toolMesh = new THREE.Group();
    this.fxGroup.add(this.toolMesh);

    this.tools = [
      { id: 'soap', label: 'Soap Sponge', icon: 'soap', step: 'soap' },
      { id: 'shower', label: 'Warm Rinse', icon: 'shower', step: 'rinse' },
      { id: 'towel', label: 'Cozy Dryer', icon: 'dryer', step: 'dry' },
      { id: 'toothbrush', label: 'Toothbrush', icon: 'toothbrush', step: 'teeth' }
    ];
  }

  start(pet, petState) {
    this.pet = pet;
    this.petState = petState;
    this.app.save.ensureActivityReady(petState.id, 'spa');
    this.app.scene.add(this.fxGroup);

    // Ensure all 5 3D mud spots are visible on the pet for a satisfying bath
    this.pet.mudMeshes.forEach(m => { m.visible = true; m.scale.set(1.2, 0.45, 1.1); });
    this.pet.foamMeshes.forEach(f => { f.visible = false; f.scale.setScalar(1); });
    this.pet.dropMeshes.forEach(d => { d.visible = false; d.scale.setScalar(1); });

    this.sp = { soap: 0, rinse: 0, dry: 0, teeth: 0 };
    this.finished = new Set();
    this.holding = false;
    this.setStep('soap');
  }

  stop() {
    if (this.pet) {
      this.pet.setSquint(0);
      this.pet.setMouthOpen(0);
      this.pet.foamMeshes.forEach(f => { f.visible = false; });
      this.pet.dropMeshes.forEach(d => { d.visible = false; });
    }
    this.clearParticles();
    this.app.scene.remove(this.fxGroup);
  }

  setStep(step) {
    this.step = step;
    this.progress = this.sp[step] || 0;
    this.holding = false;
    this.pet.setSquint(0);
    this.pet.setMouthOpen(step === 'teeth' ? 1 : 0);

    const prompts = {
      soap: ['spa_step_soap', 'Step 1: Drag the Flower Soap Sponge over your pet to scrub mud into bubbles!'],
      rinse: ['spa_step_rinse', 'Step 2: Drag the Warm Showerhead across the bubbles to rinse clean!'],
      dry: ['spa_step_dry', 'Step 3: Use the Cozy Dryer to fluff dry all the water drops!'],
      teeth: ['spa_step_teeth', 'Step 4: Brush those little teeth until they sparkle and shine!']
    };
    const toolFor = { soap: 'soap', rinse: 'shower', dry: 'towel', teeth: 'toothbrush' };
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
      // Picking a tool jumps straight to that step so prompt, voice and progress always match.
      const t = this.tools.find(x => x.id === toolId);
      if (t && t.step !== this.step) this.setStep(t.step);
    });
  }

  /** Mud -> foam -> drops -> dry, all derived from per-step progress so it is always consistent. */
  applyVisuals() {
    const soap = this.sp.soap / 100, rinse = this.sp.rinse / 100, dry = this.sp.dry / 100;
    for (let i = 0; i < 5; i++) {
      const t = (i + 0.5) / 5;
      const mud = this.pet.mudMeshes[i], foam = this.pet.foamMeshes[i], drop = this.pet.dropMeshes[i];
      if (mud) mud.visible = soap < t;
      if (foam) foam.visible = soap >= t && rinse < t;
      if (drop) drop.visible = rinse >= t && dry < t;
    }
  }

  /** Adds progress to the current step; handles chaining to the next unfinished step. */
  advance(amount) {
    if (this.step === 'done') return;
    const step = this.step;
    this.sp[step] = Math.min(100, (this.sp[step] || 0) + amount);
    this.progress = this.sp[step];
    this.app.ui.updateActivityProgress(this.progress);
    this.applyVisuals();
    if (this.progress >= 100) {
      this.finished.add(step);
      this.holding = false;
      this.app.sound.playHeartChime();
      this.pet.triggerHop();
      if (step === 'dry') this.pet.triggerShake();
      const next = this.order.find(s => !this.finished.has(s));
      if (!next) {
        this.completeActivity();
      } else {
        this.setStep(next);
      }
    }
  }

  build3DToolMesh(toolId) {
    disposeTree(this.toolMesh); this.toolMesh.clear();
    this.toolMesh.visible = false;

    if (toolId === 'soap') {
      const sponge = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 12), toonMat(0xff85c0));
      sponge.scale.set(1.2, 0.7, 1.0);
      this.toolMesh.add(sponge);
    } else if (toolId === 'shower') {
      const head = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.24, 14), toonMat(0x74c0fc));
      head.rotation.x = Math.PI;
      this.toolMesh.add(head);
    } else if (toolId === 'towel') {
      const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.28, 12), toonMat(0xb197fc));
      nozzle.rotation.z = Math.PI / 2;
      this.toolMesh.add(nozzle);
    } else if (toolId === 'toothbrush') {
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.05, 0.05), toonMat(0x63e6be));
      const bristles = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.06), toonMat(0xffffff));
      bristles.position.set(-0.13, 0.05, 0);
      this.toolMesh.add(handle, bristles);
    }
  }

  onPointerMove(worldPos, isNearPet) {
    if (!worldPos || this.step === 'done') return;
    this.toolMesh.visible = true;
    this.toolMesh.position.copy(worldPos);
    this.toolMesh.position.y += 0.15;

    if (!isNearPet) {
      this.holding = false;
      this.pet.setSquint(0);
      return;
    }
    this.holding = true;
    this.lastPos = worldPos.clone();

    const now = performance.now();
    // Rubbing back and forth adds a little extra on top of the steady hold gain.
    if (now - this.gainAt > 50) {
      this.gainAt = now;
      this.advance(1.1);
      if (this.step === 'done') return;
    }
    this.stepEffects(worldPos, now);
  }

  stepEffects(worldPos, now) {
    const squint = { soap: 0.85, rinse: 0.65, dry: 0.4, teeth: 0 }[this.step];
    this.pet.setSquint(squint);
    if (this.step === 'teeth') this.pet.setMouthOpen(1);
    if (now - this.sfxAt < 140) return;
    this.sfxAt = now;
    if (this.step === 'soap') {
      this.app.sound.playScrub();
      if (Math.random() < 0.4) this.app.sound.playBubblePop();
      this.spawnParticle(worldPos, 0xffffff, 0.07, 0.8);
    } else if (this.step === 'rinse') {
      this.app.sound.playSplash();
      this.spawnParticle(worldPos, 0x74c0fc, 0.055, -0.9);
    } else if (this.step === 'dry') {
      this.app.sound.playScrub();
      this.spawnParticle(worldPos, 0xffe066, 0.06, 0.9);
    } else {
      this.app.sound.playScrub();
      this.spawnParticle(worldPos, 0xfff3bf, 0.055, 0.7);
    }
  }

  onPointerUp() {
    this.toolMesh.visible = false;
    this.holding = false;
    if (this.pet && this.step !== 'teeth') {
      this.pet.setSquint(0);
    }
  }

  completeActivity() {
    this.step = 'done';
    this.holding = false;
    this.toolMesh.visible = false;
    this.pet.setSquint(0);
    this.pet.setMouthOpen(0);
    this.pet.triggerHop();
    this.pet.triggerHeartEyes(3.0);

    this.petState.dirtSpots = [];
    this.petState.teethSparkly = true;
    this.petState.stats.cleanliness = 100;
    this.petState.stats.love = Math.min(100, this.petState.stats.love + 15);
    this.pet.syncFromState(this.petState);

    this.app.completeRoutine(
      'spa_complete',
      `${this.petState.customName} is sparkly clean and smells like fresh flowers!`,
      30,
      1
    );
  }

  spawnParticle(pos, colorHex, radius, velY) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 8, 8),
      toonMat(colorHex, { transparent: true, opacity: 0.9 })
    );
    mesh.position.set(
      pos.x + (Math.random() - 0.5) * 0.35,
      pos.y + (Math.random() - 0.5) * 0.25,
      pos.z + 0.15
    );
    mesh.userData = {
      vx: (Math.random() - 0.5) * 0.6,
      vy: velY + (Math.random() - 0.5) * 0.3,
      vz: (Math.random() - 0.5) * 0.4,
      life: 0.65
    };
    this.fxGroup.add(mesh);
    this.particles.push(mesh);
  }

  clearParticles() {
    for (const p of this.particles) {
      this.fxGroup.remove(p); disposeTree(p);
    }
    this.particles = [];
  }

  update(dt) {
    if (this.holding && this.step !== 'done') {
      const rate = { soap: 26, rinse: 30, dry: 30, teeth: 30 }[this.step];
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
        p.position.x += p.userData.vx * dt;
        p.position.y += p.userData.vy * dt;
        p.position.z += p.userData.vz * dt;
        p.scale.multiplyScalar(0.97);
      }
    }
  }
}
