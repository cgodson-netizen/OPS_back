const form = document.getElementById("password-reset-form");
const identifierInput = document.getElementById("email");
const inputShell = document.getElementById("input-shell");
const identifierError = document.getElementById("identifierError");
const alternateMethodButton = document.getElementById("alternate-method");
const alternateNote = document.getElementById("alternate-note");

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function resetErrorState() {
  if (identifierError) identifierError.style.display = "none";
  if (inputShell) inputShell.classList.remove("has-error");
  if (identifierInput) identifierInput.removeAttribute("aria-invalid");
}

form.addEventListener("submit", (event) => {
  resetErrorState();

  const identifier = identifierInput ? identifierInput.value.trim() : "";

  if (!identifier || !validateEmail(identifier)) {
    event.preventDefault();
    if (identifierError) identifierError.style.display = "block";
    if (inputShell) inputShell.classList.add("has-error");
    if (identifierInput) identifierInput.setAttribute("aria-invalid", "true");
    return;
  }

  // Valid — let Django handle submission
  const submitButton = form.querySelector("button[type='submit']");
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Sending reset instructions...";
  }
});

if (identifierInput) {
  identifierInput.addEventListener("input", () => {
    if (identifierInput.hasAttribute("aria-invalid")) {
      resetErrorState();
    }
  });
}

if (alternateMethodButton && alternateNote) {
  alternateMethodButton.addEventListener("click", () => {
    const isHidden = alternateNote.hidden;
    alternateNote.hidden = !isHidden;
    alternateMethodButton.setAttribute("aria-expanded", String(isHidden));
  });
}