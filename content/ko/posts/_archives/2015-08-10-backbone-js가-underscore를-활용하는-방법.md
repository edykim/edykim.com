---
title: Backbone.js가 underscore를 활용하는 방법
author: haruair
type: post
date: "2015-08-10T11:12:15"
history:
  - 
    from: https://www.haruair.com/blog/3014
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: how-backbone.js-utilizes-underscore
categories:
  - 개발 이야기
tags:
  - Backbonejs
  - Underscore

---
[Backbone.js][1]를 지금까지 사용해본 적이 없었는데 주말에 깜짝 방문한 [jimkimau][2]님과 함께 살펴보게 되었다. 처음 사용해보는데다 아직 이사온 곳에 인터넷이 아직 들어오지 않아 문서 없이 코드만 보고 살펴볼 수 있을지 걱정했다. 컴퓨터를 검색해보니 어디서 사용한지 모르겠지만 backbone.js 파일을 찾을 수 있었다. 게다가 un-zipped 버전의 backbone.js에는 주석으로 모든 함수에 대한 설명과 사용 방식이 상세하게 남겨져 있어 오프라인이 문제가 되지 않았다.

[underscore][3]를 개발한 개발자가 만들어서 그런지 underscore에 대한 강한 의존성을 가지고 있다. Underscore도 방대하고 유익한 함수가 많다는 사실을 익히 들어 알고 있었지만 실무에서 사용하고 있지 않아 익숙해질 기회가 별로 없었다. 이번에 backbone.js를 살펴보던 중 이 라이브러리를 사용하는 방식이 상당히 인상적이었다. underscore를 더 재미있게 활용하는데 도움이 될 것 같아 어떤 방식으로 사용하고 있는지 발췌해 포스트로 정리해봤다.

## 객체 확장하기: `_.extend()`

Backbone.js에서는 기본적으로 underscore에서 제공하는 `_.extend(destination, *sources)` 함수를 이용해 확장하는 방식을 채택하고 있다. 이 함수는 sorces로 전달된 모든 객체의 프로퍼티를 복사해 destination 객체에 넣고 그 객체를 반환한다. 만약 동일한 명칭의 프로퍼티가 있다면 sources로 제공된 순서에 따라 덮어쓰게 된다. Backbone.js 전반에 걸쳐 상속 등에 사용되고 있는 함수다.

    _.extend(Colletion.prototype, Events, {
        ...
    });
    

Backbone.js에서 제공하는 모든 모듈은 위와 같은 방식으로 `Backbone.Events`의 함수를 확장하고 있다. 이 Events가 모든 모듈에 포함되어 이벤트 핸들링을 쉽게 만들며 전역 객체인 `Backbone`도 이 `Events`를 상속해 전역적인 pubsub을 구현할 수 있도록 돕고 있다.

## 객체 생성하기: `_.defaults()`와 `_.uniqueId()`

`_.defaults()`은 객체의 기본값을 설정할 때 많이 사용되는 함수로 Backbone.js에서는 기본값에 사용자 설정을 채워넣을 때 사용하고 있다.

    var setOptions = {add: true, remove: true, merge: true};
    // ...
    _.extend(Collection.prototype, Events, {
      set: function(models, options) {
        options = _.defaults({}, options, setOptions);
        // ...
      }
      // ...
    };
    

앞서 `_.extend()`와 유사하게 느껴지지만 `_.defaults()`는 첫번째 인자로 들어온 객체에 프로퍼티가 존재하지 않거나 null인 경우 즉, `obj[prop] == null`이 참인 경우에 이후 인자의 프로퍼티를 덮어쓰게 된다.

또한 객체를 초기화 하는 과정에서 고유한 id가 필요한 경우가 있는데 backbone.js는 `_.uniqueId()` 함수를 사용해 객체의 cid를 설정하고 있다. 인자로 제공한 문자열은 prefix가 된다. 이 함수는 호출할 때마다 1씩 증가한다.

    this.cid = _.uniqueId('view'); // view1
    

## 객체에서 필요한 값 얻기: `_.pick()`, `_.result()`

객체를 확장하기 위해서 `_.extend()` 함수를 사용하는 것을 앞에서 확인했다. 확장에서 모든 객체를 확장하는 것이 아니라 필요로 하는 메소드와 프로퍼티만 확장하고 싶을 수도 있다. 객체의 모든 값이 아니라 일부만 필요하다면 `_.pick()` 함수를 활용할 수 있다.

    var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];
    _.extend(this, _.pick(options, viewOptions));
    

위와 같이 배열로 입력해도 되고 필요로 하는 키 이름을 나열해도 반환한다.

    var bibimbab = {gosari: 10, egg: 4, rice:3, pepper_paste:10, spinach:3, sesame_oil: 2};
    _.pick(bibimbab, 'egg', 'rice', 'sesame_oil');
    // Object {egg: 4, rice: 3, sesame_oil: 2}
    _.pick(bibimbab, ['gosari', 'spinach']);
    // Object {gosari: 10, spinach: 3}
    

함수가 1급 클래스인 JavaScript의 특성으로 객체 프로퍼티가 값인 경우도 있고 함수인 경우도 있다. 프로퍼티 값을 받는 것과 같이 함수의 경우에는 호출해서 그 반환 값을 바로 받도록 하고 싶다면 직접 `_.isFunction()` 함수로 검사해서 값을 만들어도 되지만 간편하게 `_.result()` 함수를 활용할 수 있다.

    var attrs = _.extend({}, _.result(this, 'attributes'));
    

위와 같이 객체에서 사용할 어트리뷰트가 함수의 형태로 저장되어 있다면 함수를 실행해 그 결과를 반환해서 바로 사용할 수 있다.

## underscore 메소드 재사용하기

Bacbone.js에서 제공하는 `Backbone.Collection`에서는 underscore의 다양한 함수를 체이닝으로 사용할 수 있도록 확장되어 있다. 문서에서는 collection에서 언더스코어의 90% 가량 함수를 지원한다고 기술하고 있다.

    var methods = ['forEach', 'each', 'map', 'collect', 'reduce', ... ];
    
    _.each(methods, function(method) {
      Collection.prototype[method] = function() {
        var args = slice.call(arguments);
        args.unshift(this.models);
        return _[method].apply(_, args);
      };
    });
    

`Backbone.Collection`이 테이블이라면 각각의 데이터 행을 `Backbone.Model`로 제공한다. 위 코드에서 보면 Collection에 존재하는 model의 목록을 `unshift()`로 인자목록 앞에 넣어 underscore로 넘기는 방식으로 체이닝 메소드를 구현했다.

위와 같은 구현은 컬렉션 외에도 `Backbone.Model`에서도 유사하게 지원한다. 앞서 언급한 바와 같이 model은 단일 엔티티를 의미하고 있어 `keys()`, `values()`와 같은 메소드만 선택적으로 확장하고 있다.

앞서의 `methods`와 달리 `attributeMethods`의 경우는 다음과 같이 약간 다른 구현이 필요하다.

    var attributeMethods = ['groupBy', 'countBy', 'sortBy', 'indexBy'];
    
    _.each(attributeMethods, function(method) {
        Collection.prototype[method] = function(value, context) {
          var iterator = _.isFunction(value) ? value : function(model) {
            return model.get(value);
          };
          return _[method](this.models, iterator, context);
        };
      });
    

익명함수나 값을 기준으로 처리하는 attribute 함수는 위와 같은 방식으로, 함수인지 아닌지 판별 과정을 거쳐 함수인 경우 필터에 사용한다. 함수가 아닌 경우 해당 모델에서 값을 받아 사용할 수 있도록 처리되었다.

* * *

위에서 언급한 부분 외에도 흥미로운 부분이 많았다. `_.once()` 함수를 `Backbone.Events`에서 구현한 방식도 인상적이었고, 함수형 접근에 더 적절한 맥락을 갖도록 몇가지 함수를 제어 역전하는 부분도 살펴보기 좋다. 이벤트 트리거를 위해 내부적으로 사용하고 있는 함수인 `triggerEvents()`에서는 속도를 위해 switch를 쓰는 재미있는 구석도 있다.

코드를 읽는데도 주석도 잘 달려있고 각각의 함수 이름도 잘 지어진데다 잘게 잘 쪼개져 있어서 배우게 된 부분이 많았다. Backbone.js와 underscore를 관통하는 패러다임을 살펴볼 수 있었고 지금도 많은 개발자가 이 라이브러리를 사용할 만큼 매력적이란 사실을 알 수 있었다. lodash와 함께 나올 [underdash][4]도 기대가 된다.

 [1]: http://backbonejs.org
 [2]: http://twitter.com/jimkimau
 [3]: http://underscorejs.org
 [4]: http://github.com/underdash/underdash