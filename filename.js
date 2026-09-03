(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ArxivFilename = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

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
      .replace(/^[_. ]+|[_. ]+$/g, "")
      .trim();
    return sanitized || fallback;
  }

  function migrateLegacyTemplate(settings = {}) {
    if (ALLOWED_FILENAME_TEMPLATES.includes(settings.filenameTemplate)) {
      return settings.filenameTemplate;
    }

    const formats = {
      title: "{title}",
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

  function createFilename(metadata = {}, settings = {}) {
    const rawTitle = String(metadata.title || "").replace(/^\s*Title:\s*/i, "").trim();
    const year = String(metadata.dateline || "").match(/(?:19|20)\d{2}/)?.[0] || "YYYY";
    const [bracketOpen, bracketClose] = getBracketPair(settings.bracketStyle);
    const paper = {
      title: sanitizeFilenamePart(rawTitle, "arXiv_paper"),
      author: sanitizeFilenamePart(
        formatAuthorName(metadata.author || "Author", settings.authorNameFormat),
        "Author"
      ),
      year,
      bracketOpen,
      bracketClose
    };
    return renderFilename(migrateLegacyTemplate(settings), paper);
  }

  return {
    ALLOWED_FILENAME_TEMPLATES,
    DEFAULT_FILENAME_TEMPLATE,
    GROUPED_FILENAME_TEMPLATE,
    createFilename,
    formatAuthorName,
    getBracketPair,
    migrateLegacyTemplate,
    renderFilename,
    sanitizeFilenamePart
  };
});
