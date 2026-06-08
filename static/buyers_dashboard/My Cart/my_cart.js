// my_cart.js — real Django cart, +/- buttons only, no spinner arrows

const CHECKOUT_URL = "/checkout/";
const CART_REMOVE_BASE = "/cart/remove/";
const CART_UPDATE_BASE = "/cart/update/";

function getCsrfToken() {
  return document.cookie.split(";")
    .map(c => c.trim())
    .find(c => c.startsWith("csrftoken="))
    ?.split("=")[1] || "";
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] || c)
  );
}

function formatCurrency(amount) {
  return `GH₵ ${Number(amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2, maximumFractionDigits: 2
  })}`;
}

// Hide browser spinner arrows via injected CSS
const style = document.createElement("style");
style.textContent = `
  .cart-quantity-input::-webkit-outer-spin-button,
  .cart-quantity-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  .cart-quantity-input { -moz-appearance: textfield; text-align: center; width: 48px; }
`;
document.head.appendChild(style);

function getCartData() {
  const rows = Array.from(document.querySelectorAll("#cart-body tr[data-item-id]"));
  return rows.map(row => ({
    id: row.dataset.itemId,
    name: row.dataset.productName || "",
    price: parseFloat(row.dataset.price || 0),
    quantity: parseInt(row.querySelector(".cart-quantity-input")?.value || row.dataset.quantity || 1),
    subtotal: parseFloat(row.dataset.subtotal || 0),
  }));
}

function renderSummary() {
  const summaryEl = document.getElementById("cart-summary");
  const countEl = document.getElementById("cart-count");
  if (!summaryEl) return;

  const items = getCartData();
  const totalItems = items.reduce((t, i) => t + i.quantity, 0);
  const subtotal = items.reduce((t, i) => t + i.price * i.quantity, 0);

  if (countEl) countEl.textContent = `${totalItems} item${totalItems === 1 ? "" : "s"}`;

  summaryEl.innerHTML = `
    <article class="summary-card">
      <p class="summary-card__label">Items in cart</p>
      <p class="summary-card__value">${totalItems}</p>
      <p class="summary-card__detail">Everything ready for a smooth checkout.</p>
    </article>
    <article class="summary-card">
      <p class="summary-card__label">Subtotal</p>
      <p class="summary-card__value">${escapeHtml(formatCurrency(subtotal))}</p>
      <p class="summary-card__detail">Before shipping and taxes.</p>
    </article>
  `;
}

function updateQuantityOnServer(itemId, quantity) {
  fetch(`${CART_UPDATE_BASE}${itemId}/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": getCsrfToken(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `quantity=${quantity}`,
  }).then(() => window.location.reload());
}

document.addEventListener("click", function(event) {
  // Remove button
  const removeBtn = event.target.closest("[data-cart-action='remove']");
  if (removeBtn) {
    event.preventDefault();
    const itemId = removeBtn.dataset.itemId;
    if (itemId) window.location.href = `${CART_REMOVE_BASE}${itemId}/`;
    return;
  }

  // + button
  const increaseBtn = event.target.closest("[data-cart-action='increase']");
  if (increaseBtn) {
    const row = increaseBtn.closest("tr[data-item-id]");
    const input = row?.querySelector(".cart-quantity-input");
    if (input && row) {
      const newQty = parseInt(input.value || 1) + 1;
      input.value = newQty;
      updateQuantityOnServer(row.dataset.itemId, newQty);
    }
    return;
  }

  // - button
  const decreaseBtn = event.target.closest("[data-cart-action='decrease']");
  if (decreaseBtn) {
    const row = decreaseBtn.closest("tr[data-item-id]");
    const input = row?.querySelector(".cart-quantity-input");
    if (input && row) {
      const newQty = Math.max(1, parseInt(input.value || 1) - 1);
      input.value = newQty;
      updateQuantityOnServer(row.dataset.itemId, newQty);
    }
    return;
  }
});

// Fix checkout link
const checkoutLink = document.getElementById("checkout-link");
if (checkoutLink) {
  checkoutLink.href = CHECKOUT_URL;
  checkoutLink.removeAttribute("data-route");
}

// Clear stale sessionStorage
try {
  sessionStorage.removeItem("opsBuyerDashboardState");
  sessionStorage.removeItem("opsBuyerPendingCheckout");
  sessionStorage.removeItem("buyerDashboardState");
} catch (e) {}

renderSummary();