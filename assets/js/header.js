function initHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  function check() {
    header.classList.toggle('is-scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', check, { passive: true });
  check();
}