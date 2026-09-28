/* ═══════════════════════════════════════════════════════════
   NEUTRON · projects.js
   Project cards → click-to-open modal with tabs.
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const modal = document.getElementById('projectModal');
  if (!modal) return;

  const modalTitle = document.getElementById('modalTitle');
  const modalMeta = document.getElementById('modalMeta');
  const modalBody = document.getElementById('modalBody');
  const tabs = modal.querySelectorAll('.modal-tab');

  const DATA = {
    robot: {
      title: 'AUTONOMOUS ROBOT',
      meta: 'Updated 2h ago · 14 files · 6 analyses · 12 conversations',
      overview: 'An ESP32-based obstacle-avoidance robot with distance sensing, motor control and a servo-mounted scanner. The project holds hardware schematics, firmware, and full analysis history.',
      files: [
        ['architecture.png', 'Diagram'],
        ['motor-control.ino', 'Firmware'],
        ['requirements.pdf', 'Document'],
        ['schematics.kicad', 'Schematic'],
        ['test-log.txt', 'Log']
      ],
      activity: [
        ['Analyzed architecture.png', '2h ago'],
        ['Updated motor-control.ino', '5h ago'],
        ['Discussed power budget', '1d ago'],
        ['Uploaded requirements.pdf', '2d ago']
      ],
      context: 'ESP32 primary controller. L298N motor driver for dual DC motors. HC-SR04 for distance. SG90 servo for sensor sweep. Power budget flagged as a risk — recommend 2S LiPo with 5V regulator.'
    },
    nlp: {
      title: 'NLP RESEARCH',
      meta: 'Updated 1d ago · 9 files · 3 analyses · 21 conversations',
      overview: 'A corpus-driven study of transformer model behavior on domain-specific text. Includes evaluation harnesses, results, and comparative notes.',
      files: [
        ['corpus.csv', 'Dataset'],
        ['notes.md', 'Notes'],
        ['eval-results.json', 'Results'],
        ['baseline.py', 'Script']
      ],
      activity: [
        ['Ran eval batch 4', '1d ago'],
        ['Added corpus sample', '2d ago'],
        ['Rewrote abstract', '3d ago']
      ],
      context: 'Focus on low-resource domain adaptation. Baseline transformer is underperforming on rare tokens — investigation ongoing.'
    },
    space: {
      title: 'SPACE SIMULATION',
      meta: 'Updated 3d ago · 22 files · 8 analyses · 7 conversations',
      overview: 'An orbital mechanics sandbox — numerically integrates trajectories, visualizes telemetry, and stores mission briefs.',
      files: [
        ['orbit-model.py', 'Simulation'],
        ['telemetry.log', 'Log'],
        ['brief.pdf', 'Brief'],
        ['viz.html', 'Visualization']
      ],
      activity: [
        ['Updated integrator', '3d ago'],
        ['Imported telemetry.log', '5d ago'],
        ['Added mission brief', '1w ago']
      ],
      context: 'Uses RK4 integration. Sensitivity to initial conditions is high — recommend tighter tolerance for long runs.'
    },
    lab: {
      title: 'PERSONAL LAB',
      meta: 'Updated 1w ago · 5 files · 2 analyses · 16 conversations',
      overview: 'A scratch space for experiments, half-formed ideas, and sketches. NEUTRON keeps everything linked even when the goal is unclear.',
      files: [
        ['ideas.md', 'Notes'],
        ['sketch.png', 'Sketch'],
        ['todo.txt', 'Todo']
      ],
      activity: [
        ['Added 3 ideas', '1w ago'],
        ['Reorganized notes', '2w ago']
      ],
      context: 'Open-ended. NEUTRON uses this project as a context anchor for cross-project references.'
    }
  };

  let currentTab = 'overview';
  let currentKey = null;

  function renderBody() {
    const p = DATA[currentKey];
    if (!p) return;
    let html = '';
    if (currentTab === 'overview') html = `<p>${p.overview}</p>`;
    if (currentTab === 'files') html = '<ul>' + p.files.map(([n, t]) => `<li><span>${n}</span><span>${t}</span></li>`).join('') + '</ul>';
    if (currentTab === 'activity') html = '<ul>' + p.activity.map(([a, t]) => `<li><span>${a}</span><span>${t}</span></li>`).join('') + '</ul>';
    if (currentTab === 'context') html = `<p>${p.context}</p>`;
    modalBody.innerHTML = html;
  }

  function openModal(key) {
    const p = DATA[key];
    if (!p) return;
    currentKey = key;
    currentTab = 'overview';
    modalTitle.textContent = p.title;
    modalMeta.textContent = p.meta;
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === 'overview'));
    renderBody();
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.project));
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });

  tabs.forEach(t => t.addEventListener('click', () => {
    currentTab = t.dataset.tab;
    tabs.forEach(x => x.classList.toggle('active', x === t));
    renderBody();
  }));

  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
})();