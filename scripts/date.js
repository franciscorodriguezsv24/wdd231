// ============================================================
// WDD 231 — Footer year and last-modified date
// ============================================================

document.getElementById('currentyear').textContent = `© ${new Date().getFullYear()}`;
document.getElementById('lastModified').textContent = `Last Modified: ${document.lastModified}`;
