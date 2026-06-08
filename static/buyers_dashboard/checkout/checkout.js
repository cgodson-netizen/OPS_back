// checkout.js — submits real Django form, client-side validation only

const form = document.getElementById("checkout-form");
const deliveryAddress = document.getElementById("id_delivery_address");
const deliveryError = document.getElementById("delivery-error");
const placeOrderButton = document.getElementById("place-order-button");

function showError(message) {
  if (deliveryError) {
    deliveryError.textContent = message;
    deliveryError.style.display = "block";
  }
  if (deliveryAddress) deliveryAddress.setAttribute("aria-invalid", "true");
}

function clearError() {
  if (deliveryError) deliveryError.style.display = "none";
  if (deliveryAddress) deliveryAddress.removeAttribute("aria-invalid");
}

if (form) {
  form.addEventListener("submit", (event) => {
    clearError();
    const address = deliveryAddress ? deliveryAddress.value.trim() : "";

    if (!address) {
      event.preventDefault();
      showError("Please enter a delivery address.");
      return;
    }

    // Valid — let Django handle real submission
    if (placeOrderButton) {
      placeOrderButton.disabled = true;
      placeOrderButton.textContent = "Placing order...";
    }
  });
}

// Clear stale sessionStorage
try {
  sessionStorage.removeItem("opsBuyerDashboardState");
  sessionStorage.removeItem("opsBuyerPendingCheckout");
  sessionStorage.removeItem("buyerDashboardState");
  sessionStorage.removeItem("buyerDashboardHandoff");
} catch (e) {}