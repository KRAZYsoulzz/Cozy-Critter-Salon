import { Engine } from './engine.js';
import { World2D } from './world2d.js';
import { SaveManager } from '../save.js';
import { SoundEngine } from '../audio.js';
import { VoiceEngine } from '../voice.js';
import { PetManager } from './pets2d.js';
import { ActivityScene } from './activity2d.js';
const save = new SaveManager(), cv = document.getElementById('stage');
const sound = new SoundEngine(save), voice = new VoiceEngine(save, sound);
const engine = new Engine(cv), prompt = document.getElementById('prompt');
let scene; const world = new World2D(engine, save, { station: (s, first) => {
  if (s && !scene?.active) { prompt.textContent = s.name; prompt.classList.add('on'); sound.playBubblePop?.(); if (first && !window.__muteNarr) try { voice.speak(s.voiceId, s.name + '! Tap the glowing button to play!'); } catch (e) {} } else prompt.classList.remove('on'); } });
const pets = new PetManager(world);
scene = new ActivityScene(world, pets, { sound, voice });
document.getElementById('coin-n').textContent = save.state.coins;
prompt.addEventListener('pointerdown', e => { e.stopPropagation(); const s = world.station; if (!s) return; window.dispatchEvent(new CustomEvent('station', { detail: s })); if (s.id === 'spa') scene.enter('spa'); });
addEventListener('pointerdown', () => sound.resume?.(), { once: true });
window.flat = { engine, world, save, pets, scene, sound, voice }; window.__ready = true;
