---
title: "Lenovo ThinkPad X1 Carbon 6세대 디스플레이 교체기"
author: haruair
uuid: "08d5da35-23c2-4c91-9acb-36ed898ea0e9"
type: post
date: "2021-06-18T13:02:23"
lang: ko
slug: lenovo-thinkpad-x1-6gen-display-replacement
tags:
  - 개발 잡동사니
  - Lenovo x1 carbon
---

2018년 중순에 구입한 싱크패드를 계속 사용하고 있었다. 구입할 당시에 가장 고민했던 부분이 바로 디스플레이였는데 Costco에서 판매하는 모델은 밝기가 상당히 낮은 디스플레이를 탑재하고 있었다. 들고 다니는 용도라서 FHD면 베터리도 더 오래가고 매트 코팅이라서 눈도 피로하지 않겠다 생각하고 구입을 결정했었다. 사용에 큰 불편함은 없었지만 창을 여럿 열고 개발을 하거나 여러 자료를 동시에 봐야 할 때는 낮은 해상도와 어두운 화면이 계속 거슬렸다.

교체를 할 수 있나 찾아보다가 생각보다 시도한 사람도 많고 방법도 잘 정리되어 있었다. 탑재된 FHD는 250 nit에 1920x1080 인데 HDR WQHD는 500 nit에 2560x1440 까지 지원한다. 학기 사이 방학동안 교체할 마음으로 부품을 주문했다.

전체적인 순서와 제품은 레딧에 올라온 글을 참고했다.

- [X1 Gen6 FHD to WQHD retrofit success by u/Organic_Lack](https://www.reddit.com/r/thinkpad/comments/bup7oz/x1_gen6_fhd_to_wqhd_retrofit_success/)

시간 여유가 있었으면 필요한 부품을 알리익스프레스에서 구입했을 텐데 다음 학기가 코앞이라 eBay에서 미국 내 배송하는 곳을 찾아 주문했다. 위 글에서는 상판 커버도 교체했는데 FHD 커버(01YR430)와 WQHD 커버(01YU642) 사진을 찾아보니 차이가 없는 것 같아 일단 교체해보고 문제가 생기면 그때 커버를 구입하기로 결정했다.

그리고 전면 베젤이 스티커라는 걸 처음 알았는데 조심히 뜯어서 다시 붙이기로 했다.

- 00NY679 14인치 WQHD 디스플레이 ($139.99)
- 01YR429 WQHD용 40-pin eDP 케이블 ($23.14)

디스플레이 판매하는 곳이 실제로 어떤 디스플레이인지 메시지 보내서 물어봐야 한단다. 그렇지 않으면 호환 규격은 맞지만 다른 제품으로 보내주는 경우가 많다고. 나는 00NY679 불렀는데 00NY680이 왔다. 호환은 되지만 찜찜.

| Part # | Brand | Brightness | Color space |
|-|-|-|-|
| 00NY679 | AUO B140QAN02.0 WQHD HDR | 500nit | 100% sRGB, 89% adobeRGB |
| 00NY680 | Japan Display JDI LPM140M420 WQHD HDR | 500nit | no reviews found |
| 00NY664 | LG Display LP140QH2(SP)(B1) QWHD non-HDR | 300nit | 98% sRGB, 68% adobeRGB |
| 00NY681 | AUO B140QAN02.3 WQHD non-HDR | 300nit | 96% sRGB, 61% adobeRGB |
| 01YN103 | BOE NV140FHM-N46 FHD non-HDR non-touch | 250nit | 59% sRGB & 38% adobeRGB |

내 랩탑은 20KG 모델이고 교체 방법은 레노보 웹사이트에 잘 정리되어 있었다. 영상 따라서 분해하고 조립했는데 전혀 어려움이 없었다.

- [Removal and Replacement Videos - ThinkPad X1 Carbon Gen 5 (20HQ, 20HR, 20K3, 20K4), ThinkPad X1 Carbon Gen 6  (20KG, 20KH)](https://support.lenovo.com/us/en/solutions/HT510695)

교체 직후에 여름 학기가 시작되어서 또 바빠졌다. 아무래도 무광에서 유광 디스플레이로 바뀌고 나니 자꾸 내 얼굴이 보이는 문제가 있었다. 아마존에서 저렴한 14인치 반사 제거 필름을 붙여서 해결했다.

아이폰 디스플레이와 비교했을 때 엄청 어두웠는데 교체 후 최대 밝기는 아이폰보다 밝다. 실제로 사용해보니 70% 정도만 설정해도 편하게 쓸 수 있었다. 다만 베터리 소모가 조금 많아졌는데 크게 와닿을 정도로 사용 시간이 줄어들진 않았다.

그동안 다른 랩탑 디스플레이도 여러 차례 교체해봤는데 가장 편하게 교체한 모델이다. 아무래도 기업에서 많이 사용해서 그런지 교체 방법도 공개적으로 정리되어 있고 파트 정보도 쉽게 찾을 수 있는 게 흥미로웠다.

