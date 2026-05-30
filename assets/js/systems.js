/* ═══════════════════════════════════════════════════════════════════
   MODULE · Systèmes
   - Barre système (alerte EVT06-C + mode dégradé EVT04-C)
   - Mesure dynamique de la hauteur de barre (--sysbar-h)
   - Console de démonstration (toggles)
   - Corruption texte secondaire + bursts VHS
   ═══════════════════════════════════════════════════════════════════ */

const DEG_GLITCH_CHARS = '▮░▒#@?¿·█';
const DEG_CIPHER_CHARS = '▮░▒#@?¿·█0123456789ABCDEF';

function degScrambleLabel(text) {
  return [...text].map(ch =>
    ch === '-' || ch === '·' || ch === ' '
      ? ch
      : DEG_CIPHER_CHARS[Math.floor(Math.random() * DEG_CIPHER_CHARS.length)]
  ).join('');
}

function degLightCorrupt(text, rate = 0.16) {
  return [...text].map(ch =>
    ch === ' ' || ch === '·' || ch === '%' || Math.random() > rate
      ? ch
      : DEG_GLITCH_CHARS[Math.floor(Math.random() * DEG_GLITCH_CHARS.length)]
  ).join('');
}

function initDegradeTextCorruption(body) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = [...document.querySelectorAll('[data-degrade-corrupt]')];

  targets.forEach(el => {
    if (!el.dataset.degradeOriginal) {
      el.dataset.degradeOriginal = el.textContent.trim();
    }
  });

  let burstTimer = null;
  let loopTimer = null;
  let restoreTimer = null;

  function baseText(el) {
    return el.dataset.degradeAlt && body.classList.contains('is-degraded')
      ? el.dataset.degradeAlt
      : el.dataset.degradeOriginal;
  }

  function applyBaseTexts() {
    targets.forEach(el => { el.textContent = baseText(el); });
  }

  function burst() {
    if (!body.classList.contains('is-degraded') || reduced) return;

    body.classList.add('is-vhs-burst');
    setTimeout(() => body.classList.remove('is-vhs-burst'), 300);

    targets.forEach(el => {
      el.textContent = degLightCorrupt(baseText(el));
      el.classList.add('deg-corrupt-flash');
    });

    clearTimeout(restoreTimer);
    restoreTimer = setTimeout(() => {
      targets.forEach(el => el.classList.remove('deg-corrupt-flash'));
      applyBaseTexts();
    }, 300);
  }

  function scheduleLoop() {
    clearTimeout(loopTimer);
    loopTimer = setTimeout(() => {
      burst();
      scheduleLoop();
    }, 6000 + Math.random() * 4000);
  }

  function start() {
    stop(false);
    applyBaseTexts();
    if (reduced) return;
    burstTimer = setTimeout(burst, 1400);
    scheduleLoop();
  }

  function stop(restore = true) {
    clearTimeout(burstTimer);
    clearTimeout(loopTimer);
    clearTimeout(restoreTimer);
    body.classList.remove('is-vhs-burst');
    burstTimer = loopTimer = restoreTimer = null;
    targets.forEach(el => el.classList.remove('deg-corrupt-flash'));
    if (restore) {
      targets.forEach(el => { el.textContent = el.dataset.degradeOriginal; });
    }
  }

  return { start, stop };
}

function initDegToggleCrypt(btn, body, onToggle) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const label = btn.querySelector('.deg-toggle__label');
  if (!label) return;

  const LABEL_IDLE = 'COM-DEGRAD';
  const LABEL_ACTIVE = 'LIAISON DÉGRADÉE';
  let scrambleTimer = null;
  let decryptTimer = null;
  let peekTimer = null;
  let hovering = false;

  function isOn() {
    return body.classList.contains('is-degraded');
  }

  function setAria(on) {
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.setAttribute('aria-label', on
      ? 'Désactiver le protocole COM-DEGRAD · liaison dégradée active'
      : 'Déverrouiller le protocole COM-DEGRAD · tempête solaire');
  }

  function stopLoops() {
    clearInterval(scrambleTimer);
    clearTimeout(decryptTimer);
    clearTimeout(peekTimer);
    scrambleTimer = decryptTimer = peekTimer = null;
  }

  function showPlain(text) {
    label.textContent = text;
    btn.classList.add('is-decrypted');
    btn.classList.remove('deg-toggle--locked');
  }

  function showLockedScramble() {
    btn.classList.add('deg-toggle--locked');
    btn.classList.remove('is-decrypted');
    label.textContent = degScrambleLabel(LABEL_IDLE);
  }

  function startScrambleLoop() {
    if (isOn() || hovering) return;
    stopLoops();
    if (reduced) {
      label.textContent = LABEL_IDLE;
      btn.classList.add('is-decrypted');
      btn.classList.remove('deg-toggle--locked');
      return;
    }
    showLockedScramble();
    scrambleTimer = setInterval(() => {
      if (!isOn() && !hovering) label.textContent = degScrambleLabel(LABEL_IDLE);
    }, 720);
    peekTimer = setTimeout(function peek() {
      if (isOn() || hovering) return;
      label.textContent = LABEL_IDLE;
      btn.classList.add('is-peek');
      peekTimer = setTimeout(() => {
        btn.classList.remove('is-peek');
        if (!isOn() && !hovering) showLockedScramble();
        if (!isOn() && !hovering) peekTimer = setTimeout(peek, 4200 + Math.random() * 2800);
      }, 140);
    }, 2600);
  }

  function decryptTo(text, steps = 8) {
    stopLoops();
    btn.classList.remove('deg-toggle--locked');
    let step = 0;
    const len = text.length;

    function tick() {
      const progress = step / steps;
      label.textContent = [...text].map((ch, i) => {
        if (ch === '-' || ch === '·' || ch === ' ') return ch;
        if (i < Math.floor(len * progress)) return ch;
        return DEG_CIPHER_CHARS[Math.floor(Math.random() * DEG_CIPHER_CHARS.length)];
      }).join('');
      step += 1;
      if (step <= steps) {
        decryptTimer = setTimeout(tick, reduced ? 0 : 38);
      } else {
        showPlain(text);
      }
    }
    tick();
  }

  function syncVisual() {
    btn.classList.toggle('is-active', isOn());
    setAria(isOn());
    stopLoops();
    if (isOn()) {
      showPlain(LABEL_ACTIVE);
    } else if (hovering) {
      decryptTo(LABEL_IDLE);
    } else {
      startScrambleLoop();
    }
  }

  btn.addEventListener('mouseenter', () => {
    hovering = true;
    if (!isOn()) decryptTo(LABEL_IDLE);
  });

  btn.addEventListener('mouseleave', () => {
    hovering = false;
    if (!isOn()) startScrambleLoop();
  });

  btn.addEventListener('focus', () => {
    hovering = true;
    if (!isOn()) decryptTo(LABEL_IDLE);
  });

  btn.addEventListener('blur', () => {
    hovering = false;
    if (!isOn()) startScrambleLoop();
  });

  btn.addEventListener('click', () => {
    onToggle();
    syncVisual();
  });

  syncVisual();
  return { sync: syncVisual };
}

function initSystems() {
  const root = document.documentElement;
  const body = document.body;
  const sysbar = document.getElementById('systemBar');
  const textFx = initDegradeTextCorruption(body);
  const vhsFx = initDegradeVhs();

  function updateSysbarHeight() {
    requestAnimationFrame(() => {
      let h = 0;
      if (sysbar) {
        sysbar.querySelectorAll('.sysbar__band').forEach(b => {
          if (getComputedStyle(b).display !== 'none') h += b.offsetHeight;
        });
      }
      root.style.setProperty('--sysbar-h', h + 'px');
      const header = document.getElementById('siteHeader');
      if (header) root.style.setProperty('--header-h', header.offsetHeight + 'px');
    });
  }
  updateSysbarHeight();
  window.addEventListener('resize', updateSysbarHeight, { passive: true });

  const console_ = document.getElementById('ccaConsole');
  const toggle = document.getElementById('ccaConsoleToggle');
  if (console_ && toggle) {
    toggle.addEventListener('click', () => console_.classList.toggle('is-open'));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') console_.classList.remove('is-open'); });
    document.addEventListener('click', e => {
      if (!console_.contains(e.target)) console_.classList.remove('is-open');
    });
  }

  function setDegraded(on) {
    body.classList.toggle('is-degraded', on);
    if (on) {
      textFx.start();
      vhsFx.start();
    } else {
      textFx.stop();
      vhsFx.stop();
    }
    updateSysbarHeight();
  }

  let degCrypt = null;
  const degBtn = document.getElementById('degToggle');
  if (degBtn) {
    degCrypt = initDegToggleCrypt(degBtn, body, () => {
      setDegraded(!body.classList.contains('is-degraded'));
    });
  }

  function bindSeg(groupId, attr) {
    const group = document.getElementById(groupId);
    if (!group) return;
    const buttons = group.querySelectorAll('button');
    const sync = () => {
      const val = body.getAttribute(attr);
      buttons.forEach(b => b.classList.toggle('is-active', b.dataset.val === val));
    };
    buttons.forEach(b => b.addEventListener('click', () => {
      body.setAttribute(attr, b.dataset.val);
      sync();
      updateSysbarHeight();
    }));
    sync();
  }
  bindSeg('ccaAlert', 'data-alert');
  bindSeg('ccaEva', 'data-eva');
}
