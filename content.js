(() => {
  "use strict";

  let localizedMessages = {};
  const message = (key) => localizedMessages[key] || chrome.i18n.getMessage(key);

  function applyLocalizedMessages(response, button) {
    if (!response?.messages) return;
    localizedMessages = response.messages;
    button.textContent = message("saveButton");
    button.setAttribute("aria-label", message("saveButtonAriaLabel"));
  }

  function getPaperInfo(settings) {
    return ArxivFilename.createFilename({
      title: document.querySelector("h1.title")?.textContent || document.title,
      author: document.querySelector("div.authors a")?.textContent?.trim() || "Author",
      dateline: document.querySelector("div.dateline")?.textContent || ""
    }, settings);
  }

  function addSaveAsTitleButton() {
    const desktopPdfLink = document.querySelector(
      ".full-text a.download-pdf, .full-text a[href*='/pdf/']"
    );
    const mobilePdfLink = document.querySelector(
      "a.mobile-submission-download[href*='/pdf/']"
    );
    const pdfLinkElement = desktopPdfLink || mobilePdfLink;
    if (!pdfLinkElement) return;

    document.getElementById("save-as-title-btn")?.remove();

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = message("saveButton");
    button.setAttribute("aria-label", message("saveButtonAriaLabel"));
    button.id = "save-as-title-btn";
    Object.assign(button.style, {
      marginTop: "5px", padding: "6px 12px", backgroundColor: "#237a3b",
      color: "white", border: "2px solid transparent", borderRadius: "4px",
      cursor: "pointer", display: "block", fontWeight: "600"
    });
    button.addEventListener("focus", () => {
      button.style.outline = "3px solid #1a73e8";
      button.style.outlineOffset = "2px";
    });
    button.addEventListener("blur", () => { button.style.outline = "none"; });

    chrome.runtime.sendMessage({ action: "getSettings" }, (response) => {
      if (!chrome.runtime.lastError && response?.ok) applyLocalizedMessages(response, button);
    });

    if (desktopPdfLink) pdfLinkElement.parentElement.appendChild(button);
    else pdfLinkElement.insertAdjacentElement("afterend", button);

    button.addEventListener("click", () => {
      try {
        if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) {
          throw new Error("Extension context invalidated");
        }
        button.disabled = true;
        button.setAttribute("aria-busy", "true");
        chrome.runtime.sendMessage({ action: "getSettings" }, (settingsResponse) => {
          try {
            const settingsError = chrome.runtime.lastError;
            if (settingsError || !settingsResponse?.ok) {
              button.disabled = false;
              button.removeAttribute("aria-busy");
              alert(message("settingsLoadError"));
              return;
            }
            const settings = settingsResponse.settings || {};
            applyLocalizedMessages(settingsResponse, button);
            chrome.runtime.sendMessage({
              action: "download",
              url: pdfLinkElement.href,
              filename: getPaperInfo(settings),
              saveAs: settings.saveAs ?? true
            }, (response) => {
              try {
                const downloadError = chrome.runtime.lastError;
                button.disabled = false;
                button.removeAttribute("aria-busy");
                if (downloadError || !response?.ok) {
                  alert(`${message("downloadError")} ${response?.error || downloadError?.message || "Unknown error"}`);
                }
              } catch (error) {
                button.disabled = false;
                button.removeAttribute("aria-busy");
                alert(message("extensionUpdatedError"));
              }
            });
          } catch (error) {
            button.disabled = false;
            button.removeAttribute("aria-busy");
            alert(message("extensionUpdatedError"));
          }
        });
      } catch (error) {
        button.disabled = false;
        button.removeAttribute("aria-busy");
        alert(message("extensionUpdatedError"));
      }
    });
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", addSaveAsTitleButton, { once: true });
  } else {
    addSaveAsTitleButton();
  }
})();
