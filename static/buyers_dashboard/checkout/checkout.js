const backendBuyerDashboardData =
  (typeof window !== "undefined" &&
    (window.__BUYER_DASHBOARD__ || window.buyerDashboardData || window.__OPS_BUYER_DASHBOARD__)) ||
  {};

const BUYER_DASHBOARD_STATE_KEY = "opsBuyerDashboardState";
const BUYER_PENDING_CHECKOUT_KEY = "opsBuyerPendingCheckout";
const BUYER_PRODUCTS_PAGE_URL = "../buyersDashboard.html";
const BUYER_CART_PAGE_URL = "../My Cart/my_cart.html";
const BUYER_ORDERS_PAGE_URL = "../my Orders/my_orders.html";
const BUYER_FINAL_CHECKOUT_PAGE_URL = "./finalcheckout/finalcheckout.html";
const BUYER_LOGOUT_PAGE_URL = "../../index.html";

const fallbackBuyerDashboardData = {
  brand: "OPS",
  brandTag: "Checkout",
  currency: "GHS",
  buyer: {
    fullName: "Ama Mensah",
    initials: "AM",
  },
  onboarding: {
    address: "",
    city: "",
  },
  products: [
    {
      id: "soft-knit-hoodie",
      title: "Soft Knit Hoodie",
      category: "women",
      badge: "New",
      price: 54,
      oldPrice: 68,
      rating: 4.9,
      reviews: 128,
      description: "Clean layering piece with a relaxed drape and a premium hand feel.",
      tags: ["new", "best"],
    },
    {
      id: "everyday-leather-tote",
      title: "Everyday Leather Tote",
      category: "accessories",
      badge: "Sale",
      price: 46,
      oldPrice: 59,
      rating: 4.7,
      reviews: 76,
      description: "Minimal carryall with room for daily essentials and a slim silhouette.",
      tags: ["sale"],
    },
    {
      id: "amber-candle-set",
      title: "Amber Candle Set",
      category: "home",
      badge: "New",
      price: 24,
      oldPrice: 32,
      rating: 4.8,
      reviews: 67,
      description: "Warm fragrance tones paired with a simple sculptural finish.",
      tags: ["new"],
    },
  ],
  cart: [
    { productId: "soft-knit-hoodie", quantity: 1 },
    { productId: "everyday-leather-tote", quantity: 2 },
    { productId: "amber-candle-set", quantity: 1 },
  ],
  orders: [],
  pendingCheckout: null,
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

function mergeCheckoutPageData(fallback, incoming) {
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

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value || "");
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
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
          productId: String(item.productId || item.id || ""),
          quantity: Math.max(1, Number(item.quantity || 1)),
        }))
        .filter((item) => item.productId)
    : [];
}

function normalizeOrderItems(items) {
  return Array.isArray(items)
    ? items
        .filter((item) => item && typeof item === "object")
        .map((item, index) => ({
          id: String(item.id || `ORD-${index + 1}`),
          productId: String(item.productId || item.id || ""),
          status: String(item.status || "Processing"),
          total: Number(item.total || 0),
          date: String(item.date || new Date().toISOString()),
        }))
        .filter((item) => item.productId)
    : [];
}

function normalizeCheckoutItems(items) {
  return Array.isArray(items)
    ? items
        .filter((item) => item && typeof item === "object")
        .map((item, index) => {
          const quantity = Math.max(1, Number(item.quantity || item.qty || 1));
          const price = Number(item.price ?? 0);
          const total = Number(item.total ?? price * quantity);

          return {
            productId: String(item.productId || item.id || item.product?.id || `item-${index + 1}`),
            name: String(item.name || item.title || item.product?.name || item.product?.title || `Item ${index + 1}`),
            quantity,
            price,
            total,
          };
        })
    : [];
}

const storedBuyerDashboardState = readBuyerDashboardStateFromStorage();
const storedPendingCheckout = readPendingCheckoutFromStorage();
const dashboardData = mergeCheckoutPageData(
  mergeCheckoutPageData(fallbackBuyerDashboardData, backendBuyerDashboardData),
  storedBuyerDashboardState || {}
);

const products = normalizeProducts(dashboardData.products);
const productMap = new Map(products.map((product) => [product.id, product]));
let cartItems = normalizeCartItems(dashboardData.cart);
let orderItems = normalizeOrderItems(dashboardData.orders);
let pendingCheckout = null;

const incomingPendingCheckout = storedBuyerDashboardState?.pendingCheckout || storedPendingCheckout;
if (incomingPendingCheckout && typeof incomingPendingCheckout === "object") {
  const normalizedItems = normalizeCheckoutItems(incomingPendingCheckout.items);
  const pendingTotal = normalizedItems.reduce((total, item) => total + Number(item.total || 0), 0);
  pendingCheckout = {
    id: String(incomingPendingCheckout.id || `ORD-${Date.now()}`),
    orderNumber: Number(incomingPendingCheckout.orderNumber || incomingPendingCheckout.number || orderItems.length + 1),
    status: String(incomingPendingCheckout.status || "Pending"),
    deliveryAddress: String(incomingPendingCheckout.deliveryAddress || incomingPendingCheckout.address || ""),
    placedAt: String(incomingPendingCheckout.placedAt || incomingPendingCheckout.date || new Date().toISOString()),
    total: Number(incomingPendingCheckout.total || pendingTotal),
    items: normalizedItems,
  };
}

const elements = {
  checkoutForm: document.getElementById("checkout-form"),
  deliveryAddress: document.getElementById("delivery-address"),
  deliveryError: document.getElementById("delivery-error"),
  summaryList: document.getElementById("summary-list"),
  summaryCount: document.getElementById("summary-count"),
  summaryTotal: document.getElementById("summary-total"),
  checkoutIntro: document.getElementById("checkout-intro"),
  deliveryNote: document.getElementById("delivery-note"),
  placeOrderButton: document.getElementById("place-order-button"),
  routeLinks: Array.from(document.querySelectorAll("[data-route]")),
};

function getProductById(productId) {
  return productMap.get(String(productId || "")) || null;
}

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
        products,
        cart: cartItems,
        orders: orderItems,
        pendingCheckout,
      })
    );

    if (pendingCheckout) {
      window.sessionStorage.setItem(BUYER_PENDING_CHECKOUT_KEY, JSON.stringify(pendingCheckout));
    } else {
      window.sessionStorage.removeItem(BUYER_PENDING_CHECKOUT_KEY);
    }
  } catch (error) {
    // Ignore storage failures; the checkout still works for the current session.
  }
}

function updateHeaderState() {
  const buyerName = dashboardData.buyer?.fullName || dashboardData.buyer?.name || "Buyer";

  if (elements.deliveryNote) {
    const city = String(dashboardData.onboarding?.city || "").trim();
    const address = String(dashboardData.onboarding?.address || "").trim();

    if (address || city) {
      const locationBits = [address, city].filter(Boolean).join(" · ");
      elements.deliveryNote.textContent = `Prefill from onboarding: ${locationBits}`;
    } else {
      elements.deliveryNote.textContent = "Use the address you want this order delivered to.";
    }
  }

  document.title = `${dashboardData.brand || "OPS"} | Checkout`;

  if (elements.deliveryAddress && dashboardData.onboarding?.address) {
    elements.deliveryAddress.value = dashboardData.onboarding.address;
  }

  if (elements.deliveryAddress && !elements.deliveryAddress.value && dashboardData.onboarding?.city) {
    elements.deliveryAddress.placeholder = `Enter your delivery address in ${dashboardData.onboarding.city}`;
  }

  if (elements.checkoutIntro) {
    elements.checkoutIntro.textContent = `Review your items and finish the order, ${buyerName}.`;
  }
}

function renderOrderSummary() {
  if (!elements.summaryList || !elements.summaryCount || !elements.summaryTotal) {
    return;
  }

  const itemCount = cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0);
  const subtotal = cartItems.reduce((total, item) => {
    const product = getProductById(item.productId);
    const price = Number(product?.price ?? item.price ?? 0);
    return total + price * Number(item.quantity || 1);
  }, 0);

  elements.summaryCount.textContent = `${itemCount} item${itemCount === 1 ? "" : "s"}`;
  elements.summaryTotal.textContent = escapeHtml(formatCurrency(subtotal));

  if (!cartItems.length) {
    elements.summaryList.innerHTML = `
      <li class="empty-summary">
        <strong>Your cart is empty</strong>
        <span>Go back to the cart to add products before checking out.</span>
      </li>
    `;
    return;
  }

  elements.summaryList.innerHTML = cartItems
    .map((item) => {
      const product = getProductById(item.productId);
      const title = product?.title || "Product";
      const quantity = Math.max(1, Number(item.quantity || 1));
      const price = Number(product?.price ?? item.price ?? 0);
      const lineTotal = price * quantity;
      const category = product?.category ? `${String(product.category).replace(/-/g, " ")} · ` : "";

      return `
        <li class="summary-item">
          <div>
            <p class="summary-item__title">${escapeHtml(title)}</p>
            <p class="summary-item__meta">${escapeHtml(category)}Qty ${quantity}</p>
          </div>
          <div class="summary-item__price">${escapeHtml(formatCurrency(lineTotal))}</div>
        </li>
      `;
    })
    .join("");
}

function updateSubmitState() {
  const hasItems = cartItems.length > 0;

  if (elements.placeOrderButton) {
    elements.placeOrderButton.disabled = !hasItems;
    elements.placeOrderButton.textContent = hasItems ? "Place Order" : "Cart is empty";
  }

  if (elements.deliveryAddress) {
    elements.deliveryAddress.disabled = !hasItems;
  }
}

function clearError() {
  if (elements.deliveryAddress) {
    elements.deliveryAddress.removeAttribute("aria-invalid");
  }

  if (elements.deliveryError) {
    elements.deliveryError.style.display = "none";
  }
}

function showError(message) {
  if (elements.deliveryError) {
    elements.deliveryError.textContent = message;
    elements.deliveryError.style.display = "block";
  }

  if (elements.deliveryAddress) {
    elements.deliveryAddress.setAttribute("aria-invalid", "true");
  }
}

function handleRouteClick(event) {
  const route = String(event.currentTarget.dataset.route || "");

  if (route === "orders:checkout") {
    event.preventDefault();
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

  if (route === "orders:buyer_order_list") {
    window.location.href = BUYER_ORDERS_PAGE_URL;
    return;
  }

  if (route === "accounts:logout") {
    try {
      window.sessionStorage.removeItem(BUYER_DASHBOARD_STATE_KEY);
      window.sessionStorage.removeItem("buyerDashboardState");
      window.sessionStorage.removeItem("buyerDashboardHandoff");
    } catch (error) {
      // Ignore storage failures.
    }

    window.location.href = BUYER_LOGOUT_PAGE_URL;
  }
}

function placeOrder() {
  const deliveryAddress = elements.deliveryAddress ? elements.deliveryAddress.value.trim() : "";

  clearError();

  if (!cartItems.length) {
    showError("Your cart is empty. Add items before placing an order.");
    return;
  }

  if (!deliveryAddress) {
    showError("Please enter a delivery address.");
    return;
  }

  const placedAt = new Date();
  const checkoutItems = cartItems.map((item, index) => {
    const product = getProductById(item.productId);
    const quantity = Math.max(1, Number(item.quantity || 1));
    const price = Number(product?.price ?? item.price ?? 0);

    return {
      productId: item.productId,
      name: product?.title || product?.name || `Item ${index + 1}`,
      quantity,
      price,
      total: price * quantity,
    };
  });

  pendingCheckout = {
    id: `ORD-${placedAt.getTime()}`,
    orderNumber: orderItems.length + 1,
    status: "Pending",
    deliveryAddress,
    placedAt: placedAt.toISOString(),
    total: checkoutItems.reduce((total, item) => total + Number(item.total || 0), 0),
    items: checkoutItems,
  };

  cartItems = [];
  dashboardData.cart = cartItems;
  dashboardData.pendingCheckout = pendingCheckout;

  persistBuyerDashboardState();
  renderOrderSummary();
  updateSubmitState();

  if (elements.placeOrderButton) {
    elements.placeOrderButton.disabled = true;
    elements.placeOrderButton.textContent = "Opening final checkout...";
  }

  setTimeout(() => {
    window.location.href = `${BUYER_FINAL_CHECKOUT_PAGE_URL}?orderId=${encodeURIComponent(pendingCheckout.id)}`;
  }, 350);
}

function bindEvents() {
  if (elements.checkoutForm) {
    elements.checkoutForm.addEventListener("submit", (event) => {
      event.preventDefault();
      placeOrder();
    });
  }

  elements.routeLinks.forEach((link) => link.addEventListener("click", handleRouteClick));
}

updateHeaderState();
renderOrderSummary();
updateSubmitState();
bindEvents();
persistBuyerDashboardState();
