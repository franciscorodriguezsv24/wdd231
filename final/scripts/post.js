// "Post Your Skills" controller — populate categories, persist a draft, validate.

import { initNav } from "./modules/nav.js";
import { fetchProviders } from "./modules/data.js";

initNav();

const form = document.getElementById("post-form");
const categorySelect = document.getElementById("category");
const DRAFT_KEY = "scsv-post-draft";

// Populate the category <select> from the live data so options stay in sync.
async function loadCategories() {
  try {
    const providers = await fetchProviders();
    const categories = [...new Set(providers.map((p) => p.category))].sort();
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });
    restoreDraft();
  } catch (error) {
    console.error("Could not load categories:", error);
    // Fall back to a fixed list so the form still works offline.
    ["Home Repair", "Tutoring", "Graphic Design", "Photography", "Pet Care", "Tech Support", "Cleaning"].forEach(
      (category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
      }
    );
    restoreDraft();
  }
}

// Persist the in-progress form to localStorage so nothing is lost on reload.
function saveDraft() {
  const draft = {};
  new FormData(form).forEach((value, key) => {
    draft[key] = value;
  });
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* ignore storage errors */
  }
}

function restoreDraft() {
  let draft;
  try {
    draft = JSON.parse(localStorage.getItem(DRAFT_KEY));
  } catch {
    draft = null;
  }
  if (!draft) return;

  Object.entries(draft).forEach(([key, value]) => {
    const field = form.elements[key];
    if (field) field.value = value;
  });
}

// Save the draft as the user types/changes fields.
form.addEventListener("input", saveDraft);

// On a valid submit, drop the draft (the form posts to the action page via GET).
form.addEventListener("submit", () => {
  if (form.checkValidity()) {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
  }
});

loadCategories();
