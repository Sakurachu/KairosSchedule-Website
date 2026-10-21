(function () {
  "use strict";
  var theme = null;
  try { theme = localStorage.getItem("kairos-theme"); } catch (_) { /* Storage may be disabled. */ }
  if (theme !== "dark" && theme !== "light") {
    theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.documentElement.dataset.theme = theme;
})();
