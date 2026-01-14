// Mobile navigation functionality

// DOM Elements
const menuButton = document.getElementById('menuButton');
const mainNav = document.getElementById('mainNav');

// Setup mobile menu toggle
function setupMobileMenu() {
    menuButton.addEventListener('click', () => {
        mainNav.classList.toggle('open');
        const isOpen = mainNav.classList.contains('open');
        menuButton.setAttribute('aria-expanded', isOpen);
    });
}

// Initialize navigation
function initNavigation() {
    setupMobileMenu();
}
