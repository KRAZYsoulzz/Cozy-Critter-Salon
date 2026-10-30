// Wall + furniture collision for the walking stylist (world units, x/z plane).
const R = 0.3; // avatar radius
// axis-aligned boxes [x0, x1, z0, z1]
const BOXES = [
  // interior partition walls (doorways stay open: x=+-3.7 at z 1.2..3.0, z=-0.7 at |x|<1.9 and 5.5..8.2)
  [-3.85, -3.55, 3.0, 5.25], [-3.85, -3.55, -0.85, 1.2],
  [3.55, 3.85, 3.0, 5.25], [3.55, 3.85, -0.85, 1.2],
  [-11.1, -8.2, -0.85, -0.55], [-5.5, -1.9, -0.85, -0.55], [1.9, 5.5, -0.85, -0.55], [8.2, 11.1, -0.85, -0.55],
  [-0.15, 0.15, -7.1, -0.8],
  // outer shell
  [-11.4, -10.85, -7.2, 5.4], [10.85, 11.4, -7.2, 5.4], [-11.4, 11.4, -7.4, -6.9],
  // lobby
  [-3.45, -1.65, -0.4, 0.5], [2.1, 3.3, -0.3, 0.5], [-3.5, -3.1, 3.35, 4.85],
  // spa
  [-10.85, -10.3, 0.55, 2.45],
  // vet
  [6.25, 8.15, 0.98, 2.32], [10.1, 10.7, 0.65, 2.15],
  // kitchen
  [-9.75, -3.45, -6.9, -5.88], [-10.65, -9.6, -6.75, -5.75],
  // yard
  [1.6, 2.8, -6.55, -5.65], [3.5, 5.5, -6.4, -5.2], [4.8, 7.2, -6.45, -5.95]
];
// circles [x, z, r]
const CIRCLES = [
  [-7.2, 1.65, 1.2],            // spa tub
  [-7.2, -4.1, 1.3],            // kitchen table
  [-9.3, 0.75, 0.3], [9.4, 4.3, 0.3],
  [3.1, 4.8, 0.35], [-3.0, 4.9, 0.3], [-4.4, 4.9, 0.32], [-10.2, 4.8, 0.3], [4.4, 4.9, 0.35], [-1.0, -1.7, 0.35],
  [-2.1, 5.35, 0.28], [2.1, 5.35, 0.28],
  [-5.86, -3.04, 0.27], [-8.54, -3.04, 0.27], [-5.86, -5.16, 0.27], [-8.54, -5.16, 0.27]
];
export const dynamicCircles = [];

function hits(x, z) {
  for (const [x0, x1, z0, z1] of BOXES) {
    const cx = x < x0 ? x0 : x > x1 ? x1 : x, cz = z < z0 ? z0 : z > z1 ? z1 : z;
    if ((x - cx) * (x - cx) + (z - cz) * (z - cz) < R * R) return true;
  }
  for (const c of CIRCLES.concat(dynamicCircles)) {
    const rr = c[2] + R * 0.8;
    if ((x - c[0]) * (x - c[0]) + (z - c[1]) * (z - c[1]) < rr * rr) return true;
  }
  return false;
}

function resolve(x, z) {
  for (let it = 0; it < 5; it++) {
    let moved = false;
    for (const [x0, x1, z0, z1] of BOXES) {
      const cx = x < x0 ? x0 : x > x1 ? x1 : x, cz = z < z0 ? z0 : z > z1 ? z1 : z;
      const dx = x - cx, dz = z - cz, d2 = dx * dx + dz * dz;
      if (d2 < R * R && d2 > 1e-8) { const d = Math.sqrt(d2), k = (R - d) / d; x += dx * k; z += dz * k; moved = true; }
    }
    for (const c of CIRCLES.concat(dynamicCircles)) {
      const rr = c[2] + R * 0.8, dx = x - c[0], dz = z - c[1], d2 = dx * dx + dz * dz;
      if (d2 < rr * rr && d2 > 1e-8) { const d = Math.sqrt(d2), k = (rr - d) / d; x += dx * k; z += dz * k; moved = true; }
    }
    if (!moved) break;
  }
  return [x, z];
}

/** Slide from (fx,fz) toward (x,z) along walls and around furniture. */
export function moveWithCollision(fx, fz, x, z) {
  if (!hits(x, z)) return { x, z };
  const [rx, rz] = resolve(x, z);
  if (!hits(rx, rz) && Math.hypot(rx - fx, rz - fz) < Math.hypot(x - fx, z - fz) + 0.4) return { x: rx, z: rz };
  if (!hits(x, fz)) return { x, z: fz };
  if (!hits(fx, z)) return { x: fx, z };
  return { x: fx, z: fz };
}

/** Nudge a point out of any obstacle (used for tap targets and after teleports). */
export function pushOut(x, z) {
  for (let it = 0; it < 12 && hits(x, z); it++) {
    let best = null, bd = 1e9;
    for (const [dx, dz] of [[0.2, 0], [-0.2, 0], [0, 0.2], [0, -0.2], [0.14, 0.14], [-0.14, 0.14], [0.14, -0.14], [-0.14, -0.14]]) {
      for (let k = 1; k <= 12; k++) {
        const nx = x + dx * k, nz = z + dz * k;
        if (!hits(nx, nz)) { const d = k * Math.hypot(dx, dz); if (d < bd) { bd = d; best = { x: nx, z: nz }; } break; }
      }
    }
    if (!best) break; x = best.x; z = best.z;
  }
  return { x, z };
}
