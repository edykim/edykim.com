---
title: "$scope은 이제 그만, Angular에서 bindToController 활용하기"
author: haruair
type: post
date: "2015-11-12T08:14:00"
lang: ko
slug: no-scope-soup-bind-to-controller-angularjs
categories:
  - 개발 이야기
  - 번역
tags:
  - angularjs
  - js
history:
  -
    from: https://www.haruair.com/blog/3201
    movedAt: 2018-09-13T22:02:42+00:00
---

이 글은 Todd Motto의 글 [No $scope soup, bindToController in AngularJS](http://toddmotto.com/no-scope-soup-bind-to-controller-angularjs/)를 번역한 글이다.

Angular에서 `controllerAs` 문법을 사용한다면 자연스럽게 따라오는 디렉티브 프로퍼티인 `bindToController`에 관한 글이다. 기존 `$scope`와 어떤 방식이 다른지, 어떻게 작성하는 것이 좋은지 확인할 수 있다.

----
## $scope은 이제 그만, Angular에서 bindToController 활용하기

소프트웨어 공학에서 네임스페이스, 코드 일관성, 적절한 디자인 패턴은 _정말_ 중요한 문제다. Angular는 프론트엔드 엔지니어로 직면할 수 있는 수많은 문제를 정말 잘 해결했다.

디렉티브의 프로퍼티인 `bindToController`을 어떻게 사용하는지 설명하는 것으로 DOM-컨트롤러 네임스페이스를 정리하고, 코드의 일관성을 유지하는 방법과 함께 컨트롤러 객체를 생성하고 데이터를 다른 곳에서 사용하는데 더 편리한 디자인 패턴을 만드는 과정을 설명하려 한다.

### 그 전에 해야 할 일

`bindToController`는 `controllerAs` 문법과 함께 사용해야 한다. 이 문법은 컨트롤러를 클래스 같은 객체로 다룰 수 있게 하는데 생성자처럼 초기화하는 과정에서 그 초기화를 통해 네임스페이스를 통제할 수 있게 된다. 다음 예를 살펴보자:

    <div ng-controller="MainCtrl as vm">
      {% raw %}{{ vm.name }}{% endraw %}
    </div>

`controllerAs` 문법이 없었던 예전에는 컨트롤러에 대해 고유한 네임스페이스가 제공되지 않았고 JavaScript 객체 프로퍼티가 붕 뜬 상태처럼 존재해 DOM 주변을 맴돌았는데 그로 인해 컨트롤러 내에서 코드 일관성을 유지하기가 힘들었다. 게다가 `$parent`로 인한 상속 문제도 지속적으로 발생했다. 이런 문제를 이 글에서 모두 해결하려고 하는데, 앞서 [작성한 포스트](http://toddmotto.com/digging-into-angulars-controller-as-syntax)([번역](http://haruair.com/blog/3186))에서도 그 문제를 자세히 확인할 수 있다.

### 문제점

컨트롤러를 `controllerAs` 문법으로 작성할 때 나타날 만한 문제는 컴포넌트를 클래스 같은 객체로 작성해야 하는 점, 그리고 상속된 데이터에 접근하기 위해 ("독립된 스코프"에서) `$scope`를 주입해야 하는 경우다. 간단한 예제로 시작하면:

    // controller
    function FooDirCtrl() {

      this.bar = {};
      this.doSomething = function doSomething(arg) {
        this.bar.foobar = arg;
      }.bind(this);

    }

    // directive
    function fooDirective() {
      return {
        restrict: 'E',
        scope: {},
        controller: 'FooDirCtrl',
        controllerAs: 'vm',
        template: [
            // vm.name doesn't exist just yet!
            '<div><input ng-model="vm.name"></div>'
        ].join('')
      };
    }

    angular
      .module('app')
      .directive('fooDirective', fooDirective)
      .controller('FooDirCtrl', FooDirCtrl);

이제 "상속된" 스코프가 필요하다. 그래서 고립된 스코프인 `scope: {}`에 필요한 참조를 추가한다:

    function fooDirective() {
      return {
        ...
        scope: {
          name: '='
        },
        ...
      };
    }

여기까지면 됐다. 이제 `$scope`를 주입해야 한다. 새로 작성한 클래스 같은 객체에 `$scope` 객체를 주입하게 되면 더 나은 디자인 원칙을 적용하는데 더 어려운 상황에 놓인다. 하지만 여기서는 주입해야먄 한다.

더 지저분하게 만들어보자:

    // controller
    function FooDirCtrl($scope) {

      this.bar = {};
      this.doSomething = function doSomething(arg) {
        this.bar.foobar = arg;
        $scope.name = arg.prop; // reference the isolate property
      }.bind(this);

    }

여기서 보면, 클래스 같은 객체 패턴을 사용해서 애써 새로운 디렉티브를 만들었는데 그 흥분을 `$scope`가 망쳐버렸다.

그 뿐만 아니라 앞서 작성한 가사 템플릿을 다시 보면 `vm.` 접두어를 만들었는데도 네임스페이스 없는 변수가 또 다시 떠돌게 된다:

    <div>
      {% raw %}{{ name }}{% endraw %}
      <input type="text" ng-model="vm.username">
    </div>

### 해결책
해결책에 앞서, Angular가 클래스 같은 객체 패턴을 시도한 것에 대해 부정적인 반응이 많았다. 디자인에 대해 알고 전력으로 만들었지만 모든게 완벽할 순 없다. 2버전에서 다시 쓴다고 해도 모든 상황에 완벽해질 수 없다. 이 포스트는 Angular의 나쁜 `$scope` 습관을 버리기 위한, 위대한 해결책을 다루고 있고, 더 나은 JavaScript 디자인에 가깝도록 작성하는데 최선을 다하고 있다.

`bindToController` 프로퍼티를 입력한다. 문서에서는 `bindToController`의 값을 `true`로 활성화하면 상속된 프로퍼티가 `$scope` 객체가 아닌 컨트롤러로 연결된다.

    function fooDirective() {
      return {
        ...
        scope: {
          name: '='
        },
        bindToController: true,
        ...
      };
    }

이 코드로 앞서 작성한 코드를 리팩토링할 수 있게 되었다. `$scope`를 제거하자:

    // controller
    function FooDirCtrl() {

      this.bar = {};
      this.doSomething = function doSomething(arg) {
        this.bar.foobar = arg;
        this.name = arg.prop; // reference the isolate property using `this`
      }.bind(this);

    }

Angular 문서는 `bindToController: true` 대신 객체를 사용하는 것을 제안하지 않지만, [Angular 소스 코드](https://code.angularjs.org/1.4.3/angular.js)에서 이런 코드를 확인할 수 있다:

    if (isObject(directive.bindToController)) {
      bindings.bindToController = parseIsolateBindings(directive.bindToController, directiveName, true);
    }

`bindToController`에 객체가 온다면 앞서 본 형태의 상속과 달리 독립적인 바인딩을 사용하게 된다. 즉 `scope: { name: '='}` 예제를 더 명시적으로 컨트롤러에 바인딩하는 것으로 표현할 수 있다는 뜻이다. (내가 선호하는 문법이다.):

    function fooDirective() {
      return {
        ...
        scope: {},
        bindToController: {
          name: '='
        },
        ...
      };
    }

(역주. `scope`에 선언한 객체는 `$scope`에 바인딩되고, `bindToController`에 선언한 객체는 `this`에 바인딩 된다. `bindToController`를 `true`로 값을 넣으면 `scope`에 선언한 객체가 scope 대신 `bindToController`에 선언한 객체처럼 처리된다. 즉, $scope와 this를 구분해서 써야 하는 상황이라면, 위와 같이 별도로 선언하는 방법이 필요하겠다.)

이제 JavaScript 해결책을 확인했다. 이 변화가 템플릿에 어떤 영향이 있는지 확인하자.

이전에, `name`을 `$scope`에 상속했을 때와 달리 컨트롤러 내에서 동일한 네임스페이스를 사용할 수 있다. 다시 기뻐하자! 이 방법으로 모든 코드가 일관적이고 좋은 가독성을 지니게 되었다. 마지막으로 `vm.` 접두어를 `name` 프로퍼티 앞에 적어 템플릿도 일관적이게 변경하자.

    <div>
      {% raw %}{{ vm.name }}{% endraw %}
      <input type="text" ng-model="vm.username">
    </div>

### 라이브 리펙토링 예제

실제로 동작해볼 수 있는 예제를 jsFiddle에 올렸다. 이 예제로 리펙토링 과정을 시연한다. (이 변화는 최근 Angular 1.2에서 1.4로 변경한 우리 팀에게 특히 좋았다.)

_노트: 각 예제는 부모 컨트롤러에서 디렉티브로 양방향 고립 바인딩을 사용했고 입력창에 값을 변경해 부모에 반영되는지 확인할 수 있다._

첫 예제는, `$scope` 객체를 넘긴다. 템플릿과 컨트롤러 로직에서 `$scope`와 `this`가 복잡한 상태로 그대로 두었다. [라이브 예제 1](http://jsfiddle.net/toddmotto/2n5skwqj/embedded/result,js)

    angular
        .module('app', []);

    // main.js
    function MainCtrl() {
        this.name = 'Todd Motto';
    }

    angular
        .module('app')
        .controller('MainCtrl', MainCtrl);

    // foo.js
    function FooDirCtrl() {

    }

    function fooDirective() {
        
        function link($scope) {
            
        }
        
        return {
            restrict: 'E',
            scope: {
                name: '='
            },
            controller: 'FooDirCtrl',
            controllerAs: 'vm',
            template: [
                '<div><input ng-model="name"></div>'
            ].join(''),
            link: link
        };
    }

    angular
        .module('app')
        .directive('fooDirective', fooDirective)
        .controller('FooDirCtrl', FooDirCtrl);

두번째 예제는 `$scope`를 `bindToController: true`와 함께 리팩토링했다. 템플릿의 네임스페이스 문제도 `this` 객체 밑에 컨트롤러 로직의 일관성을 유지하는 것으로 해결했다. [라이브 예제 2](http://jsfiddle.net/toddmotto/2n5skwqj/1/embedded/result,js)

    angular
        .module('app', []);

    // main.js
    function MainCtrl() {
        this.name = 'Todd Motto';
    }

    angular
        .module('app')
        .controller('MainCtrl', MainCtrl);

    // foo.js
    function FooDirCtrl() {

    }

    function fooDirective() {
        
        function link($scope) {
            
        }
        
        return {
            restrict: 'E',
            scope: {
                name: '='
            },
            controller: 'FooDirCtrl',
            controllerAs: 'vm',
            bindToController: true,
            template: [
                '<div><input ng-model="vm.name"></div>'
            ].join(''),
            link: link
        };
    }

    angular
        .module('app')
        .directive('fooDirective', fooDirective)
        .controller('FooDirCtrl', FooDirCtrl);

선호하는 세번째 예제로, `bindToController: true`를 객체로 사용하고, `scope: {}`로 프로퍼티를 변경하는 것으로 더 명확하게 작성했다. 두번째 예제와 결과적으로 같지만, 함께 작업하는 개발자를 위해 더 명확하게 작성하는 방법이다. [라이브 예제 3](http://jsfiddle.net/toddmotto/2n5skwqj/2/embedded/result,js)

    angular
        .module('app', []);

    // main.js
    function MainCtrl() {
        this.name = 'Todd Motto';
    }

    angular
        .module('app')
        .controller('MainCtrl', MainCtrl);

    // foo.js
    function FooDirCtrl() {

    }

    function fooDirective() {
        
        function link($scope) {
            
        }
        
        return {
            restrict: 'E',
            scope: {},
            controller: 'FooDirCtrl',
            controllerAs: 'vm',
            bindToController: {
                name: '='
            },
            template: [
                '<div><input ng-model="vm.name"></div>'
            ].join(''),
            link: link
        };
    }

    angular
        .module('app')
        .directive('fooDirective', fooDirective)
        .controller('FooDirCtrl', FooDirCtrl);


