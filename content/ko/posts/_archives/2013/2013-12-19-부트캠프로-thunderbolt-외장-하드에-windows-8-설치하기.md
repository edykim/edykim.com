---
title: 부트캠프로 thunderbolt 외장 하드에 Windows 8 설치하기
author: haruair
uuid: "1c7958ca-1388-4d1c-830e-42c0199381e2"
type: post
date: "2013-12-19T00:33:51"
history:
  - 
    from: https://www.haruair.com/blog/1938
    movedAt: 2018-09-13T22:02:40+00:00
lang: ko
slug: installing-windows-8-on-thunderbolt-external-hard-drive-as-boot-camp
tags:
  - 개발 잡동사니
  - bootcamp
  - ssd
  - 부트캠프
  - 윈도우 설치
  - 이상한 모임

---
> 포스트를 작성한지 시간이 꽤 지났고 더이상 부트캠프를 사용하고 있지 않아 질문을 하셔도 답변 드리기 어렵습니다. 이 모든 과정은 글에 있는 다른 블로그 포스트 링크와 구글 검색으로 해결할 수 있는 부분이니 참고하시기 바랍니다.

부트캠프를 통해 Thunderbolt 외장 하드에 Windows 8을 설치한 과정을 기록한 포스트다. 관련 글이 많은데 windows에서의 작업 없이 설치한 경우의 글은 없는 것 같아 정리해봤다.

**이 글은 상당히 불친절하다.** 아래의 준비물과 순서를 보고 이해가 되지 않는다면 끝없는 인내심이 필요하다. 무슨 이야기인지 조금이라도 모르겠다 싶으면 이 글 말고 [부트 캠프 없이 외장 하드로 맥에서 윈도우 설치/부팅하기][1] 또는 [맥북에어13(2013 하스웰) 부트캠프 윈도우8 설치][2] 포스트를 참고하자.

## 동기

맥북에어 2012 모델인데 Windows는 딱히 필요 없을 것이란 생각에 128GB SSD로 구입했다. 그러던 중 닷넷 스터디로 인해 Windows가 필요하게 되었는데 VMWare를 통해 Windows를 외부 하드에서 구동하니 실제 사용하기 어려울 정도로 느렸다. 훨씬 빠른 속도의 thunderbolt를 이용한 외장하드를 쓴다면, 거기다 저장 매체를 SSD를 쓴다면 쾌적하게 쓸 수 있지 않을까 하는 생각에 [LaCie thunderbolt SSD 256GB][3]를 구입해 Windows를 설치하게 되었다.

<!--more-->

## 삽질의 주된 원인

가장 큰 문제는 Windows 설치 시 하드로 인식하느냐, usb로 인식하느냐의 차이가 있다. 부트캠프에서 windows를 usb에 옮겨 담아 실질적으로 windows의 설치 흐름을 따라서 진행하게 되는데 설치를 진행하다보면 파티션을 선택하는 부분에서 USB 또는 firewire로 연결된 장비에는 Windows를 설치할 수 없다는 메시지와 함께 더이상 진행할 수 없게 된다.

또한 Windows 콘솔 환경에서 `diskpart`를 이용해 파티션을 설정해야 한다. 맥에서 포맷해봐야 해당 파티션을 윈도우 설치 시 제대로 포맷되지 않는다.

## 준비물

  * 선더볼트 지원 외장하드 : 이 하드에 Windows를 설치 할 예정
  * 4GB 이상의 USB 메모리 : 부트캠프를 통해 Windows 이미지를 메모리에 설치
  * 설치할 Windows DVD 또는 ISO 파일 : 부트캠프에서 이미지를 설치할 때 사용
  * Windows Command Prompt에 대한 얕은 이해 (도스 명령어 정도)
  * 강인한 정신 등등

## 설치 과정

  1. 먼저 맥에서 Bootcamp Assistant를 실행해 windows 이미지를 usb 메모리에 담는다. usb 메모리의 내용은 초기화되므로 주의하고, 또 다른 외장 하드나 맥OS가 설치되어 있는 드라이브를 선택하지 않도록 신중하게 선택한다.
  2. 이미지를 usb에 담는 과정은 조금 지나면 끝난다. 완료되었으면 맥을 종료하고 다시 켤 때 `option`키를 눌러 부트로더로 진입한다.
  3. 부트로더로 진입하면 ELI 어쩌고 또는 Windows가 보이는데 뭐가 다른지 모르겠다. ELI로 진입한다.
  4. 그러면 Windows 로고가 나오면서 설치 화면 안내가 나온다. 설치를 바로 하는 것이 아니라 하단의 Repair 버튼을 눌러 command prompt로 진입해야 한다.
  5. [부트 캠프 없이 외장 하드로 맥에서 윈도우 설치/부팅하기][1] 글의 _4. 외장 하드 파티션 나누기_ 부분을 따라서 파티션 작업을 진행하는데 부팅용 파티션이라는 부분을 다음 순서를 위해 4GB 이상으로 설정한다.
  6. 새로 생성한 파티션 중 부팅용 파티션에 메모리에 들어있던 내용을 콘솔을 통해 전부 복사한다. (4GB가 넘음)
  7. 컴퓨터를 종료하고 USB 메모리를 뺀 후에 다시 `option`키를 눌러 부트로더 진입, 윈도우 시동을 한다.
  8. 외장 하드의 두번째 파티션에 Windows를 설치한다.
  9. 설치를 완료하고 재부팅해 윈도우에 들어가면 멀티부팅 설정이 되어 있는데 Setup이 아닌 Windows를 선택해 진입한다. [윈도우즈 7 멀티부팅 제거 방법][4] (8도 같은 방법으로 가능)
 10. [Boot Camp Support Software][5]를 내려받아 설치한다.

### 왜 외장 하드에 메모리 내용을 옮겨야 하나

메모리로 부팅하면 일종의 LiveCD와 같이 동작하는 상태인데 이런 경우 외장하드를 USB나 firewire로 연결한 기기라고 뜨거나 윈도우를 설치할 수 없는 상태라고 설치를 진행하지 못하게 막는다. 해당 하드에 설치 이미지를 복사하면 일반 하드로 인식해서 설치가 진행된다.

### [부트 캠프 없이 외장 하드로 맥에서 윈도우 설치/부팅하기][1] 글과 다른 부분은 무엇인가

Windows 환경을 설치하지 않아도 된다는 점이다. 해당 글에서는 부팅 파티션을 생성해주는 도구를 사용하는데 Windows 환경이 있어야만 한다. 4GB 라는 용량이 낭비 같지만 문제가 생겼을 때 복구용으로 쓸 수 있다는 이점도 있다.

### 맥의 디스크 관리자(Disk Utility)로는 파티션 분리가 안되나

맥은 ntfs가 지원되지 않고 별도의 프로그램을 설치해야 한다. 내 경우는 ntfs-3g가 설치되어 있는데 디스크 관리자(Disk Utility)에서 ntfs로 포맷이 가능했지만 뭔가 인식이 제대로 안되었다. 그래서 Windows의 command prompt에서 포맷했더니 그때야 제대로 인식이 되었다.

## 성능 및 호환성

SSD에 선더볼트라서 엄청나게 빠르다. Windows 8.1이라서 성능 점수 표시 부분이 없어져 딱히 인증 할 만한 자료가 없다. 현재 Visual Studio 2012, SQL Server 등 Windows 개발 환경 설정을 모두 했는데 상당히 빠르다.

대부분의 드라이버가 잘 인식되서 정상적으로 동작한다. 화면이 어두워지고 최대 밝기로 올려도 밝아지지 않는 문제가 있었는데 [Windows의 절전 모드 설정][6]을 변경해 해결했다.

트랙패드 역방향 문제가 있는데 아직 해결하지 못했다. Registry를 수정해주면 된다고 하는데 수정해도 적용이 안된다.

## 결론

비싸더라도 큰 SSD가 탑재된 맥북을 구입하자.

속도가 궁금하면 다음 영상을 참고하자.

[iframe src=&#8221;http://www.youtube.com/embed/KoiaKLWfGto&#8221; width=&#8221;100%&#8221; height=&#8221;480&#8243;]

 [1]: http://nuridol.egloos.com/3967659
 [2]: http://onasaju.tistory.com/54
 [3]: http://www.lacie.com/us/products/product.htm?id=10599
 [4]: http://poeta.tistory.com/68
 [5]: http://support.apple.com/kb/dl1638
 [6]: http://www.howtogeek.com/107173/disable-windows-8s-adaptive-brightness-to-fix-dark-screen-problems/