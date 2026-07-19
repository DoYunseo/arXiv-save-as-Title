# Chrome Web Store listing

## Basic information

- Name: `arXiv Save as Title`
- Category: `Productivity`
- Primary language: `English`
- Supported site: `https://arxiv.org/`

## Short description

Save arXiv PDFs with customizable filenames using the paper title, first author, and submission year.

## Detailed description

arXiv Save as Title helps you keep downloaded research papers organized with meaningful filenames.

Features:

- Download an arXiv PDF using its title, first author, and submission year.
- Arrange filename fields in any order with `{title}`, `{author}`, and `{year}` tokens.
- Choose whether the first author is shown by last name or full name.
- Format grouped author-year filenames with parentheses, square brackets, or curly braces.
- Preview the generated filename before saving.
- Choose whether Chrome asks for a save location.
- Keep preferences synchronized through Chrome.

The extension works only on arXiv abstract pages. It does not include advertising or analytics and does not send paper information or personal data to the developer.

## Single purpose

Download arXiv paper PDFs with descriptive, user-customizable filenames based on paper metadata.

## Permission justifications

### `downloads`

Required to download the PDF selected by the user with the configured filename.

### `storage`

Required to save and synchronize the user's filename template and save-location preference.

### `scripting`

Required to refresh the extension's bundled content script on already-open arXiv tabs after an extension update, preventing stale extension contexts. It is used only on `https://arxiv.org/abs/*`.

### `https://arxiv.org/*`

Required to read the title, first author, submission year, and PDF link displayed on an arXiv abstract page, and to add the download button to that page.

## Data disclosure

- No data is collected by or transmitted to the developer.
- No data is sold or used for advertising, creditworthiness, or lending.
- Paper metadata is processed locally only to generate the filename.
- Preferences are stored with `chrome.storage.sync` and may be synchronized by Chrome.
- PDFs are downloaded directly from arXiv to the user's device.

## Required listing assets

- Store icon: 128x128 PNG (`icon128.png`)
- Screenshot: at least one 1280x800 PNG or JPEG
- Recommended screenshot 1: arXiv page showing the added download button
- Recommended screenshot 2: filename options and live preview
- Recommended screenshot 3: before/after comparison of the downloaded filename

Screenshots must show version 1.3.7 behavior, including the toolbar popup, and should not imply endorsement by arXiv, Google, or Chrome.
