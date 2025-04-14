---
title: Lodash의 지연 평가 소개 by Filip Zawada
author: haruair
uuid: "5f96ab63-0ad3-4139-be4b-4bb8a033a848"
type: post
date: "2015-07-18T12:47:45"
history:
  - 
    from: https://www.haruair.com/blog/2983
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: introduction-to-lodashs-delay-evaluation-by-filip-zawada
headline:
  - Lodash가 100배 빨라진 비결, 지연평가 적용에 대한 소개 포스트 번역
tags:
  - 번역
  - 개발 이야기
  - lazy evaluation
  - lodash

---
[이상한모임 슬랙 #dev-frontend 채널][1]에서 Lodash에 대해 이야기하다 지연 평가(Lazy Evaluation)를 지원한다는 이야기를 듣고 검색하게 되었다. 검색 결과로 찾은, Filip Zawada의 [How to Speed Up Lo-Dash ×100? Introducing Lazy Evaluation][2] 포스트를 번역한 글이다.

지연평가는 필요할 때만 수행하는 평가 방식으로 함수형 프로그래밍에서는 널리 사용되는 방법이다. 이 글은 lodash 뿐만 아니라 지연평가가 어떤 방식으로 접근하고 동작하는가에 대해 쉽게 설명하고 있다.

* * *

Lo-Dash와 같은 라이브러리는 더이상 빨라질 수 없을 정도로 충분히 빠르다고 항상 생각했다. Lo-Dash는 자바스크립트를 짜내다시피 해 [다양한 기술][3]을 완벽하게 잘 섞었다. 이 라이브러리는 JavaScript의 가장 빠른 문장, 적응형 알고리즘을 위해 사용하며 때로는 부수적으로 발생하는 예기치 못한 재귀를 피하기 위해 성능을 측정할 때에도 사용한다.

## 지연 평가 Lazy Evaluation

하지만 내가 잘못 생각했다. Lodash는 획기적으로 빨라지는 것이 가능했다. 이 일에 필요한 것은 미세한 최적화에 대한 생각을 멈추고 올바른 알고리즘을 사용하고 있는지 살피는 것으로 시작해야 한다. 예를 들면, 일반적인 반복문에서 반복에 걸리는 단위 시간을 최적화하려 한다:

    var len = getLength();
    for(var i = 0; i < len; i++) {
        operation(); // <- 10ms - 어떻게 9ms로 만들 수 있을까?!
    }
    

이런 경우는 대부분 어렵고 매우 제한적이다. 때로는 `getLength()`를 최적화 하는 것이 더 의미있다. 이 함수가 반환하는 값이 작을수록, `10ms` 주기는 짧아진다.

다음 코드는 간략하게 작성한 Lodash에서 지연평가를 하는 방식이다. 이 방법은 주기의 횟수를 줄이는 것이지 주기에 걸리는 시간을 줄이는 것이 아니다. 다음 예를 고려해보자:

    function priceLt(x) {
       return function(item) { return item.price < x; };
    }
    var gems = [
       { name: 'Sunstone', price: 4 }, { name: 'Amethyst', price: 15 },
       { name: 'Prehnite', price: 20}, { name: 'Sugilite', price: 7  },
       { name: 'Diopside', price: 3 }, { name: 'Feldspar', price: 13 },
       { name: 'Dioptase', price: 2 }, { name: 'Sapphire', price: 20 }
    ];
    
    var chosen = _(gems).filter(priceLt(10)).take(3).value();
    

$10보다 작은 가격의 보석 3개를 고르려고 한다. 일반적인 Lodash 접근인 엄격한 평가에서는 8개의 보석을 모두 걸러낸 후 앞 3개를 골라낸다:

<img src="https://farm1.staticflickr.com/546/19798213575_6b7b069dff_o.gif?w=660&#038;ssl=1" alt="Lodash naïve approach" data-recalc-dims="1" />

충분히 쿨하지 않다. 이 방식은 8개의 모든 요소를 처리하지만 사실 필요로 하는 것은 그 중 5개 뿐이다. 지연 평가 알고리즘에서는 이 방식과 대조적으로, 배열에서 적은 숫자의 요소를 가져와 올바른 결과를 얻는다. 다음을 살펴보자:

<img src="https://farm1.staticflickr.com/499/19802991361_f410fb2ae6_o.gif?w=660&#038;ssl=1" alt="Lo-Dash regular approach" data-recalc-dims="1" />

이 방식으로 쉽게 37.5% 성능 향상을 만들었다. 이는 단순한 예시이며 사실 1000+배 성능 향상이 있는 예도 들 수 있다. 다음을 보자:

    var phoneNumbers = [5554445555, 1424445656, 5554443333, … ×99,999];
    
    // "55"가 포함된 전화번호 100개를 획득
    function contains55(str) {
        return str.contains("55");
    };
    
    var r = _(phoneNumbers).map(String).filter(contains55).take(100);
    

이 예제에서 99,999개의 요소를 검사하게 되는데, 이 모두를 다 실행하지 않고 예를 들어 1,000개의 요소만 검사해도 결과를 얻을 수 있게 된다. [벤치마크][4]에서 이 엄청난 성능 향상을 확인할 수 있다:

<img src="https://farm1.staticflickr.com/364/19175603254_2f9dd00382_o.jpg?w=660&#038;ssl=1" alt="benchmark" data-recalc-dims="1" />

## 파이프라이닝

지연 평가에 또 다른 잇점이 있는데 &#8220;파이프라이닝&#8221; 이라고 부른다. 이 아이디어는 체인으로 실행되는 동안 값이 전달되기 위해 배열이 생성되는 경우를 회피한다는 점이다. 모든 동작은 하나의 요소에 한번에 실행되야 한다. 다음 코드를 보면:

    var result = _(source).map(func1).map(func2).map(func3).value();
    

간단하게 Lo-Dash가 어떻게 해석하는지 작성하면 다음과 같다. (엄격한 평가)

    var result = [], temp1 = [], temp2 = [], temp3 = [];
    
    for(var i = 0; i < source.length; i++) {
       temp1[i] = func1(source[i]);
    }
    
    for(i = 0; i < source.length; i++) {
       temp2[i] = func2(temp1[i]);
    }
    
    for(i = 0; i < source.length; i++) {
       temp3[i] = func3(temp2[i]);
    }
    result = temp3;
    

반면 지연 평가에서는 다음과 같이 실행된다:

    var result = [];
    for(var i = 0; i < source.length; i++) {
       result[i] = func3(func2(func1(source[i])));
    }
    

임시 배열이 존재하지 않는다는 점은 극적인 성능 향상을 가져온다. 특히 배열이 크고 메모리 접근이 비싼 경우에서는 말이다.

## 유예 실행 Deferred execution

지연 평가가 가져온 또 다른 잇점은 유예 실행이다. 체인을 만들게 되면 언제나 .value()를 명시적으로나 암시적으로 호출하기 전까지는 연산되지 않는다. 이 접근은 쿼리를 먼저 준비하게 하고 나중에 실행하게 해 가장 최신의 데이터를 얻게 된다.

    var wallet = _(assets).filter(ownedBy('me'))
                          .pluck('value')
                          .reduce(sum);
    
    $json.get("/new/assets").success(function(data) {
        assets.push.apply(assets, data); // update assets
        wallet.value(); // returns most up-to-date value
    });
    

이와 같은 방식은 몇가지 경우에서 또한 속도 향상을 가져온다. 실행 속도가 중요한 경우에 복잡한 쿼리를 일찍 만든 후 나중에 실행할 수 있게 된다.

## 정리

지연 평가는 새로운 아이디어가 아니다. 이미 [LINQ][5], [Lazy.js][6] 등 여러 뛰어난 라이브러리에서 사용하고 있다. 내가 믿기에 Lo-Dash가 만든 큰 차이는 Underscore API를 그대로 유지하면서도 새롭고 강력한 내부의 엔진을 얻게 되었다는 사실이다. 새로운 라이브러리를 배울 필요도, 작성한 코드를 크게 변경할 필요도 없이 라이브러리를 업그레이드하면 된다.

Lo-Dash를 사용하지 않더라도 이 글이 영감을 줬기를 바란다. 자신의 어플리케이션에서 병목을 찾아 jsperf.com의 try/fail 스타일의 최적화는 그만 할 때도 되었다. 대신 나가서 커피를 마시며 알고리즘에 대해 생각해야 할 때다. 창의성이 중요하지만 [알고리즘 개론][7]와 같은 좋은 책으로 배경지식을 다지는 것도 좋다. 행운을 빈다!

* * *

번역에 피드백 주신 [Heejoon Lee][8]님 감사드립니다.

 [1]: http://blog.weirdx.io/about/
 [2]: http://filimanjaro.com/blog/2014/introducing-lazy-evaluation/
 [3]: https://www.youtube.com/watch?v=NthmeLEhDDM
 [4]: http://jsperf.com/lazy-demo
 [5]: https://en.wikipedia.org/wiki/Language_Integrated_Query
 [6]: http://danieltao.com/lazy.js/
 [7]: http://mitpress.mit.edu/books/introduction-algorithms
 [8]: https://twitter.com/galadbran