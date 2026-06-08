const fallbackDashboardData = {
  seller: {
    name: "Ama Kusi",
    store: "Ama's Fashion House",
    status: "Verified seller",
  },
  dashboard: {
    health: 92,
    liveProducts: 64,
    pendingOrders: 12,
    lowStock: 6,
  },
  metrics: [
    {
      tone: "green",
      icon: "sales",
      label: "Gross sales",
      value: "GH₵ 23,902",
      note: "+8.4% from last month",
    },
    {
      tone: "amber",
      icon: "orders",
      label: "Orders today",
      value: "18",
      note: "6 still need confirmation",
    },
    {
      tone: "teal",
      icon: "products",
      label: "Active listings",
      value: "64",
      note: "5 updated this week",
    },
    {
      tone: "rose",
      icon: "stock",
      label: "Low stock alerts",
      value: "6",
      note: "2 items need restock",
    },
  ],
  products: [
    {
      id: "ankara-midi-dress",
      name: "Ankara midi dress",
      category: "Fashion",
      price: 320,
      stock: 5,
      is_active: true,
      description: "A bold statement piece with a clean silhouette and comfortable fit.",
    },
    {
      id: "braided-tote-bag",
      name: "Braided tote bag",
      category: "Accessories",
      price: 220,
      stock: 12,
      is_active: true,
      description: "Hand-finished everyday bag with room for daily essentials.",
    },
    {
      id: "silk-head-wrap",
      name: "Silk head wrap",
      category: "Fashion",
      price: 85,
      stock: 0,
      is_active: false,
      description: "Soft accessory for effortless styling and easy colour matching.",
    },
    {
      id: "handmade-sandals",
      name: "Handmade sandals",
      category: "Footwear",
      price: 260,
      stock: 4,
      is_active: true,
      description: "Comfortable sandals with a clean handcrafted finish.",
    },
  ],
  orders: [
    {
      id: "#OPS-345891",
      buyer: "Aria Mensah",
      item: "2 Ankara dresses",
      amount: "GH₵ 372.00",
      deliveryAddress: "East Legon, Accra",
      placedAt: "29 Apr 2026, 11:53 AM",
      items: [
        {
          name: "Ankara dresses",
          quantity: 2,
          amount: "GH₵ 372.00",
        },
      ],
      status: "Shipped",
      time: "10 min ago",
    },
    {
      id: "#OPS-345876",
      buyer: "Kwesi Boateng",
      item: "Leather sandals",
      amount: "GH₵ 145.00",
      deliveryAddress: "Dansoman, Accra",
      placedAt: "29 Apr 2026, 10:21 AM",
      items: [
        {
          name: "Leather sandals",
          quantity: 1,
          amount: "GH₵ 145.00",
        },
      ],
      status: "Confirmed",
      time: "42 min ago",
    },
    {
      id: "#OPS-345854",
      buyer: "Naa Adjeley",
      item: "Beaded handbag",
      amount: "GH₵ 220.00",
      deliveryAddress: "Haatso, Accra",
      placedAt: "29 Apr 2026, 9:10 AM",
      items: [
        {
          name: "Beaded handbag",
          quantity: 1,
          amount: "GH₵ 220.00",
        },
      ],
      status: "Ready",
      time: "1 hr ago",
    },
    {
      id: "#OPS-345801",
      buyer: "Priscilla Owusu",
      item: "3 hair wraps",
      amount: "GH₵ 186.00",
      deliveryAddress: "Adabraka, Accra",
      placedAt: "28 Apr 2026, 4:37 PM",
      items: [
        {
          name: "Hair wraps",
          quantity: 3,
          amount: "GH₵ 186.00",
        },
      ],
      status: "Delivered",
      time: "Yesterday",
    },
  ],
  tasks: [
    {
      status: "urgent",
      title: "Confirm today’s new orders",
      copy: "Three fresh requests are waiting on approval.",
      badge: "3 urgent",
    },
    {
      status: "watch",
      title: "Restock the low inventory items",
      copy: "Two products are close to selling out.",
      badge: "2 products",
    },
    {
      status: "done",
      title: "Publish a new listing",
      copy: "Fresh products keep the store visible to buyers.",
      badge: "Done",
    },
    {
      status: "done",
      title: "Review the weekly analytics report",
      copy: "The latest trends are already highlighted for you.",
      badge: "Done",
    },
  ],
};

function mergeDashboardData(base, override = {}) {
  return {
    ...base,
    ...override,
    seller: {
      ...base.seller,
      ...(override.seller || {}),
    },
    dashboard: {
      ...base.dashboard,
      ...(override.dashboard || {}),
    },
    metrics: Array.isArray(override.metrics) ? override.metrics : base.metrics,
    products: Array.isArray(override.products) ? override.products : base.products,
    orders: Array.isArray(override.orders) ? override.orders : base.orders,
    tasks: Array.isArray(override.tasks) ? override.tasks : base.tasks,
  };
}

function parseCurrencyAmount(value) {
  const raw = String(value || "").trim();

  if (!raw) {
    return 0;
  }

  const numeric = Number(raw.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function normalizeOrderItems(items, fallbackAmount = 0) {
  if (!Array.isArray(items) || !items.length) {
    return [];
  }

  return items.map((item, index) => {
    if (typeof item === "string") {
      return {
        name: item,
        quantity: 1,
        amount: fallbackAmount,
      };
    }

    const quantity = Math.max(1, Number(item?.quantity || item?.qty || 1));
    const amount = parseCurrencyAmount(item?.amount ?? item?.price ?? fallbackAmount);

    return {
      name: String(item?.name || item?.title || `Item ${index + 1}`),
      quantity,
      amount,
    };
  });
}

function normalizeOrders(orders) {
  return (Array.isArray(orders) ? orders : []).map((order, index) => {
    const amountValue = parseCurrencyAmount(order?.amount ?? order?.total ?? 0);
    const items = normalizeOrderItems(order?.items, amountValue);
    const summary = String(
      order?.item ||
        order?.summary ||
        (items.length ? `${items.length} item${items.length === 1 ? "" : "s"}` : "Order details")
    );

    return {
      ...order,
      id: String(order?.id || `#OPS-${345800 + index}`),
      buyer: String(order?.buyer || order?.customer || "Buyer"),
      deliveryAddress: String(
        order?.deliveryAddress || order?.address || "Delivery address not provided"
      ),
      placedAt: String(order?.placedAt || order?.date || order?.time || "—"),
      itemSummary: summary,
      amountValue,
      amountLabel: formatPriceValue(order?.amount ?? order?.total ?? amountValue),
      items: items.length ? items : normalizeOrderItems([summary], amountValue),
      status: String(order?.status || "New"),
      time: String(order?.time || order?.placedAt || "—"),
      statusNote: String(order?.statusNote || ""),
    };
  });
}

const SELLER_DASHBOARD_PROFILE_KEY = "opsSellerDashboardProfile";

function safeParseJson(value) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

function readSellerDashboardProfileFromStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedProfile = window.sessionStorage.getItem(SELLER_DASHBOARD_PROFILE_KEY);
    return storedProfile ? safeParseJson(storedProfile) : null;
  } catch (error) {
    return null;
  }
}

function persistSellerDashboardProfile(profile) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(SELLER_DASHBOARD_PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    // If storage is blocked, the fallback dashboard data still renders.
  }
}

function readSellerDashboardProfileFromUrl() {
  if (typeof window === "undefined") {
    return null;
  }

  const params = new URLSearchParams(window.location.search);
  const sellerName = params.get("seller");
  const storeName = params.get("store");
  const status = params.get("status");
  const businessLocation = params.get("location");
  const businessName = params.get("business");

  if (!sellerName && !storeName && !status && !businessLocation && !businessName) {
    return null;
  }

  return {
    seller: {
      name: sellerName || undefined,
      store: storeName || undefined,
      status: status || undefined,
    },
    onboarding: {
      businessLocation: businessLocation || undefined,
      businessName: businessName || undefined,
    },
  };
}

function getSellerDashboardHandoff() {
  const urlProfile = readSellerDashboardProfileFromUrl();

  if (urlProfile) {
    persistSellerDashboardProfile(urlProfile);

    if (window.history && window.history.replaceState) {
      const cleanUrl = new URL(window.location.href);
      cleanUrl.search = "";
      window.history.replaceState({}, "", cleanUrl.toString());
    }

    return urlProfile;
  }

  return readSellerDashboardProfileFromStorage() || {};
}

const backendDashboardData =
  typeof window !== "undefined" &&
  window.SELLER_DASHBOARD_DATA &&
  typeof window.SELLER_DASHBOARD_DATA === "object"
    ? window.SELLER_DASHBOARD_DATA
    : {};

const dashboardData = mergeDashboardData(
  mergeDashboardData(fallbackDashboardData, getSellerDashboardHandoff()),
  backendDashboardData
);

const sellerOrders = normalizeOrders(dashboardData.orders);
dashboardData.orders = sellerOrders;

const greetingTitle = document.getElementById("greeting-title");
const sellerNameNode = document.getElementById("seller-name");
const topbarSnapshotNode = document.getElementById("topbar-snapshot");
const dashboardMain = document.querySelector(".dashboard-main");
const contentGrid = document.querySelector(".content-grid");
const currentDate = document.getElementById("current-date");
const metricGrid = document.getElementById("metric-grid");
const addProductPanel = document.getElementById("add-product-panel");
const productCardsView = document.getElementById("product-cards-view");
const productManagementView = document.getElementById("product-management-view");
const productManagementList = document.getElementById("product-management-list");
const productList = document.getElementById("product-list");
const productForm = document.getElementById("product-form");
const productImageInput = document.getElementById("product-image-input");
const productImageCopy = document.getElementById("product-image-copy");
const productImageSupport = document.getElementById("product-image-support");
const productFormSubmit = document.getElementById("product-form-submit");
const addProductBackLink = document.getElementById("add-product-back-link");
const ordersPreviewView = document.getElementById("orders-preview-view");
const ordersPreviewList = document.getElementById("orders-preview-list");
const ordersPreviewCount = document.getElementById("orders-preview-count");
const ordersListView = document.getElementById("orders-list-view");
const ordersList = document.getElementById("orders-list");
const ordersListCount = document.getElementById("orders-list-count");
const orderDetailView = document.getElementById("order-detail-view");
const orderDetailBack = document.getElementById("order-detail-back");
const orderDetailStatusPill = document.getElementById("order-detail-status-pill");
const orderDetailId = document.getElementById("order-detail-id");
const orderDetailAmount = document.getElementById("order-detail-amount");
const orderDetailNote = document.getElementById("order-detail-note");
const orderDetailBuyer = document.getElementById("order-detail-buyer");
const orderDetailAddress = document.getElementById("order-detail-address");
const orderDetailPlaced = document.getElementById("order-detail-placed");
const orderDetailSummary = document.getElementById("order-detail-summary");
const orderDetailItems = document.getElementById("order-detail-items");
const orderStatusForm = document.getElementById("order-status-form");
const orderStatusSelect = document.getElementById("order-status-select");
const productsPanel = document.getElementById("products-panel");
const ordersPanel = document.getElementById("orders-panel");
const tasksPanel = document.getElementById("tasks-panel");
const dashboardShell = document.querySelector(".dashboard-shell");
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebarBackdrop = document.querySelector(".sidebar-backdrop");
const topbarPrimaryAction = document.querySelector(".topbar-actions .button-primary");
const topbarSecondaryAction = document.querySelector(".topbar-actions .button-secondary");
const productsPanelLink = document.querySelector(".products-panel .panel-link");
const ordersPanelLink = document.querySelector(".orders-panel .panel-link");
const boundRouteLinks = new WeakSet();
const taskList = document.getElementById("task-list");
const taskProgressBar = document.getElementById("task-progress-bar");
const taskProgressLabel = document.getElementById("task-progress-label");
const taskCount = document.getElementById("task-count");

let currentDashboardView = "overview";
let currentOrdersSubview = "list";
let selectedOrderId = null;
let editingProductId = null;

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function getAccraDate() {
  return new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Africa/Accra",
    })
  );
}

function formatDashboardDate() {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Accra",
  }).format(getAccraDate());
}

function getGreeting() {
  const hour = getAccraDate().getHours();

  if (hour < 12) {
    return "Good Morning";
  }

  if (hour < 18) {
    return "Good Afternoon";
  }

  return "Good Evening";
}

function getInitials(name) {
  const letters = String(name || "S")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return letters || "S";
}

function getFirstName(name) {
  return String(name || "Seller").trim().split(/\s+/)[0] || "Seller";
}

function getMetricIcon(iconName) {
  const icons = {
    sales: `
      <svg viewBox="0 0 24 24" role="presentation">
        <path d="M5 19h14M7 15v4M12 11v8M17 7v12" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8" />
      </svg>
    `,
    orders: `
      <svg viewBox="0 0 24 24" role="presentation">
        <rect x="4" y="5" width="16" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8" />
        <path d="M8 9h8M8 13h8M8 17h5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8" />
      </svg>
    `,
    products: `
      <svg viewBox="0 0 24 24" role="presentation">
        <path d="M6 7.5 12 4l6 3.5v9L12 20l-6-3.5z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.8" />
        <path d="M6 7.5 12 11l6-3.5M12 11v9" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.8" />
      </svg>
    `,
    stock: `
      <svg viewBox="0 0 24 24" role="presentation">
        <path d="M12 4 4.5 8.2 12 12.4l7.5-4.2L12 4Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.8" />
        <path d="M4.5 12.2 12 16.4l7.5-4.2M12 12.4V20" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.8" />
      </svg>
    `,
  };

  return icons[iconName] || icons.sales;
}

function getThumbPalette(index) {
  const palettes = [
    ["#1e7f4f", "#3fbf7f"],
    ["#1f6d9c", "#52a7d9"],
    ["#8a6510", "#f2c94c"],
    ["#a84562", "#e78aa0"],
  ];

  return palettes[index % palettes.length];
}

function getProductStatusClass(status) {
  const map = {
    "low stock": "status-pill--low",
    "in stock": "status-pill--stocked",
    "out of stock": "status-pill--empty",
  };

  return map[String(status || "").toLowerCase()] || "status-pill--stocked";
}

function getOrderStatusClass(status) {
  const map = {
    new: "status-pill--new",
    confirmed: "status-pill--confirmed",
    processing: "status-pill--processing",
    ready: "status-pill--ready",
    shipped: "status-pill--shipped",
    delivered: "status-pill--delivered",
  };

  return map[slugify(status)] || "status-pill--processing";
}

function getTaskToneClass(status) {
  return `task-item--${slugify(status)}`;
}

function getTaskBadgeClass(status) {
  const normalized = slugify(status);
  if (normalized === "urgent") {
    return "task-badge--urgent";
  }
  if (normalized === "watch") {
    return "task-badge--watch";
  }
  return "task-badge--done";
}

function getProductStatusClass(product) {
  const stockCount = Number(product?.stock) || 0;

  if (!product?.is_active) {
    return "status-pill--inactive";
  }

  if (stockCount <= 0) {
    return "status-pill--empty";
  }

  if (stockCount <= 5) {
    return "status-pill--low";
  }

  return "status-pill--stocked";
}

function getProductStatusLabel(product) {
  const stockCount = Number(product?.stock) || 0;

  if (!product?.is_active) {
    return "Inactive";
  }

  if (stockCount <= 0) {
    return "Out of stock";
  }

  if (stockCount <= 5) {
    return "Low stock";
  }

  return "Active";
}

function getProductCategoryLabel(product) {
  return String(product?.categoryLabel || product?.category || "General");
}

function getProductName(product) {
  return String(product?.name || product?.title || "Product");
}

function getProductStockLabel(stock) {
  const stockCount = Number(stock) || 0;
  return `${stockCount} unit${stockCount === 1 ? "" : "s"} in stock`;
}

function getProductDisplayPrice(price) {
  return formatPriceValue(price);
}

function getProductImageSource(product) {
  const image = String(product?.image || "").trim();
  return image || "";
}

function getProductCardMarkup(product, index) {
  const [thumbStart, thumbEnd] = getThumbPalette(index);
  const image = getProductImageSource(product);
  const price = getProductDisplayPrice(product.price);
  const categoryLabel = getProductCategoryLabel(product);
  const stockLabel = getProductStockLabel(product.stock);
  const statusLabel = getProductStatusLabel(product);
  const statusClass = getProductStatusClass(product);
  const stockFill = clamp(Number(product.stock || 0) * 8, 0, 100);

  return `
    <article class="product-item">
      <div class="product-thumb product-thumb--${image ? "image" : "fallback"}" aria-hidden="true" style="--thumb-start: ${thumbStart}; --thumb-end: ${thumbEnd};">
        ${
          image
            ? `<img class="product-thumb-image" src="${escapeHtml(image)}" alt="" aria-hidden="true" />`
            : escapeHtml(getInitials(getProductName(product)))
        }
      </div>
      <div class="product-content">
        <div class="product-top">
          <div>
            <strong class="product-name">${escapeHtml(getProductName(product))}</strong>
            <span class="product-meta">${escapeHtml(categoryLabel)} · ${escapeHtml(stockLabel)}</span>
          </div>
          <strong class="product-price">${escapeHtml(price)}</strong>
        </div>
        <div class="stock-meter" aria-hidden="true">
          <span style="width: ${stockFill}%"></span>
        </div>
      </div>
      <span class="status-pill ${statusClass}">${escapeHtml(statusLabel)}</span>
    </article>
  `;
}

function getProductManagementMarkup(product, index) {
  const [thumbStart, thumbEnd] = getThumbPalette(index);
  const image = getProductImageSource(product);
  const price = getProductDisplayPrice(product.price);
  const statusLabel = getProductStatusLabel(product);
  const statusClass = getProductStatusClass(product);
  const categoryLabel = getProductCategoryLabel(product);
  const productId = escapeHtml(product.id);
  const stockFill = clamp(Number(product.stock || 0) * 8, 0, 100);

  return `
    <article class="product-admin-item" data-product-id="${productId}">
      <div class="product-admin-media" style="--thumb-start: ${thumbStart}; --thumb-end: ${thumbEnd};">
        ${
          image
            ? `<img class="product-admin-image" src="${escapeHtml(image)}" alt="${escapeHtml(
                getProductName(product)
              )}" />`
            : `<span class="product-admin-initials">${escapeHtml(getInitials(getProductName(product)))}</span>`
        }
      </div>
      <div class="product-admin-copy">
        <div class="product-admin-top">
          <div>
            <strong class="product-admin-name">${escapeHtml(getProductName(product))}</strong>
            <span class="product-admin-meta">${escapeHtml(categoryLabel)}</span>
          </div>
          <strong class="product-admin-price">${escapeHtml(price)}</strong>
        </div>
        <p class="product-admin-stats">
          Price: ${escapeHtml(price)} | Stock: ${escapeHtml(Number(product.stock) || 0)}
        </p>
        <div class="stock-meter stock-meter--table" aria-hidden="true">
          <span style="width: ${stockFill}%"></span>
        </div>
        <div class="product-admin-footer">
          <span class="status-pill ${statusClass}">${escapeHtml(statusLabel)}</span>
          <div class="product-admin-actions">
            <button class="action-link" type="button" data-product-action="edit" data-product-id="${productId}">
              Edit
            </button>
            <button class="action-link" type="button" data-product-action="toggle-active" data-product-id="${productId}">
              Toggle Active
            </button>
            <button class="action-link action-link--danger" type="button" data-product-action="delete" data-product-id="${productId}">
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}

function getOrderById(orderId) {
  return sellerOrders.find((order) => String(order.id) === String(orderId)) || null;
}

function getOrderCardMarkup(order, index) {
  const statusClass = getOrderStatusClass(order.status);
  const amountLabel = escapeHtml(order.amountLabel || formatPriceValue(order.amountValue || order.amount || 0));
  const itemSummary = escapeHtml(order.itemSummary || order.item || "Order details");

  return `
    <article class="order-card" data-order-id="${escapeHtml(order.id)}">
      <div class="order-card-head">
        <div>
          <p class="order-card-id">${escapeHtml(order.id)}</p>
          <h4 class="order-card-buyer">${escapeHtml(order.buyer)}</h4>
          <p class="order-card-summary">${itemSummary}</p>
        </div>
        <span class="status-pill ${statusClass}">${escapeHtml(order.status)}</span>
      </div>

      <div class="order-card-meta">
        <div>
          <span>Placed</span>
          <strong>${escapeHtml(order.time || order.placedAt || "—")}</strong>
        </div>
        <div>
          <span>Amount</span>
          <strong>${amountLabel}</strong>
        </div>
        <div>
          <span>Address</span>
          <strong>${escapeHtml(order.deliveryAddress)}</strong>
        </div>
      </div>

      <button class="button button-outline order-card-action" type="button" data-order-action="view" data-order-id="${escapeHtml(order.id)}">
        View &amp; Update
      </button>
    </article>
  `;
}

function getOrderSnapshotMarkup(order) {
  const statusClass = getOrderStatusClass(order.status);
  const amountLabel = escapeHtml(order.amountLabel || formatPriceValue(order.amountValue || order.amount || 0));
  const itemSummary = escapeHtml(order.itemSummary || order.item || "Order details");
  const placedLabel = escapeHtml(order.time || order.placedAt || "—");

  return `
    <article class="order-snapshot-card" data-order-id="${escapeHtml(order.id)}">
      <div class="order-snapshot-top">
        <div>
          <p class="order-snapshot-id">${escapeHtml(order.id)}</p>
          <h4 class="order-snapshot-buyer">${escapeHtml(order.buyer)}</h4>
        </div>
        <span class="status-pill ${statusClass}">${escapeHtml(order.status)}</span>
      </div>

      <p class="order-snapshot-summary">${itemSummary}</p>

      <div class="order-snapshot-meta">
        <div>
          <span>Placed</span>
          <strong>${placedLabel}</strong>
        </div>
        <div>
          <span>Amount</span>
          <strong>${amountLabel}</strong>
        </div>
      </div>
    </article>
  `;
}

function getOrderItemsMarkup(order) {
  const items = Array.isArray(order?.items) ? order.items : [];

  if (!items.length) {
    return `
      <div class="order-items-empty">
        <strong>No line items found</strong>
        <p>This order does not yet include a detailed item breakdown.</p>
      </div>
    `;
  }

  return items
    .map((item, index) => {
      const quantity = Math.max(1, Number(item?.quantity || item?.qty || 1));
      const amountLabel = escapeHtml(formatPriceValue(item?.amount || 0));
      const name = escapeHtml(String(item?.name || item?.title || `Item ${index + 1}`));

      return `
        <article class="order-line-item">
          <div>
            <strong>${name}</strong>
            <span>${quantity} × ${amountLabel}</span>
          </div>
          <strong>${amountLabel}</strong>
        </article>
      `;
    })
    .join("");
}

function renderOrderDetail(order) {
  if (!order) {
    return;
  }

  if (orderDetailStatusPill) {
    orderDetailStatusPill.className = `status-pill ${getOrderStatusClass(order.status)}`;
    orderDetailStatusPill.textContent = order.status;
  }

  if (orderDetailId) {
    orderDetailId.textContent = order.id;
  }

  if (orderDetailAmount) {
    orderDetailAmount.textContent = order.amountLabel || formatPriceValue(order.amountValue || order.amount || 0);
  }

  if (orderDetailNote) {
    orderDetailNote.textContent =
      order.statusNote ||
      "Review the buyer details, confirm the items, and update the status when the order moves forward.";
  }

  if (orderDetailBuyer) {
    orderDetailBuyer.textContent = order.buyer;
  }

  if (orderDetailAddress) {
    orderDetailAddress.textContent = order.deliveryAddress;
  }

  if (orderDetailPlaced) {
    orderDetailPlaced.textContent = order.placedAt || order.time || "—";
  }

  if (orderDetailSummary) {
    orderDetailSummary.textContent = order.itemSummary || order.item || "Order details";
  }

  if (orderDetailItems) {
    orderDetailItems.innerHTML = getOrderItemsMarkup(order);
  }

  if (orderStatusSelect) {
    orderStatusSelect.value = order.status;
  }
}

function setOrdersSubview(subview, orderId = null) {
  currentOrdersSubview = subview === "detail" ? "detail" : "list";
  selectedOrderId = currentOrdersSubview === "detail" ? String(orderId || selectedOrderId || "") : null;
  setTopbarContent(currentDashboardView);
  renderOrders();
  syncActionButtons(currentDashboardView);
}

function openOrderDetail(orderId) {
  const nextOrderId = String(orderId || "");

  if (!nextOrderId) {
    return;
  }

  selectedOrderId = nextOrderId;

  if (currentDashboardView !== "orders") {
    setDashboardView("orders");
  }

  currentOrdersSubview = "detail";
  setTopbarContent("orders");
  renderOrders();
  syncActionButtons("orders");
}

function openOrderList() {
  currentOrdersSubview = "list";
  selectedOrderId = null;
  setTopbarContent("orders");
  renderOrders();
  syncActionButtons(currentDashboardView);
}

function getViewRoute(view) {
  const map = {
    overview: "overview",
    products: "products:seller_product_list",
    orders: "orders:seller_order_list",
    "add-product": "products:product_create",
  };

  return map[view] || map.overview;
}

function getViewTitle(view) {
  const map = {
    overview: "Dashboard",
    products: "Products",
    orders: "Orders",
    "add-product": "Add Product",
  };

  return map[view] || map.overview;
}

function getViewHeading(view, firstName) {
  if (view === "products") {
    return "My products";
  }

  if (view === "orders") {
    return "Incoming orders";
  }

  if (view === "add-product") {
    return "Add a product";
  }

  return `${getGreeting()}, ${firstName}.`;
}

function getViewSnapshot(view) {
  if (view === "products") {
    return "— manage listings, edit products, and toggle what appears in your store.";
  }

  if (view === "orders") {
    return currentOrdersSubview === "detail"
      ? "— reviewing buyer details, item lines, and the current status update."
      : "— review pending orders, confirmations, and recent buyer activity.";
  }

  if (view === "add-product") {
    return "— fill in the product details and upload your images to create a new listing.";
  }

  return "— a quick snapshot of your store performance, stock, and active orders.";
}

function getDashboardViewFromRoute(route) {
  const normalizedRoute = String(route || "");

  if (normalizedRoute === "overview") {
    return "overview";
  }

  if (
    normalizedRoute === "products:seller_product_list" ||
    normalizedRoute === "products:product_create"
  ) {
    return normalizedRoute === "products:product_create" ? "add-product" : "products";
  }

  if (normalizedRoute === "orders:seller_order_list") {
    return "orders";
  }

  return null;
}

function setActiveNav(view) {
  const navLinks = Array.from(document.querySelectorAll(".sidebar-nav .nav-link"));
  const activeRoute = getViewRoute(view);

  navLinks.forEach((link) => {
    const route = link.dataset.route || "";
    const isActive = route === activeRoute;

    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
      return;
    }

    link.removeAttribute("aria-current");
  });
}

function isCompactScreen() {
  const screen = document.documentElement.dataset.screen || "";
  return screen === "tablet" || screen === "phone";
}

function setSidebarDrawerState(isOpen) {
  const shouldOpen = Boolean(isOpen) && isCompactScreen();

  if (dashboardShell) {
    dashboardShell.classList.toggle("nav-open", shouldOpen);
  }

  if (document.body) {
    document.body.classList.toggle("sidebar-open", shouldOpen);
  }

  if (sidebarToggle) {
    sidebarToggle.setAttribute("aria-expanded", String(shouldOpen));
    sidebarToggle.setAttribute("aria-label", shouldOpen ? "Close navigation" : "Open navigation");
    sidebarToggle.classList.toggle("is-open", shouldOpen);
  }
}

function closeSidebarDrawer() {
  setSidebarDrawerState(false);
}

function toggleSidebarDrawer() {
  const isOpen = dashboardShell?.classList.contains("nav-open");
  setSidebarDrawerState(!isOpen);
}

function syncSidebarDrawerState() {
  if (!isCompactScreen()) {
    closeSidebarDrawer();
  }
}

function syncActionButtons(view) {
  if (topbarPrimaryAction) {
    if (view === "add-product") {
      topbarPrimaryAction.textContent = "Back to products";
      topbarPrimaryAction.dataset.route = "products:seller_product_list";
    } else {
      topbarPrimaryAction.textContent = "Add Product";
      topbarPrimaryAction.dataset.route = "products:product_create";
    }
  }

  if (topbarSecondaryAction) {
    if (view === "overview" || view === "add-product") {
      topbarSecondaryAction.textContent = "Incoming Orders";
      topbarSecondaryAction.dataset.route = "orders:seller_order_list";
    } else if (view === "orders" && currentOrdersSubview === "detail") {
      topbarSecondaryAction.textContent = "Back to orders";
      topbarSecondaryAction.dataset.route = "orders:seller_order_list";
    } else {
      topbarSecondaryAction.textContent = "Back to overview";
      topbarSecondaryAction.dataset.route = "overview";
    }
  }

  if (productsPanelLink) {
    if (view === "products") {
      productsPanelLink.textContent = "+ Add New Product";
      productsPanelLink.dataset.route = "products:product_create";
    } else if (view === "add-product") {
      productsPanelLink.textContent = "Back to products";
      productsPanelLink.dataset.route = "products:seller_product_list";
    } else {
      productsPanelLink.textContent = "View all";
      productsPanelLink.dataset.route = "products:seller_product_list";
    }
  }

  if (ordersPanelLink) {
    if (view === "orders") {
      if (currentOrdersSubview === "detail") {
        ordersPanelLink.textContent = "Back to orders";
        ordersPanelLink.dataset.route = "orders:seller_order_list";
      } else {
        ordersPanelLink.textContent = "Back to overview";
        ordersPanelLink.dataset.route = "overview";
      }
    } else {
      ordersPanelLink.textContent = "Open orders";
      ordersPanelLink.dataset.route = "orders:seller_order_list";
    }
  }
}

function setTopbarContent(view = "overview") {
  const sellerName = dashboardData.seller.name || "Seller";
  const firstName = getFirstName(sellerName);
  const title = dashboardData.seller.store
    ? `OPS | ${dashboardData.seller.store}${view === "overview" ? "" : ` · ${getViewTitle(view)}`}`
    : `OPS | Seller Dashboard${view === "overview" ? "" : ` · ${getViewTitle(view)}`}`;

  document.title = title;
  greetingTitle.textContent = getViewHeading(view, firstName);
  sellerNameNode.textContent = sellerName;
  if (topbarSnapshotNode) {
    topbarSnapshotNode.textContent = getViewSnapshot(view);
  }
  currentDate.textContent = formatDashboardDate();
}

function renderInventoryTable() {
  return;
}

function setDashboardView(view) {
  const normalizedView =
    view === "products" || view === "orders" || view === "add-product" ? view : "overview";

  currentDashboardView = normalizedView;

  if (normalizedView !== "orders") {
    currentOrdersSubview = "list";
    selectedOrderId = null;
  }

  if (dashboardMain) {
    dashboardMain.dataset.view = normalizedView;
  }

  if (metricGrid) {
    metricGrid.hidden = normalizedView !== "overview";
  }

  if (contentGrid) {
    contentGrid.hidden = normalizedView === "add-product";
  }

  if (addProductPanel) {
    addProductPanel.hidden = normalizedView !== "add-product";
  }

  if (productCardsView) {
    productCardsView.hidden = normalizedView !== "overview";
  }

  if (productManagementView) {
    productManagementView.hidden = normalizedView !== "products";
  }

  if (productsPanel) {
    productsPanel.hidden = normalizedView === "orders" || normalizedView === "add-product";
  }

  if (ordersPanel) {
    ordersPanel.hidden = normalizedView === "products" || normalizedView === "add-product";
  }

  if (tasksPanel) {
    tasksPanel.hidden = normalizedView !== "overview";
  }

  setTopbarContent(normalizedView);
  setActiveNav(normalizedView);
  syncActionButtons(normalizedView);
}

function handleRouteClick(event) {
  const route = event.currentTarget.dataset.route;

  if (route === "accounts:logout") {
    event.preventDefault();
    try {
      window.sessionStorage.removeItem(SELLER_DASHBOARD_PROFILE_KEY);
    } catch (error) {
      // No-op if storage is unavailable.
    }
    window.location.href = "../index.html";
    return;
  }

  if (route === "orders:seller_order_list") {
    event.preventDefault();

    if (currentDashboardView === "orders") {
      openOrderList();
    } else {
      currentOrdersSubview = "list";
      selectedOrderId = null;
      setDashboardView("orders");
    }

    if (isCompactScreen()) {
      closeSidebarDrawer();
    }

    return;
  }

  if (route === "orders:seller_order_detail") {
    event.preventDefault();

    const orderId = event.currentTarget.dataset.orderId || event.currentTarget.dataset.order || "";

    if (orderId) {
      openOrderDetail(orderId);
    } else if (currentDashboardView !== "orders") {
      currentOrdersSubview = "list";
      selectedOrderId = null;
      setDashboardView("orders");
    }

    if (isCompactScreen()) {
      closeSidebarDrawer();
    }

    return;
  }

  const view = getDashboardViewFromRoute(route);

  if (!view) {
    return;
  }

  event.preventDefault();

  if (view === "add-product") {
    startCreateProductForm();
  }

  if (view === "products") {
    resetProductFormState();
  }

  setDashboardView(view);

  if (isCompactScreen()) {
    closeSidebarDrawer();
  }
}

function bindRouteLinks() {
  const routeLinks = Array.from(document.querySelectorAll("[data-route]"));

  routeLinks.forEach((link) => {
    if (boundRouteLinks.has(link)) {
      return;
    }

    boundRouteLinks.add(link);
    link.addEventListener("click", handleRouteClick);
  });
}

function formatPriceValue(value) {
  const raw = String(value || "").trim();

  if (!raw) {
    return "GH₵ 0.00";
  }

  const normalized = raw.replace(/[^0-9.]/g, "");
  const numeric = Number(normalized);

  if (normalized && Number.isFinite(numeric)) {
    return `GH₵ ${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numeric)}`;
  }

  if (/^ghs/i.test(raw) || /^gh₵/i.test(raw)) {
    return raw.replace(/^ghs/i, "GH₵").replace(/^gh₵/i, "GH₵");
  }

  return raw.replace(/^\$/, "GH₵ ");
}

function getInventoryFill(status, stockCount) {
  const normalizedStatus = slugify(status);

  if (normalizedStatus === "out-of-stock") {
    return 0;
  }

  if (normalizedStatus === "low-stock") {
    return clamp(Math.max(12, stockCount * 6), 12, 40);
  }

  if (normalizedStatus === "in-stock") {
    return clamp(60 + stockCount * 2, 60, 95);
  }

  return clamp(stockCount * 8, 0, 100);
}

function resetAddProductUploads() {
  if (productImageCopy) {
    productImageCopy.textContent = "Click to upload image";
  }

  if (productImageSupport) {
    productImageSupport.textContent = "JPG or PNG";
  }
}

function syncAddProductUploads() {
  if (productImageInput && productImageCopy && productImageSupport) {
    const imageFile = productImageInput.files && productImageInput.files[0];
    if (imageFile) {
      productImageCopy.textContent = imageFile.name;
      productImageSupport.textContent = "Ready to upload";
    } else {
      productImageCopy.textContent = "Click to upload image";
      productImageSupport.textContent = "JPG or PNG";
    }
  }
}

function getProductById(productId) {
  const products = Array.isArray(dashboardData.products) ? dashboardData.products : [];
  return products.find((product) => String(product.id) === String(productId)) || null;
}

function createProductId(name) {
  return `${slugify(name)}-${Math.random().toString(36).slice(2, 8)}`;
}

function resetProductFormState() {
  editingProductId = null;

  if (productForm) {
    productForm.reset();
  }

  resetAddProductUploads();

  if (productFormSubmit) {
    productFormSubmit.textContent = "Register product";
  }
}

function startCreateProductForm() {
  resetProductFormState();
}

function startEditProductForm(product) {
  if (!productForm || !product) {
    return;
  }

  editingProductId = String(product.id);
  productForm.reset();

  const nameField = productForm.elements.namedItem("name");
  const categoryField = productForm.elements.namedItem("category");
  const priceField = productForm.elements.namedItem("price");
  const stockField = productForm.elements.namedItem("stock");
  const activeField = productForm.elements.namedItem("is_active");
  const descriptionField = productForm.elements.namedItem("description");

  if (nameField) {
    nameField.value = getProductName(product);
  }

  if (categoryField) {
    categoryField.value = String(product.categoryValue || product.category || product.categoryLabel || "");
  }

  if (priceField) {
    const numericPrice = Number(product.price);
    priceField.value = Number.isFinite(numericPrice) ? String(numericPrice) : "";
  }

  if (stockField) {
    stockField.value = String(Number(product.stock) || 0);
  }

  if (activeField) {
    activeField.checked = Boolean(product.is_active);
  }

  if (descriptionField) {
    descriptionField.value = String(product.description || "");
  }

  if (productImageCopy) {
    productImageCopy.textContent = product.image ? "Current image kept until replaced" : "Click to upload image";
  }

  if (productImageSupport) {
    productImageSupport.textContent = product.image ? "Upload a new file to replace it" : "JPG or PNG";
  }

  if (productFormSubmit) {
    productFormSubmit.textContent = "Update product";
  }
}

function handleProductAction(event) {
  const control = event.target.closest("[data-product-action]");

  if (!control) {
    return;
  }

  event.preventDefault();

  const action = String(control.dataset.productAction || "");
  const productId = String(control.dataset.productId || "");
  const productIndex = Array.isArray(dashboardData.products)
    ? dashboardData.products.findIndex((item) => String(item.id) === productId)
    : -1;
  const product = productIndex >= 0 ? dashboardData.products[productIndex] : null;

  if (!product) {
    return;
  }

  if (action === "edit") {
    startEditProductForm(product);
    setDashboardView("add-product");
    return;
  }

  if (action === "toggle-active") {
    dashboardData.products[productIndex] = {
      ...product,
      is_active: !product.is_active,
    };
    renderProducts();
    return;
  }

  if (action === "delete") {
    const shouldDelete = window.confirm(`Delete "${getProductName(product)}"? This cannot be undone.`);
    if (!shouldDelete) {
      return;
    }

    dashboardData.products.splice(productIndex, 1);
    renderProducts();
    return;
  }
}

function handleProductFormSubmit(event) {
  event.preventDefault();

  if (!productForm) {
    return;
  }

  const formData = new FormData(productForm);
  const name = String(formData.get("name") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const price = Number(formData.get("price") || 0);
  const stock = clamp(Number(formData.get("stock")) || 0, 0, 9999);
  const isActive = Boolean(formData.get("is_active"));
  const description = String(formData.get("description") || "").trim();
  const imageFile = productImageInput?.files?.[0] || null;
  const existingProduct = editingProductId ? getProductById(editingProductId) : null;
  const imageSource = imageFile ? URL.createObjectURL(imageFile) : existingProduct?.image || "";
  const productRecord = {
    id: existingProduct?.id || createProductId(name),
    name,
    category,
    categoryLabel: category,
    price,
    stock,
    is_active: isActive,
    description,
    image: imageSource,
  };

  if (editingProductId) {
    const productIndex = Array.isArray(dashboardData.products)
      ? dashboardData.products.findIndex((item) => String(item.id) === String(editingProductId))
      : -1;

    if (productIndex >= 0) {
      dashboardData.products[productIndex] = productRecord;
    } else {
      dashboardData.products.unshift(productRecord);
    }
  } else {
    dashboardData.products.unshift(productRecord);
  }

  renderMetrics();
  renderProducts();
  resetProductFormState();
  setDashboardView("products");
}

function renderMetrics() {
  const metrics = Array.isArray(dashboardData.metrics) ? dashboardData.metrics : [];

  metricGrid.innerHTML = metrics
    .map(
      (metric) => `
        <article class="metric-card metric-card--${slugify(metric.tone)}">
          <span class="metric-icon" aria-hidden="true">${getMetricIcon(metric.icon)}</span>
          <div>
            <span class="metric-label">${escapeHtml(metric.label)}</span>
            <strong class="metric-value">${escapeHtml(metric.value)}</strong>
            <span class="metric-note">${escapeHtml(metric.note)}</span>
          </div>
        </article>
      `
    )
    .join("");
}

function renderProducts() {
  const products = Array.isArray(dashboardData.products) ? dashboardData.products : [];
  const emptyMarkup = `
    <div class="product-empty-state">
      <strong>You have no products yet.</strong>
      <p>Add a listing to start managing it from this page.</p>
      <a class="button button-primary" href="#" data-route="products:product_create">Add New Product</a>
    </div>
  `;

  if (productList) {
    productList.innerHTML = products.length
      ? products.map((product, index) => getProductCardMarkup(product, index)).join("")
      : emptyMarkup;
  }

  if (productManagementList) {
    productManagementList.innerHTML = products.length
      ? products.map((product, index) => getProductManagementMarkup(product, index)).join("")
      : emptyMarkup;
  }

  bindRouteLinks();
}

function renderOrders() {
  const orders = sellerOrders;
  const totalOrders = orders.length;
  const emptyMarkup = `
    <div class="order-empty-state">
      <strong>No incoming orders yet.</strong>
      <p>Once buyers place orders, they will appear here for review and status updates.</p>
    </div>
  `;

  if (ordersPreviewCount) {
    ordersPreviewCount.textContent = `${totalOrders} order${totalOrders === 1 ? "" : "s"}`;
  }

  if (ordersListCount) {
    ordersListCount.textContent = `${totalOrders} order${totalOrders === 1 ? "" : "s"}`;
  }

  if (ordersPreviewView) {
    ordersPreviewView.hidden = currentDashboardView !== "overview";
  }

  if (ordersListView) {
    ordersListView.hidden = currentDashboardView !== "orders" || currentOrdersSubview !== "list";
  }

  if (orderDetailView) {
    orderDetailView.hidden = currentDashboardView !== "orders" || currentOrdersSubview !== "detail";
  }

  if (ordersPreviewList) {
    const previewOrders = totalOrders ? orders.slice(0, 2) : [];
    ordersPreviewList.innerHTML = previewOrders.length
      ? previewOrders.map((order) => getOrderSnapshotMarkup(order)).join("")
      : emptyMarkup;
  }

  if (ordersList) {
    ordersList.innerHTML = orders.length
      ? orders.map((order, index) => getOrderCardMarkup(order, index)).join("")
      : emptyMarkup;
  }

  if (currentDashboardView === "orders" && currentOrdersSubview === "detail") {
    const selectedOrder = getOrderById(selectedOrderId) || orders[0] || null;

    if (selectedOrder) {
      renderOrderDetail(selectedOrder);
    } else if (orderDetailItems) {
      orderDetailItems.innerHTML = emptyMarkup;
    }
  }

  bindRouteLinks();
}

function renderTasks() {
  const tasks = Array.isArray(dashboardData.tasks) ? dashboardData.tasks : [];

  taskList.innerHTML = tasks
    .map(
      (task) => `
        <article class="task-item ${getTaskToneClass(task.status)}">
          <span class="task-marker" aria-hidden="true"></span>
          <div class="task-copy">
            <strong>${escapeHtml(task.title)}</strong>
            <p>${escapeHtml(task.copy)}</p>
            <div class="task-meta">
              <span class="task-badge ${getTaskBadgeClass(task.status)}">${escapeHtml(
                task.badge
              )}</span>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  const totalTasks = tasks.length || 1;
  const doneTasks = tasks.filter((task) => slugify(task.status) === "done").length;
  const attentionTasks = Math.max(0, totalTasks - doneTasks);
  const completion = Math.round((doneTasks / totalTasks) * 100);

  taskProgressBar.style.width = `${completion}%`;
  taskProgressLabel.textContent = `${doneTasks}/${tasks.length} complete`;
  taskCount.textContent = `${attentionTasks} need attention`;
}

function handleOrderPanelClick(event) {
  const control = event.target.closest("[data-order-action]");

  if (!control) {
    return;
  }

  event.preventDefault();

  const action = String(control.dataset.orderAction || "");
  const orderId = String(control.dataset.orderId || "");

  if (action === "view") {
    openOrderDetail(orderId);
  }
}

function handleOrderStatusSubmit(event) {
  event.preventDefault();

  if (!selectedOrderId) {
    return;
  }

  const selectedOrder = getOrderById(selectedOrderId);
  if (!selectedOrder) {
    return;
  }

  const nextStatus = String(orderStatusSelect?.value || selectedOrder.status || "New").trim() || "New";
  selectedOrder.status = nextStatus;

  renderOrders();
  syncActionButtons("orders");
}

function renderDashboard() {
  currentOrdersSubview = "list";
  selectedOrderId = null;
  renderMetrics();
  renderProducts();
  renderOrders();
  renderTasks();
  resetProductFormState();
  setDashboardView("overview");
}

bindRouteLinks();

if (sidebarToggle) {
  sidebarToggle.addEventListener("click", toggleSidebarDrawer);
}

if (sidebarBackdrop) {
  sidebarBackdrop.addEventListener("click", closeSidebarDrawer);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSidebarDrawer();
  }
});

window.addEventListener("resize", syncSidebarDrawerState);
window.addEventListener("orientationchange", syncSidebarDrawerState);

if (productImageInput) {
  productImageInput.addEventListener("change", syncAddProductUploads);
}

if (productForm) {
  productForm.addEventListener("submit", handleProductFormSubmit);
}

if (productManagementList) {
  productManagementList.addEventListener("click", handleProductAction);
}

document.addEventListener("click", handleOrderPanelClick);

if (orderDetailBack) {
  orderDetailBack.addEventListener("click", openOrderList);
}

if (orderStatusForm) {
  orderStatusForm.addEventListener("submit", handleOrderStatusSubmit);
}

window.addEventListener("DOMContentLoaded", renderDashboard);
