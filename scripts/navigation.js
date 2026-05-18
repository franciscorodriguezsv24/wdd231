// ============================================================
// WDD 231 — Responsive hamburger menu toggle
// ============================================================

const hamburgerBtn = document.getElementById('hamburger-btn');
const primaryNav = document.getElementById('primary-nav');

hamburgerBtn.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    hamburgerBtn.textContent = isOpen ? '✕' : '☰';
});
