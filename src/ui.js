// ============================================================================
// Cozy Critter Salon & Spa - Kid-First UI, Modals, Shop & Photo Booth (ui.js)
// ============================================================================
import { iconSVG } from './icons.js';
import {
  SKIN_TONES,
  HAIR_STYLES,
  HAIR_COLORS,
  AVATAR_OUTFITS,
  CUTE_PET_NAMES,
  CUTE_AVATAR_NAMES,
  PET_SPECIES
} from './save.js';
import { SHOP_ITEMS, ROOM_UPGRADES } from './shop-data.js';
import { ROOM_INFO } from './world.js';

export function bindTap(el, handler) {
  if (!el) return;
  let last = 0;
  const run = (e) => {
    const now = performance.now();
    if (now - last < 220) return;
    last = now;
    handler(e);
  };
  el.addEventListener('pointerdown', run);
  el.addEventListener('click', run);
}

export class UIManager {
  constructor(app) {
    this.app = app;
    this.activeShopTab = 'girly';
    this.activePhotoFrame = 'hearts';
    this.parentGateHoldTimer = null;
    this.parentGateStart = 0;
    this.namingPetId = 'capybara';

    this.cacheDOM();
    this.injectStaticIcons();
    this.bindEvents();
  }

  cacheDOM() {
    this.titleScreen = document.getElementById('title-screen');
    this.btnPlayGame = document.getElementById('btn-play-game');

    // Top HUD
    this.hudTop = document.getElementById('hud-top');
    this.coinCountEl = document.getElementById('coin-count');
    this.starCountEl = document.getElementById('star-count');
    this.roomBannerText = document.getElementById('room-banner-text');
    this.roomBannerIcon = document.getElementById('room-banner-icon');
    this.petSwitcherEl = document.getElementById('pet-switcher');
    this.btnReadToggle = document.getElementById('btn-read-toggle');
    this.btnSettingsGate = document.getElementById('btn-settings-gate');
    this.gateProgressRing = document.getElementById('gate-progress-ring');

    // Speech & Karaoke Bar
    this.speechBar = document.getElementById('speech-bar');
    this.speechTextEl = document.getElementById('speech-text');
    this.btnReplayVoice = document.getElementById('btn-replay-voice');

    // World Bottom Action Bar & Station Proximity Button
    this.worldHudBottom = document.getElementById('world-hud-bottom');
    this.stationPromptBtn = document.getElementById('btn-station-prompt');
    this.stationPromptIcon = document.getElementById('station-prompt-icon');
    this.stationPromptLabel = document.getElementById('station-prompt-label');
    this.btnCallPets = document.getElementById('btn-call-pets');
    this.btnOpenClipboard = document.getElementById('btn-open-clipboard');
    this.btnOpenShop = document.getElementById('btn-open-shop');
    this.btnOpenPhoto = document.getElementById('btn-open-photo');
    this.btnEditAvatar = document.getElementById('btn-edit-avatar');

    // Activity HUD
    this.activityHud = document.getElementById('activity-hud');
    this.btnBackSalon = document.getElementById('btn-back-salon');
    this.activityProgressFill = document.getElementById('activity-progress-fill');
    this.activityToolDock = document.getElementById('activity-tool-dock');

    // Modals
    this.avatarModal = document.getElementById('avatar-modal');
    this.petNameModal = document.getElementById('pet-name-modal');
    this.clipboardModal = document.getElementById('clipboard-modal');
    this.shopModal = document.getElementById('shop-modal');
    this.photoModal = document.getElementById('photo-modal');
    this.rewardModal = document.getElementById('reward-modal');
    this.settingsModal = document.getElementById('settings-modal');

    // Optional Joystick
    this.joystickZone = document.getElementById('joystick-zone');
    this.joystickKnob = document.getElementById('joystick-knob');
  }

  injectStaticIcons() {
    const setIcon = (id, name, size = 34) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = iconSVG(name, size);
    };
    setIcon('icon-coin-hud', 'coin', 34);
    setIcon('icon-star-hud', 'star', 34);
    setIcon('icon-play-btn', 'play', 40);
    setIcon('icon-back-home', 'home', 36);
    setIcon('icon-settings-gear', 'gear', 30);
    setIcon('icon-replay-voice', 'speakerOn', 28);
    document.querySelectorAll('[data-nav-icon]').forEach(el => {
      el.innerHTML = iconSVG(el.getAttribute('data-nav-icon'), 40);
    });
    this.updateSpeakerIcon();
  }

  updateSpeakerIcon() {
    const on = this.app.save.state.settings.readToMe;
    const el = document.getElementById('icon-read-toggle');
    if (el) el.innerHTML = iconSVG(on ? 'speakerOn' : 'speakerOff', 32);
    if (this.btnReadToggle) {
      this.btnReadToggle.classList.toggle('muted', !on);
    }
  }

  bindEvents() {
    // Title Screen PLAY!
    this.btnPlayGame?.addEventListener('pointerdown', () => {
      this.app.sound.ensureContext();
      this.app.sound.playFanfare();
      this.titleScreen.classList.add('hidden');
      this.app.onGameStart();
    });

    // Read-to-Me Toggle
    this.btnReadToggle?.addEventListener('pointerdown', () => {
      this.app.sound.playBubblePop();
      const s = this.app.save.state.settings;
      s.readToMe = !s.readToMe;
      this.app.save.save();
      this.updateSpeakerIcon();
      if (!s.readToMe) this.app.voice.stop();
    });

    // Replay current prompt aloud
    this.btnReplayVoice?.addEventListener('pointerdown', () => {
      this.app.sound.playBubblePop();
      if (this.lastVoiceId || this.lastVoiceText) {
        this.app.voice.speak(this.lastVoiceId, this.lastVoiceText, this.speechTextEl, true);
      }
    });

    // Back to Salon from Activity/Shop/Photo
    this.btnBackSalon?.addEventListener('pointerdown', () => {
      this.app.sound.playDoorChime();
      this.app.exitActivity();
    });

    // Proximity Station Button
    this.stationPromptBtn?.addEventListener('pointerdown', () => {
      if (this.currentPromptStation) {
        this.app.sound.playDoorChime();
        this.app.enterStation(this.currentPromptStation.id);
      }
    });

    // Bottom Quick Action Buttons
    this.btnCallPets?.addEventListener('pointerdown', () => {
      this.app.sound.playHeartChime();
      this.app.toggleCallPets();
    });

    this.btnOpenClipboard?.addEventListener('pointerdown', () => {
      this.app.sound.playBubblePop();
      this.openClipboardModal();
    });

    this.btnOpenShop?.addEventListener('pointerdown', () => {
      this.app.sound.playDoorChime();
      this.app.enterStation('shop');
    });

    this.btnOpenPhoto?.addEventListener('pointerdown', () => {
      this.app.sound.playDoorChime();
      this.app.enterStation('photobooth');
    });

    this.btnEditAvatar?.addEventListener('pointerdown', () => {
      this.app.sound.playBubblePop();
      this.openAvatarModal();
    });

    // Quick Room Jump Pills
    document.querySelectorAll('[data-jump-station]').forEach(btn => {
      btn.addEventListener('pointerdown', () => {
        const stId = btn.getAttribute('data-jump-station');
        this.app.sound.playBubblePop();
        this.app.walkToOrEnterStation(stId);
      });
    });

    // Parent Gate (Hold for 3.0 seconds)
    const startGateHold = e => {
      e.preventDefault();
      this.cancelGateHold();
      this.parentGateStart = performance.now();
      this.gateProgressRing?.classList.remove('hidden');
      // Real-time 3 second timer (does not depend on frame rate), ring is purely visual.
      this.parentGateTimeout = setTimeout(() => {
        this.parentGateTimeout = null;
        this.cancelGateHold();
        this.openSettingsModal();
      }, 3000);
      const tick = () => {
        const pct = Math.min(1, (performance.now() - this.parentGateStart) / 3000);
        if (this.gateProgressRing) {
          this.gateProgressRing.style.strokeDashoffset = String(113 * (1 - pct));
        }
        if (pct < 1) this.parentGateHoldTimer = requestAnimationFrame(tick);
      };
      this.parentGateHoldTimer = requestAnimationFrame(tick);
    };
    const cancelGate = () => this.cancelGateHold();
    this.btnSettingsGate?.addEventListener('pointerdown', startGateHold);
    this.btnSettingsGate?.addEventListener('pointerup', cancelGate);
    this.btnSettingsGate?.addEventListener('pointerleave', cancelGate);
    this.btnSettingsGate?.addEventListener('pointercancel', cancelGate);

    this.bindJoystick();
  }

  cancelGateHold() {
    if (this.parentGateTimeout) {
      clearTimeout(this.parentGateTimeout);
      this.parentGateTimeout = null;
    }
    if (this.parentGateHoldTimer) {
      cancelAnimationFrame(this.parentGateHoldTimer);
      this.parentGateHoldTimer = null;
    }
    if (this.gateProgressRing) {
      this.gateProgressRing.classList.add('hidden');
      this.gateProgressRing.style.strokeDashoffset = '113';
    }
  }

  // --------------------------------------------------------------------------
  // Top HUD & Pet Switcher Sync
  // --------------------------------------------------------------------------
  syncHUD() {
    const state = this.app.save.state;
    if (this.coinCountEl) this.coinCountEl.textContent = String(state.coins);
    if (this.starCountEl) this.starCountEl.textContent = String(state.stars);
    this.updateSpeakerIcon();
    this.renderPetSwitcher();
    if (this.joystickZone) {
      this.joystickZone.classList.toggle('hidden', !state.settings.showJoystick || this.app.mode !== 'world');
    }
  }

  updateRoomBanner(roomId) {
    const info = ROOM_INFO[roomId] || ROOM_INFO.lobby;
    if (this.roomBannerText) this.roomBannerText.textContent = info.name;
    if (this.roomBannerIcon) this.roomBannerIcon.innerHTML = iconSVG(info.icon, 28);
  }

  renderPetSwitcher() {
    if (!this.petSwitcherEl) return;
    const state = this.app.save.state;
    this.petSwitcherEl.innerHTML = '';

    for (const petId of ['capybara', 'axolotl', 'dikdik']) {
      const pet = state.pets[petId];
      const need = this.app.save.getPetPrimaryNeed(petId);
      const isActive = state.activePet === petId;

      const btn = document.createElement('button');
      btn.className = `pet-pill ${isActive ? 'active' : ''}`;
      btn.innerHTML = `
        <span class="pet-pill-avatar">${iconSVG(petId, 38)}</span>
        <span class="pet-pill-name">${pet.customName}</span>
        <span class="pet-pill-need">${iconSVG(need.icon, 22)}</span>
      `;
      btn.addEventListener('pointerdown', () => {
        this.app.sound.playBubblePop();
        this.app.selectPet(petId);
      });
      this.petSwitcherEl.appendChild(btn);
    }

    // Rename pencil button for active pet
    const renameBtn = document.createElement('button');
    renameBtn.className = 'icon-round-btn rename-pet-btn';
    renameBtn.title = 'Rename Pet';
    renameBtn.innerHTML = iconSVG('pencil', 26);
    renameBtn.addEventListener('pointerdown', () => {
      this.app.sound.playBubblePop();
      this.openPetAdoptionModal(state.activePet, true);
    });
    this.petSwitcherEl.appendChild(renameBtn);
  }

  setSpeechPrompt(voiceId, text, speak = true) {
    this.lastVoiceId = voiceId;
    this.lastVoiceText = text;
    if (speak) {
      this.app.voice.speak(voiceId, text, this.speechTextEl);
    } else {
      this.app.voice.renderInteractiveText(this.speechTextEl, text);
    }
  }

  setActivityPrompt(voiceId, text) {
    this.setSpeechPrompt(voiceId, text, true);
  }

  updateActivityProgress(pct) {
    if (this.activityProgressFill) {
      this.activityProgressFill.style.width = `${Math.max(0, Math.min(100, pct))}%`;
    }
  }

  showStationProximity(station) {
    if (!this.stationPromptBtn) return;
    if (!station) {
      this.currentPromptStation = null;
      this.stationPromptBtn.classList.add('hidden');
      return;
    }
    const changed = !this.currentPromptStation || this.currentPromptStation.id !== station.id;
    this.currentPromptStation = station;
    this.stationPromptIcon.innerHTML = iconSVG(station.icon, 42);
    this.stationPromptLabel.textContent = station.name;
    this.stationPromptBtn.classList.remove('hidden');

    if (changed) {
      this.app.sound.playBubblePop();
      this.setSpeechPrompt(station.voiceId, `${station.name}! Tap the glowing button to play!`, true);
    }
  }

  // --------------------------------------------------------------------------
  // Activity Tool Dock
  // --------------------------------------------------------------------------
  renderToolDock(tools, activeId, onSelect) {
    if (!this.activityToolDock) return;
    this.activityToolDock.innerHTML = '';
    this.activityToolDock.classList.toggle('many', tools.length > 6);

    for (const t of tools) {
      const isSelected = t.id === activeId;
      const locked = !!t.lockAt && ((this.app.save.state.routinesCompleted || 0) < t.lockAt);
      const btn = document.createElement('button');
      btn.className = `dock-tool-btn ${isSelected ? 'active' : ''} ${t.isFavorite ? 'favorite-food' : ''} ${t.done ? 'done' : ''}`;
      if (t.color) btn.style.setProperty('--tool-accent', t.color);
      btn.innerHTML = `
        ${isSelected ? `<span class="dock-hint-arrow">${iconSVG('arrowDown', 28)}</span>` : ''}
        ${t.done ? '<span class="dock-done-badge">&#10003;</span>' : ''}
        ${locked ? '<span class="dock-lock-badge"><svg viewBox="0 0 24 24" width="26" height="26"><rect x="4" y="10" width="16" height="12" rx="3" fill="#ffd43b" stroke="#3a2420" stroke-width="2.2"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="#3a2420" stroke-width="2.6" stroke-linecap="round"/></svg></span>' : ''}
        <span class="dock-tool-icon">${iconSVG(t.icon, 42)}</span>
        <span class="dock-tool-label">${t.label}</span>
      `;
      if (locked) btn.classList.add('locked');
      btn.addEventListener('pointerdown', e => {
        e.stopPropagation();
        this.app.sound.playBubblePop();
        if (locked) { btn.classList.remove('shake'); void btn.offsetWidth; btn.classList.add('shake'); this.app.toast && this.app.toast(`Finish ${t.lockAt} care routines to unlock ${t.label}! (${this.app.save.state.routinesCompleted || 0} done)`); return; }
        onSelect(t.id);
        this.renderToolDock(tools, t.id, onSelect);
      });
      this.activityToolDock.appendChild(btn);
    }
  }

  // --------------------------------------------------------------------------
  // 1. AVATAR CREATOR MODAL (with live 3D character preview on left!)
  // --------------------------------------------------------------------------
  openAvatarModal() {
    const av = this.app.save.state.avatar;
    this.avatarModal.classList.remove('hidden');
    this.worldHudBottom.classList.add('hidden'); // the creator panel never sits on top of the nav bar
    this.app.setAvatarPreviewCamera(true);
    this.setSpeechPrompt('avatar_creator_intro', "Let's create your stylist character! Pick your hair, outfit, and name!");

    const nameInput = document.getElementById('avatar-name-input');
    if (nameInput) nameInput.value = av.name || 'Lilah';

    const renderSwatches = () => {
      // Skin tones
      const skinWrap = document.getElementById('swatches-skin');
      skinWrap.innerHTML = '';
      SKIN_TONES.forEach(s => {
        const b = document.createElement('button');
        b.className = `color-swatch ${av.skinTone === s.id ? 'selected' : ''}`;
        b.style.background = s.css;
        b.title = s.name;
        b.addEventListener('pointerdown', () => {
          av.skinTone = s.id;
          this.app.sound.playBubblePop();
          this.app.rebuildAvatar();
          renderSwatches();
        });
        skinWrap.appendChild(b);
      });

      // Hair styles
      const styleWrap = document.getElementById('swatches-hair-style');
      styleWrap.innerHTML = '';
      HAIR_STYLES.forEach(h => {
        const b = document.createElement('button');
        b.className = `choice-pill ${av.hairStyle === h.id ? 'selected' : ''}`;
        b.textContent = h.name;
        b.addEventListener('pointerdown', () => {
          av.hairStyle = h.id;
          this.app.sound.playBubblePop();
          this.app.rebuildAvatar();
          renderSwatches();
        });
        styleWrap.appendChild(b);
      });

      // Hair colors
      const hairColWrap = document.getElementById('swatches-hair-color');
      hairColWrap.innerHTML = '';
      HAIR_COLORS.forEach(c => {
        const b = document.createElement('button');
        b.className = `color-swatch ${av.hairColor === c.id ? 'selected' : ''}`;
        b.style.background = c.css;
        b.title = c.name;
        b.addEventListener('pointerdown', () => {
          av.hairColor = c.id;
          this.app.sound.playBubblePop();
          this.app.rebuildAvatar();
          renderSwatches();
        });
        hairColWrap.appendChild(b);
      });

      // Outfits
      const outfitWrap = document.getElementById('swatches-outfit');
      outfitWrap.innerHTML = '';
      AVATAR_OUTFITS.forEach(o => {
        const b = document.createElement('button');
        b.className = `choice-pill ${av.outfit === o.id ? 'selected' : ''}`;
        b.textContent = o.name;
        b.addEventListener('pointerdown', () => {
          av.outfit = o.id;
          this.app.sound.playBubblePop();
          this.app.rebuildAvatar();
          renderSwatches();
        });
        outfitWrap.appendChild(b);
      });
    };

    renderSwatches();

    // Tabs: one category at a time so nothing ever needs scrolling
    const showTab = tab => {
      this.creatorTab = tab;
      document.querySelectorAll('[data-creator-tab]').forEach(b => b.classList.toggle('active', b.getAttribute('data-creator-tab') === tab));
      document.querySelectorAll('[data-creator-page]').forEach(p => p.classList.toggle('hidden', p.getAttribute('data-creator-page') !== tab));
    };
    document.querySelectorAll('[data-creator-tab]').forEach(b => {
      b.onpointerdown = e => {
        e.preventDefault();
        this.app.sound.playBubblePop();
        showTab(b.getAttribute('data-creator-tab'));
      };
    });
    showTab(this.creatorTab || 'style');

    // Surprise Me! button
    const btnSurprise = document.getElementById('btn-avatar-surprise');
    bindTap(btnSurprise, () => {
      av.skinTone = SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)].id;
      av.hairStyle = HAIR_STYLES[Math.floor(Math.random() * HAIR_STYLES.length)].id;
      av.hairColor = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)].id;
      av.outfit = AVATAR_OUTFITS[Math.floor(Math.random() * AVATAR_OUTFITS.length)].id;
      if (nameInput && !nameInput.value.trim()) {
        nameInput.value = CUTE_AVATAR_NAMES[Math.floor(Math.random() * CUTE_AVATAR_NAMES.length)];
      }
      this.app.sound.playHeartChime();
      this.app.voice.speak('avatar_surprise', 'Ooh, what a super cute style!');
      this.app.rebuildAvatar();
      this.app.avatar.triggerWave();
      renderSwatches();
    });

    // Done button
    const btnDone = document.getElementById('btn-avatar-done');
    bindTap(btnDone, () => {
      av.name = (nameInput?.value || 'Lilah').trim() || 'Lilah';
      this.app.save.state.avatarCreated = true;
      this.app.save.save();
      this.app.sound.playFanfare();
      this.avatarModal.classList.add('hidden');
      this.worldHudBottom.classList.remove('hidden');
      this.app.setAvatarPreviewCamera(false);
      this.app.checkInitialPetAdoption();
    });
  }

  // --------------------------------------------------------------------------
  // 2. PET ADOPTION & NAMING MODAL
  // --------------------------------------------------------------------------
  openPetAdoptionModal(petId, isRenameOnly = false) {
    this.namingPetId = petId;
    const petState = this.app.save.state.pets[petId];
    const spec = PET_SPECIES[petId];
    this.petNameModal.classList.remove('hidden');

    document.getElementById('pet-modal-icon').innerHTML = iconSVG(petId, 68);
    document.getElementById('pet-modal-title').textContent = isRenameOnly
      ? `Rename Your ${spec.speciesName}`
      : `Meet Your New ${spec.speciesName}!`;
    document.getElementById('pet-modal-desc').textContent = spec.description;

    const input = document.getElementById('pet-name-input');
    input.value = petState.customName || spec.defaultName;

    const voiceId = `adopt_${petId}`;
    this.setSpeechPrompt(voiceId, spec.description, true);

    const btnRandom = document.getElementById('btn-random-pet-name');
    btnRandom.innerHTML = `${iconSVG('dice', 30)}<span>Cute Name!</span>`;
    bindTap(btnRandom, () => {
      const pick = CUTE_PET_NAMES[Math.floor(Math.random() * CUTE_PET_NAMES.length)];
      input.value = pick;
      this.app.sound.playBubblePop();
      this.app.voice.speakSingleWord(pick, null);
    });

    const btnSave = document.getElementById('btn-save-pet-name');
    bindTap(btnSave, () => {
      const chosen = (input.value || spec.defaultName).trim() || spec.defaultName;
      petState.customName = chosen;
      petState.adopted = true;
      this.app.save.save();
      this.syncHUD();
      this.petNameModal.classList.add('hidden');
      this.app.sound.playFanfare();
      this.app.pets[petId]?.triggerHop();
      this.app.pets[petId]?.triggerHeartEyes(2.5);
      this.setSpeechPrompt('adopted_celebrate', `Hooray! ${chosen} is so happy to be your best friend!`, true);
    });
  }

  // --------------------------------------------------------------------------
  // 3. CHECK-UP CLIPBOARD MODAL
  // --------------------------------------------------------------------------
  openClipboardModal() {
    this.clipboardModal.classList.remove('hidden');
    this.setSpeechPrompt('station_clipboard', "Checkup Clipboard! Let's see what our critters need today!", true);

    const listEl = document.getElementById('clipboard-list');
    listEl.innerHTML = '';

    for (const petId of ['capybara', 'axolotl', 'dikdik']) {
      const pet = this.app.save.state.pets[petId];
      const need = this.app.save.getPetPrimaryNeed(petId);

      const card = document.createElement('div');
      card.className = 'clipboard-card';
      card.innerHTML = `
        <div class="clipboard-pet-badge">${iconSVG(petId, 52)}</div>
        <div class="clipboard-card-body">
          <div class="clipboard-pet-title">${pet.customName}</div>
          <div class="clipboard-need-text">${need.text}</div>
        </div>
        <button class="big-pill-btn clipboard-go-btn">
          ${iconSVG(need.icon, 32)}
          <span>Let's Go!</span>
        </button>
      `;

      card.querySelector('.clipboard-go-btn').addEventListener('pointerdown', () => {
        this.app.sound.playDoorChime();
        this.clipboardModal.classList.add('hidden');
        this.app.selectPet(petId);
        this.app.enterStation(need.type);
      });

      listEl.appendChild(card);
    }

    bindTap(document.getElementById('btn-close-clipboard'), () => {
      this.app.sound.playBubblePop();
      this.clipboardModal.classList.add('hidden');
    });
  }

  // --------------------------------------------------------------------------
  // 4. 3D BOUTIQUE SHOP & ROOM UPGRADES
  // --------------------------------------------------------------------------
  openShopModal() {
    this.shopModal.classList.remove('hidden');
    this.shopSel = null;
    this.setSpeechPrompt('shop_welcome', 'Welcome to the Critter Boutique! Tap any item to try it on in 3D!', true);
    this.renderShop();

    document.querySelectorAll('[data-shop-tab]').forEach(tabBtn => {
      bindTap(tabBtn, () => {
        this.activeShopTab = tabBtn.getAttribute('data-shop-tab');
        this.app.sound.playBubblePop();
        document.querySelectorAll('[data-shop-tab]').forEach(b => b.classList.toggle('active', b === tabBtn));
        this.clearShopPreview();
        this.shopSel = null;
        this.renderShop();
      });
    });

    bindTap(document.getElementById('btn-close-shop'), () => {
      this.app.sound.playDoorChime();
      this.clearShopPreview();
      this.shopModal.classList.add('hidden');
      this.app.exitActivity();
    });
  }

  /** Put the real saved outfit back on the 3D pet (ends a try-on preview). */
  clearShopPreview() {
    const activePet = this.app.save.getActivePet();
    this.app.pets[activePet.id]?.syncFromState(activePet);
  }

  /** Try an item on the live 3D pet without buying it. */
  previewShopItem(item) {
    const activePet = this.app.save.getActivePet();
    const preview = { ...activePet, equipped: { ...activePet.equipped, [item.slot]: item.id } };
    const pet = this.app.pets[activePet.id];
    pet?.syncFromState(preview);
    pet?.triggerHop();
    pet?.triggerHeartEyes(1.2);
  }

  equipOwnedItem(item, on) {
    const state = this.app.save.state;
    const activePet = this.app.save.getActivePet();
    activePet.equipped[item.slot] = on ? item.id : null;
    if (item.avatarCompatible && (item.slot === 'hat' || item.slot === 'glasses' || item.slot === 'heldProp')) {
      state.avatar[item.slot] = activePet.equipped[item.slot];
      this.app.rebuildAvatar();
    }
    this.app.save.save();
    this.app.pets[activePet.id]?.syncFromState(activePet);
  }

  buyShopItem(item) {
    const state = this.app.save.state;
    const activePet = this.app.save.getActivePet();
    if (state.inventory.includes(item.id)) return;
    if (!this.app.save.spendCoins(item.price)) {
      this.app.sound.playBubblePop();
      this.app.voice.speak('shop_need_coins', "Let's care for our pets to earn a few more shiny coins for that!");
      return;
    }
    state.inventory.push(item.id);
    this.equipOwnedItem(item, true);
    const pet = this.app.pets[activePet.id];
    pet?.triggerHop();
    pet?.triggerHeartEyes(2.5);
    this.app.sound.playCoinEarned();
    this.app.voice.speak('shop_bought', 'Yay! It looks absolutely adorable!');
    this.syncHUD();
    this.renderShop();
  }

  buyRoomUpgrade(roomGroup, t) {
    const state = this.app.save.state;
    if (!this.app.save.spendCoins(t.price)) {
      this.app.sound.playBubblePop();
      this.app.voice.speak('shop_need_coins', "Let's care for our pets to earn a few more shiny coins for that!");
      return;
    }
    state.roomUpgrades[roomGroup.room] = t.tier;
    this.app.save.save();
    this.app.world.applyRoomUpgrades(state.roomUpgrades);
    this.app.sound.playFanfare();
    this.app.voice.speak('shop_bought', 'Yay! It looks absolutely adorable!');
    this.syncHUD();
    this.renderShop();
  }

  renderShopDetail(kind, data) {
    const box = document.getElementById('shop-detail');
    if (!box) return;
    const state = this.app.save.state;
    if (!data) {
      box.innerHTML = '<div class="shop-detail-hint">Tap something to try it on!</div>';
      return;
    }
    let owned, equipped, price, name, desc, iconName, color;
    if (kind === 'item') {
      owned = state.inventory.includes(data.id);
      equipped = this.app.save.getActivePet().equipped[data.slot] === data.id;
      price = data.price; name = data.name; desc = data.desc || ''; iconName = data.id; color = data.color;
    } else {
      owned = (state.roomUpgrades[data.room.room] || 1) >= data.tier.tier;
      equipped = false;
      price = data.tier.price; name = data.tier.name; desc = data.tier.desc || ''; iconName = data.room.room === 'clinic' ? 'vet' : data.room.room; color = data.tier.color;
    }
    const canAfford = state.coins >= price;
    let btn;
    if (kind === 'item' && owned) {
      btn = `<button class="shop-big-btn ${equipped ? 'secondary' : ''}" id="shop-act-btn">${equipped ? 'Take It Off' : 'Wear It!'}</button>`;
    } else if (owned) {
      btn = `<button class="shop-big-btn secondary" id="shop-act-btn" disabled>You have it!</button>`;
    } else {
      btn = `<button class="shop-big-btn buy ${canAfford ? '' : 'poor'}" id="shop-act-btn">${iconSVG('coin', 34)}<span>BUY &nbsp;${price}</span></button>`;
    }
    box.innerHTML = `
      <div class="shop-detail-swatch" style="background:${color}">${iconSVG(iconName, 48)}</div>
      <div class="shop-detail-text">
        <div class="shop-detail-name">${name}</div>
        <div class="shop-detail-desc">${!owned && !canAfford ? `Need ${price - state.coins} more coins - care for your pets to earn them!` : desc}</div>
      </div>
      ${btn}
    `;
    const act = document.getElementById('shop-act-btn');
    if (!act || act.disabled) return;
    bindTap(act, () => {
      if (kind === 'item') {
        if (owned) {
          this.equipOwnedItem(data, !equipped);
          this.app.pets[this.app.save.state.activePet]?.triggerHop();
          this.app.sound.playBubblePop();
          this.renderShop();
        } else {
          this.buyShopItem(data);
        }
      } else {
        this.buyRoomUpgrade(data.room, data.tier);
      }
    });
  }

  renderShop() {
    const grid = document.getElementById('shop-items-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const state = this.app.save.state;
    const activePet = this.app.save.getActivePet();

    if (this.activeShopTab === 'upgrades') {
      let selData = null;
      for (const roomGroup of ROOM_UPGRADES) {
        const currentTier = state.roomUpgrades[roomGroup.room] || 1;
        for (const t of roomGroup.tiers) {
          if (t.tier === 1) continue;
          const owned = currentTier >= t.tier;
          const key = `${roomGroup.room}:${t.tier}`;
          const selected = this.shopSel === key;
          if (selected) selData = { room: roomGroup, tier: t };
          const card = document.createElement('button');
          card.className = `shop-card ${owned ? 'owned' : ''} ${selected ? 'selected' : ''}`;
          card.innerHTML = `
            <div class="shop-card-swatch" style="background:${t.color}">${iconSVG(roomGroup.room === 'clinic' ? 'vet' : roomGroup.room, 40)}</div>
            <div class="shop-card-title">${t.name}</div>
            <div class="shop-card-price">${owned ? 'Unlocked ✓' : `${iconSVG('coin', 20)} ${t.price}`}</div>
          `;
          card.addEventListener('pointerdown', e => {
            e.preventDefault();
            this.shopSel = key;
            this.app.voice.speak(t.voiceId, t.name);
            this.app.sound.playBubblePop();
            this.renderShop();
          });
          grid.appendChild(card);
        }
      }
      this.renderShopDetail('upgrade', selData);
      return;
    }

    const items = SHOP_ITEMS.filter(item => item.tab === this.activeShopTab);
    let selItem = null;
    for (const item of items) {
      const owned = state.inventory.includes(item.id);
      const equipped = activePet.equipped[item.slot] === item.id;
      const selected = this.shopSel === item.id;
      if (selected) selItem = item;

      const card = document.createElement('button');
      card.className = `shop-card ${owned ? 'owned' : ''} ${equipped ? 'equipped' : ''} ${selected ? 'selected' : ''}`;
      card.innerHTML = `
        <div class="shop-card-swatch" style="background:${item.color}33; border-color:${item.color}">
          ${iconSVG(item.id, 52)}
        </div>
        <div class="shop-card-title">${item.name}</div>
        <div class="shop-card-price">${equipped ? 'Wearing ✓' : (owned ? 'Yours ✓' : `${iconSVG('coin', 20)} ${item.price}`)}</div>
      `;

      // Tapping a card only TRIES IT ON. Buying needs the big Buy button.
      card.addEventListener('pointerdown', e => {
        e.preventDefault();
        this.shopSel = item.id;
        this.app.voice.speak(item.voiceId, item.name);
        this.app.sound.playBubblePop();
        this.previewShopItem(item);
        this.renderShop();
      });
      grid.appendChild(card);
    }
    this.renderShopDetail('item', selItem);
  }

  // --------------------------------------------------------------------------
  // 5. SPARKLE PHOTO BOOTH & ALBUM
  // --------------------------------------------------------------------------
  openPhotoBoothModal() {
    this.photoModal.classList.remove('hidden');
    this.setSpeechPrompt('photobooth_intro', 'Pick a cute frame, strike a pose, and tap the camera button to snap a photo!', true);
    this.renderPhotoAlbum();
    document.querySelectorAll('[data-photo-frame]').forEach(b => b.classList.toggle('on', b.getAttribute('data-photo-frame') === this.activePhotoFrame));

    document.querySelectorAll('[data-photo-frame]').forEach(btn => {
      bindTap(btn, () => {
        this.activePhotoFrame = btn.getAttribute('data-photo-frame');
        this.app.sound.playBubblePop();
        const frameOverlay = document.getElementById('photo-frame-overlay');
        if (frameOverlay) frameOverlay.setAttribute('data-frame', this.activePhotoFrame);
        document.querySelectorAll('[data-photo-frame]').forEach(b => b.classList.toggle('on', b === btn));
      });
    });

    bindTap(document.getElementById('btn-pose-hop'), () => {
      const pet = this.app.pets[this.app.save.state.activePet];
      pet?.triggerHop();
      pet?.triggerHeartEyes(2.5);
      this.app.avatar?.triggerWave();
      this.app.sound.playHeartChime();
    });

    bindTap(document.getElementById('btn-snap-photo'), () => {
      this.app.snapPhoto(this.activePhotoFrame);
      this.renderPhotoAlbum(true);
    });
  }

  /** Bright white flash + shutter pop + "+15" toast whenever a photo is taken. */
  photoFlash() {
    const f = document.getElementById('photo-flash');
    if (f) {
      f.classList.remove('go');
      void f.offsetWidth; // restart the CSS animation
      f.classList.add('go');
    }
    const toast = document.createElement('div');
    toast.className = 'photo-toast';
    toast.innerHTML = `${iconSVG('camera', 34)} <span>Saved! +15</span> ${iconSVG('coin', 30)}`;
    this.photoModal.appendChild(toast);
    setTimeout(() => toast.remove(), 1400);
  }

  renderPhotoAlbum(popNewest = false) {
    const strip = document.getElementById('photo-album-strip');
    if (!strip) return;
    strip.innerHTML = '';
    const photos = this.app.save.state.photoAlbum || [];
    photos.slice(0, 3).forEach((p, i) => {
      const img = document.createElement('img');
      img.src = p.dataUrl;
      img.className = `album-thumb ${popNewest && i === 0 ? 'fresh' : ''}`;
      img.alt = p.caption || 'Salon Photo';
      strip.appendChild(img);
    });
  }

  // --------------------------------------------------------------------------
  // 6. CELEBRATION REWARD POPUP
  // --------------------------------------------------------------------------
  showRewardModal(titleText, coins, stars) {
    this.rewardModal.classList.remove('hidden');
    document.getElementById('reward-title-text').textContent = titleText;
    document.getElementById('reward-coins-text').innerHTML = `${iconSVG('coin', 38)} +${coins}`;
    document.getElementById('reward-stars-text').innerHTML = `${iconSVG('star', 38)} +${stars}`;

    bindTap(document.getElementById('btn-reward-continue'), () => {
      this.app.sound.playBubblePop();
      this.rewardModal.classList.add('hidden');
      this.app.exitActivity();
    });
  }

  // --------------------------------------------------------------------------
  // 7. PARENT SETTINGS MODAL (Behind 3-second hold gate)
  // --------------------------------------------------------------------------
  openSettingsModal() {
    this.app.sound.playHeartChime();
    this.settingsModal.classList.remove('hidden');
    const s = this.app.save.state.settings;

    bindTap(document.getElementById('btn-close-settings'), () => {
      this.settingsModal.classList.add('hidden');
    });

    const musicInput = document.getElementById('slider-music');
    const sfxInput = document.getElementById('slider-sfx');
    const voiceInput = document.getElementById('slider-voice');
    const speedInput = document.getElementById('slider-speed');
    const chkLowGfx = document.getElementById('chk-low-gfx');
    const chkJoystick = document.getElementById('chk-joystick');

    musicInput.value = s.musicVolume;
    sfxInput.value = s.sfxVolume;
    voiceInput.value = s.voiceVolume;
    speedInput.value = s.readSpeed;
    chkLowGfx.checked = Boolean(s.lowGraphics);
    chkJoystick.checked = Boolean(s.showJoystick);

    const updateAll = () => {
      s.musicVolume = parseFloat(musicInput.value);
      s.sfxVolume = parseFloat(sfxInput.value);
      s.voiceVolume = parseFloat(voiceInput.value);
      s.readSpeed = parseFloat(speedInput.value);
      s.lowGraphics = chkLowGfx.checked;
      s.showJoystick = chkJoystick.checked;
      this.app.save.save();
      this.app.sound.updateVolumes();
      this.app.applyGraphicsSettings();
      this.syncHUD();
    };

    musicInput.oninput = updateAll;
    sfxInput.oninput = updateAll;
    voiceInput.oninput = updateAll;
    speedInput.oninput = updateAll;
    chkLowGfx.onchange = updateAll;
    chkJoystick.onchange = updateAll;

    const btnReset = document.getElementById('btn-reset-save');
    let confirmStep = false;
    btnReset.textContent = 'Reset Save Data';
    bindTap(btnReset, () => {
      if (!confirmStep) {
        confirmStep = true;
        btnReset.textContent = 'Tap Again to Confirm Reset!';
        return;
      }
      this.app.save.reset();
      window.location.reload();
    });

    document.getElementById('btn-close-settings').onclick = () => {
      this.settingsModal.classList.add('hidden');
    };
  }

  // --------------------------------------------------------------------------
  // Optional On-Screen Tablet Joystick
  // --------------------------------------------------------------------------
  bindJoystick() {
    if (!this.joystickZone || !this.joystickKnob) return;
    let active = false;
    let centerX = 0;
    let centerY = 0;

    this.joystickZone.addEventListener('pointerdown', e => {
      e.stopPropagation();
      active = true;
      const rect = this.joystickZone.getBoundingClientRect();
      centerX = rect.left + rect.width / 2;
      centerY = rect.top + rect.height / 2;
      this.joystickZone.setPointerCapture(e.pointerId);
    });

    this.joystickZone.addEventListener('pointermove', e => {
      if (!active) return;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.min(40, Math.hypot(dx, dy));
      const angle = Math.atan2(dy, dx);
      const kx = Math.cos(angle) * dist;
      const ky = Math.sin(angle) * dist;
      this.joystickKnob.style.transform = `translate(${kx}px, ${ky}px)`;
      this.app.setJoystickInput(kx / 40, ky / 40);
    });

    const endJoy = () => {
      active = false;
      this.joystickKnob.style.transform = 'translate(0px, 0px)';
      this.app.setJoystickInput(0, 0);
    };
    this.joystickZone.addEventListener('pointerup', endJoy);
    this.joystickZone.addEventListener('pointercancel', endJoy);
  }
}
