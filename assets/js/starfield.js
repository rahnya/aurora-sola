function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let W, H, stars = [], shooting = null;

  function resize() {
    W = canvas.width = window.innerWidth * DPR;
    H = canvas.height = window.innerHeight * DPR;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }

  function create() {
    stars = [];
    const count = Math.min(160, Math.floor((window.innerWidth * window.innerHeight) / 10000));
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: (Math.random() * 1.1 + 0.2) * DPR,
        o: Math.random() * 0.65 + 0.15,
        twink: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.016 + 0.004,
        depth: Math.random() * 3 + 1
      });
    }
  }

  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      s.twink += s.speed;
      const o = s.o * (0.4 + 0.6 * (Math.sin(s.twink) * 0.5 + 0.5));
      const py = ((s.y - (scrollY * DPR * 0.1) / s.depth) % H + H) % H;
      ctx.beginPath();
      ctx.arc(s.x, py, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(238,233,255,' + o + ')';
      ctx.fill();
    }

    // Shooting star
    if (!shooting && Math.random() < 0.0012) {
      shooting = { x: Math.random() * W * 0.7, y: Math.random() * H * 0.4, vx: (8 + Math.random() * 4) * DPR, vy: (3 + Math.random() * 2) * DPR, life: 1, trail: [] };
    }
    if (shooting) {
      shooting.trail.unshift({ x: shooting.x, y: shooting.y });
      if (shooting.trail.length > 12) shooting.trail.pop();
      shooting.x += shooting.vx;
      shooting.y += shooting.vy;
      shooting.life -= 0.014;
      for (let i = 0; i < shooting.trail.length; i++) {
        const t = 1 - i / shooting.trail.length;
        ctx.beginPath();
        ctx.arc(shooting.trail[i].x, shooting.trail[i].y, 1.4 * DPR * t, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(232,199,106,' + (shooting.life * t * 0.8) + ')';
        ctx.fill();
      }
      if (shooting.life <= 0 || shooting.x > W || shooting.y > H) shooting = null;
    }

    requestAnimationFrame(draw);
  }

  resize(); create(); draw();
  window.addEventListener('resize', () => { resize(); create(); });
}