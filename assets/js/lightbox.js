function initLightbox() {
  const lb = document.getElementById('lightbox');
  const lbImage = document.getElementById('lbImage');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  const lbDots = document.getElementById('lbDots');
  if (!lb || !lbImage) return;
  const data = (typeof GALLERY_DATA !== "undefined") ? GALLERY_DATA : [];
  if (!data.length) return;

  const fields = {
    id: document.getElementById('lbId'),
    title: document.getElementById('lbTitle'),
    loc: document.getElementById('lbLoc'),
    date: document.getElementById('lbDate'),
    time: document.getElementById('lbTime'),
    op: document.getElementById('lbOp'),
    inst: document.getElementById('lbInst'),
    coord: document.getElementById('lbCoord'),
    exp: document.getElementById('lbExp'),
    src: document.getElementById('lbSrc'),
    desc: document.getElementById('lbDesc'),
    counter: document.getElementById('lbCounter')
  };

  

  let current = 0;

  // Build dots
  data.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'lightbox__dot';
    d.setAttribute('aria-label', 'Image ' + (i + 1));
    d.addEventListener('click', () => show(i));
    lbDots.appendChild(d);
  });

  function show(i) {
    current = ((i % data.length) + data.length) % data.length;
    const d = data[current];

    // Clone visuel depuis la plaque (SVG ou photo)
    const frame = document.querySelector('.gallery__plate[data-i="' + current + '"] .gallery__image-frame');
    const source = frame?.querySelector('svg, img');
    if (source) {
      lbImage.querySelectorAll('.lb-injected').forEach(el => el.remove());
      const clone = source.cloneNode(true);
      clone.classList.add('lb-injected');
      if (clone.tagName === 'IMG') {
        clone.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover';
      } else {
        clone.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
      }
      lbImage.insertBefore(clone, lbImage.firstChild);
    }

    fields.id.textContent = d.id;
    fields.title.textContent = d.title;
    fields.loc.textContent = d.loc;
    fields.date.textContent = d.date;
    fields.time.textContent = d.time;
    fields.op.textContent = d.op;
    fields.inst.textContent = d.inst;
    fields.coord.textContent = d.coord;
    fields.exp.textContent = d.exp;
    fields.src.textContent = d.src;
    fields.desc.textContent = d.desc;
    fields.counter.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(data.length).padStart(2, '0');

    lbDots.querySelectorAll('.lightbox__dot').forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === current);
    });
  }

  function open(i) {
    show(i);
    lb.classList.add('is-active');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked', 'is-lightbox-open');
  }

  function close() {
    lb.classList.remove('is-active');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked', 'is-lightbox-open');
  }

  // Bind plates
  document.querySelectorAll('.gallery__plate').forEach(p => {
    p.addEventListener('click', () => open(parseInt(p.dataset.i, 10)));
  });

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', () => show(current - 1));
  lbNext.addEventListener('click', () => show(current + 1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('is-active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
}