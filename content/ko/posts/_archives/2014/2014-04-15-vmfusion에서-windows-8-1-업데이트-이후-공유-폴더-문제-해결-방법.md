---
title: VMFusion에서 Windows 8.1 업데이트 이후 공유 폴더 문제 해결 방법
author: haruair
type: post
date: "2014-04-15T00:04:23"
history:
  - 
    from: https://www.haruair.com/blog/2150
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: how-to-troubleshoot-shared-folders-after-windows-8.1-update-in-vmfusion
tags:
  - 개발 잡동사니
  - vmware
  - windows 8.1
  - wmfusion

---
## tl;dr

VMWare Tools를 다시 설치하면 된다.

<img src="https://24.media.tumblr.com/07b58612fca6accaaa64293e1176e4b2/tumblr_n41pcuuAC21tyfpkyo1_500.png?resize=430%2C494&#038;ssl=1" width="430" height="494" alt='VMWare Tools 재설치하기' data-recalc-dims="1" />

## 문제

맥에서 VMFusion를 사용해 Windows 개발 환경을 쓰고 있었는데 8.1로 업데이트 한 이후 공유 폴더 드라이브에 연결하지 못하는 문제가 나타났다.

VMFusion에서는 맥과 윈도우 환경을 가상 드라이브를 통해 연결하는데 이 설정에서 윈도우 기본 폴더들을 맥 환경의 디렉토리로 연결해둘 수 있다. Desktop도 그런 방식으로 공유되어 있는 상태였는데 읽을 수는 있으나 저장이 안되는 이상한 상황이라 이것 저것 둘러보다가 가상 드라이브가 없어진 상태라는 것을 알게 되었다. Sharing에 문제가 있다고 로그아웃 하라는 얘기는 계속 나오지만 로그아웃 해도 해결되지 않았다.

VMWare Tools를 재설치하니 정상적으로 드라이브를 인식해 다시 사용할 수 있었다.

## 해결 과정

  1. 일단 VM을 종료한다.
  2. 메뉴에서 `Virtual Machine > Sharing > Sharing Settings...`에 들어가 공유를 끈다.
  3. VM을 실행하고 로그인해서 바탕화면까지 진입한다.
  4. 메뉴에서 `Virtual Machine > Update VMWare Tools` 또는 `Virtual Machine > Reinstall VMWare Tools`을 선택한다. VMWare Tools를 내려받는 과정 후 가상 이미지가 자동으로 추가되어 설치가 진행된다. 자동으로 진행되지 않으면 내 컴퓨터 > `D:` 에 있는 설치 프로그램을 실행해준다.
  5. 설치가 완료되면 재시동 하라고 하는데 재시동 한다.
  6. 다시 메뉴에서 `Virtual Machine > Sharing > Sharing Settings...`에 들어가 공유를 켠다.
  7. 재시동 된 VM에서 로그인한다. VM Sharing 설정이 변경되어 다시 로그인하라는 메시지가 뜨면 다시 로그인한다.