// ============================================================
// EXTREMISMUS.ANALYSE — script.js
// ============================================================

// ── Scroll progress bar ──────────────────────────────────────
const progressBar = document.getElementById('scroll-progress-bar');
function updateProgressBar() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgressBar, { passive: true });
updateProgressBar();

// ── NAV scroll effect ────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (!navbar) return;
  navbar.style.background = window.scrollY > 20
    ? 'rgba(5, 13, 24, 0.97)'
    : 'rgba(8, 17, 30, 0.85)';
}, { passive: true });

// ── Mobile menu ──────────────────────────────────────────────
const toggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (toggle && mobileMenu) {
  toggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// ── Counter animation ────────────────────────────────────────
function animateCounters() {
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString('de-DE');
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

// ── Intersection Observer for fade-in + counter trigger ──────
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      counterObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

// ── Fade-in on scroll ────────────────────────────────────────
document.querySelectorAll(
  '.def-card, .group-card, .case-content, .prev-card, .source-category, ' +
  '.finding-item, .chart-card, .study-card, .rf-step, .rad-note, ' +
  '.subsection, .raf-fact-box, .styled-image-component'
).forEach(el => el.classList.add('fade-in'));

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// ── Active nav link on scroll ────────────────────────────────
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${id}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

// ── Radikalisierungs-Flowchart: staggered entrance ───────────
const rfSteps = document.querySelectorAll('.rf-step');
const rfObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      rfSteps.forEach((step, i) => {
        setTimeout(() => {
          step.style.opacity = '1';
          step.style.transform = 'translateY(0)';
        }, i * 80);
      });
      rfObserver.disconnect();
    }
  });
}, { threshold: 0.2 });

rfSteps.forEach(step => {
  step.style.opacity = '0';
  step.style.transform = 'translateY(20px)';
  step.style.transition = 'opacity 0.5s ease, transform 0.5s ease, border-color 0.2s ease, background 0.2s ease';
});

const rfContainer = document.querySelector('.radicalization-flow');
if (rfContainer) rfObserver.observe(rfContainer);

// ── Study card keyboard accessibility ───────────────────────
document.querySelectorAll('.study-card').forEach(card => {
  card.setAttribute('role', 'link');
  card.setAttribute('tabindex', '0');
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});
