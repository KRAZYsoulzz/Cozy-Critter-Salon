// Picture thumbnails for the stylist: each hair/outfit option is rendered live
// (small private WebGL canvas) on the current avatar, cached by look.
import * as THREE from 'three';
import { StylistAvatar } from './characters.js';
import { HAIR_STYLES, AVATAR_OUTFITS } from './save.js';

export function initThumbs(app) {
  let r = null, scene, camH, camB, av;
  const cache = new Map();
  const ensure = () => {
    if (r) return true;
    try {
      r = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
      r.setPixelRatio(1); r.setSize(120, 120, false);
      r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 0.95;
      scene = new THREE.Scene();
      scene.add(new THREE.HemisphereLight(0xffffff, 0xe8c9d8, 0.9));
      const k = new THREE.DirectionalLight(0xfff0d8, 2.0); k.position.set(-3, 4, 5); scene.add(k);
      camH = new THREE.PerspectiveCamera(26, 1, 0.1, 50); camH.position.set(0, 1.62, 3.4); camH.lookAt(0, 1.5, 0);
      camB = new THREE.PerspectiveCamera(26, 1, 0.1, 50); camB.position.set(0, 1.0, 5.6); camB.lookAt(0, 0.9, 0);
      av = new StylistAvatar(JSON.parse(JSON.stringify(app.save.state.avatar)));
      scene.add(av.root);
      return true;
    } catch (e) { r = null; return false; }
  };
  const shot = (cfg, cam) => {
    av.buildRig(cfg); av.root.position.set(0, 0, 0); av.root.rotation.set(0, 0, 0);
    r.setClearColor(0x000000, 0); r.clear(); r.render(scene, cam);
    const url = r.domElement.toDataURL('image/png');
    av.root.traverse(o => { if (o.geometry) o.geometry.dispose(); });
    return url;
  };
  const decorate = (wrap, list, kind) => {
    if (!wrap) return;
    const btns = wrap.querySelectorAll('.choice-pill');
    if (!btns.length || !ensure()) return;
    const base = app.save.state.avatar;
    btns.forEach((b, i) => {
      const it = list[i]; if (!it || b.querySelector('.pill-thumb')) return;
      const cfg = JSON.parse(JSON.stringify(base));
      if (kind === 'hair') cfg.hairStyle = it.id; else cfg.outfit = it.id;
      const key = [kind, it.id, cfg.hairStyle, cfg.hairColor, cfg.skinTone || cfg.skin, cfg.outfit, cfg.eyeColor || ''].join('|');
      let url = cache.get(key);
      if (!url) { url = shot(cfg, kind === 'hair' ? camH : camB); cache.set(key, url); if (cache.size > 120) cache.delete(cache.keys().next().value); }
      const im = document.createElement('img'); im.className = 'pill-thumb'; im.src = url; im.alt = '';
      b.insertBefore(im, b.firstChild); b.classList.add('has-thumb');
    });
    wrap.classList.add('thumbs');
  };
  const watch = (id, list, kind) => {
    const w = document.getElementById(id); if (!w) return;
    new MutationObserver(() => decorate(w, list, kind)).observe(w, { childList: true });
    decorate(w, list, kind);
  };
  watch('swatches-hair-style', HAIR_STYLES, 'hair');
  watch('swatches-outfit', AVATAR_OUTFITS, 'outfit');
}
