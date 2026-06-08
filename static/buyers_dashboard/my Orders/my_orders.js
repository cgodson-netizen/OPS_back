const backendBuyerDashboardData =
  (typeof window !== "undefined" &&
    (window.__BUYER_DASHBOARD__ || window.buyerDashboardData || window.__OPS_BUYER_DASHBOARD__)) ||
  {};

const BUYER_DASHBOARD_STATE_KEY = "opsBuyerDashboardState";
const BUYER_PRODUCTS_PAGE_URL = "../buyersDashboard.html";
const BUYER_CART_PAGE_URL = "../My Cart/my_cart.html";

const fallbackBuyerDashboardData = {
  brand: "OPS",
  brandTag: "My orders",
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
      id: "minimal-pleat-dress",
      title: "Minimal Pleat Dress",
      category: "women",
      badge: "New",
      price: 72,
      oldPrice: 89,
      rating: 4.8,
      reviews: 142,
      description: "A soft, elegant piece that works for everyday styling or evenings out.",
      tags: ["new"],
    },
    {
      id: "structured-blazer",
      title: "Structured Blazer",
      category: "women",
      badge: "Best",
      price: 96,
      oldPrice: 120,
      rating: 4.9,
      reviews: 105,
      description: "Sharp tailoring with a modern edge for polished everyday dressing.",
      tags: ["best"],
    },
  ],
  cart: [
    { productId: "soft-knit-hoodie", quantity: 1 },
    { productId: "everyday-leather-tote", quantity: 2 },
  ],
  orders: [
    {
      id: "ORD-1048",
      productId: "minimal-pleat-dress",
      status: "Delivered",
      total: 72,
      date: "2026-06-03",
    },
    {
      id: "ORD-1049",
      productId: "everyday-leather-tote",
      status: "In transit",
      total: 46,
      date: "2026-06-04",
    },
    {
      id: "ORD-1050",
      productId: "structured-blazer",
      status: "Processing",
      total: 96,
      date: "2026-06-05",
    },
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

function mergeOrdersPageData(fallback, incoming) {
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
    orders: Array.isArray(source.orders) ? source.orders : fallback.orders,
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

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
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

function normalizeOrderItems(items) {
  return (items || []).map((entry, index) => {
    const productId = String(entry.productId || entry.id || entry.product?.id || `order-${index + 1}`);
    return {
      ...entry,
      id: String(entry.id || `ORD-${1000 + index}`),
      productId,
      status: String(entry.status || "Processing"),
      total: Number(entry.total || entry.amount || 0),
      date: entry.date || entry.createdAt || "",
    };
  });
}

const storedBuyerDashboardState = readBuyerDashboardStateFromStorage();
const dashboardData = mergeOrdersPageData(
  mergeOrdersPageData(fallbackBuyerDashboardData, backendBuyerDashboardData),
  storedBuyerDashboardState || {}
);

const normalisedProducts = normalizeProducts(dashboardData.products);
const productMap = new Map(normalisedProducts.map((product) => [product.id, product]));
const orderItems = normalizeOrderItems(dashboardData.orders);

const elements = {
  ordersCount: document.getElementById("orders-count"),
  ordersSummary: document.getElementById("orders-summary"),
  ordersBody: document.getElementById("orders-body"),
  logoutAvatar: document.getElementById("logout-avatar"),
  topnavLinks: Array.from(document.querySelectorAll(".nav-link")),
  routeLinks: Array.from(document.querySelectorAll("[data-route]")),
};

function getProductById(productId) {
  return productMap.get(String(productId));
}

function getCategoryLabel(product) {
  return String(product?.categoryLabel || product?.category || "General");
}

function getProductName(product) {
  return String(product?.title || product?.name || "Product");
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
        cart: dashboardData.cart,
        orders: orderItems,
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

  document.title = `${dashboardData.brand || "OPS"} | My Orders`;
}

function renderOrdersSummary() {
  if (!elements.ordersSummary) {
    return;
  }

  const totalOrders = orderItems.length;
  const delivered = orderItems.filter((order) => getStatusClass(order.status) === "delivered").length;
  const progress = orderItems.filter((order) => getStatusClass(order.status) === "progress").length;

  if (elements.ordersCount) {
    elements.ordersCount.textContent = `${totalOrders} order${totalOrders === 1 ? "" : "s"}`;
  }

  elements.ordersSummary.innerHTML = `
    <article class="summary-card">
      <p class="summary-card__label">Orders</p>
      <p class="summary-card__value">${totalOrders}</p>
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

function renderOrdersBody() {
  if (!elements.ordersBody) {
    return;
  }

  if (!orderItems.length) {
    elements.ordersBody.innerHTML = `
      <tr>
        <td colspan="5">
          <div class="empty-state">
            <strong>No orders yet</strong>
            <span>Your completed purchases will appear here once checkout starts flowing through the backend.</span>
            <a class="empty-state__action button button-primary" href="../buyersDashboard.html" data-route="products:product_list">
              Start shopping
            </a>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  elements.ordersBody.innerHTML = orderItems
    .map((order, index) => {
      const product = getProductById(order.productId);
      const name = getProductName(product) || order.title || "Unknown product";
      const category = getCategoryLabel(product) || order.category || "";
      const image = product?.image || createArtwork({ title: name }, index);
      const statusClass = getStatusClass(order.status);

      return `
        <tr>
          <td>${escapeHtml(order.id)}</td>
          <td>
            <div class="table-product">
              <div class="table-thumb">
                <img src="${escapeHtml(image)}" alt="${escapeHtml(name)}" />
              </div>
              <div class="table-name">
                <strong>${escapeHtml(name)}</strong>
                <span>${escapeHtml(category)}</span>
              </div>
            </div>
          </td>
          <td>
            <span class="status-pill status-pill--${escapeHtml(statusClass)}">${escapeHtml(order.status)}</span>
          </td>
          <td class="table-amount">${escapeHtml(formatCurrency(order.total || product?.price || 0))}</td>
          <td class="table-cell-muted">${escapeHtml(formatDate(order.date))}</td>
        </tr>
      `;
    })
    .join("");
}

function renderOrdersPage() {
  updateBrandContent();
  renderOrdersSummary();
  renderOrdersBody();
  persistBuyerDashboardState();
}

function setNavState() {
  elements.topnavLinks.forEach((link) => {
    const route = String(link.dataset.route || "");
    const isActive = route === "orders:buyer_order_list";

    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function handleRouteClick(event) {
  const route = String(event.currentTarget.dataset.route || "");

  if (route === "orders:buyer_order_list") {
    event.preventDefault();
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

  if (route === "orders:cart_detail") {
    window.location.href = "../My Cart/my_cart.html";
    return;
  }

  if (route === "products:product_list") {
    window.location.href = "../buyersDashboard.html";
  }
}

function bindEvents() {
  elements.routeLinks.forEach((link) => link.addEventListener("click", handleRouteClick));
}

bindEvents();
setNavState();
renderOrdersPage();
