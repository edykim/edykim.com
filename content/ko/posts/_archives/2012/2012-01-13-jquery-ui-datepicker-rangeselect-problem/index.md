---
title: jQuery UI datepicker rangeSelect problem
author: haruair
type: post
date: "2012-01-13T05:50:05"
history:
  - 
    from: https://www.haruair.com/blog/1035
    movedAt: 2018-09-13T22:02:40+00:00
lang: ko
slug: jquery-ui-datepicker-rangeselect-problem
tags:
  - 나의 이야기

---
예전엔 jQuery UI에서 지원하는 datepicker가 range select가 가능했는데 버전이 올라가면서 <a href="http://wiki.jqueryui.com/w/page/12137778/Datepicker" target="_blank">리펙토링 과정</a>에서 버린 기능이 되었는지 존재를 감춰버렸다.

그래서 jQuery UI 1.8.17에 포함된 datepicker를 수정해 range select가 되는 형태로 수정했다. (엄밀하게 따져보면 기존의 형태랑 완전 동일하게 동작하는 것은 아니다.)

물론 소스는 조잡하다;; 적용시 inline.html을 참조해서 적용하면 된다.

[datepicker][1]

 [1]: datepicker.zip