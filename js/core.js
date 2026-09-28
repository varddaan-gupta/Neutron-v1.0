/* ═══════════════════════════════════════════════════════════
   NEUTRON · core.js  —  v3 (GIF core)
   Starfield, cursor glow, state machine, core parallax.
   Public API: window.NEUTRON.{setState, state, on, api}
   ═══════════════════════════════════════════════════════════ */

window.NEUTRON = window.NEUTRON || {};

(function () {
  'use strict';

  /* ─── state machine ─── */
  const VALID = ['idle', 'listening', 'analyzing', 'thinking', 'response'];
  const listeners = new Set();
  let current = 'idle';

  NEUTRON.state = {
    get() { return current; },
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
  };

  NEUTRON.setState = function (state) {
    if (!VALID.includes(state)) state = 'idle';
    if (state === current) return;
    current = state;
    document.body.classList.remove(...VALID.map(s => 'st-' + s));
    document.body.classList.add('st-' + state);
    document.querySelectorAll('[data-core-state]').forEach(el => {
      el.textContent = state.toUpperCase();
    });
    listeners.forEach(fn => { try { fn(state); } catch (e) { console.error(e); } });
  };

  /* ─── API seams (future backend) ─── */
  NEUTRON.api = {
    async signIn(email, password) {
      await new Promise(r => setTimeout(r, 650));
      return { ok: true, user: { email } };
    },
    async signUp(name, email, password) {
      await new Promise(r => setTimeout(r, 700));
      return { ok: true, user: { name, email } };
    },
    async ask(prompt) {
      await new Promise(r => setTimeout(r, 700));
      return { ok: true, text: cannedReply(prompt) };
    },
    async analyzeImage(file) {
      await new Promise(r => setTimeout(r, 400));
      return { ok: true };
    }
  };

  /* ─── canned reply table ─── */
  function cannedReply(prompt) {
    const p = (prompt || '').trim().toLowerCase();
    const table = {
      'explain what neutron can do':
        'NEUTRON connects language, vision, voice and memory into one environment. Bring it an image, a document or a question — it keeps the context around it, not just the answer.',
      'analyze this architecture.':
        'This system uses an ESP32 as its primary controller, reading a distance sensor and driving a motor pair through a motor driver, with a servo for auxiliary movement.',
      'analyze a robot architecture.':
        'Detected: ESP32 MCU, L298N motor driver, HC-SR04 distance sensor, SG90 servo, dual DC motors. The ESP32 reads the sensor and drives the motor driver and servo in a classic obstacle-avoidance topology.',
      'explain this diagram.':
        'The diagram shows a sensor feeding a controller, which fans out to two actuator subsystems — a typical obstacle-avoidance layout.',
      'summarize this document.':
        'Three sections: goals, constraints, and a proposed architecture. The constraints section flags a power-budget risk worth reviewing.',
      'help me plan a project.':
        'Start with a scope note, then break it into files, analyses and conversations — NEUTRON keeps all three linked automatically as you work.',
      'rewrite this text.':
        "Here's a tighter version: same meaning, fewer words, active voice throughout.",
      'what can you help me with?':
        'I can analyze images and technical diagrams, read and summarize documents, help plan projects, transform language, and keep context across everything you work on.',
      'what is neutron?':
        'NEUTRON is an intelligent environment — not a chatbot. It brings vision, language, voice and memory together so your work keeps its context.'
    };
    return table[p] || "Understood. I'll need a connected backend to answer that specifically — but the interaction pipeline is working.";
  }
  NEUTRON.cannedReply = cannedReply;

  /* ─── starfield ─── */
  const canvas = document.getElementById('stars');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w, h, stars = [], nebula = [];
    let mx = 0, my = 0, t = 0;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const density = Math.min(180, Math.floor(w * h / 10000));
      stars = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.1 + 0.2,
        ph: Math.random() * 10,
      }));
      nebula = [
        { x: w * 0.18, y: h * 0.28, r: Math.max(w, h) * 0.55, c: 'rgba(61,217,235,0.028)' },
        { x: w * 0.82, y: h * 0.72, r: Math.max(w, h) * 0.6, c: 'rgba(139,127,232,0.022)' }
      ];
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', e => {
      mx = (e.clientX / window.innerWidth - 0.5);
      my = (e.clientY / window.innerHeight - 0.5);
      const glow = document.querySelector('.cursor-glow');
      if (glow) glow.style.transform = `translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`;
      document.body.classList.add('has-cursor');
    });
    window.addEventListener('mouseout', () => document.body.classList.remove('has-cursor'));

    let visible = true;
    document.addEventListener('visibilitychange', () => { visible = !document.hidden; });

    function draw() {
      if (visible && !reduced) {
        t += 0.016;
        ctx.clearRect(0, 0, w, h);

        for (const n of nebula) {
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
          g.addColorStop(0, n.c);
          g.addColorStop(1, 'transparent');
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, h);
        }

        ctx.fillStyle = '#dfe8ff';
        for (const s of stars) {
          ctx.globalAlpha = 0.22 + Math.sin(t * 1.3 + s.ph) * 0.28;
          const px = s.x + mx * 16 + Math.sin(t * 0.4 + s.ph) * 2;
          const py = s.y + my * 16;
          ctx.beginPath();
          ctx.arc(px, py, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ─── core parallax ─── */
  window.addEventListener('mousemove', e => {
    const dx = (e.clientX / window.innerWidth - 0.5) * 16;
    const dy = (e.clientY / window.innerHeight - 0.5) * 16;
    document.querySelectorAll('.core-wrap').forEach(wrap => {
      wrap.style.transform = `translate(${dx}px, ${dy}px)`;
    });
  });

  /* ─── ensure body has a state class ─── */
  document.addEventListener('DOMContentLoaded', () => {
    if (!VALID.some(s => document.body.classList.contains('st-' + s))) {
      document.body.classList.add('st-idle');
    }
  });
})();
