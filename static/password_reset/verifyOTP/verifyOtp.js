const deliveryTarget = document.getElementById("delivery-target");
const form = document.getElementById("verify-form");
const otpGrid = document.getElementById("otp-grid");
const otpInputs = Array.from(document.querySelectorAll(".otp-input"));
const otpError = document.getElementById("otpError");
const resendButton = document.getElementById("resend-code");
const resendTimer = document.getElementById("resend-timer");
const resendFeedback = document.getElementById("resend-feedback");
const verifyButton = document.getElementById("verify-button");
const statusMessage = document.getElementById("status-message");

const RESEND_INTERVAL_SECONDS = 30;
let resendCountdown = RESEND_INTERVAL_SECONDS;
let resendTimerId = null;

function clearOtpError() {
  if (otpError) otpError.style.display = "none";
  otpInputs.forEach((input) => input.classList.remove("has-error"));
}

function showOtpError(message) {
  if (otpError) {
    otpError.textContent = message;
    otpError.style.display = "block";
  }
  otpInputs.forEach((input) => input.classList.add("has-error"));
}

function updateResendCountdown() {
  if (resendCountdown > 0) {
    if (resendButton) resendButton.disabled = true;
    if (resendTimer) resendTimer.textContent = `Available in ${resendCountdown}s`;
    resendCountdown -= 1;
    return;
  }
  if (resendButton) resendButton.disabled = false;
  if (resendTimer) resendTimer.textContent = "You can resend a new code now";
  if (resendTimerId) {
    window.clearInterval(resendTimerId);
    resendTimerId = null;
  }
}

function startResendCooldown() {
  resendCountdown = RESEND_INTERVAL_SECONDS;
  updateResendCountdown();
  resendTimerId = window.setInterval(updateResendCountdown, 1000);
}

function getOtpValue() {
  return otpInputs.map((input) => input.value).join("");
}

function focusInput(index) {
  const target = otpInputs[index];
  if (target) {
    target.focus();
    target.select();
  }
}

otpInputs.forEach((input, index) => {
  input.addEventListener("input", (event) => {
    const digit = event.target.value.replace(/\D/g, "").slice(-1);
    event.target.value = digit;
    clearOtpError();
    if (statusMessage) {
      statusMessage.textContent = "";
      statusMessage.classList.remove("success");
    }
    if (digit && index < otpInputs.length - 1) {
      focusInput(index + 1);
    }
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Backspace" && !input.value && index > 0) {
      focusInput(index - 1);
    }
    if (event.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
    }
    if (event.key === "ArrowRight" && index < otpInputs.length - 1) {
      focusInput(index + 1);
    }
  });
});

if (otpGrid) {
  otpGrid.addEventListener("paste", (event) => {
    event.preventDefault();
    const pastedDigits = (event.clipboardData.getData("text") || "")
      .replace(/\D/g, "")
      .slice(0, otpInputs.length)
      .split("");

    if (!pastedDigits.length) return;

    otpInputs.forEach((input, index) => {
      input.value = pastedDigits[index] || "";
    });

    clearOtpError();
    if (statusMessage) {
      statusMessage.textContent = "";
      statusMessage.classList.remove("success");
    }
    focusInput(Math.min(pastedDigits.length, otpInputs.length) - 1);
  });
}

form.addEventListener("submit", (event) => {
  clearOtpError();

  const otp = getOtpValue();
  if (otp.length !== otpInputs.length) {
    event.preventDefault();
    showOtpError("Enter the full 4-digit verification code.");
    focusInput(otp.length);
    return;
  }

  // Valid OTP length — let Django handle submission
  if (verifyButton) {
    verifyButton.disabled = true;
    verifyButton.textContent = "Verifying...";
  }
});

window.addEventListener("DOMContentLoaded", () => {
  focusInput(0);
  startResendCooldown();
});