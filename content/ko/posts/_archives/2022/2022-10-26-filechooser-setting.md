---
title: "FileChooser Dialog 크기 설정하기"
author: haruair
uuid: "90f58bef-1cbc-4ba4-b7ac-7043dffdbf5c"
type: post
date: "2022-10-26T22:24:05.141Z"
lang: ko
tags:
  - linux
slug: "size-config-for-filechooser-dialog"
---

파일을 선택해야 할 때 나오는 다이얼로그 크기가 제각각에 너무 작게 나와서 어떻게 변경하는지 찾아 정리했다. VLC는 QT고 Chrome은 gtk를 사용하고 있는 등 중구난방으로 동작하는데 이건 내가 사용하는 배포판의 문제인지 원래 다 그런지는 잘 모르겠다.

## gtk 설정

`gsettings`로 설정할 수 있다고 하는데 지금 사용하고 있는 gtk 버전에 따라 설정이 다르고 어떤 버전이 사용되고 있는지 확인할 방법을 찾을 수 없었다. 대신 `dconf`로 모든 설정을 저장해서 직접 확인하고 적용하는 것이 가능하다.

```bash
$ dconf dump / > dconf-settings.txt
```

이제 `dconf-settings.txt`를 열어서 `FileChooser`를 찾는다. `window-size` 및 기타 설정을 적당히 변경한 후에 다시 적용한다.

```bash
$ dconf load / < dconf-settings.txt
```

## qt 설정

css의 변형인 qss를 통해서 사이즈를 변경할 수 있다.

```bash
$ qt5ct
```

상단 탭에서 Style Sheets를 누른 후 새로운 qss 파일을 생성한다.

새로운 파일을 체크한 후 Edit을 누르고 다음 내용을 추가한다. 크기는 알맞게 선택한다.

```css
QFileDialog {min-height: 900px; min-width: 1600px;}
```

저장 후 적용 버튼을 누르면 끝난다.

