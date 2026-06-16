// Local storage helpers — persist saved providers and directory preferences.

const FAV_KEY = "scsv-favorites";
const PREF_KEY = "scsv-directory-prefs";

function read(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable (private mode); fail silently.
  }
}

/* ---------- Saved / favorite providers ---------- */
export function getFavorites() {
  return read(FAV_KEY, []);
}

export function isFavorite(id) {
  return getFavorites().includes(id);
}

export function toggleFavorite(id) {
  const favorites = getFavorites();
  const index = favorites.indexOf(id);
  if (index === -1) {
    favorites.push(id);
  } else {
    favorites.splice(index, 1);
  }
  write(FAV_KEY, favorites);
  return favorites.includes(id);
}

/* ---------- Directory filter preferences ---------- */
export function getPrefs() {
  return read(PREF_KEY, { search: "", category: "all", availability: "all", sort: "rating" });
}

export function savePrefs(prefs) {
  write(PREF_KEY, prefs);
}
