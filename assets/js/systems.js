/* ═══════════════════════════════════════════════════════════════════
   MODULE · Systèmes
   - Barre système (alerte EVT06-C + mode dégradé EVT04-C)
   - Mesure dynamique de la hauteur de barre (--sysbar-h)
   - Console de démonstration (toggles)
   ═══════════════════════════════════════════════════════════════════ */
function initSystems() {
  const root = document.documentElement;
  const body = document.body;
  const sysbar = document.getElementById('systemBar');

  /* hauteur réelle de la barre → décale le header */
  function updateSysbarHeight() {
    if (!sysbar) return;
    requestAnimationFrame(() => {
      let h = 0;
      sysbar.querySelectorAll('.sysbar__band').forEach(b => {
        if (getComputedStyle(b).display !== 'none') h += b.offsetHeight;
      });
      root.style.setProperty('--sysbar-h', h + 'px');
    });
  }
  updateSysbarHeight();
  window.addEventListener('resize', updateSysbarHeight, { passive: true });

  /* ── Console ── */
  const console_ = document.getElementById('ccaConsole');
  const toggle = document.getElementById('ccaConsoleToggle');
  if (console_ && toggle) {
    toggle.addEventListener('click', () => console_.classList.toggle('is-open'));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') console_.classList.remove('is-open'); });
    document.addEventListener('click', e => {
      if (!console_.contains(e.target)) console_.classList.remove('is-open');
    });
  }

  /* mode dégradé (switch) */
  const degSwitch = document.getElementById('ccaDegraded');
  if (degSwitch) {
    const sync = () => {
      const on = body.classList.contains('is-degraded');
      degSwitch.setAttribute('aria-pressed', on ? 'true' : 'false');
    };
    degSwitch.addEventListener('click', () => {
      body.classList.toggle('is-degraded');
      sync(); updateSysbarHeight();
    });
    sync();
  }

  /* état d'alerte (segmenté) */
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
      sync(); updateSysbarHeight();
    }));
    sync();
  }
  bindSeg('ccaAlert', 'data-alert');
  bindSeg('ccaEva', 'data-eva');
}
