---
title: "Angular의 Controller As 문법 살펴보기"
author: haruair
type: post
date: 2015-11-08T08:14:00-07:00
lang: ko
slug: digging-into-angulars-controller-as-syntax
categories:
  - 개발 이야기
  - 번역
tags:
  - js
  - angularjs
---

Todd Motto의 글 [Digging into Angular’s “Controller as” syntax](http://toddmotto.com/digging-into-angulars-controller-as-syntax/)를 번역했다. Angular의 Controller As 문법에 대해 설명하고 있는 글이다. `$scope`를 분리하는 것으로 더 사용성 높은 컨트롤러를 만들 수 있고 최근 ES6에서 클래스를 만드는데 좋은 호환성을 보장하고 있다는 얘기를 듣고 번역하게 되었다.

----

AnularJS 컨트롤러는 최근 몇가지 변화가 있었다. (정확하게는 버전 1.2부터.) 스코프, 컨트롤러와 Angular 개발에 있어서 이 의미는 꽤 희미하면서도 아주 강력한 변화다. 이 변화는 구조를 향상하고 더 깔끔한 스코프와 똑똑한 컨트롤러를 만드는데 일조한다.

우리가 알고 있는 컨트롤러는 클래스 같은(class-like) 객체로 Model과 View를 변경하는데 사용되지만, 이 모든 과정이 수수께끼 같은 `$scope` 객체에 의해 이뤄진다. 많은 개발자가 `this` 키워드를 `$scope` 대신 사용하는 것을 추천하고 있어 Angular 컨트롤러에서 `$scope`가 선언되어 있는 방식을 변경하도록 압박하고 있다.

v1.2.0 이전의 컨트롤러는 다음과 같이 생겼다:

    // <div ng-controller="MainCtrl"></div>
    app.controller('MainCtrl', function ($scope) {
      $scope.title = 'Some title';
    });

늘 컨트롤러에 $scope를 주입했었지만, 다음은 컨트롤러를 $scope로부터 분리한 개념이다. 이 방식이 더 낫다고 논의되었다:

    app.controller('MainCtrl', function () {
      this.title = 'Some title';
    });

별로 한 일은 없지만 이 과정으로 좀 멋진 결과를 얻을 수 있게 되었다.

### 클래스로서 컨트롤러

자바스크립트에서 "class"를 인스턴스화(instantiation) 하면, 다음과 같을 것이다:

    var myClass = function () {
      this.title = 'Class title';
    }
    var myInstance = new myClass();

이렇게 선언 후 `myInstance` 인스턴스를 사용해 `myClass`의 메소드와 프로퍼티에 접근할 수 있다. Angular에서는 이와 비슷한 방식으로 접근하는 방법으로 `Controller as` 문법을 제공하게 되었다. 다음은 어떻게 선언하고 바인딩 하는지에 대한 예제다:

    // 선언은 평소같이 하지만 `$scope` 대신 `this`를 사용
    app.controller('MainCtrl', function () {
      this.title = 'Some title';
    });

이 방법은 더 클래스 기반 설정을 사용할 수 있게 되어, 이 컨트롤러를 DOM에서 인스턴스화 할 때 쉽게 변수에 할당할 수 있게 된다:

    <div ng-controller="MainCtrl as main">
      // MainCtrl은 존재하지 않고, 대신 `main` 인스턴스를 얻을 수 있음
    </div>

`this.title`을 DOM에 반영하기 위해서는 새 인스턴스를 사용하면 된다:

    <div ng-controller="MainCtrl as main">
       {% raw %}{{ main.title }}{% endraw %}
    </div>

스코프를 네임스페이스로 처리할 수 있는 것은 아주 좋은 접근이라고 생각하며 Angular를 _엄청나게_ 깔끔하게 한다고 생각한다. 난 항상 `{% raw %}{{ title }}{% endraw %}` 같이 "떠있는 변수(모호한 변수)"를 싫어했는데, `{% raw %}{{ main.title }}{% endraw %}` 처럼 인스턴스와 함께 작성할 수 있는 방식은 훨씬 마음에 든다.

### 중첩된 스코프

중첩된 스코프도 `Controller as` 문법에서 얻을 수 있는 결과인데, 가끔 현재 스코프의 `$parent` 프로퍼티에 접근해 _상위_ 스코프에서 필요한 부분을 받아와야 할 필요가 있었다.

다음 예제를 보자:

    <div ng-controller="MainCtrl">
      {% raw %}{{ title }}{% endraw %}
      <div ng-controller="AnotherCtrl">
        {% raw %}{{ title }}{% endraw %}
        <div ng-controller="YetAnotherCtrl">
          {% raw %}{{ title }}{% endraw %}
        </div>
      </div>
    </div>

먼저 `{% raw %}{{ title }}{% endraw %}` 를 반복적으로 사용하는데다  여러 스코프의 경계를 오가고 있기 때문에 이 값이 어디서 들어오는지 아주 모호하고 혼란스러운 인터폴레이션(interpolation) 이슈가 발생한다. 어느게 무엇이 될 지도 예측하기 어렵다. 스코프를 가로질러 변수에 접근하는 것은 이해하는데 훨씬 명확하다:

    <div ng-controller="MainCtrl as main">
      {% raw %}{{ main.title }}{% endraw %}
      <div ng-controller="AnotherCtrl as another">
        {% raw %}{{ another.title }}{% endraw %}
        <div ng-controller="YetAnotherCtrl as yet">
          {% raw %}{{ yet.title }}{% endraw %}
        </div>
      </div>
    </div>

또한 부모 스코프에 다음과 같이 작성하지 않고도 접근할 수 있다:

    <div ng-controller="MainCtrl">
      {% raw %}{{ title }}{% endraw %}
      <div ng-controller="AnotherCtrl">
        Scope title: {% raw %}{{ title }}{% endraw %}
        Parent title: {% raw %}{{ $parent.title }}{% endraw %}
        <div ng-controller="YetAnotherCtrl">
          {% raw %}{{ title }}{% endraw %}
          Parent title: {% raw %}{{ $parent.title }}{% endraw %}
          Parent parent title: {% raw %}{{ $parent.$parent.title }}{% endraw %}
        </div>
      </div>
    </div>

그리고 더욱 논리적이다:

    <div ng-controller="MainCtrl as main">
      {% raw %}{{ main.title }}{% endraw %}
      <div ng-controller="AnotherCtrl as another">
        Scope title: {% raw %}{{ another.title }}{% endraw %}
        Parent title: {% raw %}{{ main.title }}{% endraw %}
        <div ng-controller="YetAnotherCtrl as yet">
          Scope title: {% raw %}{{ yet.title }}{% endraw %}
          Parent title: {% raw %}{{ another.title }}{% endraw %}
          Parent parent title: {% raw %}{{ main.title }}{% endraw %}
        </div>
      </div>
    </div>

깔끔하지 않은 `$parent` 호출을 더이상 안해도 된다. 만약 컨트롤러의 위치가 DOM 또는 스택 내에서 변경된다면, `$parent.$parent.$parent.$parent`를 연쇄적으로 변경해야만 한다! 어휘적으로 스코프에 접근할 수 있는 것이 훨씬 편리하다.

### $watchers/$scope 메소드
`Controller as` 문법을 맨 처음 사용하고서 "오, 대박!" 이랬지만, 스코프 관찰자(watchers)나 메소드를 사용하기 위해서는 `$scope`의 의존성을 주입할 필요가 있다. (예를 들면 `$watch`, `$broadcast`, `$on` 같은 것을 사용해야 할 때.) 웩, 이 부분을 얼마나 피하려고 노력했는데 말이다. 하지만 이조차도 대박인 것을 알게 되었다.

`Controller as` 문법이 동작하는 방식은 `$scope` 같은 클래스 같은 객체가 되는 것이 아니라, 컨트롤러가 현재 `$scope`에 _바인딩_ 하도록 하는 방식이다. 나에게는 클래스와 Angular의 특별한 기능을 분리하는 핵심적인 방식이 되었다.

이 의미는 다음 같이 클래스 같은 컨트롤러를 갖고 있다는 뜻이다:

    app.controller('MainCtrl', function () {
      this.title = 'Some title';
    });

이 기능 이전에 또는 일반적인 바인딩 이상의 기능이 필요할 때, `$scope`를 의존성으로 넣어, 그냥 컨트롤러보다 훨씬 강력하고 _특별한_ 기능을 활용할 수 있게 되었다.

이 특별한 기능은 `$scope`의 메소드로 모두 포함되어 있다. 다음 예제를 보자:

    app.controller('MainCtrl', function ($scope) {
      this.title = 'Some title';
      $scope.$on('someEventFiredFromElsewhere', function (event, data) {
        // do something!
      });
    });

#### 꼬인 문제 다리미질 하기
이 코드는 `$scope.$watch()` 예제를 작성하는 동안 나타난 흥미로운 문제다. 아주 단순한 예제지만 `Controller as` 문법에서는 예상한대로 동작하지 않는다:

    app.controller('MainCtrl', function ($scope) {
      this.title = 'Some title';
      // doesn't work!
      $scope.$watch('title', function (newVal, oldVal) {});
      // doesn't work!
      $scope.$watch('this.title', function (newVal, oldVal) {});
    });

헤헤, 그래서 여기서 뭘 할 수 있나? 재밌게도 다른 날 이 코드를 읽었을 때, 이 부분에서 `$watch()`에게 첫 인자를 함수로 넘겨주면 해결할 수 있는 문제인 것을 알 수 있었다:

    app.controller('MainCtrl', function ($scope) {
      this.title = 'Some title';
      // 음.. 함수로 쓰면,
      $scope.$watch(function () {}, function (newVal, oldVal) {});
    });

그 의미는 여기서 작성한 `this.title`을 참조로 넘길 수 있다는 뜻이다:

    app.controller('MainCtrl', function ($scope) {
      this.title = 'Some title';
      // 이러면 되겠군...
      $scope.$watch(function () {
        return this.title; // `this`가 위에서 말한 `this`가 아니네!!
      }, function (newVal, oldVal) {});
    });

컨텍스트를 `angular.bind()`를 사용해 변경하자:

    app.controller('MainCtrl', function ($scope) {
      this.title = 'Some title';
      // 짠
      $scope.$watch(angular.bind(this, function () {
        return this.title; // 이 `this`가 위 `this`와 같음
      }), function (newVal, oldVal) {
        // 이제 newVal과 oldVal의 변화를 잡을 수 있음
      });
    });

역주. IE9 이상을 지원한다면 angular.bind 대신 `Function#bind`를 사용해도 되고, John Papa의 방식대로 `var vm = this;` 식으로 작성해 회피해도 된다.

## `$routeProvider`/디렉티브/그 외 아무곳에나 선언하기
컨트롤러는 동적으로 배정될 수 있으므로 항상 어트리뷰트로 연결해둘 필요가 없다. 디렉티브 내에서 `controllerAs:` 프로퍼티를 사용할 수 있고, 이 프로퍼티는 쉽게 배정할 수 있다:

    app.directive('myDirective', function () {
      return {
        restrict: 'EA',
        replace: true,
        scope: true,
        template: [].join(''),
        controllerAs: '', // 쉽고 편하다!
        controller: function () {}, // 이 컨트롤러를 위 controllerAs 의 이름으로 인스턴트화 할 것임
        link: function () {}
      };
    });

`$routeProvider` 내에서도 동일하다:

    app.config(function ($routeProvider) {
      $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controllerAs: '',
        controller: ''
      })
      .otherwise({
        redirectTo: '/'
      });
    });

### controllerAs 문법 테스트하기

`controllerAs`를 테스트하는데 미묘하게 다른데 고맙게도 `$scope`를 주입할 필요가 없다. 이 의미는 컨트롤러를 테스트할 때 참조하는 프로퍼티를 넣을 필요가 없다는 뜻이다. (`vm.prop` 같은 부분.) 이제 간단하게 `$controller`에 변수명을 지정하는 것만으로 테스트할 수 있다.

    // controller
    angular
      .module('myModule')
      .controller('MainCtrl', MainCtrl);

    function MainCtrl() {
      this.title = 'Some title';
    };

    // tests
    describe('MainCtrl', function() {
      var MainController;

      beforeEarch(function(){
        module('myModule');

        inject(function($controller) {
          MainController = $controller('MainCtrl');
        });
      });

      it('should expose title', function() {
        expect(MainController.title).equal('Some title');
      });
    });

`controllerAs` 문법을 사용했을 때 `$controller` 함수로 인스턴스화 하는 것 대신에 `$scope`를 주입해야 할 필요가 있는 경우에는 `$controller`에 다음과 같이 객체로 넘겨주면 된다. (`scope.main` 인스턴스에서 사용될) 컨트롤러를 위한 이 alias는 `$scope`를 (실제 Angular 앱처럼) 추가하게 된다. 하지만 그다지 아름다운 해법은 아니다.

    // Same test becomes
    describe('MainCtrl', function() {
      var scope;

      beforeEarch(function(){
        module('myModule');

        inject(function($controller, $rootScope) {
          scope = $rootScope.$new();
          var localInjections = {
            $scope: scope,
          };
          $controller('MainCtrl as main', localInjections);
        });
      });

      it('should expose title', function() {
        expect(scope.main.title).equal('Some title');
      });
    });

