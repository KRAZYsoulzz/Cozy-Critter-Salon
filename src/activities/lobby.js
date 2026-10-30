// ============================================================================
// Cozy Critter Salon & Spa - 3D Lobby Cuddle & Heart Brush (activities/lobby.js)
// ============================================================================
import * as THREE from 'three';
import { disposeTree } from '../gfx.js';
import { toonMat } from '../gfx.js';

export class LobbyActivity {
  constructor(app) {
    this.app = app;
    this.id = 'lobby';
    this.progress = 0;
    this.activeTool = 'heartBrush';
    this.fxGroup = new THREE.Group();
    this.toolMesh = new THREE.Group();
    this.fxGroup.add(this.toolMesh);
    this.particles = [];
    this.lastSqueakAt = 0;
    this.petting = false;

    this.tools = [
      { id: 'heartBrush', label: 'Heart Brush', icon: 'heartBrush', step: 'cuddle' },
      { id: 'cuddle', label: 'Gentle Pets', icon: 'lobby', step: 'cuddle' }
    ];
  }

  start(pet, petState) {
    this.pet = pet;
    this.petState = petState;
    this.progress = 0;
    this.app.save.ensureActivityReady(petState.id, 'lobby');
    this.app.scene.add(this.fxGroup);

    this.activeTool = 'heartBrush';
    this.build3DToolMesh(this.activeTool);

    this.app.ui.setActivityPrompt(
      'lobby_intro',
      `Drag the Heart Brush or your hand across ${petState.customName} to fill the Love Meter!`
    );
    this.app.ui.renderToolDock(this.tools, this.activeTool, toolId => {
      this.activeTool = toolId;
      this.build3DToolMesh(toolId);
    });
    this.app.ui.updateActivityProgress(0);
  }

  stop() {
    if (this.pet) {
      this.pet.setSquint(0);
    }
    this.clearParticles();
    this.app.scene.remove(this.fxGroup);
  }

  build3DToolMesh(toolId) {
    disposeTree(this.toolMesh); this.toolMesh.clear();
    this.toolMesh.visible = false;
    const mat = toonMat(toolId === 'heartBrush' ? 0xff4d8d : 0xffadd2);
    const pad = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 12), mat);
    pad.scale.set(1.2, 0.85, 0.7);
    this.toolMesh.add(pad);
  }

  onPointerMove(worldPos, isNearPet) {
    if (!worldPos || this.progress >= 100) return;
    this.toolMesh.visible = true;
    this.toolMesh.position.copy(worldPos);
    this.toolMesh.position.y += 0.15;

    if (!isNearPet) {
      this.petting = false;
      this.pet.setSquint(0);
      return;
    }

    this.petting = true;
    this.lastPos = worldPos.clone();
    this.pet.setSquint(0.6);
    this.pet.triggerHeartEyes(1.2);

    const now = performance.now();
    if (now - this.lastSqueakAt > 360) {
      this.lastSqueakAt = now;
      this.app.sound.playSqueak();
      this.pet.triggerHop();
      this.spawnHeart(worldPos);
    }
  }

  gain(amount) {
    if (this.progress >= 100) return;
    this.progress = Math.min(100, this.progress + amount);
    this.app.ui.updateActivityProgress(this.progress);
    if (this.progress >= 100) {
      this.petting = false;
      this.completeActivity();
    }
  }

  onPointerUp() {
    this.toolMesh.visible = false;
    this.petting = false;
    if (this.pet) this.pet.setSquint(0);
  }

  completeActivity() {
    this.toolMesh.visible = false;
    this.pet.setSquint(0);
    this.pet.triggerHop();
    this.pet.triggerHeartEyes(3.5);

    this.petState.stats.love = 100;
    this.pet.syncFromState(this.petState);

    this.app.completeRoutine(
      'lobby_complete',
      `So much love! Look at ${this.petState.customName}'s happy dance!`,
      25,
      1
    );
  }

  spawnHeart(pos) {
    const heart = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.085, 0),
      toonMat(Math.random() > 0.3 ? 0xff4d8d : 0xffd43b)
    );
    heart.position.set(
      pos.x + (Math.random() - 0.5) * 0.4,
      pos.y + 0.15,
      pos.z + 0.2
    );
    heart.userData = {
      vx: (Math.random() - 0.5) * 0.5,
      vy: 0.9 + Math.random() * 0.5,
      life: 0.85
    };
    this.fxGroup.add(heart);
    this.particles.push(heart);
  }

  clearParticles() {
    for (const p of this.particles) { this.fxGroup.remove(p); disposeTree(p); }
    this.particles = [];
  }

  update(dt) {
    if (this.petting) {
      this.gain(15 * dt); // about 5-6 seconds of petting fills the Love Meter
      this.heartTimer = (this.heartTimer || 0) - dt;
      if (this.heartTimer <= 0 && this.lastPos && this.progress < 100) {
        this.heartTimer = 0.4;
        this.spawnHeart(this.lastPos);
      }
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
        p.rotation.y += dt * 4;
      }
    }
  }
}
