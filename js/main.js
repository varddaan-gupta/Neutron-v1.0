/* ═══════════════════════════════════════════════════════════
   NEUTRON · main.js
   Page orchestrator. Wires sections to core state, sets up
   system-status animation, section → state mapping.
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── section → core state mapping ─── */
  const SECTION_STATE = {
    home: 'idle',
    platform: 'idle',
    vision: 'analyzing',
    projects: 'thinking',
    how: 'thinking',
    try: 'analyzing',
    system: 'idle',
    about: 'idle',
    enter: 'response'
  };

  const sectionEls = Object.keys(SECTION_STATE)
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if (sectionEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const state = SECTION_STATE[en.target.id];
          if (state) NEUTRON.setState(state);
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    sectionEls.forEach(s => io.observe(s));
  }

  /* ─── system-status diagnostic effect ─── */
  const sysItems = document.querySelectorAll('.sys-item');
  sysItems.forEach((item, i) => {
    const state = item.querySelector('.sys-state');
    if (!state) return;
    if (state.classList.contains('ok')) {
      // occasional blip for "ready" systems
      setInterval(() => {
        state.style.opacity = '0.4';
        setTimeout(() => { state.style.opacity = ''; }, 180);
      }, 4500 + i * 900 + Math.random() * 2000);
    }
  });

  /* ─── placeholder links (do nothing gracefully) ─── */
  document.querySelectorAll('[data-noop]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      el.style.opacity = '0.5';
      setTimeout(() => { el.style.opacity = ''; }, 200);
    });
  });

  /* ─── current year in footer if needed ─── */
  // (nothing to inject; footer is static for now)
})();