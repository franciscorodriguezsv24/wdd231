// ============================================================
// San Salvador Chamber of Commerce — directory.js
// Loads members.json via fetch + async/await, renders cards,
// supports grid/list toggle, and updates footer dates.
// ============================================================

const membersContainer = document.getElementById('members');
const gridBtn = document.getElementById('grid-view');
const listBtn = document.getElementById('list-view');
const menuToggle = document.getElementById('menu-toggle');
const primaryNav = document.getElementById('primary-nav');

const membershipLabels = {
    1: { label: 'Member', cls: 'badge-member' },
    2: { label: 'Silver', cls: 'badge-silver' },
    3: { label: 'Gold',   cls: 'badge-gold'   }
};

async function loadMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        renderMembers(data.members);
    } catch (error) {
        membersContainer.innerHTML =
            `<p role="alert">Sorry, we could not load the member directory right now.</p>`;
        console.error('Error loading members:', error);
    }
}

function renderMembers(members) {
    membersContainer.innerHTML = '';
    members.forEach(member => {
        const card = document.createElement('article');
        card.className = 'member-card';

        const tier = membershipLabels[member.membership] || membershipLabels[1];

        card.innerHTML = `
            <img src="images/${member.image}" alt="${member.name} logo"
                 loading="lazy" onerror="this.src='images/placeholder.svg'">
            <h3>${member.name}</h3>
            <p class="category">${member.category}</p>
            <p class="address">${member.address}</p>
            <p class="phone">${member.phone}</p>
            <a class="website" href="${member.website}" target="_blank" rel="noopener">Visit Website</a>
            <span class="badge ${tier.cls}">${tier.label}</span>
        `;

        membersContainer.appendChild(card);
    });
}

// ---------- View toggle ----------
function setView(view) {
    if (view === 'grid') {
        membersContainer.classList.add('grid');
        membersContainer.classList.remove('list');
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
        gridBtn.setAttribute('aria-pressed', 'true');
        listBtn.setAttribute('aria-pressed', 'false');
    } else {
        membersContainer.classList.add('list');
        membersContainer.classList.remove('grid');
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
        listBtn.setAttribute('aria-pressed', 'true');
        gridBtn.setAttribute('aria-pressed', 'false');
    }
}

gridBtn.addEventListener('click', () => setView('grid'));
listBtn.addEventListener('click', () => setView('list'));

// ---------- Mobile menu toggle ----------
menuToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

// ---------- Footer dates ----------
document.getElementById('copyright-year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent = document.lastModified;

// ---------- Init ----------
loadMembers();
