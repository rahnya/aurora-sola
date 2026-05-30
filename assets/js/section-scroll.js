const SECTION_IDS = ['top', 'latest', 'about', 'gallery', 'feed'];

const WHEEL_THRESHOLD = 22;
const SCROLL_DURATION = 1500;
const LOCK_MS = 1600;

let currentIndex = 0;
let wheelSum = 0;
let isLocked = false;
let rafId = null;
let wheelTimeout = null;

function getSections() {
  return SECTION_IDS.map(id => document.getElementById(id)).filter(Boolean);
}

function getHeaderOffset() {
  const header = document.getElementById('siteHeader');
  return header ? header.offsetHeight : 0;
}

function isSectionMode() {
  return document.documentElement.classList.contains('has-section-scroll');
}

function setActiveSection(id) {
  document.querySelectorAll('[data-nav-link]').forEach(a => {
    a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`);
  });
}

function setSectionVisuals(index) {
  if (!isSectionMode()) return;
  getSections().forEach((el, i) => {
    el.classList.toggle('is-active-section', i === index);
  });
}

function resolveIndex() {
  const marker = window.scrollY + window.innerHeight * 0.38;
  let index = 0;
  getSections().forEach((el, i) => {
    if (el.offsetTop <= marker) index = i;
  });
  return index;
}

function isSectionTallerThanViewport(section) {
  return section.offsetHeight > window.innerHeight + 40;
}

function canScrollWithinSection(deltaY) {
  const sections = getSections();
  currentIndex = resolveIndex();
  const section = sections[currentIndex];
  if (!section || !isSectionTallerThanViewport(section)) return false;

  const top = section.offsetTop;
  const bottom = top + section.offsetHeight;
  const viewTop = window.scrollY;
  const viewBottom = viewTop + window.innerHeight;
  const edge = 32;

  if (deltaY > 0) return viewBottom < bottom - edge;
  if (deltaY < 0) return viewTop > top + edge;
  return false;
}

function shouldUseNativeScroll(deltaY) {
  if (canScrollWithinSection(deltaY)) return true;

  const sections = getSections();
  const last = sections[sections.length - 1];
  if (!last) return false;

  const lastIndex = sections.length - 1;
  currentIndex = resolveIndex();

  if (deltaY > 0 && currentIndex >= lastIndex) return true;

  if (deltaY < 0 && window.scrollY > last.offsetTop + 60) return true;

  return false;
}

function easeInOutQuart(t) {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

function animateScrollTo(targetY, activeIndex) {
  if (rafId) cancelAnimationFrame(rafId);

  const startY = window.scrollY;
  const distance = targetY - startY;
  if (Math.abs(distance) < 3) {
    if (activeIndex != null) setSectionVisuals(activeIndex);
    return Promise.resolve();
  }

  isLocked = true;
  document.documentElement.classList.add('is-scrolling');
  if (activeIndex != null) setSectionVisuals(activeIndex);

  const startTime = performance.now();

  return new Promise(resolve => {
    function frame(now) {
      const progress = Math.min(1, (now - startTime) / SCROLL_DURATION);
      window.scrollTo(0, startY + distance * easeInOutQuart(progress));

      if (progress < 1) {
        rafId = requestAnimationFrame(frame);
      } else {
        rafId = null;
        document.documentElement.classList.remove('is-scrolling');
        setTimeout(() => {
          isLocked = false;
          resolve();
        }, Math.max(0, LOCK_MS - SCROLL_DURATION));
      }
    }

    rafId = requestAnimationFrame(frame);
  });
}

function scrollToIndex(index) {
  const sections = getSections();
  const next = Math.max(0, Math.min(sections.length - 1, index));
  const el = sections[next];
  if (!el) return;

  currentIndex = next;
  wheelSum = 0;
  setActiveSection(SECTION_IDS[next]);
  return animateScrollTo(el.offsetTop, next);
}

function initWheelSections() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia('(max-width: 900px)').matches;
  if (reduced || mobile || !isSectionMode()) return;

  window.addEventListener('wheel', e => {
    if (document.body.classList.contains('is-locked')) return;
    if (document.getElementById('lightbox')?.classList.contains('is-active')) return;

    if (isLocked) {
      e.preventDefault();
      return;
    }

    if (shouldUseNativeScroll(e.deltaY)) return;

    e.preventDefault();
    currentIndex = resolveIndex();

    wheelSum += e.deltaY;
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => { wheelSum = 0; }, 120);

    if (Math.abs(wheelSum) < WHEEL_THRESHOLD) return;

    const direction = wheelSum > 0 ? 1 : -1;
    wheelSum = 0;
    scrollToIndex(currentIndex + direction);
  }, { passive: false });

  window.addEventListener('keydown', e => {
    if (isLocked || document.body.classList.contains('is-locked')) return;
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'PageDown' && e.key !== 'PageUp') return;

    currentIndex = resolveIndex();
    const direction = (e.key === 'ArrowDown' || e.key === 'PageDown') ? 1 : -1;
    if (shouldUseNativeScroll(direction)) return;

    e.preventDefault();
    scrollToIndex(currentIndex + direction);
  });
}

function initScrollSpy() {
  const sections = getSections();
  if (!sections.length || !('IntersectionObserver' in window)) return;

  const spy = new IntersectionObserver(entries => {
    if (isLocked) return;
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      const index = SECTION_IDS.indexOf(id);
      if (index < 0) return;
      currentIndex = index;
      setActiveSection(id);
      setSectionVisuals(index);
    });
  }, { rootMargin: '-42% 0px -42% 0px', threshold: 0 });

  sections.forEach(section => spy.observe(section));
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      const index = SECTION_IDS.indexOf(target.id);
      if (index >= 0 && isSectionMode()) {
        scrollToIndex(index);
      } else {
        animateScrollTo(target.offsetTop - getHeaderOffset());
      }
    });
  });
}

function goToEntrySection() {
  const index = SECTION_IDS.indexOf('top');
  if (index < 0) return;

  const el = getSections()[index];
  if (!el) return;

  currentIndex = index;
  wheelSum = 0;
  setActiveSection('top');
  if (isSectionMode()) setSectionVisuals(index);
  window.scrollTo(0, el.offsetTop);
}

function initSectionScroll() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia('(max-width: 900px)').matches;

  if (!reduced && !mobile) {
    document.documentElement.classList.add('has-section-scroll');
  }

  initSmoothScroll();
  initScrollSpy();
  initWheelSections();
}
