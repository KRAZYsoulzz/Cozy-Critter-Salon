// 2D game shell: boots the canvas world and drives the existing DOM overlays (title, creator, shop, photo booth, settings...) through a small app adapter.
import { Engine } from './engine.js';
import { World2D } from './world2d.js';
import { SaveManager } from '../save.js';
import { SoundEngine } from '../audio.js';
import { VoiceEngine } from '../voice.js';
import { UIManager } from '../ui.js';
import { PetManager } from './pets2d.js';
import { ActivityScene } from './activity2d.js';
import { STATIONS, RW } from './rooms.js';
import { drawAvatar } from './avatar.js';
import { drawPet } from './pets2d.js';

const $ = id => document.getElementById(id);
const ACTIVITIES = ['spa', 'kitchen', 'vet', 'yard'];

class App {
  constructor() {
    window.__bootStart = performance.now();
    this.save = new SaveManager(); this.sound = new SoundEngine(this.save); this.voice = new VoiceEngine(this.save, this.sound);
    this.mode = 'title'; this.activeStation = null; this.canvas = $('webgl-canvas');
    this.engine = new Engine(this.canvas);
    this.world = new World2D(this.engine, this.save, { station: (s, first) => this.onStation(s, first) });
    this.world.applyRoomUpgrades = () => {};
    this.pm = new PetManager(this.world);
    this.scene = new ActivityScene(this.world, this.pm, { sound: this.sound, voice: this.voice });
    this.scene.hooks = { exit: () => this.exitActivity(), reward: () => this.ui.syncHUD() };
    // avatar + pet handles for UIManager (3D-era API)
    this.avatar = { triggerWave: () => { this.world.av.wave = 1.4; } };
    this.pets = new Proxy({}, { get: (_, id) => (typeof id === 'string' && this.pm.pets[id]) ? ({
      triggerHop: () => { const o = this.pm.pets[id]; o.react = 1.1; o.reactExpr = 'happy'; }, triggerHeartEyes: s => { const o = this.pm.pets[id]; o.react = Math.max(o.react, s || 1.2); o.reactExpr = 'happy'; },
      syncFromState: st => { this.pm.override[id] = st.equipped; } }) : undefined });
    this.ui = new UIManager(this);
    this.ui.syncHUD();
    this.engine.layers.push((c, e) => this.drawPreview(c, e));
    this.engine.updaters.push(dt => { const e = this.engine, port = e.H > e.W * 1.1, want = (port && this.mode === 'shop') ? Math.max(0, e.baseOffY - ((.4 * e.H) / e.scale - 505)) : 0; e.lift = (e.lift || 0) + (want - (e.lift || 0)) * Math.min(1, dt * 6); });
    setInterval(() => { if (this.mode === 'world') { this.save.tickNeeds(); this.ui.syncHUD(); } }, 15000);
    // offline catch-up: pets miss you a little while you're away (1 tick per 30 s away, max 12)
    { const seen = +localStorage.getItem('cozy_seen') || 0, n = seen ? Math.min(12, Math.floor((Date.now() - seen) / 30000)) : 0; for (let i = 0; i < n; i++) this.save.tickNeeds(); const mark = () => localStorage.setItem('cozy_seen', String(Date.now())); mark(); setInterval(mark, 10000); document.addEventListener('visibilitychange', mark); }
    // daily welcome-back gift with a 7-day streak bonus (kept in its own localStorage key)
    setInterval(() => { if (this.mode !== 'world') return; let d = {}; try { d = JSON.parse(localStorage.getItem('cozy_daily') || '{}'); } catch (e) { d = {}; }
      const today = new Date().toDateString(); if (d.d === today) return; const y = new Date(Date.now() - 864e5).toDateString(), streak = d.d === y ? Math.min(7, (d.s || 0) + 1) : 1, gift = 10 + (streak === 7 ? 25 : 0);
      localStorage.setItem('cozy_daily', JSON.stringify({ d: today, s: streak })); this.save.addReward(gift, 0); this.ui.syncHUD(); this.toast('Welcome back! Day ' + streak + ' - gift +' + gift + ' coins'); }, 4000);
    addEventListener('pointerdown', () => this.sound.resume?.(), { once: true });
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
    requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(() => { const b = $('boot'); if (b) { b.classList.add('gone'); setTimeout(() => b.remove(), 700); } }, 600)));
  }
  onStation(s, first) {
    if (this.mode !== 'world') return;
    this.ui.showStationProximity(s ? { ...s, icon: s.icon } : null);
  }
  wipe() { const w = $('wipe'); if (!w) return; w.classList.remove('go', 'done'); void w.offsetWidth; w.classList.add('go'); clearTimeout(this._wt); this._wt = setTimeout(() => { w.classList.remove('go'); w.classList.add('done'); }, 700); }
  toast(msg) { let t = $('toast2d'); if (!t) { t = document.createElement('div'); t.id = 'toast2d'; t.style.cssText = 'position:fixed;left:50%;top:18%;transform:translateX(-50%);background:#fff8e6;border:3px solid #4a2a1c;border-radius:22px;padding:10px 20px;font:700 18px Fredoka,system-ui;color:#4a2a1c;z-index:400;max-width:80vw;text-align:center;pointer-events:none;transition:opacity .3s'; document.body.appendChild(t); } t.textContent = msg; t.style.opacity = 1; clearTimeout(this._tt); this._tt = setTimeout(() => t.style.opacity = 0, 2600); }
  applyGraphicsSettings() {} rebuildAvatar() {} setJoystickInput(x, y) { this.world.joy = { x, y }; }
  onGameStart() {
    const u = this.ui; u.titleScreen.classList.add('hidden'); u.hudTop.classList.remove('hidden'); u.speechBar.classList.remove('hidden'); u.worldHudBottom.classList.remove('hidden');
    if (!this.save.state.avatarCreated) u.openAvatarModal(); else this.checkInitialPetAdoption();
  }
  checkInitialPetAdoption() {
    this.mode = 'world'; this.ui.worldHudBottom.classList.remove('hidden');
    if (!this.save.state.pets.capybara.adopted) this.ui.openPetAdoptionModal('capybara', false);
    else this.ui.setSpeechPrompt('enter_salon_first', 'Welcome to your Cozy Critter Salon! Tap anywhere to walk around, or tap a glowing station!', true);
  }
  setAvatarPreviewCamera(on) { this.mode = on ? 'avatar_preview' : 'world'; this.world.av.has = false; }
  drawPreview(c, e) {
    if (this.mode !== 'avatar_preview') return; const dpr = e.dpr, W = e.W, H = e.H, port = H > W;
    c.setTransform(dpr, 0, 0, dpr, 0, 0); const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#ffd9ec'); g.addColorStop(1, '#ffb6d9'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    for (let i = 0; i < 14; i++) { c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.arc((i * 137 % 100) / 100 * W, (i * 71 % 100) / 100 * H, 6 + (i % 4) * 4, 0, 7); c.fill(); }
    const s = (port ? H * .34 : H * .62) / 260, cx = port ? W / 2 : W * .27, fy = port ? H * .4 : H * .84;
    c.fillStyle = 'rgba(120,40,90,.2)'; c.beginPath(); c.ellipse(cx, fy + 4, 90 * s, 16 * s, 0, 0, 7); c.fill();
    c.save(); c.translate(cx, fy); c.scale(s, s); drawAvatar(c, this.save.state.avatar, { t: e.time, walking: 0, wave: false, blink: Math.sin(e.time * 1.4) > .97 }); c.restore();
  }
  selectPet(petId) {
    this.save.setActivePet(petId); this.ui.syncHUD(); const ps = this.save.state.pets[petId], o = this.pm.pets[petId]; if (o) { o.react = 1.4; o.reactExpr = 'happy'; }
    if (!ps.adopted) this.ui.openPetAdoptionModal(petId, false); else { const need = this.save.getPetPrimaryNeed(petId); if (need) this.ui.setSpeechPrompt(need.voiceId, need.text, true); }
    if (this.scene.active) { const k = this.scene.active.kind; this.scene.exit(); this.scene.enter(k); }
  }
  toggleCallPets() { this.pm.callAll = !this.pm.callAll; for (const o of Object.values(this.pm.pets)) { o.react = 1; o.reactExpr = 'happy'; } if (this.pm.callAll) this.ui.setSpeechPrompt('call_pets', 'Here critters! Come follow me!', true); }
  walkToOrEnterStation(id) { const st = STATIONS.find(s => s.id === id); if (!st) return; if (this.mode !== 'world') this.exitActivity(); const a = this.world.av; a.x = st.room * RW + st.x - 30; a.y = Math.min(512, st.y + 20); a.has = false; this.world.e.cam.x = a.x - this.world.e.visW / 2; for (const o of Object.values(this.pm.pets)) if (o.id === this.save.state.activePet || this.pm.callAll) { o.x = a.x - 70; o.y = a.y; } this.enterStation(id); }
  enterStation(id) {
    const st = STATIONS.find(s => s.id === id); if (!st) return; const u = this.ui;
    this.wipe(); this.activeStation = st; u.showStationProximity(null); u.worldHudBottom.classList.add('hidden');
    for (const m of ['avatarModal', 'clipboardModal', 'settingsModal', 'shopModal', 'photoModal']) u[m]?.classList.add('hidden');
    u.updateRoomBanner(({ kitchen: 'kitchen', spa: 'spa', lobby: 'lobby', shop: 'lobby', photobooth: 'lobby', vet: 'clinic', yard: 'yard' })[id]);
    this.sound.setRoomMood?.(st.room);
    if (ACTIVITIES.includes(id)) { this.mode = 'activity'; this.scene.enter(id); u.speechBar.classList.add('hidden'); $('pet-switcher')?.classList.add('hidden'); }
    else if (id === 'shop') { this.mode = 'shop'; u.openShopModal(); }
    else if (id === 'photobooth') { this.mode = 'photobooth'; u.openPhotoBoothModal(); }
    else { this.mode = 'activity'; u.openClipboardModal(); }
  }
  exitActivity() {
    if (this.scene.active) this.scene.exit(true); $('pet-switcher')?.classList.remove('hidden'); this.ui.speechBar.classList.remove('hidden'); this.activeStation = null; if (this.mode !== 'world') this.wipe(); this.mode = 'world'; const u = this.ui;
    for (const m of ['avatarModal', 'shopModal', 'photoModal', 'clipboardModal']) u[m]?.classList.add('hidden'); u.activityHud?.classList.add('hidden'); u.btnBackSalon?.classList.add('hidden'); u.worldHudBottom.classList.remove('hidden');
    for (const o of Object.values(this.pm.pets)) delete this.pm.override[o.id]; u.syncHUD();
  }
  completeRoutine(voiceId, message, coins, stars) { this.save.addReward(coins, stars); this.sound.playFanfare(); this.ui.syncHUD(); this.ui.setSpeechPrompt(voiceId, message, true); this.ui.showRewardModal(message, coins, stars); }
  snapPhoto(frameStyle = 'hearts') {
    this.sound.playShutter?.(); this.voice.speak('photobooth_snap', 'Cheese! What a superstar picture!');
    const out = document.createElement('canvas'); out.width = 640; out.height = 420; const ctx = out.getContext('2d'), frameEl = $('photo-frame-overlay'), cv = this.canvas, sx = cv.width / (cv.clientWidth || cv.width), sy = cv.height / (cv.clientHeight || cv.height);
    if (frameEl) { const r = frameEl.getBoundingClientRect(), inset = 14, cw = (r.width - inset * 2) * sx, ch = (r.height - inset * 2) * sy; out.height = Math.max(200, Math.round(out.width * (ch / cw))); ctx.drawImage(cv, (r.left + inset) * sx, (r.top + inset) * sy, cw, ch, 0, 0, out.width, out.height); } else ctx.drawImage(cv, 0, 0, out.width, out.height);
    ctx.strokeStyle = { hearts: '#ff6b9d', gold: '#ffd43b', ocean: '#4dabf7', flowers: '#69db7c' }[frameStyle] || '#ff6b9d'; ctx.lineWidth = 22; ctx.strokeRect(11, 11, out.width - 22, out.height - 22);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 24px Fredoka, sans-serif'; const pn = this.save.getActivePet().customName; ctx.fillText(`${this.save.state.avatar.name} & ${pn}`, 28, out.height - 26);
    const dataUrl = out.toDataURL('image/jpeg', .86); this.save.state.photoAlbum.unshift({ id: Date.now(), dataUrl, caption: `${this.save.state.avatar.name} & ${pn}` }); this.save.state.photoAlbum = this.save.state.photoAlbum.slice(0, 16); this.save.addReward(15, 0); this.ui.syncHUD(); this.ui.photoFlash();
  }
}
const app = new App(); window.app = app; window.flat = { engine: app.engine, world: app.world, save: app.save, pets: app.pm, scene: app.scene, sound: app.sound, voice: app.voice, app }; window.__ready = true;
