const DEFAULT_TEMPLATE = "{author}_{year}_{title}";
const GROUPED_TEMPLATE = "{bracketOpen}{author}{year}{bracketClose} {title}";
const ALLOWED_TEMPLATES = [
  "{author}_{year}_{title}",
  "{title}_{author}_{year}",
  "{year}_{author}_{title}",
  "{title}",
  GROUPED_TEMPLATE
];
const BRACKETS = {
  parentheses: ["(", ")"],
  square: ["[", "]"],
  curly: ["{", "}"]
};

const saveAsInput = document.getElementById("saveAs");
const preview = document.getElementById("preview");
const status = document.getElementById("status");
const bracketOptions = document.getElementById("bracketOptions");
const authorOptions = document.getElementById("authorOptions");
let uiMessages = {};

async function localizePage(languagePreference) {
  const language = ArxivLocalization.resolveLanguage(
    languagePreference,
    chrome.i18n.getUILanguage()
  );
  const response = await fetch(chrome.runtime.getURL(`_locales/${language}/messages.json`));
  if (!response.ok) throw new Error(`Could not load locale: ${language}`);
  const messages = ArxivLocalization.flattenMessages(await response.json());
  uiMessages = messages;
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const translated = messages[element.dataset.i18n];
    if (translated) element.textContent = translated;
  });
}

function legacyTemplate(data) {
  if (ALLOWED_TEMPLATES.includes(data.filenameTemplate)) return data.filenameTemplate;

  const formats = {
    "title": "{title}",
    "title-author-year": "{title}_{author}_{year}"
  };
  return formats[data.format] || DEFAULT_TEMPLATE;
}

function selectedValue(name) {
  return [...document.querySelectorAll(`input[name="${name}"]`)]
    .find((input) => input.checked)?.value;
}

function selectValue(name, value) {
  const input = [...document.querySelectorAll(`input[name="${name}"]`)]
    .find((candidate) => candidate.value === value);
  if (input) input.checked = true;
}

function updatePreview() {
  const template = selectedValue("filenameTemplate") || DEFAULT_TEMPLATE;
  bracketOptions.hidden = template !== GROUPED_TEMPLATE;
  authorOptions.hidden = template === "{title}";

  const author = selectedValue("authorNameFormat") === "full"
    ? "Ashish_Vaswani"
    : "Vaswani";
  const [bracketOpen, bracketClose] = BRACKETS[selectedValue("bracketStyle")]
    || BRACKETS.parentheses;
  const values = {
    author,
    year: "2017",
    title: "Attention_Is_All_You_Need",
    bracketOpen,
    bracketClose
  };
  let result = template;
  Object.entries(values).forEach(([token, value]) => {
    result = result.replaceAll(`{${token}}`, value);
  });
  preview.textContent = `${result}.pdf`;
}

chrome.storage.sync.get(
  ["filenameTemplate", "format", "authorNameFormat", "bracketStyle", "saveAs", "language"],
  async (data) => {
    const language = ["en", "ko"].includes(data.language) ? data.language : "auto";
    selectValue("language", language);
    await localizePage(language);
    selectValue("filenameTemplate", legacyTemplate(data));
    selectValue("authorNameFormat", data.authorNameFormat === "full" ? "full" : "last");
    selectValue("bracketStyle", BRACKETS[data.bracketStyle] ? data.bracketStyle : "parentheses");
    saveAsInput.checked = data.saveAs ?? true;
    updatePreview();
  }
);

document.querySelectorAll('input[name="filenameTemplate"], input[name="authorNameFormat"], input[name="bracketStyle"]')
  .forEach((input) => input.addEventListener("change", updatePreview));

document.querySelectorAll('input[name="language"]')
  .forEach((input) => input.addEventListener("change", () => localizePage(input.value)));

document.getElementById("save").addEventListener("click", () => {
  const saveButton = document.getElementById("save");
  const filenameTemplate = selectedValue("filenameTemplate") || DEFAULT_TEMPLATE;
  const authorNameFormat = selectedValue("authorNameFormat") || "last";
  const bracketStyle = selectedValue("bracketStyle") || "parentheses";
  const language = selectedValue("language") || "auto";

  saveButton.disabled = true;
  chrome.storage.sync.set({
    filenameTemplate,
    authorNameFormat,
    bracketStyle,
    language,
    saveAs: saveAsInput.checked
  }, () => {
    saveButton.disabled = false;
    status.textContent = chrome.runtime.lastError
      ? `${uiMessages.saveFailed || chrome.i18n.getMessage("saveFailed")} ${chrome.runtime.lastError.message}`
      : uiMessages.settingsSaved || chrome.i18n.getMessage("settingsSaved");
    if (!chrome.runtime.lastError) setTimeout(() => { status.textContent = ""; }, 1800);
  });
});
