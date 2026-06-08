// finalcheckout.js — real Django URLs only, no fake data, no sessionStorage

// Clear stale sessionStorage from old JS
try {
  sessionStorage.removeItem("opsBuyerDashboardState");
  sessionStorage.removeItem("opsBuyerPendingCheckout");
  sessionStorage.removeItem("buyerDashboardState");
  sessionStorage.removeItem("buyerDashboardHandoff");
} catch (e) {}

// All buttons and links in the order_detail.html template already have
// correct Django URLs — Pay Now links to payments:initiate_payment
// and Cancel Order submits a Django form to orders:order_cancel
// This file only needs to handle UI feedback

const payNowBtn = document.getElementById("pay-now-button");
const cancelBtn = document.getElementById("cancel-order-button");

if (payNowBtn) {
  payNowBtn.addEventListener("click", function() {
    payNowBtn.textContent = "Redirecting to Paystack...";
    payNowBtn.disabled = true;
  });
}

if (cancelBtn) {
  cancelBtn.addEventListener("click", function() {
    cancelBtn.textContent = "Cancelling...";
    cancelBtn.disabled = true;
  });
}