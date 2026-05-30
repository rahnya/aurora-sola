/* ═══════════════════════════════════════════════════════════════════
   MODULE · Header
   - état "scrolled" (fond translucide)
   - barre de progression de lecture (or)
   - menu mobile (ouverture/fermeture)
   - scrollspy (surlignage du lien de section actif)
   ═══════════════════════════════════════════════════════════════════ */
function initHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const progress = document.getElementById('scrollProgress');
  const burger   = document.getElementById('navToggle');
  const mobile   = document.getElementById('mobileNav');
  const navLinks = Array.from(document.querySelectorAll('[data-nav-link]'));

  /* ── état scrolled + progression ── */
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 60);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (h > 0 ? Math.min(y / h, 1) : 0) + ')';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── menu mobile ── */
  function setMenu(open) {
    if (!burger || !mobile) return;
    burger.classList.toggle('is-open', open);
    mobile.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobile.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.classList.toggle('is-locked', open);
  }
  if (burger && mobile) {
    burger.addEventListener('click', () => setMenu(!mobile.classList.contains('is-open')));
    mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  }

  /* ── scrollspy ── */
  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = '#' + e.target.id;
          navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(s => spy.observe(s));
  }
}
