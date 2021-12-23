---
title: "개발자 동무, 철의 장막 뒤에서 디버깅 하기"
author: haruair
type: post
date: "2021-11-04T16:15:55.626Z"
lang: ko
tags:
 - 번역
 - 개발 이야기
 - 소비에트 연방
slug: "debugging-behind-the-iron-curtain"
---

[Jake Poznanski](https://www.jakepoz.com/)의 글 [Debugging Behind the Iron Curtain](https://www.jakepoz.com/debugging-behind-the-iron-curtain/)을 번역했다.

---

세르게이는 소비에트 연방의 초기 컴퓨터 산업 전문가였습니다. 저는 지난 몇 년 간 그 사람과 함께 일한 덕분에 많이 배울 수 있었습니다. 함께 하는 시간 동안 임베디드 프로그래밍과 인생에 대해 어느 학교에서도 가르치지 못할 만큼 많이 배웠습니다. 가장 인상적인 가르침은 1986년 늦가을에 있던 이야기였습니다. 그 이야기는 세르게이가 가족과 함께 소비에트 연방에서 이주하게 되는 계기가 되기도 합니다. 

<figure>

![](https://www.olddec.nl/Thanks-41-Years/pdp11-20.jpg)

<figcaption>PDP-11 마이크로 컴퓨터</figcaption>
</figure>

1980년대, 세르게이는 SM-1800(PDP-11 소비에트 버전)에서 사용하는 소프트웨어를 개발하고 있었습니다. 스베르들롭스크는 당시 소비에트 연방의 주요 물류 센터가 자리 잡고 있었는데 이 인근 기차역에 이 미니컴퓨터가 설치되던 시기입니다. 새 시스템은 기차 차량과 화물을 의도한 목적지까지 어떻게 보낼 것인가를 디자인하는 일을 수행했습니다. 다만 무작위로 작업 수행에 실패하고 시스템이 충돌해버리는 지저분한 버그가 존재했습니다. 이 충돌은 모두가 집에 간 밤중에 꼭 나타났습니다. 오랜 시간 꼼꼼하게 조사했지만 컴퓨터는 다음날 수동으로 테스트하든 자동으로 테스트하든 상관 없이 전혀 문제가 나타나지 않았습니다. 이런 경우엔 경쟁 상태(race condition)나 아니면 다른 동시성 관련 버그인 것이 일반적입니다. 이런 경우는 해당 문제를 특정 상황에서만 재현할 수 있습니다. 매번 늦은 밤에 전화받는 일에 지쳐버린 세르게이는 이 문제를 밑바닥까지 파헤치기로 마음먹었습니다. 가장 먼저 한 일은 어떤 상태에서 이 문제가 발생하는지 파악하기 위해 충돌이 발생했을 때의 배차 상황을 확인하는 것이었습니다.

세르게이는 먼저 예기치 않게 발생한 모든 충돌 기록을 일자와 시간을 기준으로 달력에 표시했습니다. 당연히 어떤 패턴으로 문제가 나타나는지 명확하게 보였습니다. 며칠 간의 활동을 살펴보기만 해도 앞으로 언제 문제가 발생하는지 쉽게 예측할 수 있었습니다.

세르게이는 그렇게 기차역 컴퓨터가 언제 오작동하는지 알아냈습니다. 문제는 우크라이나 북부와 러시아 서부에서 인근에 있는 도살장에 가축이 도착했을 때만 나타났습니다. 세르게이는 이 사실이 이상하다고 느꼈습니다. 사실 이 지역 도살장은 더 가까이 있는 카자흐스탄 농장에서 가축을 공급받아왔었기 때문입니다. 

아시다시피 1986년에 발생한 체르노빌 원전 사고로 인해 치명적인 수준의 방사선 뿜어져 나왔고 현재까지도 인근 지역은 거주가 불가능합니다. 이 방사능으로 인해 우크라이나 북부, 벨라루스, 러시아 서부 등 광범위한 지역이 오염되었었습니다. 세르게이는 도착 열차와 고농도의 방사선이 연관이 있다고 가설을 세우고 이 문제를 확인하기로 했습니다. 하지만 당시에는 개인이 방사선 측정기를 소지하는 것은 소비에트 정부에 의해 금지되어 있었습니다. 그래서 세르게이는 먼저 기차역에서 근무하는 군인 몇 명과 함께 술을 마셨습니다. 그렇게 보드카를 몇 잔을 마신 후에 한 군인을 설득할 수 있었습니다. 세르게이는 어떤 열차 차량이 수상한지 지목했고 군인과 함께 그 차량의 방사선을 측정했습니다. 그 차량에서는 정상 수치를 넘는, 매우 높은 방사선이 나오고 있는 것을 확인할 수 있었습니다.

단순히 운송되는 가축이 방사선에 심각하게 오염된 상태인 것뿐만 아니라 지나치게 높은 방사선량으로 인해 SM-1800의 메모리에서 비트 플립(bit-flipping)이 발생하고 있었던 것입니다. 컴퓨터가 기차선로 인근 건물에 설치되어 있었을 뿐인데 말이죠.

소비에트 연방에는 종종 심각한 기근이 있었고 정부 계획 하에 체르노빌 지역에서 생산한 가축으로 만든 육류를 그 외 지역의 육류와 섞는 방식으로 해결하려고 했습니다. 이 방식으로 육류의 평균 방사선 수치를 낮추는 동시에 귀한 자원을 낭비하지 않는 것이죠. 이 “발견”으로 세르게이는 당장 이민 서류를 꾸려 어디든 이민을 받아주는 곳으로 당장 떠났습니다. 시간이 지나 방사능 수치가 낮아지자 컴퓨터에서 발생한 충돌 문제는 저절로 고쳐졌습니다.