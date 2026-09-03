# Changelog

All notable changes to arXiv Save as Title are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-09-03

### Added

- Added Auto, English, and Korean language options that are saved with Chrome Sync.
- Added localized settings, download-button, status, and error messages.
- Added dark-mode styles, reduced-motion support, clearer keyboard focus, accessible labels, and live save-status announcements.
- Added automated tests for filename generation, sanitization, legacy settings, and language selection.
- Added extension validation for manifest file references and locale-message completeness.
- Added GitHub Actions CI checks for pushes and pull requests.
- Added contribution guidelines, a code of conduct, a security policy, Issue forms, and a pull request template.

### Changed

- Extracted filename generation and localization into reusable, independently testable modules.
- Updated open arXiv tabs and the toolbar title when the selected language changes.
- Updated the README with Chrome Web Store, development, testing, and contribution instructions.

### Fixed

- Removed unwanted leading and trailing underscores from sanitized metadata.
- Prevented duplicate content-script declarations when the extension is updated or reloaded.

[1.4.0]: https://github.com/DoYunseo/arXiv-save-as-Title/releases/tag/v1.4.0
