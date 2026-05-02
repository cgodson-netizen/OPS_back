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
  document.querySelectorAll(
    ".form-step[data-step='2'] .checkbox-grid input[type='checkbox']"
  )
);
const fulfillmentSelect = document.getElementById("fulfillment-method");

const payoutMethodSelect = document.getElementById("payout-method");
const payoutProviderInput = document.getElementById("payout-provider");
const payoutNameInput = document.getElementById("payout-name");
const payoutNumberInput = document.getElementById("payout-number");
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
const fulfillmentError = document.getElementById("fulfillmentError");

const payoutMethodError = document.getElementById("payoutMethodError");
const payoutProviderError = document.getElementById("payoutProviderError");
const payoutNameError = document.getElementById("payoutNameError");
const payoutNumberError = document.getElementById("payoutNumberError");

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
  if (input) {
    input.setAttribute("aria-invalid", "true");
  }
}

function clearError(input, errorElement) {
  errorElement.style.display = "none";
  if (input) {
    input.removeAttribute("aria-invalid");
  }
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
  clearError(fulfillmentSelect, fulfillmentError);

  clearError(payoutMethodSelect, payoutMethodError);
  clearError(payoutProviderInput, payoutProviderError);
  clearError(payoutNameInput, payoutNameError);
  clearError(payoutNumberInput, payoutNumberError);

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
    const phone = phoneInput.value.trim();
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

    if (!phone) {
      setError(phoneInput, phoneError, "Phone number is required.");
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
    const businessName = businessNameInput.value.trim();
    const sellerType = sellerTypeSelect.value;
    const businessLocation = businessLocationInput.value.trim();
    const storeName = storeNameInput.value.trim();
    const storeDescription = storeDescriptionInput.value.trim();
    const fulfillmentMethod = fulfillmentSelect.value;
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
      setError(
        businessLocationInput,
        locationError,
        "Business location is required."
      );
      hasError = true;
    }

    if (!storeName) {
      setError(storeNameInput, storeNameError, "Store name is required.");
      hasError = true;
    }

    if (!storeDescription) {
      setError(
        storeDescriptionInput,
        descriptionError,
        "Store description is required."
      );
      hasError = true;
    }

    if (!hasCategory) {
      setError(null, categoryError, "Please select at least one category.");
      hasError = true;
    }

    if (!fulfillmentMethod) {
      setError(
        fulfillmentSelect,
        fulfillmentError,
        "Please select a fulfillment method."
      );
      hasError = true;
    }
  }

  if (stepNumber === 3) {
    const payoutMethod = payoutMethodSelect.value;
    const payoutProvider = payoutProviderInput.value.trim();
    const payoutName = payoutNameInput.value.trim();
    const payoutNumber = payoutNumberInput.value.trim();

    if (!payoutMethod) {
      setError(
        payoutMethodSelect,
        payoutMethodError,
        "Please select a payout method."
      );
      hasError = true;
    }

    if (!payoutProvider) {
      setError(
        payoutProviderInput,
        payoutProviderError,
        "Provider name is required."
      );
      hasError = true;
    }

    if (!payoutName) {
      setError(payoutNameInput, payoutNameError, "Account name is required.");
      hasError = true;
    }

    if (!payoutNumber) {
      setError(
        payoutNumberInput,
        payoutNumberError,
        "Account number is required."
      );
      hasError = true;
    }

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

  // All steps valid — let Django handle the real submission
  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Creating profile...";
});

if (togglePassword) {
  togglePassword.addEventListener("click", () => {
    const passwordField = document.getElementById("id_password1");
    const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);
    togglePassword.src =
      type === "password"
        ? togglePassword.dataset.hiddenIcon
        : togglePassword.dataset.visibleIcon;
  });
}

if (toggleConfirmPassword) {
  toggleConfirmPassword.addEventListener("click", () => {
    const confirmField = document.getElementById("id_password2");
    const type = confirmField.getAttribute("type") === "password" ? "text" : "password";
    confirmField.setAttribute("type", type);
    toggleConfirmPassword.src =
      type === "password"
        ? toggleConfirmPassword.dataset.hiddenIcon
        : toggleConfirmPassword.dataset.visibleIcon;
  });
}

showStep(1);