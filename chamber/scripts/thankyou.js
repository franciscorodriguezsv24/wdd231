// ============================================================
// San Salvador Chamber of Commerce — thankyou.js
// Reads URL query params from the form submission and displays
// the applicant summary.
// ============================================================

const params = new URLSearchParams(window.location.search);

const fieldLabels = {
    firstName: 'First Name',
    lastName: 'Last Name',
    orgTitle: 'Organization Title',
    email: 'Email',
    phone: 'Mobile Phone',
    orgName: 'Organization Name',
    membership: 'Membership Level',
    description: 'Description',
    timestamp: 'Submitted'
};

const requiredKeys = ['firstName', 'lastName', 'email', 'phone', 'orgName', 'timestamp'];

const dl = document.getElementById('submission-details');

requiredKeys.forEach(key => {
    const value = params.get(key);
    if (!value) return;
    const dt = document.createElement('dt');
    dt.textContent = fieldLabels[key];
    const dd = document.createElement('dd');
    dd.textContent = key === 'timestamp' ? new Date(value).toLocaleString() : value;
    dl.appendChild(dt);
    dl.appendChild(dd);
});

// ---------- Mobile menu toggle ----------
const menuToggle = document.getElementById('menu-toggle');
const primaryNav = document.getElementById('primary-nav');

menuToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

// ---------- Footer dates ----------
document.getElementById('copyright-year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent = document.lastModified;
