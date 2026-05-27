const form = document.getElementById("buyer-onboarding-form");
const fullNameInput = document.getElementById("full-name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const addressInput = document.getElementById("address");
const cityInput = document.getElementById("city");
const deliveryPreferenceSelect = document.getElementById("delivery-preference");
const termsCheckbox = document.getElementById("terms");

const fullNameError = document.getElementById("fullNameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");
const addressError = document.getElementById("addressError");
const cityError = document.getElementById("cityError");
const deliveryError = document.getElementById("deliveryError");

const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

const steps = Array.from(document.querySelectorAll(".form-step"));
const progressContainer = document.querySelector(".progress-container");
const progressSteps = Array.from(document.querySelectorAll(".progress-step"));
const nextButtons = document.querySelectorAll("[data-next]");
const prevButtons = document.querySelectorAll("[data-prev]");

let currentStep = 1;

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password);
}

function setError(input, errorElement, message) {
  errorElement.textContent = message;
  errorElement.style.display = "block";
  input.setAttribute("aria-invalid", "true");
}

function clearError(input, errorElement) {
  errorElement.style.display = "none";
  input.removeAttribute("aria-invalid");
}

function resetErrors() {
  clearError(fullNameInput, fullNameError);
  clearError(emailInput, emailError);
  clearError(passwordInput, passwordError);
  clearError(confirmPasswordInput, confirmPasswordError);
  clearError(addressInput, addressError);
  clearError(cityInput, cityError);
  clearError(deliveryPreferenceSelect, deliveryError);
  termsCheckbox.style.outline = "none";
}

function updateProgress() {
  progressSteps.forEach((step) => {
    const stepNumber = Number(step.dataset.step);
    step.classList.toggle("completed", stepNumber < currentStep);
    step.classList.toggle("active", stepNumber === currentStep);

    const fillAmount = stepNumber < currentStep ? 100 : 0;
    step.style.setProperty("--segment-fill", `${fillAmount}%`);
  });

  if (progressContainer) {
    progressContainer.setAttribute("aria-valuenow", String(currentStep));
  }
}

function showStep(stepNumber) {
  currentStep = stepNumber;
  steps.forEach((step) => {
    step.classList.toggle(
      "active",
      Number(step.dataset.step) === currentStep
    );
  });
  updateProgress();
}

function validateStep(stepNumber) {
  resetErrors();
  let hasError = false;

  if (stepNumber === 1) {
    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (!fullName) {
      setError(fullNameInput, fullNameError, "Full name is required.");
      hasError = true;
    }

    if (!validateEmail(email)) {
      setError(emailInput, emailError, "Please enter a valid email address.");
      hasError = true;
    }

    if (!validatePassword(password)) {
      setError(
        passwordInput,
        passwordError,
        "Use 6+ characters with upper, lower, number, and symbol."
      );
      hasError = true;
    }

    if (password !== confirmPassword) {
      setError(
        confirmPasswordInput,
        confirmPasswordError,
        "Passwords do not match."
      );
      hasError = true;
    }
  }

  if (stepNumber === 2) {
    const address = addressInput.value.trim();
    const city = cityInput.value.trim();
    const deliveryPreference = deliveryPreferenceSelect.value;

    if (!address) {
      setError(addressInput, addressError, "Delivery address is required.");
      hasError = true;
    }

    if (!city) {
      setError(cityInput, cityError, "City or region is required.");
      hasError = true;
    }

    if (!deliveryPreference) {
      setError(
        deliveryPreferenceSelect,
        deliveryError,
        "Please select a delivery preference."
      );
      hasError = true;
    }
  }

  if (stepNumber === 3) {
    if (!termsCheckbox.checked) {
      termsCheckbox.style.outline = "2px solid red";
      hasError = true;
    }
  }

  return !hasError;
}

nextButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (validateStep(currentStep)) {
      showStep(Math.min(currentStep + 1, steps.length));
    }
  });
});

prevButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showStep(Math.max(currentStep - 1, 1));
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (currentStep < steps.length) {
    if (validateStep(currentStep)) {
      showStep(currentStep + 1);
    }
    return;
  }

  if (!validateStep(currentStep)) {
    return;
  }

  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Creating profile...";

  setTimeout(() => {
    alert("Buyer profile created successfully!");
    form.reset();
    submitButton.disabled = false;
    submitButton.textContent = "Finish";
    showStep(1);
  }, 300);
});

showStep(1);

if (togglePassword) {
  togglePassword.addEventListener("click", () => {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    togglePassword.src =
      type === "password"
        ? "Images/hidden password.png"
        : "Images/show password.png";
  });
}

if (toggleConfirmPassword) {
  toggleConfirmPassword.addEventListener("click", () => {
    const type =
      confirmPasswordInput.getAttribute("type") === "password"
        ? "text"
        : "password";
    confirmPasswordInput.setAttribute("type", type);
    toggleConfirmPassword.src =
      type === "password"
        ? "Images/hidden password.png"
        : "Images/show password.png";
  });
}
