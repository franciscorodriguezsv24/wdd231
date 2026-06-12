// ============================================================
// San Salvador Chamber of Commerce — discover.js (module)
// Imports points-of-interest data, builds named-grid cards,
// shows a localStorage-based visit message, handles nav + dates.
// ============================================================

import items from "../data/discover.mjs";

// ---------- Build the cards ----------
const cardsContainer = document.getElementById("discover-cards");

function buildCards() {
    items.forEach((item, index) => {
        const card = document.createElement("article");
        card.className = "discover-card";
        // Named grid area so each card lands in its own template-area slot.
        card.style.gridArea = `card${index + 1}`;

        card.innerHTML = `
            <h2>${item.name}</h2>
            <figure>
                <img src="images/${item.image}" alt="${item.name}"
                     width="300" height="200" loading="lazy"
                     onerror="this.src='images/placeholder.svg'">
            </figure>
            <address>${item.address}</address>
            <p>${item.description}</p>
            <button type="button" class="learn-more">Learn More</button>
        `;

        cardsContainer.appendChild(card);
    });
}

buildCards();

// ---------- Visit message via localStorage ----------
function showVisitMessage() {
    const messageBox = document.getElementById("visit-message");
    const STORAGE_KEY = "discover-last-visit";
    const now = Date.now();
    const lastVisit = Number(window.localStorage.getItem(STORAGE_KEY));

    let message;
    if (!lastVisit) {
        message = "Welcome! Let us know if you have any questions.";
    } else {
        const msPerDay = 1000 * 60 * 60 * 24;
        const days = Math.floor((now - lastVisit) / msPerDay);

        if (days < 1) {
            message = "Back so soon! Awesome!";
        } else if (days === 1) {
            message = "You last visited 1 day ago.";
        } else {
            message = `You last visited ${days} days ago.`;
        }
    }

    messageBox.innerHTML = `
        <p>${message}</p>
        <button type="button" class="close-visit" aria-label="Dismiss message">&times;</button>
    `;

    messageBox.querySelector(".close-visit").addEventListener("click", () => {
        messageBox.classList.add("hidden");
    });

    window.localStorage.setItem(STORAGE_KEY, now);
}

showVisitMessage();

// ---------- Mobile menu toggle ----------
const menuToggle = document.getElementById("menu-toggle");
const primaryNav = document.getElementById("primary-nav");

menuToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

// ---------- Footer dates ----------
document.getElementById("copyright-year").textContent = new Date().getFullYear();
document.getElementById("last-modified").textContent = document.lastModified;
