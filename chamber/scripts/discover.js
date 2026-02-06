// Discover Page JavaScript
import { discoverItems } from '../data/discover.mjs';

// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const currentYearSpan = document.getElementById('currentYear');
const lastModifiedSpan = document.getElementById('lastModified');
const discoverGrid = document.getElementById('discoverGrid');
const visitMessage = document.getElementById('visitMessage');
const visitText = document.getElementById('visitText');
const closeMessage = document.getElementById('closeMessage');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setFooterDates();
    displayVisitMessage();
    displayDiscoverCards();
});

// ==================== VISIT MESSAGE (localStorage) ====================

function displayVisitMessage() {
    const lastVisit = localStorage.getItem('lastVisit');
    const currentVisit = Date.now();
    let message = '';

    if (!lastVisit) {
        // First visit
        message = 'Welcome! Let us know if you have any questions.';
    } else {
        const lastVisitDate = parseInt(lastVisit);
        const timeDifference = currentVisit - lastVisitDate;
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        if (daysDifference < 1) {
            // Less than a day
            message = 'Back so soon! Awesome!';
        } else if (daysDifference === 1) {
            // Exactly 1 day
            message = 'You last visited 1 day ago.';
        } else {
            // More than 1 day
            message = `You last visited ${daysDifference} days ago.`;
        }
    }

    // Update localStorage with current visit
    localStorage.setItem('lastVisit', currentVisit.toString());

    // Display message
    visitText.textContent = message;
    visitMessage.classList.add('show');

    // Close message button
    closeMessage.addEventListener('click', () => {
        visitMessage.classList.remove('show');
    });

    // Auto-hide after 10 seconds
    setTimeout(() => {
        visitMessage.classList.remove('show');
    }, 10000);
}

// ==================== DISCOVER CARDS ====================

function displayDiscoverCards() {
    discoverGrid.innerHTML = '';

    discoverItems.forEach(item => {
        const card = createDiscoverCard(item);
        discoverGrid.appendChild(card);
    });
}

function createDiscoverCard(item) {
    const card = document.createElement('article');
    card.className = 'discover-card';
    card.style.gridArea = item.gridArea;

    card.innerHTML = `
        <figure class="card-figure">
            <img src="images/${item.image}" alt="${item.title}" loading="lazy" width="300" height="200">
        </figure>
        <div class="card-content">
            <h2 class="card-title">${item.title}</h2>
            <address class="card-address">${item.address}</address>
            <p class="card-description">${item.description}</p>
            <button class="learn-more-btn">Learn More</button>
        </div>
    `;

    return card;
}

// ==================== UTILITY FUNCTIONS ====================

function setupMobileMenu() {
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('open');
        menuToggle.classList.toggle('open');
        const isOpen = mainNav.classList.contains('open');
        menuToggle.setAttribute('aria-expanded', isOpen);
    });
}

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
