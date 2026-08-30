const year = new Date().getFullYear();

for (const element of document.querySelectorAll("[data-year]")) {
  element.textContent = String(year);
}

for (const button of document.querySelectorAll("[data-copy-target]")) {
  button.addEventListener("click", async () => {
    const target = document.getElementById(button.dataset.copyTarget);

    if (!target) {
      return;
    }

    const originalLabel = button.textContent;

    try {
      await navigator.clipboard.writeText(target.textContent);
      button.textContent = "Скопійовано";
    } catch {
      button.textContent = "Не вдалося скопіювати";
    }

    window.setTimeout(() => {
      button.textContent = originalLabel;
    }, 2200);
  });
}
