(function (global) {
  "use strict";

  function userAgent() {
    return global.navigator && global.navigator.userAgent || "";
  }

  function isIOS() {
    return /iPhone|iPad|iPod/i.test(userAgent());
  }

  function isAndroid() {
    return /Android/i.test(userAgent());
  }

  function isInstagram() {
    return /Instagram|Threads/i.test(userAgent());
  }

  function isFacebook() {
    return /FBAN|FBAV|FB_IAB|FBIOS|Messenger/i.test(userAgent());
  }

  function isInApp() {
    return isInstagram() || isFacebook() || /TikTok|musical_ly|BytedanceWebview/i.test(userAgent());
  }

  function androidIntent(url) {
    var withoutScheme = url.replace(/^https?:\/\//i, "");
    return "intent://" + withoutScheme +
      "#Intent;scheme=https;package=com.android.chrome;" +
      "S.browser_fallback_url=" + encodeURIComponent(url) + ";end";
  }

  // Call this directly from a click handler. iOS may reject custom schemes
  // after an await, fetch, promise, or timer removes the user gesture.
  function breakOut(url) {
    if (isAndroid()) {
      global.location.href = androidIntent(url);
      return;
    }
    if (isInstagram() && isIOS()) {
      global.location.href = "instagram://extbrowser/?url=" + encodeURIComponent(url);
      return;
    }
    if (isFacebook() && isIOS()) {
      global.open("x-safari-" + url, "_blank");
      return;
    }
    global.location.href = url;
  }

  function bind(element, url) {
    element.addEventListener("click", function (event) {
      if (!isInApp()) return;
      event.preventDefault();
      breakOut(url);
    });
  }

  function bindPage(url) {
    document.addEventListener("click", function (event) {
      var link = event.target.closest && event.target.closest("a[href]");
      if (!link || !/^https:\/\/apps\.apple\.com\//i.test(link.href) || !isInApp()) return;
      event.preventDefault();
      breakOut(url || link.href);
    });
  }

  global.ReadOftenAppStore = {
    isInApp: isInApp,
    isIOS: isIOS,
    isAndroid: isAndroid,
    isInstagram: isInstagram,
    isFacebook: isFacebook,
    breakOut: breakOut,
    bind: bind,
    bindPage: bindPage
  };
}(window));
