// Thank You Page JavaScript

// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const currentYearSpan = document.getElementById('currentYear');
const lastModifiedSpan = document.getElementById('lastModified');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setFooterDates();
    displayFormData();
});

// Parse URL parameters and display form data
function displayFormData() {
    const params = new URLSearchParams(window.location.search);

    const fields = {
        'first-name': 'display-first-name',
        'last-name': 'display-last-name',
        'email': 'display-email',
        'phone': 'display-phone',
        'organization': 'display-organization',
        'timestamp': 'display-timestamp'
    };

    for (const [paramName, elementId] of Object.entries(fields)) {
        const element = document.getElementById(elementId);
        const value = params.get(paramName);

        if (element && value) {
            if (paramName === 'timestamp') {
                const date = new Date(value);
                element.textContent = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } else {
                element.textContent = value;
            }
        }
    }
}

// Setup mobile menu toggle
function setupMobileMenu() {
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('open');
        menuToggle.classList.toggle('open');
        const isOpen = mainNav.classList.contains('open');
        menuToggle.setAttribute('aria-expanded', isOpen);
    });
}

// Set copyright year and last modified date
function setFooterDates() {
    currentYearSpan.textContent = new Date().getFullYear();
    const lastModified = new Date(document.lastModified);
    lastModifiedSpan.textContent = lastModified.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
