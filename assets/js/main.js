document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initCursor();

  initIntro(() => {
    initHeader();
    initReveal();
    initLightbox();
    initSectionScroll();
    goToEntrySection();
  });
});
