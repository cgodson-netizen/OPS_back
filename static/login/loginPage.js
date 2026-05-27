const form = document.getElementById("login-form");
const identifierInput = document.getElementById("id_email");
const passwordInput = document.getElementById("id_password");
const rememberMeCheckbox = document.getElementById("rememberMe");
const identifierError = document.getElementById("identifierError");
const passwordError = document.getElementById("passwordError");
const togglePassword = document.getElementById("togglePassword");

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function resetErrors() {
  if (identifierError) identifierError.style.display = "none";
  if (passwordError) passwordError.style.display = "none";
  if (identifierInput) identifierInput.removeAttribute("aria-invalid");
  if (passwordInput) passwordInput.removeAttribute("aria-invalid");
}

form.addEventListener("submit", (event) => {
  resetErrors();

  const identifier = identifierInput ? identifierInput.value.trim() : "";
  const password = passwordInput ? passwordInput.value.trim() : "";

  let hasError = false;

  if (!identifier || !validateEmail(identifier)) {
    if (identifierError) identifierError.style.display = "block";
    if (identifierInput) identifierInput.setAttribute("aria-invalid", "true");
    hasError = true;
  }

  if (password.length < 6) {
    if (passwordError) {
      passwordError.style.display = "block";
      passwordError.textContent = "Password must be at least 6 characters.";
    }
    if (passwordInput) passwordInput.setAttribute("aria-invalid", "true");
    hasError = true;
  }

  if (hasError) {
    event.preventDefault();
    return;
  }

  // Save remembered identifier
  if (rememberMeCheckbox && rememberMeCheckbox.checked) {
    localStorage.setItem("opsRememberedIdentifier", identifier);
  } else {
    localStorage.removeItem("opsRememberedIdentifier");
  }

  // Let Django handle the real submission
  const submitButton = form.querySelector("button[type='submit']");
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Logging in...";
  }
});

if (togglePassword) {
  togglePassword.addEventListener("click", () => {
    const field = document.getElementById("id_password");
    if (!field) return;
    const type = field.getAttribute("type") === "password" ? "text" : "password";
    field.setAttribute("type", type);
    togglePassword.src =
      type === "password"
        ? togglePassword.dataset.hiddenIcon
        : togglePassword.dataset.visibleIcon;
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const remembered = localStorage.getItem("opsRememberedIdentifier");
  if (remembered && identifierInput) {
    identifierInput.value = remembered;
    if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
  }
});
