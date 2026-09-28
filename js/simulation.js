/* ═══════════════════════════════════════════════════════════
   NEUTRON · simulation.js
   Hero command bar, platform map, pipeline, live console.
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── HERO COMMAND BAR ─── */
  const form = document.getElementById('commandForm');
  const input = document.getElementById('commandInput');
  const out = document.getElementById('commandOutput');

  if (form && input && out) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const prompt = input.value.trim();
      if (!prompt) return;

      NEUTRON.setState('listening');
      out.textContent = '> ' + prompt;

      await wait(400);
      NEUTRON.setState('analyzing');
      await wait(500);
      NEUTRON.setState('thinking');

      const reply = await NEUTRON.cannedReply(prompt);
      await wait(400);
      NEUTRON.setState('response');
      out.textContent = '> ' + prompt + '\n' + reply;

      await wait(1800);
      NEUTRON.setState('idle');
      input.value = '';
    });
  }

  /* ─── PLATFORM MAP ─── */
  const mapWrap = document.querySelector('.map-svg-wrap');
  if (mapWrap) {
    const svgG = document.getElementById('mapLines');
    const nodes = mapWrap.querySelectorAll('.map-node');
    const core = mapWrap.querySelector('.map-core');
    const infoTitle = document.getElementById('mapInfoTitle');
    const infoBody = document.getElementById('mapInfoBody');

    const COPY = {
      core: {
        title: 'NEUTRON CORE',
        body: 'The central intelligence. Every subsystem routes through here — it\u2019s where perception, analysis and memory meet.'
      },
      vision: {
        title: 'VISION',
        body: 'Understand images, diagrams, screenshots and technical architectures. NEUTRON reads circuits like sentences.'
      },
      language: {
        title: 'LANGUAGE',
        body: 'Understand and transform natural language — summarize, rewrite, translate intent, extract structure.'
      },
      voice: {
        title: 'VOICE',
        body: 'Interact naturally through speech. NEUTRON listens, transcribes, and responds in context.'
      },
      knowledge: {
        title: 'KNOWLEDGE',
        body: 'Work with documents, information and project context. Every file stays accessible across conversations.'
      },
      projects: {
        title: 'PROJECTS',
        body: 'Keep files, conversations and context together. Every workspace links what you know.'
      },
      analysis: {
        title: 'ANALYSIS',
        body: 'Turn complex information into understandable explanations — structured, sourced, grounded.'
      }
    };

    function selectNode(key) {
      const c = COPY[key];
      if (!c) return;
      infoTitle.textContent = c.title;
      infoBody.textContent = c.body;

      nodes.forEach(n => n.classList.toggle('active', n.dataset.node === key));
      if (core) core.classList.toggle('active', key === 'core');

      // draw active lines from core to node
      if (svgG) {
        svgG.innerHTML = '';
        if (key !== 'core') {
          const node = mapWrap.querySelector(`.map-node[data-node="${key}"]`);
          if (node) {
            const wrapRect = mapWrap.getBoundingClientRect();
            const nRect = node.getBoundingClientRect();
            const cRect = core.getBoundingClientRect();
            const x1 = cRect.left + cRect.width / 2 - wrapRect.left;
            const y1 = cRect.top + cRect.height / 2 - wrapRect.top;
            const x2 = nRect.left + nRect.width / 2 - wrapRect.left;
            const y2 = nRect.top + nRect.height / 2 - wrapRect.top;
            const scale = 600 / wrapRect.width;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x1 * scale);
            line.setAttribute('y1', y1 * scale);
            line.setAttribute('x2', x2 * scale);
            line.setAttribute('y2', y2 * scale);
            line.setAttribute('class', 'active');
            svgG.appendChild(line);
          }
        }
      }
    }

    nodes.forEach(n => n.addEventListener('click', () => selectNode(n.dataset.node)));
    if (core) core.addEventListener('click', () => selectNode('core'));
    selectNode('core');
  }

  /* ─── PIPELINE ─── */
  const pipeline = document.getElementById('pipeline');
  if (pipeline) {
    const stages = pipeline.querySelectorAll('.pstage');
    const detail = document.getElementById('pipelineDetail');
    const particlesG = document.getElementById('flowParticles');

    const COPY = {
      input: 'Raw material enters the system — text, an image, a file, a spoken command.',
      perception: 'NEUTRON identifies what kind of input it\u2019s looking at and which subsystems apply.',
      understanding: 'The relevant subsystems begin to parse structure, meaning and intent.',
      analysis: 'Vision, language and knowledge process the input in parallel — extracting components, relations, and constraints.',
      context: 'Results are linked back to your project\u2019s existing files and conversations.',
      response: 'A grounded answer is generated — not a generic completion.'
    };

    stages.forEach(s => s.addEventListener('click', () => {
      stages.forEach(x => x.classList.remove('active'));
      s.classList.add('active');
      detail.textContent = COPY[s.dataset.stage] || '';
    }));
    stages[0].click();

    // flowing particles
    if (particlesG && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (let i = 0; i < 10; i++) {
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('r', '2');
        c.setAttribute('fill', i % 2 ? '#5fd9e8' : '#a89cf5');
        c.setAttribute('opacity', '0.6');
        particlesG.appendChild(c);
        animateParticle(c, i * 100);
      }
    }

    function animateParticle(c, delay) {
      const start = performance.now() + delay;
      const dur = 4000;
      function frame(now) {
        let t = ((now - start) % dur) / dur;
        if (t < 0) t = 0;
        const x = t * 1000;
        const y = 60 + Math.sin(t * Math.PI * 2) * 6;
        c.setAttribute('cx', x);
        c.setAttribute('cy', y);
        c.setAttribute('opacity', Math.sin(t * Math.PI) * 0.7);
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
  }

  /* ─── LIVE CONSOLE ─── */
  const consoleLog = document.getElementById('consoleLog');
  if (consoleLog) {
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => chip.addEventListener('click', async () => {
      const prompt = chip.textContent.trim();
      consoleLog.innerHTML = `<div class="you">> ${prompt}</div>`;

      NEUTRON.setState('listening');
      await wait(350);
      NEUTRON.setState('analyzing');
      await wait(450);
      NEUTRON.setState('thinking');

      const reply = await NEUTRON.cannedReply(prompt);
      NEUTRON.setState('response');

      const line = document.createElement('div');
      line.textContent = reply;
      consoleLog.appendChild(line);

      await wait(1800);
      NEUTRON.setState('idle');
    }));
  }

  /* ─── FINAL CORE hover reactivity ─── */
  document.querySelectorAll('[data-hover-core]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      const core = document.getElementById('finalCore');
      if (!core) return;
      const orb = core.querySelector('.core-orb');
      if (orb) orb.style.boxShadow = '0 0 100px 26px rgba(95,217,232,.6)';
    });
    el.addEventListener('mouseleave', () => {
      const core = document.getElementById('finalCore');
      if (!core) return;
      const orb = core.querySelector('.core-orb');
      if (orb) orb.style.boxShadow = '';
    });
  });

  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
})();