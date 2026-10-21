/* Kairos official website: accessible previews, navigation, theme and downloads. */
(function () {
  "use strict";

  var root = document.documentElement;
  var themeButton = document.getElementById("themeToggle");
  var themeQuery = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");

  function storedTheme() {
    try { return localStorage.getItem("kairos-theme"); } catch (_) { return null; }
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (themeButton) {
      var label = theme === "dark" ? "切换到浅色模式" : "切换到深色模式";
      themeButton.setAttribute("aria-label", label);
      themeButton.setAttribute("title", label);
      themeButton.setAttribute("aria-pressed", String(theme === "dark"));
    }
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) {
      meta.content = theme === "dark" ? "#101827" : "#fbfcfe";
    });
  }

  applyTheme(root.dataset.theme || (themeQuery && themeQuery.matches ? "dark" : "light"));
  if (themeButton) {
    themeButton.addEventListener("click", function () {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("kairos-theme", next); } catch (_) { /* Session theme still works. */ }
    });
  }
  function onSystemThemeChange(event) {
    var saved = storedTheme();
    if (saved !== "dark" && saved !== "light") applyTheme(event.matches ? "dark" : "light");
  }
  if (themeQuery) {
    if (themeQuery.addEventListener) themeQuery.addEventListener("change", onSystemThemeChange);
    else if (themeQuery.addListener) themeQuery.addListener(onSystemThemeChange);
  }

  var header = document.getElementById("siteHeader");
  var menuButton = document.getElementById("mobileNavToggle");
  var menuPanel = document.getElementById("mobileNavPanel");
  function closeMenu(returnFocus) {
    if (!menuButton || !menuPanel) return;
    var wasOpen = !menuPanel.hidden;
    menuPanel.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "打开导航菜单");
    if (returnFocus && wasOpen) menuButton.focus();
  }
  if (menuButton && menuPanel) {
    menuButton.hidden = false;
    menuButton.addEventListener("click", function () {
      var open = menuPanel.hidden;
      menuPanel.hidden = !open;
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
    });
    menuPanel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function (event) {
        closeMenu(false);
        var href = link.getAttribute("href");
        if (href && href.charAt(0) === "#") {
          var target = document.querySelector(href);
          var heading = target && target.querySelector("h2");
          if (heading) {
            event.preventDefault();
            target.scrollIntoView({ block: "start" });
            window.history.pushState(null, "", href);
            heading.setAttribute("tabindex", "-1");
            heading.focus({ preventScroll: true });
          }
        }
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu(true);
    });
    document.addEventListener("click", function (event) {
      if (header && !header.contains(event.target)) closeMenu(false);
    });
    document.addEventListener("focusin", function (event) {
      if (header && !header.contains(event.target)) closeMenu(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) closeMenu(false);
    }, { passive: true });
  }
  if (header) {
    function updateHeader() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  var tabs = Array.prototype.slice.call(document.querySelectorAll("[data-preview]"));
  function selectPreview(tab, focus) {
    tabs.forEach(function (item) {
      var selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
      var panel = document.getElementById(item.getAttribute("aria-controls"));
      if (panel) panel.hidden = !selected;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () { selectPreview(tab, false); });
    tab.addEventListener("keydown", function (event) {
      var next = null;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next !== null) {
        event.preventDefault();
        selectPreview(tabs[next], true);
      }
    });
  });

  var ua = navigator.userAgent || "";
  var platform = /Android/i.test(ua) ? "android" : /Windows/i.test(ua) ? "windows" : null;
  if (platform) {
    var recommended = document.querySelector(".dl-card[data-platform='" + platform + "']");
    if (recommended) {
      recommended.classList.add("is-recommended");
      var label = recommended.querySelector("[data-js='reco']");
      if (label) label.hidden = false;
    }
  }

  var copyStatus = document.getElementById("copyStatus");
  function fallbackCopy(value, button) {
    var field = document.createElement("textarea");
    field.value = value;
    field.className = "clipboard-fallback";
    field.setAttribute("readonly", "");
    field.setAttribute("aria-hidden", "true");
    document.body.appendChild(field);
    field.select();
    var success = false;
    try { success = document.execCommand("copy"); } catch (_) { /* Report failure below. */ }
    field.remove();
    button.focus({ preventScroll: true });
    return success;
  }
  document.querySelectorAll("[data-js='copy']").forEach(function (button) {
    var timer = null;
    var original = button.textContent;
    button.addEventListener("click", function () {
      clearTimeout(timer);
      var value = button.getAttribute("data-copy") || "";
      if (copyStatus) copyStatus.textContent = "";
      function done(success) {
        button.textContent = success ? "已复制" : "请手动复制";
        if (copyStatus) copyStatus.textContent = success
          ? button.getAttribute("aria-label").replace("复制", "") + "已复制"
          : "复制未成功，请选中校验和手动复制。";
        timer = setTimeout(function () { button.textContent = original; }, 2200);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(function () { done(true); }, function () { done(fallbackCopy(value, button)); });
      } else {
        done(fallbackCopy(value, button));
      }
    });
  });
})();
