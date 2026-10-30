// Footprint collision for the 2D world (floor plane x / y): circle-vs-box and circle-vs-circle with sliding.
export function makeCollider(boxes, circles, R = 12) {
  const hits = (x, z) => {
    for (const [x0, x1, z0, z1] of boxes) { const cx = x < x0 ? x0 : x > x1 ? x1 : x, cz = z < z0 ? z0 : z > z1 ? z1 : z; if ((x - cx) ** 2 + (z - cz) ** 2 < R * R) return true; }
    for (const [cx, cz, r] of circles) { const rr = r + R * .8; if ((x - cx) ** 2 + (z - cz) ** 2 < rr * rr) return true; }
    return false;
  };
  const resolve = (x, z) => {
    for (let it = 0; it < 5; it++) { let m = false;
      for (const [x0, x1, z0, z1] of boxes) { const cx = x < x0 ? x0 : x > x1 ? x1 : x, cz = z < z0 ? z0 : z > z1 ? z1 : z, dx = x - cx, dz = z - cz, d2 = dx * dx + dz * dz; if (d2 < R * R && d2 > 1e-8) { const d = Math.sqrt(d2), k = (R - d) / d; x += dx * k; z += dz * k; m = true; } }
      for (const [cx, cz, r] of circles) { const rr = r + R * .8, dx = x - cx, dz = z - cz, d2 = dx * dx + dz * dz; if (d2 < rr * rr && d2 > 1e-8) { const d = Math.sqrt(d2), k = (rr - d) / d; x += dx * k; z += dz * k; m = true; } }
      if (!m) break; }
    return [x, z];
  };
  return {
    hits,
    move(fx, fz, x, z) {
      if (!hits(x, z)) return { x, z };
      const [rx, rz] = resolve(x, z); if (!hits(rx, rz) && Math.hypot(rx - fx, rz - fz) < Math.hypot(x - fx, z - fz) + 24) return { x: rx, z: rz };
      if (!hits(x, fz)) return { x, z: fz }; if (!hits(fx, z)) return { x: fx, z }; return { x: fx, z: fz };
    },
    pushOut(x, z) { if (!hits(x, z)) return { x, z }; const [rx, rz] = resolve(x, z); if (!hits(rx, rz)) return { x: rx, z: rz };
      for (let r = 6; r < 200; r += 6) for (let a = 0; a < 6.28; a += .5) { const nx = x + Math.cos(a) * r, nz = z + Math.sin(a) * r; if (!hits(nx, nz)) return { x: nx, z: nz }; } return { x, z }; }
  };
}
