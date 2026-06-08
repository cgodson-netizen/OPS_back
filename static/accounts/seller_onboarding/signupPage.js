const form = document.getElementById("seller-onboarding-form");
const fullNameInput = document.getElementById("full-name");
const emailInput = document.getElementById("id_email");
const phoneInput = document.getElementById("id_phone_number");
const passwordInput = document.getElementById("id_password1");
const confirmPasswordInput = document.getElementById("id_password2");

const businessNameInput = document.getElementById("business-name");
const sellerTypeSelect = document.getElementById("seller-type");
const businessLocationInput = document.getElementById("business-location");
const storeNameInput = document.getElementById("store-name");
const storeDescriptionInput = document.getElementById("store-description");
const categoryInputs = Array.from(
  document.querySelectorAll(".form-step[data-step='2'] .checkbox-grid input[type='checkbox']")
);
const termsCheckbox = document.getElementById("terms");

const fullNameError = document.getElementById("fullNameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");
const businessNameError = document.getElementById("businessNameError");
const sellerTypeError = document.getElementById("sellerTypeError");
const locationError = document.getElementById("locationError");
const storeNameError = document.getElementById("storeNameError");
const descriptionError = document.getElementById("descriptionError");
const categoryError = document.getElementById("categoryError");

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
  if (!errorElement) return;
  errorElement.textContent = message;
  errorElement.style.display = "block";
  if (input) input.setAttribute("aria-invalid", "true");
}

function clearError(input, errorElement) {
  if (!errorElement) return;
  errorElement.style.display = "none";
  if (input) input.removeAttribute("aria-invalid");
}

function resetErrors() {
  clearError(fullNameInput, fullNameError);
  clearError(emailInput, emailError);
  clearError(phoneInput, phoneError);
  clearError(passwordInput, passwordError);
  clearError(confirmPasswordInput, confirmPasswordError);
  clearError(businessNameInput, businessNameError);
  clearError(sellerTypeSelect, sellerTypeError);
  clearError(businessLocationInput, locationError);
  clearError(storeNameInput, storeNameError);
  clearError(storeDescriptionInput, descriptionError);
  clearError(null, categoryError);
  if (termsCheckbox) termsCheckbox.style.outline = "none";
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
    step.classList.toggle("active", Number(step.dataset.step) === currentStep);
  });
  updateProgress();
}

function validateStep(stepNumber) {
  resetErrors();
  let hasError = false;

  if (stepNumber === 1) {
    const fullName = fullNameInput ? fullNameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const phone = phoneInput ? phoneInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value.trim() : "";
    const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value.trim() : "";

    if (!fullName) {
      setError(fullNameInput, fullNameError, "Full name is required.");
      hasError = true;
    }
    if (!validateEmail(email)) {
      setError(emailInput, emailError, "Please enter a valid email address.");
      hasError = true;
    }
    if (!phone) {
      setError(phoneInput, phoneError, "Phone number is required.");
      hasError = true;
    }
    if (!validatePassword(password)) {
      setError(passwordInput, passwordError, "Use 6+ characters with upper, lower, number, and symbol.");
      hasError = true;
    }
    if (password !== confirmPassword) {
      setError(confirmPasswordInput, confirmPasswordError, "Passwords do not match.");
      hasError = true;
    }
  }

  if (stepNumber === 2) {
    const businessName = businessNameInput ? businessNameInput.value.trim() : "";
    const sellerType = sellerTypeSelect ? sellerTypeSelect.value : "";
    const businessLocation = businessLocationInput ? businessLocationInput.value.trim() : "";
    const storeName = storeNameInput ? storeNameInput.value.trim() : "";
    const storeDescription = storeDescriptionInput ? storeDescriptionInput.value.trim() : "";
    const hasCategory = categoryInputs.some((input) => input.checked);

    if (!businessName) {
      setError(businessNameInput, businessNameError, "Business name is required.");
      hasError = true;
    }
    if (!sellerType) {
      setError(sellerTypeSelect, sellerTypeError, "Please select a seller type.");
      hasError = true;
    }
    if (!businessLocation) {
      setError(businessLocationInput, locationError, "Business location is required.");
      hasError = true;
    }
    if (!storeName) {
      setError(storeNameInput, storeNameError, "Store name is required.");
      hasError = true;
    }
    if (!storeDescription) {
      setError(storeDescriptionInput, descriptionError, "Store description is required.");
      hasError = true;
    }
    if (!hasCategory) {
      setError(null, categoryError, "Please select at least one category.");
      hasError = true;
    }
    if (termsCheckbox && !termsCheckbox.checked) {
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
  if (currentStep < steps.length) {
    event.preventDefault();
    if (validateStep(currentStep)) {
      showStep(currentStep + 1);
    }
    return;
  }

  if (!validateStep(currentStep)) {
    event.preventDefault();
    return;
  }

  // All valid — let Django handle real submission
  const submitButton = form.querySelector("button[type='submit']");
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Creating profile...";
  }
});

if (togglePassword) {
  togglePassword.addEventListener("click", () => {
    const field = document.getElementById("id_password1");
    if (!field) return;
    const type = field.getAttribute("type") === "password" ? "text" : "password";
    field.setAttribute("type", type);
    togglePassword.src = type === "password"
      ? togglePassword.dataset.hiddenIcon
      : togglePassword.dataset.visibleIcon;
  });
}

if (toggleConfirmPassword) {
  toggleConfirmPassword.addEventListener("click", () => {
    const field = document.getElementById("id_password2");
    if (!field) return;
    const type = field.getAttribute("type") === "password" ? "text" : "password";
    field.setAttribute("type", type);
    toggleConfirmPassword.src = type === "password"
      ? toggleConfirmPassword.dataset.hiddenIcon
      : toggleConfirmPassword.dataset.visibleIcon;
  });
}

// Sync full name to Django hidden fields
const firstNameInput = document.getElementById("id_first_name");
const lastNameInput = document.getElementById("id_last_name");

function syncFullNameFields(fromCombined) {
  if (!firstNameInput || !lastNameInput || !fullNameInput) return;
  if (fromCombined) {
    const parts = fullNameInput.value.trim().split(/\s+/).filter(Boolean);
    firstNameInput.value = parts[0] || "";
    lastNameInput.value = parts.slice(1).join(" ");
  } else {
    fullNameInput.value = [firstNameInput.value, lastNameInput.value].filter(Boolean).join(" ").trim();
  }
}

syncFullNameFields(false);
fullNameInput?.addEventListener("input", () => syncFullNameFields(true));
firstNameInput?.addEventListener("input", () => syncFullNameFields(false));
lastNameInput?.addEventListener("input", () => syncFullNameFields(false));

showStep(1);