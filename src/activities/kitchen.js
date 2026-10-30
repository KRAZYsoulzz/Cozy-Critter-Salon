// ============================================================================
// Cozy Critter Salon & Spa - 3D Kitchen & Cafe Activity (activities/kitchen.js)
// ============================================================================
import * as THREE from 'three';
import { toonMat } from '../gfx.js';
import { KITCHEN_FOODS, buildFoodMesh } from '../shop-data.js';

export class KitchenActivity {
  constructor(app) {
    this.app = app;
    this.id = 'kitchen';
    this.snacksFed = 0;
    this.targetSnacks = 3;
    this.activeFoodId = 'tangerine_slice';
    this.fxGroup = new THREE.Group();
    this.heldFoodGroup = new THREE.Group();
    this.fxGroup.add(this.heldFoodGroup);
    this.particles = [];
    this.feedCooldown = 0;
  }

  start(pet, petState) {
    this.pet = pet;
    this.petState = petState;
    this.snacksFed = 0;
    this.hadFav = false;
    this.eating = null;
    this.lastNear = false;
    this.feedCooldown = 0;
    this.app.save.ensureActivityReady(petState.id, 'kitchen');
    this.app.scene.add(this.fxGroup);

    // Default to the pet's favorite food first!
    const fav = KITCHEN_FOODS.find(f => f.favoriteOf === petState.id) || KITCHEN_FOODS[0];
    this.selectFood(fav.id, false);

    this.app.ui.setActivityPrompt(
      'kitchen_intro',
      `Drag yummy snacks to ${petState.customName}'s mouth! Look for the ★ favorite treat!`
    );
    this.app.ui.updateActivityProgress(0);
    this.renderFoodDock();
  }

  stop() {
    this.eating = null;
    if (this.pet) {
      this.pet.setMouthOpen(0);
    }
    this.clearParticles();
    this.app.scene.remove(this.fxGroup);
  }

  renderFoodDock() {
    const items = KITCHEN_FOODS.map((f, fi) => ({
      lockAt: (f.favoriteOf === this.petState.id || fi < KITCHEN_FOODS.length - 3) ? 0 : (fi === KITCHEN_FOODS.length - 1 ? 6 : 3),
      id: f.id,
      label: f.favoriteOf === this.petState.id ? `★ ${f.name}` : f.name,
      icon: f.id,
      color: `#${f.color.toString(16).padStart(6, '0')}`,
      isFavorite: f.favoriteOf === this.petState.id,
      voiceId: f.voiceId
    }));
    this.app.ui.renderToolDock(items, this.activeFoodId, foodId => {
      this.selectFood(foodId, true);
    });
  }

  selectFood(foodId, speakName = true) {
    this.activeFoodId = foodId;
    this.heldFoodGroup.clear();
    const mesh = buildFoodMesh(foodId);
    mesh.scale.setScalar(1.25);
    this.heldFoodGroup.add(mesh);
    this.heldFoodGroup.visible = false;

    const food = KITCHEN_FOODS.find(f => f.id === foodId);
    if (food && speakName) {
      this.app.voice.speak(food.voiceId, food.name);
    }
    this.renderFoodDock();
  }

  onPointerMove(worldPos, isNearPet, info = {}) {
    if (!worldPos || this.snacksFed >= this.targetSnacks || this.eating) return;
    this.heldFoodGroup.visible = true;
    this.heldFoodGroup.position.copy(worldPos);
    this.heldFoodGroup.position.y += 0.1;
    this.heldFoodGroup.rotation.y += 0.06;
    this.lastPos = worldPos.clone();
    this.lastMouth = info.mouthPos ? info.mouthPos.clone() : null;

    const md = info.mouthDist ?? (isNearPet ? 0.3 : 9);
    // Mouth opens wider and wider as the snack gets closer
    this.pet.setMouthOpen(md < 1.5 ? 1 : (isNearPet ? 0.8 : 0.3));
    this.lastNear = isNearPet || md < 0.9;

    if (this.lastNear && this.feedCooldown <= 0) {
      this.feedCurrentSnack(worldPos);
    }
  }

  onPointerUp() {
    // Dropping the snack on the pet counts too (forgiving drop zone)
    if (this.lastNear && !this.eating && this.feedCooldown <= 0 && this.lastPos && this.snacksFed < this.targetSnacks && this.heldFoodGroup.visible) {
      this.feedCurrentSnack(this.lastPos);
    }
    this.lastNear = false;
    this.heldFoodGroup.visible = false;
    if (this.pet && this.pet.chewTimer <= 0 && !this.eating) {
      this.pet.setMouthOpen(0);
    }
  }

  feedCurrentSnack(worldPos) {
    this.feedCooldown = 0.8;
    const food = KITCHEN_FOODS.find(f => f.id === this.activeFoodId) || KITCHEN_FOODS[0];
    // Snack flies into the open mouth, then CHOMP!
    const to = this.lastMouth || new THREE.Vector3(this.pet.root.position.x, this.pet.root.position.y + 0.65, this.pet.root.position.z + 0.4);
    this.eating = { t: 0, dur: 0.22, from: this.heldFoodGroup.position.clone(), to, food, worldPos: worldPos.clone() };
    this.pet.setMouthOpen(1);
  }

  finishEating() {
    const { food, to } = this.eating;
    this.eating = null;
    this.heldFoodGroup.visible = false;

    if (food.crunchType === 'slurp') this.app.sound.playSlurp();
    else this.app.sound.playMunch();

    this.pet.triggerChew();
    this.pet.triggerHop();
    this.pet.setMouthOpen(0);

    // 3D crumbs burst out of the mouth + floating "Yum!"
    for (let i = 0; i < 14; i++) {
      this.spawnCrumb(to, i % 2 === 0 ? food.color : food.accent);
    }
    this.app.popText(to.clone().add(new THREE.Vector3(0, 0.35, 0)), ['Yum!', 'Nom nom!', 'Yummy!'][this.snacksFed % 3], '#ff4d8d');

    const isFav = food.favoriteOf === this.petState.id;
    if (isFav) {
      this.pet.triggerHeartEyes(2.2);
      this.app.sound.playHeartChime();
      this.app.voice.speak('kitchen_fav', `Ooh, ${food.name} is ${this.petState.customName}'s favorite treat!`);
    } else {
      this.pet.triggerHeartEyes(0.9);
    }

    this.snacksFed++;
    const pct = Math.min(100, Math.round((this.snacksFed / this.targetSnacks) * 100));
    this.app.ui.updateActivityProgress(pct);

    if (this.snacksFed >= this.targetSnacks) {
      setTimeout(() => { if (this.pet) this.completeActivity(isFav || this.hadFav); }, 900);
    }
    if (isFav) this.hadFav = true;
  }

  completeActivity(hadFavorite) {
    this.snacksFed = 99;
    this.pet.setMouthOpen(0);
    this.pet.triggerHop();
    this.pet.triggerHeartEyes(3.0);

    this.petState.stats.hunger = 100;
    this.petState.stats.love = Math.min(100, this.petState.stats.love + (hadFavorite ? 20 : 12));
    this.pet.syncFromState(this.petState);

    this.app.completeRoutine(
      'kitchen_complete',
      `Yum! ${this.petState.customName}'s tummy is full and happy!`,
      hadFavorite ? 35 : 25,
      1
    );
  }

  spawnCrumb(pos, colorHex) {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 8, 8),
      toonMat(colorHex)
    );
    m.position.set(
      pos.x + (Math.random() - 0.5) * 0.25,
      pos.y + (Math.random() - 0.5) * 0.2,
      pos.z + 0.2
    );
    m.scale.setScalar(1.2);
    m.userData = {
      vx: (Math.random() - 0.5) * 1.8,
      vy: 0.9 + Math.random() * 0.8,
      vz: 0.4 + Math.random() * 0.6,
      life: 0.65
    };
    this.fxGroup.add(m);
    this.particles.push(m);
  }

  clearParticles() {
    for (const p of this.particles) this.fxGroup.remove(p);
    this.particles = [];
  }

  update(dt) {
    if (this.feedCooldown > 0) this.feedCooldown -= dt;
    if (this.eating) {
      const e = this.eating;
      e.t += dt;
      const k = Math.min(1, e.t / e.dur);
      this.heldFoodGroup.visible = true;
      this.heldFoodGroup.position.lerpVectors(e.from, e.to, k);
      this.heldFoodGroup.scale.setScalar(1 - 0.85 * k);
      if (k >= 1) {
        this.heldFoodGroup.scale.setScalar(1);
        this.finishEating();
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.userData.life -= dt;
      if (p.userData.life <= 0) {
        this.fxGroup.remove(p);
        this.particles.splice(i, 1);
      } else {
        p.userData.vy -= 3.2 * dt;
        p.position.x += p.userData.vx * dt;
        p.position.y += p.userData.vy * dt;
        p.position.z += p.userData.vz * dt;
        p.scale.multiplyScalar(0.96);
      }
    }
  }
}
