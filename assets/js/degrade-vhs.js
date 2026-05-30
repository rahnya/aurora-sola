/* Canvas VHS — bruit + bandes horizontales fines (charte DA) */
function initDegradeVhs() {
  const canvas = document.getElementById('degradeVhsCanvas');
  if (!canvas) return { start() {}, stop() {} };

  const ctx = canvas.getContext('2d', { alpha: true });
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GOLD = '232,199,106';
  const LAV = '182,165,255';
  const LAV_SOFT = '201,190,248';
  const INK = '41,39,98';
  const MAX_BANDS = 14;
  let raf = null;
  let running = false;
  let bands = [];

  function resize() {
    const scale = 0.4;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(window.innerWidth * dpr * scale));
    canvas.height = Math.max(1, Math.floor(window.innerHeight * dpr * scale));
  }

  function spawnBand(h) {
    bands.push({
      y: Math.random() * h,
      h: 1 + Math.random() * 4,
      dx: (Math.random() - 0.5) * 22,
      drift: (Math.random() - 0.5) * 0.6,
      life: 8 + Math.floor(Math.random() * 18),
      rgb: Math.random() > 0.5 ? GOLD : (Math.random() > 0.5 ? LAV : LAV_SOFT)
    });
    if (bands.length > MAX_BANDS) bands.shift();
  }

  function seedBands(h) {
    bands = [];
    const count = 6 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) spawnBand(h);
  }

  function drawNoise(w, h) {
    const n = Math.floor(w * h * 0.0008);
    for (let i = 0; i < n; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const roll = Math.random();
      const alpha = 0.03 + Math.random() * 0.05;
      const rgb = roll > 0.66 ? GOLD : roll > 0.33 ? LAV : LAV_SOFT;
      ctx.fillStyle = `rgba(${rgb},${alpha})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  function drawScanlines(w, h) {
    ctx.fillStyle = `rgba(${INK},0.06)`;
    for (let y = 0; y < h; y += 4) ctx.fillRect(0, y, w, 1);
  }

  function drawBands(w, h) {
    if (bands.length < 8 && Math.random() > 0.55) spawnBand(h);

    bands = bands.filter(b => {
      const alpha = 0.07 + Math.random() * 0.08;
      ctx.fillStyle = `rgba(${b.rgb},${alpha})`;
      ctx.fillRect(b.dx, b.y, w, b.h);

      ctx.fillStyle = `rgba(${b.rgb === GOLD ? LAV : GOLD},${alpha * 0.55})`;
      ctx.fillRect(-b.dx * 0.45, b.y + (b.h > 2 ? 1 : 0), w, 1);

      if (b.h >= 2 && Math.random() > 0.7) {
        ctx.fillStyle = `rgba(${INK},0.04)`;
        ctx.fillRect(0, b.y + b.h, w, 1);
      }

      b.y += b.drift;
      b.dx += (Math.random() - 0.5) * 1.2;
      b.life -= 1;
      return b.life > 0 && b.y > -12 && b.y < h + 12;
    });
  }

  function frame() {
    if (!running) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    drawNoise(w, h);
    drawScanlines(w, h);
    drawBands(w, h);
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (reduced || running) return;
    running = true;
    resize();
    seedBands(canvas.height);
    frame();
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
    bands = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  window.addEventListener('resize', () => {
    if (running) {
      resize();
      seedBands(canvas.height);
    }
  }, { passive: true });

  return { start, stop };
}
