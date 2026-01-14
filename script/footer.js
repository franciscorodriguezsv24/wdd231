// Footer functionality - copyright year and last modified date

// DOM Elements
const currentYearSpan = document.getElementById('currentYear');
const lastModifiedSpan = document.getElementById('lastModified');

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

// Initialize footer
function initFooter() {
    setFooterDates();
}
