/* VaultRecords – account registration and sign-in for registered accounts (demo, browser storage only).
   Added alongside main.js, which is unchanged. Uses its globals: $, SKEY, RKEY, loadData, saveData, addActivity, initializeData, toast. */
(function () {
  const UK = 'vaultRecordsUsers';
  const users = () => { try { return JSON.parse(localStorage.getItem(UK)) || []; } catch (e) { return []; } };
  const setUsers = u => { try { localStorage.setItem(UK, JSON.stringify(u)); } catch (e) {} };
  const signIn = u => {
    try { localStorage.setItem(SKEY, JSON.stringify({ email: u.email, at: Date.now() })); } catch (e) {}
    initializeData();
    const d = loadData();
    d.company = { ...d.company, name: u.company || u.name, contact: u.name, email: u.email, phone: u.phone || '' };
    saveData(d);
  };
  const note = (el, text, ok) => { el.textContent = text; el.className = 'msg ' + (ok ? 'ok' : 'er'); };

  document.addEventListener('DOMContentLoaded', () => {
    /* ---- sign in with a registered account (runs before main.js's demo-only check) ---- */
    const lf = document.getElementById('lf');
    if (lf) lf.addEventListener('submit', e => {
      const em = $('#u').value.trim().toLowerCase(), u = users().find(x => x.email === em && x.pw === $('#p').value);
      if (!u) return; // not a registered account: main.js handles the demo login and messages
      e.preventDefault(); e.stopImmediatePropagation();
      const m = $('#lmsg');
      if (!$('#tc').checked) return note(m, 'Accept the Terms & Conditions to continue.');
      signIn(u);
      try { if ($('#rm').checked) localStorage.setItem(RKEY, u.email); else localStorage.removeItem(RKEY); } catch (err) {}
      note(m, 'Signed in. Redirecting to your dashboard…', true);
      setTimeout(() => location.href = 'dashboard.html', 350);
    }, true);

    /* ---- registration ---- */
    const rf = document.getElementById('reg');
    if (!rf) return;
    const f = id => document.getElementById(id), msg = f('rmsg');
    const strength = pw => [/.{8,}/, /[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter(r => r.test(pw)).length;
    f('pw1').addEventListener('input', e => {
      const s = strength(e.target.value), bar = f('sbar');
      bar.style.setProperty('--s', s / 5); bar.dataset.l = s <= 2 ? 'Weak' : s <= 3 ? 'Fair' : 'Strong';
      bar.className = 'sbar l' + (e.target.value ? (s <= 2 ? 1 : s <= 3 ? 2 : 3) : 0);
    });
    document.querySelectorAll('.pw-t2').forEach(b => b.onclick = () => {
      const i = f(b.dataset.for), show = i.type === 'password';
      i.type = show ? 'text' : 'password'; b.setAttribute('aria-pressed', show); b.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      b.querySelector('use').setAttribute('href', show ? '#i-eyeoff' : '#i-eye');
    });
    rf.addEventListener('submit', e => {
      e.preventDefault();
      const v = { name: f('rn').value.trim(), company: f('rc').value.trim(), email: f('re').value.trim().toLowerCase(), phone: f('rp').value.trim(), pw: f('pw1').value };
      if (!v.name || !v.email || !v.pw) return note(msg, 'Please fill in your name, email and a password.');
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email)) return note(msg, 'Enter a valid email address.');
      if (v.pw.length < 8 || !/[A-Za-z]/.test(v.pw) || !/\d/.test(v.pw)) return note(msg, 'Use at least 8 characters with a letter and a number.');
      if (v.pw !== f('pw2').value) return note(msg, 'The two passwords do not match.');
      if (!f('rt').checked) return note(msg, 'Accept the Terms & Conditions to continue.');
      if (v.email === DEMO_EMAIL || users().some(x => x.email === v.email)) return note(msg, 'An account with this email already exists. Try signing in.');
      setUsers([...users(), v]);
      signIn(v);
      const d = loadData(); addActivity(d, 'settings', 'Account created'); saveData(d);
      note(msg, 'Account created. Taking you to your dashboard…', true);
      setTimeout(() => location.href = 'dashboard.html', 600);
    });
  });
})();
