import { Engine } from './engine.js';
import { World2D } from './world2d.js';
import { SaveManager } from '../save.js';
import { PetManager } from './pets2d.js';
const save = new SaveManager(), cv = document.getElementById('stage');
const engine = new Engine(cv), prompt = document.getElementById('prompt');
const world = new World2D(engine, save, { station: (s) => { if (s) { prompt.textContent = s.name; prompt.classList.add('on'); } else prompt.classList.remove('on'); } });
const pets = new PetManager(world);
document.getElementById('coin-n').textContent = save.state.coins;
prompt.addEventListener('pointerdown', e => { e.stopPropagation(); const s = world.station; if (s) window.dispatchEvent(new CustomEvent('station', { detail: s })); });
window.flat = { engine, world, save, pets }; window.__ready = true;

