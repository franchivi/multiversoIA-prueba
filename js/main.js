/* ═══════════════════════════════════════════
   MULTIVERSO IA — main.js v3 "impact"
   ═══════════════════════════════════════════ */

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = matchMedia('(hover: none)').matches;

/* ── Preloader ── */
(function () {
  const loader = document.getElementById('loader');
  if (!loader || reduced) {
    if (loader) loader.classList.add('done');
    document.body.classList.add('ready');
    return;
  }
  document.body.classList.add('loading');
  const bar = document.getElementById('loaderBar');
  const pct = document.getElementById('loaderPct');
  let p = 0;
  const iv = setInterval(() => {
    p += Math.random() * 22 + 8;
    if (p >= 100) {
      p = 100;
      clearInterval(iv);
      setTimeout(() => {
        loader.classList.add('done');
        document.body.classList.remove('loading');
        document.body.classList.add('ready');
      }, 250);
    }
    bar.style.width = p + '%';
    pct.textContent = Math.round(p) + '%';
  }, 160);
})();

/* ── Año ── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── Nav: fondo + auto-hide al bajar ── */
const nav = document.getElementById('nav');
let lastY = 0;
addEventListener('scroll', () => {
  const y = scrollY;
  nav.classList.toggle('on', y > 30);
  nav.classList.toggle('hide', y > 400 && y > lastY);
  lastY = y;
  // progreso
  const h = document.documentElement.scrollHeight - innerHeight;
  document.getElementById('scrollProgress').style.width = (y / h * 100) + '%';
}, { passive: true });

/* ── Burger ── */
const burger = document.getElementById('navBurger');
const menu = document.getElementById('navMenu');
burger.addEventListener('click', () => menu.classList.toggle('open'));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

/* ── Reveal ── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ── Cursor personalizado + magnético ── */
(function () {
  if (isTouch || reduced) return;
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx = -100, my = -100, rx = -100, ry = -100;

  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function follow() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(follow);
  })();

  document.querySelectorAll('a, button, [data-hover], summary').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hot'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hot'));
  });

  /* Botones magnéticos */
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
})();

/* ── Tilt 3D en cards + brillo que sigue al ratón ── */
(function () {
  if (isTouch || reduced) return;
  document.querySelectorAll('.tilt').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.transform = `rotateY(${(px - 0.5) * 10}deg) rotateX(${(0.5 - py) * 8}deg) translateY(-4px)`;
      el.style.setProperty('--mx', (px * 100) + '%');
      el.style.setProperty('--my', (py * 100) + '%');
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
})();

/* ── Contadores animados ── */
(function () {
  const nums = document.querySelectorAll('[data-count]');
  const ioN = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      ioN.unobserve(e.target);
      const target = +e.target.dataset.count;
      const dur = 1400;
      const t0 = performance.now();
      (function step(t) {
        const k = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - k, 3);
        e.target.textContent = Math.round(target * eased);
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    });
  }, { threshold: 0.6 });
  nums.forEach(n => ioN.observe(n));
})();

/* ── Fondo estelar con parallax de ratón y profundidad ── */
(function () {
  const cv = document.getElementById('cosmos');
  const cx = cv.getContext('2d');
  let W, H, stars, shooting = null, mouseX = 0.5, mouseY = 0.5;

  function resize() {
    W = cv.width = innerWidth * devicePixelRatio;
    H = cv.height = innerHeight * devicePixelRatio;
    cv.style.width = innerWidth + 'px';
    cv.style.height = innerHeight + 'px';
    stars = Array.from({ length: Math.min(190, innerWidth / 7) }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      z: Math.random() * 0.8 + 0.2,          // profundidad
      r: (Math.random() * 1.1 + 0.3) * devicePixelRatio,
      tw: Math.random() * Math.PI * 2,
      sp: Math.random() * 0.015 + 0.004
    }));
  }

  if (!isTouch) {
    addEventListener('mousemove', e => {
      mouseX = e.clientX / innerWidth;
      mouseY = e.clientY / innerHeight;
    });
  }

  function spawnShooting() {
    if (Math.random() < 0.004 && !shooting) {
      shooting = {
        x: Math.random() * W * 0.7,
        y: Math.random() * H * 0.3,
        vx: (6 + Math.random() * 5) * devicePixelRatio,
        vy: (2.5 + Math.random() * 2) * devicePixelRatio,
        life: 1
      };
    }
  }

  function frame() {
    cx.clearRect(0, 0, W, H);
    const ox = (mouseX - 0.5) * 30 * devicePixelRatio;
    const oy = (mouseY - 0.5) * 30 * devicePixelRatio;

    for (const s of stars) {
      s.tw += s.sp;
      const a = 0.22 + Math.abs(Math.sin(s.tw)) * 0.55;
      cx.globalAlpha = a * s.z;
      cx.fillStyle = '#cfd6ea';
      cx.beginPath();
      cx.arc(s.x + ox * s.z, s.y + oy * s.z, s.r * s.z, 0, 7);
      cx.fill();
    }

    /* estrella fugaz ocasional */
    spawnShooting();
    if (shooting) {
      const s = shooting;
      cx.globalAlpha = s.life;
      const grad = cx.createLinearGradient(s.x, s.y, s.x - s.vx * 8, s.y - s.vy * 8);
      grad.addColorStop(0, 'rgba(255,214,130,0.9)');
      grad.addColorStop(1, 'transparent');
      cx.strokeStyle = grad;
      cx.lineWidth = 1.4 * devicePixelRatio;
      cx.beginPath();
      cx.moveTo(s.x, s.y);
      cx.lineTo(s.x - s.vx * 8, s.y - s.vy * 8);
      cx.stroke();
      s.x += s.vx; s.y += s.vy; s.life -= 0.018;
      if (s.life <= 0 || s.x > W || s.y > H) shooting = null;
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
