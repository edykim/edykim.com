---
title: AngularJS의 서비스와 팩토리
author: haruair
type: post
date: 2015-11-17T23:00:58+00:00
history:
  - 
    from: https://www.haruair.com/blog/3223
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: services-and-factory-of-angularjs
headline:
  - "같은 듯 다른 서비스와 팩토리 구분해서 사용하기. Factory: I'm your father. Service: Noooo!!"
categories:
  - 개발 이야기
tags:
  - angularjs

---
AngularJS의 **서비스 Services**는 여러 코드에서 반복적으로 사용되는 코드를 분리할 때 사용하는 기능으로, 해당 서비스가 필요한 곳에 의존성을 주입해 활용할 수 있다. 서비스는 다음과 같은 특성이 있다.

  * 지연 초기화(Lazily instantiated): 의존성으로 주입하기 전까지는 초기화가 되지 않음.
  * 싱글턴(Singletons): 각각의 컴포넌트에서 하나의 인스턴스를 싱글턴으로 참조함.

AngularJS에서 서비스(Service)와 팩토리(factory)는 서로 상당한 유사성을 갖고 있기 때문에 쉽게 혼동할 수 있다. 특히 JavaScript의 유연한 타입으로 인해 라이브러리의 의도와는 다르게 그냥 동작하는 경우가 많다. 이 두 가지의 차이는 코드에서 확인할 수 있다. Angular의 코드를 보면 [service는 factory를 사용해서][1] 구현하고 있다.

```javascript
  function service(name, constructor) {
    return factory(name, ['$injector', function($injector) {
      return $injector.instantiate(constructor);
    }]);
  }
```

위 코드를 보면 `$injector.instaniate()`에 생성자를 넣어 반환하는데 이 함수에서 `Object.create()`로 해당 생성자를 인스턴스화 한다. 이렇게 얻은 인스턴스를 factory에 넣어 나머지는 factory와 동일하게 처리하는 것을 확인할 수 있다. 그래서 라이브러리의 실제 의도와는 다른 구현도 문제 없이 구동될 수 있는 것이다.

Todd Motto의 [AngularJS 스타일 가이드 중 Service and Factory][2]을 살펴보면 이 구현의 차이를 다음과 같이 정리한다.

### 서비스와 팩토리

Angular의 모든 서비스는 싱글턴 패턴이다. `.service()`메소드와 `.factory()` 메소드의 차이는 객체를 생성하는 방법에서 차이가 있다.

서비스: 생성자 함수와 같이 동작하고 new 키워드를 사용해 인스턴스를 초기화 한다. 서비스는 퍼블릭 메소드와 변수를 위해 사용한다.

```javascript
function SomeService () {
  this.someMethod = function () {
    // ...
  };
}
angular
  .module('app')
  .service('SomeService', SomeService);
```

팩토리: 비지니스 로직 또는 모듈 제공자로 사용한다. 객체나 클로저를 반환한다.

객체 참조에서 연결 및 갱신을 처리하는 방법으로 인해 노출식 모듈 패턴(Revealing module pattern) 대신 호스트 객체 형태로 반환한다.

```javascript
function AnotherService () {
  var AnotherService = {};
  AnotherService.someValue = '';
  AnotherService.someMethod = function () {
    // ...
  };
  return AnotherService;
}
angular
  .module('app')
  .factory('AnotherService', AnotherService);
```

왜?: 노출식 모듈 패턴을 사용하면 초기값을 변경할 수 없는 경우가 있기 때문이다. <sup id="fnref-3223-1"><a href="#fn-3223-1" rel="footnote">1</a></sup>

* * *

서비스와 팩토리에서 가장 두드러진 차이점을 꼽는다면, 서비스에서는 초기화 과정이 존재하기 때문에 자연스럽게 prototype 상속이 가능하다. 그래서 일반적으로 상속이 필요한 데이터 핸들링이나 모델링 등의 경우에는 서비스를 활용하고, helper나 정적 메소드와 같이 활용되는 경우는 팩토리로 구현을 많이 하는 것 같다.

물론 앞서 살펴본 것과 같이 둘은 아주 유연한 관계이기 때문에 서비스에서 일반 호스트 객체를 반환하면 팩토리와 다를 것이 없게 된다. 그래서 각각의 특징에 맞게 구현하기 위해 가이드라인을 준수하는게 바람직하다. 가이드라인을 따르지 않는다면 적어도 프로젝트 내에서 일정한 프로토콜을 준수할 수 있도록 합의가 필요하다.

서비스와 팩토리처럼 구현의 제한성이 있는 것이 싫다면 강력한 기능을 제공하는 프로바이더(Provider)를 사용할 수 있다. (factory는 provider를 쓴다.) AngularJS에서 흔히 사용하는 `$http`가 대표적이며 많은 기능이 프로바이더로 구현되어 있다.

<li id="fn-3223-1">
  팩토리를 작성하는 방법을 설명하는 글을 보면 <a href="http://haruair.com/blog/3219">노출식 모듈 패턴</a>을 활용하는 경우가 종종 있어서 <em>왜?</em> 부분이 추가된 것 같다. 이 패턴은 일부 구현(메소드, 변수)에 대해 외부에서 접근할 수 있는지 없는지 명시적으로 지정할 수 있다는 특징이 있는데 그 특징으로 외부에서 접근할 수 없는 코드에 대해서는 값을 변경할 방법이 없다. 그런 특징 때문에 가이드에서는 호스트 객체로 반환할 것을 권장하고 있다.&#160;<a href="#fnref-3223-1" rev="footnote">&#8617;</a> </fn></footnotes>

 [1]: https://github.com/angular/angular.js/blob/master/src/auto/injector.js#L702-L706
 [2]: https://github.com/toddmotto/angularjs-styleguide#services-and-factory