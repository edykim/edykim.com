---
title: Angular에서 디렉티브 간 `require`를 사용해 소통하기
author: haruair
type: post
date: 2015-12-23T00:00:15+00:00
history:
  - 
    from: https://www.haruair.com/blog/3315
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: use-require-between-directives-in-angular
headline:
  - 계층 구조의 Directive에서 `require`를 이용해 컨트롤러를 공유하고 데이터를 주고 받는 방법
categories:
  - 개발 이야기
  - 번역
tags:
  - angularjs
  - directive

---
Todd Motto의 글 [Directive to Directive communication with &#8220;require&#8221;][1]를 번역한 글이다. 짧은 글이지만 디렉티브의 계층 관계에서 `require`를 활용해 값을 주고 받는 방법을 살펴볼 수 있다. 다른 디렉티브의 컨트롤러에 정의된 메소드를 어떻게 접근해서 사용할 수 있는지 탭 디렉티브를 작성하는 예제를 통해 설명한다.

* * *

디렉티브 간 소통은 여러 방법이 있지만, 계층 관계를 갖고 있는 디렉티브를 다룰 때는 디렉티브 컨트롤러를 활용해 서로 소통할 수 있다.

이 글에서는 탭 디랙티브를 작성한다. 탭을 추가하기 위한 다른 디랙티브의 함수를 활용하며, 디렉티브 정의 개체의 `require` 프로퍼티를 사용해 만들려고 한다.

HTML을 먼저 정의한다:

```html
<tabs>
  <tab label="Tab 1">
    Tab 1 contents!
   </tab>
   <tab label="Tab 2">
    Tab 2 contents!
   </tab>
   <tab label="Tab 3">
    Tab 3 contents!
   </tab>
</tabs>
```

이 시점에서 `tabs`와 `tab` 두 디렉티브를 만들 것을 예상할 수 있다. `tabs`를 먼저 만들면:

```javascript
function tabs() {
  return {
    restrict: 'E',
    scope: {},
    transclude: true,
    controller: function () {
      this.tabs = [];
    },
    controllerAs: 'tabs',
    template: `
      <div class="tabs">
        <ul class="tabs__list"></ul>
        <div class="tabs__content" ng-transclude></div>
      </div>
    `
  };
}

angular
  .module('app', [])
  .directive('tabs', tabs);
```

이 `tabs` 디렉티브에서는 `transclude`를 사용해 각각의 `tab`을 전달하고 개별적으로 관리하도록 구성하고 있다.

`tabs` 컨트롤러 내에서 새로운 탭을 추가할 때 사용할 함수가 필요하다. 이 함수를 사용해 부모/호스트 디렉티브에 동적으로 탭을 추가할 수 있게 된다:

```javascript
function tabs() {
  return {
    ...
    controller: function () {
      this.tabs = [];
      this.addTab = function addTab(tab) {
        this.tabs.push(tab);
      };
    },
    ...
  };
}

angular
  .module('app', [])
  .directive('tabs', tabs);
```

이제 컨트롤러에 `addTab` 메소드가 연결되었다. 하지만 탭을 어떻게 추가할 것인가? 자식 `tab` 디렉티브를 추가하고, 이 디렉티브가 컨트롤러의 기능으로서 필요로 한다:

```javascript
function tab() {
  return {
    restrict: 'E',
    scope: {
      label: '@'
    },
    require: '^tabs',
    transclude: true,
    template: `
      <div class="tabs__content" ng-if="tab.selected">
        <div ng-transclude></div>
      </div>
    `,
    link: function ($scope, $element, $attrs) {

    }
  };
}

angular
  .module('app', [])
  .directive('tab', tab)
  .directive('tabs', tabs);
```

`require: '^tabs'`를 추가하는 것으로 부모로 `tabs` 디렉티브의 컨트롤러에 포함했으며 이제 `link` 함수를 통해 접근할 수 있게 되었다. `link` 함수의 4번째 인자인 `$ctrl`을 주입해서 작성한 컨트롤러의 참조를 받아오자:

```javascript
function tab() {
  return {
    ...
    link: function ($scope, $element, $attrs, $ctrl) {

    }
  };
}
```

여기서 `console.log($ctrl);`을 넣어보면 다음과 비슷한 객체를 볼 수 있다:

```javascript
{
  tabs: Array,
  addTab: function addTab(tab)
}
```

`addTab` 함수를 활용해서 새로운 탭을 생성할 때, 부모 디렉티브의 컨트롤러로 정보를 보낼 수 있게 되었다:

```javascript
function tab() {
  return {
    ...
    link: function ($scope, $element, $attrs, $ctrl) {
      $scope.tab = {
        label: $scope.label,
        selected: false
      };
      $ctrl.addTab($scope.tab);
    }
  };
}
```

이제 새로운 `tab` 디렉티브를 사용할 때마다 이 `$ctrl.addTab` 함수를 호출하고 `tabs` 컨트롤러 내에 있는 `this.tabs` 배열에 디렉티브 정보를 전달한다.

3개의 탭이 존재한다면 `$ctrl.addTab` 함수가 3번 호출 될 것이고 배열은 3개의 값을 갖고 있게 된다. 그 후 배열을 반복해서 살펴보고 제목과 선택되어 있는 탭이 있는지 확인한다:

```javascript
function tabs() {
  return {
    restrict: 'E',
    scope: {},
    transclude: true,
    controller: function () {
      this.tabs = [];
      this.addTab = function addTab(tab) {
        this.tabs.push(tab);
      };
      this.selectTab = function selectTab(index) {
        for (var i = 0; i < this.tabs.length; i++) {
          this.tabs[i].selected = false;
        }
        this.tabs[index].selected = true;
      };
    },
    controllerAs: 'tabs',
    template: `
      <div class="tabs">
        <ul class="tabs__list">
          <li ng-repeat="tab in tabs.tabs">
            <a href="" ng-bind="tab.label" ng-click="tabs.selectTab($index);"></a>
          </li>
        </ul>
        <div class="tabs__content" ng-transclude></div>
      </div>
    `
  };
}
```

`selectTab`이 `tabs` 컨트롤러에 추가된 것을 확인할 수 있을 것이다. 이 함수는 특정 탭의 컨텐츠를 보여주기 위해 초기 색인을 지정할 수 있게 한다. `this.selectTab(0);`를 호출하면 작성한 코드에 따라 배열의 인덱스를 확인해 첫번째 탭의 컨텐츠를 표시하게 된다.

Angular의 컴파일링 과정에 따라 `controller`는 가장 먼저 인스턴스가 생성되고, `link` 함수는 디렉티브가 컴파일되고 엘리먼트에 연결될 때 한 번 호출된다. 즉, 초기화 된 탭을 볼 수 있을 때, 디렉티브 컨트롤러를 `$ctrl`와 그 메소드를 사용하기 위해 주입되어야 한다:

```javascript
function tabs() {
  return {
    ...
    link: function ($scope, $element, $attrs, $ctrl) {
      // 첫번째 탭을 가장 먼저 보여줌
      $ctrl.selectTab(0);
    },
  };
}
```

하지만 다음처럼 어트리뷰트로 초기 탭을 지정할 수 있다면, 개발자에게 더 많은 선택권을 제공할 수 있다:

```html
<tabs active="2">
  <tab>...</tab>
  <tab>...</tab>
  <tab>...</tab>
</tabs>
```

이 코드는 배열 인덱스를 동적으로 `2`로 지정하며 배열에서 `3`번째 엘리먼트를 보여주게 된다. `link` 함수에서는 어트리뷰트의 존재를 `$attrs`가 포함하고 있는데 이 인덱스를 바로 지정하거나 `$attrs.active`가 존재하지 않거나 잘못된 값일 경우 (`false`는 ``으로 평가되니 어쨌든 ``이므로 안전하겠지만) 초기 인덱스를 다음처럼 폴백(fallback)으로 지정할 수 있다.

```javascript
function tabs() {
  return {
    ...
    link: function ($scope, $element, $attrs, $ctrl) {
      // `active` 탭 또는 첫번째 탭을 지정
      $ctrl.selectTab($attrs.active || 0);
    },
  };
}
```

그리고 `require`를 이용해 새로운 `tab` 정보를 부모 디렉티브에 전달하는 라이브 데모는 아래에서 확인할 수 있다:

{{<  //jsfiddle.net/toddmotto/4comjcdm/embedded/result,js,html >}}

 [1]: https://toddmotto.com/directive-to-directive-communication-with-require/