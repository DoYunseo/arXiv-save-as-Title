const DEFAULT_FILENAME_TEMPLATE = "{author}_{year}_{title}";
const GROUPED_FILENAME_TEMPLATE = "{bracketOpen}{author}{year}{bracketClose} {title}";
const ALLOWED_FILENAME_TEMPLATES = [
  DEFAULT_FILENAME_TEMPLATE,
  "{title}_{author}_{year}",
  "{year}_{author}_{title}",
  "{title}",
  GROUPED_FILENAME_TEMPLATE
];
const FILENAME_TOKENS = ["title", "author", "year", "bracketOpen", "bracketClose"];

function sanitizeFilenamePart(value, fallback) {
  const sanitized = String(value || "")
    .normalize("NFC")
    .replace(/[\\/:*?"<>|\u0000-\u001F]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[. ]+$/g, "")
    .trim();
  return sanitized || fallback;
}

function migrateLegacyTemplate(settings) {
  if (ALLOWED_FILENAME_TEMPLATES.includes(settings.filenameTemplate)) {
    return settings.filenameTemplate;
  }

  const formats = {
    "title": "{title}",
    "title-author-year": "{title}_{author}_{year}",
    "title-year-author": "{title}_{year}_{author}"
  };
  if (formats[settings.format]) return formats[settings.format];

  let template = "{title}";
  if (settings.includeAuthor) template += "_{author}";
  if (settings.includeYear) template += "_{year}";
  return template === "{title}" && settings.includeAuthor === undefined
    ? DEFAULT_FILENAME_TEMPLATE
    : template;
}

function renderFilename(template, paper) {
  let filename = template || DEFAULT_FILENAME_TEMPLATE;
  FILENAME_TOKENS.forEach((token) => {
    filename = filename.replaceAll(`{${token}}`, paper[token]);
  });

  // Make the final result safe on all major OSes. Literal spaces in a preset
  // are preserved, while whitespace inside paper metadata is already `_`.
  filename = filename
    .replace(/[\\/:*?"<>|\u0000-\u001F]/g, "")
    .replace(/\s+/g, " ")
    .replace(/_{2,}/g, "_")
    .replace(/^[_. -]+|[_. -]+$/g, "")
    .slice(0, 180)
    .replace(/[. ]+$/g, "");

  return `${filename || paper.title}.pdf`;
}

function formatAuthorName(fullName, authorNameFormat) {
  const trimmedName = String(fullName || "").trim();
  if (authorNameFormat === "full") return trimmedName;

  // arXiv normally displays "Given Family". Also handle "Family, Given" safely.
  if (trimmedName.includes(",")) return trimmedName.split(",")[0].trim();
  return trimmedName.split(/\s+/).pop() || "Author";
}

function getBracketPair(bracketStyle) {
  const pairs = {
    parentheses: ["(", ")"],
    square: ["[", "]"],
    curly: ["{", "}"]
  };
  return pairs[bracketStyle] || pairs.parentheses;
}

function getPaperInfo(settings) {
  let rawTitle = document.querySelector("h1.title")?.textContent || document.title;
  rawTitle = rawTitle.replace(/^\s*Title:\s*/i, "").trim();

  const rawAuthor = document.querySelector("div.authors a")?.textContent?.trim() || "Author";
  const metaText = document.querySelector("div.dateline")?.textContent || "";
  const year = metaText.match(/(?:19|20)\d{2}/)?.[0] || "YYYY";
  const [bracketOpen, bracketClose] = getBracketPair(settings.bracketStyle);

  const paper = {
    title: sanitizeFilenamePart(rawTitle, "arXiv_paper"),
    author: sanitizeFilenamePart(
      formatAuthorName(rawAuthor, settings.authorNameFormat),
      "Author"
    ),
    year,
    bracketOpen,
    bracketClose
  };

  return renderFilename(migrateLegacyTemplate(settings), paper);
}

function addSaveAsTitleButton() {
  // arXiv renders separate mobile and desktop PDF links. Prefer the desktop
  // Access Paper link so the button stays in the right-hand sidebar.
  const desktopPdfLink = document.querySelector(
    ".full-text a.download-pdf, .full-text a[href*='/pdf/']"
  );
  const mobilePdfLink = document.querySelector(
    "a.mobile-submission-download[href*='/pdf/']"
  );
  const pdfLinkElement = desktopPdfLink || mobilePdfLink;
  if (!pdfLinkElement) return;

  // The DOM survives an extension update even though the old listener's
  // extension context does not. Replace that stale button when reinjected.
  document.getElementById("save-as-title-btn")?.remove();

  const button = document.createElement("button");
  button.textContent = "💾 Save with custom name";
  button.id = "save-as-title-btn";
  Object.assign(button.style, {
    marginTop: "5px", padding: "6px 12px", backgroundColor: "#4CAF50",
    color: "white", border: "none", borderRadius: "4px", cursor: "pointer",
    display: "block"
  });
  if (desktopPdfLink) {
    // Keep it directly below View PDF inside the same Access Paper list item.
    pdfLinkElement.parentElement.appendChild(button);
  } else {
    // On narrow/mobile layouts place it immediately after the mobile PDF link.
    pdfLinkElement.insertAdjacentElement("afterend", button);
  }

  button.addEventListener("click", () => {
    try {
      if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) {
        throw new Error("Extension context invalidated");
      }

      button.disabled = true;
      chrome.runtime.sendMessage({ action: "getSettings" }, (settingsResponse) => {
        try {
          const settingsError = chrome.runtime.lastError;
          if (settingsError || !settingsResponse?.ok) {
            button.disabled = false;
            alert("설정을 불러올 수 없습니다. 확장 아이콘을 다시 열거나 페이지를 새로고침해 주세요.");
            return;
          }

          const settings = settingsResponse.settings || {};
          const filename = getPaperInfo(settings);
          chrome.runtime.sendMessage({
            action: "download",
            url: pdfLinkElement.href,
            filename,
            saveAs: settings.saveAs ?? true
          }, (response) => {
            try {
              const downloadError = chrome.runtime.lastError;
              button.disabled = false;
              if (downloadError || !response?.ok) {
                alert(`PDF 다운로드에 실패했습니다: ${response?.error || downloadError?.message || "Unknown error"}`);
              }
            } catch (error) {
              button.disabled = false;
              alert("확장 프로그램이 업데이트되었습니다. 페이지를 새로고침해 주세요.");
            }
          });
        } catch (error) {
          button.disabled = false;
          alert("확장 프로그램이 업데이트되었습니다. 페이지를 새로고침해 주세요.");
        }
      });
    } catch (error) {
      button.disabled = false;
      alert("확장 프로그램이 업데이트되었습니다. 페이지를 새로고침해 주세요.");
    }
  });
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", addSaveAsTitleButton);
} else {
  addSaveAsTitleButton();
}
