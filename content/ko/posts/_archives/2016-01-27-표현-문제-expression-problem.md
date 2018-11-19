---
title: 표현 문제 (Expression problem)
author: haruair
type: post
date: 2016-01-26T23:06:00+00:00
history:
  - 
    from: https://www.haruair.com/blog/3338
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: expression-problem
categories:
  - 개발 이야기
  - 번역
tags:
  - fp
  - oop

---
상속에 관한 포스트를 읽다가 레퍼런스로 c2의 [Expression Problem][1] 페이지를 보게 되었는데 내용이 좋아 짧게 번역했다. 원문은 wiki로 작성되어 있으므로 자세한 내용이 궁금하다면 해당 페이지를 참고하자.

* * *

&#8220;표현 문제(Expression problem)&#8221;는 객체지향 프로그래밍과 함수형 프로그래밍 모두에서 정확하게 설명하기 어려운 쌍대문제(dual problem)다.

기본 문제는 간단한 예제로 설명할 수 있다. 사각형과 원을 포함한 모양을 표현하는 것과 그 크기를 구하는 것을 원한다.

함수형 프로그래밍에서는 다음 같은 데이터 타입으로 묘사할 수 있다.

```haskell
type Shape = Squre of side
           | Circle of radius
```

그리고 크기를 구하는 area 함수를 다음처럼 하나 작성할 수 있다:

```haskell
define area = fun x -> case x of
  Squre of side => (side * side)
| Circle of radius => (3.14 * radius * radius)
```

객체지향 프로그래밍에서는 다음과 같이 작성할 수 있다.

    class Shape <: Object
      virtual fun area : () -> double
    
    class Square <: Shape
      side : double
      area() = side * side
    
    class Circle <: Shape
      radius : double
      area() = 3.14 * radius * radius
    

&#8220;표현 문제&#8221; 선언은 위와 같은 개체 또는 함수를 &#8216;확장&#8217;하려 할 때 발생한다.

  * 삼각형을 위해 `triangle` 모양을 추가하면, 
      * 객체지향 프로그래밍의 접근 방식이 간편 (새 클래스를 추가하는 것으로 단순하게 해결)
      * 함수형 프로그래밍에서는 어려움 (area를 포함해 Shape를 받는 모든 함수를 수정해야 함)
  * 반면, 둘레를 측정하는 `perimeter` 함수를 추가할 때, 
      * 함수형 프로그래밍에서는 쉬움 (새 함수 `perimeter`를 추가하면 끝)
      * 객체지향 프로그래밍에서는 어려움 (인터페이스가 변경되면 모든 클래스에 `perimeter()`를 작성해야 함)

이것이 표현 문제의 핵심이다. 표현 문제는 일반적으로 횡단 관심(cross-cutting concerns, 쉽게 사용하기 위해 모듈을 분리했을 때 그 모듈로 작성하기 어려운 요구사항이 발생하는 것)이라는 큰 문제 집합에서의 특정적인 예시에 해당한다. (여기서 횡단 관심은 여러 &#8220;모양의 집합&#8221;과 &#8220;모양의 기능&#8221;에서 발생한다.) 많은 언어에는 이런 표현 문제를 해결하기 위한 디자인을 포함한다. 열린 함수(새로운 패턴 매치를 추가할 수 있는 함수), 열린 데이터 타입(새로운 패턴으로 확장 가능한 데이터 타입), 멀티 메소드(&#8216;열린&#8217; 클래스에서 &#8216;열린&#8217; 특징을 갖는 다형적 함수), 서술 호출(Predicate dispatch), 그 외에도 이 문제를 해결하기 위한 많은 접근 방식이 있다.

더 일반적인 해결책으로 관심사의 분리(Separation of concerns)도 적용 가능하다.

 [1]: http://c2.com/cgi/wiki?ExpressionProblem