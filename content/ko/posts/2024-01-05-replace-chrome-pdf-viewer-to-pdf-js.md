---
title: Google Chrome PDF 뷰어를 Mozilla PDF.js로 교체하기
author: haruair
type: post
date: 2024-01-05T15:01:47
lang: ko
slug: replace-google-chrome-pdf-viewer-with-pdf-js
tags:
  - 개발 이것저것
---

Google Chrome를 주로 사용하고 있는데 언제부터인지 브라우저 내 PDF 뷰어가 엄청 느려졌다. Mozilla의 pdf.js가 Chromium 확장을 제공하고 있어서 설치해봤는데 만족스럽다. Manifest V2로 작성된 확장이라서 크롬 웹 스토어에 있는 버전은 더이상 관리되지 않는 것 같다. 그래도 직접 빌드를 한 경우엔 아직까지도 문제 없이 설치할 수 있다.

```bash
$ git clone https://github.com/mozilla/pdf.js.git && cd pdf.js
$ npm install --global glup-cli
$ npm install
$ glup chromium
```

Google Chrome에서 `chrome://extensions`를 연 후 좌측 상단에 **Load unpacked** 버튼을 클릭, 그리고 `pdf.js` 폴더 내에 `build/chromium`을 선택하면 확장을 설치할 수 있다. Firefox에 내장되어 있는 pdf 뷰어와 동일하게 동작한다.

