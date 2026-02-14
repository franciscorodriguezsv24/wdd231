// ===== Hamburger Menu Toggle =====
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mainNav.classList.toggle('open');
        const isOpen = mainNav.classList.contains('open');
        menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking a nav link
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// ===== Wayfinding - Active Page =====
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.main-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
    }
});

// ===== Footer Dynamic Content =====
const yearSpan = document.getElementById('currentYear');
const lastModSpan = document.getElementById('lastModified');

if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

if (lastModSpan) {
    lastModSpan.textContent = document.lastModified;
}
