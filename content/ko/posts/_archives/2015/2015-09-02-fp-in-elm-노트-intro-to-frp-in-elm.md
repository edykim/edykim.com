---
title: FP in Elm 노트 – Intro to FRP in Elm
author: haruair
type: post
date: "2015-09-01T23:14:56"
history:
  - 
    from: https://www.haruair.com/blog/3039
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: fp-in-elm-notes-intro-to-frp-in-elm
tags:
  - 공부
  - 개발 이야기
  - elm
  - fp
  - fp in elm

---
FP in Elm의 week 1-2 Intro to FRP in Elm 정리 포스트다.

  * [FP in Elm 전체 노트 정리 보기][1]

* * *

## [Introduction to FRP in Elm][2]

JS 이벤트 리스너 코드 예제를 보여주면서 `IsDown`같은 변수를 만들어 상태를 저장해야 하는 부분, 콜백으로 지정하는 복잡성 등에 얘기하며 FRP에서는 더 쉽게(?) 할 수 있다고 이야기.

### Signal이란

&#8220;시그널은 시간에 따라 변동되는 값&#8221; 원시적 시그널은 `Signal Bool`을 반환.

함수형 프로그래밍 블럭을 만들어서 시그널을 추상화하거나 합성할 수 있음.

    Signal.map : (a -> b) -> Signal a -> Signal b
    isUp = Signal.map (fun curValIsDown -> not curValIsDown) Mouse.isDown
    -- or,
    isUp = Signal.map not Mouse.isDown
    

이제 `Mouse.isDown` 시그널이 업데이트 되면 자동으로 반영됨.

`Signal.map`과 같이 함수를 각각에 맵핑하는 것은 다른 데이터에서도 많이 사용. `List.map`, `String.map`, `Maybe.map`, `Dict.map`, etc.

### HTML로 렌더링하기

`main`에 정의하는 것으로 HTML을 렌더링 할 수 있음. `Graphics.Element`

elm-repl을 사용할 수 없으므로 `elm-make`, [온라인 에디터][3]를 활용, 또는 로컬 환경을 활용.

`Text.plainText`는 최근 버전에서 삭제되서 구버전을 설치하거나 changelog를 참고해야 한다. 아래는 `[Text](http://package.elm-lang.org/packages/elm-lang/core/2.1.0/Text)` 를 참고했다.

    import Text exposing (fromString)
    import Graphics.Element (Element, leftAligned)
    
    plainText = leftAligned << fromString
    
    main : Element
    main = plainText "Hello World!"
    

`Text.fromString`은 `String`을 `Text`로 변환하고 `Graphics.Element.leftAligned`는 `Text`를 `Element`로 변환해준다. 코드에서 필요한 함수를 import 한 것도 확인할 수 있다.

실제로 `main`은 `Signal`의 `Element`로 정의되어 있다. 위와 같이 다른 Element는 `Signal.constant`를 이용해 `Signal`로 변환된다.

    Signal.constant : a -> Signal a
    

위 예제를 더 명시적으로 작성하면 다음과 같다.

    main : Signal Element
    main = Signal.constant(plainText "Hello World!")
    

위 내용으로 작성한 예제.

    import Text exposing (fromString)
    import Graphics.Element exposing (Element, leftAligned)
    import Mouse
    import Signal
    
    plainText = leftAligned << fromString
    isUp = Signal.map not Mouse.isDown
    
    main : Signal Element
    main = Signal.map (\b -> plainText(toString b)) isUp
    

#### `import`에 대해

매번 쓸 때마다 앞 코드처럼 map하지 말고 다른 모듈로 만들어서 재활용하라는 이야기.

#### 함수 합성에 대해

다음은 함수를 합성하는 여러 방법. 취향에 맞게 선택을 하라는데 가장 마지막 방식이 많이 쓰는 모양.

    (\b -> b |> toString |> plainText)
    (toString >> plainText)
    (\b -> plainText <| toString <| b)
    (plainText << toString)
    

### Folding From the Past

클릭 횟수를 보여주는 페이지를 만들려고 함. 이런 signal은 내장되어 있지 않은데 다음과 같이 모조 유닛 `()`으로 된 이벤트를 정의할 수 있음.

    Mouse.clicks : Signal ()
    

#### 기본 MVC 아키텍쳐

    -- Model
    type alias State = Int
    
    initState : State
    initState = 0
    

`alias`는 새 타입 정의 없이 Int와 동일한 역할을 하는 `State`를 만들어줌. abbr 만들 때도 쓸 수 있고.

    -- View
    view : State -> Element
    view s = asText s
    -- 더 간결하게
    view = asText
    

`asText`는 `Text`의 `asText`에서 `Graphics.Element`의 `show`로 [변경][4]됨.

컨트롤러는 시그널이 갱신되었을 때, 상태를 변형하거나 렌더링하는 함수를 시그널과 연결해주는 역할을 한다. 타입 a는 전체 값, 타입 b는 초기값, 마지막 타입 b는 최종 상태값이 된다.

    Signal.foldp : (a -> b -> b) -> b -> Signal a -> Signal b
    
    List.foldl : (a -> b -> b) -> b -> List a -> b
    List.foldr : (a -> b -> b) -> b -> List a -> b
    

folding from the past 는 from the left라는 말이고 from the future는 from the right이 된다. 시그널은 folding from the past로 호출한다.

    step : a -> State -> State
    step _ i = i + 1
    
    main : Signal Element
    main =
      Signal.map view (Signal.foldp step initState Mouse.clicks)
    

다른 예제는 [여기][5].

    main = Signal.map VIEW (Signal.foldp UPDATE INIT_STATE BASE_SIGNAL)
    -- so,
    main = Signal.map view (Signal.foldp step initState (Time.every Time.second))
    

#### 잠깐만

맨 처음 예로 든 JS와 달리 부수적인 부분은 다 컴파일러가 알아서 함.

### JavaScript로의 컴파일링

원초적인 이벤트는 앞서 구현한 JS에서와 같이 다뤄짐. 하지만 elm이 Signal Graph로 처리해 순수 함수 형태로 정의된 Signal을 사용할 수 있게 함.

각각의 기능이 순수한 함수 형태로 다른 함수에 영향을 주지 않아 전체를 컴파일 할 필요가 없어짐. 이런 접근 방식은 함수형 언어 컴파일러 최적화와 관련되어 중요한 개념 중 하나.

### 2D 그래픽

[Graphics.Element][6], [Graphics.Collage][7] 공부할 것.

### 읽을 거리

#### 필수

  * 라이브러리 `Signal`, `Graphics.Element`, `Graphics.Collage`

Signal에 정의된 (<~)는 위에서 정의한 isUp을 간편하게 정의하는데 유용함.

    isUp = not <~ Mouse.isDown
    -- `Mouse.isDown` 시그널을 `not` 함수를 통해 전달
    

#### 추천

  * [Elm 예제들][8]
  * [표준 라이브러리][9]

#### 심화

  * [Elm: Concurrent FRP for Functional GUIs][10]
  * [Asynchronous Functional Reactive Programming for GUIs][11] by [Stephen Chong][12]

 [1]: http://haruair.com/frp-in-elm
 [2]: https://www.classes.cs.uchicago.edu/current/22300-1/lectures/IntroFRP.html
 [3]: http://elm-lang.org/try
 [4]: https://github.com/elm-lang/core/blob/master/changelog.md#015
 [5]: https://www.classes.cs.uchicago.edu/current/22300-1/public-code/IntroFRP.elm
 [6]: http://package.elm-lang.org/packages/elm-lang/core/2.1.0/Graphics-Element
 [7]: http://package.elm-lang.org/packages/elm-lang/core/2.1.0/Graphics-Collage
 [8]: http://elm-lang.org/examples
 [9]: http://package.elm-lang.org/packages/elm-lang/core/2.1.0
 [10]: http://elm-lang.org/papers/concurrent-frp.pdf
 [11]: http://people.seas.harvard.edu/~chong/pubs/pldi13-elm.pdf
 [12]: http://people.seas.harvard.edu/~chong/