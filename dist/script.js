const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const links = [...document.querySelectorAll('.header nav a')];
const sections = [...document.querySelectorAll('main section[id]')];
if (sections.length) {
  let scheduled = false;
  function updateNavigation() {
    scheduled = false;
    const readingPoint = Math.max(100, window.innerHeight * .3);
    const current = sections.find(section => {
      const rect = section.getBoundingClientRect();
      return rect.top <= readingPoint && rect.bottom > readingPoint;
    });
    links.forEach(link => {
      const active = Boolean(current && link.hash === '#' + current.id);
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function scheduleNavigation() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateNavigation);
  }
  window.addEventListener('scroll', scheduleNavigation, { passive: true });
  window.addEventListener('resize', scheduleNavigation, { passive: true });
  updateNavigation();
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(pointer: fine)');

// Movement belongs to the project image, so the profile stays steady.
const projectVisual = document.querySelector('.feature-visual');
if (projectVisual) {
  const resetVisual = () => {
    projectVisual.classList.remove('is-tracking');
    for (const property of ['--image-x', '--image-y']) projectVisual.style.setProperty(property, '0px');
    for (const property of ['--image-rx', '--image-ry']) projectVisual.style.setProperty(property, '0deg');
  };
  projectVisual.addEventListener('pointermove', event => {
    if (!finePointer.matches || reducedMotion.matches || event.pointerType === 'touch') return;
    const rect = projectVisual.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
    const dx = x / rect.width * 2 - 1;
    const dy = y / rect.height * 2 - 1;
    projectVisual.style.setProperty('--image-x', (dx * 4).toFixed(2) + 'px');
    projectVisual.style.setProperty('--image-y', (dy * 3).toFixed(2) + 'px');
    projectVisual.style.setProperty('--image-rx', (dy * -.35).toFixed(2) + 'deg');
    projectVisual.style.setProperty('--image-ry', (dx * .45).toFixed(2) + 'deg');
    projectVisual.style.setProperty('--cursor-x', Math.min(Math.max(x + 16, 10), rect.width - 116) + 'px');
    projectVisual.style.setProperty('--cursor-y', Math.min(Math.max(y + 16, 10), rect.height - 42) + 'px');
    projectVisual.classList.add('is-tracking');
  }, { passive: true });
  projectVisual.addEventListener('pointerleave', resetVisual);
  projectVisual.addEventListener('blur', resetVisual);
  reducedMotion.addEventListener('change', resetVisual);
  finePointer.addEventListener('change', resetVisual);
}

// Two labeled project views; the native slider also supports touch and keyboard.
const comparison = document.querySelector('.comparison-view');
const reveal = document.getElementById('drawing-reveal');
const revealOutput = document.getElementById('drawing-reveal-value');
if (comparison && reveal) {
  function updateComparison() {
    comparison.style.setProperty('--drawing-reveal', reveal.value + '%');
    if (revealOutput) revealOutput.textContent = reveal.value + '%';
    reveal.setAttribute('aria-valuetext', reveal.value + '% drawing revealed');
  }
  function setRevealFromPointer(event) {
    const rect = comparison.getBoundingClientRect();
    reveal.value = String(Math.round(Math.max(0, Math.min(100, (event.clientX - rect.left) / rect.width * 100))));
    updateComparison();
  }
  let dragging = false;
  comparison.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    dragging = true;
    comparison.setPointerCapture(event.pointerId);
    setRevealFromPointer(event);
  });
  comparison.addEventListener('pointermove', event => {
    if (dragging) setRevealFromPointer(event);
  });
  comparison.addEventListener('pointerup', () => { dragging = false; });
  comparison.addEventListener('pointercancel', () => { dragging = false; });
  comparison.addEventListener('lostpointercapture', () => { dragging = false; });
  reveal.addEventListener('input', updateComparison);
  updateComparison();
}

// Compact navigation and the featured link into the site-experience tile.
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
    if (event.key === 'Escape' && siteHeader.classList.contains('menu-open')) {
      closeMenu();
      menuToggle.focus();
    }
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });
}
const siteExperience = document.getElementById('site-experience');
if (siteExperience) {
  function openSiteExperience() {
    if (window.location.hash === '#site-experience') {
      const details = siteExperience.querySelector('details');
      if (details) details.open = true;
    }
  }
  openSiteExperience();
  window.addEventListener('hashchange', openSiteExperience);
}
