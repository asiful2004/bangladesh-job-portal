/**
 * ====================================================================
 * CORE APPLICATION COORDINATOR (APP.JS)
 * ====================================================================
 */

document.addEventListener("DOMContentLoaded", async function () {
  // 1. Initialize Mobile Menu Navigation
  initMobileNav();

  // 1.1 Initialize Mobile Header Search Bar
  initMobileSearch();

  // 2. Initialize Back to Top Button
  initBackToTop();

  // 3. Initialize Breaking News Ticker
  initBreakingNewsTicker();

  // 4. Update Bookmark Badges
  if (typeof updateBookmarkBadges === "function") {
    updateBookmarkBadges();
  }

  // 5. Header Search Form Listener
  initHeaderSearch();

  // 6. Newsletter Subscription Form Handler
  initNewsletterForm();

  // 7. Route based on current page
  const path = window.location.pathname.toLowerCase();

  if (path.endsWith("index.html") || path.endsWith("/") || path === "") {
    initHomePage();
  } else if (path.endsWith("job.html")) {
    initJobDetailPage();
  } else if (path.endsWith("category.html")) {
    if (typeof initCategoryPage === "function") initCategoryPage();
  } else if (path.endsWith("search.html")) {
    if (typeof initSearchEngine === "function") initSearchEngine();
  } else if (path.endsWith("bookmarks.html")) {
    initBookmarksPage();
  }
});

/**
 * Mobile Navigation Drawer
 */
function initMobileNav() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const closeBtn = document.getElementById("mobile-menu-close");
  const navDrawer = document.getElementById("mobile-nav-drawer");
  const overlay = document.getElementById("mobile-nav-overlay");

  if (!toggleBtn || !navDrawer) return;

  function openMenu() {
    navDrawer.classList.add("is-open");
    if (overlay) overlay.classList.add("is-visible");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    navDrawer.classList.remove("is-open");
    if (overlay) overlay.classList.remove("is-visible");
    document.body.style.overflow = "";
  }

  toggleBtn.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);
  if (overlay) overlay.addEventListener("click", closeMenu);

  // Close drawer when any nav link inside drawer is clicked
  const drawerLinks = navDrawer.querySelectorAll(".drawer-nav-item a");
  drawerLinks.forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  // Close drawer on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navDrawer.classList.contains("is-open")) {
      closeMenu();
    }
  });
}

/**
 * Mobile Search Bar Dropdown Toggle
 */
function initMobileSearch() {
  const toggleBtn = document.getElementById("mobile-search-toggle");
  const searchBar = document.getElementById("mobile-search-bar");
  const closeBtn = document.getElementById("mobile-search-close");
  const searchInput = document.getElementById("mobile-search-input");
  const searchForm = document.getElementById("mobile-search-form");

  if (!toggleBtn || !searchBar) return;

  function openSearch() {
    searchBar.classList.add("is-open");
    toggleBtn.classList.add("active");
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 150);
    }
  }

  function closeSearch() {
    searchBar.classList.remove("is-open");
    toggleBtn.classList.remove("active");
  }

  toggleBtn.addEventListener("click", () => {
    if (searchBar.classList.contains("is-open")) {
      closeSearch();
    } else {
      openSearch();
    }
  });

  if (closeBtn) closeBtn.addEventListener("click", closeSearch);

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = searchInput ? searchInput.value.trim() : "";
      if (q) {
        window.location.href = `search.html?q=${encodeURIComponent(q)}`;
      }
    });
  }

  // Close search when pressing Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchBar.classList.contains("is-open")) {
      closeSearch();
    }
  });
}

/**
 * Back to Top Floating Button
 */
function initBackToTop() {
  const btn = document.getElementById("back-to-top-btn");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 350) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/**
 * Breaking Job News Ticker
 */
async function initBreakingNewsTicker() {
  const tickerEl = document.getElementById("ticker-content");
  if (!tickerEl) return;

  const news = await fetchBreakingNews();
  if (!news || news.length === 0) return;

  let currentIndex = 0;

  function displayTickerItem(index) {
    const item = news[index];
    tickerEl.style.opacity = "0";
    setTimeout(() => {
      tickerEl.innerHTML = `
        <span class="ticker-badge" style="background-color: ${item.tagColor || '#0D47A1'}">${item.tag}</span>
        <a href="${item.link}" class="ticker-link">${item.title}</a>
        <span class="ticker-date">${item.date}</span>
      `;
      tickerEl.style.opacity = "1";
    }, 200);
  }

  displayTickerItem(0);

  // Auto rotate ticker every 5 seconds
  setInterval(() => {
    currentIndex = (currentIndex + 1) % news.length;
    displayTickerItem(currentIndex);
  }, 5000);
}

/**
 * Header Quick Search Form
 */
function initHeaderSearch() {
  const form = document.getElementById("header-search-form");
  const input = document.getElementById("header-search-input");
  if (!form || !input) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (query.length > 0) {
      window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
  });
}

/**
 * Newsletter Subscription UI
 */
function initNewsletterForm() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && emailInput.value.trim()) {
      showToastNotification("ধন্যবাদ! চাকরির সর্বশেষ আপডেট পেতে আপনার সাবস্ক্রিপশন সম্পন্ন হয়েছে।");
      emailInput.value = "";
    }
  });
}

/**
 * Homepage Initializer
 */
async function initHomePage() {
  const jobs = await fetchJobs();
  const featuredIds = await fetchFeaturedIds();
  const categories = await fetchCategories();

  // 1. Featured Jobs Spotlight
  const featuredContainer = document.getElementById("featured-jobs-grid");
  if (featuredContainer) {
    const featuredJobs = jobs.filter(j => featuredIds.includes(j.id) || j.featured).slice(0, 4);
    featuredContainer.innerHTML = featuredJobs.map(j => renderJobCard(j)).join("");
  }

  // 2. Govt Jobs Section
  const govtContainer = document.getElementById("govt-jobs-grid");
  if (govtContainer) {
    const govtJobs = jobs.filter(j => j.categorySlug === "govt").slice(0, 6);
    govtContainer.innerHTML = govtJobs.map(j => renderJobCard(j)).join("");
  }

  // 3. Bank Jobs Section
  const bankContainer = document.getElementById("bank-jobs-grid");
  if (bankContainer) {
    const bankJobs = jobs.filter(j => j.categorySlug === "bank").slice(0, 4);
    bankContainer.innerHTML = bankJobs.map(j => renderJobCard(j)).join("");
  }

  // 4. Private & NGO Jobs Section
  const privateContainer = document.getElementById("private-jobs-grid");
  if (privateContainer) {
    const privateJobs = jobs.filter(j => j.categorySlug === "private" || j.categorySlug === "ngo").slice(0, 4);
    privateContainer.innerHTML = privateJobs.map(j => renderJobCard(j)).join("");
  }

  // 5. IT & Tech Jobs Section
  const itContainer = document.getElementById("it-jobs-grid");
  if (itContainer) {
    const itJobs = jobs.filter(j => j.categorySlug === "it").slice(0, 4);
    itContainer.innerHTML = itJobs.map(j => renderJobCard(j)).join("");
  }

  // 6. Exam Results & Admit Cards Widget
  const noticesContainer = document.getElementById("exam-notices-list");
  if (noticesContainer) {
    const notices = jobs.filter(j => j.categorySlug === "exam-results" || j.categorySlug === "admit-card" || j.categorySlug === "exam-updates").slice(0, 5);
    noticesContainer.innerHTML = notices.map(n => `
      <li class="notice-item">
        <span class="notice-tag tag-${n.categorySlug}">${n.category}</span>
        <a href="job.html?id=${n.id}" class="notice-title">${n.title}</a>
        <span class="notice-date">${formatBanglaDate(n.publishedDate)}</span>
      </li>
    `).join("");
  }

  // 7. Career Advice & Tips Section
  const careerContainer = document.getElementById("career-articles-grid");
  if (careerContainer) {
    const articles = jobs.filter(j => j.categorySlug === "career-advice").slice(0, 3);
    careerContainer.innerHTML = articles.map(a => `
      <article class="career-card">
        <div class="career-thumb">
          <img src="${a.thumbnail || 'assets/images/jobs/career-guide.svg'}" alt="${a.title}" width="60" height="60" loading="lazy" />
        </div>
        <div class="career-content">
          <span class="career-badge">ক্যারিয়ার গাইড</span>
          <h4 class="career-title"><a href="job.html?id=${a.id}">${a.title}</a></h4>
          <p class="career-desc">${a.description.substring(0, 110)}...</p>
          <div class="career-footer">
            <span class="read-time">${calculateReadingTime(a.description)}</span>
            <a href="job.html?id=${a.id}" class="read-more">পড়ুন &rarr;</a>
          </div>
        </div>
      </article>
    `).join("");
  }

  // 8. Dynamic Categories Grid
  const categoriesGrid = document.getElementById("home-categories-grid");
  if (categoriesGrid) {
    categoriesGrid.innerHTML = categories.map(cat => `
      <a href="category.html?cat=${cat.id}" class="category-card-mini">
        <div class="cat-mini-icon" style="background-color: ${cat.badgeColor || '#0D47A1'}20; color: ${cat.badgeColor || '#0D47A1'};">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div class="cat-mini-info">
          <h4 class="cat-mini-name">${cat.nameBn}</h4>
          <span class="cat-mini-count">${toBanglaNumber(cat.count || 0)}টি সার্কুলার</span>
        </div>
      </a>
    `).join("");
  }
}

/**
 * Job Detail Page Renderer
 */
async function initJobDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const jobId = params.get("id");
  const jobSlug = params.get("slug");

  const query = jobId || jobSlug;
  if (!query) {
    window.location.href = "index.html";
    return;
  }

  const job = await getJobByIdOrSlug(query);
  if (!job) {
    document.getElementById("job-detail-main").innerHTML = `
      <div class="alert-box error">
        <h2>বিজ্ঞপ্তিটি পাওয়া যায়নি (Notice Not Found)</h2>
        <p>অনুরোধকৃত সার্কুলারটি খুঁজে পাওয়া যায়নি অথবা মুছে ফেলা হয়েছে।</p>
        <a href="index.html" class="btn btn-primary" style="margin-top:15px; display:inline-block;">হোমপেজে ফিরে যান</a>
      </div>
    `;
    return;
  }

  // Track as Recently Viewed
  addToRecentlyViewed(job);

  // Calculate Expiration
  const statusInfo = calculateJobStatus(job.deadline);
  const isExpired = (statusInfo.status === "expired");

  // Update Dynamic SEO
  if (typeof updatePageSEO === "function") {
    updatePageSEO({
      title: `${job.title} - ${job.organizationBn || job.organization}`,
      description: job.description.substring(0, 160),
      canonicalUrl: `${window.location.origin}/job.html?id=${job.id}`,
      image: job.thumbnail,
      type: "article",
      publishedDate: job.publishedDate,
      updatedDate: job.updatedDate
    });
  }

  // Inject Schemas
  if (typeof injectJobStructuredData === "function") {
    injectJobStructuredData(job, isExpired);
  }
  if (typeof injectBreadcrumbsSchema === "function") {
    injectBreadcrumbsSchema([
      { name: "হোম", url: "index.html" },
      { name: job.category, url: `category.html?cat=${job.categorySlug || 'govt'}` },
      { name: job.title, url: `job.html?id=${job.id}` }
    ]);
  }

  // Populate Details DOM
  renderJobFullView(job, statusInfo, isExpired);
}

function renderJobFullView(job, statusInfo, isExpired) {
  const container = document.getElementById("job-detail-main");
  if (!container) return;

  const orgName = job.organizationBn || job.organization;
  const deadlineBn = formatBanglaDate(job.deadline);
  const publishedBn = formatBanglaDate(job.publishedDate);
  const updatedBn = formatBanglaDate(job.updatedDate || job.publishedDate);
  const readingTime = calculateReadingTime(job.description + (job.requirements || []).join(" "));
  const isBookmarked = isJobBookmarked(job.id);

  // Status Banner HTML
  let statusBannerHtml = "";
  if (isExpired) {
    statusBannerHtml = `
      <div class="status-banner banner-expired">
        <div class="banner-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <div class="banner-content">
          <h4>আবেদনের সময়সীমা উত্তীর্ণ (Expired Notice)</h4>
          <p>${statusInfo.alertMessage}</p>
        </div>
      </div>
    `;
  } else if (statusInfo.status === "closing-soon") {
    statusBannerHtml = `
      <div class="status-banner banner-closing">
        <div class="banner-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div class="banner-content">
          <h4>শীঘ্রই আবেদন শেষ হচ্ছে (Closing Soon)</h4>
          <p>${statusInfo.alertMessage}</p>
        </div>
      </div>
    `;
  }

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(job.title);

  container.innerHTML = `
    <!-- Breadcrumbs -->
    <nav class="article-breadcrumbs" aria-label="Breadcrumb">
      <a href="index.html">হোম</a>
      <span class="separator">/</span>
      <a href="category.html?cat=${job.categorySlug}">${job.category}</a>
      <span class="separator">/</span>
      <span class="current">${job.title}</span>
    </nav>

    ${statusBannerHtml}

    <!-- Article Header -->
    <header class="article-header">
      <div class="article-category-row">
        <span class="category-pill pill-${job.categorySlug}">${job.category}</span>
        ${job.verified ? `<span class="verified-badge"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> যাচাইকৃত সার্কুলার</span>` : ''}
        <span class="article-reading-time"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${readingTime}</span>
      </div>

      <h1 class="article-title">${job.title}</h1>
      <h2 class="article-subtitle">${job.titleEn || orgName}</h2>

      <div class="article-author-meta">
        <div class="author-logo">
          <img src="${job.thumbnail || 'assets/images/logo.svg'}" alt="${orgName}" width="52" height="52" />
        </div>
        <div class="author-details">
          <span class="author-name">${orgName}</span>
          <span class="article-dates">প্রকাশ: ${publishedBn} • আপডেট: ${updatedBn}</span>
        </div>
        <div class="article-actions-top">
          <button class="action-btn bookmark-action-btn ${isBookmarked ? 'active' : ''}" onclick="handleBookmarkClick('${job.id}', this)" title="বুকমার্ক করুন">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="${isBookmarked ? '#FF9800' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            <span>${isBookmarked ? 'সংরক্ষিত' : 'সংরক্ষণ'}</span>
          </button>
          <button class="action-btn print-btn" onclick="window.print()" title="প্রিন্ট করুন">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            <span>প্রিন্ট</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Ad Slot: Below Title -->
    <div class="article-ad-slot" data-ad-placement="articleBelowTitle">
      ${typeof AdSlotArticleBelowTitle === "function" ? AdSlotArticleBelowTitle() : ""}
    </div>

    <!-- Quick Overview Summary Box -->
    <section class="job-quick-summary-box">
      <h3 class="summary-box-title">নিয়োগ বিজ্ঞপ্তির সারসংক্ষেপ (Quick Overview)</h3>
      <div class="summary-grid">
        <div class="summary-item">
          <span class="label">প্রতিষ্ঠানের নাম:</span>
          <span class="val"><strong>${orgName}</strong></span>
        </div>
        <div class="summary-item">
          <span class="label">পদের নাম:</span>
          <span class="val">${job.title}</span>
        </div>
        <div class="summary-item">
          <span class="label">শূন্য পদসংখ্যা:</span>
          <span class="val text-highlight">${toBanglaNumber(job.vacancies || "বিজ্ঞপ্তি অনুযায়ী")}</span>
        </div>
        <div class="summary-item">
          <span class="label">কাজের ধরন:</span>
          <span class="val">${job.employmentType || "ফুল-টাইম"}</span>
        </div>
        <div class="summary-item">
          <span class="label">শিক্ষাগত যোগ্যতা:</span>
          <span class="val">${job.educationalQualification || "বিজ্ঞপ্তি দেখুন"}</span>
        </div>
        <div class="summary-item">
          <span class="label">বয়সসীমা:</span>
          <span class="val">${job.ageRequirement || "বিজ্ঞপ্তি অনুযায়ী"}</span>
        </div>
        <div class="summary-item">
          <span class="label">বেতন স্কেল:</span>
          <span class="val"><strong>${job.salary || "আলোচনা সাপেক্ষে"}</strong></span>
        </div>
        <div class="summary-item">
          <span class="label">আবেদন ফি:</span>
          <span class="val">${job.applicationFee || "বিনামূল্যে"}</span>
        </div>
        <div class="summary-item">
          <span class="label">কর্মস্থল:</span>
          <span class="val">${job.location || "বাংলাদেশ"}</span>
        </div>
        <div class="summary-item deadline-highlight">
          <span class="label">আবেদনের শেষ তারিখ:</span>
          <span class="val deadline-val"><strong>${deadlineBn}</strong> (${statusInfo.label})</span>
        </div>
      </div>
    </section>

    <!-- Social Share Bar -->
    <div class="social-share-bar">
      <span class="share-label">বিজ্ঞপ্তিটি শেয়ার করুন:</span>
      <div class="share-buttons">
        <a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" target="_blank" rel="noopener noreferrer" class="share-btn fb" title="Facebook-এ শেয়ার">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> ফেসবুক
        </a>
        <a href="https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}" target="_blank" rel="noopener noreferrer" class="share-btn wa" title="WhatsApp-এ শেয়ার">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg> হোয়াটসঅ্যাপ
        </a>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}" target="_blank" rel="noopener noreferrer" class="share-btn in" title="LinkedIn-এ শেয়ার">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> লিঙ্কডইন
        </a>
        <a href="https://t.me/share/url?url=${shareUrl}&text=${shareTitle}" target="_blank" rel="noopener noreferrer" class="share-btn tg" title="Telegram-এ শেয়ার">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M21.5 2.5L2 10l6.5 2.5L18 6l-7 7.5v5l3.5-3.5 4.5 3.5 2.5-16z"/></svg> টেলিগ্রাম
        </a>
        <button class="share-btn copy-btn" onclick="copyCurrentArticleLink()" title="লিংক কপি করুন">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> কপি লিংক
        </button>
      </div>
    </div>

    <!-- Article Content Body -->
    <article class="article-content-body">
      <section class="content-section">
        <h3>বিস্তারিত বিবরণ (Job Description)</h3>
        <p>${job.description}</p>
      </section>

      <!-- In-Article Ad Slot -->
      <div class="in-article-ad" data-ad-placement="inArticle">
        ${typeof AdSlotInArticle === "function" ? AdSlotInArticle() : ""}
      </div>

      ${job.keyResponsibilities && job.keyResponsibilities.length > 0 ? `
        <section class="content-section">
          <h3>দায়িত্ব ও কাজের পরিধি (Key Responsibilities)</h3>
          <ul class="styled-bullet-list">
            ${job.keyResponsibilities.map(r => `<li>${r}</li>`).join("")}
          </ul>
        </section>
      ` : ""}

      ${job.requirements && job.requirements.length > 0 ? `
        <section class="content-section">
          <h3>প্রয়োজনীয় যোগ্যতা ও অভিজ্ঞতা (Requirements)</h3>
          <ul class="styled-bullet-list">
            ${job.requirements.map(req => `<li>${req}</li>`).join("")}
          </ul>
        </section>
      ` : ""}

      ${job.benefits && job.benefits.length > 0 ? `
        <section class="content-section">
          <h3>সুযোগ-সুবিধা ও সুযোগ (Compensation & Benefits)</h3>
          <ul class="styled-bullet-list">
            ${job.benefits.map(b => `<li>${b}</li>`).join("")}
          </ul>
        </section>
      ` : ""}

      <section class="content-section application-guide">
        <h3>আবেদন পদ্ধতি (How to Apply)</h3>
        <div class="procedure-box">
          <p>${job.applicationProcedure ? job.applicationProcedure.replace(/\n/g, '<br>') : "অফিসিয়াল সার্কুলার নির্দেশিকা অনুযায়ী আবেদন ফরম পূরণ করুন।"}</p>
        </div>

        <div class="official-actions-row">
          ${!isExpired ? `
            <a href="${job.applicationLink || job.officialLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-apply-large">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              <span>অনলাইনে আবেদন করুন (Official Apply)</span>
            </a>
          ` : `
            <div class="btn-disabled-notice">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              <span>আবেদনের সময়সীমা শেষ হওয়ায় আবেদন লিংক নিষ্ক্রিয় করা হয়েছে</span>
            </div>
          `}

          ${job.circularImage ? `
            <button class="btn btn-secondary btn-view-circular" onclick="openCircularModal('${job.circularImage}', '${job.title.replace(/'/g, "\\'")}')">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              <span>অফিসিয়াল সার্কুলার দেখুন (View Circular)</span>
            </button>
          ` : ""}
        </div>
      </section>

      <!-- Source & Disclaimer Notice -->
      <footer class="article-source-box">
        <div class="source-info">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0D47A1" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span><strong>তথ্যসূত্র ও সত্যতা:</strong> এই বিজ্ঞপ্তিটি ${job.source || "সংশ্লিষ্ট প্রতিষ্ঠানের অফিসিয়াল নিয়োগ পোর্টাল"} হতে সংগৃহীত। আবেদন করার পূর্বে মূল সার্কুলার ভালোভাবে পড়ে নিন।</span>
        </div>
      </footer>
    </article>

    <!-- Ad Slot: Before Related Articles -->
    <div class="article-ad-slot" data-ad-placement="articleBottom">
      ${typeof AdSlotArticleBottom === "function" ? AdSlotArticleBottom() : ""}
    </div>

    <!-- Related Jobs Section -->
    <section class="related-jobs-section" id="related-jobs-container">
      <h3>সম্পর্কিত অন্যান্য নিয়োগ বিজ্ঞপ্তি</h3>
      <div class="related-jobs-grid" id="related-jobs-grid">
        <!-- Injected asynchronously -->
      </div>
    </section>
  `;

  // Initialize any ads inside the newly rendered article
  if (typeof initAdPlacements === "function") {
    initAdPlacements(container);
  }

  // Render Related Jobs
  renderRelatedJobs(job);
}

/**
 * Renders Related Jobs based on category
 */
async function renderRelatedJobs(currentJob) {
  const container = document.getElementById("related-jobs-grid");
  if (!container) return;

  const allJobs = await fetchJobs();
  const related = allJobs
    .filter(j => j.id !== currentJob.id && (j.categorySlug === currentJob.categorySlug || j.category === currentJob.category))
    .slice(0, 3);

  if (related.length === 0) {
    const fallback = allJobs.filter(j => j.id !== currentJob.id).slice(0, 3);
    container.innerHTML = fallback.map(j => renderJobCard(j)).join("");
  } else {
    container.innerHTML = related.map(j => renderJobCard(j)).join("");
  }
}

/**
 * Copy Current Article Link with Feedback
 */
function copyCurrentArticleLink() {
  const url = window.location.href;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      showToastNotification("বিজ্ঞপ্তির লিংকটি ক্লিপবোর্ডে কপি করা হয়েছে!");
    }).catch(() => {
      fallbackCopy(url);
    });
  } else {
    fallbackCopy(url);
  }
}

function fallbackCopy(text) {
  const input = document.createElement("input");
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
  showToastNotification("বিজ্ঞপ্তির লিংকটি ক্লিপবোর্ডে কপি করা হয়েছে!");
}

/**
 * Circular Preview Modal
 */
function openCircularModal(imageSrc, title) {
  let modal = document.getElementById("circular-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "circular-modal";
    modal.className = "circular-modal";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="circular-modal-overlay" onclick="closeCircularModal()"></div>
    <div class="circular-modal-dialog">
      <div class="circular-modal-header">
        <h4>${title} - মূল সার্কুলার</h4>
        <div class="modal-header-actions">
          <a href="${imageSrc}" download class="modal-download-btn" title="সার্কুলার ডাউনলোড করুন">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> ডাউনলোড
          </a>
          <button class="modal-close-btn" onclick="closeCircularModal()" aria-label="বন্ধ করুন">&times;</button>
        </div>
      </div>
      <div class="circular-modal-body">
        <img src="${imageSrc}" alt="অফিসিয়াল সার্কুলার" class="circular-full-img" />
      </div>
    </div>
  `;

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCircularModal() {
  const modal = document.getElementById("circular-modal");
  if (modal) {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
}

window.openCircularModal = openCircularModal;
window.closeCircularModal = closeCircularModal;
window.copyCurrentArticleLink = copyCurrentArticleLink;

/**
 * Bookmarks Page Initializer
 */
async function initBookmarksPage() {
  const container = document.getElementById("bookmarks-grid");
  const emptyState = document.getElementById("bookmarks-empty-state");
  const clearAllBtn = document.getElementById("clear-bookmarks-btn");
  if (!container) return;

  const bookmarkIds = getBookmarks();
  const allJobs = await fetchJobs();
  const savedJobs = allJobs.filter(j => bookmarkIds.includes(j.id));

  if (savedJobs.length === 0) {
    container.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
    if (clearAllBtn) clearAllBtn.style.display = "none";
    return;
  }

  if (emptyState) emptyState.style.display = "none";
  if (clearAllBtn) {
    clearAllBtn.style.display = "inline-flex";
    clearAllBtn.onclick = () => {
      if (confirm("আপনি কি নিশ্চিত যে সকল সংরক্ষিত চাকরি মুছে ফেলতে চান?")) {
        localStorage.removeItem(BOOKMARK_STORAGE_KEY);
        updateBookmarkBadges();
        initBookmarksPage();
      }
    };
  }

  container.innerHTML = savedJobs.map(j => renderJobCard(j)).join("");
}
