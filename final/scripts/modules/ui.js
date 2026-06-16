// Presentation helpers — template literals that build markup from data.

export const availabilityMap = {
  available: { label: "Available now", cls: "badge-available" },
  week: { label: "Within a week", cls: "badge-week" },
  booked: { label: "Currently booked", cls: "badge-booked" },
};

// Build a star string (★/☆) plus the numeric rating for screen readers.
export function starString(rating) {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

// A single provider card used on the directory and home pages.
export function providerCard(provider, saved) {
  const availability = availabilityMap[provider.availability] || availabilityMap.available;
  const verifiedMark = provider.verified
    ? `<span class="verified" title="Identity verified">✔ Verified</span>`
    : "";

  return `
    <article class="provider-card" data-id="${provider.id}">
      <div class="provider-head">
        <img src="images/avatars/${provider.avatar}" alt="Portrait of ${provider.name}"
             width="64" height="64" loading="lazy">
        <div>
          <p class="category">${provider.category}</p>
          <h3>${provider.name} ${verifiedMark}</h3>
        </div>
      </div>
      <p class="specialty">${provider.specialty}</p>
      <div class="provider-meta">
        <span class="rating" aria-label="${provider.rating} out of 5 stars">
          ${starString(provider.rating)} ${provider.rating.toFixed(1)}
        </span>
        <span>(${provider.reviews} reviews)</span>
        <span><strong>$${provider.rate}</strong>/hr</span>
        <span>📍 ${provider.area}</span>
      </div>
      <span class="badge ${availability.cls}">${availability.label}</span>
      <div class="card-actions">
        <button class="btn btn-primary view-btn" type="button" data-id="${provider.id}">
          View details
        </button>
        <button class="save-btn ${saved ? "saved" : ""}" type="button"
                data-id="${provider.id}"
                aria-pressed="${saved}"
                aria-label="${saved ? "Remove from saved" : "Save provider"}">
          ${saved ? "★" : "☆"}
        </button>
      </div>
    </article>`;
}

// Detailed markup shown inside the modal dialog.
export function modalContent(provider) {
  const availability = availabilityMap[provider.availability] || availabilityMap.available;
  const skills = provider.skills.map((skill) => `<li>${skill}</li>`).join("");

  return `
    <button class="modal-close" type="button" data-close aria-label="Close dialog">&times;</button>
    <div class="modal-head">
      <img src="images/avatars/${provider.avatar}" alt="Portrait of ${provider.name}"
           width="80" height="80" loading="lazy">
      <div>
        <h3 id="modal-title">${provider.name}</h3>
        <p class="category">${provider.category} · ${provider.area}</p>
        <span class="rating">${starString(provider.rating)} ${provider.rating.toFixed(1)}
          (${provider.reviews})</span>
      </div>
    </div>
    <span class="badge ${availability.cls}">${availability.label}</span>
    <p>${provider.bio}</p>
    <p><strong>Rate:</strong> $${provider.rate} ${provider.currency}/hour &nbsp;·&nbsp;
       <strong>Experience:</strong> ${provider.experience} years</p>
    <h4>Skills</h4>
    <ul class="skill-list">${skills}</ul>
    <div class="modal-contact">
      <p><strong>Contact ${provider.name.split(" ")[0]}</strong></p>
      <p>✉ <a href="mailto:${provider.email}">${provider.email}</a></p>
      <p>📞 <a href="tel:${provider.phone.replace(/\s/g, "")}">${provider.phone}</a></p>
    </div>`;
}
