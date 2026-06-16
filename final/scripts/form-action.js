// Form action page — read submitted values and display them safely.
// User-supplied text is inserted with textContent to avoid any XSS risk.

import { initNav } from "./modules/nav.js";

initNav();

const params = new URLSearchParams(window.location.search);
const tableBody = document.getElementById("summary-body");
const nameLine = document.getElementById("applicant-name");

const labels = {
  fullName: "Full name",
  email: "Email",
  phone: "Phone",
  category: "Service category",
  specialty: "Specialty / headline",
  rate: "Hourly rate (USD)",
  experience: "Years of experience",
  area: "Service area",
  availability: "Availability",
  bio: "About you",
  terms: "Agreed to guidelines",
};

const availabilityText = {
  available: "Available now",
  week: "Within a week",
  booked: "Currently booked",
};

const firstName = params.get("fullName");
if (firstName && nameLine) {
  nameLine.textContent = `Thanks, ${firstName.split(" ")[0]}!`;
}

// Build one table row per submitted field, in a friendly order.
Object.keys(labels).forEach((key) => {
  if (!params.has(key)) return;

  let value = params.get(key);
  if (key === "availability") value = availabilityText[value] || value;
  if (key === "terms") value = value === "on" ? "Yes" : "No";
  if (key === "rate") value = `$${value}`;

  const row = document.createElement("tr");
  const th = document.createElement("th");
  th.scope = "row";
  th.textContent = labels[key];
  const td = document.createElement("td");
  td.textContent = value; // safe rendering of user input
  row.append(th, td);
  tableBody.appendChild(row);
});

if (tableBody.children.length === 0) {
  const row = document.createElement("tr");
  const td = document.createElement("td");
  td.colSpan = 2;
  td.textContent = "No submission data was received.";
  row.appendChild(td);
  tableBody.appendChild(row);
}
