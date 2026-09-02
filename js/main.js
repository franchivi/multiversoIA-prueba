/* ═══════════════════════════════════════════
   MULTIVERSO IA — main.js v2
   ═══════════════════════════════════════════ */

/* Año */
document.getElementById('year').textContent = new Date().getFullYear();

/* Nav scroll */
const nav = document.getElementById('nav');
addEventListener('scroll', () => nav.classList.toggle('on', scrollY > 30), { passive: true });

/* Burger móvil */
const burger = document.getElementById('navBurger');
const menu = document.getElementById('navMenu');
burger.addEventListener('click', () => menu.classList.toggle('open'));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

/* Reveal */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ── Fondo estelar (canvas fijo, muy ligero) ── */
(function () {
  const cv = document.getElementById('cosmos');
  const cx = cv.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W, H, stars;

  function resize() {
    W = cv.width = innerWidth * devicePixelRatio;
    H = cv.height = innerHeight * devicePixelRatio;
    cv.style.width = innerWidth + 'px';
    cv.style.height = innerHeight + 'px';
    stars = Array.from({ length: Math.min(160, innerWidth / 8) }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: (Math.random() * 1.1 + 0.3) * devicePixelRatio,
      tw: Math.random() * Math.PI * 2,
      sp: Math.random() * 0.015 + 0.004
    }));
  }

  function frame() {
    cx.clearRect(0, 0, W, H);
    for (const s of stars) {
      s.tw += s.sp;
      const a = 0.25 + Math.abs(Math.sin(s.tw)) * 0.55;
      cx.globalAlpha = a;
      cx.fillStyle = '#cfd6ea';
      cx.beginPath();
      cx.arc(s.x, s.y, s.r, 0, 7);
      cx.fill();
    }
    cx.globalAlpha = 1;
    if (!reduced) requestAnimationFrame(frame);
  }

  resize();
  frame();
  addEventListener('resize', resize);
})();

/* ── Terminal typing ── */
(function () {
  const el = document.getElementById('termText');
  if (!el) return;
  const lines = [
    '$ multiverso deploy --cliente pyme',
    '✓ analizando procesos del negocio...',
    '✓ detectados 14 flujos automatizables',
    '✓ conectando Odoo ⇄ WhatsApp ⇄ Calendar',
    '✓ desplegando modelo a medida...',
    '✓ ciberseguridad: OK',
    '✓ métricas activas: ROI en tiempo real',
    '',
    '→ resultado: -68% tareas manuales',
    '→ tu equipo, a lo que importa.',
    '$ _'
  ];
  let li = 0, ci = 0, out = '';
  const io2 = new IntersectionObserver(es => {
    if (es[0].isIntersecting) { io2.disconnect(); tick(); }
  }, { threshold: 0.4 });
  io2.observe(el);

  function tick() {
    if (li >= lines.length) return;
    const line = lines[li];
    if (ci < line.length) {
      out += line[ci++];
      el.textContent = out;
      setTimeout(tick, 18 + Math.random() * 22);
    } else {
      out += '\n'; li++; ci = 0;
      el.textContent = out;
      setTimeout(tick, line.startsWith('$') ? 500 : 190);
    }
  }
})();

/* ── Formulario (FormSubmit AJAX) ── */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const btn = document.getElementById('submitBtn');
  const status = document.getElementById('form-status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    try {
      const res = await fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });
      status.style.display = 'block';
      if (res.ok) {
        status.textContent = '✓ Mensaje enviado. Te responderemos muy pronto.';
        status.style.color = '#35d066';
        form.reset();
      } else {
        throw new Error();
      }
    } catch {
      status.style.display = 'block';
      status.textContent = '✗ No se pudo enviar. Escríbenos por WhatsApp o email.';
      status.style.color = '#ff5f57';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Enviar mensaje';
    }
  });
})();
