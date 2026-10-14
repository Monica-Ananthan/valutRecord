/* VaultRecords – public website interactions. Added alongside main.js (which is unchanged). */
(function () {
  const q = (s, r = document) => r.querySelector(s), qa = (s, r = document) => [...r.querySelectorAll(s)];
  const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    /* header shadow once the page is scrolled + gentle banner parallax */
    const hd = q('.hd'), bi = q('.bnr-i');
    let tick = false;
    const onScroll = () => {
      tick = false;
      if (hd) hd.classList.toggle('scrolled', scrollY > 8);
      if (bi && !calm && scrollY < 900) bi.style.setProperty('--py', Math.round(scrollY * 0.12) + 'px');
    };
    addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();

    /* extra reveal for blocks marked data-rv (same classes main.js uses, so the CSS is shared) */
    if ('IntersectionObserver' in window && !calm) {
      const els = qa('[data-rv]');
      els.forEach(e => { e.classList.add('rv'); qa(':scope > li', e).forEach((li, i) => li.style.setProperty('--i', i)); });
      document.documentElement.classList.add('js-rv');
      const on = new IntersectionObserver(es => es.forEach(x => x.isIntersecting && x.target.classList.add('in')), { rootMargin: '0px 0px -8% 0px' });
      const off = new IntersectionObserver(es => es.forEach(x => !x.isIntersecting && x.target.classList.remove('in')));
      els.forEach(e => { on.observe(e); off.observe(e); });
    }

    /* animated counters */
    const count = el => {
      const to = +el.dataset.count, t0 = performance.now(), d = 1400;
      if (calm) { el.textContent = to; return; }
      const step = t => { const p = Math.min(1, (t - t0) / d); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      const co = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { count(x.target); co.unobserve(x.target); } }), { threshold: .4 });
      qa('[data-count]').forEach(e => co.observe(e));
    } else qa('[data-count]').forEach(e => e.textContent = e.dataset.count);

    /* spotlight that follows the pointer on cards */
    if (matchMedia('(hover:hover)').matches) {
      qa('.card.h').forEach(c => c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
      }));
    }

    /* testimonial slider */
    const ts = q('.tsl');
    if (ts) {
      const cards = qa('.ts-card', ts), dots = qa('.ts-dots button', ts);
      let i = 0, timer;
      const go = n => { i = (n + cards.length) % cards.length; cards.forEach((c, k) => c.classList.toggle('on', k === i)); dots.forEach((d, k) => { d.classList.toggle('on', k === i); d.setAttribute('aria-current', k === i); }); };
      const auto = () => { clearInterval(timer); if (!calm) timer = setInterval(() => go(i + 1), 6500); };
      q('.ts-prev', ts).onclick = () => { go(i - 1); auto(); };
      q('.ts-next', ts).onclick = () => { go(i + 1); auto(); };
      dots.forEach((d, k) => d.onclick = () => { go(k); auto(); });
      ts.addEventListener('mouseenter', () => clearInterval(timer)); ts.addEventListener('mouseleave', auto);
      go(0); auto();
    }

    /* tabs (industries) */
    qa('[data-tabs]').forEach(w => {
      const tabs = qa('.tab', w), panels = qa('.tabp', w);
      const show = k => { tabs.forEach((t, n) => { t.classList.toggle('on', n === k); t.setAttribute('aria-selected', n === k); }); panels.forEach((p, n) => p.hidden = n !== k); };
      tabs.forEach((t, k) => t.onclick = () => show(k));
      show(0);
    });

    /* pricing calculator */
    const calc = q('#calc');
    if (calc) {
      const v = id => +q('#' + id).value, $ = n => '$' + n.toFixed(2);
      const run = () => {
        const b = v('c-box'), r = v('c-ret'), p = v('c-pg'), rush = q('#c-rush').checked;
        q('#o-box').textContent = b; q('#o-ret').textContent = r; q('#o-pg').textContent = p.toLocaleString();
        const s = b * .38, rt = r * 6.5 + (rush ? r * 18 : 0), sc = p * .09;
        q('#r-s').textContent = $(s); q('#r-r').textContent = $(rt); q('#r-d').textContent = $(sc); q('#r-t').textContent = $(s + rt + sc);
      };
      qa('input', calc).forEach(i => i.addEventListener('input', run)); run();
    }

    /* FAQ filter + search */
    const fq = q('#fq');
    if (fq) {
      const items = qa('details', fq), chips = qa('.chp'), box = q('#fq-s'), none = q('#fq-e');
      let cat = 'all';
      const apply = () => {
        const t = box.value.trim().toLowerCase(); let n = 0;
        items.forEach(d => { const ok = (cat === 'all' || d.dataset.cat === cat) && d.textContent.toLowerCase().includes(t); d.hidden = !ok; if (ok) n++; });
        none.hidden = n > 0;
      };
      chips.forEach(c => c.onclick = () => { cat = c.dataset.c; chips.forEach(x => x.classList.toggle('on', x === c)); apply(); });
      box.addEventListener('input', apply);
    }

    /* contact topic chips fill the topic field */
    const topic = q('#ct');
    qa('[data-topic]').forEach(c => c.onclick = () => {
      if (topic) topic.value = c.dataset.topic;
      qa('[data-topic]').forEach(x => x.classList.toggle('on', x === c));
    });
  });
})();
