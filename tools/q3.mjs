export default async (page, h) => {
  await h.tap('#btn-play-game'); await h.sleep(1500);
  const n = await h.ev(() => document.querySelectorAll('#swatches-hair-style button').length);
  for (let i = 1; i <= n; i++) { await h.tap(`#swatches-hair-style button:nth-child(${i})`); await h.sleep(500); await h.shot('hair-' + String(i).padStart(2,'0')); }
};
