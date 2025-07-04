const toggleButton = document.getElementById("darkModeToggle");
const body = document.body;

if (localStorage.getItem("dark-mode") === "enabled") {
  body.classList.add("dark-mode");
  toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
}

toggleButton.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  if (body.classList.contains("dark-mode")) {
    toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem("dark-mode", "enabled");
  } else {
    toggleButton.innerHTML = '<i class="fas fa-moon"></i>';
    localStorage.setItem("dark-mode", "disabled");
  }
});
