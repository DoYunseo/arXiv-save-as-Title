"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
const requiredFiles = [
  "localization.js",
  manifest.background?.service_worker,
  manifest.options_ui?.page,
  manifest.action?.default_popup,
  ...manifest.content_scripts.flatMap((entry) => entry.js || []),
  ...Object.values(manifest.icons || {})
].filter(Boolean);

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Manifest file is missing: ${file}`);
}

const localesRoot = path.join(root, "_locales");
const defaultMessages = JSON.parse(fs.readFileSync(path.join(localesRoot, manifest.default_locale, "messages.json"), "utf8"));
for (const locale of fs.readdirSync(localesRoot)) {
  const localeFile = path.join(localesRoot, locale, "messages.json");
  const messages = JSON.parse(fs.readFileSync(localeFile, "utf8"));
  const missing = Object.keys(defaultMessages).filter((key) => !messages[key]?.message);
  if (missing.length) throw new Error(`${locale} is missing messages: ${missing.join(", ")}`);
}

const referencedMessages = new Set();
const manifestText = JSON.stringify(manifest);
for (const match of manifestText.matchAll(/__MSG_([A-Za-z0-9_]+)__/g)) referencedMessages.add(match[1]);
for (const file of ["options.html", "popup.html", "options.js", "content.js"]) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  for (const match of source.matchAll(/data-i18n="([A-Za-z0-9_]+)"/g)) referencedMessages.add(match[1]);
  for (const match of source.matchAll(/(?:getMessage|message)\("([A-Za-z0-9_]+)"\)/g)) referencedMessages.add(match[1]);
}
const undefinedMessages = [...referencedMessages].filter((key) => !defaultMessages[key]?.message);
if (undefinedMessages.length) throw new Error(`Undefined i18n messages: ${undefinedMessages.join(", ")}`);

console.log(`Validated manifest ${manifest.version}, ${requiredFiles.length} files, and ${referencedMessages.size} localized messages.`);
