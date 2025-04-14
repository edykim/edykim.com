---
title: "Xcode의 기기 USB 연결 문제 해결하기"
author: haruair
uuid: "c97f85d3-c09f-4c21-a928-48d69c5acca8"
type: post
date: "2021-12-30T19:27:44.898Z"
lang: ko
tags:
 - 개발 이야기
 - xcode
 - usb
slug: "how-to-fix-usb-connectivity-issue-with-xcode"
---

iOS 앱을 개발하다보면 Xcode에서 기기를 제대로 인식하지 못해서 연결이 되었다 말았다 하는 증상을 보일 때가 있다. Xcode나 기기를 껐다 켜면 해결된다는 글을 예전에 보고 그렇게 해왔는데 한참 개발하고 있을 때 문제가 생기면 엄청 번거롭다. 케이블이 문제라는 글도 있었는데 결국 다 변죽 울리는 얘기고 문제는 usbd였다.

이전에 연결되어 있던 usbd이 죽지 않고 정지된 상태로 대기중일 때 이런 문제가 발생한다. 터미널에서 다음 명령어로 해당 데몬을 끄면 정상적으로 동작한다.

```
$ sudo killall -STOP -c usbd
```

