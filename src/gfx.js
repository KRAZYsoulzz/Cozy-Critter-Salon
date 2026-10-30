/**
 * gfx.js — shared rendering toolkit.
 * Soft-toon materials, outlines, vertex-colour static batching, wind sway,
 * procedural canvas textures, noise and seeded randomness.
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/* ------------------------------------------------------------------ */
/* Shared uniforms                                                     */
/* ------------------------------------------------------------------ */
export const shared = {
  time: { value: 0 },
  wind: { value: 1 }
};

export function tickWind(t) {
  shared.time.value = t;
}

/* ------------------------------------------------------------------ */
/* Seeded random + noise                                               */
/* ------------------------------------------------------------------ */
export function rng(seed = 1) {
  let a = seed >>> 0;
  const r = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  r.range = (lo, hi) => lo + r() * (hi - lo);
  r.pick = (arr) => arr[Math.floor(r() * arr.length)];
  return r;
}

function hash2(ix, iz) {
  const n = Math.sin(ix * 127.1 + iz * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

export function noise2(x, z) {
  const ix = Math.floor(x), iz = Math.floor(z);
  const fx = x - ix, fz = z - iz;
  const ux = fx * fx * (3 - 2 * fx), uz = fz * fz * (3 - 2 * fz);
  const a = hash2(ix, iz), b = hash2(ix + 1, iz), c = hash2(ix, iz + 1), d = hash2(ix + 1, iz + 1);
  return a + (b - a) * ux + (c - a) * uz + (a - b - c + d) * ux * uz;
}

export function fbm(x, z, oct = 4) {
  let v = 0, amp = 0.5, f = 1;
  for (let i = 0; i < oct; i++) {
    v += amp * noise2(x * f, z * f);
    f *= 2.03;
    amp *= 0.5;
  }
  return v;
}

export const clamp01 = (v) => Math.max(0, Math.min(1, v));
export const smoothstep = (a, b, v) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const lerp = (a, b, t) => a + (b - a) * t;
export const damp = (current, target, lambda, dt) => lerp(current, target, 1 - Math.exp(-lambda * dt));

export function dampAngle(current, target, lambda, dt) {
  let d = target - current;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return current + d * (1 - Math.exp(-lambda * dt));
}

/* ------------------------------------------------------------------ */
/* Soft toon materials (characters)                                    */
/* ------------------------------------------------------------------ */
let gradientTex = null;
export function toonGradient() {
  if (gradientTex) return gradientTex;
  // Five soft steps — linear filtering blends them into gentle painted bands.
  const data = new Uint8Array([150, 150, 150, 255, 214, 214, 214, 255, 255, 255, 255, 255]);
  gradientTex = new THREE.DataTexture(data, 3, 1, THREE.RGBAFormat);
  gradientTex.minFilter = THREE.NearestFilter;
  gradientTex.magFilter = THREE.NearestFilter;
  gradientTex.generateMipmaps = false;
  gradientTex.needsUpdate = true;
  return gradientTex;
}

const RIM_COLOR = new THREE.Color('#ffe2c2');

const _hsl = {};
function satColor(c, k = 1.2) { const col = new THREE.Color(c); if (col.r === 1 && col.g === 1 && col.b === 1) return col; col.getHSL(_hsl); col.setHSL(_hsl.h, Math.min(1, _hsl.s * k), _hsl.l); return col; }

/** Cel-shaded toon material: hard 3-step light, crisp rim. */
export function toonMat(color, opts = {}) {
  const mat = new THREE.MeshToonMaterial({
    color: satColor(color),
    gradientMap: toonGradient(),
    transparent: !!opts.transparent,
    opacity: opts.opacity ?? 1,
    side: opts.side ?? THREE.FrontSide,
    emissive: new THREE.Color(opts.emissive || '#000000'),
    emissiveIntensity: opts.emissiveIntensity ?? 1,
    depthWrite: opts.depthWrite ?? true,
    map: opts.map || null
  });
  const rim = opts.rim ?? 0.38;
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uRim = { value: rim };
    shader.uniforms.uRimColor = { value: RIM_COLOR };
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uRim;\nuniform vec3 uRimColor;')
      .replace(
        '#include <opaque_fragment>',
        `float rimF = smoothstep(0.66, 0.72, 1.0 - saturate(dot(normal, normalize(vViewPosition))));
         outgoingLight += uRimColor * rimF * uRim * diffuseColor.rgb;
         #include <opaque_fragment>`
      );
  };
  mat.customProgramCacheKey = () => 'toonRim' + rim;
  return mat;
}

/** Shader outline shell — uniform-thickness inverted hull. */
const outlineMats = new Map();
export function outlineMaterial(color = '#3a2420', thickness = 0.014) {
  const key = color + thickness;
  if (outlineMats.has(key)) return outlineMats.get(key);
  const c = new THREE.Color(color);
  const mat = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: c }, uThick: { value: thickness } },
    vertexShader: `
      uniform float uThick;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vec3 n = normalize(normalMatrix * normal);
        float wob = 1.0 + 0.32 * sin(position.x * 43.0 + position.y * 31.0 + position.z * 11.0) * sin(position.z * 37.0 - position.y * 19.0 + position.x * 13.0);
        mv.xyz += n * uThick * wob * (1.0 + 0.05 * -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 uColor;
      void main() {
        gl_FragColor = vec4(uColor, 1.0);
        #include <colorspace_fragment>
      }`,
    side: THREE.BackSide
  });
  outlineMats.set(key, mat);
  return mat;
}

export function addOutline(mesh, thickness = 0.014, color = '#3a2420') {
  const o = new THREE.Mesh(mesh.geometry, outlineMaterial(color, thickness));
  o.userData.isOutline = true;
  o.castShadow = false;
  o.receiveShadow = false;
  o.raycast = () => {};
  mesh.add(o);
  return o;
}

/* ------------------------------------------------------------------ */
/* Static vertex-colour batching (one draw call per material)          */
/* ------------------------------------------------------------------ */
const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _v = new THREE.Vector3();
const _s = new THREE.Vector3();
const _c = new THREE.Color();

export function mat4(pos = [0, 0, 0], rot = [0, 0, 0], scale = [1, 1, 1]) {
  _e.set(rot[0], rot[1], rot[2]);
  _q.setFromEuler(_e);
  const sc = typeof scale === 'number' ? [scale, scale, scale] : scale;
  return new THREE.Matrix4().compose(_v.set(pos[0], pos[1], pos[2]), _q, _s.set(sc[0], sc[1], sc[2]));
}

export class Batcher {
  constructor() {
    this.bins = new Map();
  }
  /**
   * @param {string} bin  batch name
   * @param {THREE.BufferGeometry} geometry
   * @param {THREE.Matrix4} matrix
   * @param {string|number|Function} color  colour or fn(x,y,z,out:Color)
   * @param {{keepUV?:boolean}} opts
   */
  add(bin, geometry, matrix, color = '#ffffff', opts = {}) {
    let g = geometry.index ? geometry.toNonIndexed() : geometry.clone();
    for (const name of Object.keys(g.attributes)) {
      if (name !== 'position' && name !== 'normal' && !(opts.keepUV && name === 'uv')) g.deleteAttribute(name);
    }
    if (opts.keepUV && !g.attributes.uv) {
      g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
    }
    g.applyMatrix4(matrix);
    const pos = g.attributes.position;
    const col = new Float32Array(pos.count * 3);
    if (typeof color === 'function') {
      for (let i = 0; i < pos.count; i++) {
        color(pos.getX(i), pos.getY(i), pos.getZ(i), _c);
        col[i * 3] = _c.r; col[i * 3 + 1] = _c.g; col[i * 3 + 2] = _c.b;
      }
    } else {
      _c.set(color);
      for (let i = 0; i < pos.count; i++) {
        col[i * 3] = _c.r; col[i * 3 + 1] = _c.g; col[i * 3 + 2] = _c.b;
      }
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    if (!this.bins.has(bin)) this.bins.set(bin, []);
    this.bins.get(bin).push(g);
    return g;
  }
  has(bin) {
    return this.bins.has(bin) && this.bins.get(bin).length > 0;
  }
  build(bin, material, { castShadow = true, receiveShadow = true } = {}) {
    const list = this.bins.get(bin);
    if (!list || !list.length) return null;
    const merged = mergeGeometries(list, false);
    list.forEach((g) => g.dispose());
    this.bins.delete(bin);
    merged.computeBoundingSphere();
    const mesh = new THREE.Mesh(merged, material);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = receiveShadow;
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
    mesh.name = bin;
    return mesh;
  }
}

/** Standard soft world material that reads vertex colours. */
export function worldMat(opts = {}) {
  return new THREE.MeshLambertMaterial({
    vertexColors: true,
    transparent: !!opts.transparent,
    opacity: opts.opacity ?? 1,
    side: opts.side ?? THREE.FrontSide,
    map: opts.map || null
  });
}

/* ------------------------------------------------------------------ */
/* Wind sway (instanced foliage + merged plants)                       */
/* ------------------------------------------------------------------ */
export function addWind(material, opts = {}, freqArg = 1.4) {
  let amp = 0.06;
  let freq = 1.4;
  let heightScale = 1;
  let base = 0;
  let key = 'w';

  if (typeof opts === 'number') {
    amp = opts;
    if (typeof freqArg === 'number') freq = freqArg;
  } else if (opts && typeof opts === 'object') {
    amp = opts.amp ?? 0.06;
    freq = opts.freq ?? 1.4;
    heightScale = opts.heightScale ?? 1;
    base = opts.base ?? 0;
    key = opts.key ?? 'w';
  }

  const prev = material.onBeforeCompile;
  material.onBeforeCompile = (shader, r) => {
    if (prev) prev(shader, r);
    shader.uniforms.uTime = shared.time;
    shader.uniforms.uWindStrength = shared.wind;
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
         uniform float uTime;
         uniform float uWindStrength;`
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         {
           vec3 wp = position;
           #ifdef USE_INSTANCING
             wp = (instanceMatrix * vec4(position, 1.0)).xyz;
           #endif
           float hf = max(0.0, position.y - ${base.toFixed(3)}) * ${heightScale.toFixed(3)};
           hf = hf * hf;
           float ph = wp.x * 0.37 + wp.z * 0.29;
           float s = sin(uTime * ${freq.toFixed(3)} + ph) + 0.45 * sin(uTime * ${(freq * 2.3).toFixed(3)} + ph * 1.7);
           transformed.x += s * ${amp.toFixed(4)} * hf * uWindStrength;
           transformed.z += cos(uTime * ${(freq * 0.83).toFixed(3)} + ph * 1.3) * ${(amp * 0.55).toFixed(4)} * hf * uWindStrength;
         }`
      );
  };
  material.customProgramCacheKey = () => `wind_${key}_${amp}_${freq}_${heightScale}_${base}`;
  return material;
}

/* ------------------------------------------------------------------ */
/* Canvas textures                                                     */
/* ------------------------------------------------------------------ */
export function canvasTexture(w, h, draw, opts = {}) {
  if (typeof w === 'function') {
    const fn = w;
    const actualW = typeof h === 'number' ? h : 256;
    const actualH = typeof draw === 'number' ? draw : actualW;
    opts = (typeof draw === 'object' && draw) ? draw : (opts || {});
    w = actualW;
    h = actualH;
    draw = fn;
  }
  const { repeat = null, srgb = true, mipmaps = true } = opts || {};
  const _aniso = 8;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (typeof draw === 'function') {
    draw(ctx, w, h);
  }
  const tex = new THREE.CanvasTexture(c);
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.anisotropy = 4;
  tex.generateMipmaps = mipmaps;
  if (repeat) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat[0], repeat[1]);
  }
  return tex;
}

export function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function heartPath(ctx, cx, cy, s) {
  ctx.beginPath();
  ctx.moveTo(cx, cy + s * 0.35);
  ctx.bezierCurveTo(cx - s * 0.9, cy - s * 0.25, cx - s * 0.45, cy - s * 0.95, cx, cy - s * 0.45);
  ctx.bezierCurveTo(cx + s * 0.45, cy - s * 0.95, cx + s * 0.9, cy - s * 0.25, cx, cy + s * 0.35);
  ctx.closePath();
}

export const FONT_STACK = '"Nunito", "Baloo 2", "Varela Round", "Arial Rounded MT Bold", ui-rounded, "Segoe UI", system-ui, sans-serif';

/** Renders an SVG string into a CanvasTexture (async-safe; texture updates on load). */
export function svgTexture(svg, size = 256) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const img = new Image();
  const src = svg.includes('xmlns') ? svg : svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
  img.onload = () => {
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(img, 0, 0, size, size);
    tex.needsUpdate = true;
  };
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(src);
  return tex;
}

/** Soft round glow sprite texture (for lanterns, fireflies, sparkles). */
const glowCache = new Map();
export function glowTexture(innerColor = '#ffffff', outerColor = 'rgba(255,255,255,0)') {
  const key = `${innerColor}_${outerColor}`;
  if (glowCache.has(key)) return glowCache.get(key);
  const tex = canvasTexture(128, 128, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, innerColor);
    g.addColorStop(0.35, innerColor);
    g.addColorStop(1, outerColor);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
  glowCache.set(key, tex);
  return tex;
}

/** Jitters vertices of a geometry for organic, hand-made shapes. */
export function jitter(geometry, amount = 0.05, seed = 3) {
  const r = rng(seed);
  const g = geometry.index ? geometry : geometry;
  const pos = g.attributes.position;
  const map = new Map();
  for (let i = 0; i < pos.count; i++) {
    const k = `${pos.getX(i).toFixed(3)},${pos.getY(i).toFixed(3)},${pos.getZ(i).toFixed(3)}`;
    if (!map.has(k)) map.set(k, [r.range(-amount, amount), r.range(-amount, amount), r.range(-amount, amount)]);
    const o = map.get(k);
    pos.setXYZ(i, pos.getX(i) + o[0], pos.getY(i) + o[1], pos.getZ(i) + o[2]);
  }
  g.computeVertexNormals();
  return g;
}

/** Fades every material in an object (used for dollhouse cutaways). */
export function setObjectOpacity(obj, opacity) {
  obj.traverse((o) => {
    if (!o.material) return;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    mats.forEach((m) => {
      if (m.userData.baseTransparent === undefined) m.userData.baseTransparent = m.transparent;
      m.opacity = opacity;
      m.transparent = opacity < 0.999 || m.userData.baseTransparent;
      m.depthWrite = opacity > 0.98;
    });
  });
  obj.visible = opacity > 0.01;
}

/** Hard-edged contact shadow decal under a character. */
export function addContactShadow(root, rx = 0.55, rz = 0.5) {
  const m = new THREE.Mesh(new THREE.CircleGeometry(1, 28), new THREE.MeshBasicMaterial({ color: 0x3a2420, transparent: true, opacity: 0.30, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.y = 0.025; m.scale.set(rx, rz, 1); m.renderOrder = 2; m.userData.isContactShadow = true;
  root.add(m); return m;
}

/** Frees GPU geometry of a removed object tree (particles/props were leaking one buffer each). */
export function disposeTree(o) { if (!o) return; o.traverse(c => { if (c.geometry && c.geometry.dispose) c.geometry.dispose(); }); }
