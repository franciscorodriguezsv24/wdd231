// Directory Page JavaScript

// DOM Elements
const directoryContainer = document.getElementById('directoryContainer');
const gridViewBtn = document.getElementById('gridView');
const listViewBtn = document.getElementById('listView');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const currentYearSpan = document.getElementById('currentYear');
const lastModifiedSpan = document.getElementById('lastModified');

// Current view state
let currentView = 'grid';

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    fetchMembers();
    setupViewToggle();
    setupMobileMenu();
    setFooterDates();
});

// Fetch members from JSON file
async function fetchMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayMembers(data.members);
    } catch (error) {
        console.error('Error fetching members:', error);
        directoryContainer.innerHTML = '<p class="error-message">Unable to load member directory. Please try again later.</p>';
    }
}

// Display members based on current view
function displayMembers(members) {
    directoryContainer.innerHTML = '';
    directoryContainer.className = `directory-container ${currentView}-view`;

    members.forEach(member => {
        const card = createMemberCard(member);
        directoryContainer.appendChild(card);
    });
}

// Create a member card element
function createMemberCard(member) {
    const card = document.createElement('article');
    card.className = 'member-card';

    const membershipLabel = getMembershipLabel(member.membershipLevel);
    const membershipClass = getMembershipClass(member.membershipLevel);

    if (currentView === 'grid') {
        card.innerHTML = `
            <div class="member-image">
                <img src="images/${member.image}" alt="${member.name} logo" loading="lazy" width="300" height="200">
            </div>
            <div class="member-info">
                <h3 class="member-name">${member.name}</h3>
                <p class="member-address">${member.address}</p>
                <p class="member-phone">${member.phone}</p>
                <a href="${member.website}" class="member-website" target="_blank" rel="noopener noreferrer">Visit Website</a>
                <span class="membership-badge ${membershipClass}">${membershipLabel}</span>
            </div>
        `;
    } else {
        // List view - NO images per rubric requirement
        card.innerHTML = `
            <div class="member-info">
                <h3 class="member-name">${member.name}</h3>
                <p class="member-address">${member.address}</p>
                <p class="member-phone">${member.phone}</p>
                <a href="${member.website}" class="member-website" target="_blank" rel="noopener noreferrer">${member.website}</a>
            </div>
            <span class="membership-badge ${membershipClass}">${membershipLabel}</span>
        `;
    }

    return card;
}

// Get membership label based on level
function getMembershipLabel(level) {
    switch (level) {
        case 3:
            return 'Gold';
        case 2:
            return 'Silver';
        default:
            return 'Member';
    }
}

// Get membership CSS class based on level
function getMembershipClass(level) {
    switch (level) {
        case 3:
            return 'gold';
        case 2:
            return 'silver';
        default:
            return 'member';
    }
}

// Setup view toggle buttons
function setupViewToggle() {
    gridViewBtn.addEventListener('click', () => {
        if (currentView !== 'grid') {
            currentView = 'grid';
            updateViewButtons();
            fetchMembers();
        }
    });

    listViewBtn.addEventListener('click', () => {
        if (currentView !== 'list') {
            currentView = 'list';
            updateViewButtons();
            fetchMembers();
        }
    });
}

// Update view toggle button states
function updateViewButtons() {
    if (currentView === 'grid') {
        gridViewBtn.classList.add('active');
        gridViewBtn.setAttribute('aria-pressed', 'true');
        listViewBtn.classList.remove('active');
        listViewBtn.setAttribute('aria-pressed', 'false');
    } else {
        listViewBtn.classList.add('active');
        listViewBtn.setAttribute('aria-pressed', 'true');
        gridViewBtn.classList.remove('active');
        gridViewBtn.setAttribute('aria-pressed', 'false');
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
    // Set current year
    const currentYear = new Date().getFullYear();
    currentYearSpan.textContent = currentYear;

    // Set last modified date
    const lastModified = new Date(document.lastModified);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    lastModifiedSpan.textContent = lastModified.toLocaleDateString('en-US', options);
}
