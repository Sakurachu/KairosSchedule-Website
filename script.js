/* Kairos 日程 · 官网脚本：主题切换、平台推荐、复制校验和 */
(function () {
  "use strict";

  var docEl = document.documentElement;
  var STORAGE_KEY = "kairos-theme";

  /* ---------- 主题（默认跟随系统，可手动切换并记忆） ---------- */
  function systemTheme() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    docEl.setAttribute("data-theme", theme);
    var toggle = document.getElementById("themeToggle");
    if (toggle) {
      var isDark = theme === "dark";
      var label = isDark ? "切换到浅色模式" : "切换到深色模式";
      toggle.setAttribute("aria-label", label);
      toggle.setAttribute("aria-pressed", String(isDark));
      toggle.setAttribute("title", label);
    }
  }

  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* 隐私模式下忽略 */ }
  applyTheme(saved === "dark" || saved === "light" ? saved : systemTheme());

  var themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = docEl.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* 忽略 */ }
    });
  }

  var colorSchemeQuery = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
  var onSystemThemeChange = function (e) {
    var current = null;
    try { current = localStorage.getItem(STORAGE_KEY); } catch (err) { /* 忽略 */ }
    if (current !== "dark" && current !== "light") applyTheme(e.matches ? "dark" : "light");
  };
  if (colorSchemeQuery) {
    if (colorSchemeQuery.addEventListener) colorSchemeQuery.addEventListener("change", onSystemThemeChange);
    else if (colorSchemeQuery.addListener) colorSchemeQuery.addListener(onSystemThemeChange);
  }

  /* ---------- 手机端导航 ---------- */
  var mobileNavToggle = document.getElementById("mobileNavToggle");
  var mobileNavPanel = document.getElementById("mobileNavPanel");

  function setMobileNav(open) {
    if (!mobileNavToggle || !mobileNavPanel) return;
    mobileNavToggle.setAttribute("aria-expanded", String(open));
    mobileNavToggle.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
    mobileNavPanel.hidden = !open;
  }

  if (mobileNavToggle && mobileNavPanel) {
    mobileNavToggle.addEventListener("click", function () {
      setMobileNav(mobileNavToggle.getAttribute("aria-expanded") !== "true");
    });
    mobileNavPanel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMobileNav(false); });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMobileNav(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) setMobileNav(false);
    }, { passive: true });
  }

  /* ---------- 顶栏滚动描边 ---------- */
  var header = document.getElementById("siteHeader");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- 按访问平台标记推荐下载 ---------- */
  var ua = navigator.userAgent || "";
  var platform = /Android/i.test(ua)
    ? "android"
    : /Windows/i.test(ua)
      ? "windows"
      : null;
  if (platform) {
    var recommendedCard = document.querySelector(".dl-card[data-platform='" + platform + "']");
    var reco = recommendedCard && recommendedCard.querySelector("[data-js='reco']");
    if (reco) reco.hidden = false;
  }

  /* ---------- 复制校验和 ---------- */
  document.querySelectorAll("[data-js='copy']").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy") || "";
      var done = function (message) {
        var original = btn.textContent;
        btn.textContent = message;
        setTimeout(function () { btn.textContent = original; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done("已复制"); }, function () {
          done(fallbackCopy(text) ? "已复制" : "复制失败");
        });
      } else {
        done(fallbackCopy(text) ? "已复制" : "复制失败");
      }
    });
  });

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    var copied = false;
    try { copied = document.execCommand("copy"); } catch (e) { /* 忽略 */ }
    document.body.removeChild(ta);
    return copied;
  }
})();
