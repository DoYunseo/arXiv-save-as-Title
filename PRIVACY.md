# Privacy Policy for arXiv Save as Title

Effective date: July 19, 2026

arXiv Save as Title does not transmit personal or sensitive user data to the developer or third parties. It locally handles limited website content as described below.

## Information processed by the extension

When a user chooses to download a paper, the extension reads the paper title, first author name, submission year, and PDF URL displayed on the current `arxiv.org` abstract page. This information is processed locally in the user's browser only to generate the requested PDF filename.

The extension stores the following user preferences with `chrome.storage.sync`:

- Filename format
- Author-name display format
- Grouping symbol
- Whether Chrome should ask for a download location

These preferences may be synchronized by Chrome according to the user's Chrome Sync settings. The developer does not operate a server and does not receive these preferences.

## Downloads

PDF files are downloaded directly from `arxiv.org` to the user's device through Chrome's Downloads API. Paper metadata and downloaded files are not sent to the developer.

## Analytics and advertising

The extension does not include analytics, advertising, tracking, or remote code.

## Limited Use

Information handled through Chrome APIs is used only to provide the extension's user-facing PDF filename and download features. It is not sold, used for advertising or creditworthiness, transferred for unrelated purposes, or made available for human review. This use complies with the Chrome Web Store User Data Policy, including its Limited Use requirements.

## Changes to this policy

If the extension's data practices change, this policy and the Chrome Web Store disclosures will be updated before the related release is published.

## Contact

Questions and support requests can be submitted through the project's [GitHub Issues](https://github.com/DoYunseo/arXiv-save-as-Title/issues).
