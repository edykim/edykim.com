---
title: 미니 붐박스
author: haruair
uuid: "14bbd765-7cbf-444f-bb72-f0c5cbaf7e8d"
type: page
date: "2025-10-12T21:55:04"
lang: ko
url: /mini-boombox/
---

**작성중**

## 자재 명세서

<div class="table--left">

| 자재명                              | 수량 |
| ----------------------------------- | ---- |
| SPST 전원 스위치                    | 1    |
| MX 호환 키보드 스위치               | 2    |
| 4옴 3와트 스피커                    | 1    |
| DFPlayer Mini v1 모듈               | 1    |
| MicroSD 메모리 카드                 | 1    |
| 3-AA 전지 배터리 홀더               | 1    |
| M2.5 십자 볼트                      | 8    |
| 연결 케이블 (아두이노용 점퍼케이블) | 8    |
| 케이스                              | 1    |
| 가방끈 (폭 25mm 이하, 선택) | - |

</div>

## 케이스 명세

[Autodesk Fusion][1]을 사용해서 모델링했고 3D 프린터로 출력했다.

<div class="table--left">

| 자재명                      | 수량 |
| --------------------------- | ---- |
| 케이스 본체                 | 1    |
| 푸시 스위치 키캡            | 2    |
| 푸시 스위치 커버 플레이트   | 1    |
| 전원 슬라이드 스위치        | 1    |
| 전원 슬라이드 커버 플레이트 | 1    |
| 케이스 뚜껑                 | 1    |

</div>

## DFPlayer Mini 모듈

- [DFPlayer Mini Mp3 Player - DFRobot Wiki][2]
- DFPlayer Mini는 인코더를 탑재하고 있어 mp3를 재생할 수 있다.
- 재생 순서는 `001.mp3`, `002.mp3`, ... 식으로 파일명을 사용한다.
- FAT32로 포맷해야 한다.

## 음원

폴더 내 모든 파일명을 양식에 맞게 변경한다.

```python
import os

directory = "."
files = sorted([f for f in os.listdir(directory) if f.lower().endswith(".mp3")])

for i, filename in enumerate(files, start=1):
    new_name = f"{i:03}.mp3"  # 001.mp3, 002.mp3, ...
    old_path = os.path.join(directory, filename)
    new_path = os.path.join(directory, new_name)
    print(f"Renaming '{filename}' → '{new_name}'")
    os.rename(old_path, new_path)
```

음원 노멀라이즈는 음원을 기준 레벨에 맞게 조절해주는 과정이며 여기서는
`ffmpeg-normalize`를 사용했다. `pip install ffmpeg-normalize`로 설치한 후에 다음
코드로 현재 폴더에 있는 mp3를 수정한다. 동시에 모노 64k 비트레이트로 변경하는데
스피커에 맞게 조절한다.

```python
import os
import subprocess

subprocess.run(["mkdir", "output"])

for file in sorted(os.listdir(".")):
    if file.lower().endswith(".mp3"):
        output = f"output/{file}"
        subprocess.run([
            "ffmpeg-normalize", file,
            "-o", output,
            "--keep-loudness-range-target",
            "-c:a", "libmp3lame",
            "-b:a", "64k",
            "-ac", "1",
            "-f"
        ])
```

[1]: https://www.autodesk.com/products/fusion-360/personal
[2]: https://wiki.dfrobot.com/dfplayer_mini_sku_dfr0299
