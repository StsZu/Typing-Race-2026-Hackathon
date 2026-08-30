const year = new Date().getFullYear();

for (const element of document.querySelectorAll("[data-year]")) {
  element.textContent = String(year);
}
