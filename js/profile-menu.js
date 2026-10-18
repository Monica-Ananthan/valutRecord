
(() => {
  const toggle = document.getElementById("profileToggle");
  const dropdown = document.getElementById("profileDropdown");

  if (!toggle || !dropdown) return;

  function closeMenu() {
    dropdown.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";

    dropdown.hidden = isOpen;
    toggle.setAttribute("aria-expanded", String(!isOpen));
  });

  document.addEventListener("click", (event) => {
    if (!toggle.parentElement.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      toggle.focus();
    }
  });
})();
