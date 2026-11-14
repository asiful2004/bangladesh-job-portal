/**
 * ====================================================================
 * JAVASCRIPT SEARCH ENGINE & FILTERING
 * ====================================================================
 */

let allJobsCache = [];
let allCategoriesCache = [];

/**
 * Initializes Search Page or Header Quick-Search
 */
async function initSearchEngine() {
  allJobsCache = await fetchJobs();
  allCategoriesCache = await fetchCategories();

  const searchInput = document.getElementById("search-input");
  const searchForm = document.getElementById("search-form");
  const clearBtn = document.getElementById("search-clear-btn");
  const suggestionsBox = document.getElementById("search-suggestions");
  const categoryFilter = document.getElementById("filter-category");
  const statusFilter = document.getElementById("filter-status");
  const sortSelect = document.getElementById("sort-by");

  // Read URL parameters if present
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("q") || "";
  const initialCategory = params.get("cat") || "";
  const initialStatus = params.get("status") || "";

  if (searchInput) {
    searchInput.value = initialQuery;
    if (initialQuery.length > 0 && clearBtn) {
      clearBtn.style.display = "inline-flex";
    }
  }

  if (categoryFilter && initialCategory) {
    categoryFilter.value = initialCategory;
  }
  if (statusFilter && initialStatus) {
    statusFilter.value = initialStatus;
  }

  // Populate Categories Dropdown if empty
  if (categoryFilter && categoryFilter.options.length <= 1) {
    allCategoriesCache.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat.id;
      opt.textContent = `${cat.nameBn} (${cat.nameEn})`;
      if (cat.id === initialCategory) opt.selected = true;
      categoryFilter.appendChild(opt);
    });
  }

  // Perform search immediately on Search page
  if (document.getElementById("search-results-grid")) {
    performSearch();
  }

  // Input listeners
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      if (clearBtn) {
        clearBtn.style.display = val.length > 0 ? "inline-flex" : "none";
      }
      handleSuggestions(val);
      if (document.getElementById("search-results-grid")) {
        performSearch();
      }
    });

    searchInput.addEventListener("focus", (e) => {
      if (e.target.value.trim().length >= 2) {
        handleSuggestions(e.target.value.trim());
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (searchInput) {
        searchInput.value = "";
        searchInput.focus();
      }
      clearBtn.style.display = "none";
      if (suggestionsBox) suggestionsBox.style.display = "none";
      if (document.getElementById("search-results-grid")) {
        performSearch();
      }
    });
  }

  // Filter change listeners
  [categoryFilter, statusFilter, sortSelect].forEach(el => {
    if (el) {
      el.addEventListener("change", () => {
        if (document.getElementById("search-results-grid")) {
          performSearch();
        }
      });
    }
  });

  // Close suggestions if clicked outside
  document.addEventListener("click", (e) => {
    if (suggestionsBox && !suggestionsBox.contains(e.target) && e.target !== searchInput) {
      suggestionsBox.style.display = "none";
    }
  });
}

/**
 * Generates Search Suggestions Dropdown
 */
function handleSuggestions(query) {
  const box = document.getElementById("search-suggestions");
  if (!box) return;

  if (!query || query.length < 2) {
    box.style.display = "none";
    box.innerHTML = "";
    return;
  }

  const q = query.toLowerCase();
  const matches = allJobsCache.filter(j => 
    j.title.toLowerCase().includes(q) ||
    (j.titleEn && j.titleEn.toLowerCase().includes(q)) ||
    (j.organization && j.organization.toLowerCase().includes(q)) ||
    (j.organizationBn && j.organizationBn.toLowerCase().includes(q)) ||
    (j.category && j.category.toLowerCase().includes(q)) ||
    (j.tags && j.tags.some(t => t.toLowerCase().includes(q)))
  ).slice(0, 5);

  if (matches.length === 0) {
    box.style.display = "none";
    return;
  }

  box.innerHTML = matches.map(m => `
    <div class="suggestion-item" onclick="selectSuggestion('${m.id}', '${m.title.replace(/'/g, "\\'")}')">
      <div class="sugg-logo">
        <img src="${m.thumbnail || 'assets/images/logo.svg'}" alt="" width="24" height="24"/>
      </div>
      <div class="sugg-content">
        <span class="sugg-title">${highlightMatch(m.title, query)}</span>
        <span class="sugg-org">${m.organizationBn || m.organization} • ${m.category}</span>
      </div>
    </div>
  `).join("");

  box.style.display = "block";
}

function highlightMatch(text, query) {
  try {
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  } catch (e) {
    return text;
  }
}

function selectSuggestion(id, title) {
  window.location.href = `job.html?id=${id}`;
}
window.selectSuggestion = selectSuggestion;

/**
 * Filter & Search Execution
 */
function performSearch() {
  const searchInput = document.getElementById("search-input");
  const categoryFilter = document.getElementById("filter-category");
  const statusFilter = document.getElementById("filter-status");
  const sortSelect = document.getElementById("sort-by");
  const resultsGrid = document.getElementById("search-results-grid");
  const countBadge = document.getElementById("search-results-count");
  const emptyState = document.getElementById("search-empty-state");

  if (!resultsGrid) return;

  const query = (searchInput ? searchInput.value.trim().toLowerCase() : "");
  const catVal = categoryFilter ? categoryFilter.value : "";
  const statusVal = statusFilter ? statusFilter.value : "";
  const sortVal = sortSelect ? sortSelect.value : "newest";

  // Filter jobs
  let filtered = allJobsCache.filter(job => {
    // Text search query
    let matchesQuery = true;
    if (query) {
      const matchTitle = job.title && job.title.toLowerCase().includes(query);
      const matchTitleEn = job.titleEn && job.titleEn.toLowerCase().includes(query);
      const matchOrg = job.organization && job.organization.toLowerCase().includes(query);
      const matchOrgBn = job.organizationBn && job.organizationBn.toLowerCase().includes(query);
      const matchLoc = job.location && job.location.toLowerCase().includes(query);
      const matchCat = job.category && job.category.toLowerCase().includes(query);
      const matchDesc = job.description && job.description.toLowerCase().includes(query);
      const matchTags = job.tags && job.tags.some(t => t.toLowerCase().includes(query));

      matchesQuery = (matchTitle || matchTitleEn || matchOrg || matchOrgBn || matchLoc || matchCat || matchDesc || matchTags);
    }

    // Category filter
    let matchesCat = true;
    if (catVal && catVal !== "all") {
      matchesCat = (job.categorySlug === catVal || job.id.includes(catVal));
    }

    // Status filter
    let matchesStatus = true;
    const currentStatus = calculateJobStatus(job.deadline).status;
    if (statusVal && statusVal !== "all") {
      matchesStatus = (currentStatus === statusVal);
    }

    return matchesQuery && matchesCat && matchesStatus;
  });

  // Sorting
  if (sortVal === "newest") {
    filtered.sort((a, b) => new Date(b.publishedDate || 0) - new Date(a.publishedDate || 0));
  } else if (sortVal === "deadline") {
    filtered.sort((a, b) => new Date(a.deadline || 0) - new Date(b.deadline || 0));
  } else if (sortVal === "views") {
    filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
  }

  // Update Result Count
  if (countBadge) {
    countBadge.textContent = `${toBanglaNumber(filtered.length)}টি সার্কুলার পাওয়া গেছে`;
  }

  // Render or Empty State
  if (filtered.length === 0) {
    resultsGrid.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
  } else {
    if (emptyState) emptyState.style.display = "none";
    
    // Inject Ad between results if more than 3
    let html = "";
    filtered.forEach((job, idx) => {
      html += renderJobCard(job);
      if (idx === 2 && typeof AdSlotBetweenCards === "function") {
        html += `<div class="grid-ad-container">${AdSlotBetweenCards()}</div>`;
      }
    });

    resultsGrid.innerHTML = html;
  }
}

// Global hook
window.initSearchEngine = initSearchEngine;
window.performSearch = performSearch;
