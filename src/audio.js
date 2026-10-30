// ============================================================================
// Cozy Critter Salon & Spa - Web Audio SFX & Gentle Marimba Music Engine
// ============================================================================

const ROOM_SCALES = {
  exterior: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25], // C major pentatonic
  lobby:    [293.66, 329.63, 369.99, 440.00, 493.88, 587.33], // D major pentatonic
  spa:      [261.63, 311.13, 349.23, 392.00, 466.16, 523.25], // Warm dream spa
  clinic:   [329.63, 369.99, 415.30, 493.88, 554.37, 659.25], // Gentle E major
  kitchen:  [349.23, 392.00, 440.00, 523.25, 587.33, 698.46], // Sunny F major
  yard:     [392.00, 440.00, 493.88, 587.33, 659.25, 783.99]  // Playful G major
};

export class SoundEngine {
  constructor(saveManager) {
    this.saveManager = saveManager;
    this.ctx = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.musicTimer = null;
    this.currentRoom = 'lobby';
    this.stepIndex = 0;
    this.voiceDucked = false;
    this.lastScrubAt = 0;
    this.lastFootstepAt = 0;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.musicGain.connect(this.ctx.destination);
      this.sfxGain.connect(this.ctx.destination);
      this.updateVolumes();
      this.startMusicLoop();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  getSettings() {
    return this.saveManager?.state?.settings || {
      musicVolume: 0.45,
      sfxVolume: 0.85
    };
  }

  updateVolumes() {
    if (!this.ctx) return;
    const s = this.getSettings();
    const baseMusic = (s.musicVolume ?? 0.45) * 0.16; // Gentle & soft
    const targetMusic = this.voiceDucked ? baseMusic * 0.28 : baseMusic;
    this.musicGain.gain.setTargetAtTime(targetMusic, this.ctx.currentTime, 0.12);
    this.sfxGain.gain.setTargetAtTime((s.sfxVolume ?? 0.85) * 0.45, this.ctx.currentTime, 0.05);
  }

  setVoiceDucking(ducked) {
    this.voiceDucked = Boolean(ducked);
    this.updateVolumes();
  }

  setRoomMood(room) {
    if (ROOM_SCALES[room]) {
      this.currentRoom = room;
    }
  }

  startMusicLoop() {
    if (this.musicTimer) return;
    const playStep = () => {
      if (this.ctx && this.ctx.state === 'running') {
        const s = this.getSettings();
        if ((s.musicVolume ?? 0.45) > 0.02) {
          this.playMarimbaNote();
        }
      }
      this.musicTimer = setTimeout(playStep, 680);
    };
    this.musicTimer = setTimeout(playStep, 680);
  }

  playMarimbaNote() {
    const ctx = this.ctx;
    if (!ctx) return;
    const scale = ROOM_SCALES[this.currentRoom] || ROOM_SCALES.lobby;
    const pattern = [0, 2, 4, 2, 5, 3, 1, 2];
    const noteIdx = pattern[this.stepIndex % pattern.length];
    this.stepIndex++;

    const freq = scale[noteIdx % scale.length];
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.28, now + 0.025);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.62);

    osc.connect(g);
    g.connect(this.musicGain);
    osc.start(now);
    osc.stop(now + 0.65);

    // Occasional warm fifth harmonic
    if (this.stepIndex % 4 === 0) {
      const sub = ctx.createOscillator();
      const sg = ctx.createGain();
      sub.type = 'triangle';
      sub.frequency.setValueAtTime(freq * 0.5, now);
      sg.gain.setValueAtTime(0.001, now);
      sg.gain.linearRampToValueAtTime(0.14, now + 0.04);
      sg.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      sub.connect(sg);
      sg.connect(this.musicGain);
      sub.start(now);
      sub.stop(now + 0.95);
    }
  }

  playBubblePop() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    const base = 360 + Math.random() * 180;
    osc.frequency.setValueAtTime(base, now);
    osc.frequency.exponentialRampToValueAtTime(base * 2.1, now + 0.09);
    g.gain.setValueAtTime(0.32, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.11);
  }

  playScrub() {
    const nowMs = performance.now();
    if (nowMs - this.lastScrubAt < 110) return;
    this.lastScrubAt = nowMs;

    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const bufSize = Math.floor(ctx.sampleRate * 0.08);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufSize) * Math.PI);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(950 + Math.random() * 450, now);
    filter.Q.setValueAtTime(2.5, now);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.24, now);
    g.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    src.connect(filter);
    filter.connect(g);
    g.connect(this.sfxGain);
    src.start(now);
  }

  playSplash() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    this.playBubblePop();
    this.playScrub();
  }

  playMunch() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    for (let i = 0; i < 2; i++) {
      const t = now + i * 0.11;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240 - i * 35, t);
      osc.frequency.exponentialRampToValueAtTime(110, t + 0.08);
      g.gain.setValueAtTime(0.35, t);
      g.gain.exponentialRampToValueAtTime(0.005, t + 0.09);
      osc.connect(g);
      g.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.095);
    }
  }

  playSlurp() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(720, now + 0.22);
    g.gain.setValueAtTime(0.3, now);
    g.gain.exponentialRampToValueAtTime(0.005, now + 0.24);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  playHeartChime() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const t = ctx.currentTime + i * 0.065;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.26, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(g);
      g.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.36);
    });
  }

  playCoinEarned() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const freqs = [987.77, 1318.51];
    freqs.forEach((f, i) => {
      const t = now + i * 0.075;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.32, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      osc.connect(g);
      g.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.3);
    });
  }

  playBandageRip() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(640, now + 0.12);
    g.gain.setValueAtTime(0.18, now);
    g.gain.exponentialRampToValueAtTime(0.005, now + 0.13);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  playHeartbeat() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [0, 0.18].forEach((offset, idx) => {
      const t = now + offset;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(idx === 0 ? 95 : 80, t);
      osc.frequency.exponentialRampToValueAtTime(48, t + 0.12);
      g.gain.setValueAtTime(0.45, t);
      g.gain.exponentialRampToValueAtTime(0.005, t + 0.14);
      osc.connect(g);
      g.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.15);
    });
  }

  playFanfare() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const chord = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    chord.forEach((freq, idx) => {
      const t = ctx.currentTime + idx * 0.085;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.32, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
      osc.connect(g);
      g.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.58);
    });
  }

  playFootstep() {
    const nowMs = performance.now();
    if (nowMs - this.lastFootstepAt < 230) return;
    this.lastFootstepAt = nowMs;

    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160 + Math.random() * 35, now);
    osc.frequency.exponentialRampToValueAtTime(75, now + 0.055);
    g.gain.setValueAtTime(0.14, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.065);
  }

  playDoorChime() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [659.25, 880.0].forEach((f, i) => {
      const t = now + i * 0.11;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.24, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.connect(g);
      g.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.42);
    });
  }

  playShutter() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    this.playScrub();
    this.playHeartChime();
  }

  playSqueak() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(680, now);
    osc.frequency.exponentialRampToValueAtTime(980, now + 0.07);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.14);
    g.gain.setValueAtTime(0.25, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  // Soft bubbly pop for every UI button press
  playUITap(big = false) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    const f = (big ? 520 : 640) * (0.96 + Math.random() * 0.1);
    osc.frequency.setValueAtTime(f, now);
    osc.frequency.exponentialRampToValueAtTime(f * 1.7, now + 0.07);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(big ? 0.34 : 0.22, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    osc.connect(g); g.connect(this.sfxGain || ctx.destination);
    osc.start(now); osc.stop(now + 0.18);
  }

  // Airy swoosh for room transitions
  playWhoosh() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const len = Math.floor(ctx.sampleRate * 0.5);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * i / len);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.4;
    bp.frequency.setValueAtTime(500, now); bp.frequency.exponentialRampToValueAtTime(2600, now + 0.45);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.16, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    src.connect(bp); bp.connect(g); g.connect(this.sfxGain || ctx.destination);
    src.start(now);
  }}

