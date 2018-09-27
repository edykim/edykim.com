---
title: Cufon에서 hover 사용하기
author: haruair
type: post
date: 2011-10-24T00:08:31+00:00
history:
  - 
    from: https://www.haruair.com/blog/894
    movedAt: 2018-09-13T22:02:40+00:00
lang: ko
slug: using-hover-in-cufon
categories:
  - 개발 이야기
tags:
  - front

---
[Cufon][1]은 font를 js 데이터로 변환해 canvas로 출력하는 방식으로, 기존 iFR, FIR, sFIR 처럼 텍스트를 그래픽 폰트로 변경해주는 도구다. `canvas` 기반이라 플래시보다 무겁진 않지만 글꼴의 끝부분이 다소 뭉개지는 현상이 있다. 한국어 폰트는 여전히 글자수가 많기 때문에 용량상 이득은 크게 없는 편이다.

Cufon에서 `:hover`를 사용하기 위해서는 다음과 같은 방법으로 작성해야 한다.

    Cufon.replace('#navlist li a', { hover: true, fontFamily: 'MyFont' });
    Cufon.replace('h2, h3, h4', { hover: true,  fontFamily: 'MyOtherFont'});
    

다음과 같이 작성하면 내용이 덮어져 `:hover`가 동작하지 않는다는 점을 유의하자.

    Cufon.replace('#navlist li a', {hover: true});
    Cufon.replace('#navlist li a', {fontFamily: 'MyFont'});

 [1]: http://cufon.shoqolate.com/