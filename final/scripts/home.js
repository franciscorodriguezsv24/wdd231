// Home page controller — featured providers + live category counts.

import { initNav } from "./modules/nav.js";
import { fetchProviders } from "./modules/data.js";
import { providerCard } from "./modules/ui.js";
import { initModal, openProviderModal } from "./modules/modal.js";
import { isFavorite, toggleFavorite } from "./modules/storage.js";

initNav();
initModal();

const featuredContainer = document.getElementById("featured-providers");
const categoryGrid = document.getElementById("category-grid");

let providers = [];

async function init() {
  try {
    providers = await fetchProviders();
    renderFeatured(providers);
    renderCategoryCounts(providers);
  } catch (error) {
    console.error("Unable to load providers:", error);
    if (featuredContainer) {
      featuredContainer.innerHTML =
        `<p role="alert">We couldn't load featured providers right now. Please try again later.</p>`;
    }
  }
}

// Spotlight the six highest-rated providers (array methods: sort + slice + map).
function renderFeatured(list) {
  if (!featuredContainer) return;
  const top = [...list].sort((a, b) => b.rating - a.rating).slice(0, 6);
  featuredContainer.innerHTML = top
    .map((provider) => providerCard(provider, isFavorite(provider.id)))
    .join("");
}

// Count providers per category with reduce, then render the count badges.
function renderCategoryCounts(list) {
  if (!categoryGrid) return;
  const counts = list.reduce((tally, provider) => {
    tally[provider.category] = (tally[provider.category] || 0) + 1;
    return tally;
  }, {});

  categoryGrid.querySelectorAll(".category-card").forEach((card) => {
    const name = card.dataset.category;
    const countEl = card.querySelector(".count");
    if (countEl) {
      const n = counts[name] || 0;
      countEl.textContent = `${n} provider${n === 1 ? "" : "s"}`;
    }
  });
}

// Event delegation: open the modal or toggle a saved provider.
featuredContainer?.addEventListener("click", (event) => {
  const viewBtn = event.target.closest(".view-btn");
  if (viewBtn) {
    const provider = providers.find((p) => p.id === Number(viewBtn.dataset.id));
    if (provider) openProviderModal(provider);
    return;
  }

  const saveBtn = event.target.closest(".save-btn");
  if (saveBtn) {
    const id = Number(saveBtn.dataset.id);
    const saved = toggleFavorite(id);
    saveBtn.classList.toggle("saved", saved);
    saveBtn.textContent = saved ? "★" : "☆";
    saveBtn.setAttribute("aria-pressed", String(saved));
    saveBtn.setAttribute("aria-label", saved ? "Remove from saved" : "Save provider");
  }
});

init();
