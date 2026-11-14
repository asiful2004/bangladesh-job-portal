/**
 * ====================================================================
 * CATEGORY PAGE FILTERING, SORTING & PAGINATION ENGINE
 * ====================================================================
 */

let currentCategoryJobs = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 6;

async function initCategoryPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const catSlug = urlParams.get("cat") || "govt";

  const categories = await fetchCategories();
  const allJobs = await fetchJobs();

  const category = categories.find(c => c.id === catSlug || c.slug === catSlug) || categories[0];

  // Update Hero & Meta
  updateCategoryHeader(category);

  // Filter jobs belonging to this category
  currentCategoryJobs = allJobs.filter(j => j.categorySlug === category.id || (j.category && j.category.includes(category.nameBn)));

  // Update Category SEO
  if (typeof updatePageSEO === "function") {
    updatePageSEO({
      title: `${category.nameBn} নিয়োগ বিজ্ঞপ্তি ও পরীক্ষার খবর`,
      description: `${category.nameBn} (${category.nameEn}) - ${category.description}`,
      canonicalUrl: `${window.location.origin}/category.html?cat=${category.id}`,
      type: "website"
    });
  }

  if (typeof injectBreadcrumbsSchema === "function") {
    injectBreadcrumbsSchema([
      { name: "হোম", url: "index.html" },
      { name: "ক্যাটাগরি", url: "category.html" },
      { name: category.nameBn, url: `category.html?cat=${category.id}` }
    ]);
  }

  // Populate dynamic category navigation list in sidebar
  renderCategorySidebarList(categories, category.id);

  // Setup event listeners for sorting and filtering
  const sortSelect = document.getElementById("cat-sort");
  const statusSelect = document.getElementById("cat-status");

  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      currentPage = 1;
      applyCategoryFilters();
    });
  }

  if (statusSelect) {
    statusSelect.addEventListener("change", () => {
      currentPage = 1;
      applyCategoryFilters();
    });
  }

  applyCategoryFilters();
}

function updateCategoryHeader(category) {
  const titleEl = document.getElementById("cat-title");
  const titleEnEl = document.getElementById("cat-title-en");
  const descEl = document.getElementById("cat-desc");
  const countEl = document.getElementById("cat-count-badge");
  const breadcrumbEl = document.getElementById("breadcrumb-current");

  if (titleEl) titleEl.textContent = category.nameBn;
  if (titleEnEl) titleEnEl.textContent = category.nameEn;
  if (descEl) descEl.textContent = category.description;
  if (breadcrumbEl) breadcrumbEl.textContent = category.nameBn;
  if (countEl) countEl.textContent = `${toBanglaNumber(category.count || currentCategoryJobs.length)}টি বিজ্ঞপ্তি`;
}

function renderCategorySidebarList(categories, currentId) {
  const container = document.getElementById("sidebar-categories-list");
  if (!container) return;

  container.innerHTML = categories.map(c => `
    <li class="${c.id === currentId ? 'active' : ''}">
      <a href="category.html?cat=${c.id}">
        <span class="cat-link-title">${c.nameBn}</span>
        <span class="cat-count-pill">${toBanglaNumber(c.count || 0)}</span>
      </a>
    </li>
  `).join("");
}

function applyCategoryFilters() {
  const sortVal = document.getElementById("cat-sort") ? document.getElementById("cat-sort").value : "newest";
  const statusVal = document.getElementById("cat-status") ? document.getElementById("cat-status").value : "all";
  const resultsContainer = document.getElementById("category-jobs-grid");
  const paginationContainer = document.getElementById("category-pagination");
  const emptyState = document.getElementById("cat-empty-state");

  if (!resultsContainer) return;

  let filtered = [...currentCategoryJobs];

  // Status Filter
  if (statusVal !== "all") {
    filtered = filtered.filter(j => calculateJobStatus(j.deadline).status === statusVal);
  }

  // Sorting
  if (sortVal === "newest") {
    filtered.sort((a, b) => new Date(b.publishedDate || 0) - new Date(a.publishedDate || 0));
  } else if (sortVal === "deadline") {
    filtered.sort((a, b) => new Date(a.deadline || 0) - new Date(b.deadline || 0));
  } else if (sortVal === "views") {
    filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
  }

  if (filtered.length === 0) {
    resultsContainer.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
    if (paginationContainer) paginationContainer.innerHTML = "";
    return;
  }

  if (emptyState) emptyState.style.display = "none";

  // Pagination calculation
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  if (currentPage > totalPages) currentPage = totalPages;
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // Render cards
  let html = "";
  paginatedItems.forEach((job, index) => {
    html += renderJobCard(job);
    if (index === 2 && typeof AdSlotBetweenCards === "function") {
      html += `<div class="grid-ad-container">${AdSlotBetweenCards()}</div>`;
    }
  });

  resultsContainer.innerHTML = html;
  renderPagination(totalPages, paginationContainer);
}

function renderPagination(totalPages, container) {
  if (!container || totalPages <= 1) {
    if (container) container.innerHTML = "";
    return;
  }

  let html = `<div class="pagination-wrapper">`;

  // Previous button
  html += `
    <button class="page-btn page-nav" ${currentPage === 1 ? 'disabled' : ''} onclick="goToCategoryPage(${currentPage - 1})" aria-label="পূর্ববর্তী পৃষ্ঠা">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg> পূর্ববর্তী
    </button>
  `;

  // Numbered pages
  for (let i = 1; i <= totalPages; i++) {
    html += `
      <button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToCategoryPage(${i})">
        ${toBanglaNumber(i)}
      </button>
    `;
  }

  // Next button
  html += `
    <button class="page-btn page-nav" ${currentPage === totalPages ? 'disabled' : ''} onclick="goToCategoryPage(${currentPage + 1})" aria-label="পরবর্তী পৃষ্ঠা">
      পরবর্তী <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
    </button>
  `;

  html += `</div>`;
  container.innerHTML = html;
}

function goToCategoryPage(page) {
  currentPage = page;
  applyCategoryFilters();
  window.scrollTo({ top: 350, behavior: "smooth" });
}

window.goToCategoryPage = goToCategoryPage;
window.initCategoryPage = initCategoryPage;
