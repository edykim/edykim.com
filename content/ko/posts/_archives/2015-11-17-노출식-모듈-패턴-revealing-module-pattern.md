---
title: 노출식 모듈 패턴 Revealing Module Pattern
author: haruair
type: post
date: "2015-11-17T07:59:55"
history:
  - 
    from: https://www.haruair.com/blog/3219
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: revealing-module-pattern
headline:
  - JavaScript 디자인 패턴, 명시적으로 노출될 메소드를 지정하는 디자인.
categories:
  - 개발 이야기
  - 번역
tags:
  - pattern

---
Carl Danley의 글 [The Revealing Module Pattern][1]을 요약 번역한 글이다. Todd의 Angular 스타일 가이드를 읽는 중 factory를 노출식 모듈 패턴으로 작성하라는 얘기가 있어서 찾아봤다.

* * *

## 노출식 모듈 패턴 Revealing Module Pattern

이 패턴은 모듈 패턴과 같은 개념으로 public과 private 메소드에 초점을 둔 패턴. 모듈 패턴과 달리 명시적으로 노출하고 싶은 부분만 정해서 노출하는 방식. 일반적으로 객체 리터럴(`{...}`) 형태로 반환한다.

### 장점

  * 개발자에게 깔끔한 접근 방법을 제공
  * private 데이터 제공
  * 전역 변수를 덜 더럽힘
  * 클로저를 통해 함수와 변수를 지역화
  * 스크립트 문법이 더 일관성 있음
  * 명시적으로 public 메소드와 변수를 제공해 명시성을 높임

### 단점

  * private 메소드 접근할 방법이 없음 (이런 메소드에 대한 테스트의 어려움을 이야기하기도 하지만 함수 무결성을 고려할 때 공개된 메소드만 테스트 하는게 맞음. 관련 없지만 기록용으로.)
  * private 메소드에 대해 함수 확장하는데 어려움이 있음
  * private 메소드를 참조하는 public 메소드를 수정하기 어려움

### 예제

```javascript
var myModule = (function(window, undefined) {
  function myMethod() {
    console.log('myMethod');
  }

  function myOtherMethod() {
    console.log('myOtherMethod');
  }

  return {
    someMethod: myMethod,
    someOtherMethod: myOtherMethod
  };
})(window);

myModule.myMethod(); // Uncaught TypeError: myModule.myMethod is not a function
myModule.myOtherMethod(); // Uncaught TypeError: myModule.myOtherMethod is not a function
myModule.someMethod(); // console.log('myMethod');
myModule.someOtherMethod(); // console.log('myOtherMethod');
```

* * *

Host 객체(JS에 내장된 객체가 아닌 사용자가 직접 정의한 객체)로 반환하는 형태는 관리하기 까다롭고 상속과 같은 방법으로 확장하기 어려워서 개인적으로 선호하지 않는 편이다. 하지만 Angular의 factory와 같이, 일종의 스태틱 클래스에서는 잘 어울리는 접근 방식이다. 패턴은 상황에 맞게 적용해야 한다.

 [1]: https://carldanley.com/js-revealing-module-pattern/