"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  createFilename,
  formatAuthorName,
  migrateLegacyTemplate,
  sanitizeFilenamePart
} = require("../filename.js");

const attention = {
  title: "Title: Attention Is All You Need",
  author: "Ashish Vaswani",
  dateline: "Submitted on 12 Jun 2017 (v1)"
};

test("creates the default author-year-title filename", () => {
  assert.equal(createFilename(attention), "Vaswani_2017_Attention_Is_All_You_Need.pdf");
});

test("supports every filename preset", () => {
  assert.equal(createFilename(attention, { filenameTemplate: "{title}_{author}_{year}" }), "Attention_Is_All_You_Need_Vaswani_2017.pdf");
  assert.equal(createFilename(attention, { filenameTemplate: "{year}_{author}_{title}" }), "2017_Vaswani_Attention_Is_All_You_Need.pdf");
  assert.equal(createFilename(attention, { filenameTemplate: "{title}" }), "Attention_Is_All_You_Need.pdf");
});

test("supports a full author name and grouping symbols", () => {
  const filename = createFilename(attention, {
    filenameTemplate: "{bracketOpen}{author}{year}{bracketClose} {title}",
    authorNameFormat: "full",
    bracketStyle: "square"
  });
  assert.equal(filename, "[Ashish_Vaswani2017] Attention_Is_All_You_Need.pdf");
});

test("handles family-name-first author names", () => {
  assert.equal(formatAuthorName("Vaswani, Ashish", "last"), "Vaswani");
});

test("preserves Unicode while removing unsafe filename characters", () => {
  assert.equal(sanitizeFilenamePart(" 논문: 제목? / 테스트 ", "fallback"), "논문_제목_테스트");
});

test("uses safe fallbacks when metadata is missing", () => {
  assert.equal(createFilename({}), "Author_YYYY_arXiv_paper.pdf");
});

test("uses the first four-digit year in the dateline", () => {
  assert.match(createFilename({ ...attention, dateline: "Submitted 1999; revised 2024" }), /_1999_/);
});

test("limits generated filenames to the Chrome download-safe length", () => {
  const result = createFilename({ ...attention, title: "A".repeat(300) });
  assert.ok(result.length <= 184);
  assert.ok(result.endsWith(".pdf"));
});

test("migrates legacy preferences", () => {
  assert.equal(migrateLegacyTemplate({ format: "title-author-year" }), "{title}_{author}_{year}");
  assert.equal(migrateLegacyTemplate({ includeAuthor: true, includeYear: true }), "{title}_{author}_{year}");
});

test("rejects an unknown template in favor of the default", () => {
  assert.equal(migrateLegacyTemplate({ filenameTemplate: "{unknown}" }), "{author}_{year}_{title}");
});
