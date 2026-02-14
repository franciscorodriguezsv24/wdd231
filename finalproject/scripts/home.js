const categoriesData = [
    { name: "Home Repair", icon: "\uD83D\uDD27", slug: "home-repair" },
    { name: "Tutoring", icon: "\uD83D\uDCDA", slug: "tutoring" },
    { name: "Graphic Design", icon: "\uD83C\uDFA8", slug: "graphic-design" },
    { name: "Pet Care", icon: "\uD83D\uDC3E", slug: "pet-care" },
    { name: "Photography", icon: "\uD83D\uDCF7", slug: "photography" },
    { name: "Tech Support", icon: "\uD83D\uDCBB", slug: "tech-support" }
];

// ===== Render Categories =====
function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;

    grid.innerHTML = categoriesData.map(cat => `
        <div class="category-card">
            <div class="category-icon">${cat.icon}</div>
            <h3><a href="directory.html?category=${cat.slug}">${cat.name}</a></h3>
        </div>
    `).join('');
}

// ===== Fetch and Render Featured Providers =====
async function loadFeaturedProviders() {
    const container = document.getElementById('featuredProviders');
    if (!container) return;

    try {
        const response = await fetch('data/providers.json');
        if (!response.ok) throw new Error('Failed to load providers');
        const data = await response.json();

        const featured = data.providers.filter(p => p.featured);
        container.innerHTML = featured.map(provider => createProviderCard(provider)).join('');

        // Add event listeners for detail buttons
        container.querySelectorAll('.provider-details-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const provider = data.providers.find(p => p.id === id);
                if (provider) openModal(provider);
            });
        });
    } catch (error) {
        container.innerHTML = '<p class="no-results">Unable to load featured providers. Please try again later.</p>';
    }
}

// ===== Create Provider Card HTML =====
function createProviderCard(provider) {
    return `
        <article class="provider-card">
            <img src="${provider.image}" alt="${provider.name}" width="400" height="200" loading="lazy">
            <div class="provider-info">
                ${provider.featured ? '<span class="featured-badge">Featured</span>' : ''}
                <h3>${provider.name}</h3>
                <p class="provider-service">${provider.service}</p>
                <div class="provider-meta">
                    <span class="provider-rating">\u2605 ${provider.rating} (${provider.reviews})</span>
                    <span class="provider-rate">$${provider.hourlyRate}/hr</span>
                </div>
                <button class="provider-details-btn" data-id="${provider.id}">View Details</button>
            </div>
        </article>
    `;
}

// ===== Modal =====
function openModal(provider) {
    const modal = document.getElementById('providerModal');
    const modalBody = document.getElementById('modalBody');
    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
        <img class="modal-image" src="${provider.image}" alt="${provider.name}" width="500" height="200">
        <div class="modal-body">
            <h2 id="modalTitle">${provider.name}</h2>
            <p class="modal-service">${provider.service}</p>
            <div class="modal-stats">
                <div class="modal-stat">
                    <span class="modal-stat-label">Rating</span>
                    <span class="modal-stat-value">\u2605 ${provider.rating}</span>
                </div>
                <div class="modal-stat">
                    <span class="modal-stat-label">Reviews</span>
                    <span class="modal-stat-value">${provider.reviews}</span>
                </div>
                <div class="modal-stat">
                    <span class="modal-stat-label">Rate</span>
                    <span class="modal-stat-value">$${provider.hourlyRate}/hr</span>
                </div>
                <div class="modal-stat">
                    <span class="modal-stat-label">Experience</span>
                    <span class="modal-stat-value">${provider.experience}</span>
                </div>
            </div>
            <p class="modal-description">${provider.description}</p>
            <div class="modal-skills">
                ${provider.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
            </div>
            <div class="modal-stat" style="margin-bottom: var(--spacing-md);">
                <span class="modal-stat-label">Availability</span>
                <span class="modal-stat-value">${provider.availability}</span>
            </div>
            <div class="modal-stat" style="margin-bottom: var(--spacing-md);">
                <span class="modal-stat-label">Service Area</span>
                <span class="modal-stat-value">${provider.serviceArea}</span>
            </div>
            <div class="modal-contact">
                <a href="tel:${provider.phone}">\uD83D\uDCDE ${provider.phone}</a>
                <a href="mailto:${provider.email}">\u2709\uFE0F ${provider.email}</a>
            </div>
        </div>
    `;

    modal.classList.add('active');
    modal.querySelector('.modal-close').focus();
}

function closeModal() {
    const modal = document.getElementById('providerModal');
    if (modal) modal.classList.remove('active');
}

// Modal event listeners
const modal = document.getElementById('providerModal');
if (modal) {
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// ===== Initialize =====
renderCategories();
loadFeaturedProviders();
