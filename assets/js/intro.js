function initIntro(onComplete) {
  const intro = document.getElementById('intro');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!intro || reduced) {
    document.body.classList.add('is-intro-done');
    onComplete?.();
    return;
  }

  document.body.classList.add('is-intro', 'is-locked');

  const holdMs = 3800;
  const exitMs = 1400;
  const loadDelay = 1700;
  const loadMs = holdMs - loadDelay - 200;

  runIntroLoader(loadDelay, loadMs);

  setTimeout(() => intro.classList.add('is-exiting'), holdMs);

  setTimeout(() => {
    window.scrollTo(0, 0);
    intro.remove();
    document.body.classList.remove('is-intro', 'is-locked');
    document.body.classList.add('is-intro-done');
    onComplete?.();
  }, holdMs + exitMs);
}

function runIntroLoader(delay, duration) {
  const fill = document.getElementById('introLoaderFill');
  if (!fill || !duration) return;

  setTimeout(() => {
    const start = performance.now();

    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      fill.style.width = `${progress * 100}%`;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, delay);
}
