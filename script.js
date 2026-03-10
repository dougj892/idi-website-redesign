// ── Navigation ──────────────────────────────────────────────────────
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

// Hero is dark — nav links should be light-colored while in hero
const hero = document.getElementById('hero');

function updateNav() {
  const heroBottom = hero.getBoundingClientRect().bottom;
  if (heroBottom > 0) {
    nav.classList.add('light-nav');
  } else {
    nav.classList.remove('light-nav');
  }
}

updateNav();
window.addEventListener('scroll', updateNav, { passive: true });

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  const [a, b] = navToggle.querySelectorAll('span');
  if (open) {
    a.style.transform = 'rotate(45deg) translate(5px, 5px)';
    b.style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    a.style.transform = b.style.transform = '';
  }
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.querySelectorAll('span').forEach(s => s.style.transform = '');
  });
});

// ── Accordion ────────────────────────────────────────────────────────
document.querySelectorAll('.accordion-item').forEach(item => {
  item.querySelector('.accordion-trigger').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.accordion-item.open').forEach(o => o.classList.remove('open'));
    // Open clicked if it was closed
    if (!isOpen) item.classList.add('open');
  });
});

// ── Stat counters ────────────────────────────────────────────────────
const statEls = document.querySelectorAll('.hero-stat-n');
let counted = false;

function runCounters() {
  if (counted) return;
  counted = true;
  statEls.forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * ease);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

// Trigger counters when hero stats become visible
const counterObs = new IntersectionObserver(entries => {
  if (entries.some(e => e.isIntersecting)) runCounters();
}, { threshold: 0.3 });

statEls.forEach(el => counterObs.observe(el));

// ── Scroll reveal ────────────────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

// Tag elements for reveal
const revealSelectors = [
  '.mission-quote',
  '.mission-col',
  '.accordion-item',
  '.initiative',
  '.office-entry',
  '.presence-heading',
  '.presence-sub',
  '.contact-heading',
  '.contact-text p',
];

revealSelectors.forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('reveal');
    if (i > 0 && i <= 5) el.classList.add(`reveal-delay-${i}`);
    revealObs.observe(el);
  });
});
