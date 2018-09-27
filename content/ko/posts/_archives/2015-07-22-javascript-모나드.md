---
title: JavaScript 모나드
author: haruair
type: post
date: 2015-07-22T10:55:46+00:00
history:
  - 
    from: https://www.haruair.com/blog/2986
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: javascript-monad
headline:
  - '함수형 프로그래밍에서의 모나드 JavaScript에서 살펴보기,  Monads in JavaScript 번역'
categories:
  - 개발 이야기
  - 번역
tags:
  - javascript
  - js
  - monad
  - 모나드

---
얼마 전 [제이펍 출판사][1] 베타리더스 3기에 선정되었다. 선정 되자마자 <함수 프로그래밍 실천 기술>이란 제목의 책을 베타리딩하게 되었는데 함수형 프로그래밍에 대해 전반적인 내용과 세세한 개념을 Haskell로 설명하는 책이었다. 함수형 프로그래밍에 대한 책을 처음 읽어봐서 생소한 개념도 많았지만 다른 언어로의 비교 코드를 많이 제시하고 있어 전체적인 이해에 도움이 많이 되었다. 조만간 출간된다고 하니 관심이 있다면 제목을 적어두는 것도 좋겠다 🙂

함수형 언어를 얘기하면 모나드가 꼭 빠지지 않는다. 이 포스트는 [Monads in JavaScript][2]의 번역글이다. 이 글이 모나드에 대해 세세하게 모든 이야기를 다룬 것은 아니지만 모나드의 아이디어를 JavaScript로 구현해서 이 코드에 익숙하다면 좀 더 쉽게 접근할 수 있는 글이라 번역으로 옮겼다. 쉽게 이해하기 어렵지만 이해하면 정말 강력하다는 모나드를 이 글을 통해 조금이나마 쉽게 이해하는데 도움이 되었으면 좋겠다.

* * *

모나드는 순서가 있는 연산을 처리하는데 사용하는 디자인 패턴이다. 모나드는 [순수 함수형 프로그래밍 언어][3]에서 [부작용을 관리][4]하기 위해 광범위하게 사용되며 [복합 체계 언어][5]에서도 복잡도를 제어하기 위해 사용된다.

모나드는 타입으로 감싸 빈 값을 자동으로 전파하거나(Maybe 모나드) 또는 비동기 코드를 단순화(Continuation 모나드) 하는 등의 행동을 추가하는 역할을 한다.

모나드를 고려하고 있다면 코드의 구조가 다음 세가지 조건을 만족해야 한다.

  1. 타입 생성자 &#8211; 기초 타입을 위한 모나드화된 타입을 생성하는 기능. 예를 들면 기초 타입인 `number`를 위해 `Maybe<number>` 타입을 정의하는 것.
  2. `unit` 함수 &#8211; 기초 타입의 값을 감싸 모나드에 넣음. Maybe 모나드가 `number` 타입인 값 `2`를 감싸면 타입 `Maybe<number>`의 값 `Maybe(2)`가 됨.
  3. `bind` 함수 &#8211; 모나드 값으로 동작을 연결하는 함수.

다음의 TypeScript 코드가 이 함수의 일반적인 표현이다. `M`은 모나드가 될 타입으로 가정한다.

    interface M<T> {
    
    }
    
    function unit<T>(value: T): M<T> {
        // ...
    }
    
    function bind<T, U>(instance: M<T>, transform: (value: T) => M<U>): M<U> {
        // ...
    }
    

> Note: 여기에서의 `bind` 함수는 `Function.prototype.bind` 함수와 다르다. 후자의 `bind`는 ES5부터 제공하는 네이티브 함수로 부분 적용한 함수를 만들거나 함수에서 `this` 값을 바꿔 실행할 때 사용하는 함수다. 

JavaScript와 같은 객체지향 언어에서는 `unit` 함수는 생성자와 같이 표현될 수 있고 `bind` 함수는 인스턴스의 메소드와 같이 표현될 수 있다.

    interface MStatic<T> {
        new(value: T): M<T>;
    }
    
    interface M<T> {
        bind<U>(transform: (value: T) => M<U>):M<U>;
    }
    

또한 여기에서 다음 3가지 모나드 법칙을 준수해야 한다.

  1. bind(unit(x), f) ≡ f(x)
  2. bind(m, unit) ≡ m
  3. bind(bind(m, f), g) ≡ bind(m, x => bind(f(x), g))

먼저 앞 두가지 법칙은 `unit`이 중립적인 요소라는 뜻이다. 세번째 법칙은 `bind`는 결합이 가능해야 한다는 의미로 결합의 순서가 문제가 되서는 안된다는 의미다. 이 법칙은 덧셈에서 확인할 수 있는 법칙과 같다. 즉, `(8 + 4) + 2`의 결과는 `8 + (4 + 2)`와 같은 결과를 갖는다.

아래의 예제에서는 화살표 함수 문법을 사용하고 있다. Firefox (version 31)는 네이티브로 지원하고 있지만 Chrome (version 36)은 아직 지원하지 않는다.

## Identity 모나드

identity 모나드는 가장 단순한 모나드로 값을 감싼다. `Identity` 생성자는 앞서 살펴본 `unit`과 같은 함수를 제공한다.

    function Identity(value) {
      this.value = value;
    }
    
    Identity.prototype.bind = function(transform) {
      return transform(this.value);
    };
    
    Identity.prototype.toString = function() {
      return 'Identity(' + this.value + ')';
    };
    

다음 코드는 덧셈을 Identity 모나드를 활용해 연산하는 예시다.

    var result = new Identity(5).bind(value =>
                     new Identity(6).bind(value2 =>
                         new Identity(value + value2)));
    

## Maybe 모나드

Maybe 모나드는 Identity 모나드와 유사하게 값을 저장할 수 있지만 어떤 값도 있지 않은 상태를 표현할 수 있다.

`Just` 생성자가 값을 감쌀 때 사용된다.

    function Just(value) {
      this.value = value;
    }
    
    Just.prototype.bind = function(transform) {
      return transform(this.value);
    };
    
    Just.prototype.toString = function() {
      return 'Just(' + this.value + ')';
    };
    

`Nothing`은 빈 값을 표현한다.

    var Nothing = {
      bind: function() {
        return this;
      },
      toString: function() {
        return 'Nothing';
      }
    };
    

기본적인 사용법은 identity 모나드와 유사하다.

    var result = new Just(5).bind(value =>
                     new Just(6).bind(value2 =>
                          new Just(value + value2)));
    

Identity 모나드와 주된 차이점은 빈 값의 전파에 있다. 중간 단계에서 `Nothing`이 반환되면 연관된 모든 연산을 통과하고 `Nothing`을 결과로 반환하게 된다.

다음 코드에서는 `alert`가 실행되지 않게 된다. 그 전 단계에서 빈 값을 반환하기 때문이다.

    var result = new Just(5).bind(value =>
                     Nothing.bind(value2 =>
                          new Just(value + alert(value2))));
    

이 동작은 수치 표현에서 나타나는 특별한 값인 `NaN`(not-a-number)과도 유사하다. 결과 중간에 `NaN` 값이 있다면 `NaN`은 전체 연산에 전파된다.

    var result = 5 + 6 * NaN;
    

Maybe 모나드는 `null` 값에 의한 에러가 발생하는 것을 막아준다. 다음 코드는 로그인 사용자의 아바타를 가져오는 예시다.

    function getUser() {
      return {
        getAvatar: function() {
          return null; // 아바타 없음
        }
      }
    }
    

빈 값을 확인하지 않는 상태로 메소드를 연결해 호출하면 객체가 `null`을 반환할 때 `TypeErrors`가 발생할 수 있다.

    try {
      var url = getUser().getAvatar().url;
      print(url); // 여기는 절대 실행되지 않음
    } catch (e) {
      print('Error: ' + e);
    }
    

대안적으로 `null`인지 확인할 수 있지만 이 방법은 코드를 장황하게 만든다. 코드는 틀리지 않지만 한 줄의 코드가 여러 줄로 나눠지게 된다.

    var url;
    var user = getUser();
    if (user !== null) {
      var avatar = user.getAvatar();
      if (avatar !== null) {
        url = vatar.url;
      }
    }
    

다른 방식으로 작성할 수 있을 것이다. 비어 있는 값을 만날 때 연산이 정지하도록 작성해보자.

    function getUser() {
      return new Just({
        getAvatar: function() {
          return Nothing; // 아바타 없음
        }
      });
    }
    
    var url = getUser()
                .bind(user => user.getAvatar())
                .bind(avatar => avatar.url);
    
    if(url instanceof Just) {
      print('URL has value: ' + url.value);
    } else {
      print('URL is empty');
    }
    

## List 모나드

List 모나드는 값의 목록에서 지연된 연산이 가능함을 나타낸다.

이 모나드의 `unit` 함수는 하나의 값을 받고 그 값을 yield하는 generator를 반환한다. `bind` 함수는 `transform` 함수를 목록의 모든 요소에 적용하고 그 모든 요소를 yield 한다.

    function* unit(value) {
      yield value;
    }
    
    function* bind(list, transform) {
      for (var item of list) {
        yield* transform(item);
      }
    }
    

배열과 generator는 이터레이션이 가능하며 그 반복에서 `bind` 함수가 동작하게 된다. 다음 예제는 지연을 통해 각각 요소의 합을 만드는 목록을 어떻게 작성하는지 보여준다.

    var result = bind([0, 1, 2], function (element) {
      return bind([0, 1, 2], function* (element2) {
        yield element + element2;
      });
    });
    
    for (var item of result) {
      print(item);
    }
    

다음 글은 다른 어플리케이션에서 JavaScript의 generator를 어떻게 활용하는지 보여준다.

  * [Generating primes in ES6][6]
  * [Sudoku solver][7]
  * [Easy asynchrony with ES6][8]
  * [Solving riddles with Prolog and ES6 generators][9]
  * [Pi approximation using Monte Carlo method][10]

## Continuation 모나드

Continuation 모나드는 비동기 일감에서 사용한다. ES6에서는 다행히 직접 구현할 필요가 없다. `Promise` 객체가 이 모나드의 구현이기 때문이다.

  1. `Promise.resolve(value)` 값을 감싸고 `pormise`를 반환. (`unit` 함수의 역할)
  2. `Promise.prototype.then(onFullfill: value => Promise)` 함수를 인자로 받아 값을 다른 promise로 전달하고 promise를 반환. (`bind` 함수의 역할)

다음 코드에서는 `Unit` 함수로 `Promise.resolve(value)`를 활용했고, `Bind` 함수로 `Promise.prototype.then`을 활용했다.

    var result = Promise.resolve(5).then(function(value) {
      return Promise.resolve(6).then(function(value2) {
          return value + value2;
      });
    });
    
    result.then(function(value) {
        print(value);
    });
    

Promise는 기본적인 continuation 모나드에 여러가지 확장을 제공한다. 만약 `then`이 promise 객체가 아닌 간단한 값을 반환하면 이 값을 Promise 처리가 완료된 값과 같이 감싸 모나드 내에서 사용할 수 있다.

두번째 차이점은 에러 전파에 대해 거짓말을 한다는 점이다. Continuation 모나드는 연산 사이에서 하나의 값만 전달할 수 있다. 반면 Promise는 구별되는 두 값을 전달하는데 하나는 성공 값이고 다른 하나는 에러를 위해 사용한다. (Either 모나드와 유사하다.) 에러는 `then` 메소드의 두번째 콜백으로 포착할 수 있으며 또는 이를 위해 제공되는 특별한 메소드 `.catch`를 사용할 수 있다.

Promise 사용과 관련된 기사는 다음과 같다:

  * [Easy asynchrony with ES6][8]
  * [Simple AMD loader in 30 lines of code][11]

## Do 표기법

Haskell은 모나드화 된 코드를 작업하는데 도움을 주기 위해 편리 문법(syntax sugar)인 _do_ 표기법을 제공하고 있다. `do` 키워드와 함께 시작된 구획은 `bind` 함수를 호출하는 것으로 번역이 된다.

ES6 generator는 `do` 표기법을 JavaScript에서 간단하고 동기적으로 보이는 코드로 작성할 수 있게 만든다.

전 예제에서는 maybe 모나드가 다음과 같이 직접 `bind`를 호출했었다.

    var result = new Just(5).bind(value =>
                     new Just(6).bind(value2 =>
                         new Just(value + value2)));
    

다음은 같은 코드지만 generator를 활용했다. 각각의 호출은 `yield`로 모나드에서 값을 받는다.

    var result = doM(function*() {
      var value = yield new Just(5);
      var value2 = yield new Just(6);
      return new Just(value + value2);
    });
    

이 작은 순서를 generator로 감싸고 그 뒤에 `bind`를 값과 함께 호출해 `yield`로 넘겨준다.

    function doM(gen) {
      function step(value) {
        var result = gen.next(value);
        if (result.done) {
          return result.value;
        }
        return result.value.bind(step);
      }
      return step();
    }
    

이 방식은 다른 Continuation 모나드와 같은 다른 모나드에서도 사용할 수 있다.

    Promise.prototype.bind = Promise.prototype.then;
    
    var result = doM(function*() {
      var value = yield Promise.resolve(5);
      var value2 = yield Promise.resolve(11);
      return value + value2;
    }());
    
    result.then(print);
    

다른 모나드와 같은 방식으로 동작하도록 `then`을 `bind`로 별칭을 붙였다.

promise에서 generator를 사용하는 예는 [Easy asynchrony with ES6][8]를 참고하자.

## 연결된 호출 Chained calls

다른 방식으로 모나드화 된 코드를 쉽게 만드는 방법은 Proxy를 활용하는 것이다.

다음 함수는 모나드 인스턴스를 감싸 proxy 객체를 반환한다. 이 객체는 값이 있는지 없는지 확인되지 않은 프로퍼티라도 안전하게 접근할 수 있게 만들고 모나드 내에 있는 값을 함수에서 활용할 수 있게 돕는다.

    function wrap(target, unit) {
      target = unit(target);
      function fix(object, property) {
        var value = object[property];
        if (typeof value === 'function') {
          return value.bind(object);
        }
        return value;
      }
      function continueWith(transform) {
        return wrap(target.bind(transform), unit);
      }
      return new Proxy(function() {}, {
        get: function(_, property) {
          if(property in target) {
            return fix(target, property);
          }
          return continueWith(value => fix(value, property));
        },
        apply: function(_, thisArg, args) {
          return continueWith(value => value.apply(thisArg, args));
        }
      });
    }
    

이 래퍼는 빈 객체를 참조할 가능성이 있는 경우에 안전하게 접근하는 방법을 제공한다. 이 방식은 [실존적 연산자][12](?.) 구현 방식과 동일하다.

    function getUser() {
      return new Just({
        getAvatar: function() {
          return Nothing; // 아바타 없음
        }
      });
    }
    
    var unit = value => {
      // 값이 있다면 Maybe 모나드를 반환
      if (value === Nothing || value instanceof Just) {
        return value;
      }
      // 없다면 Just를 감싸서 반환
      return new Just(value);
    }
    
    var user wrap(getUser(), unit);
    
    print(user.getAvatar().url);
    

아바타는 존재하지 않지만 url을 호출하는 것은 여전히 가능하며 빈 값을 반환 받을 수 있다.

동일한 래퍼를 continuation 모나드에서 일반적인 함수를 실행할 때에도 활용할 수 있다. 다음 코드는 특정 아바타를 가지고 있는 친구가 몇명이나 있는지 반환한다. 예제는 보이기엔 모든 데이터를 메모리에 올려두고 사용하는 것 같지만 실제로는 비동기적을 데이터를 가져온다.

    Promise.prototype.bind = Promise.prototype.then;
    
    function User(avatarUrl) {
      this.avatarUrl = avatarUrl;
      this.getFriends = function() {
        return Promise.resolve([
          new User('url1'),
          new User('url2'),
          new User('url11'),
        ]);
      }
    }
    
    var user = wrap(new User('url'), Prommise.resolve);
    
    var avatarUrls = user.getFriends().map(u => u.avatarUrl);
    
    var length = avatarUrls.filter(url => url.contains('1')).length;
    
    length.then(print);
    

여기서 모든 프로퍼티의 접근과 함수의 호출은 간단하게 값을 반환하는 것이 아니라 모나드 안으로 진입해 Promise를 실행해 결과를 얻게 된다.

ES6의 Proxies에 대한 자세한 내용은 [Array slices][13]를 참고하자.

* * *

원본 포스트 <https://curiosity-driven.org/monads-in-javascript> (CC BY 3.0)

 [1]: http://www.jpub.kr/
 [2]: https://curiosity-driven.org/monads-in-javascript
 [3]: http://www.haskell.org/haskellwiki/Monad
 [4]: https://en.wikipedia.org/wiki/Monad_(functional_programming)#The_I.2FO_monad
 [5]: http://blogs.msdn.com/b/wesdyer/archive/2008/01/11/the-marvels-of-monads.aspx?Redirected=true
 [6]: https://curiosity-driven.org/sieve-with-generators
 [7]: https://curiosity-driven.org/sudoku-solver
 [8]: https://curiosity-driven.org/promises-and-generators
 [9]: https://curiosity-driven.org/prolog-interpreter
 [10]: https://curiosity-driven.org/pi-approximation
 [11]: https://curiosity-driven.org/amd-loader-with-promises
 [12]: https://esdiscuss.org/topic/the-existential-operator
 [13]: https://curiosity-driven.org/array-slices