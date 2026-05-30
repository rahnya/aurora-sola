function initCursor() {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia('(max-width: 900px)').matches;
  if (coarse || reduced || mobile) return;

  const cursor = document.getElementById('siteCursor');
  if (!cursor) return;

  const root = document.documentElement;
  root.classList.add('has-custom-cursor');

  const interactive = 'a,button,.gallery__plate,.feed__item,.lightbox__btn,.lightbox__close,.lightbox__dot,input,textarea,select,label,[role="button"]';
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let rafId = null;
  let visible = false;

  function setHidden(hidden) {
    root.classList.toggle('is-cursor-hidden', hidden);
  }

  function updateVisibility() {
    const lightboxOpen = document.body.classList.contains('is-lightbox-open');
    const hidden = document.body.classList.contains('is-intro')
      || (document.body.classList.contains('is-locked') && !lightboxOpen);
    setHidden(hidden);
  }

  function tick() {
    currentX += (targetX - currentX) * 0.2;
    currentY += (targetY - currentY) * 0.2;
    cursor.style.transform = `translate3d(${currentX}px,${currentY}px,0)`;
    rafId = requestAnimationFrame(tick);
  }

  document.addEventListener('mousemove', e => {
    targetX = e.clientX;
    targetY = e.clientY;
    if (!visible) {
      currentX = targetX;
      currentY = targetY;
      visible = true;
    }
  }, { passive: true });

  document.addEventListener('mouseover', e => {
    cursor.classList.toggle('is-hover', !!e.target.closest(interactive));
  });

  document.addEventListener('mousedown', () => cursor.classList.add('is-active'));
  document.addEventListener('mouseup', () => cursor.classList.remove('is-active'));

  document.addEventListener('mouseleave', () => setHidden(true));
  document.addEventListener('mouseenter', () => {
    updateVisibility();
    const lightboxOpen = document.body.classList.contains('is-lightbox-open');
    if (!document.body.classList.contains('is-intro')
      && (!document.body.classList.contains('is-locked') || lightboxOpen)) {
      setHidden(false);
    }
  });

  const observer = new MutationObserver(updateVisibility);
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    observer.observe(lightbox, { attributes: true, attributeFilter: ['class'] });
  }

  updateVisibility();
  rafId = requestAnimationFrame(tick);

  window.addEventListener('beforeunload', () => {
    if (rafId) cancelAnimationFrame(rafId);
    observer.disconnect();
  });
}
