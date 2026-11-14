/**
 * ====================================================================
 * THEME MANAGER (DARK / LIGHT MODE WITH LOCALSTORAGE)
 * ====================================================================
 */

(function () {
  const THEME_KEY = "chakri_portal_theme";

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
    updateThemeToggles(theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  }

  function updateThemeToggles(theme) {
    const btns = document.querySelectorAll(".theme-toggle-btn");
    btns.forEach((btn) => {
      const isDark = theme === "dark";
      btn.setAttribute("aria-label", isDark ? "সুইচ টু লাইট মোড" : "সুইচ টু ডার্ক মোড");
      btn.setAttribute("title", isDark ? "লাইট মোড" : "ডার্ক মোড");
      
      const sunIcon = btn.querySelector(".icon-sun");
      const moonIcon = btn.querySelector(".icon-moon");
      if (sunIcon && moonIcon) {
        if (isDark) {
          sunIcon.style.display = "block";
          moonIcon.style.display = "none";
        } else {
          sunIcon.style.display = "none";
          moonIcon.style.display = "block";
        }
      }
    });
  }

  // Immediate theme application before DOM fully loaded to avoid flash
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  // Setup event listeners once DOM is ready
  document.addEventListener("DOMContentLoaded", function () {
    updateThemeToggles(initialTheme);
    const btns = document.querySelectorAll(".theme-toggle-btn");
    btns.forEach((btn) => {
      btn.addEventListener("click", toggleTheme);
    });

    // Listen for OS theme changes if user hasn't explicitly set preference
    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (!localStorage.getItem(THEME_KEY)) {
          applyTheme(e.matches ? "dark" : "light");
        }
      });
    }
  });

  // Expose toggle globally
  window.togglePortalTheme = toggleTheme;
})();
