---
title: "$scope를 사용하는 더 나은 방법, angular.extend()"
author: haruair
type: post
date: 2015-11-08T08:14:00-07:00
lang: ko
slug: a-better-way-to-scope-angular-extend-no-more-vm-this
categories:
  - 개발 이야기
  - 번역
tags:
  - angularjs
  - js
history:
  -
    from: https://www.haruair.com/blog/3190
    movedAt: 2018-09-13T22:02:42+00:00
---

이 글은 Todd Motto의 글 [A better way to $scope, angular.extend, no more “vm = this”](http://toddmotto.com/a-better-way-to-scope-angular-extend-no-more-vm-this/)를 번역한 글이다.

Angular에서 Controller As 문법을 사용하면 `var vm = this;`와 같이 this의 스코프 문제를 회피하는 방식으로 작성하는데 이 방법을 회피하기 위해 `angular.extend`를 활용하는 방식을 제안하고 있다. 댓글에도 많은 반론이 있는 글이라서 댓글도 따라 번역했다. 반론에는 문법이 익숙하지 않다고 하지만 이 문법이 더 명시적인 느낌이 드는 편이다. 다만 반론과 같이, angular에 대한 의존성을 높이는 방식이고 ES6 클래스와는 어울리지 않는 문법이란 부분에서 단점도 크게 느껴진다.

----

## $scope를 사용하는 더 나은 방법, angular.extend, 더이상 "vm = this"는 없다

Angular 컨트롤러는 지난 1년간 발전해왔다. 이제는 많은 사람들이 가장 최근에 추가된 "컨트롤러" 문법인 `controllerAs` 스타일을 활용하고 있다. (`$scope`를 직접 바인딩하는 방식을 멀리 하고서 말이다.)

스타일에 대한 다양한 의견 중 내가 수용하고 있는 방식은, 컨트롤러 가장 상위에 `var vm = this;`를 우선적으로 선언하는 것이다. 최근에는 `vm`을 실제 자바스크립트 컨트롤러 내에서 사용하는 것을 멀리하고 있다. 대신 평범한 자바스크립트 변수와 함수로 작성한 후, 필요로 하는 부분을 "exports"와 같은 방식으로 외부에서 바인딩 할 수 있게 작성하고 있다.

내 이전 작업과 어떻게 다른지 살펴보기 위해 `var vm = this;` 부터 시작하자.

### var vm = this;
이 방법은 컨트롤러를 변수와 바인딩하기 위한, 아주 유명한 방법이다. (결국 `$scope` 와 연결된다.) 단순한 예제를 살펴보자:

    function MainCtrl () {

      var vm = this;

      function doSomething() {

      }

      // exports
      vm.doSomething = doSomething;

    }

    angular
      .module('app')
      .controller('MainCtrl', MainCtrl);

이 패턴은 굉장하며 Angular로 개발하는데 아주 유용하다. (여기에는 함수를 직접 선언하지 않고 `vm.doSomething = function () {}`와 같이 바로 바인딩하는 변형도 있다.) `vm`을 생성하는 이유는 다른 함수 내에서 올바른 문맥을 참조하기 위해서인데 `this`는 다른 변수와는 달리 어휘 스코핑(lexical scoping)를 따르지 않기 때문이다. 그래서 `this`를 `vm`에 "참조"로 배정해놓고 사용하는 것이다.

많은 내용은 바인딩해야 할 때, `vm`을 엄청 많이 반복해서 사용하고 끝내 `vm.*` 참조가 코드 전반에 생기게 된다. 사실 잘 따져보면 모든 코드를 `this`에 직접 바인딩할 필요가 없고, JavaScript는 그 자체 인스턴스에 포함된 변수로도 충분히 동작할 수 있다. (예를 들면, 콜백에서 `vm.foo`를 사용하는 방식보다 `var foo = {};`와 같이 업데이트를 지역적으로 수행하는 방식이 낫다.) 다음은 `vm.*` 바인딩을 많이 사용한 경우에 대한 예시다:

    function MainCtrl () {

      var vm = this;

      function doSomething1() {}
      function doSomething2() {}
      function doSomething3() {}
      function doSomething4() {}
      function doSomething5() {}
      function doSomething6() {}

      // exports
      vm.doSomething1 = doSomething1;
      vm.doSomething2 = doSomething2;
      vm.doSomething3 = doSomething3;
      vm.doSomething4 = doSomething4;
      vm.doSomething5 = doSomething5;
      vm.doSomething6 = doSomething6;
    }

    angular
      .module('app')
      .controller('MainCtrl', MainCtrl);

### angular.extend 사용하기
`angular.extend`라고 알고 있는 이 방식은 새로운 아이디어는 아니지만, Modus Create의 글 [AngularJS: Tricks with angular.extend()](http://moduscreate.com/angularjs-tricks-with-angular-extend)에서 아이디어를 얻게 되었고, 내 angular 컨트롤러 전략/패턴에서 `vm` 참조를 완전히 제거하게 되었다. 이 글에서는 `angular.extend($scope, {...});`를 사용하고 있지만, 내 예제에서는 `controllerAs` 문법으로 차용하고 있다.

다음은 `vm`을 버리고 `this`에 간단히 바인딩하는 간단한 예제다:

    function MainCtrl () {
        this.someVar = {
          name: 'Todd'
        };
        this.anotherVar = [];
        this.doSomething = function doSomething() {
        };
    }

    angular
      .module('app')
      .controller('MainCtrl', MainCtrl);

`angular.extend`를 사용하면 깔끔하고 더욱 객체 주도적인 코드를 얻을 수 있고, 아이템 목록을 넘겨주는 대신 단순한 exports 객체를 넘겨줄 수 있다:

    function MainCtrl () {
      angular.extend(this, {
        someVar: {
          name: 'Todd'
        },
        anotherVar: [],
        doSomething: function doSomething() {

        }
      });
    }

    angular
      .module('app')
      .controller('MainCtrl', MainCtrl);

이 방식이 `this` 키워드를 반복하지 않아도 되게 한다. (또는 `$scope`를 여전히 사용하고 있다면 `$scope` 또한 반복하지 않아도 된다.)

이 방식을 사용하면 "private" 메소드를 사용하는데도 좀 더 편리하고 명확하게 작성할 수 있다:

    function MainCtrl () {
      
      // private
      function someMethod() {

      }

      // public
      var someVar = { name: 'Todd' };
      var anotherVar = [];
      function doSomething() {
        someMethod();
      }
      
      // exports
      angular.extend(this, {
        someVar: someVar,
        anotherVar: anotherVar,
        doSomething: doSomething
      });
    }

    angular
      .module('app')
      .controller('MainCtrl', MainCtrl);

이 방식에 대한 다른 생각이나 좋은 예제가 있는지 궁금하다.

----

댓글에 달린 [다른 의견 1](http://toddmotto.com/a-better-way-to-scope-angular-extend-no-more-vm-this/#comment-1978832988), [2](http://toddmotto.com/a-better-way-to-scope-angular-extend-no-more-vm-this/#comment-1980486070)에서 공감가는 부분을 옮겨보자면, 이 방식에는 다음과 같은 단점이 존재한다.

1. 코드 복잡도가 증가하는 것처럼 보인다. (`vm`에 비해 복잡하게 보인다.)
2. `angular.extend()` 을 사용하는 것으로 angular에 대한 강결합이 발생한다. ES6 클래스 등을 사용할 때 불편하다.
3. `doSomething`에서 `someVar`를 참조하는 과정이 복잡해진다.
4. [느리다](http://plnkr.co/edit/XrJYhseYV0B3N4Ggn3ec?p=preview).

