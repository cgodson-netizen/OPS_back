const backendBuyerDashboardData =
  (typeof window !== "undefined" &&
    (window.__BUYER_DASHBOARD__ || window.buyerDashboardData || window.__OPS_BUYER_DASHBOARD__)) ||
  {};

const BUYER_DASHBOARD_STATE_KEY = "opsBuyerDashboardState";

const fallbackBuyerDashboardData = {
  brand: "OPS",
  brandTag: "My cart",
  currency: "GHS",
  buyer: {
    fullName: "Ama Mensah",
    initials: "AM",
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
      id: "tailored-utility-jacket",
      title: "Tailored Utility Jacket",
      category: "men",
      badge: "Best",
      price: 88,
      oldPrice: 112,
      rating: 4.8,
      reviews: 94,
      description: "Structured and versatile with a modern streetwear profile.",
      tags: ["best"],
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

function mergeCartPageData(fallback, incoming) {
  const source = incoming && typeof incoming === "object" ? incoming : {};

  return {
    ...fallback,
    ...source,
    buyer: {
      ...fallback.buyer,
      ...(source.buyer || source.user || {}),
    },
    products: Array.isArray(source.products) ? source.products : fallback.products,
    cart: Array.isArray(source.cart) ? source.cart : fallback.cart,
  };
}

function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
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

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value || 0));
}

function createArtwork(product, index) {
  const palettes = [
    ["#f2f2f2", "#d9d9d9", "#9a9a9a", "#111111"],
    ["#f7f5f0", "#e2d9ca", "#b79a79", "#3c2f2f"],
    ["#f0f4f7", "#cfdbe2", "#95a8b8", "#223044"],
    ["#f6f1f4", "#ead3dc", "#c08aa5", "#412133"],
  ];

  const palette = palettes[index % palettes.length];
  const initials = String(product.title || "OPS")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="700" height="700" viewBox="0 0 700 700" fill="none">
      <defs>
        <linearGradient id="bg${index}" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${palette[0]}" />
          <stop offset="100%" stop-color="${palette[1]}" />
        </linearGradient>
      </defs>
      <rect width="700" height="700" rx="56" fill="url(#bg${index})" />
      <circle cx="510" cy="190" r="118" fill="${palette[2]}" opacity="0.26" />
      <circle cx="188" cy="514" r="142" fill="${palette[3]}" opacity="0.13" />
      <rect x="168" y="192" width="364" height="356" rx="42" fill="#ffffff" fill-opacity="0.36" />
      <text x="350" y="386" text-anchor="middle" fill="${palette[3]}" font-family="Arial, Helvetica, sans-serif" font-size="118" font-weight="700" letter-spacing="8">${initials}</text>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function normalizeProducts(products) {
  return (products || []).map((product, index) => {
    const title = String(product.title || product.name || `Product ${index + 1}`);
    const categoryLabel = String(product.categoryLabel || product.category || "General");
    const categorySlug = slugify(product.categorySlug || product.category || categoryLabel || "general");
    const price = Number(product.price || 0);
    const oldPrice = Number(product.oldPrice || Math.max(Math.round(price * 1.2), price + 10));
    const rating = Number(product.rating || 4.8);
    const reviews = Number(product.reviews || 100);
    const tags = Array.isArray(product.tags) ? product.tags.map((tag) => slugify(tag)) : [];
    const badge = String(
      product.badge ||
        (tags.includes("sale") ? "Sale" : tags.includes("new") ? "New" : tags.includes("best") ? "Best" : "")
    ).trim();

    return {
      ...product,
      id: String(product.id || slugify(title) || `product-${index + 1}`),
      title,
      categoryLabel,
      categorySlug,
      price,
      oldPrice,
      rating,
      reviews,
      tags,
      badge,
      description: String(product.description || ""),
      image: product.image || createArtwork({ title }, index),
    };
  });
}

function normalizeCartItems(items) {
  return (items || []).map((entry, index) => {
    const productId = String(entry.productId || entry.id || entry.product?.id || `cart-${index + 1}`);
    return {
      ...entry,
      productId,
      quantity: Math.max(1, Number(entry.quantity || entry.qty || 1)),
    };
  });
}

const storedBuyerDashboardState = readBuyerDashboardStateFromStorage();
const dashboardData = mergeCartPageData(
  mergeCartPageData(fallbackBuyerDashboardData, backendBuyerDashboardData),
  storedBuyerDashboardState || {}
);

let cartItems = normalizeCartItems(dashboardData.cart);
const normalisedProducts = normalizeProducts(dashboardData.products);
const productMap = new Map(normalisedProducts.map((product) => [product.id, product]));

const elements = {
  cartCount: document.getElementById("cart-count"),
  cartSummary: document.getElementById("cart-summary"),
  cartBody: document.getElementById("cart-body"),
  checkoutLink: document.getElementById("checkout-link"),
  logoutAvatar: document.getElementById("logout-avatar"),
  topnavLinks: Array.from(document.querySelectorAll(".nav-link")),
  routeLinks: Array.from(document.querySelectorAll("[data-route]")),
};

function getProductById(productId) {
  return productMap.get(String(productId));
}

function getProductName(product) {
  return String(product?.title || product?.name || "Product");
}

function getCategoryLabel(product) {
  return String(product?.categoryLabel || product?.category || "General");
}

function getStatusClass(status) {
  const value = String(status || "").toLowerCase();

  if (value.includes("deliver")) {
    return "delivered";
  }

  if (value.includes("transit") || value.includes("shipping") || value.includes("progress")) {
    return "progress";
  }

  if (value.includes("cancel") || value.includes("return")) {
    return "cancelled";
  }

  return "pending";
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
        products: normalisedProducts,
        cart: cartItems,
      })
    );
  } catch (error) {
    // Ignore storage failures; the page still renders from the current state.
  }
}

function updateBrandContent() {
  const buyerName = dashboardData.buyer?.fullName || dashboardData.buyer?.name || "Buyer";
  const initials = dashboardData.buyer?.initials || getInitials(buyerName);

  if (elements.logoutAvatar) {
    elements.logoutAvatar.textContent = initials;
  }

  document.title = `${dashboardData.brand || "OPS"} | My Cart`;
}

function updateCheckoutState() {
  if (!elements.checkoutLink) {
    return;
  }

  const hasItems = cartItems.length > 0;
  elements.checkoutLink.classList.toggle("is-disabled", !hasItems);
  elements.checkoutLink.setAttribute("aria-disabled", String(!hasItems));
  elements.checkoutLink.href = hasItems ? "../checkout/checkout.html" : "#";
}

function renderCartSummary() {
  if (!elements.cartSummary) {
    return;
  }

  const itemCount = cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0);
  const subtotal = cartItems.reduce((total, item) => {
    const product = getProductById(item.productId);
    const price = Number(product?.price ?? item.price ?? 0);
    return total + price * Number(item.quantity || 1);
  }, 0);
  const savings = cartItems.reduce((total, item) => {
    const product = getProductById(item.productId);
    const price = Number(product?.price ?? item.price ?? 0);
    const oldPrice = Number(product?.oldPrice ?? item.oldPrice ?? price);
    return total + Math.max(0, oldPrice - price) * Number(item.quantity || 1);
  }, 0);

  if (elements.cartCount) {
    elements.cartCount.textContent = `${formatNumber(itemCount)} item${itemCount === 1 ? "" : "s"}`;
  }

  elements.cartSummary.innerHTML = `
    <article class="summary-card">
      <p class="summary-card__label">Items in cart</p>
      <p class="summary-card__value">${formatNumber(itemCount)}</p>
      <p class="summary-card__detail">Everything ready for a smooth checkout.</p>
    </article>
    <article class="summary-card">
      <p class="summary-card__label">Subtotal</p>
      <p class="summary-card__value">${escapeHtml(formatCurrency(subtotal))}</p>
      <p class="summary-card__detail">Before shipping, discounts, or taxes.</p>
    </article>
    <article class="summary-card">
      <p class="summary-card__label">Savings</p>
      <p class="summary-card__value">${escapeHtml(formatCurrency(savings))}</p>
      <p class="summary-card__detail">Estimated savings versus listed price.</p>
    </article>
  `;
}

function renderCartBody() {
  if (!elements.cartBody) {
    return;
  }

  if (!cartItems.length) {
    elements.cartBody.innerHTML = `
      <tr>
        <td colspan="5">
          <div class="cart-empty">
            <strong>Your cart is empty</strong>
            <p>Add a few products from the catalog to start building your order.</p>
            <a class="button button-primary" href="../buyersDashboard.html" data-route="products:product_list">
              Start shopping
            </a>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  elements.cartBody.innerHTML = cartItems
    .map((item, index) => {
      const product = getProductById(item.productId);
      const name = getProductName(product) || "Unknown product";
      const category = getCategoryLabel(product) || item.category || "";
      const quantity = Math.max(1, Number(item.quantity || 1));
      const price = Number(product?.price ?? item.price ?? 0);
      const subtotal = price * quantity;
      const image = product?.image || createArtwork({ title: name }, index);

      return `
        <tr>
          <td>
            <div class="table-product">
              <div class="table-thumb">
                <img src="${escapeHtml(image)}" alt="${escapeHtml(name)}" />
              </div>
              <div class="table-name">
                <strong><a class="cart-product-link" href="../buyersDashboard.html" data-route="products:product_list">${escapeHtml(name)}</a></strong>
                <span>${escapeHtml(category)}</span>
              </div>
            </div>
          </td>
          <td>
            <div class="cart-quantity-control">
              <button
                class="cart-quantity-button"
                type="button"
                data-cart-action="decrease"
                data-cart-index="${index}"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                class="cart-quantity-input"
                type="number"
                min="1"
                step="1"
                value="${quantity}"
                data-cart-quantity
                data-cart-index="${index}"
                aria-label="Quantity for ${escapeHtml(name)}"
              />
              <button
                class="cart-quantity-button"
                type="button"
                data-cart-action="increase"
                data-cart-index="${index}"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </td>
          <td class="table-price">${escapeHtml(formatCurrency(price))}</td>
          <td class="table-amount">${escapeHtml(formatCurrency(subtotal))}</td>
          <td>
            <div class="cart-row-actions">
              <button class="cart-remove-link" type="button" data-cart-action="remove" data-cart-index="${index}">
                Remove
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderCheckoutState() {
  updateCheckoutState();
}

function renderCartPage() {
  updateBrandContent();
  renderCartSummary();
  renderCartBody();
  renderCheckoutState();
  persistBuyerDashboardState();
}

function setNavState() {
  elements.topnavLinks.forEach((link) => {
    const route = String(link.dataset.route || "");
    const isActive = route === "orders:cart_detail";

    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function updateCartQuantity(index, nextQuantity) {
  const cartIndex = Number(index);
  if (!Number.isFinite(cartIndex) || cartIndex < 0 || cartIndex >= cartItems.length) {
    return;
  }

  const quantity = clamp(Number(nextQuantity) || 0, 0, 9999);

  if (quantity < 1) {
    cartItems.splice(cartIndex, 1);
  } else {
    cartItems[cartIndex] = {
      ...cartItems[cartIndex],
      quantity,
    };
  }

  renderCartPage();
}

function handleCartAction(event) {
  const control = event.target.closest("[data-cart-action]");

  if (!control) {
    return;
  }

  event.preventDefault();

  const action = String(control.dataset.cartAction || "");
  const index = Number(control.dataset.cartIndex || -1);
  const item = cartItems[index];

  if (!item) {
    return;
  }

  if (action === "increase") {
    updateCartQuantity(index, Number(item.quantity || 1) + 1);
    return;
  }

  if (action === "decrease") {
    updateCartQuantity(index, Number(item.quantity || 1) - 1);
    return;
  }

  if (action === "remove") {
    cartItems.splice(index, 1);
    renderCartPage();
  }
}

function handleCartQuantityChange(event) {
  const input = event.target.closest("[data-cart-quantity]");

  if (!input) {
    return;
  }

  const index = Number(input.dataset.cartIndex || -1);
  updateCartQuantity(index, input.value);
}

function handleRouteClick(event) {
  const route = String(event.currentTarget.dataset.route || "");

  if (route === "orders:cart_detail") {
    event.preventDefault();
    return;
  }

  if (route === "orders:checkout") {
    if (cartItems.length === 0) {
      event.preventDefault();
    }

    return;
  }

  event.preventDefault();

  if (route === "accounts:logout") {
    try {
      window.sessionStorage.removeItem(BUYER_DASHBOARD_STATE_KEY);
      window.sessionStorage.removeItem("buyerDashboardState");
      window.sessionStorage.removeItem("buyerDashboardHandoff");
    } catch (error) {
      // Ignore storage failures.
    }

    window.location.href = "../../index.html";
    return;
  }

  if (route === "products:product_list") {
    window.location.href = "../buyersDashboard.html";
    return;
  }

  if (route === "orders:buyer_order_list") {
    window.location.href = "../my Orders/my_orders.html";
  }
}

function handleCheckoutClick(event) {
  if (cartItems.length > 0) {
    return;
  }

  event.preventDefault();
}

function bindEvents() {
  document.addEventListener("click", handleCartAction);
  document.addEventListener("change", handleCartQuantityChange);
  elements.routeLinks.forEach((link) => link.addEventListener("click", handleRouteClick));

  if (elements.checkoutLink) {
    elements.checkoutLink.addEventListener("click", handleCheckoutClick);
  }
}

bindEvents();
setNavState();
renderCartPage();
