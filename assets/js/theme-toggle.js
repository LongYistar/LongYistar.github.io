(function() {
  var storageKey = "yl-home-theme";

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function updateButtons(theme) {
    var buttons = document.querySelectorAll("[data-theme-toggle]");
    buttons.forEach(function(button) {
      var label = theme === "dark" ? button.dataset.labelDark : button.dataset.labelLight;
      var ariaLabel = theme === "dark" ? button.dataset.ariaDark : button.dataset.ariaLight;
      var icon = theme === "dark" ? "☀" : "☾";
      var iconNode = button.querySelector("[data-theme-toggle-icon]");
      var labelNode = button.querySelector("[data-theme-toggle-label]");

      if (iconNode) iconNode.textContent = icon;
      if (labelNode) labelNode.textContent = label;

      button.setAttribute("aria-label", ariaLabel);
      button.setAttribute("title", ariaLabel);
      button.setAttribute("aria-pressed", String(theme === "dark"));
    });
  }

  function applyTheme(theme, persist) {
    document.documentElement.setAttribute("data-theme", theme);
    updateButtons(theme);
    if (!persist) return;
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch (error) {}
  }

  function bindToggle(button) {
    if (button.dataset.themeToggleBound === "true") return;
    button.dataset.themeToggleBound = "true";
    button.addEventListener("click", function() {
      applyTheme(currentTheme() === "dark" ? "light" : "dark", true);
    });
  }

  function init() {
    var buttons = document.querySelectorAll("[data-theme-toggle]");
    if (!buttons.length) return;

    buttons.forEach(bindToggle);
    updateButtons(currentTheme());

    if (!window.matchMedia) return;

    var mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    var handleSystemChange = function(event) {
      try {
        if (window.localStorage.getItem(storageKey)) return;
      } catch (error) {}
      applyTheme(event.matches ? "dark" : "light", false);
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleSystemChange);
    } else if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(handleSystemChange);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
