const backendBuyerDashboardData =
  (typeof window !== "undefined" &&
    (window.__BUYER_DASHBOARD__ || window.buyerDashboardData || window.__OPS_BUYER_DASHBOARD__)) ||
  {};

const BUYER_DASHBOARD_STATE_KEY = "opsBuyerDashboardState";
const BUYER_CART_PAGE_URL = "./My Cart/my_cart.html";
const BUYER_ORDERS_PAGE_URL = "./my Orders/my_orders.html";

const fallbackBuyerDashboardData = {
  brand: "OPS",
  brandTag: "Buyer dashboard",
  currency: "GHS",
  buyer: {
    fullName: "Ama Mensah",
    initials: "AM",
  },
  hero: {
    title: "Give All You Need",
    text:
      "Browse the latest drops and keep tabs on your cart from a single polished storefront.",
    image: "../Images/seamstress.png",
    searchPlaceholder: "Search on OPS",
  },
  categories: [
    { id: "all", label: "All Products" },
    { id: "women", label: "Women" },
    { id: "men", label: "Men" },
    { id: "accessories", label: "Accessories" },
    { id: "home", label: "Home" },
  ],
  quickFilters: [
    { id: "all", label: "All Items" },
    { id: "new", label: "New Arrival" },
    { id: "best", label: "Best Seller" },
    { id: "sale", label: "On Discount" },
  ],
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
      id: "relaxed-linen-shirt",
      title: "Relaxed Linen Shirt",
      category: "men",
      badge: "New",
      price: 38,
      oldPrice: 49,
      rating: 4.6,
      reviews: 88,
      description: "Breathable, easy to style, and crisp enough for elevated casual wear.",
      tags: ["new"],
    },
    {
      id: "canvas-court-sneakers",
      title: "Canvas Court Sneakers",
      category: "accessories",
      badge: "Best",
      price: 64,
      oldPrice: 78,
      rating: 4.9,
      reviews: 161,
      description: "A clean everyday trainer with a lightweight build and durable finish.",
      tags: ["best"],
    },
    {
      id: "woven-storage-basket",
      title: "Woven Storage Basket",
      category: "home",
      badge: "Sale",
      price: 29,
      oldPrice: 39,
      rating: 4.7,
      reviews: 52,
      description: "A tidy home essential that keeps spaces organised without visual clutter.",
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
    {
      id: "crochet-bucket-hat",
      title: "Crochet Bucket Hat",
      category: "accessories",
      badge: "New",
      price: 26,
      oldPrice: 34,
      rating: 4.6,
      reviews: 58,
      description: "A soft accessory with texture and an easygoing seasonal look.",
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
    {
      id: "straight-denim-trousers",
      title: "Straight Denim Trousers",
      category: "men",
      badge: "Sale",
      price: 58,
      oldPrice: 74,
      rating: 4.7,
      reviews: 123,
      description: "Clean straight-leg denim with a softened wash and easy fit.",
      tags: ["sale", "best"],
    },
    {
      id: "textured-throw-blanket",
      title: "Textured Throw Blanket",
      category: "home",
      badge: "Best",
      price: 48,
      oldPrice: 61,
      rating: 4.8,
      reviews: 89,
      description: "A cozy finishing layer for the sofa, chair, or bedroom corner.",
      tags: ["best"],
    },
  ],
  cart: [
    { productId: "soft-knit-hoodie", quantity: 1 },
    { productId: "everyday-leather-tote", quantity: 2 },
    { productId: "amber-candle-set", quantity: 1 },
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

function pickArray(source, keys, fallback) {
  for (const key of keys) {
    if (Array.isArray(source?.[key])) {
      return source[key];
    }
  }

  return fallback;
}

function mergeBuyerDashboardData(fallback, incoming) {
  const source = incoming && typeof incoming === "object" ? incoming : {};

  return {
    ...fallback,
    ...source,
    buyer: {
      ...fallback.buyer,
      ...(source.buyer || source.user || {}),
    },
    hero: {
      ...fallback.hero,
      ...(source.hero || {}),
    },
    categories: pickArray(source, ["categories", "categoryList"], fallback.categories),
    quickFilters: pickArray(source, ["quickFilters", "filters", "highlightFilters"], fallback.quickFilters),
    products: pickArray(source, ["products", "productList", "items"], fallback.products),
    cart: pickArray(source, ["cart", "cartItems", "basket"], fallback.cart),
    orders: pickArray(source, ["orders", "orderList", "buyerOrders"], fallback.orders),
  };
}

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
        hero: dashboardData.hero,
        categories: dashboardData.categories,
        quickFilters: dashboardData.quickFilters,
        products: dashboardData.products,
        cart: cartItems,
        orders: orderItems,
      })
    );
  } catch (error) {
    // Ignore storage failures; the UI still renders from the fallback data.
  }
}

const storedBuyerDashboardState = readBuyerDashboardStateFromStorage();
const dashboardData = mergeBuyerDashboardData(
  mergeBuyerDashboardData(fallbackBuyerDashboardData, backendBuyerDashboardData),
  storedBuyerDashboardState || {}
);

const elements = {
  body: document.body,
  dashboardMain: document.getElementById("dashboard-main"),
  overviewSection: document.getElementById("overview-section"),
  detailLayout: document.getElementById("detail-layout"),
  heroGreeting: document.getElementById("hero-greeting"),
  heroTitle: document.getElementById("hero-title"),
  heroText: document.getElementById("hero-text"),
  heroImage: document.querySelector(".hero-image"),
  heroWord: document.getElementById("hero-word"),
  navToggle: document.getElementById("buyer-nav-toggle"),
  navBackdrop: document.getElementById("buyer-nav-backdrop"),
  topnav: document.getElementById("buyer-topnav"),
  productSearchForm: document.getElementById("product-search-form"),
  productSearchInput: document.getElementById("product-search"),
  searchShortcut: document.getElementById("search-shortcut"),
  cartBadge: document.getElementById("cart-badge"),
  logoutAvatar: document.getElementById("logout-avatar"),
  categoryList: document.getElementById("category-list"),
  quickFilterList: document.getElementById("quick-filter-list"),
  catalogSummary: document.getElementById("catalog-summary"),
  productGrid: document.getElementById("product-grid"),
  productPager: document.getElementById("product-pager"),
  cartPanel: document.getElementById("cart-panel"),
  ordersPanel: document.getElementById("orders-panel"),
  cartSummary: document.getElementById("cart-summary"),
  ordersSummary: document.getElementById("orders-summary"),
  cartBody: document.getElementById("cart-body"),
  ordersBody: document.getElementById("orders-body"),
  topnavLinks: Array.from(document.querySelectorAll(".nav-link")),
  routeLinks: Array.from(document.querySelectorAll("[data-route]")),
};

const productsPerPage = 9;
let activeView = "overview";
let activeCategory = "all";
let activeQuickFilter = "all";
let searchQuery = "";
let currentPage = 1;
let cartItems = normalizeCartItems(storedBuyerDashboardState?.cart || dashboardData.cart);
let orderItems = normalizeOrderItems(dashboardData.orders);

const normalisedProducts = normalizeProducts(dashboardData.products);
const productMap = new Map(normalisedProducts.map((product) => [product.id, product]));

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

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function isCompactScreen() {
  const screen = document.documentElement.dataset.screen || "";
  return screen === "tablet" || screen === "phone";
}

function getFirstName(name) {
  const value = String(name || "").trim();
  if (!value) {
    return "Buyer";
  }

  return value.split(/\s+/)[0];
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

function formatReviewCount(value) {
  const amount = Number(value || 0);

  if (amount >= 1000) {
    const rounded = Math.round((amount / 1000) * 10) / 10;
    return `${rounded % 1 === 0 ? rounded.toFixed(0) : rounded}k Reviews`;
  }

  return `${formatNumber(amount)} Reviews`;
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

function createArtwork(product, index) {
  const palettes = [
    ["#f2f2f2", "#d9d9d9", "#9a9a9a", "#111111"],
    ["#f7f5f0", "#e2d9ca", "#b79a79", "#3c2f2f"],
    ["#f0f4f7", "#cfdbe2", "#95a8b8", "#223044"],
    ["#f6f1f4", "#ead3dc", "#c08aa5", "#412133"],
    ["#f1f5f0", "#dbe5d4", "#97ac8d", "#2e4230"],
    ["#f4f0ec", "#e4d7c8", "#c29d7f", "#49362b"],
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
    const badge = String(product.badge || (tags.includes("sale") ? "Sale" : tags.includes("new") ? "New" : tags.includes("best") ? "Best" : "")).trim();

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

function normalizeOrderItems(items) {
  return (items || []).map((entry, index) => {
    const productId = String(entry.productId || entry.id || entry.product?.id || `order-${index + 1}`);
    return {
      ...entry,
      id: String(entry.id || `ORD-${1000 + index}`),
      productId,
      total: Number(entry.total || entry.amount || 0),
      date: entry.date || entry.createdAt || new Date().toISOString(),
      status: String(entry.status || "Processing"),
    };
  });
}

function getProductById(productId) {
  return productMap.get(String(productId));
}

function getCategoryOptions() {
  const source = Array.isArray(dashboardData.categories) && dashboardData.categories.length
    ? dashboardData.categories
    : fallbackBuyerDashboardData.categories;

  const options = source.map((option) => {
    if (typeof option === "string") {
      return {
        id: slugify(option),
        label: option,
      };
    }

    return {
      id: slugify(option.id || option.slug || option.label || option.name),
      label: option.label || option.name || option.title || "Category",
    };
  });

  const categoryMap = new Map();
  options.forEach((option) => {
    if (!categoryMap.has(option.id)) {
      categoryMap.set(option.id, option);
    }
  });

  return Array.from(categoryMap.values());
}

function getQuickFilterOptions() {
  const source = Array.isArray(dashboardData.quickFilters) && dashboardData.quickFilters.length
    ? dashboardData.quickFilters
    : fallbackBuyerDashboardData.quickFilters;

  return source.map((option) => {
    if (typeof option === "string") {
      return {
        id: slugify(option),
        label: option,
      };
    }

    return {
      id: slugify(option.id || option.slug || option.label || option.name),
      label: option.label || option.name || option.title || "Filter",
    };
  });
}

function matchesCategory(product, categoryId) {
  if (categoryId === "all") {
    return true;
  }

  return product.categorySlug === categoryId || slugify(product.categoryLabel) === categoryId;
}

function matchesQuickFilter(product, filterId) {
  if (filterId === "all") {
    return true;
  }

  const badge = slugify(product.badge);
  const tags = product.tags || [];

  if (filterId === "new") {
    return badge === "new" || tags.includes("new");
  }

  if (filterId === "best") {
    return badge === "best" || tags.includes("best");
  }

  if (filterId === "sale") {
    return badge === "sale" || tags.includes("sale") || Number(product.oldPrice) > Number(product.price);
  }

  return tags.includes(filterId) || badge === filterId;
}

function matchesSearch(product, query) {
  if (!query) {
    return true;
  }

  const haystack = [
    product.title,
    product.categoryLabel,
    product.badge,
    product.description,
    ...(product.tags || []),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

function getFilteredProducts() {
  const query = searchQuery.trim().toLowerCase();

  return normalisedProducts.filter((product) => {
    return (
      matchesCategory(product, activeCategory) &&
      matchesQuickFilter(product, activeQuickFilter) &&
      matchesSearch(product, query)
    );
  });
}

function getPagerPages(totalPages, page) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items = new Set([1, totalPages, page, page - 1, page + 1, 2, totalPages - 1]);
  return Array.from(items)
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((left, right) => left - right)
    .reduce((result, value, index, array) => {
      if (index > 0) {
        const previous = array[index - 1];
        if (value - previous === 2) {
          result.push(previous + 1);
        } else if (value - previous > 2) {
          result.push("...");
        }
      }

      result.push(value);
      return result;
    }, []);
}

function getStatusClass(status) {
  const value = String(status || "").toLowerCase();

  if (value.includes("deliver")) {
    return "delivered";
  }

  if (value.includes("transit") || value.includes("shipping") || value.includes("ship") || value.includes("progress")) {
    return "progress";
  }

  if (value.includes("cancel") || value.includes("return")) {
    return "cancelled";
  }

  return "pending";
}

function updateBrandContent() {
  const brandTitle = document.querySelector(".brand-copy strong");
  const brandTag = document.querySelector(".brand-copy span");
  const buyerName = dashboardData.buyer?.fullName || dashboardData.buyer?.name || "Buyer";
  const initials = dashboardData.buyer?.initials || getInitials(buyerName);

  if (brandTitle) {
    brandTitle.textContent = dashboardData.brand || "OPS";
  }

  if (brandTag) {
    brandTag.textContent = dashboardData.brandTag || "Buyer dashboard";
  }

  if (elements.heroGreeting) {
    elements.heroGreeting.textContent = `${getGreeting()}, ${getFirstName(buyerName)}.`;
  }

  if (elements.heroTitle) {
    elements.heroTitle.textContent = dashboardData.hero?.title || fallbackBuyerDashboardData.hero.title;
  }

  if (elements.heroText) {
    elements.heroText.textContent = dashboardData.hero?.text || fallbackBuyerDashboardData.hero.text;
  }

  if (elements.heroImage && dashboardData.hero?.image) {
    elements.heroImage.src = dashboardData.hero.image;
  }

  if (elements.productSearchInput) {
    elements.productSearchInput.placeholder = dashboardData.hero?.searchPlaceholder || "Search on OPS";
  }

  if (elements.heroWord) {
    elements.heroWord.textContent = dashboardData.hero?.word || "Shop";
  }

  if (elements.logoutAvatar) {
    elements.logoutAvatar.textContent = initials;
  }

  document.title = `${dashboardData.brand || "OPS"} | Buyer Dashboard`;
}

function renderFilterButtons() {
  const categories = getCategoryOptions();
  const filters = getQuickFilterOptions();

  if (elements.categoryList) {
    elements.categoryList.innerHTML = categories
      .map((category) => {
        const count = category.id === "all"
          ? normalisedProducts.length
          : normalisedProducts.filter((product) => matchesCategory(product, category.id)).length;
        const isActive = activeCategory === category.id ? " is-active" : "";

        return `
          <button class="filter-chip${isActive}" type="button" data-category="${escapeHtml(category.id)}">
            <span class="filter-chip__label">
              <span class="filter-chip__icon" aria-hidden="true"></span>
              <span>${escapeHtml(category.label)}</span>
            </span>
            <span class="filter-chip__meta">${count}</span>
          </button>
        `;
      })
      .join("");
  }

  if (elements.quickFilterList) {
    elements.quickFilterList.innerHTML = filters
      .map((filter) => {
        const count = filter.id === "all"
          ? normalisedProducts.length
          : normalisedProducts.filter((product) => matchesQuickFilter(product, filter.id)).length;
        const isActive = activeQuickFilter === filter.id ? " is-active" : "";

        return `
          <button class="filter-chip${isActive}" type="button" data-filter="${escapeHtml(filter.id)}">
            <span class="filter-chip__label">
              <span class="filter-chip__icon" aria-hidden="true"></span>
              <span>${escapeHtml(filter.label)}</span>
            </span>
            <span class="filter-chip__meta">${count}</span>
          </button>
        `;
      })
      .join("");
  }
}

function renderProducts() {
  renderFilterButtons();

  const filteredProducts = getFilteredProducts();
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
  currentPage = clamp(currentPage, 1, totalPages);
  const startIndex = (currentPage - 1) * productsPerPage;
  const visibleProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  if (elements.catalogSummary) {
    if (!filteredProducts.length) {
      elements.catalogSummary.textContent = "No products match the current search. Try a different category or clear the filters.";
    } else {
      const startLabel = startIndex + 1;
      const endLabel = Math.min(startIndex + visibleProducts.length, filteredProducts.length);
      elements.catalogSummary.textContent = `Showing ${startLabel}–${endLabel} of ${filteredProducts.length} products`;
    }
  }

  if (elements.productGrid) {
    elements.productGrid.innerHTML = visibleProducts.length
      ? visibleProducts.map((product) => renderProductCard(product)).join("")
      : `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <strong>No products found</strong>
          <span>Try a different search term or clear the filters to continue browsing.</span>
          <div>
            <button class="empty-state__action" type="button" data-action="reset-filters">Clear filters</button>
          </div>
        </div>
      `;
  }

  renderPager(totalPages, filteredProducts.length);
}

function renderProductCard(product) {
  const priceLabel = formatCurrency(product.price);
  const oldPriceLabel = Number(product.oldPrice) > Number(product.price)
    ? `<span class="product-price--old">${escapeHtml(formatCurrency(product.oldPrice))}</span>`
    : "";

  return `
    <article class="product-card">
      <div class="product-media">
        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.title)}" />
        ${product.badge ? `<span class="product-badge">${escapeHtml(product.badge)}</span>` : ""}
        <span class="product-category">${escapeHtml(product.categoryLabel)}</span>
      </div>
      <div class="product-body">
        <h4 class="product-title">${escapeHtml(product.title)}</h4>
        ${product.description ? `<p class="product-description">${escapeHtml(product.description)}</p>` : ""}
        <div class="product-meta-row">
          <span class="product-rating"><strong>★</strong>${escapeHtml(product.rating.toFixed(1))} (${escapeHtml(formatReviewCount(product.reviews))})</span>
          <span class="product-price">${priceLabel} ${oldPriceLabel}</span>
        </div>
        <div class="product-actions">
          <button class="product-action" type="button" data-product-action="add" data-product-id="${escapeHtml(product.id)}">
            Add to Cart
          </button>
          <button class="product-action product-action--primary" type="button" data-product-action="buy" data-product-id="${escapeHtml(product.id)}">
            Buy Now
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderPager(totalPages, totalItems) {
  if (!elements.productPager) {
    return;
  }

  if (totalPages <= 1) {
    elements.productPager.innerHTML = "";
    elements.productPager.hidden = true;
    return;
  }

  elements.productPager.hidden = false;

  const pages = getPagerPages(totalPages, currentPage);
  const previousDisabled = currentPage === 1 ? "disabled" : "";
  const nextDisabled = currentPage === totalPages ? "disabled" : "";

  elements.productPager.innerHTML = `
    <button class="pager-nav" type="button" data-page="${currentPage - 1}" ${previousDisabled}>
      <span aria-hidden="true">←</span>
      Previous
    </button>

    <div class="pager-pages" aria-label="Page navigation">
      ${pages
        .map((item) => {
          if (item === "...") {
            return `<span class="pager-ellipsis" aria-hidden="true">…</span>`;
          }

          const activeClass = item === currentPage ? " is-active" : "";
          return `<button class="pager-page${activeClass}" type="button" data-page="${item}" ${item === currentPage ? 'aria-current="page"' : ""}>${item}</button>`;
        })
        .join("")}
    </div>

    <button class="pager-nav" type="button" data-page="${currentPage + 1}" ${nextDisabled}>
      Next
      <span aria-hidden="true">→</span>
    </button>
  `;
}

function renderCartSummary() {
  if (!elements.cartSummary) {
    return;
  }

  const items = cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0);
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

  elements.cartSummary.innerHTML = `
    <article class="summary-card">
      <p class="summary-card__label">Items in cart</p>
      <p class="summary-card__value">${formatNumber(items)}</p>
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
        <td colspan="4">
          <div class="empty-state">
            <strong>Your cart is empty</strong>
            <span>Add a few products from the catalog to start building your order.</span>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  elements.cartBody.innerHTML = cartItems
    .map((item) => {
      const product = getProductById(item.productId);
      const name = product?.title || item.title || "Unknown product";
      const category = product?.categoryLabel || item.category || "";
      const price = Number(product?.price ?? item.price ?? 0);
      const quantity = Math.max(1, Number(item.quantity || 1));
      const subtotal = price * quantity;
      const image = product?.image || createArtwork({ title: name }, 0);

      return `
        <tr>
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
          <td>${escapeHtml(quantity)}</td>
          <td class="table-price">${escapeHtml(formatCurrency(price))}</td>
          <td class="table-amount">${escapeHtml(formatCurrency(subtotal))}</td>
        </tr>
      `;
    })
    .join("");
}

function renderOrdersSummary() {
  if (!elements.ordersSummary) {
    return;
  }

  const totalOrders = orderItems.length;
  const delivered = orderItems.filter((order) => getStatusClass(order.status) === "delivered").length;
  const progress = orderItems.filter((order) => getStatusClass(order.status) === "progress").length;

  elements.ordersSummary.innerHTML = `
    <article class="summary-card">
      <p class="summary-card__label">Orders</p>
      <p class="summary-card__value">${formatNumber(totalOrders)}</p>
      <p class="summary-card__detail">Recent purchases you can review at any time.</p>
    </article>
    <article class="summary-card">
      <p class="summary-card__label">Delivered</p>
      <p class="summary-card__value">${formatNumber(delivered)}</p>
      <p class="summary-card__detail">Orders that are already complete.</p>
    </article>
    <article class="summary-card">
      <p class="summary-card__label">In progress</p>
      <p class="summary-card__value">${formatNumber(progress)}</p>
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
          </div>
        </td>
      </tr>
    `;
    return;
  }

  elements.ordersBody.innerHTML = orderItems
    .map((order) => {
      const product = getProductById(order.productId);
      const name = product?.title || order.title || "Unknown product";
      const category = product?.categoryLabel || order.category || "";
      const image = product?.image || createArtwork({ title: name }, 1);
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

function updateCartBadge() {
  if (!elements.cartBadge) {
    return;
  }

  const count = cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0);
  elements.cartBadge.textContent = count > 99 ? "99+" : String(count);
  elements.cartBadge.hidden = count === 0;
}

function setBuyerNavDrawerState(isOpen) {
  const shouldOpen = Boolean(isOpen) && isCompactScreen();

  if (document.body) {
    document.body.classList.toggle("nav-open", shouldOpen);
  }

  if (elements.navToggle) {
    elements.navToggle.setAttribute("aria-expanded", String(shouldOpen));
    elements.navToggle.setAttribute("aria-label", shouldOpen ? "Close navigation" : "Open navigation");
    elements.navToggle.classList.toggle("is-open", shouldOpen);
  }
}

function closeBuyerNavDrawer() {
  setBuyerNavDrawerState(false);
}

function toggleBuyerNavDrawer() {
  const isOpen = document.body?.classList.contains("nav-open");
  setBuyerNavDrawerState(!isOpen);
}

function syncBuyerNavDrawerState() {
  if (!isCompactScreen()) {
    closeBuyerNavDrawer();
  }
}

function setNavState(view) {
  elements.topnavLinks.forEach((link) => {
    const route = String(link.dataset.route || "");
    const isActive =
      (view === "overview" && route === "products:product_list") ||
      (view === "cart" && route === "orders:cart_detail") ||
      (view === "orders" && route === "orders:buyer_order_list");

    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function renderView() {
  if (elements.dashboardMain) {
    elements.dashboardMain.dataset.view = activeView;
  }

  if (elements.overviewSection) {
    elements.overviewSection.hidden = activeView !== "overview";
  }

  if (elements.detailLayout) {
    elements.detailLayout.hidden = activeView === "overview";
  }

  if (elements.cartPanel) {
    elements.cartPanel.hidden = activeView !== "cart";
  }

  if (elements.ordersPanel) {
    elements.ordersPanel.hidden = activeView !== "orders";
  }

  setNavState(activeView);

  if (activeView === "cart") {
    renderCartSummary();
    renderCartBody();
  } else if (activeView === "orders") {
    renderOrdersSummary();
    renderOrdersBody();
  }
}

function syncHash(view) {
  if (typeof history === "undefined" || typeof history.replaceState !== "function") {
    return;
  }

  const hash = view === "cart" ? "#cart" : view === "orders" ? "#orders" : "#overview";

  try {
    history.replaceState(null, "", hash);
  } catch (error) {
    // Ignore hash sync failures in restricted environments.
  }
}

function setView(view, options = {}) {
  const nextView = view === "cart" || view === "orders" ? view : "overview";
  closeBuyerNavDrawer();

  if (nextView === "cart") {
    window.location.href = BUYER_CART_PAGE_URL;
    return;
  }

  if (nextView === "orders") {
    window.location.href = BUYER_ORDERS_PAGE_URL;
    return;
  }

  activeView = nextView;
  renderView();

  if (options.syncHash !== false) {
    syncHash(nextView);
  }

  if (options.scrollToTop !== false && typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function addProductToCart(productId) {
  const existing = cartItems.find((item) => String(item.productId) === String(productId));

  if (existing) {
    existing.quantity = Number(existing.quantity || 0) + 1;
  } else {
    cartItems = [...cartItems, { productId: String(productId), quantity: 1 }];
  }

  updateCartBadge();
  persistBuyerDashboardState();
  if (activeView === "cart") {
    renderCartSummary();
    renderCartBody();
  }
}

function handleProductAction(action, productId) {
  if (!productId) {
    return;
  }

  if (action === "add") {
    addProductToCart(productId);
    return;
  }

  if (action === "buy") {
    addProductToCart(productId);
    window.location.href = BUYER_CART_PAGE_URL;
  }
}

function handleGlobalClick(event) {
  const routeLink = event.target.closest("[data-route]");
  if (routeLink) {
    event.preventDefault();
    closeBuyerNavDrawer();
    const route = String(routeLink.dataset.route || "");

    if (route === "accounts:logout") {
      try {
        sessionStorage.removeItem("buyerDashboardState");
        sessionStorage.removeItem("buyerDashboardHandoff");
        sessionStorage.removeItem(BUYER_DASHBOARD_STATE_KEY);
      } catch (error) {
        // Ignore storage failures.
      }

      window.location.href = "../index.html";
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

    setView("overview");
    return;
  }

  const productAction = event.target.closest("[data-product-action]");
  if (productAction) {
    const action = String(productAction.dataset.productAction || "");
    const productId = String(productAction.dataset.productId || "");
    handleProductAction(action, productId);
    return;
  }

  const categoryButton = event.target.closest("[data-category]");
  if (categoryButton) {
    activeCategory = String(categoryButton.dataset.category || "all");
    currentPage = 1;
    renderProducts();
    return;
  }

  const filterButton = event.target.closest("[data-filter]");
  if (filterButton) {
    activeQuickFilter = String(filterButton.dataset.filter || "all");
    currentPage = 1;
    renderProducts();
    return;
  }

  const pageButton = event.target.closest("[data-page]");
  if (pageButton) {
    const page = Number(pageButton.dataset.page || 1);
    const filteredProducts = getFilteredProducts();
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
    currentPage = clamp(page, 1, totalPages);
    renderProducts();
    return;
  }

  if (event.target.closest("[data-action='reset-filters']")) {
    resetFilters();
  }
}

function resetFilters() {
  searchQuery = "";
  activeCategory = "all";
  activeQuickFilter = "all";
  currentPage = 1;

  if (elements.productSearchInput) {
    elements.productSearchInput.value = "";
  }

  renderProducts();
}

function handleSearchInput(event) {
  searchQuery = event.target.value || "";
  currentPage = 1;
  renderProducts();
}

function handleSearchSubmit(event) {
  event.preventDefault();
  searchQuery = elements.productSearchInput?.value || "";
  currentPage = 1;
  renderProducts();
}

function handleSearchShortcut() {
  if (!elements.productSearchInput) {
    return;
  }

  setView("overview", { scrollToTop: false });
  elements.productSearchInput.focus();
  elements.productSearchInput.select();
}

function renderDashboard() {
  updateBrandContent();
  updateCartBadge();
  renderProducts();
  renderCartSummary();
  renderCartBody();
  renderOrdersSummary();
  renderOrdersBody();
  persistBuyerDashboardState();
  setView(resolveInitialView(), { syncHash: false, scrollToTop: false });
}

function resolveInitialView() {
  const rawHash = (typeof window !== "undefined" && window.location?.hash ? window.location.hash : "").replace("#", "");

  if (rawHash === "cart" || rawHash === "orders") {
    return rawHash;
  }

  return "overview";
}

document.addEventListener("click", handleGlobalClick);

if (elements.navToggle) {
  elements.navToggle.addEventListener("click", toggleBuyerNavDrawer);
}

if (elements.navBackdrop) {
  elements.navBackdrop.addEventListener("click", closeBuyerNavDrawer);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeBuyerNavDrawer();
  }
});

window.addEventListener("resize", syncBuyerNavDrawerState);
window.addEventListener("orientationchange", syncBuyerNavDrawerState);

if (elements.productSearchForm) {
  elements.productSearchForm.addEventListener("submit", handleSearchSubmit);
}

if (elements.productSearchInput) {
  elements.productSearchInput.addEventListener("input", handleSearchInput);
}

if (elements.searchShortcut) {
  elements.searchShortcut.addEventListener("click", handleSearchShortcut);
}

renderDashboard();
