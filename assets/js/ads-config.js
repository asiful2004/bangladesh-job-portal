/**
 * ====================================================================
 * ADSTERRA ADVERTISING CONFIGURATION & MONETIZATION MODULE
 * ====================================================================
 * This module manages all advertisement placements across the portal.
 * Adsterra ad scripts can be enabled, disabled, or customized here
 * without modifying any HTML or core portal logic.
 *
 * Safe Practices:
 * 1. Advertisements are labeled clearly with "বিজ্ঞাপন / Advertisement".
 * 2. Fixed aspect ratios prevent layout shifts (Core Web Vitals CLS).
 * 3. Never placed over navigation, call-to-actions, or official links.
 * 4. Works 100% cleanly when disabled or in demo/test mode.
 */

const ADS_CONFIG = {
  // Global master switch: Set to false to disable all ads site-wide
  enabled: true,

  // Demo Mode: When true, displays elegant responsive visual placeholders
  // indicating the ad format and instructions. Set to false when ready
  // to insert live Adsterra script codes.
  demoMode: false,

  // Individual Slot Configuration
  slots: {
    // 1. Header Banner (Desktop: 728x90, Mobile: 320x50 / 300x100)
    header: {
      enabled: true,
      format: "728x90",
      mobileFormat: "320x50",
      description: "Header Leaderboard Banner",
      // Paste your Adsterra 728x90 JavaScript snippet or iframe code here:
      scriptSnippet: `<script>
  atOptions = {
    'key' : 'af106d42627f92cbb14e1dfdab4ffa51',
    'format' : 'iframe',
    'height' : 90,
    'width' : 728,
    'params' : {}
  };
</script>
<script src="https://bauval.org/22/af106d42627f92cbb14e1dfdab4ffa51"></script>`
    },

    // 2. Sidebar Medium Rectangle (300x250)
    sidebar: {
      enabled: true,
      format: "300x250",
      description: "Sidebar Rectangle Ad",
      // Paste your Adsterra 300x250 JavaScript snippet here:
      scriptSnippet: `<!-- Adsterra 300x250 Sidebar Ad Code Placeholder -->`
    },

    // 3. Sidebar Sticky Skyscraper (160x600 or 300x600)
    sidebarSkyscraper: {
      enabled: true,
      format: "160x600",
      description: "Sidebar Sticky Skyscraper",
      scriptSnippet: `<!-- Adsterra 160x600 Skyscraper Ad Code Placeholder -->`
    },

    // 4. In-Article Ad (300x250 or Responsive Banner)
    inArticle: {
      enabled: true,
      format: "300x250",
      description: "Within Article Body Ad",
      scriptSnippet: `<!-- Adsterra 300x250 In-Article Ad Code Placeholder -->`
    },

    // 5. Between Job Cards (Responsive 728x90 / 468x60 / 300x250)
    betweenCards: {
      enabled: true,
      format: "728x90",
      mobileFormat: "300x250",
      description: "Between Job Cards Banner",
      scriptSnippet: `<!-- Adsterra Between-Cards Ad Code Placeholder -->`
    },

    // 6. Before Footer Banner (728x90)
    footer: {
      enabled: true,
      format: "728x90",
      mobileFormat: "320x50",
      description: "Pre-Footer Leaderboard",
      scriptSnippet: `<!-- Adsterra Pre-Footer 728x90 Ad Code Placeholder -->`
    },

    // 7. Category Page Top Banner (728x90)
    categoryTop: {
      enabled: true,
      format: "728x90",
      mobileFormat: "320x50",
      description: "Category Page Top Banner",
      scriptSnippet: `<!-- Adsterra Category Top Ad Code Placeholder -->`
    },

    // 8. Article Below Title Banner (468x60 / 320x50)
    articleBelowTitle: {
      enabled: true,
      format: "468x60",
      mobileFormat: "320x50",
      description: "Article Below Title Ad",
      scriptSnippet: `<!-- Adsterra Below Title Ad Code Placeholder -->`
    },

    // 9. Article Bottom / Before Related Jobs
    articleBottom: {
      enabled: true,
      format: "728x90",
      mobileFormat: "300x250",
      description: "Article Bottom Banner",
      scriptSnippet: `<!-- Adsterra Article Bottom Ad Code Placeholder -->`
    }
  }
};

/**
 * AdSlot Component Generator & Safe Execution Engine
 */
function renderSlotInto(container, slotKey, customClass = "") {
  if (!ADS_CONFIG.enabled) {
    container.innerHTML = "";
    return;
  }

  const slot = ADS_CONFIG.slots[slotKey];
  if (!slot || !slot.enabled) {
    container.innerHTML = "";
    return;
  }

  const snippet = (slot.scriptSnippet || "").trim();
  const isLive = !ADS_CONFIG.demoMode && snippet && !snippet.includes("Placeholder");
  const containerId = `ad-slot-${slotKey}-${Math.random().toString(36).substring(2, 7)}`;
  const formatText = slot.mobileFormat ? `${slot.format} / ${slot.mobileFormat}` : slot.format;
  const formatClass = `ad-format-${slot.format.replace("x", "-")}`;

  if (!isLive) {
    // Demo Mode or placeholder
    container.innerHTML = `
      <div class="ad-placement-wrapper ${customClass}" data-ad-slot="${slotKey}" id="${containerId}">
        <div class="ad-label">
          <span class="ad-badge">বিজ্ঞাপন / Advertisement</span>
          <span class="ad-size">${formatText}</span>
        </div>
        <div class="ad-placeholder-box ${formatClass}">
          <div class="ad-placeholder-inner">
            <svg class="ad-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            <p class="ad-placeholder-title">Adsterra Ad Placement (${slot.format})</p>
            <p class="ad-placeholder-sub">রেসপন্সিভ বিজ্ঞাপন স্লট • Configure in <code>assets/js/ads-config.js</code></p>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // Live Mode: Build wrapper
  container.innerHTML = `
    <div class="ad-placement-wrapper ${customClass}" data-ad-slot="${slotKey}" id="${containerId}">
      <div class="ad-label">
        <span class="ad-badge">বিজ্ঞাপন / Advertisement</span>
      </div>
      <div class="ad-live-container ${formatClass}"></div>
    </div>
  `;

  const liveTarget = container.querySelector(".ad-live-container");
  if (!liveTarget) return;

  if (snippet.includes("<script")) {
    // Adsterra / script banner: render in an isolated friendly iframe so document.write & atOptions execute safely without blocking
    const isMobile = window.innerWidth <= 768;
    const dimensions = (isMobile && slot.mobileFormat) ? slot.mobileFormat.split("x") : slot.format.split("x");
    const width = parseInt(dimensions[0], 10) || 728;
    const height = parseInt(dimensions[1], 10) || 90;

    const iframe = document.createElement("iframe");
    iframe.className = "ad-live-iframe";
    iframe.width = width;
    iframe.height = height;
    iframe.style.border = "none";
    iframe.style.overflow = "hidden";
    iframe.style.maxWidth = "100%";
    iframe.scrolling = "no";
    iframe.setAttribute("aria-label", "Advertisement");

    liveTarget.appendChild(iframe);

    try {
      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { margin: 0; padding: 0; overflow: hidden; display: flex; justify-content: center; align-items: center; background: transparent; }
          </style>
        </head>
        <body>
          ${snippet}
        </body>
        </html>
      `);
      doc.close();
    } catch (err) {
      console.warn("Could not inject ad iframe:", err);
    }
  } else {
    // Pure HTML / image banner
    liveTarget.innerHTML = snippet;
  }
}

function createAdContainer(slotKey, customClass = "") {
  if (!ADS_CONFIG.enabled) return "";
  const slot = ADS_CONFIG.slots[slotKey];
  if (!slot || !slot.enabled) return "";

  const containerId = `ad-slot-${slotKey}-${Math.random().toString(36).substring(2, 7)}`;
  const formatText = slot.mobileFormat ? `${slot.format} / ${slot.mobileFormat}` : slot.format;
  const formatClass = `ad-format-${slot.format.replace("x", "-")}`;
  const snippet = (slot.scriptSnippet || "").trim();
  const isLive = !ADS_CONFIG.demoMode && snippet && !snippet.includes("Placeholder");

  if (!isLive) {
    return `
      <div class="ad-placement-wrapper ${customClass}" data-ad-slot="${slotKey}" id="${containerId}">
        <div class="ad-label">
          <span class="ad-badge">বিজ্ঞাপন / Advertisement</span>
          <span class="ad-size">${formatText}</span>
        </div>
        <div class="ad-placeholder-box ${formatClass}">
          <div class="ad-placeholder-inner">
            <svg class="ad-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            <p class="ad-placeholder-title">Adsterra Ad Placement (${slot.format})</p>
            <p class="ad-placeholder-sub">রেসপন্সিভ বিজ্ঞাপন স্লট • Configure in <code>assets/js/ads-config.js</code></p>
          </div>
        </div>
      </div>
    `;
  }

  // If live mode, return wrapper and mount iframe asynchronously
  setTimeout(() => {
    const el = document.getElementById(containerId);
    if (el && el.parentElement) {
      renderSlotInto(el.parentElement, slotKey, customClass);
    }
  }, 50);

  return `
    <div class="ad-placement-wrapper ${customClass}" data-ad-slot="${slotKey}" id="${containerId}">
      <div class="ad-label"><span class="ad-badge">বিজ্ঞাপন / Advertisement</span></div>
      <div class="ad-live-container ${formatClass}"></div>
    </div>
  `;
}

// Named exports matching requirement specifications
function AdSlotTop(customClass = "") {
  return createAdContainer("header", customClass);
}

function AdSlotSidebar(slotKey = "sidebar", customClass = "") {
  return createAdContainer(slotKey, customClass);
}

function AdSlotInArticle(customClass = "") {
  return createAdContainer("inArticle", customClass);
}

function AdSlotBetweenCards(customClass = "") {
  return createAdContainer("betweenCards", customClass);
}

function AdSlotBottom(customClass = "") {
  return createAdContainer("footer", customClass);
}

function AdSlotCategoryTop(customClass = "") {
  return createAdContainer("categoryTop", customClass);
}

function AdSlotArticleBelowTitle(customClass = "") {
  return createAdContainer("articleBelowTitle", customClass);
}

function AdSlotArticleBottom(customClass = "") {
  return createAdContainer("articleBottom", customClass);
}

/**
 * Initializes and injects ads into pre-existing HTML placeholder tags
 * Elements with attribute: <div data-ad-placement="header"></div>
 */
function initAdPlacements(root) {
  const targetRoot = (root && typeof root.querySelectorAll === "function") ? root : document;

  if (!ADS_CONFIG.enabled) {
    targetRoot.querySelectorAll("[data-ad-placement]").forEach(el => el.remove());
    return;
  }

  const placements = targetRoot.querySelectorAll("[data-ad-placement]");
  placements.forEach(container => {
    const slotKey = container.getAttribute("data-ad-placement");
    if (slotKey && ADS_CONFIG.slots[slotKey]) {
      renderSlotInto(container, slotKey);
    }
  });
}

// Automatically run on DOMContentLoaded
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAdPlacements);
  } else {
    initAdPlacements();
  }
}
