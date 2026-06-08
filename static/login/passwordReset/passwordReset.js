const form = document.getElementById("password-reset-form");
const identifierInput = document.getElementById("reset-identifier");
const inputShell = document.getElementById("input-shell");
const identifierError = document.getElementById("identifierError");
const alternateMethodButton = document.getElementById("alternate-method");
const alternateNote = document.getElementById("alternate-note");
const RESET_IDENTIFIER_KEY = "opsResetIdentifier";

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  const phoneRegex = /^[+\d][\d\s()-]{6,}$/;
  return phoneRegex.test(phone);
}

function validateIdentifier(value) {
  if (value.includes("@")) {
    return validateEmail(value);
  }
  return validatePhone(value);
}

function resetErrorState() {
  identifierError.style.display = "none";
  inputShell.classList.remove("has-error");
  identifierInput.removeAttribute("aria-invalid");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  resetErrorState();

  const identifier = identifierInput.value.trim();
  if (!identifier || !validateIdentifier(identifier)) {
    identifierError.style.display = "block";
    inputShell.classList.add("has-error");
    identifierInput.setAttribute("aria-invalid", "true");
    return;
  }

  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Sending reset instructions...";
  sessionStorage.setItem(RESET_IDENTIFIER_KEY, identifier);

  setTimeout(() => {
    window.location.href = "verifyOTP/verifyOtp.html";
  }, 350);
});

identifierInput.addEventListener("input", () => {
  if (identifierInput.hasAttribute("aria-invalid")) {
    resetErrorState();
  }
});

alternateMethodButton.addEventListener("click", () => {
  const isHidden = alternateNote.hidden;
  alternateNote.hidden = !isHidden;
  alternateMethodButton.setAttribute("aria-expanded", String(isHidden));
});

window.addEventListener("DOMContentLoaded", () => {
  const remembered = localStorage.getItem("opsRememberedIdentifier");
  if (remembered) {
    identifierInput.value = remembered;
  }
});
