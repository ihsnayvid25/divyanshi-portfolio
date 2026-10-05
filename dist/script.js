const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const links = [...document.querySelectorAll('.header nav a')];
const sections = [...document.querySelectorAll('main section[id]')].filter(section =>
  links.some(link => link.pathname === window.location.pathname && link.hash === '#' + section.id)
);
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

// Compact navigation and deep links into experience responsibilities.
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
function openExperienceResponsibilities() {
  const experienceIds = ['delivery-experience', 'architectural-experience'];
  const targetId = window.location.hash.slice(1);
  if (!experienceIds.includes(targetId)) return;
  const details = document.getElementById(targetId)?.querySelector('details');
  if (details) details.open = true;
}
openExperienceResponsibilities();
window.addEventListener('hashchange', openExperienceResponsibilities);
