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
  demoMode: true,

  // Individual Slot Configuration
  slots: {
    // 1. Header Banner (Desktop: 728x90, Mobile: 320x50 / 300x100)
    header: {
      enabled: true,
      format: "728x90",
      mobileFormat: "320x50",
      description: "Header Leaderboard Banner",
      // Paste your Adsterra 728x90 JavaScript snippet or iframe code here:
      scriptSnippet: `<!-- Adsterra 728x90 Header Ad Code Placeholder -->`
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
 * AdSlot Component Generator
 * Returns the HTML string for a specific ad slot container
 */
function createAdContainer(slotKey, customClass = "") {
  if (!ADS_CONFIG.enabled) return "";
  
  const slot = ADS_CONFIG.slots[slotKey];
  if (!slot || !slot.enabled) return "";

  const containerId = `ad-slot-${slotKey}-${Math.random().toString(36).substring(2, 7)}`;
  const formatText = slot.mobileFormat ? `${slot.format} / ${slot.mobileFormat}` : slot.format;

  if (ADS_CONFIG.demoMode || !slot.scriptSnippet || slot.scriptSnippet.includes("Placeholder")) {
    return `
      <div class="ad-placement-wrapper ${customClass}" data-ad-slot="${slotKey}" id="${containerId}">
        <div class="ad-label">
          <span class="ad-badge">বিজ্ঞাপন / Advertisement</span>
          <span class="ad-size">${formatText}</span>
        </div>
        <div class="ad-placeholder-box ad-format-${slot.format.replace("x", "-")}">
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

  // Live Mode: Return container ready for ad script injection
  return `
    <div class="ad-placement-wrapper ${customClass}" data-ad-slot="${slotKey}" id="${containerId}">
      <div class="ad-label">
        <span class="ad-badge">বিজ্ঞাপন / Advertisement</span>
      </div>
      <div class="ad-live-container ad-format-${slot.format.replace("x", "-")}">
        ${slot.scriptSnippet}
      </div>
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
function initAdPlacements() {
  if (!ADS_CONFIG.enabled) {
    document.querySelectorAll("[data-ad-placement]").forEach(el => el.remove());
    return;
  }

  const placements = document.querySelectorAll("[data-ad-placement]");
  placements.forEach(container => {
    const slotKey = container.getAttribute("data-ad-placement");
    if (slotKey && ADS_CONFIG.slots[slotKey]) {
      container.innerHTML = createAdContainer(slotKey);
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
