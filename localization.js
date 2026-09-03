(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ArxivLocalization = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const SUPPORTED_LANGUAGES = ["en", "ko"];

  function resolveLanguage(preference = "auto", uiLanguage = "en") {
    if (SUPPORTED_LANGUAGES.includes(preference)) return preference;
    const browserLanguage = String(uiLanguage).toLowerCase().split(/[-_]/)[0];
    return SUPPORTED_LANGUAGES.includes(browserLanguage) ? browserLanguage : "en";
  }

  function flattenMessages(messages = {}) {
    return Object.fromEntries(
      Object.entries(messages).map(([key, value]) => [key, value?.message || ""])
    );
  }

  return { SUPPORTED_LANGUAGES, flattenMessages, resolveLanguage };
});
