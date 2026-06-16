// Directory controller — fetch, filter, sort, persist preferences, modal details.

import { initNav } from "./modules/nav.js";
import { fetchProviders } from "./modules/data.js";
import { providerCard } from "./modules/ui.js";
import { initModal, openProviderModal } from "./modules/modal.js";
import { isFavorite, toggleFavorite, getPrefs, savePrefs } from "./modules/storage.js";

initNav();
initModal();

const container = document.getElementById("provider-list");
const resultsInfo = document.getElementById("results-info");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category-filter");
const availabilitySelect = document.getElementById("availability-filter");
const sortSelect = document.getElementById("sort");

let providers = [];

async function init() {
  try {
    providers = await fetchProviders();
    populateCategories(providers);
    restorePrefs();
    applyFilters();
  } catch (error) {
    console.error("Unable to load providers:", error);
    container.innerHTML =
      `<p role="alert">Sorry, the provider directory is unavailable right now. Please try again later.</p>`;
    resultsInfo.textContent = "";
  }
}

// Build the category dropdown from the unique categories in the data.
function populateCategories(list) {
  const categories = [...new Set(list.map((p) => p.category))].sort();
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

// Restore the saved filter state from localStorage into the controls.
function restorePrefs() {
  const prefs = getPrefs();
  searchInput.value = prefs.search;
  if ([...categorySelect.options].some((o) => o.value === prefs.category)) {
    categorySelect.value = prefs.category;
  }
  availabilitySelect.value = prefs.availability;
  sortSelect.value = prefs.sort;
}

function currentPrefs() {
  return {
    search: searchInput.value.trim(),
    category: categorySelect.value,
    availability: availabilitySelect.value,
    sort: sortSelect.value,
  };
}

// Filter + sort the data, persist the choices, and render.
function applyFilters() {
  const prefs = currentPrefs();
  savePrefs(prefs);

  const term = prefs.search.toLowerCase();
  let filtered = providers.filter((p) => {
    const matchesSearch =
      !term ||
      p.name.toLowerCase().includes(term) ||
      p.specialty.toLowerCase().includes(term) ||
      p.skills.some((skill) => skill.toLowerCase().includes(term));
    const matchesCategory = prefs.category === "all" || p.category === prefs.category;
    const matchesAvailability =
      prefs.availability === "all" || p.availability === prefs.availability;
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  filtered = sortProviders(filtered, prefs.sort);
  render(filtered);
}

function sortProviders(list, sort) {
  const sorted = [...list];
  switch (sort) {
    case "rate-asc":
      return sorted.sort((a, b) => a.rate - b.rate);
    case "rate-desc":
      return sorted.sort((a, b) => b.rate - a.rate);
    case "experience":
      return sorted.sort((a, b) => b.experience - a.experience);
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "rating":
    default:
      return sorted.sort((a, b) => b.rating - a.rating);
  }
}

function render(list) {
  if (list.length === 0) {
    container.innerHTML = `<p role="alert">No providers match your filters. Try broadening your search.</p>`;
  } else {
    container.innerHTML = list
      .map((provider) => providerCard(provider, isFavorite(provider.id)))
      .join("");
  }
  resultsInfo.innerHTML =
    `Showing <strong>${list.length}</strong> of <strong>${providers.length}</strong> providers`;
}

// ---------- Events ----------
searchInput.addEventListener("input", applyFilters);
categorySelect.addEventListener("change", applyFilters);
availabilitySelect.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);

container.addEventListener("click", (event) => {
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
