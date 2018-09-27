---
title: httpd -k graceful
author: haruair
type: post
date: 2011-08-16T02:45:53+00:00
history:
  - 
    from: https://www.haruair.com/blog/842
    movedAt: 2018-09-13T22:02:40+00:00
lang: ko
slug: httpd-k-graceful
categories:
  - 개발 이야기
tags:
  - apache

---
<pre>httpd -k restart</pre>

위 커맨드를 사용해서 httpd를 재시작해줬는데 오늘 봤더니 CBand에 기록된 트래픽도 초기화 되더군요. 깜짝 놀랐습니다 ;ㅅ; 검색해보니&#8230; graceful이란게 있더군요. (<a href="http://httpd.apache.org/docs/2.0/ko/stopping.html" target="_blank">http://httpd.apache.org/docs/2.0/ko/stopping.html</a>) httpd.conf가 변경될 때는 서버의 연속성을 유지하며 재시작(이 표현이 적절한지 모르겠습니다만) 하기 위해서는 아래와 같이 하시면 되겠습니다.

<pre>httpd -k graceful</pre>