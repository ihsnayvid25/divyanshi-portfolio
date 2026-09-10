document.getElementById('year').textContent = new Date().getFullYear();
const links = [...document.querySelectorAll('nav a')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      links.forEach(link => {
        const active = link.hash === '#' + entry.target.id;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}

// Respond to pointer movement without intercepting clicks or touch scrolling.
const ambient = document.querySelector('.ambient');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let pendingFrame = 0;
let pointerX = 0;
let pointerY = 0;
function paintAmbient() {
  pendingFrame = 0;
  if (reducedMotion.matches) return;
  ambient.style.setProperty('--pointer-x', `${pointerX}px`);
  ambient.style.setProperty('--pointer-y', `${pointerY}px`);
  ambient.style.setProperty('--cad-x', `${pointerX * 0.018}px`);
  ambient.style.setProperty('--cad-y', `${pointerY * 0.018}px`);
  ambient.style.setProperty('--cad-depth-x', `${pointerX * -0.012}px`);
  ambient.style.setProperty('--cad-depth-y', `${pointerY * -0.012}px`);
  ambient.style.setProperty('--cad-depth-reverse-x', `${pointerX * 0.012}px`);
  ambient.style.setProperty('--cad-depth-reverse-y', `${pointerY * 0.012}px`);
  ambient.style.setProperty('--liquid-one-x', `${pointerX * 0.03}px`);
  ambient.style.setProperty('--liquid-one-y', `${pointerY * 0.03}px`);
  ambient.style.setProperty('--liquid-two-x', `${pointerX * -0.02}px`);
  ambient.style.setProperty('--liquid-two-y', `${pointerY * -0.02}px`);
  ambient.style.setProperty('--liquid-three-x', `${pointerX * 0.04}px`);
  ambient.style.setProperty('--liquid-three-y', `${pointerY * 0.04}px`);
  ambient.style.setProperty('--scroll-shift', `${Math.min(window.scrollY * 0.035, 100)}px`);
}
function scheduleAmbient() {
  if (!reducedMotion.matches && !pendingFrame) pendingFrame = requestAnimationFrame(paintAmbient);
}
window.addEventListener('pointermove', event => {
  pointerX = event.clientX - window.innerWidth / 2;
  pointerY = event.clientY - window.innerHeight * 0.45;
  scheduleAmbient();
}, { passive: true });
window.addEventListener('scroll', scheduleAmbient, { passive: true });
document.documentElement.addEventListener('pointerleave', () => {
  pointerX = 0;
  pointerY = 0;
  scheduleAmbient();
});
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) {
    cancelAnimationFrame(pendingFrame);
    pendingFrame = 0;
    ambient.style.removeProperty('--pointer-x');
    ambient.style.removeProperty('--pointer-y');
    ambient.style.removeProperty('--scroll-shift');
    ambient.style.removeProperty('--cad-x');
    ambient.style.removeProperty('--cad-y');
    ambient.style.removeProperty('--cad-depth-x');
    ambient.style.removeProperty('--cad-depth-y');
    ambient.style.removeProperty('--cad-depth-reverse-x');
    ambient.style.removeProperty('--cad-depth-reverse-y');
  } else scheduleAmbient();
});

// A drafting crosshair follows the pointer and identifies interactive elements.
const cursorCompass = document.querySelector('.cursor-compass');
const cursorLabel = cursorCompass?.querySelector('.cursor-label');
const finePointer = window.matchMedia('(pointer: fine)');
let cursorTargetX = -80;
let cursorTargetY = -80;
let cursorCurrentX = -80;
let cursorCurrentY = -80;

function animateCursor() {
  if (!cursorCompass || !finePointer.matches || reducedMotion.matches) return;
  cursorCurrentX += (cursorTargetX - cursorCurrentX) * 0.2;
  cursorCurrentY += (cursorTargetY - cursorCurrentY) * 0.2;
  cursorCompass.style.transform = `translate3d(${cursorCurrentX - 17}px, ${cursorCurrentY - 17}px, 0)`;
  requestAnimationFrame(animateCursor);
}

if (cursorCompass && finePointer.matches && !reducedMotion.matches) {
  animateCursor();
  window.addEventListener('pointermove', event => {
    cursorTargetX = event.clientX;
    cursorTargetY = event.clientY;
    cursorCompass.classList.add('is-visible');
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => cursorCompass.classList.remove('is-visible'));
  document.addEventListener('pointerover', event => {
    const target = event.target.closest('[data-cursor], a, summary');
    cursorCompass.classList.toggle('is-active', Boolean(target));
    if (target && cursorLabel) cursorLabel.textContent = target.dataset.cursor || 'OPEN';
  });
}

// Subtle depth on the portrait connects the image to the cursor without disrupting reading.
const hero = document.querySelector('.hero');
const portrait = document.querySelector('.hero-portrait');
if (hero && portrait) {
  hero.addEventListener('pointermove', event => {
    if (!finePointer.matches || reducedMotion.matches) return;
    const rect = hero.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
    const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
    portrait.style.setProperty('--portrait-x', `${x * 7}px`);
    portrait.style.setProperty('--portrait-y', `${y * 5}px`);
    portrait.style.setProperty('--portrait-rx', `${y * -1.8}deg`);
    portrait.style.setProperty('--portrait-ry', `${x * 2.2}deg`);
  }, { passive: true });
  hero.addEventListener('pointerleave', () => {
    portrait.style.setProperty('--portrait-x', '0px');
    portrait.style.setProperty('--portrait-y', '0px');
    portrait.style.setProperty('--portrait-rx', '0deg');
    portrait.style.setProperty('--portrait-ry', '0deg');
  });
}

// Compact navigation for phones and small tablets.
const siteHeader = document.querySelector('.header');
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('#site-nav');

function closeMenu() {
  if (!siteHeader || !menuToggle) return;
  siteHeader.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
}

if (siteHeader && menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const open = !siteHeader.classList.contains('menu-open');
    siteHeader.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  siteNav.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });
}
