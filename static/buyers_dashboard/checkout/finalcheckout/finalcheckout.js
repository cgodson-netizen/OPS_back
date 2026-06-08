const backendBuyerDashboardData =
  (typeof window !== "undefined" &&
    (window.__BUYER_DASHBOARD__ || window.buyerDashboardData || window.__OPS_BUYER_DASHBOARD__)) ||
  {};

const BUYER_DASHBOARD_STATE_KEY = "opsBuyerDashboardState";
const BUYER_PENDING_CHECKOUT_KEY = "opsBuyerPendingCheckout";
const BUYER_PRODUCTS_PAGE_URL = "../../buyersDashboard.html";
const BUYER_CART_PAGE_URL = "../../My Cart/my_cart.html";
const BUYER_ORDERS_PAGE_URL = "../../my Orders/my_orders.html";
const BUYER_LOGOUT_PAGE_URL = "../../../index.html";
const PAYSTACK_INITIALIZE_URL =
  (typeof window !== "undefined" &&
    (window.__PAYSTACK_CHECKOUT_URL__ || window.paystackCheckoutUrl || window.paystackUrl || "")) ||
  "";

const fallbackBuyerDashboardData = {
  brand: "OPS",
  brandTag: "Final checkout",
  currency: "GHS",
  buyer: {
    fullName: "Ama Mensah",
    initials: "AM",
  },
  onboarding: {
    address: "Cotwi",
    city: "",
  },
  products: [
    {
      id: "iphone-14",
      title: "Iphones",
      category: "electronics",
      badge: "New",
      price: 7000,
      oldPrice: 7600,
      rating: 4.9,
      reviews: 74,
      description: "Premium device preview used to demonstrate the final checkout handoff.",
      tags: ["new"],
    },
  ],
  cart: [],
  orders: [],
  pendingCheckout: {
    id: "ORD-13",
    orderNumber: 13,
    status: "Pending",
    deliveryAddress: "cotwi",
    total: 7000,
    placedAt: "2026-06-06T13:22:00.000Z",
    items: [
      {
        productId: "iphone-14",
        name: "Iphones",
        quantity: 1,
        price: 7000,
        total: 7000,
      },
    ],
  },
};

function safeParseJson(value) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

function readBuyerDashboardStateFromStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.sessionStorage.getItem(BUYER_DASHBOARD_STATE_KEY);
    return rawValue ? safeParseJson(rawValue) : null;
  } catch (error) {
    return null;
  }
}

function readPendingCheckoutFromStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.sessionStorage.getItem(BUYER_PENDING_CHECKOUT_KEY);
    return rawValue ? safeParseJson(rawValue) : null;
  } catch (error) {
    return null;
  }
}

function mergeFinalCheckoutData(fallback, incoming) {
  const source = incoming && typeof incoming === "object" ? incoming : {};

  return {
    ...fallback,
    ...source,
    buyer: {
      ...fallback.buyer,
      ...(source.buyer || source.user || {}),
    },
    onboarding: {
      ...fallback.onboarding,
      ...(source.onboarding || {}),
    },
    products: Array.isArray(source.products) ? source.products : fallback.products,
    cart: Array.isArray(source.cart) ? source.cart : fallback.cart,
    orders: Array.isArray(source.orders) ? source.orders : fallback.orders,
    pendingCheckout: source.pendingCheckout || fallback.pendingCheckout || null,
  };
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return replacements[character] || character;
  });
}

function formatCurrency(value) {
  const currency = String(dashboardData.currency || "GHS").toUpperCase();
  const amount = Number(value || 0);

  try {
    const formattedAmount = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    if (currency === "GHS") {
      return `GH₵ ${formattedAmount}`;
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    return `GH₵ ${amount.toFixed(2)}`;
  }
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value || "");
  }

  const datePart = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return `${datePart}, ${timePart}`;
}

function getInitials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) {
    return "OP";
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function normalizeProducts(products) {
  return Array.isArray(products)
    ? products
        .filter((product) => product && typeof product === "object")
        .map((product, index) => {
          const title = String(product.title || product.name || `Item ${index + 1}`);
          const price = Number(product.price ?? 0);
          const oldPrice = Number(product.oldPrice ?? price);

          return {
            id: String(product.id || title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `item-${index + 1}`),
            title,
            category: String(product.category || "general"),
            badge: String(product.badge || ""),
            price,
            oldPrice,
            rating: Number(product.rating || 0),
            reviews: Number(product.reviews || 0),
            description: String(product.description || ""),
          };
        })
    : [];
}

function normalizeCartItems(items) {
  return Array.isArray(items)
    ? items
        .filter((item) => item && typeof item === "object")
        .map((item) => ({
          productId: String(item.productId || item.id || item.product?.id || ""),
          quantity: Math.max(1, Number(item.quantity || item.qty || 1)),
        }))
        .filter((item) => item.productId)
    : [];
}

function normalizeCheckoutItems(items, productMap) {
  return Array.isArray(items)
    ? items
        .filter((item) => item && typeof item === "object")
        .map((item, index) => {
          const productId = String(item.productId || item.id || item.product?.id || `item-${index + 1}`);
          const product = productMap.get(productId) || null;
          const quantity = Math.max(1, Number(item.quantity || item.qty || 1));
          const price = Number(item.price ?? product?.price ?? 0);
          const total = Number(item.total ?? price * quantity);

          return {
            productId,
            name: String(item.name || item.title || product?.title || product?.name || `Item ${index + 1}`),
            quantity,
            price,
            total,
          };
        })
    : [];
}

function parseOrderNumberFromId(orderId) {
  const match = String(orderId || "").match(/(\d+)(?!.*\d)/);
  return match ? Number(match[1]) : null;
}

function normalizePendingCheckout(source, productMap, cartItems, fallbackOrderNumber) {
  const pendingSource = source && typeof source === "object" ? source : {};
  const rawItems = Array.isArray(pendingSource.items) && pendingSource.items.length
    ? pendingSource.items
    : cartItems;
  const items = normalizeCheckoutItems(rawItems, productMap);
  const orderId = String(pendingSource.id || pendingSource.orderId || `ORD-${Date.now()}`);
  const orderNumber =
    Number(pendingSource.orderNumber || pendingSource.number || parseOrderNumberFromId(orderId) || fallbackOrderNumber) ||
    fallbackOrderNumber;
  const total = Number(
    pendingSource.total ||
      items.reduce((sum, item) => sum + Number(item.total || item.price * item.quantity || 0), 0)
  );

  return {
    id: orderId,
    orderNumber,
    status: String(pendingSource.status || "Pending"),
    deliveryAddress: String(
      pendingSource.deliveryAddress ||
        pendingSource.address ||
        pendingSource.delivery ||
        dashboardData.onboarding?.address ||
        ""
    ).trim(),
    placedAt: String(pendingSource.placedAt || pendingSource.date || pendingSource.createdAt || new Date().toISOString()),
    total,
    items,
  };
}

const storedBuyerDashboardState = readBuyerDashboardStateFromStorage();
const storedPendingCheckout = readPendingCheckoutFromStorage();
const dashboardData = mergeFinalCheckoutData(
  mergeFinalCheckoutData(fallbackBuyerDashboardData, backendBuyerDashboardData),
  storedBuyerDashboardState || {}
);

const normalisedProducts = normalizeProducts(dashboardData.products);
const productMap = new Map(normalisedProducts.map((product) => [product.id, product]));
const queryOrderId = new URLSearchParams(window.location.search).get("orderId") || "";
const pendingCheckoutCandidates = [dashboardData.pendingCheckout, storedPendingCheckout, fallbackBuyerDashboardData.pendingCheckout].filter(Boolean);
const matchedPendingCheckout = queryOrderId
  ? [
      ...pendingCheckoutCandidates,
      ...(Array.isArray(dashboardData.orders) ? dashboardData.orders : []),
    ].find((candidate) => String(candidate.id || candidate.orderId || "") === queryOrderId) ||
    pendingCheckoutCandidates[0] ||
    null
  : pendingCheckoutCandidates[0] || null;
let pendingCheckout = normalizePendingCheckout(
  matchedPendingCheckout,
  productMap,
  normalizeCartItems(dashboardData.cart),
  Array.isArray(dashboardData.orders) ? dashboardData.orders.length + 1 : 1
);

const elements = {
  orderTitle: document.getElementById("order-title"),
  orderIntro: document.getElementById("order-intro"),
  orderStatus: document.getElementById("order-status"),
  orderAddress: document.getElementById("order-address"),
  orderTotal: document.getElementById("order-total"),
  orderPlaced: document.getElementById("order-placed"),
  orderItemCount: document.getElementById("order-item-count"),
  itemsCount: document.getElementById("items-count"),
  orderItems: document.getElementById("order-items"),
  payNowButton: document.getElementById("pay-now-button"),
  cancelOrderButton: document.getElementById("cancel-order-button"),
  paymentNote: document.getElementById("payment-note"),
  routeLinks: Array.from(document.querySelectorAll("[data-route]")),
};

function persistBuyerDashboardState() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(
      BUYER_DASHBOARD_STATE_KEY,
      JSON.stringify({
        brand: dashboardData.brand,
        brandTag: dashboardData.brandTag,
        currency: dashboardData.currency,
        buyer: dashboardData.buyer,
        onboarding: dashboardData.onboarding,
        products: normalisedProducts,
        cart: dashboardData.cart,
        orders: dashboardData.orders,
        pendingCheckout,
      })
    );

    if (pendingCheckout) {
      window.sessionStorage.setItem(BUYER_PENDING_CHECKOUT_KEY, JSON.stringify(pendingCheckout));
    } else {
      window.sessionStorage.removeItem(BUYER_PENDING_CHECKOUT_KEY);
    }
  } catch (error) {
    // Ignore storage failures; the page still renders from the current session.
  }
}

function updateHeaderState() {
  document.title = `${dashboardData.brand || "OPS"} | Final Checkout`;

  if (elements.orderIntro) {
    const buyerName = dashboardData.buyer?.fullName || dashboardData.buyer?.name || "Buyer";
    elements.orderIntro.textContent = `Review your order one last time before Paystack opens, ${buyerName}.`;
  }
}

function getOrderNumberText() {
  return `Order #${pendingCheckout.orderNumber || parseOrderNumberFromId(pendingCheckout.id) || 1}`;
}

function renderItems() {
  if (!elements.orderItems) {
    return;
  }

  if (!pendingCheckout.items.length) {
    elements.orderItems.innerHTML = `
      <li class="empty-state">
        <strong>No items found</strong>
        <span>This checkout is waiting for an order payload from the backend.</span>
      </li>
    `;
    return;
  }

  elements.orderItems.innerHTML = pendingCheckout.items
    .map((item) => {
      const quantity = Math.max(1, Number(item.quantity || 1));
      const lineTotal = Number(item.total || item.price * quantity || 0);

      return `
        <li class="order-item">
          <div>
            <p class="order-item__title">${escapeHtml(item.name || "Item")}</p>
            <p class="order-item__meta">Qty ${quantity}</p>
          </div>
          <div class="order-item__price">${escapeHtml(formatCurrency(lineTotal))}</div>
        </li>
      `;
    })
    .join("");
}

function renderCheckoutDetail() {
  updateHeaderState();

  if (elements.orderTitle) {
    elements.orderTitle.textContent = getOrderNumberText();
  }

  if (elements.orderStatus) {
    elements.orderStatus.textContent = pendingCheckout.status || "Pending";
  }

  if (elements.orderAddress) {
    elements.orderAddress.textContent = pendingCheckout.deliveryAddress || dashboardData.onboarding?.address || "—";
  }

  if (elements.orderTotal) {
    elements.orderTotal.textContent = formatCurrency(pendingCheckout.total || 0);
  }

  if (elements.orderPlaced) {
    elements.orderPlaced.textContent = formatDateTime(pendingCheckout.placedAt || new Date().toISOString());
  }

  if (elements.orderItemCount) {
    const count = pendingCheckout.items.reduce((total, item) => total + Number(item.quantity || 0), 0);
    elements.orderItemCount.textContent = `${count} item${count === 1 ? "" : "s"}`;
  }

  if (elements.itemsCount) {
    const count = pendingCheckout.items.reduce((total, item) => total + Number(item.quantity || 0), 0);
    elements.itemsCount.textContent = `${count} item${count === 1 ? "" : "s"}`;
  }

  if (elements.payNowButton) {
    elements.payNowButton.textContent = `Pay Now — ${formatCurrency(pendingCheckout.total || 0)}`;
    elements.payNowButton.disabled = !pendingCheckout.items.length;
  }

  renderItems();
}

function showPaymentNote(message) {
  if (!elements.paymentNote) {
    return;
  }

  elements.paymentNote.textContent = message;
  elements.paymentNote.hidden = false;
}

function startPaystackHandoff() {
  if (!pendingCheckout.items.length) {
    showPaymentNote("There are no items in this checkout yet.");
    return;
  }

  if (PAYSTACK_INITIALIZE_URL) {
    const separator = PAYSTACK_INITIALIZE_URL.includes("?") ? "&" : "?";
    window.location.href = `${PAYSTACK_INITIALIZE_URL}${separator}orderId=${encodeURIComponent(pendingCheckout.id)}`;
    return;
  }

  showPaymentNote("Paystack handoff is ready for the backend engineer to connect.");
}

function restoreCartFromPendingCheckout() {
  return pendingCheckout.items.map((item) => ({
    productId: item.productId,
    quantity: Math.max(1, Number(item.quantity || 1)),
  }));
}

function cancelPendingCheckout() {
  if (!pendingCheckout) {
    window.location.href = BUYER_ORDERS_PAGE_URL;
    return;
  }

  dashboardData.cart = restoreCartFromPendingCheckout();
  pendingCheckout = null;
  dashboardData.pendingCheckout = null;

  persistBuyerDashboardState();
  window.location.href = BUYER_ORDERS_PAGE_URL;
}

function handleRouteClick(event) {
  const route = String(event.currentTarget.dataset.route || "");

  if (route === "payments:paystack_initialize") {
    event.preventDefault();
    startPaystackHandoff();
    return;
  }

  if (route === "orders:buyer_order_cancel") {
    event.preventDefault();
    cancelPendingCheckout();
    return;
  }

  if (route === "orders:buyer_order_list") {
    event.preventDefault();
    window.location.href = BUYER_ORDERS_PAGE_URL;
    return;
  }

  event.preventDefault();

  if (route === "products:product_list") {
    window.location.href = BUYER_PRODUCTS_PAGE_URL;
    return;
  }

  if (route === "orders:cart_detail") {
    window.location.href = BUYER_CART_PAGE_URL;
    return;
  }

  if (route === "accounts:logout") {
    try {
      window.sessionStorage.removeItem(BUYER_DASHBOARD_STATE_KEY);
      window.sessionStorage.removeItem(BUYER_PENDING_CHECKOUT_KEY);
      window.sessionStorage.removeItem("buyerDashboardState");
      window.sessionStorage.removeItem("buyerDashboardHandoff");
    } catch (error) {
      // Ignore storage failures.
    }

    window.location.href = BUYER_LOGOUT_PAGE_URL;
  }
}

function bindEvents() {
  elements.routeLinks.forEach((link) => link.addEventListener("click", handleRouteClick));

  if (elements.payNowButton) {
    elements.payNowButton.addEventListener("click", handleRouteClick);
  }

  if (elements.cancelOrderButton) {
    elements.cancelOrderButton.addEventListener("click", handleRouteClick);
  }
}

persistBuyerDashboardState();
renderCheckoutDetail();
bindEvents();
