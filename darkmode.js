const toggleButtons = document.querySelectorAll(".dark-mode-toggle");
const body = document.body;

// Initialize dark mode state
if (localStorage.getItem("dark-mode") === "enabled") {
  body.classList.add("dark-mode");
  toggleButtons.forEach(btn => {
    btn.innerHTML = '<i class="fas fa-sun"></i>';
  });
}

// Attach event listeners to all toggles
toggleButtons.forEach(button => {
  button.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    if (body.classList.contains("dark-mode")) {
      toggleButtons.forEach(btn => {
        btn.innerHTML = '<i class="fas fa-sun"></i>';
      });
      localStorage.setItem("dark-mode", "enabled");
    } else {
      toggleButtons.forEach(btn => {
        btn.innerHTML = '<i class="fas fa-moon"></i>';
      });
      localStorage.setItem("dark-mode", "disabled");
    }
  });
});
