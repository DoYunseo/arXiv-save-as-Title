"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { flattenMessages, resolveLanguage } = require("../localization.js");

test("uses an explicitly selected language", () => {
  assert.equal(resolveLanguage("ko", "en-US"), "ko");
  assert.equal(resolveLanguage("en", "ko-KR"), "en");
});

test("auto follows a supported browser language", () => {
  assert.equal(resolveLanguage("auto", "ko-KR"), "ko");
  assert.equal(resolveLanguage("auto", "en-GB"), "en");
});

test("auto falls back to English for unsupported languages", () => {
  assert.equal(resolveLanguage("auto", "ja-JP"), "en");
});

test("flattens Chrome locale message objects", () => {
  assert.deepEqual(flattenMessages({ greeting: { message: "Hello" } }), { greeting: "Hello" });
});
