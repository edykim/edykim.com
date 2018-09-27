---
title: JavaScript에서 커링 currying 함수 작성하기
author: haruair
type: post
date: 2015-07-21T04:37:25+00:00
history:
  - 
    from: https://www.haruair.com/blog/2993
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: writing-a-curling-currying-function-in-javascript
headline:
  - 함수형 프로그래밍에서 자주 쓰이는 curry 함수를 JavaScript에서 구현하는 방법 번역
categories:
  - 개발 이야기
  - 번역
tags:
  - currying
  - javascript
  - js
  - 커링

---
요즘 함수형 프로그래밍에 대한 관심이 많아져 여러가지 글을 찾아 읽고 있다. JavaScript에서도 충분히 활용 가능한데다 JS의 내부를 더 깊게 생각해볼 수 있고 다른 각도로 문제를 사고해보는데 도움이 되는 것 같아 한동안은 이와 관련된 포스트를 번역하려고 한다.

커링(currying)은 함수형 프로그래밍 기법 중 하나로 함수를 재사용하는데 유용하게 쓰일 수 있는 기법이다. 커링이 어떤 기법인지, 어떤 방식으로 JavaScript에서 구현되고 사용할 수 있는지에 대한 글이 있어 번역했다. 특히 이 포스트는 함수를 작성하고 실행하는 과정을 하나씩 살펴볼 수 있어 좋았다.

원본은 [Kevin Ennis의 Currying in JavaScript][1]에서 확인할 수 있다.

* * *

나는 최근 함수형 프로그래밍에 대해 생각을 많이 하게 되었다. 그러던 중 **curry** 함수를 작성하는 과정을 공유하면 재미있을 것 같다는 생각이 들었다.

처음 듣는 사람을 위해 간단히 설명하면, 커링은 함수 하나가 n개의 인자를 받는 과정을 n개의 함수로 각각의 인자를 받도록 하는 것이다. 부분적으로 적용된 함수를 체인으로 계속 생성해 결과적으로 값을 처리하도록 하는 것이 그 본질이다.

어떤 의미인지 다음 코드를 보자:

    function volume( l, w, h ) {
      return l * w * h;
    }
    
    var curried = curry( volume );
    
    curried( 1 )( 2 )( 3 ); // 6
    

## 면책 조항

이 포스트는 기본적으로 클로저와 `Function#apply()`와 같은 고차함수에 익숙한 것을 가정하고 작성했다. 이런 개념에 익숙하지 않다면 더 읽기 전에 다시 복습하자.

## curry 함수 작성하기

앞서 코드에서 볼 수 있듯 `curry`는 인자로 함수를 기대하기 때문에 다음과 같이 작성한다.

    function curry( fn ) {
    
    }
    

다음으로 얼마나 많은 인자가 함수에서 필요로 할지 알아야 한다. (인자의 갯수 arity 라고 부른다.) 인자의 갯수를 알기 전까지 몇 번이나 새로운 함수를 반환하고, 어느 순간에 함수 대신 값을 반환하게 될지 알 수가 없다.

함수에서 몇개의 인자를 기대하는지 `length` 프로퍼티를 통해 확인할 수 있다.

    function curry( fn ) {
      var arity = fn.length;
    }
    

이제 여기서부터 약간 복잡해진다.

기본적으로는, 매번 curry된 함수를 호출할 때마다 새로운 인자를 배열에 넣어 클로저 내에 저장해야 한다. 그 배열에 있는 인자의 수는 원래 함수에서 기대했던 인자의 수와 동일해야 하며, 그 이후 호출 가능해야 한다. 다를 때엔 새로운 함수로 반환한다.

이런 작업을 하기 위해 (1) 인자 목록을 가질 수 있는 클로저가 필요하고 (2) 전체 인자의 수를 확인할 수 있는 함수와 함께, 부분적으로 적용된 함수를 반환 또는 모든 인자가 적용된 원래의 함수에서 반환되는 값을 반환해야 한다.

여기서는 `resolver`라 불리는 함수를 즉시 실행한다.

    function curry( fn ) {
      var arity = fn.length;
    
      return (function resolver() {
    
      }());
    }
    

이제 `resolver` 함수와 함께 해야 할 첫번째 일은 지금까지 입력 받은 모든 인자를 복사하는 것이다. `Array#slice` 메소드를 이용, `arguments`의 사본을 `memory`라는 변수에 저장한다.

    function curry( fn ) {
      var arity = fn.length;
    
      return (function resolver() {
        var memory = Array.prototype.slice.call( arguments );
      }());
    }
    

다음으로 `resolver`가 함수를 반환하게 만들어야 한다. 함수 외부에서 curry된 함수를 호출하게 될 때 접근할 수 있게 되는 부분이다.

    function curry( fn ) {
      var arity = fn.length;
    
      return (function resolver() {
        var memory = Array.prototype.slice.call( arguments );
        return function() {
    
        };
      }());
    }
    

이 내부 함수가 실제로 호출이 될 때마다 인자를 받아야 한다. 또한 이 추가되는 인자를 memory에 저장해야 한다. 그러므로 먼저 `slice()`를 호출해 `memory`의 복사본을 만들자.

    function curry( fn ) {
      var arity = fn.length;
    
      return (function resolver() {
        var memory = Array.prototype.slice.call( arguments );
        return function() {
          var local = memory.slice();
        };
      }());
    }
    

이제 새로운 인자를 `Array#push`로 추가한다.

    function curry( fn ) {
      var arity = fn.length;
    
      return (function resolver() {
        var memory = Array.prototype.slice.call( arguments );
        return function() {
          var local = memory.slice();
          Array.prototype.push.apply( local, arguments );
        };
      }());
    }
    

좋다. 이제까지 받은 모든 인자를 새로운 배열에 포함하고 있으며 부분적으로 적용된 함수를 연결(chain)하고 있다.

마지막으로 할 일은 지금까지 받은 인자의 갯수를 실제로 curry된 함수의 인자 수와 맞는지 비교해야 한다. 길이가 맞다면 원래의 함수를 호출하고 그렇지 않다면 `resolver`가 또 다른 함수를 반환해 인자 수에 맞게 더 입력 받아 memory에 저장할 수 있어야 한다.

    function curry( fn ) {
      var arity = fn.length;
    
      return (function resolver() {
        var memory = Array.prototype.slice.call( arguments );
        return function() {
          var local = memory.slice();
          Array.prototype.push.apply( local, arguments );
          next = local.length >= arity ? fn : resolver;
          return next.apply( null, local );
        };
      }());
    }
    

지금까지 작성한 내용을 앞서 보여줬던 예제와 함께 순서대로 살펴보자.

    function volume( l, w, h ) {
      return l * w * h;
    }
    
    var curried = curry( volume );
    

`curried`는 `volume` 함수를 앞서 작성한 `curry` 함수에 넣은 결과가 된다.

여기서 무슨 일이 일어났는지 다시 살펴보면:

  1. `volume`의 인자 수 즉, 3을 arity에 저장했다.
  2. `resolver`를 인자 없이 바로 실행했고 그 결과 `memory` 배열은 비어 있다.
  3. `resolver`는 익명 함수를 반환했다.

여기까지 이해가 된다면 curry된 함수를 호출하고 길이를 넣어보자.

    function volume( l, w, h ) {
      return l * w * h;
    }
    
    var curried = curry( volume );
    var length = curried( 2 );
    

여기서 진행된 내용을 살펴보면 다음과 같다:

  1. 여기서 실제로 호출한 것은 `resolver`에 의해 반환된 익명 함수다.
  2. `memory`(아직은 비어 있음)를 `local`에 복사한다.
  3. 인자 (**2**)를 `local` 배열에 추가한다.
  4. `local`의 길이가 `volume`의 인자 갯수보다 적으므로, 지금까지의 인자 목록과 함께 `resolver`를 다시 호출한다. 새로운 `memory` 배열과 함께 새로 생성된 클로저는 첫번째 인자로 **2**를 포함한다.
  5. 마지막으로, `resolver`는 클로저 바깥에서 새로운 `memory` 배열에 접근할 수 있도록 새로운 함수를 반환한다.

이 과정으로 내부에 있던 익명 함수를 다시 반환한다. 하지만 이번에는 `memory` 배열은 비어 있지 않다. 앞서 입력한, 첫번째 인자인 (인자 **2**)가 내부에 있다.

앞서 만든 `length` 함수를 다시 호출한다.

    function volume( l, w, h ) {
      return l * w * h;
    }
    
    var curried = curry( volume );
    var length = curried( 2 );
    var lengthAndWidth = length( 3 );
    

  1. 여기서 호출한 것은 `resolver`에 의해 반환된 익명 함수다.
  2. `resolver`는 앞에서 입력한 인자를 포함하고 있다. 즉 배열 [ 2 ]를 복사해 `local`에 저장한다.
  3. 새로운 인자인 **3**을 `local` 배열에 저장한다.
  4. 아직도 `local`의 길이가 `volume`의 인자 갯수보다 적으므로, 지금까지의 인자 목록과 함께 `resolver`를 다시 호출한다. 그리고 이전과 동일하게 새로운 함수를 반환한다.

이제 `lengthAndWidth` 함수를 호출해 값을 얻을 차례다.

    function volume( l, w, h ) {
      return l * w * h;
    }
    
    var curried = curry( volume );
    var length = curried( 2 );
    var lengthAndWidth = length( 3 );
    
    console.log( lengthAndWidth( 4 ) ); // 24
    

여기서의 순서는 이전과 약간 다르다.

  1. 다시 여기서 호출한 함수는 `resolver`에서 반환된 익명 함수다.
  2. `resolver`는 앞에서 입력한 인자를 포함한다. 배열 [ 2, 3 ]를 복사해 `local`에 저장한다.
  3. 새로운 인자인 **4**를 `local` 배열에 저장한다.
  4. 이제 `local`의 길이가 `volume`의 인자 갯수와 동일하게 3을 반환한다. 그래서 새로운 함수를 반환하는 대신 지금까지 입력 받아서 저장해둔 모든 인자와 함께 `volume` 함수를 호출해 결과를 반환 받는다. 그 결과로 **24** 라는 값을 받게 된다.

## 정리

아직 이 커링 기법을 필수적으로 적용해야만 하는 경우를 명확하게 찾지는 못했다. 하지만 이런 방식으로 함수를 작성하는 것은 함수형 프로그래밍에 대한 이해를 향상할 수 있는 좋은 방법이고 클로저와 1급 클래스 함수와 같은 개념을 강화하는데 도움을 준다.

현재 [Project Decibel][2]에서 구인중이다. 보스턴 지역에서 이런 JavaScript 일을 하고 싶다면 [이메일][3]을 부탁한다.

그리고 이 포스트가 좋다면 [내 트위터][4]를 구독하라. 다음 한 달 중 하루는 글을 쓰기 위해 노력할 예정이다.

* * *

새로운 개념을 배워가는 과정에서 JavaScript의 새 면모를 배우게 되는 것 같아 요즘 재미있게 읽게 되는 글이 많아지고 있다. 지금 회사에서 JS를 front-end에서 제한적으로 사용하고 있는 수준이라서 아쉽다는 생각이 들 때도 많지만 이런 포스트를 통해 매일 퍼즐을 풀어가는 기분이라 아직도 배워야 할 부분이 많구나 생각하게 된다.

벌써 2015년도 반절이 지났다. 여전히 어느 것 하나 깊게 알고 있는 것이 없는 기분이라 아쉬운데 남은 한 해는 겉 알고 있는 부분을 깊이있게 접근할 수 있는 끈기를 챙길 수 있었으면 좋겠다.

 [1]: https://medium.com/@kevincennis/currying-in-javascript-c66080543528
 [2]: http://projectdecibel.com/
 [3]: mailto:kennis84@gmail.com
 [4]: https://twitter.com/kevincennis