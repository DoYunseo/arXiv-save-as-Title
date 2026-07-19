# arXiv Save as Title

A Chrome extension that downloads arXiv PDFs with readable, customizable filenames.

<img width="1357" alt="arXiv Save as Title" src="https://github.com/user-attachments/assets/1f176a1b-2269-4490-992a-6317ee33355f" />

## Features

- Adds a **Save with custom name** button directly below **View PDF** on arXiv abstract pages
- Provides filename presets using the paper title, first author, and submission year
- Supports the first author's **Last Name** or **Full Name**
- Supports author-year grouping with parentheses `( )`, square brackets `[ ]`, or curly braces `{ }`
- Shows a live filename preview before saving
- Saves preferences with Chrome Sync
- Lets you choose whether Chrome asks for a download location

### Filename examples

```text
Vaswani_2017_Attention_Is_All_You_Need.pdf
Attention_Is_All_You_Need_Vaswani_2017.pdf
(Vaswani2017) Attention_Is_All_You_Need.pdf
[Ashish_Vaswani2017] Attention_Is_All_You_Need.pdf
```

## How to use

1. Download or clone this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select this repository folder.
5. Pin the extension to the Chrome toolbar.
6. Click the extension icon and select a filename format, author display, and optional grouping symbol.
7. Click **Save settings**.
8. Open an arXiv abstract page, such as <https://arxiv.org/abs/1706.03762>.
9. Click **Save with custom name** below **View PDF**.

## 사용법

1. 이 저장소를 다운로드하거나 복제합니다.
2. Chrome에서 `chrome://extensions`를 엽니다.
3. **개발자 모드**를 활성화합니다.
4. **압축해제된 확장 프로그램을 로드합니다**를 누르고 이 저장소 폴더를 선택합니다.
5. 확장 프로그램을 Chrome 툴바에 고정합니다.
6. 확장 아이콘을 눌러 파일명 형식, 저자 표시 방식, 묶음 기호를 선택합니다.
7. **설정 저장**을 누릅니다.
8. arXiv 논문 초록 페이지를 엽니다.
9. 오른쪽 **View PDF** 아래의 **Save with custom name** 버튼을 눌러 PDF를 저장합니다.

## Supported filename options

- Author · Year · Title
- Title · Author · Year
- Year · Author · Title
- Title only
- Grouped Author-Year · Title
- Author display: Last Name / Full Name
- Grouping symbol: `( )` / `[ ]` / `{ }`

## Privacy

The extension does not collect or transmit personal data. Paper metadata is processed locally to generate filenames, and preferences are stored using `chrome.storage.sync`.

## Learn more / 자세히 보기

📝 [기술 블로그 글 보러 가기 (Tistory)](https://tori-notepad.tistory.com/40)

👉 개발 배경과 확장 프로그램 구조를 확인할 수 있습니다.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=DoYunseo/arXiv-save-as-Title&type=date&legend=top-left)](https://www.star-history.com/#DoYunseo/arXiv-save-as-Title&type=date&legend=top-left)

---

Made with ❤️ by YunseoDo
