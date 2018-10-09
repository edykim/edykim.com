---
title: "Angular 디렉티브 때려잡기: 구조와 MVVM"
author: haruair
type: post
date: 2015-11-12T08:14:00-07:00
lang: ko
slug: killing-it-with-angular-directives-structure-and-mvvm
categories:
  - 개발 이야기
  - 번역
tags:
  - angularjs
  - js
---

이 글은 Todd Motto의 글 [Killing it with Angular Directives; Structure and MVVM](http://toddmotto.com/killing-it-with-angular-directives-structure-and-mvvm/)를 번역한 글이다.

Angular에서 디렉티브를 어떤 방식으로 사용해야 하는지 예제를 통해 설명하고 있다. Angular에서 각각 코드 사이의 관계를 분리하는 방식은 Angular만의 방식이 아닌 MVVM 패턴을 활용하고 있다. 디렉티브의 구조를 어떤 방식으로 작성하는지, `link`와 `controller`, 그리고 외부에서 서비스를 주입하는 것으로 각각 로직을 어떻게 분리하는지 이해하는데 도움되는 글이다.

----
## Angular 디렉티브 때려잡기: 구조와 MVVM

이 포스트에서는 Angular 1.x에서 어떻게 디렉티브(Directives)를 작성하는가에 대한 원칙을 설명하려고 한다. 디렉티브를 어떻게, 왜, 어디에서 사용해야 하는지에 대한 혼란이 많다. 하지만 이 개념을 한번만 이해하고 구분하면 아주 간단한 기능이다. 이 포스트는 중첩된 디렉티브 또는 부모 스코프에서 흐르는 데이터 흐름과 같은 내용을 다루지 않는다. 대신 디렉티브를 만들고 구조화하고, 관계를 분리하는데 가장 이상적인 방법과 함께, `controller`와 `link` 프로퍼티를 어떻게 올바르게 사용하는가에 대해 다루려고 한다.

기초적인 디렉티브, 구조, 그리고 Angular에서 사용하기 가장 좋은 방식으로 구조화하는 방법에 대해 다룬다. 디렉티브 작성에 대한 접근 방식을 보여주기 위해 모조 "파일 업로드" 디렉티브를 만들어보자.

_노트, 이 코드는 실제로 동작하지 않으며, 효과적으로 디렉티브를 구조화 하는 방법에 대해 설명하려는 의도로 작성했다._

### 구조 Structure
내 [AngularJS 스타일 가이드](https://github.com/toddmotto/angularjs-styleguide)를 따라 자연스럽게 기초적인 디렉티브 정의를 작성하고 Angular의 `.directive()` 메소드에 넣는다:

    function fileUpload () {
      
      return {};

    }
    angular
      .module('app')
      .directive('fileUpload', fileUpload);

    적당한 위치에 정의를 작성했으니 파일 업로드 컴포넌트를 위한 기본적인 프로퍼티를 추가한다:

    function fileUpload () {
      
      return {
        restrict: 'E',
        scope: {},
        template: [
          '<div>',
          '</div>'
        ].join(''),
        controllerAs: 'vm',
        controller: function () {},
        link: function () {}
      };

    }
    angular
      .module('app')
      .directive('fileUpload', fileUpload);

이 코드가 내가 기본적으로 필요로 하는 모든 요소가 포함된 "디렉티브 보일러플레이트"로, 이 코드를 기초로 동작하는 디렉티브를 만든다.

### 컨트롤러 Controller (presentational layer)
컨트롤러를 `controller: fn`처럼 객체에 바인딩하는 대신 (`link`에도 동일), `controller` 프로퍼티를 `fileUpload` 함수 정의 내에서 바인딩을 먼저 한 후, 객체에 연결해 반환받는 형태로 작성한다. 이 방식으로 작성하면 함수를 객체에 직접 작성하는 방식보다 함수를 정의하는 공간이 있어서 연관된 함수를 더 쉽게 찾고 이해할 수 있고, 함수에 주석을 작성하는데 더 나은 구조가 된다. 이 형태는 "엄격해 보이는 API"에 묶여 있는 느낌보다 평범한 JavaScript처럼 표현된다.

함수를 맨 위에 작성하고 주석 몇 개를 작성한다.

    /**
     * @name fileUpload
     * @desc <file-upload> Directive
     */
    function fileUpload () {

      /**
       * @name fileUploadCtrl
       * @desc File Upload Controller
       * @type {Function}
       */
      function fileUploadCtrl() {

      }

      /**
       * @name link
       * @desc File Upload Link
       * @type {Function}
       */
      function link() {

      }

      return {
        restrict: 'E',
        scope: {},
        template: [
          '<div>',
          '</div>'
        ].join(''),
        controllerAs: 'vm',
        controller: fileUploadCtrl
        link: link
      };

    }
    angular
      .module('app')
      .directive('fileUpload', fileUpload);

멋진가? 당연하다. `controllerAs: 'vm'`에서 볼 수 있듯 컨트롤러를 `vm`이란 별칭으로 지정했다. (뷰모델 ViewModel을 뜻한다.) 이렇게 컨트롤러를 뷰모델로 다루는 것은 "프리젠테이션 모델 Presentation Model" 디자인 패턴에 해당한다. 이 문법에 익숙하지 않다면 [ControllerAs](http://toddmotto.com/digging-into-angulars-controller-as-syntax)([번역](http://haruair.com/blog/3186))에 대해 먼저 읽어보자. `$scope`를 필수적으로 주입하는 방식 대신 컨트롤러 자체를 `$scope` 내 `vm` 별칭에 바인딩하는 방식, 즉 `$scope.vm`을 생성하게 된다. `$scope` 대신 `this` 키워드를 사용하는 것으로 이 뷰-모델을 마치 컨트롤러 "클래스"인 것처럼 작성할 수 있다.

    /**
     * @name fileUploadCtrl
     * @desc File Upload Controller
     * @type {Function}
     */
    function fileUploadCtrl() {
      this.files = [];
      this.uploadFiles = function () {

      };
    }

`this`를 사용하는 것이 `$scope` 쓰는 것보다 훨씬 낫게 보인다. `$scope`는 `$on` 이벤트나 `$watch`를 사용하는 경우에나 필요하다. 이런 방식으로 컨트롤러 클래스인 "뷰모델"을 조금 다르게 작성할 수 있다.

기본적인 함수 작성은 다 끝났다. 하지만 나는 "exports" 스타일을 더 선호하고, 모든 함수와 변수가 바인딩되고, 어떤 적절한 주석이든 작성할 수 있는 형태가 좋다. 이 모든 것을 염두해서 작성하면 다음과 같다:

    /**
     * @name fileUpload
     * @desc <file-upload> Directive
     */
    function fileUpload () {

      /**
       * @name fileUploadCtrl
       * @desc File Upload Controller
       * @type {Function}
       */
      function fileUploadCtrl() {

        /**
         * @name files
         * @desc Contains all files passed in by the user
         * @type {Array}
         */
        var files = [];

        /**
         * @name uploadFiles
         * @desc Uploads our files
         * @type {Array}
         */
        function uploadFiles() {

        }

        // exports
        this.files = files;
        this.uploadFiles = uploadFiles;

      }

      /**
       * @name link
       * @desc File Upload Link
       * @type {Function}
       */
      function link() {

      }

      return {
        restrict: 'E',
        scope: {},
        template: [
          '<div>',
          '</div>'
        ].join(''),
        controllerAs: 'vm',
        controller: fileUploadCtrl
        link: link
      };

    }
    angular
      .module('app')
      .directive('fileUpload', fileUpload);

### 템플릿 융화 Template integration
다음 순서로 `<input type=file>` 같이 파일 업로드를 위한 엘리먼트를 작성하고 모델에 연결해야 한다. 앞서 작성한 디렉티브에 `ng-model` 어트리뷰트와 값을 추가하자. 또한 `ng-change`와 함께 "업로드" 버튼을 추가하자. (그렇다. form이라면 `ng-submit`을 사용해야 하겠지만 간단하게 작성하기로 한다.)

    // ...
    template: [
      '<div>',
        '<input type="file" ng-model="vm.files">',
        '<button type="button" ng-change="vm.uploadFiles(vm.files);">',
      '</div>'
    ].join('')
    // ...

이 컨트롤러에 어떻게 업로드를 다뤄야 하는지에 대한 주석을 작성하자. `UploadService`을 추가했고 (좋은 이름이다) 이 서비스의 의존성이 컨트롤러에 주입될 수 있도록 `fileUploadCtrl`에 매개변수로 추가했다.

    /**
     * @name fileUploadCtrl
     * @desc File Upload Controller
     * @type {Function}
     */
    function fileUploadCtrl(UploadService) {

      /**
       * @name files
       * @desc Contains all files passed in by the user
       * @type {Array}
       */
      var files = [];

      /**
       * @name uploadFiles
       * @desc Uploads our files
       * @type {Array}
       */
      function uploadFiles(files) {
        // hand off our files to a Service
        UploadService
        .uploadFiles(files)
        .then(function (response) {
          // success, we could get our file Object back
          // and render it in the View for the user
          // maybe some ng-repeat with a list of files inside
        }, function (reason) {
          // error stuff if not handled globally
        })
      }

      // exports
      this.files = files;
      this.uploadFiles = uploadFiles;

    }

잠깐, 별로 많이 변경되지 않았다. 왜지? 왜 그런지 이유를 보자.

### 서비스 Services (business logic layer)

백엔드와 연결해서 파일을 업로드 하는 작업과 같이 API와 소통하는 무엇이든 절대, _절대_ 컨트롤러에 작성하지 않는다. 왜냐고? 관계를 분리하는 것이다. 물론 컨트롤러에 작성할 수도 있다. 하지만 컨트롤러를 뷰모델비지니스로직어쩌고가 아닌 뷰모델처럼 사용한다면 우리 삶을 너무나도 힘들게 만든다.

여기서 서비스를 위한 모조 코드를 작성하진 않을 것이지만 왜 추상화된 비지니스 로직을 컨트롤러에 넘겨야 하는가에 대해서 이해하는 것은 아주 중요하다. 디렉티브의 구조와 의존성을 관리에 용이하고 확장 가능하게 구축하기 위해서는 처음부터 고려를 해야한다.

서비스는 컨트롤러(뷰모델)가 사용자에게 데이터를 표현할 수 있도록 필요한 모델 데이터를 복제해서 제공할 수 있어야 한다.

### 링크 함수 Link function (DOM layer)
디렉티브는 표현 로직 레이어(컨트롤러)나 비지니스 로직 레이어(서비스)가 다루지 못하는 환상적인 통로를 제공하는데 그건 바로 DOM 문서 객체 모델(Document Object Model)이다. 종종 DOM이 필요한데 Angular는 우리를 위해 준비를 해두었다.

여기서 작성한 파일 업로드 디렉티브는 흑마법 같은 드래그 드랍 없이는 완성되지 않은 것이나 마찬가지니 `dragover, drop` 같은 DOM 이벤트를 활용하자. 먼저 `<div class="drop-zone">`을 디렉티브에 추가하고 이 영역을 "드래그 드랍" 영역으로 제공한다.

    // ...
    template: [
      '<div>',
        '<input type="file" ng-model="vm.files">',
        '<button type="button" ng-change="vm.uploadFiles(vm.files);">',
        '<div class="drop-zone">Drop your files here!</div>',
      '</div>'
    ].join('')
    // ...

이제 디렉티브와 묶어야 한다. `link` 함수는 여기서 유용하다. 이 함수에 `$scope, $element, $attrs`를 주입한다. (미안하지만 달러 표시로 프리픽스를 붙이는 것을 좋아한다. `iAttrs`을 보면 눈물이 앞을 가린다.)

이제 `.drop-zone`엘리먼트에 특별한 이벤트 리스너를 연결해야 한다. `link` 함수를 최대한 가볍게 만든다는 점을 명심하자. 여기서 `$scope` 인자는 정말 드물게 사용하는데 여러분도 그래야 한다.

엘리먼트에 이벤트 리스너를 추가한다:

    /**
     * @name link
     * @desc File Upload Link
     * @type {Function}
     */
    function link($scope, $element, $attrs) {
      var drop = $element.find('.drop-zone')[0];
      drop.addEventListener('dragenter', function(e) {
        // "dragenter"에 무언가 동작
      }, false);
      drop.addEventListener("dragleave", function(e) {
        // "dragleave"에 무언가 동작
      }, false);
      drop.addEventListener("dragover", function(e) {
        // "dragover"에 무언가 동작
      }, false);
      drop.addEventListener('drop', function(e) {
        // "drop"에 무언가 동작
      }, false);
    }

다시 말하지만 나는 깔끔하게 보이는 것을 좋아하니까 주석과 추상성을 좀 더 다듬었다. `dragenter`, `dragleave`, `dragover`는 이 데모에서 필요 없으니 지운다.:

    /**
     * @name link
     * @desc File Upload Link
     * @type {Function}
     */
    function link($scope, $element, $attrs) {

      /**
       * @name drop
       * @desc Drop zone element
       * @type {Element}
       */
      var drop = $element.find('.drop-zone')[0];

      /**
       * @name onDrop
       * @desc Callback on "drop" event
       * @type {Function}
       * @param {Event} e Event passed in to grab files from
       */
      function onDrop(e) {
        
      }
      
      // events
      drop.addEventListener('drop', onDrop, false);

    }

이벤트 리스너를 설정했고 `e.dataTransfer.files`에서 파일을 집어 업로드 API로 넘겨줄 수 있다. 하지만 같은 함수를 컨트롤러에 있는 `uploadFiles` 메소드를 사용하고 싶다.

디렉티브 _안으로_ 컨트롤러를 넘겨줄 수 있는데, `$ctrl`이라는 짧고 귀요미인 별칭을 사용해서 디렉티브에서 컨트롤러에 접근할 수 있도록 만든다. (역주. link가 호출될 때 4번째 인자로 컨트롤러가 제공됨.)

    /**
     * @name link
     * @desc File Upload Link
     * @type {Function}
     */
    function link($scope, $element, $attrs, $ctrl) {

      /**
       * @name drop
       * @desc Drop zone element
       * @type {Element}
       */
      var drop = $element.find('.drop-zone')[0];

      /**
       * @name onDrop
       * @desc Callback on "drop" event
       * @type {Function}
       * @param {Event} e Event passed in to grab files from
       */
      function onDrop(e) {
        if (e.dataTransfer && e.dataTransfer.files) {
          $ctrl.uploadFiles(e.dataTransfer.files);
        }
      }
      
      // events
      drop.addEventListener('drop', onDrop, false);

    }

대박! 컨트롤러의 `uploadFiles` 메소드를 사용해서 API로 파일을 넘기는데 코드를 다시 사용했다! 이런 방식으로 표현 로직에서의 변경을 그대로 반영할 수 있게 되었다. 앞서 언급한 것처럼 업로드된 파일을 사용자에게 보여줄 때에도 컨트롤러에서 모든 코드를 다시 사용하고 활용할 수 있을 것이다.

하지만 이건 아직 동작하지 않는다... 마법의 코드 `$scope.$apply()`를 잊었다:

    /**
     * @name onDrop
     * @desc Callback on "drop" event
     * @type {Function}
     * @param {Event} e Event passed in to grab files from
     */
    function onDrop(e) {
      if (e.dataTransfer && e.dataTransfer.files) {
        $ctrl.uploadFiles(e.dataTransfer.files);
        // force a $digest cycle
        $scope.$apply();
      }
    }

파일이 업로드 된 후, `$digest` 사이클을 실행하도록 `$scope.apply()`를 추가한다. 파일을 업로드한 과정을 거치고 데이터가 변경된 후에 어플리케이션 또한 변경되도록 한다. 이 과정이 필요한 이유는 Angular 생태계 외부에서 존재하는 `drop` 이벤트 리스너를 활용했기 때문이다. 외부에 있어서 그 이벤트가 동작하는지, 무슨 일이 어떻게 일어났는지 알려야 할 필요가 있는 것이다.

이제 모든 것이 갖춰졌다:

    /**
     * @name fileUpload
     * @desc <file-upload> Directive
     */
    function fileUpload () {

      /**
       * @name fileUploadCtrl
       * @desc File Upload Controller
       * @type {Function}
       */
      function fileUploadCtrl(UploadService) {

        /**
         * @name files
         * @desc Contains all files passed in by the user
         * @type {Array}
         */
        var files = [];

        /**
         * @name uploadFiles
         * @desc Uploads our files
         * @type {Array}
         */
        function uploadFiles(files) {
          // hand off our files to a Service
          UploadService
          .uploadFiles(files)
          .then(function (response) {
            // success, we could get our file Object back
            // and render it in the View for the user
            // maybe some ng-repeat with a list of files inside
          }, function (reason) {
            // error stuff if not handled globally
          })
        }

        // exports
        this.files = files;
        this.uploadFiles = uploadFiles;

      }

      /**
       * @name link
       * @desc File Upload Link
       * @type {Function}
       */
      function link($scope, $element, $attrs, $ctrl) {

        /**
         * @name drop
         * @desc Drop zone element
         * @type {Element}
         */
        var drop = $element.find('.drop-zone')[0];

        /**
         * @name onDrop
         * @desc Callback on "drop" event
         * @type {Function}
         * @param {Event} e Event passed in to grab files from
         */
        function onDrop(e) {
          if (e.dataTransfer && e.dataTransfer.files) {
            $ctrl.uploadFiles(e.dataTransfer.files);
            // force a $digest cycle
            $scope.$apply();
          }
        }
        
        // events
        drop.addEventListener('drop', onDrop, false);

      }

      return {
        restrict: 'E',
        scope: {},
        template: [
          '<div>',
            '<input type="file" ng-model="vm.files">',
            '<button type="button" ng-change="vm.uploadFiles(vm.files);">',
            '<div class="drop-zone">Drop your files here!</div>',
          '</div>'
        ].join(''),
        controllerAs: 'vm',
        controller: fileUploadCtrl
        link: link
      };

    }
    angular
      .module('app')
      .directive('fileUpload', fileUpload);

### 정리, MVVM (Model-View-ViewModel)
이 접근은 컨트롤러를 뷰 모델로 사용하는 방식이며 `link` 함수를 DOM 조작에 활용함과 동시에 컨트롤러에 간단한 일을 전달하는 역할을 하도록 처리하는 역할을 한다. 이 접근은 함수 내부에 객체를 제공하는 등의 방법으로 중첩된 여러 계층의 코드를 작성하는 것과 같이 복잡한 방법을 사용하지 않고, 마치 코드 자체가 별도로 구성된 것 같이, 함수를 분리하고 다시 할당하는 방식으로 서로 의존적인 관계를 분리하는 데 더 적합하다.

의견이나 개선점은 [Github 이슈](https://github.com/toddmotto/toddmotto.github.io)로 남겨주기 바란다. Enjoy!

