function refreshOpenArxivTabs() {
  chrome.tabs.query({ url: "https://arxiv.org/abs/*" }, (tabs) => {
    tabs.forEach((tab) => {
      if (!tab.id) return;
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      }).catch(() => {
        // A tab may close or navigate while the extension is being updated.
      });
    });
  });
}

// Reloading an unpacked extension is treated as an update. Reinject the new
// content script so already-open arXiv tabs do not keep an invalid context.
chrome.runtime.onInstalled.addListener(refreshOpenArxivTabs);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSettings") {
    chrome.storage.sync.get(
      ["filenameTemplate", "format", "includeAuthor", "includeYear", "authorNameFormat", "bracketStyle", "saveAs"],
      (settings) => {
        const error = chrome.runtime.lastError;
        sendResponse(error
          ? { ok: false, error: error.message }
          : { ok: true, settings });
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
