---
title: Angular 컨트롤러를 작성하는 두가지 방법
author: haruair
type: post
date: "2015-11-08T08:14:00"
lang: ko
slug: do-you-like-your-angular-controllers-with-or-without-sugar
categories:
  - 번역
  - 개발 이야기
tags:
  - js
  - angularjs
history:
  -
    from: https://www.haruair.com/blog/3184
    movedAt: 2018-09-13T22:02:42+00:00
---

Johnpapa의 [Do You Like Your Angular Controllers with or without Sugar?](http://www.johnpapa.net/do-you-like-your-angular-controllers-with-or-without-sugar/)를 번역한 글이다. 원본 포스트는 [CC BY 2.5](http://creativecommons.org/licenses/by/2.5/) 라이센스로 작성되어 있다.

그냥 읽을 때는 괜찮게 느껴졌는데 옮기고 나니 핵심적인 부분이 없는 감상문 느낌이라 아쉬웠다. 덕분에 다른 글도 번역하게 된 좋은 원동력(?)이 되었다. 1.2 이후로 소개된 Controller As에 대해 전통적인 방법과 어떻게 다른지에 대해 설명하고 있다. 

----
## Angular 컨트롤러를 작성하는 두가지 방법
[Angular](http://angularjs.org) 문서만 읽고 왔더라도 `$scope`를 MVC의 C(컨트롤러)에서 미친듯이 사용하는 모습은 이상하게 보였을 것이다. `$scope`는 컨트롤러와 뷰 사이를 연결하는 풀과 같은 존재로 데이터 연결이 필요한 모든 경우를 돕는다. 최근 Angular 팀은 컨트롤러에서 `$scope`를 사용하는 새로운 방식을 공개했다. 이제 `$scope`(이 단어를 쓰면 전통적인 방식의 컨트롤러에서 쓰는걸 의미함)와 함께 `this`(Angular 팀과 내가 Controller-As로 사용하는 방식을 의미함)을 사용할 수 있게 되었다. 이 두 가지 기술에 대한 질문을 아주 많이 받았다. 모두가 선택을 좋아하고 동시에 그 선택에서 얻을 수 있는 것이 무엇인지 명확하게 알고 싶어한다. 그래서 Angular에서 컨트롤러를 생성할 때 사용할 수 있는 이 두 가지 방식(`$scope`와 Controller As)에 대해 이야기하고 활용해보자.

> 전통적인 컨트롤러와 Controller As 모두 `$scope`를 갖고 있다. 이 점이 이해하는데 가장 중요하다. 어느 한 방식을 선택한다고 다른 장점을 포기하는 것이 아니다. 정말. 이 두가지 방법은 모두 사용된다.

### 먼저 알아야 할 과거

`$scope`는 "전통적인" 기법으로 "controller as"는 아주 최근에 나온 기술이다. (공식적으로 1.2.0 pre릴리스에서 나타나지만 불완전했음.) 둘 다 완벽하게 동작하기에 내가 줄 수 있는 지침은 둘 중 하나를 골라 일관되게 사용하라는 것이다. 하나의 앱에서 둘 다 섞어서 사용할 수 있지만, 일관적으로 사용해야 하는 이유는 놀라울 정도로 명확하다. 그러므로 하나를 고르고 주사위를 던져라. 가장 중요한 점은 일관성이다. 어느 것을 골라야 하나? 그 선택은 개발자에게 달렸다. `$scope`를 이용한 예가 훨씬 많지만 "controller as"도 흐름에 따라 잘 골라야 한다. 둘 중 어느 것이 더 나은가? 논쟁할 만한 주제다. 그렇다면 어떻게 골라야 할까?


### "controller as"를 선호하면 숨기기 편하다

중개하는 역할을 하는 객체인 `$scope`를 사용하면 컨트롤러에서 사용하는 모든 맴버를 뷰에 공개하게 된다. `this.*`를 설정하는 것으로 컨트롤러에서 뷰에 공개하고 싶은 부분에 대해서만 노출하는 것이 가능하다. 물론 `$scope`를 사용해도 동일하게 쓸 수 있지만 표준 자바스크립트의 this를 사용하는 것을 선호한다. 종합적으로 보면 개인적인 선호에 따라 Controller As 기법을 더 선호한다. 다음과 같이 코드를 작성한다:

    var vm = this;

    vm.title = 'some title';
    vm.saveData = function() { ... };

이 방식이 더 보기 쉽고 어떤 부분이 뷰에 노출되는지 쉽게 확인할 수 있다. "vm" 변수는 뷰모델(viewmodel)을 의미한다. 이 명칭은 단순하게 내 컨벤션이다. $scope를 사용할 때도 같은 방법을 쓸 수 있지만 $scope를 사용할 때는 그렇게 작성하지 않았다.

    $scope.title = 'some title';
    $scope.saveData = function() { ... };

결국 이 부분은 작성자에게 달려있다.

### 주입이 필요한 경우

`$scope`는 컨트롤러에 `$scope`를 주입할 필요가 있을 때 사용한다. 이 부분은 controller as 기법을 사용할 때는 필요 없는 부분이지만 몇가지 다른 이유에 의해 필요할 때가 존재한다. (가령 $broadcast가 필요하거나, watch를 사용할 필요가 있는데 컨트롤러 내에서 하는 것을 피하고 싶을 때.) 이 부분은 사실 Controller As 기법을 더 좋아하는 이유 중 하나다. `$scope`가 데이터 바인딩 등을 위해 정말 필요한 상황일 때만 명시적으로 선언하기 때문이다. broadcast 메시지를 듣기 위한 것도 한 예제다. watch는 다른 경우지만 컨트롤러 내에서 watch하고 싶지 않은 경우에 사용할 수 있다.

### 유행은?

명시적으로 $scope가 선언된 코드가 더 오래 사용한 방식이기 때문에 예제가 많다. 하지만 최근 예제는 Controller As를 사용한 경우가 많다. 이 예제를 원한다면 Visual Studio 플러그인인 [SideWaffle](http://sidewaffle.com)을 사용할 수 있다. 이 두가지 기법 컨트롤러 모두를 지원한다. 설탕이 싫다면 전통적인 $scope 컨트롤러를 선택하라. 설탕을 원한다면 controller as 를 선택하라. Angular 팀은 이 두가지 선택지를 제공하고 있고 이 선택지 모두 마음에 든다. 개인적으로는 Controller As 기법이 마음에 든다. 이 두가지 방법 모두 데이터 바인딩을 할 수 있다. Controller As는 $scope와 개발하는데 더 편리하게 한다고 생각한다. 그러니 둘 중 어느 것을 선택하는가는 온전히 당신의 몫이다.
