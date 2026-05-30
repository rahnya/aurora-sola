function initReveal() {
  autoTagRevealElements();

  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -6% 0px' });

  els.forEach(el => io.observe(el));
}

function autoTagRevealElements() {
  document.querySelectorAll('.gallery__plate.reveal').forEach(el => {
    el.classList.add('reveal--scale');
  });

  document.querySelectorAll('.about__col').forEach((el, i) => {
    if (i === 0) el.classList.add('reveal--left');
    if (i === 1) el.classList.add('reveal--right');
  });

  tag('.about__divider');
  tag('.latest__cta', 'reveal--d3');

  document.querySelectorAll('.feed__group').forEach(group => {
    group.querySelectorAll('.feed__group-label, .feed__item').forEach((el, i) => {
      tag(el, i ? `reveal--d${Math.min(i, 5)}` : '');
    });
  });

  tag('.feed__foot');
}

function tag(el, extra) {
  const node = typeof el === 'string' ? document.querySelector(el) : el;
  if (!node || node.classList.contains('reveal')) return;
  node.classList.add('reveal');
  if (extra) node.classList.add(extra);
}
