importScripts("localization.js");

const localeCache = new Map();

async function getLocalizedMessages(languagePreference) {
  const language = ArxivLocalization.resolveLanguage(
    languagePreference,
    chrome.i18n.getUILanguage()
  );
  if (!localeCache.has(language)) {
    const response = await fetch(chrome.runtime.getURL(`_locales/${language}/messages.json`));
    if (!response.ok) throw new Error(`Could not load locale: ${language}`);
    localeCache.set(language, ArxivLocalization.flattenMessages(await response.json()));
  }
  return { language, messages: localeCache.get(language) };
}

async function updateActionTitle(languagePreference) {
  try {
    const { messages } = await getLocalizedMessages(languagePreference);
    await chrome.action.setTitle({ title: messages.actionTitle });
  } catch (error) {
    // The manifest-provided title remains available if locale loading fails.
  }
}

function refreshOpenArxivTabs() {
  chrome.tabs.query({ url: "https://arxiv.org/abs/*" }, (tabs) => {
    tabs.forEach((tab) => {
      if (!tab.id) return;
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["filename.js", "content.js"]
      }).catch(() => {
        // A tab may close or navigate while the extension is being updated.
      });
    });
  });
}

// Reloading an unpacked extension is treated as an update. Reinject the new
// content script so already-open arXiv tabs do not keep an invalid context.
chrome.runtime.onInstalled.addListener(refreshOpenArxivTabs);

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.sync.get(["language"], ({ language }) => updateActionTitle(language));
});

chrome.storage.sync.get(["language"], ({ language }) => updateActionTitle(language));

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "sync" || !changes.language) return;
  updateActionTitle(changes.language.newValue);
  refreshOpenArxivTabs();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSettings") {
    chrome.storage.sync.get(
      ["filenameTemplate", "format", "includeAuthor", "includeYear", "authorNameFormat", "bracketStyle", "saveAs", "language"],
      async (settings) => {
        const error = chrome.runtime.lastError;
        if (error) {
          sendResponse({ ok: false, error: error.message });
          return;
        }
        try {
          const localized = await getLocalizedMessages(settings.language);
          sendResponse({ ok: true, settings, ...localized });
        } catch (localizationError) {
          sendResponse({ ok: false, error: localizationError.message });
        }
      }
    );

    return true;
  }

  if (request.action === "download") {
    chrome.downloads.download({
      url: request.url,
      filename: request.filename,
      saveAs: request.saveAs
    }, (downloadId) => {
      const error = chrome.runtime.lastError;
      sendResponse(error
        ? { ok: false, error: error.message }
        : { ok: true, downloadId });
    });

    return true;
  }
});
