// Accessible modal dialog wrapper around the native <dialog> element.

import { modalContent } from "./ui.js";

let dialog;
let lastFocused;

export function initModal() {
  dialog = document.getElementById("provider-modal");
  if (!dialog) return;

  // Close when the close button (or any [data-close]) is clicked.
  dialog.addEventListener("click", (event) => {
    if (event.target.matches("[data-close]")) {
      closeModal();
    }
    // Click on the backdrop (outside .modal-inner) closes the dialog.
    if (event.target === dialog) {
      closeModal();
    }
  });

  // Restore focus to the triggering element after the dialog closes.
  dialog.addEventListener("close", () => {
    if (lastFocused) lastFocused.focus();
  });
}

export function openProviderModal(provider) {
  if (!dialog) return;
  lastFocused = document.activeElement;
  dialog.setAttribute("aria-label", `${provider.name} — provider details`);
  dialog.querySelector(".modal-inner").innerHTML = modalContent(provider);
  dialog.showModal();
  // Move focus into the dialog for keyboard/screen-reader users.
  dialog.querySelector(".modal-close").focus();
}

export function closeModal() {
  if (dialog && dialog.open) dialog.close();
}
