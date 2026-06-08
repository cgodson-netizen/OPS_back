// my_orders.js — reads real Django-rendered orders from the DOM only
// No fake data, no sessionStorage, no hardcoded URLs

const elements = {
  ordersCount: document.getElementById("orders-count"),
  ordersSummary: document.getElementById("orders-summary"),
  ordersBody: document.getElementById("orders-body"),
};

function getStatusClass(status) {
  const v = String(status || "").toLowerCase();
  if (v.includes("deliver")) return "delivered";
  if (v.includes("transit") || v.includes("ship") || v.includes("progress") || v.includes("confirmed")) return "progress";
  if (v.includes("cancel")) return "cancelled";
  return "pending";
}

function renderSummary() {
  if (!elements.ordersSummary) return;

  // Read counts from already-rendered Django table rows
  const rows = Array.from(document.querySelectorAll("#orders-body tr[data-status]"));
  const total = rows.length;
  const delivered = rows.filter(r => getStatusClass(r.dataset.status) === "delivered").length;
  const progress = rows.filter(r => getStatusClass(r.dataset.status) === "progress").length;

  if (elements.ordersCount) {
    elements.ordersCount.textContent = `${total} order${total === 1 ? "" : "s"}`;
  }

  elements.ordersSummary.innerHTML = `
    <article class="summary-card">
      <p class="summary-card__label">Orders</p>
      <p class="summary-card__value">${total}</p>
      <p class="summary-card__detail">Recent purchases you can review at any time.</p>
    </article>
    <article class="summary-card">
      <p class="summary-card__label">Delivered</p>
      <p class="summary-card__value">${delivered}</p>
      <p class="summary-card__detail">Orders that are already complete.</p>
    </article>
    <article class="summary-card">
      <p class="summary-card__label">In progress</p>
      <p class="summary-card__value">${progress}</p>
      <p class="summary-card__detail">Items currently being processed or shipped.</p>
    </article>
  `;
}

// Clear any stale sessionStorage from old JS
try {
  sessionStorage.removeItem("opsBuyerDashboardState");
  sessionStorage.removeItem("buyerDashboardState");
  sessionStorage.removeItem("buyerDashboardHandoff");
} catch (e) {}

renderSummary();