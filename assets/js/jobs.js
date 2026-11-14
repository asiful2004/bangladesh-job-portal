/**
 * ====================================================================
 * JOBS DATA & RENDERING ENGINE
 * ====================================================================
 */

// Cache variables for data
let cachedJobs = null;
let cachedCategories = null;
let cachedBreakingNews = null;
let cachedFeatured = null;

const BOOKMARK_STORAGE_KEY = "chakri_portal_bookmarks";
const RECENT_STORAGE_KEY = "chakri_portal_recent_jobs";

/**
 * Converts English numbers to Bengali numerals
 */
function toBanglaNumber(num) {
  if (num === null || num === undefined) return "";
  const enToBn = {
    "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
    "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯"
  };
  return num.toString().replace(/[0-9]/g, (match) => enToBn[match]);
}

/**
 * Formats YYYY-MM-DD into a localized Bengali date string
 */
function formatBanglaDate(dateString) {
  if (!dateString) return "";
  const monthsBn = [
    "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
  ];
  try {
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const year = toBanglaNumber(parts[0]);
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = toBanglaNumber(parseInt(parts[2], 10));
      return `${day} ${monthsBn[monthIdx]} ${year}`;
    }
    const d = new Date(dateString);
    if (!isNaN(d.getTime())) {
      return `${toBanglaNumber(d.getDate())} ${monthsBn[d.getMonth()]} ${toBanglaNumber(d.getFullYear())}`;
    }
  } catch (e) {
    console.error("Date parse error", e);
  }
  return dateString;
}

/**
 * Calculates whether a job is Active, Closing Soon, or Expired
 */
function calculateJobStatus(deadlineStr) {
  if (!deadlineStr) {
    return {
      status: "active",
      label: "চলমান আবেদন",
      class: "status-active",
      daysLeft: 999
    };
  }

  const now = new Date();
  // Strip time from today for clean midnight comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const deadlineParts = deadlineStr.split("-");
  const deadlineDate = new Date(
    parseInt(deadlineParts[0], 10),
    parseInt(deadlineParts[1], 10) - 1,
    parseInt(deadlineParts[2], 10),
    23, 59, 59
  );

  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      status: "expired",
      label: "মেয়াদ উত্তীর্ণ",
      class: "status-expired",
      daysLeft: 0,
      alertMessage: "এই নিয়োগ বিজ্ঞপ্তির আবেদনের নির্ধারিত সময়সীমা শেষ হয়ে গেছে। নতুন আবেদন গ্রহণ করা হচ্ছে না।"
    };
  } else if (diffDays <= 3) {
    return {
      status: "closing-soon",
      label: `শীঘ্রই শেষ (${toBanglaNumber(diffDays)} দিন বাকি)`,
      class: "status-closing",
      daysLeft: diffDays,
      alertMessage: `সতর্কতা: এই আবেদনের সময়সীমা আর মাত্র ${toBanglaNumber(diffDays)} দিন বাকি আছে! দ্রুত আবেদন সম্পন্ন করুন।`
    };
  } else {
    return {
      status: "active",
      label: `চলমান (${toBanglaNumber(diffDays)} দিন বাকি)`,
      class: "status-active",
      daysLeft: diffDays,
      alertMessage: null
    };
  }
}

/**
 * Estimates reading time in minutes
 */
function calculateReadingTime(text) {
  if (!text) return "১ মিনিট";
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 140));
  return `${toBanglaNumber(minutes)} মিনিট পাঠ`;
}

/**
 * Data Fetchers
 */
async function fetchJobs() {
  if (cachedJobs) return cachedJobs;
  try {
    const res = await fetch("assets/data/jobs.json");
    if (!res.ok) throw new Error("Could not load jobs data");
    cachedJobs = await res.json();
    return cachedJobs;
  } catch (err) {
    console.error("Error fetching jobs:", err);
    return [];
  }
}

async function fetchCategories() {
  if (cachedCategories) return cachedCategories;
  try {
    const res = await fetch("assets/data/categories.json");
    if (!res.ok) throw new Error("Could not load categories data");
    cachedCategories = await res.json();
    return cachedCategories;
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [];
  }
}

async function fetchBreakingNews() {
  if (cachedBreakingNews) return cachedBreakingNews;
  try {
    const res = await fetch("assets/data/breaking-news.json");
    if (!res.ok) throw new Error("Could not load breaking news data");
    cachedBreakingNews = await res.json();
    return cachedBreakingNews;
  } catch (err) {
    console.error("Error fetching breaking news:", err);
    return [];
  }
}

async function fetchFeaturedIds() {
  if (cachedFeatured) return cachedFeatured;
  try {
    const res = await fetch("assets/data/featured.json");
    if (!res.ok) throw new Error("Could not load featured jobs");
    cachedFeatured = await res.json();
    return cachedFeatured;
  } catch (err) {
    console.error("Error fetching featured jobs:", err);
    return [];
  }
}

/**
 * Find single job by ID or Slug
 */
async function getJobByIdOrSlug(query) {
  if (!query) return null;
  const jobs = await fetchJobs();
  const cleaned = query.trim().toLowerCase();
  return jobs.find(j => j.id.toLowerCase() === cleaned || (j.slug && j.slug.toLowerCase() === cleaned)) || null;
}

/**
 * Bookmarking Support with localStorage
 */
function getBookmarks() {
  try {
    const data = localStorage.getItem(BOOKMARK_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function isJobBookmarked(jobId) {
  const bookmarks = getBookmarks();
  return bookmarks.includes(jobId);
}

function toggleJobBookmark(jobId) {
  let bookmarks = getBookmarks();
  const index = bookmarks.indexOf(jobId);
  let isSaved = false;

  if (index > -1) {
    bookmarks.splice(index, 1);
    isSaved = false;
  } else {
    bookmarks.push(jobId);
    isSaved = true;
  }

  localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(bookmarks));
  updateBookmarkBadges();
  return isSaved;
}

function updateBookmarkBadges() {
  const bookmarks = getBookmarks();
  const count = bookmarks.length;
  const badges = document.querySelectorAll(".bookmark-count-badge");
  badges.forEach(b => {
    b.textContent = toBanglaNumber(count);
    b.style.display = count > 0 ? "inline-flex" : "none";
  });
}

/**
 * Recently Viewed Jobs Tracking
 */
function addToRecentlyViewed(job) {
  if (!job || !job.id) return;
  try {
    let recents = JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY) || "[]");
    recents = recents.filter(item => item.id !== job.id);
    recents.unshift({
      id: job.id,
      slug: job.slug,
      title: job.title,
      organization: job.organizationBn || job.organization,
      deadline: job.deadline,
      viewedAt: new Date().toISOString()
    });
    if (recents.length > 8) recents = recents.slice(0, 8);
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(recents));
  } catch (e) {}
}

function getRecentlyViewed() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

/**
 * Render Reusable Job Card HTML
 */
function renderJobCard(job, options = {}) {
  const statusInfo = calculateJobStatus(job.deadline);
  const isBookmarked = isJobBookmarked(job.id);
  const orgName = job.organizationBn || job.organization;
  const logoUrl = job.thumbnail || "assets/images/logo.svg";
  const deadlineBn = formatBanglaDate(job.deadline);
  const publishedBn = formatBanglaDate(job.publishedDate);

  return `
    <article class="job-card ${job.featured ? 'is-featured' : ''} ${statusInfo.status === 'expired' ? 'is-expired' : ''}" data-job-id="${job.id}">
      <div class="job-card-header">
        <div class="org-logo-wrapper">
          <img src="${logoUrl}" alt="${orgName} লোগো" class="org-logo" width="48" height="48" loading="lazy" />
        </div>
        <div class="org-info">
          <div class="org-name-row">
            <span class="org-name" title="${orgName}">${orgName}</span>
            ${job.verified ? `<span class="verified-badge" title="অফিসিয়াল সার্কুলার দ্বারা যাচাইকৃত"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> ভেরিফাইড</span>` : ''}
          </div>
          <span class="category-pill pill-${job.categorySlug || 'general'}">${job.category}</span>
        </div>
        <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" onclick="handleBookmarkClick('${job.id}', this)" aria-label="সংরক্ষণ করুন" title="${isBookmarked ? 'বুকমার্ক সরানো' : 'বুকমার্ক করুন'}">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="${isBookmarked ? '#FF9800' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>

      <div class="job-card-body">
        <h3 class="job-title">
          <a href="job.html?id=${job.id}" title="${job.title}">${job.title}</a>
        </h3>

        <div class="job-meta-grid">
          <div class="meta-item">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span>পদসংখ্যা: <strong>${toBanglaNumber(job.vacancies || "বিজ্ঞপ্তি অনুযায়ী")}</strong></span>
          </div>
          <div class="meta-item">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${job.location || "বাংলাদেশ"}</span>
          </div>
          <div class="meta-item">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            <span>বেতন: <strong>${job.salary ? job.salary.split('(')[0] : 'আলোচনা সাপেক্ষে'}</strong></span>
          </div>
        </div>
      </div>

      <div class="job-card-footer">
        <div class="deadline-indicator">
          <span class="status-badge ${statusInfo.class}">${statusInfo.label}</span>
          <span class="deadline-date" title="আবেদনের শেষ তারিখ">শেষ: ${deadlineBn}</span>
        </div>
        <a href="job.html?id=${job.id}" class="view-details-btn">
          <span>বিস্তারিত</span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </a>
      </div>
    </article>
  `;
}

/**
 * Interactive Bookmark Click Handler
 */
function handleBookmarkClick(jobId, btnElement) {
  const isSaved = toggleJobBookmark(jobId);
  const svg = btnElement.querySelector("svg");
  if (isSaved) {
    btnElement.classList.add("active");
    if (svg) svg.setAttribute("fill", "#FF9800");
    showToastNotification("চাকরিটি আপনার বুকমার্কে সংরক্ষিত হয়েছে!");
  } else {
    btnElement.classList.remove("active");
    if (svg) svg.setAttribute("fill", "none");
    showToastNotification("বুকমার্ক থেকে অপসারিত হয়েছে।");
  }
}

/**
 * Toast Feedback Notification
 */
function showToastNotification(message, duration = 3000) {
  let toast = document.getElementById("portal-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "portal-toast";
    toast.className = "portal-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

// Global hook
window.handleBookmarkClick = handleBookmarkClick;
window.showToastNotification = showToastNotification;
