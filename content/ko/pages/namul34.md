---
title: namul34
author: haruair
uuid: "178e644e-763d-444f-a9c9-989b84376e5a"
type: page
date: "2025-12-30T06:12:46"
lang: ko
url: /keyboard/namul34/
---

<img src="/ko/post/namul34-keyboard/keyboard-1.webp">

[namul34](/ko/post/namul34-keyboard/)는 ZMK 펌웨어 기반 34키 3행 레이아웃으로
구성된 블루투스 키보드로 가방에 넣고 다니기 좋은 키보드를 목표로 제작했다.

- [edykim/namul34](https://github.com/edykim/namul34): 코드 리포지터리로 PCB,
  케이스, 펌웨어 설정 등을 포함하고 있다.

## 영상 자료

어떤 방식으로 키보드 제작이 진행되는지 아래 영상으로 배울 수 있었다. 많은 영상을
보긴 했지만 각각의 도구를 배우고 과정을 배우는데 다음 영상을 많이 참고했다.

- [ESP32 무선 블루투스 키보드 제작 과정][4]: EasyEDA와 Fusion360 사용 방법
- [PCB 설계 제작 가이드][1]: EasyEDA 사용 방법
- [I Built My Dream Keyboard from Absolute Scratch][3]: 키보드 개발 전반 과정
- [How to Build a Handwired Keyboard][5]: 디자인 방법, 개념 설명 등
- [How to Mill Max a PCB][2]: 핫스왑 구조

## 디자인 결정 

- 34키: 직접적으로 입력이 없는 메타키를 몇 개나 넣을지 고민하다가 좌우에 각각
  3개씩 넣어 34키 배열로 정했다.
- 계단식 배열(staggered): 직교식 배열도 많이 사용하지만 작은 키보드에서는
  아무래도 손을 모아서 입력하기 때문에 레이아웃이 딱 떨어지지 않더라도 계단식을
  선택했다.
- 3행: 스마트폰과 비슷한 높이로 만들고 싶었기도 했고 기왕 만드는 것 일반적이지
  않은 디자인으로 만들고 싶었다.

## 기술 결정

- ZMK 호환 보드: QMK 대신 ZMK를 선택한 이유는 블루투스를 기본으로 지원하기
  때문이다. QMK 키보드는 코드가 훨씬 직관적인 편이며 ZMK는 [zephyr][8]를
  기반으로 작성돼 이해하는데 꽤 시간이 걸렸다. nice!nano v2 보드와 호환이 되는
  [SuperMini NRF52840][6] 보드를 사용했다.
  - ZMK 펌웨어에 관한 질문은 LLM보다 ZMK 디스코드를 확인하는 게 시간을 많이 아낄
    수 있다. 웹에 자료가 많이 없어서 그런지 ZMK 디스코드 공지사항에도 LLM 사용을
    권장하지 않는다는 얘기가 걸려있다.
- 배터리: 무선 키보드를 만들려면 배터리 공간을 염두해야 하기 때문에 배터리
  여부와 용량이 중요한 부분 중 하나다. 아무래도 작은 키보드기 때문에 각도가 거의
  없다시피 해서 배터리를 숨길 공간이 생각처럼 크지 않았다. 배터리 용량은 대기
  시간을 용량 기준으로 [ZMK Power Profiler][7] 웹페이지에서 계산할 수 있다.

## 도구

- Autodesk Fusion360: 무료 버전을 사용했고 케이스와 플레이트 디자인에 사용했다.
- EasyEDA: PCB 디자인에 사용했다. 만약 새로 만든다면 Kicad를 사용할 것 같다.

## 부품

| Description                    | Part / Model            | Notes                                       | Quantity |
|--------------------------------|-------------------------|---------------------------------------------|----------|
| Resistor Kit                   | —                       | 0805 SMD     LED용 저항                     | 3  |
| LED Kit                        | —                       | 0803 SMD     상태 표시용 LED                | 3  |
| Tactile Push Button            | —                       | SMD          리셋 스위치                    | 1  |
| Hot-Swap Socket (Low-Profile)  | Gateron                 | SMD          키보드 스위치 소켓             | 34 |
| Toggle Switch                  | SSSS811101              | Through-hole 전원 스위치                    | 1  |
| Signal Diode                   | 1N4148 T4               | 0805 SMD     다이오드                       | 34 |
| Development Board              | nice!nano v2            | Module       nRF52840, ZMK compatible       | 1  |
| Keycap                         | Nuphy                   |                                             | —  |
| Keyboard Switch                | Gateron                 | v2.0 red switch                             | 34 |

- 그 외 구입한 품목은 PCB를 케이스에 마운팅 하기 위한 M2 볼트와 너트, Pincil 납땜
인두와 인두 보조용 소모품 등이 있다.
- Gateron 로우 프로파일 v2.0 적축과 함께 nuphy 키캡을 사용했다.


[1]: https://www.youtube.com/watch?v=U1cSzB38JNQ
[2]: https://www.youtube.com/watch?v=xigj_DyaftM
[3]: https://www.youtube.com/watch?v=7UXsD7nSfDY
[4]: https://www.youtube.com/watch?v=lxH14Z1KOIw
[5]: https://www.youtube.com/watch?v=hjml-K-pV4E
[6]: https://github.com/joric/nrfmicro/wiki/Alternatives#supermini-nrf52840
[7]: https://zmk.dev/power-profiler
[8]: https://docs.zephyrproject.org/

