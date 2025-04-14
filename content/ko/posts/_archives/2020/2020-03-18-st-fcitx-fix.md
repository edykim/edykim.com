---
title: suckless st 한글 띄어쓰기 문제 수정하기
author: haruair
uuid: "aa8a6871-d6b6-4ac3-b9b9-9211b0e20e8c"
type: post
date: "2020-03-18T20:27:00"
lang: ko
slug: fix-hangul-input-spacing-order-issue-in-st-with-fcitx
tags:
 - 개발 잡동사니
 - st
 - fcitx
---

suckless의 [st](https://st.suckless.org/) 터미널을 사용하고 있는데 간혹 한글 입력에서 띄어쓰기 순서가 뒤죽박죽되는 문제가 있었다. 가령 "맑은 물"을 입력하면 "맑 은물"로 입력되는 식이다.

입력하는 속도에 상관없이 이 증상이 가끔 나타나서 불편했었다. 다른 터미널에서는 별 문제 없이 동작하는 점에서 볼 때 st의 문제라고 생각했었는데 urxvt 코드랑 비교해봐도 크게 차이나는 부분은 없었다. 그래서 im 떄문인가 싶어서 fcitx 대신 ibus랑 scim도 설치해서 확인해봤는데 문제가 더 두드러지게 나타났다.

st의 run 함수에서 실제로 전달받는 XEvent를 확인해보면 실제로 띄어쓰기가 가끔 먼저 전달되는 경우를 확인할 수 있었다. XEvent 자체가 비동기라서 순서가 반대로 온다면 fcitx의 문제이거나 컴퓨터 성능탓에 처리 지연이 있다거나 다른 터미널에 비해 가벼워서 사이클 속도가 훨씬 빨라 지연이 눈에 띄게 보인다거나... 그런 가정만 늘어갔다. 10번 입력하면 한 두 번 발생하기 때문에 무엇이 문제인지 판단하기도 어려웠다.

그래서 st 코드를 하나씩 살펴보며 변경할 수 있는 구조는 다 변경해봤다. 그러던 중에 `XCreateIC` 호출 부분을 수정했는데 일단 순서가 뒤바뀌는 문제는 고쳐졌다! `XIMPreeditNothing`에서 `XIMPreeditNone`으로 변경했다. 커서 위치에 표시되는 입력창이 화면 좌측 하단에 고정되어 표시된다.

변경 diff는 다음과 같다. `x.c` 파일을 수정한다.

```diff
diff --git a/x.c b/x.c
index 48a6676..13d6249 100644
--- a/x.c
+++ b/x.c
@@ -1045,7 +1045,7 @@ ximopen(Display *dpy)
 
 	if (xw.ime.xic == NULL) {
 		xw.ime.xic = XCreateIC(xw.ime.xim, XNInputStyle,
-		                       XIMPreeditNothing | XIMStatusNothing,
+		                       XIMPreeditNone | XIMStatusNothing,
 		                       XNClientWindow, xw.win,
 		                       XNDestroyCallback, &icdestroy,
 		                       NULL);
```

