function isSafariBrowser() {
  const ua = navigator.userAgent;
  return /Safari/i.test(ua) && !/Chrome|CriOS|Chromium|Edg|OPR|Firefox|FxiOS/i.test(ua);
}

function initIntro(onComplete) {
  const intro = document.getElementById('intro');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let finished = false;
  let holdTimer;
  let exitTimer;
  let safetyTimer;

  if (isSafariBrowser()) {
    document.documentElement.classList.add('is-safari');
  }

  function finishIntro() {
    if (finished) return;
    finished = true;

    clearTimeout(holdTimer);
    clearTimeout(exitTimer);
    clearTimeout(safetyTimer);

    const node = document.getElementById('intro');
    if (node) {
      node.classList.add('is-exiting');
      node.remove();
    }

    document.body.classList.remove('is-intro', 'is-locked');
    document.body.classList.add('is-intro-done');

    try {
      onComplete?.();
    } catch (err) {
      console.error('Intro callback error:', err);
    }
  }

  if (!intro || reduced) {
    document.body.classList.add('is-intro-done');
    try {
      onComplete?.();
    } catch (err) {
      console.error('Intro callback error:', err);
    }
    return;
  }

  document.body.classList.add('is-intro', 'is-locked');

  const holdMs = isSafariBrowser() ? 2800 : 3800;
  const exitMs = 1200;
  const loadDelay = isSafariBrowser() ? 900 : 1700;
  const loadMs = Math.max(800, holdMs - loadDelay - 200);

  runIntroLoader(loadDelay, loadMs);

  holdTimer = setTimeout(() => {
    const node = document.getElementById('intro');
    if (node) node.classList.add('is-exiting');
  }, holdMs);

  exitTimer = setTimeout(() => {
    window.scrollTo(0, 0);
    finishIntro();
  }, holdMs + exitMs);

  safetyTimer = setTimeout(finishIntro, holdMs + exitMs + 2500);

  window.addEventListener('pageshow', e => {
    if (e.persisted) finishIntro();
  }, { once: true });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !finished) {
      safetyTimer = setTimeout(finishIntro, 1500);
    }
  }, { once: true });
}

function runIntroLoader(delay, duration) {
  const fill = document.getElementById('introLoaderFill');
  const percent = document.getElementById('introLoaderPercent');
  if (!fill || !duration) return;

  setTimeout(() => {
    const start = performance.now();

    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      const pct = Math.round(progress * 100);
      fill.style.width = `${pct}%`;
      if (percent) percent.textContent = `${pct}\u00a0%`;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, delay);
}
