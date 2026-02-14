let allProviders = [];
let favorites = JSON.parse(localStorage.getItem('skillconnect-favorites')) || [];

// ===== DOM Elements =====
const providersGrid = document.getElementById('providersGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const availabilityFilter = document.getElementById('availabilityFilter');
const priceFilter = document.getElementById('priceFilter');
const sortSelect = document.getElementById('sortSelect');
const gridViewBtn = document.getElementById('gridViewBtn');
const listViewBtn = document.getElementById('listViewBtn');
const resultsInfo = document.getElementById('resultsInfo');

// ===== Load saved category filter from localStorage =====
const savedCategory = localStorage.getItem('skillconnect-category');
if (savedCategory && categoryFilter) {
    categoryFilter.value = savedCategory;
}

// ===== Check URL params for category =====
const urlParams = new URLSearchParams(window.location.search);
const urlCategory = urlParams.get('category');
if (urlCategory && categoryFilter) {
    categoryFilter.value = urlCategory;
}

// ===== Fetch Providers =====
async function loadProviders() {
    try {
        const response = await fetch('data/providers.json');
        if (!response.ok) throw new Error('Failed to load providers');
        const data = await response.json();
        allProviders = data.providers;
        applyFilters();
    } catch (error) {
        if (providersGrid) {
            providersGrid.innerHTML = '<div class="no-results"><p>Unable to load providers. Please try again later.</p></div>';
        }
    }
}

// ===== Apply All Filters =====
function applyFilters() {
    let filtered = [...allProviders];

    // Search filter
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    if (searchTerm) {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(searchTerm) ||
            p.skills.some(s => s.toLowerCase().includes(searchTerm)) ||
            p.service.toLowerCase().includes(searchTerm)
        );
    }

    // Category filter
    const category = categoryFilter ? categoryFilter.value : 'all';
    if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
        localStorage.setItem('skillconnect-category', category);
    } else {
        localStorage.removeItem('skillconnect-category');
    }

    // Availability filter
    const availability = availabilityFilter ? availabilityFilter.value : 'all';
    if (availability !== 'all') {
        filtered = filtered.filter(p => p.availability === availability);
    }

    // Price filter
    const price = priceFilter ? priceFilter.value : 'all';
    if (price !== 'all') {
        const [min, max] = price.split('-').map(Number);
        filtered = filtered.filter(p => p.hourlyRate >= min && p.hourlyRate <= max);
    }

    // Sort
    const sortValue = sortSelect ? sortSelect.value : 'default';
    switch (sortValue) {
        case 'rating-desc':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        case 'rating-asc':
            filtered.sort((a, b) => a.rating - b.rating);
            break;
        case 'price-asc':
            filtered.sort((a, b) => a.hourlyRate - b.hourlyRate);
            break;
        case 'price-desc':
            filtered.sort((a, b) => b.hourlyRate - a.hourlyRate);
            break;
    }

    renderProviders(filtered);
}

// ===== Render Providers =====
function renderProviders(providers) {
    if (!providersGrid) return;

    if (providers.length === 0) {
        providersGrid.innerHTML = '<div class="no-results"><p>No providers found matching your criteria.</p><p>Try adjusting your filters or search terms.</p></div>';
        if (resultsInfo) resultsInfo.textContent = '0 providers found';
        return;
    }

    if (resultsInfo) resultsInfo.textContent = `${providers.length} provider${providers.length !== 1 ? 's' : ''} found`;

    providersGrid.innerHTML = providers.map(provider => {
        const isFav = favorites.includes(provider.id);
        return `
            <article class="provider-card">
                <img src="${provider.image}" alt="${provider.name}" width="400" height="200" loading="lazy">
                <div class="provider-info">
                    <div style="display:flex;justify-content:space-between;align-items:start;">
                        ${provider.featured ? '<span class="featured-badge">Featured</span>' : '<span></span>'}
                        <button class="favorite-btn ${isFav ? 'favorited' : ''}" data-id="${provider.id}" aria-label="${isFav ? 'Remove from favorites' : 'Add to favorites'}">${isFav ? '\u2764\uFE0F' : '\uD83E\uDE76'}</button>
                    </div>
                    <h3>${provider.name}</h3>
                    <p class="provider-service">${provider.service}</p>
                    <div class="provider-meta">
                        <span class="provider-rating">\u2605 ${provider.rating} (${provider.reviews})</span>
                        <span class="provider-rate">$${provider.hourlyRate}/hr</span>
                    </div>
                    <p style="font-size:0.8rem;color:var(--text-light);margin-bottom:var(--spacing-sm);">${provider.availability} \u2022 ${provider.serviceArea}</p>
                    <button class="provider-details-btn" data-id="${provider.id}">View Details</button>
                </div>
            </article>
        `;
    }).join('');

    // Detail button listeners
    providersGrid.querySelectorAll('.provider-details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const provider = allProviders.find(p => p.id === id);
            if (provider) openModal(provider);
        });
    });

    // Favorite button listeners
    providersGrid.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            toggleFavorite(id);
        });
    });
}

// ===== Toggle Favorite =====
function toggleFavorite(id) {
    const index = favorites.indexOf(id);
    if (index === -1) {
        favorites.push(id);
    } else {
        favorites.splice(index, 1);
    }
    localStorage.setItem('skillconnect-favorites', JSON.stringify(favorites));
    applyFilters();
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

// ===== Modal Event Listeners =====
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

// ===== View Toggle =====
if (gridViewBtn && listViewBtn && providersGrid) {
    gridViewBtn.addEventListener('click', () => {
        providersGrid.classList.remove('list-view');
        gridViewBtn.classList.add('active');
        gridViewBtn.setAttribute('aria-pressed', 'true');
        listViewBtn.classList.remove('active');
        listViewBtn.setAttribute('aria-pressed', 'false');
    });

    listViewBtn.addEventListener('click', () => {
        providersGrid.classList.add('list-view');
        listViewBtn.classList.add('active');
        listViewBtn.setAttribute('aria-pressed', 'true');
        gridViewBtn.classList.remove('active');
        gridViewBtn.setAttribute('aria-pressed', 'false');
    });
}

// ===== Filter Event Listeners =====
if (searchInput) searchInput.addEventListener('input', applyFilters);
if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
if (availabilityFilter) availabilityFilter.addEventListener('change', applyFilters);
if (priceFilter) priceFilter.addEventListener('change', applyFilters);
if (sortSelect) sortSelect.addEventListener('change', applyFilters);

// ===== Initialize =====
loadProviders();
