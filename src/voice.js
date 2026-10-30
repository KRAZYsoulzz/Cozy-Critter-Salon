// ============================================================================
// Cozy Critter Salon & Spa - Voice & Read-Along Karaoke Engine
// Plays natural MP3 clips from /audio/voice/<id>.mp3 with word-by-word karaoke
// highlighting. No speechSynthesis anywhere (ElevenLabs clips only).
// ============================================================================

export class VoiceEngine {
  constructor(saveManager, soundEngine) {
    this.saveManager = saveManager;
    this.soundEngine = soundEngine;
    this.lines = {};
    this.audioEl = new Audio();
    this.audioEl.preload = 'auto';
    this.karaokeTimer = null;
    this.currentWordSpans = [];
    this.activeId = null;
    this.preferredSynthVoice = null;

    this.loadManifest();
    this.initSpeechFallback();
  }

  async loadManifest() {
    try {
      const res = await fetch('./audio/voice/lines.json');
      if (res.ok) {
        const data = await res.json();
        this.lines = data.lines || {};
      }
    } catch (e) {
      console.warn('VoiceEngine: Could not load lines.json', e);
    }
  }

  initSpeechFallback() {
    // Intentionally empty: the game NEVER uses the OS robot voice. Every spoken line is a pre-rendered ElevenLabs "Clara" clip.
  }

  getSettings() {
    return this.saveManager?.state?.settings || {
      readToMe: true,
      voiceVolume: 1.0,
      readSpeed: 0.96
    };
  }

  stop() {
    if (this.karaokeTimer) {
      cancelAnimationFrame(this.karaokeTimer);
      this.karaokeTimer = null;
    }
    this.clearWordHighlights();
    try {
      this.audioEl.pause();
      this.audioEl.currentTime = 0;
    } catch { /* ignore */ }
    this.soundEngine?.setVoiceDucking(false);
  }

  clearWordHighlights() {
    for (const span of this.currentWordSpans) {
      span.classList.remove('speaking-word');
    }
  }

  /**
   * Renders interactive word spans into `containerEl` so each word can highlight
   * during karaoke playback AND be tapped individually by a young reader.
   */
  renderInteractiveText(containerEl, text, highlightKeywords = []) {
    if (!containerEl) return [];
    containerEl.innerHTML = '';
    const tokens = String(text || '').split(/(\s+)/);
    const wordSpans = [];
    const kwSet = new Set(highlightKeywords.map(k => k.toLowerCase()));

    for (const tok of tokens) {
      if (/^\s+$/.test(tok)) {
        containerEl.appendChild(document.createTextNode(tok));
        continue;
      }
      if (!tok) continue;
      const span = document.createElement('span');
      span.className = 'voice-word';
      const clean = tok.replace(/[^a-zA-Z0-9'-]/g, '').toLowerCase();
      if (kwSet.has(clean) || clean.length >= 6) {
        span.classList.add('keyword-word');
      }
      span.textContent = tok;
      span.addEventListener('pointerdown', e => {
        e.stopPropagation();
        this.speakSingleWord(clean || tok, span);
      });
      containerEl.appendChild(span);
      wordSpans.push(span);
    }

    this.currentWordSpans = wordSpans;
    return wordSpans;
  }

  /**
   * Speaks a line by `id` (from /audio/voice/<id>.mp3) and optionally renders/highlights
   * the words inside `containerEl`.
   */
  async speak(id, customText = null, containerEl = null, force = false) {
    const text = customText || this.lines[id] || '';
    const wordSpans = containerEl ? this.renderInteractiveText(containerEl, text) : this.currentWordSpans;

    const settings = this.getSettings();
    if (!settings.readToMe && !force) return;
    if ((settings.voiceVolume ?? 1) <= 0.01) return;

    this.stop();
    this.currentWordSpans = wordSpans || [];
    this.activeId = id;

    if (id) {
      const mp3Url = `./audio/voice/${id}.mp3`;
      try {
        this.audioEl.src = mp3Url;
        this.audioEl.volume = Math.max(0, Math.min(1, settings.voiceVolume ?? 1));
        this.audioEl.playbackRate = Math.max(0.75, Math.min(1.25, settings.readSpeed ?? 0.96));
        this.soundEngine?.setVoiceDucking(true);

        await this.audioEl.play();
        this.startKaraokeLoop(this.currentWordSpans);
        this.audioEl.onended = () => {
          this.clearWordHighlights();
          this.soundEngine?.setVoiceDucking(false);
        };
        return;
      } catch (err) {
        // MP3 missing or autoplay-blocked: stay silent (never the OS voice). Log missing ids so they can be generated.
        this.soundEngine?.setVoiceDucking(false);
        if (err && err.name === 'NotSupportedError') console.warn('VoiceEngine: missing voice clip for id', id);
      }
    } else if (text) {
      console.warn('VoiceEngine: line without a clip id (silent):', text.slice(0, 50));
    }
  }

  startKaraokeLoop(wordSpans) {
    if (!wordSpans || wordSpans.length === 0) return;

    // Weight each word by character length so longer words stay highlighted proportionally longer
    const weights = wordSpans.map(s => Math.max(2, (s.textContent || '').length));
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const cumulative = [];
    let acc = 0;
    for (const w of weights) {
      acc += w / totalWeight;
      cumulative.push(acc);
    }

    const tick = () => {
      if (this.audioEl.paused || this.audioEl.ended) {
        this.clearWordHighlights();
        return;
      }
      const dur = this.audioEl.duration;
      if (dur && isFinite(dur) && dur > 0.1) {
        // Trim ~4% lead-in/out silence for snappy sync
        const progress = Math.max(0, Math.min(0.999, (this.audioEl.currentTime - 0.04) / (dur * 0.92)));
        let activeIdx = cumulative.findIndex(c => progress <= c);
        if (activeIdx === -1) activeIdx = wordSpans.length - 1;
        wordSpans.forEach((s, idx) => {
          s.classList.toggle('speaking-word', idx === activeIdx);
        });
      }
      this.karaokeTimer = requestAnimationFrame(tick);
    };
    this.karaokeTimer = requestAnimationFrame(tick);
  }

  speakSingleWord(word, spanEl) {
    if (!word) return;
    this.soundEngine?.playBubblePop();
    this.clearWordHighlights();
    if (spanEl) {
      spanEl.classList.add('speaking-word');
      setTimeout(() => spanEl.classList.remove('speaking-word'), 650);
    }
    // Tap-a-word: pop + highlight only (no per-word clips, no OS TTS).
  }
}
