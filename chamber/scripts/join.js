// Join Page JavaScript

// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const currentYearSpan = document.getElementById('currentYear');
const lastModifiedSpan = document.getElementById('lastModified');
const timestampField = document.getElementById('timestamp');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setFooterDates();
    setTimestamp();
    setupModals();
});

// Set hidden timestamp field with current date/time
function setTimestamp() {
    const now = new Date();
    timestampField.value = now.toISOString();
}

// Setup modal open/close functionality
function setupModals() {
    // Open modals
    document.querySelectorAll('.card-info-btn').forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.showModal();
            }
        });
    });

    // Close modals
    document.querySelectorAll('.modal-close-btn').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('dialog');
            if (modal) {
                modal.close();
            }
        });
    });

    // Close modal when clicking backdrop
    document.querySelectorAll('.membership-modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.close();
            }
        });
    });
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
