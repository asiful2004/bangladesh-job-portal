/**
 * ====================================================================
 * COMPREHENSIVE SEO & SCHEMA.ORG STRUCTURED DATA ENGINE
 * ====================================================================
 * Manages dynamic document title, meta descriptions, canonical URLs,
 * OpenGraph, Twitter Cards, and Schema.org JSON-LD tags.
 */

const SEO_CONFIG = {
  siteName: "চাকরি বার্তা | Bangladesh Job News & Career Portal",
  siteUrl: window.location.origin,
  defaultImage: "/assets/images/logo.svg",
  defaultDescription: "বাংলাদেশ সরকারি, ব্যাংক, বেসরকারি ও এনজিও চাকরির সর্বশেষ বিশ্বস্ত নিয়োগ বিজ্ঞপ্তি, পরীক্ষার সময়সূচি, ফলাফল এবং ক্যারিয়ার গাইডলাইন।",
  publisher: {
    "@type": "Organization",
    "name": "চাকরি বার্তা (Chakri Barta)",
    "url": window.location.origin,
    "logo": {
      "@type": "ImageObject",
      "url": window.location.origin + "/assets/images/logo.svg"
    }
  }
};

/**
 * Updates dynamic meta tags for Title, Description, Canonical & Social Cards
 */
function updatePageSEO({
  title,
  description,
  canonicalUrl,
  image,
  type = "website",
  publishedDate,
  updatedDate
}) {
  const fullTitle = title ? `${title} | চাকরি বার্তা` : SEO_CONFIG.siteName;
  document.title = fullTitle;

  const desc = description || SEO_CONFIG.defaultDescription;
  const canonical = canonicalUrl || window.location.href.split("?")[0];
  const ogImg = image ? (image.startsWith("http") ? image : `${window.location.origin}/${image.replace(/^\//, '')}`) : `${window.location.origin}${SEO_CONFIG.defaultImage}`;

  // Helper to set or create meta
  function setMeta(nameAttr, nameVal, content) {
    if (!content) return;
    let el = document.querySelector(`meta[${nameAttr}="${nameVal}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(nameAttr, nameVal);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  setMeta("name", "description", desc);

  // Canonical
  let canonicalEl = document.querySelector('link[rel="canonical"]');
  if (!canonicalEl) {
    canonicalEl = document.createElement("link");
    canonicalEl.setAttribute("rel", "canonical");
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute("href", canonical);

  // Open Graph
  setMeta("property", "og:title", fullTitle);
  setMeta("property", "og:description", desc);
  setMeta("property", "og:url", canonical);
  setMeta("property", "og:image", ogImg);
  setMeta("property", "og:type", type);
  setMeta("property", "og:site_name", "চাকরি বার্তা");
  setMeta("property", "og:locale", "bn_BD");

  // Twitter Cards
  setMeta("name", "twitter:card", "summary_large_image");
  setMeta("name", "twitter:title", fullTitle);
  setMeta("name", "twitter:description", desc);
  setMeta("name", "twitter:image", ogImg);

  if (publishedDate) setMeta("property", "article:published_time", publishedDate);
  if (updatedDate) setMeta("property", "article:modified_time", updatedDate);
}

/**
 * Injects or replaces a JSON-LD Schema block
 */
function setStructuredData(id, schemaObject) {
  let scriptEl = document.getElementById(id);
  if (!scriptEl) {
    scriptEl = document.createElement("script");
    scriptEl.id = id;
    scriptEl.type = "application/ld+json";
    document.head.appendChild(scriptEl);
  }
  scriptEl.textContent = JSON.stringify(schemaObject, null, 2);
}

/**
 * Injects Base Organization & WebSite SearchAction Schema
 */
function injectBaseSchemas() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SEO_CONFIG.siteUrl}/#website`,
        "url": SEO_CONFIG.siteUrl,
        "name": "চাকরি বার্তা",
        "description": SEO_CONFIG.defaultDescription,
        "inLanguage": "bn-BD",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${SEO_CONFIG.siteUrl}/search.html?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": `${SEO_CONFIG.siteUrl}/#organization`,
        "name": "চাকরি বার্তা (Chakri Barta)",
        "url": SEO_CONFIG.siteUrl,
        "logo": `${SEO_CONFIG.siteUrl}/assets/images/logo.svg`,
        "sameAs": [
          "https://www.facebook.com",
          "https://t.me"
        ]
      }
    ]
  };

  setStructuredData("schema-base-website", websiteSchema);
}

/**
 * Injects BreadcrumbList Schema
 */
function injectBreadcrumbsSchema(breadcrumbs = []) {
  if (!breadcrumbs || breadcrumbs.length === 0) return;

  const itemList = breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url.startsWith("http") ? crumb.url : `${window.location.origin}/${crumb.url.replace(/^\//, '')}`
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemList
  };

  setStructuredData("schema-breadcrumbs", schema);
}

/**
 * Injects JobPosting Schema or Article Schema based on active status
 * STRICT REQUIREMENT: Only active, verified jobs get active JobPosting schema!
 * Expired circulars are structured as an informational Article to comply with Google Guidelines.
 */
function injectJobStructuredData(job, isExpired = false) {
  if (!job) return;

  if (isExpired || job.categorySlug === "exam-results" || job.categorySlug === "career-advice") {
    // Generate Article Schema for expired job / article / result
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": job.title,
      "description": job.description,
      "image": job.thumbnail ? `${window.location.origin}/${job.thumbnail.replace(/^\//, '')}` : `${window.location.origin}/assets/images/logo.svg`,
      "datePublished": job.publishedDate ? `${job.publishedDate}T08:00:00+06:00` : new Date().toISOString(),
      "dateModified": job.updatedDate ? `${job.updatedDate}T08:00:00+06:00` : new Date().toISOString(),
      "author": {
        "@type": "Organization",
        "name": job.organization || "চাকরি বার্তা"
      },
      "publisher": SEO_CONFIG.publisher,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      }
    };
    setStructuredData("schema-job-entity", articleSchema);
  } else {
    // Active Genuine Job Opportunity Schema
    const deadlineISO = job.deadline ? `${job.deadline}T23:59:59+06:00` : undefined;
    const publishedISO = job.publishedDate ? `${job.publishedDate}T08:00:00+06:00` : new Date().toISOString();

    const jobPostingSchema = {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": job.title,
      "description": `<h3>${job.title}</h3><p>${job.description}</p><h4>দায়িত্বসমূহ:</h4><ul>${(job.keyResponsibilities || []).map(r => `<li>${r}</li>`).join('')}</ul><h4>যোগ্যতা:</h4><p>${job.educationalQualification || ''}</p>`,
      "datePosted": publishedISO,
      "validThrough": deadlineISO,
      "employmentType": job.employmentType && job.employmentType.includes("ফুল-টাইম") ? "FULL_TIME" : "OTHER",
      "hiringOrganization": {
        "@type": "Organization",
        "name": job.organization,
        "sameAs": job.officialLink || undefined,
        "logo": job.thumbnail ? `${window.location.origin}/${job.thumbnail.replace(/^\//, '')}` : undefined
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": job.location || "Dhaka",
          "addressCountry": "BD"
        }
      },
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "BDT",
        "value": {
          "@type": "QuantitativeValue",
          "unitText": "MONTH",
          "description": job.salary || "As per national pay scale"
        }
      },
      "applicantLocationRequirements": {
        "@type": "Country",
        "name": "Bangladesh"
      }
    };

    setStructuredData("schema-job-entity", jobPostingSchema);
  }
}

// Auto-run base schema on load
if (typeof document !== "undefined") {
  injectBaseSchemas();
}
