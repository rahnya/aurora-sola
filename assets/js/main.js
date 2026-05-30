document.addEventListener('DOMContentLoaded', () => {
  try { initStarfield(); } catch (e) { console.error('Starfield init error:', e); }
  try { initCursor(); } catch (e) { console.error('Cursor init error:', e); }

  initIntro(() => {
    try { initHeader(); } catch (e) { console.error('Header init error:', e); }
    try { initReveal(); } catch (e) { console.error('Reveal init error:', e); }
    try { initLightbox(); } catch (e) { console.error('Lightbox init error:', e); }
    try { initSectionScroll(); } catch (e) { console.error('Section scroll init error:', e); }
    try { goToEntrySection(); } catch (e) { console.error('Entry section error:', e); }
  });
});
