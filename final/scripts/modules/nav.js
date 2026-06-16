// Shared navigation + footer behaviour for every page.

export function initNav() {
  const btn = document.getElementById("hamburger-btn");
  const nav = document.getElementById("primary-nav");

  if (btn && nav) {
    btn.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(isOpen));
      btn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });
  }

  const yearEl = document.getElementById("currentyear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const modifiedEl = document.getElementById("lastModified");
  if (modifiedEl) {
    modifiedEl.textContent = `Last modified: ${document.lastModified}`;
  }
}
