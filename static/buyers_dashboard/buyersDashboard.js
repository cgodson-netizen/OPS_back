// ─── Constants ───────────────────────────────────────────────────────────────
const BUYER_CART_PAGE_URL = "/cart/";
const BUYER_ORDERS_PAGE_URL = "/orders/";
const CART_ADD_BASE_URL = "/cart/add/";

// ─── Elements ────────────────────────────────────────────────────────────────
const elements = {
  dashboardMain: document.getElementById("dashboard-main"),
  overviewSection: document.getElementById("overview-section"),
  heroGreeting: document.getElementById("hero-greeting"),
  heroTitle: document.getElementById("hero-title"),
  heroText: document.getElementById("hero-text"),
  heroImage: document.querySelector(".hero-image"),
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
  topnavLinks: Array.from(document.querySelectorAll(".nav-link")),
};

// ─── State ───────────────────────────────────────────────────────────────────
const productsPerPage = 9;
let activeCategory = "all";
let searchQuery = "";
let currentPage = 1;

// ─── Read Django-rendered products from DOM ──────────────────────────────────
function getDjangoProducts() {
  const cards = Array.from(document.querySelectorAll(".product-card[data-product-id]"));
  return cards.map(card => ({
    id: card.dataset.productId,
    title: card.dataset.productName || "",
    categorySlug: card.dataset.categorySlug || "all",
    categoryLabel: card.dataset.categoryLabel || "",
    price: parseFloat(card.dataset.price || 0),
    stock: parseInt(card.dataset.stock || 0),
    image: card.dataset.image || "",
    slug: card.dataset.slug || "",
    element: card,
  }));
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] || c)
  );
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function isCompactScreen() {
  return ["tablet", "phone"].includes(document.documentElement.dataset.screen || "");
}

function getGreeting() {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
}

function getCsrfToken() {
  return document.cookie.split(";")
    .map(c => c.trim())
    .find(c => c.startsWith("csrftoken="))
    ?.split("=")[1] || "";
}

// ─── Navigation ──────────────────────────────────────────────────────────────
function setBuyerNavDrawerState(isOpen) {
  const shouldOpen = Boolean(isOpen) && isCompactScreen();
  document.body?.classList.toggle("nav-open", shouldOpen);
  if (elements.navToggle) {
    elements.navToggle.setAttribute("aria-expanded", String(shouldOpen));
    elements.navToggle.classList.toggle("is-open", shouldOpen);
  }
}

function closeBuyerNavDrawer() { setBuyerNavDrawerState(false); }
function toggleBuyerNavDrawer() {
  setBuyerNavDrawerState(!document.body?.classList.contains("nav-open"));
}

// ─── Filtering ───────────────────────────────────────────────────────────────
function filterProducts() {
  const products = getDjangoProducts();
  const query = searchQuery.trim().toLowerCase();

  return products.filter(p => {
    const matchCat = activeCategory === "all" || p.categorySlug === activeCategory;
    const matchSearch = !query || p.title.toLowerCase().includes(query) ||
      p.categoryLabel.toLowerCase().includes(query);
    return matchCat && matchSearch;
  });
}

function renderCategoryFilters() {
  if (!elements.categoryList) return;
  const products = getDjangoProducts();
  const categories = new Map([["all", { label: "All Products", count: products.length }]]);

  products.forEach(p => {
    if (p.categorySlug && !categories.has(p.categorySlug)) {
      categories.set(p.categorySlug, { label: p.categoryLabel, count: 0 });
    }
    if (p.categorySlug) categories.get(p.categorySlug).count++;
  });

  elements.categoryList.innerHTML = Array.from(categories.entries()).map(([id, { label, count }]) => `
    <button class="filter-chip${activeCategory === id ? " is-active" : ""}" type="button" data-category="${escapeHtml(id)}">
      <span class="filter-chip__label"><span>${escapeHtml(label)}</span></span>
      <span class="filter-chip__meta">${count}</span>
    </button>
  `).join("");
}

function renderProducts() {
  renderCategoryFilters();
  const filtered = filterProducts();
  const totalPages = Math.max(1, Math.ceil(filtered.length / productsPerPage));
  currentPage = clamp(currentPage, 1, totalPages);
  const start = (currentPage - 1) * productsPerPage;
  const visible = filtered.slice(start, start + productsPerPage);

  if (elements.catalogSummary) {
    elements.catalogSummary.textContent = filtered.length
      ? `Showing ${start + 1}–${Math.min(start + visible.length, filtered.length)} of ${filtered.length} products`
      : "No products match the current filter.";
  }

  // Show/hide product cards
  getDjangoProducts().forEach(p => {
    p.element.style.display = visible.find(v => v.id === p.id) ? "" : "none";
  });

  renderPager(totalPages);
}

function renderPager(totalPages) {
  if (!elements.productPager) return;
  if (totalPages <= 1) { elements.productPager.innerHTML = ""; return; }

  elements.productPager.innerHTML = `
    <button class="pager-nav" type="button" data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""}>← Previous</button>
    ${Array.from({ length: totalPages }, (_, i) => i + 1).map(p => `
      <button class="pager-page${p === currentPage ? " is-active" : ""}" type="button" data-page="${p}"
        ${p === currentPage ? 'aria-current="page"' : ""}>${p}</button>
    `).join("")}
    <button class="pager-nav" type="button" data-page="${currentPage + 1}" ${currentPage === totalPages ? "disabled" : ""}>Next →</button>
  `;
}

// ─── Cart Actions ─────────────────────────────────────────────────────────────
function addToCart(productId) {
  fetch(`${CART_ADD_BASE_URL}${productId}/`, {
    method: "POST",
    headers: { "X-CSRFToken": getCsrfToken(), "Content-Type": "application/json" },
  })
  .then(res => {
    if (res.ok) {
      // Update cart badge
      if (elements.cartBadge) {
        const current = parseInt(elements.cartBadge.textContent || "0");
        elements.cartBadge.textContent = String(current + 1);
        elements.cartBadge.hidden = false;
      }
    }
  })
  .catch(() => {});
}

function buyNow(productId) {
  fetch(`${CART_ADD_BASE_URL}${productId}/`, {
    method: "POST",
    headers: { "X-CSRFToken": getCsrfToken(), "Content-Type": "application/json" },
  })
  .then(() => { window.location.href = BUYER_CART_PAGE_URL; })
  .catch(() => { window.location.href = BUYER_CART_PAGE_URL; });
}

// ─── Global Click Handler ─────────────────────────────────────────────────────
function handleGlobalClick(event) {
  // Category filter
  const categoryBtn = event.target.closest("[data-category]");
  if (categoryBtn) {
    activeCategory = categoryBtn.dataset.category || "all";
    currentPage = 1;
    renderProducts();
    return;
  }

  // Pager
  const pageBtn = event.target.closest("[data-page]");
  if (pageBtn && !pageBtn.disabled) {
    const filtered = filterProducts();
    const totalPages = Math.max(1, Math.ceil(filtered.length / productsPerPage));
    currentPage = clamp(parseInt(pageBtn.dataset.page || 1), 1, totalPages);
    renderProducts();
    return;
  }

  // Product actions (Add to Cart / Buy Now)
  const productAction = event.target.closest("[data-product-action]");
  if (productAction) {
    const action = productAction.dataset.productAction;
    const productId = productAction.dataset.productId;
    if (action === "add") addToCart(productId);
    if (action === "buy") buyNow(productId);
    return;
  }

  // Reset filters
  if (event.target.closest("[data-action='reset-filters']")) {
    searchQuery = "";
    activeCategory = "all";
    currentPage = 1;
    if (elements.productSearchInput) elements.productSearchInput.value = "";
    renderProducts();
  }
}

// ─── Search ──────────────────────────────────────────────────────────────────
function handleSearchSubmit(event) {
  event.preventDefault();
  searchQuery = elements.productSearchInput?.value || "";
  currentPage = 1;
  renderProducts();
}

// ─── Init ────────────────────────────────────────────────────────────────────
function init() {
  // Set greeting
  if (elements.heroGreeting) {
    const name = elements.heroGreeting.dataset.name || "Buyer";
    elements.heroGreeting.textContent = `${getGreeting()}, ${name}.`;
  }

  renderProducts();

  document.addEventListener("click", handleGlobalClick);

  if (elements.navToggle) elements.navToggle.addEventListener("click", toggleBuyerNavDrawer);
  if (elements.navBackdrop) elements.navBackdrop.addEventListener("click", closeBuyerNavDrawer);
  if (elements.productSearchForm) elements.productSearchForm.addEventListener("submit", handleSearchSubmit);
  if (elements.productSearchInput) {
    elements.productSearchInput.addEventListener("input", e => {
      searchQuery = e.target.value || "";
      currentPage = 1;
      renderProducts();
    });
  }

  window.addEventListener("resize", () => { if (!isCompactScreen()) closeBuyerNavDrawer(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeBuyerNavDrawer(); });
}

init();