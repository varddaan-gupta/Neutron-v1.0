/* ═══════════════════════════════════════════════════════════
   NEUTRON · auth.js
   Client-side validation for signin.html and signup.html.
   Routes through NEUTRON.api so a real backend can be dropped in.
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showError(field, msg) {
    field.classList.add('invalid');
    const err = field.querySelector('.error');
    if (err) err.textContent = msg;
  }
  function clearError(field) {
    field.classList.remove('invalid');
    const err = field.querySelector('.error');
    if (err) err.textContent = '';
  }
  function setMsg(el, text, isError) {
    if (!el) return;
    el.textContent = text;
    el.classList.add('show');
    el.classList.toggle('error', !!isError);
  }
  function setLoading(btn, loading, label) {
    if (!btn) return;
    if (loading) {
      btn.dataset.label = btn.dataset.label || btn.textContent;
      btn.disabled = true;
      btn.textContent = '…';
    } else {
      btn.disabled = false;
      btn.textContent = label || btn.dataset.label || btn.textContent;
    }
  }

  /* ─── SIGN IN ─── */
  const signinForm = document.getElementById('signinForm');
  if (signinForm) {
    const emailF = document.getElementById('emailField');
    const passF = document.getElementById('passwordField');
    const msg = document.getElementById('formMsg');
    const btn = document.getElementById('signinBtn');

    signinForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let valid = true;
      clearError(emailF); clearError(passF);
      msg.classList.remove('show');

      const email = emailF.querySelector('input').value.trim();
      const pass = passF.querySelector('input').value;

      if (!email) { showError(emailF, 'Email is required.'); valid = false; }
      else if (!emailRe.test(email)) { showError(emailF, 'Enter a valid email address.'); valid = false; }

      if (!pass) { showError(passF, 'Password is required.'); valid = false; }
      else if (pass.length < 8) { showError(passF, 'Password must be at least 8 characters.'); valid = false; }

      if (!valid) return;

      setLoading(btn, true);
      setMsg(msg, 'Signing in…', false);

      try {
        const res = await NEUTRON.api.signIn(email, pass);
        if (res.ok) {
          setMsg(msg, 'Signed in. Redirecting to your workspace…', false);
          setTimeout(() => { window.location.href = 'index.html'; }, 1200);
        } else {
          setMsg(msg, 'Something went wrong.', true);
          setLoading(btn, false, 'SIGN IN');
        }
      } catch (err) {
        setMsg(msg, 'Network error. Please try again.', true);
        setLoading(btn, false, 'SIGN IN');
      }
    });
  }

  /* ─── SIGN UP ─── */
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    const nameF = document.getElementById('nameField');
    const emailF = document.getElementById('emailField');
    const passF = document.getElementById('passwordField');
    const confF = document.getElementById('confirmField');
    const msg = document.getElementById('formMsg');
    const btn = document.getElementById('signupBtn');

    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let valid = true;
      [nameF, emailF, passF, confF].forEach(clearError);
      msg.classList.remove('show');

      const name = nameF.querySelector('input').value.trim();
      const email = emailF.querySelector('input').value.trim();
      const pass = passF.querySelector('input').value;
      const conf = confF.querySelector('input').value;

      if (!name) { showError(nameF, 'Name is required.'); valid = false; }
      else if (name.length < 2) { showError(nameF, 'Enter at least 2 characters.'); valid = false; }

      if (!email) { showError(emailF, 'Email is required.'); valid = false; }
      else if (!emailRe.test(email)) { showError(emailF, 'Enter a valid email address.'); valid = false; }

      if (!pass) { showError(passF, 'Password is required.'); valid = false; }
      else if (pass.length < 8) { showError(passF, 'Password must be at least 8 characters.'); valid = false; }

      if (!conf) { showError(confF, 'Please confirm your password.'); valid = false; }
      else if (conf !== pass) { showError(confF, 'Passwords do not match.'); valid = false; }

      if (!valid) return;

      setLoading(btn, true);
      setMsg(msg, 'Creating your environment…', false);

      try {
        const res = await NEUTRON.api.signUp(name, email, pass);
        if (res.ok) {
          setMsg(msg, 'Account created. Redirecting…', false);
          setTimeout(() => { window.location.href = 'index.html'; }, 1200);
        } else {
          setMsg(msg, 'Something went wrong.', true);
          setLoading(btn, false, 'CREATE ACCOUNT');
        }
      } catch (err) {
        setMsg(msg, 'Network error. Please try again.', true);
        setLoading(btn, false, 'CREATE ACCOUNT');
      }
    });
  }
})();