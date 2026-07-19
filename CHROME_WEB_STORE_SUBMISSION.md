# Chrome Web Store submission values

Use these values for item ID `ommocpkbbabooamgmebhgaifammeepll`.

## Store listing

### Description

```text
숫자로만 된 arXiv PDF 파일명 대신, 알아보기 쉬운 논문 정보 기반 파일명으로 저장하세요.

arXiv Save as Title은 arXiv 논문 초록 페이지의 “View PDF” 아래에 다운로드 버튼을 추가합니다. 확장 프로그램 아이콘을 눌러 파일명 형식을 선택하면 결과를 바로 미리볼 수 있습니다.

주요 기능:
• 첫 번째 저자, 제출 연도, 논문 제목의 순서를 원하는 형식으로 선택
• 첫 번째 저자명을 Last Name 또는 Full Name으로 표시
• 저자와 연도를 소괄호, 대괄호 또는 중괄호로 묶기
• 간단한 파일명을 원할 때 논문 제목만 사용
• 다운로드할 때 저장 위치를 물을지 선택
• Chrome 동기화를 통한 파일명 설정 저장

파일명 예시:
Vaswani_2017_Attention_Is_All_You_Need.pdf
Attention_Is_All_You_Need_Vaswani_2017.pdf
(Vaswani2017) Attention_Is_All_You_Need.pdf

이 확장 프로그램은 arXiv 논문 초록 페이지에서만 동작합니다. 광고, 분석, 추적 또는 원격 코드를 포함하지 않습니다. 논문 정보는 파일명을 만들기 위해 사용자의 브라우저에서만 처리되며, PDF는 arXiv에서 사용자의 기기로 직접 다운로드됩니다.
```

### Other fields

- Category: `Productivity`
- Language: `Korean`
- Global promo video: leave blank
- Official URL: `None`
- Homepage URL: `https://github.com/DoYunseo/arXiv-save-as-Title`
- Support URL: `https://github.com/DoYunseo/arXiv-save-as-Title/issues`
- Mature content: `No`
- Item support visibility: `On`

### Graphic assets

- Store icon: `store-assets/store-icon-128.png`
- Screenshot 1: `store-assets/screenshot-options-1280x800.png`
- Screenshot 2: optional. Capture the installed extension's button below “View PDF” on a real arXiv abstract page at 1280×800 or 640×400.
- Small promo tile: `store-assets/promo-small-440x280.png`
- Marquee promo tile: `store-assets/promo-marquee-1400x560.png` (optional)

## Privacy

### Single purpose

```text
Download arXiv paper PDFs with descriptive, user-selected filenames based on the paper title, first author, and submission year.
```

### Permission justifications

#### downloads

```text
Used only after the user clicks the extension's download button to save the selected arXiv PDF with the configured filename.
```

#### storage

```text
Stores and synchronizes the user's filename format, author display, grouping symbol, and save-location preference through Chrome Sync.
```

#### scripting

```text
Reinjects the extension's bundled content script into already-open arXiv abstract tabs after an extension update so the download button continues to work without a manual page refresh. It runs only on the declared arxiv.org host scope.
```

#### Host permission: https://arxiv.org/*

```text
Reads the title, first author, submission year, and PDF link shown on an arXiv abstract page and adds the user-initiated download button. No other website is accessed.
```

### Remote code

- Select: `No, I am not using remote code.`

### Data usage

- Select only: `Website content`
- Reason: the extension locally reads the title, first author, submission year, and PDF link on the current arXiv abstract page solely to create the requested filename and download the paper. This data is not sent to the developer or a third party.
- Do not select the other data categories.
- Check every required Limited Use certification statement.
- Privacy policy URL: `https://github.com/DoYunseo/arXiv-save-as-Title/blob/main/PRIVACY.md`

## Distribution

- Visibility: `Public`
- Geographic distribution: `All regions`
- In-app purchases: `No`

## Access

- Account/login required: `No`
- Paid content or subscription required: `No`
- Special access credentials: `None`

## Test instructions

### Credentials

```text
No account, login, payment, or special credentials are required.
```

### Instructions

```text
1. Open https://arxiv.org/abs/1706.03762.
2. Confirm that “Save with custom name” appears directly below “View PDF” in the Access Paper section.
3. Click the extension toolbar icon.
4. Select a filename format. For example, choose “(저자연도) 제목”, parentheses, and “Last Name”.
5. Confirm that the preview shows “(Vaswani2017) Attention_Is_All_You_Need.pdf”.
6. Click “설정 저장”.
7. Return to the arXiv page and click “Save with custom name”.
8. Confirm that Chrome downloads the PDF with the previewed filename. If “다운로드할 때 저장 위치 묻기” is enabled, choose a location in Chrome's save dialog.

The extension has no hidden features, external account requirements, paid content, analytics, advertising, or remote code.
```

## Final submission checks

- Upload the latest package ZIP from `dist/`.
- Save every dashboard tab before moving to the next tab.
- Confirm the privacy answers match `PRIVACY.md` and the extension's behavior.
- Do not claim affiliation with or endorsement by arXiv, Google, or Chrome.
- Submit for review only after all dashboard warnings are cleared.
