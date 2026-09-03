# Contributing to arXiv Save as Title

Thank you for helping improve arXiv Save as Title. Bug reports, accessibility feedback, translations, tests, documentation, and code changes are welcome.

## Before you start

- Search existing issues before opening a new one.
- For a substantial feature or UI change, open a feature request first so its scope can be discussed.
- Look for issues labeled `good first issue` or `help wanted` if you are new to the project.
- Follow our [Code of Conduct](CODE_OF_CONDUCT.md) in all project spaces.

## Local development

Requirements: Chrome and Node.js 20 or newer.

1. Fork and clone the repository.
2. Run `npm install`.
3. Run `npm test` to execute the filename unit tests.
4. Run `npm run check` to validate the manifest, locale messages, and tests.
5. Open `chrome://extensions`, enable Developer mode, and choose **Load unpacked**.
6. Select the repository directory and test on an arXiv abstract page.

No build step is required. Reload the extension on `chrome://extensions` after changing JavaScript, HTML, or locale files.

## Making a change

1. Create a focused branch such as `fix/missing-year` or `feat/new-template`.
2. Keep each pull request limited to one logical change.
3. Add or update tests when changing filename behavior.
4. Add every new UI message to both `_locales/en/messages.json` and `_locales/ko/messages.json`.
5. Check keyboard navigation, visible focus, and both light and dark color schemes for UI changes.
6. Run `npm run check` before opening a pull request.

Please do not edit generated ZIP files in `dist/` as part of a feature or bug-fix pull request.

## Pull requests

In the pull request, explain the problem, the chosen solution, and how you tested it. Include screenshots for visual changes and link the related issue with `Closes #123` when applicable. A maintainer may request revisions before merging.

## Reporting security issues

Do not disclose a vulnerability in a public issue. Follow the private reporting instructions in [SECURITY.md](SECURITY.md).

## 한국어 안내

버그 제보, 번역, 접근성 개선, 테스트 및 코드 기여를 환영합니다. 기능을 크게 변경하기 전에는 먼저 Issue를 열어 범위를 논의해 주세요. 변경 후 `npm run check`를 실행하고, UI 문구를 추가했다면 영어와 한국어 locale을 모두 수정해 주세요.
