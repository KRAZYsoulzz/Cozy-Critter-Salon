// ============================================================================
// Cozy Critter Salon & Spa - 3D Play Yard & Catch Treats Mini-Game (yard.js)
// ============================================================================
import * as THREE from 'three';
import { disposeTree } from '../gfx.js';
import { toonMat } from '../gfx.js';

export class YardActivity {
  constructor(app) {
    this.app = app;
    this.id = 'yard';
    this.mode = 'toys'; // 'toys' | 'minigame'
    this.progress = 0;
    this.activeTool = 'ball';
    this.fxGroup = new THREE.Group();
    this.toolMesh = new THREE.Group();
    this.fxGroup.add(this.toolMesh);
    this.fallingItems = [];
    this.particles = [];
    this.minigameTimer = 0;
    this.minigameScore = 0;
    this.spawnCooldown = 0;
    this.lastBoopAt = 0;

    this.tools = [
      { id: 'ball', label: 'Beach Ball', icon: 'yard', step: 'toys' },
      { id: 'duck', label: 'Squeaky Duck', icon: 'duck', step: 'toys' },
      { id: 'bubbleWand', label: 'Bubble Wand', icon: 'bubbleWand', step: 'toys' },
      { id: 'minigame', label: 'Catch Treats!', icon: 'treats', step: 'minigame' }
    ];
  }

  start(pet, petState) {
    this.pet = pet;
    this.petState = petState;
    this.mode = 'toys';
    this.targetX = undefined;
    this.progress = 0;
    this.basePetX = pet.root.position.x;
    this.basePetZ = pet.root.position.z;
    this.app.scene.add(this.fxGroup);

    this.activeTool = 'ball';
    this.build3DToolMesh(this.activeTool);

    this.app.ui.setActivityPrompt(
      'yard_intro',
      `Drag toys for ${petState.customName} to boop, or tap Catch Treats for a fun mini-game!`
    );
    this.app.ui.renderToolDock(this.tools, this.activeTool, toolId => {
      if (toolId === 'minigame') {
        this.startMinigame();
      } else {
        this.mode = 'toys';
        this.activeTool = toolId;
        this.build3DToolMesh(toolId);
      }
    });
    this.app.ui.updateActivityProgress(0);
  }

  stop() {
    if (this.scoreEl) this.scoreEl.style.display = 'none';
    this.clearFallingItems();
    this.clearParticles();
    if (this.pet) {
      this.pet.root.position.x = this.basePetX;
      this.pet.root.position.z = this.basePetZ;
      this.pet.setMouthOpen(0);
    }
    this.app.scene.remove(this.fxGroup);
  }

  build3DToolMesh(toolId) {
    disposeTree(this.toolMesh); this.toolMesh.clear();
    this.toolMesh.visible = false;

    if (toolId === 'ball') {
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 12), toonMat(0xff6b9d));
      const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.03, 8, 16), toonMat(0xffe066));
      this.toolMesh.add(ball, stripe);
    } else if (toolId === 'duck') {
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), toonMat(0xffd43b));
      body.scale.set(1.2, 0.9, 1.0);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), toonMat(0xffd43b));
      head.position.set(0.1, 0.14, 0);
      const beak = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.1, 8), toonMat(0xff8c1a));
      beak.rotation.z = -Math.PI / 2;
      beak.position.set(0.2, 0.14, 0);
      this.toolMesh.add(body, head, beak);
    } else if (toolId === 'bubbleWand') {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.028, 8, 18), toonMat(0xff4d8d));
      const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.28, 8), toonMat(0xff4d8d));
      stick.position.y = -0.22;
      this.toolMesh.add(ring, stick);
    }
  }

  ensureScoreHud() {
    if (!this.scoreEl) {
      this.scoreEl = document.createElement('div');
      this.scoreEl.className = 'minigame-score';
      document.getElementById('activity-hud')?.appendChild(this.scoreEl);
    }
    this.scoreEl.style.display = 'flex';
  }

  updateScoreHud() {
    if (!this.scoreEl) return;
    const t = Math.max(0, Math.ceil(this.minigameTimer));
    const txt = `Treats: ${Math.min(this.minigameScore, 8)} / 8  â™¥`;
    if (this.scoreEl.textContent !== txt) this.scoreEl.textContent = txt;
  }

  startMinigame() {
    this.mode = 'minigame';
    this.targetX = this.pet.root.position.x;
    this.ensureScoreHud();
    this.minigameTimer = 25; // Relaxed 25-30s fun round
    this.minigameScore = 0;
    this.spawnCooldown = 0.2;
    this.toolMesh.visible = false;
    this.clearFallingItems();
    // Pull the camera back so the whole fall is visible
    { const st = this.app.activeStation; const k = 1.45; if (st) this.app.camTargetPos.copy(st.camLook).addScaledVector(st.camPos.clone().sub(st.camLook), k); this.app.camTargetPos.y += 0.6; }

    this.app.voice.speak(
      'yard_minigame_start',
      'Slide your critter left and right to catch yummy strawberries, tangerines, and coins!'
    );
    this.app.ui.setActivityPrompt(
      'yard_minigame_start',
      `Slide ${this.petState.customName} left & right to catch the falling treats!`
    );
    this.app.ui.updateActivityProgress(0);
  }

  wantsHover() {
    return this.mode === 'minigame';
  }

  onPointerMove(worldPos, isNearPet) {
    if (!worldPos) return;

    if (this.mode === 'minigame') {
      // Slide pet horizontally within the Play Yard stage (follows the finger or the mouse)
      this.targetX = Math.max(this.basePetX - 1.6, Math.min(this.basePetX + 1.6, worldPos.x));
      return;
    }
    if (this.mode === 'done') return;

    this.toolMesh.visible = true;
    this.toolMesh.position.copy(worldPos);
    this.toolMesh.position.y += 0.18;

    // Gentle pet lean toward the toy
    const dx = Math.max(-0.5, Math.min(0.5, (worldPos.x - this.basePetX) * 0.35));
    this.pet.root.position.x = this.basePetX + dx;

    if (this.activeTool === 'bubbleWand' && Math.random() < 0.35) {
      this.spawnBubble(worldPos);
    }

    if (isNearPet) {
      const now = performance.now();
      if (now - this.lastBoopAt > 360) {
        this.lastBoopAt = now;
        if (this.activeTool === 'duck') this.app.sound.playSqueak();
        else this.app.sound.playBubblePop();

        this.pet.triggerHop();
        this.pet.triggerHeartEyes(1.2);
        this.spawnBubble(worldPos);

        this.progress = Math.min(100, this.progress + 12);
        this.app.ui.updateActivityProgress(this.progress);
        if (this.progress >= 100) {
          this.completeToys();
        }
      }
    }
  }

  onPointerUp() {
    this.toolMesh.visible = false;
  }

  spawnFallingItem() {
    const types = ['strawberry', 'tangerine', 'coin', 'strawberry', 'coin', 'tangerine', 'mud'];
    const type = types[Math.floor(Math.random() * types.length)];
    const mesh = new THREE.Group();
    if (type === 'strawberry') {
      const body = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.3, 12), toonMat(0xff2f5f, { emissive: 0x7a0020, emissiveIntensity: 0.4 }));
      body.rotation.x = Math.PI;
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.08, 6), toonMat(0x2fbf4a));
      leaf.position.y = 0.17;
      mesh.add(body, leaf);
    } else if (type === 'tangerine') {
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.17, 14, 12), toonMat(0xff8c1a, { emissive: 0x8a3a00, emissiveIntensity: 0.4 }));
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), toonMat(0x2fbf4a));
      leaf.scale.set(1.6, 0.5, 1);
      leaf.position.y = 0.17;
      mesh.add(body, leaf);
    } else if (type === 'coin') {
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.06, 18), toonMat(0xffd43b, { emissive: 0xb38600, emissiveIntensity: 0.7 }));
      body.rotation.x = Math.PI / 2;
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.02, 6, 18), toonMat(0xfff3a0));
      mesh.add(body, rim);
    } else {
      const body = new THREE.Mesh(new THREE.DodecahedronGeometry(0.16, 1), toonMat(0x6b4423));
      mesh.add(body);
    }
    mesh.scale.setScalar(1.35);

    const range = 1.5;
    const topY = this.app.ndcToPlaneZ(0, 0.5, this.basePetZ + 0.15).y;
    const petMouthY = this.pet.root.position.y + 0.65;
    mesh.position.set(
      this.basePetX + (Math.random() * 2 - 1) * range,
      Math.max(topY, petMouthY + 1.4),
      this.basePetZ + 0.15
    );
    const fallTime = 2.0 + Math.random() * 0.6;
    mesh.userData = { type, speed: (mesh.position.y - petMouthY) / fallTime };
    this.fxGroup.add(mesh);
    this.fallingItems.push(mesh);
  }

  spawnBubble(pos) {
    const b = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 10, 8),
      toonMat(0x74c0fc, { transparent: true, opacity: 0.75 })
    );
    b.position.set(pos.x + (Math.random() - 0.5) * 0.3, pos.y + 0.1, pos.z + 0.2);
    b.userData = { vy: 0.8 + Math.random() * 0.5, life: 0.75 };
    this.fxGroup.add(b);
    this.particles.push(b);
  }

  clearFallingItems() {
    for (const item of this.fallingItems) { this.fxGroup.remove(item); disposeTree(item); }
    this.fallingItems = [];
  }

  clearParticles() {
    for (const p of this.particles) { this.fxGroup.remove(p); disposeTree(p); }
    this.particles = [];
  }

  completeToys() {
    this.pet.root.position.x = this.basePetX;
    this.pet.triggerHop();
    this.pet.triggerHeartEyes(3.0);
    this.petState.stats.love = 100;
    this.petState.stats.energy = 100;
    this.app.completeRoutine(
      'yard_minigame_complete',
      `${this.petState.customName} had so much fun playing in the garden!`,
      25,
      1
    );
  }

  completeMinigame() {
    this.mode = 'done';
    if (this.scoreEl) this.scoreEl.style.display = 'none';
    this.clearFallingItems();
    this.pet.root.position.x = this.basePetX;
    this.pet.setMouthOpen(0);
    this.pet.triggerHop();
    this.pet.triggerHeartEyes(3.0);

    const bonusCoins = 25 + this.minigameScore * 2;
    this.app.completeRoutine(
      'yard_minigame_complete',
      `Amazing! You caught ${this.minigameScore} treats and earned ${bonusCoins} shiny coins!`,
      bonusCoins,
      1
    );
  }

  update(dt) {
    // Update floating bubbles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.userData.life -= dt;
      if (p.userData.life <= 0) {
        this.fxGroup.remove(p); disposeTree(p);
        this.particles.splice(i, 1);
      } else {
        p.position.y += p.userData.vy * dt;
      }
    }

    if (this.mode !== 'minigame') return;

    // Untimed: no clock, no fail state - the round ends when enough treats are caught.
    const elapsedPct = Math.min(100, Math.round((this.minigameScore / 8) * 100));
    this.app.ui.updateActivityProgress(elapsedPct);

    this.spawnCooldown -= dt;
    if (this.spawnCooldown <= 0) {
      this.spawnCooldown = 0.55;
      this.spawnFallingItem();
    }

    // Pet glides toward the finger
    if (this.targetX !== undefined) {
      const k = 1 - Math.exp(-14 * dt);
      this.pet.root.position.x += (this.targetX - this.pet.root.position.x) * k;
    }
    this.updateScoreHud();

    // Update falling treats & check generous pet hitbox
    let anyClose = false;
    for (let i = this.fallingItems.length - 1; i >= 0; i--) {
      const item = this.fallingItems[i];
      item.position.y -= item.userData.speed * dt;
      item.rotation.y += dt * 3;

      const dx = Math.abs(item.position.x - this.pet.root.position.x);
      const dy = item.position.y - (this.pet.root.position.y + 0.65);

      if (dy < 0.9 && dy > -0.3 && dx < 0.9 && item.userData.type !== 'mud') anyClose = true;

      if (Math.abs(dy) < 0.5 && dx < 0.78) {
        // Caught!
        const t = item.userData.type;
        if (t === 'mud') {
          this.app.sound.playBubblePop();
          this.pet.triggerShake();
          this.app.popText(item.position, 'Oops!', '#8a5a2b');
        } else {
          this.minigameScore++;
          if (t === 'coin') this.app.sound.playCoinEarned();
          else this.app.sound.playMunch();
          this.pet.triggerChew();
          this.pet.triggerHop();
          this.spawnBubble(this.pet.root.position);
          this.app.popText(item.position, t === 'coin' ? '+1 coin!' : '+1 yum!', t === 'coin' ? '#d98e00' : '#ff4d8d');
          for (let k = 0; k < 6; k++) this.spawnBubble(item.position);
        }
        this.fxGroup.remove(item); disposeTree(item);
        this.fallingItems.splice(i, 1);
        continue;
      }

      if (item.position.y < this.pet.root.position.y - 0.1) {
        this.fxGroup.remove(item); disposeTree(item);
        this.fallingItems.splice(i, 1);
      }
    }
    if (anyClose) this.pet.setMouthOpen(1);
    else if (this.pet.chewTimer <= 0) this.pet.setMouthOpen(0);

    if (this.minigameScore >= 8) {
      this.completeMinigame();
    }
  }
}
