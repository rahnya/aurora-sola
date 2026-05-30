function initScrollProgress() {
  const progress = document.getElementById('scrollProgress');
  if (!progress) return;
  function onScroll() {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = 'scaleX(' + (h > 0 ? Math.min(y / h, 1) : 0) + ')';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('is-intro-done');

  try { initStarfield(); } catch (e) { console.error('Starfield init error:', e); }
  try { initCursor(); } catch (e) { console.error('Cursor init error:', e); }
  try { initScrollProgress(); } catch (e) { console.error('Scroll progress error:', e); }
  try { initReveal(); } catch (e) { console.error('Reveal init error:', e); }
  try { initSystems(); } catch (e) { console.error('Systems init error:', e); }
});
