/* ═══════════════════════════════════════════════════════════
   NEUTRON · vision.js
   Drag & drop, upload, simulated analysis pipeline,
   ask-about-image mini conversation.
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const drop = document.getElementById('visionDrop');
  if (!drop) return;

  const fileInput = document.getElementById('visionFile');
  const idle = document.getElementById('dropzoneIdle');
  const preview = document.getElementById('dropzonePreview');
  const scanLine = document.getElementById('scanLine');
  const status = document.getElementById('visionStatus');
  const compBlock = document.getElementById('compBlock');
  const connBlock = document.getElementById('connBlock');
  const askBtn = document.getElementById('askVision');
  const convo = document.getElementById('visionConvo');
  const useSample = document.getElementById('useSample');

  let analyzing = false;

  /* ─── open picker ─── */
  drop.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    if (drop.classList.contains('has-preview')) return;
    fileInput.click();
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files[0]) runAnalysis();
  });

  useSample && useSample.addEventListener('click', (e) => {
    e.stopPropagation();
    runAnalysis();
  });

  /* ─── drag & drop ─── */
  ['dragenter', 'dragover'].forEach(ev => {
    drop.addEventListener(ev, (e) => {
      e.preventDefault();
      drop.classList.add('dragover');
    });
  });
  ['dragleave', 'drop'].forEach(ev => {
    drop.addEventListener(ev, (e) => {
      e.preventDefault();
      drop.classList.remove('dragover');
    });
  });
  drop.addEventListener('drop', (e) => {
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) runAnalysis();
  });

  /* ─── analysis pipeline ─── */
  async function runAnalysis() {
    if (analyzing) return;
    analyzing = true;

    // switch to preview
    idle.hidden = true;
    preview.hidden = false;
    drop.classList.add('has-preview');

    // reset blocks
    [compBlock, connBlock].forEach(b => b.classList.remove('visible'));
    convo.hidden = true;
    convo.innerHTML = '';
    askBtn.hidden = true;

    // simulate pipeline
    const stages = [
      { msg: 'IMAGE RECEIVED', wait: 350 },
      { msg: 'SCANNING…', wait: 550, scan: true },
      { msg: 'IDENTIFYING COMPONENTS…', wait: 600 },
      { msg: 'MAPPING CONNECTIONS…', wait: 600, scan: false },
      { msg: 'ANALYSIS COMPLETE', wait: 250, done: true }
    ];

    for (const s of stages) {
      status.textContent = s.msg;
      if (s.scan !== undefined) scanLine.classList.toggle('active', s.scan);
      if (typeof NEUTRON?.setState === 'function') {
        NEUTRON.setState(s.done ? 'idle' : 'analyzing');
      }
      await wait(s.wait);
    }

    scanLine.classList.remove('active');
    compBlock.classList.add('visible');
    await wait(250);
    connBlock.classList.add('visible');
    askBtn.hidden = false;
    analyzing = false;
  }

  /* ─── ask-about-image ─── */
  askBtn.addEventListener('click', async () => {
    convo.hidden = false;
    convo.innerHTML = '<div class="you">You: "What does this architecture do?"</div>';
    if (typeof NEUTRON?.setState === 'function') NEUTRON.setState('thinking');
    const reply = await NEUTRON.cannedReply('Analyze this architecture.');
    if (typeof NEUTRON?.setState === 'function') NEUTRON.setState('idle');
    const line = document.createElement('div');
    line.className = 'n';
    line.textContent = `NEUTRON: "${reply}"`;
    convo.appendChild(line);
  });

  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
})();