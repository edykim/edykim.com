---
title: JavaScript 부분 어플리케이션
author: haruair
type: post
date: "2015-07-13T13:50:05"
history:
  - 
    from: https://www.haruair.com/blog/2975
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: javascript-partial-application
headline:
  - Partial Application in JavaScript 번역, 부분 어플리케이션의 개념
  - 번역
tags:
  - 개발 이야기
  - javascript
  - js
  - partial application

---
[이상한모임 슬랙 #dev-frontend 채널][1]에서 함수가 1급 시민이라는 얘기가 나온 적이 있었다. Wikipedia를 읽다가 Partial Application에 대한 이야기가 있어 검색하던 중 John Resig이 작성한 [Partial Application in JavaScript][2]를 읽게 되었다. 2008년 글이라 요즘 코드와는 조금 다른 부분이 있지만 개념을 잡기에는 충분히 도움이 되는 것 같아 번역했다.

* * *

면밀하게 보면, 부분만 사용한 함수는 함수가 실행되기 전에 미리 인자를 지정할 수 있는, 흥미로운 기법이다. 이와 같은 효과로 부분만 반영된 함수는 호출할 수 있는 새로운 함수를 반환한다. 다음 예제를 통해 이해할 수 있다:

    String.prototype.csv = String.prototype.split.partial(/,\s*/);
    var results = "John, Resig, Boston".csv();
    alert( (results[1] == "Resig") + " The text values were split properly." );
    

위에서는 일반적으로 사용하는 String의 `.split()` 메소드에 인자로 미리 정규표현식을 저장하는 경우다. 그 결과로 만들어진 새로운 함수 `.csv()`를 쉼표로 분리된 값을 배열로 변환하는데 사용할 수 있다. 함수 인자를 앞에서부터 필요한 만큼 채우고 새로운 함수를 리턴하는 방식을, 일반적으로 커링(currying)이라 부른다. 간단하게 커링은 어떻게 구현되는지 다음 프로토타입 라이브러리에서 확인할 수 있다:

    Function.prototype.curry = function() {
      var fn = this, args = Array.prototype.slice.call(arguments);
      return function() {
        return fn.apply(this, args.concat(
          Array.prototype.slice.call(arguments)));
      };
    };
    

상태를 기억하기 위해 클로저(closure)를 사용한 좋은 케이스다. 이 경우에 미리 입력한 인수(`args`)를 저장하기 위해서 새로 만들어지는 함수에 전달되었다. 새로운 함수는 인수가 미리 입력되게 되고 새로운 인수도 하나로 합쳐져(concat) 전달된다. 그 결과, 이 메소드는 인수를 미리 입력할 수 있게 되고 활용 가능한 새 함수를 반환하게 된다.

이제 이 스타일의 부분 어플리케이션은 완전 유용하지만 더 좋게 만들 수 있다. 만약 주어진 함수에서 단순히 앞에서부터 인수를 입력할 것이 아니라 비어있는 모든 인수를 채우기 원한다면 어떻게 해야할까. 다음과 같은 형태의 부분 어플리케이션 구현은 다른 언어에도 존재하지만 JS에서는 Oliver Steele가 `Function.js` 라이브러리에서 시연했다. 다음 구현을 살펴보자:

    Function.prototype.partial = function (){
      var fn = this, args = Array.prototype.slice.call(arguments);
      return function(){
        var arg = 0;
        for ( var i = 0; i < args.length && arg < arguments.length; i++)
          if ( args[i] === undefined )
            args[i] = arguments[arg++];
        return fn.apply(this, args);
      }
    }
    

이 구현은 근본적으로 `curry()` 메소드와 비슷하지만 중요한 차이점이 존재한다. 특히 이 함수가 호출될 때, 미리 입력하고 싶지 않은 인수에 대해 `undefined`를 입력하는 것으로 나중에 입력하도록 만들 수 있다. 이 방식의 구현은 인수를 병합하는데 더 편리하게 활용할 수 있게 돕는다. 인수를 배정하는 과정에서 비어있는 곳에 적절한 간격으로 처리해 나중에 실행할 때 조각을 맞출 수 있게 만든다.

위에서 문자열 분리 함수를 생성하는데 사용한 예에도 있지만 다른 방식에서 어떻게 새 함수 기능을 활용할 수 있는지 확인하자. 함수를 간단하게 지연해서 실행하도록 하는 함수를 생성할 수 있다.

    var delay = setTimeout.partial(undefined, 10);
    delay(function(){
      alert( "A call to this function will be temporarily delayed." );
    });
    

`delay`라는 이름의 새로운 함수를 만들었다. 언제든 함수를 인자로 넣으면 10ms 후에 비동기적으로 실행하게 된다.

이벤트를 연결(binding) 하기 위한, 간단한 함수를 만들 수 있다:

    var bindClick = document.body.addEventListener
                      .partial('click', undefined, false);
    
    bindClick(function() {
      alert( "Click event bound via curried function." );
    });
    

이 기법은 라이브러리에서 이벤트를 연결하기 위해 사용하는, 간단한 헬퍼 메소드로 사용할 수 있다. 이 결과로 단순한 API를 제공해 최종 사용자가 불필요한 인수로 인해 번거롭게 되는 경우를 줄이고 단일 함수를 호출하는 횟수를 줄일 수 있다.

클로저를 사용하면 결과적으로 코드에서의 복잡도를 쉽고 간단하게 줄일 수 있어서 JavaScript 함수형 프로그래밍의 강력함을 확인하게 된다.

 [1]: https://weirdmeetup.slack.com/messages/dev-frontend/
 [2]: http://ejohn.org/blog/partial-functions-in-javascript/