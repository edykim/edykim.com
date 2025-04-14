---
title: FP in Elm 노트 – Intro to ML in Elm
author: haruair
uuid: "6ad19755-cdd3-46e3-807a-ac6e2704eb26"
type: post
date: "2015-08-25T14:36:23"
history:
  - 
    from: https://www.haruair.com/blog/3034
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: fp-in-elm-notes-intro-to-ml-in-elm
tags:
  - 공부
  - 개발 이야기
  - elm
  - fp
  - fp in elm

---
FP in Elm의 week 1-1-2 Intro to ML in Elm 정리 포스트다.

  * [FP in Elm 전체 노트 정리 보기][1]

* * *

## [Introduction to ML in Elm][2]

Elm은 웹사이트에서 받아 설치한다. REPL로 진행한다.

    $ elm-repl
    Elm REPL 0.4.2 (Elm Platform 0.15.1)
      See usage examples at <https://github.com/elm-lang/elm-repl>
      Type :help for help, :exit to exit
    > True
    True : Bool
    > False
    False : Bool
    > 'a'
    'a' : Char
    > "abc"
    "abc" : String
    > 3.0
    3 : Float
    

`number`는 `Int`와 `Float` 모두를 의미. 타입 검사기가 알아서 선택.

    > 3
    3 : number
    > truncate 3
    3 : Int
    > truncate 3.0
    3 : Int
    

`number`가 하스켈에서 type 클래스로 미리 정의한 것처럼 보이지만 Elm엔 일반적으로 타입 클래스 지원이 없음. 이 `number`는 몇가지 특별한 용도로 사용할 수 있는 클래스 중 하나.

### Tuples

두번째 튜플에서 &#8216;가 여러개 붙는 이유는 모르겠다. 타입이 달라질 수 있어서 그런 것 같기도. 튜플에 컴포넌트가 하나면 튜플이 아닌 것으로 취급.

    > (True, False)
    (True,False) : ( Bool, Bool )
    > (1,2,3,4.0)
    (1,2,3,4) : ( number, number', number'', Float )
    
    > ("Leave me alone!")
    "Leave me alone!" : String
    > (("Leave me alone!"))
    "Leave me alone!" : String
    

### Functions

인자 하나, 반환값 하나를 갖는 함수:

    > exclaim = \s -> s ++ "!"
    <function> : String -> String
    > exclaim s = s ++ "!"
    <function> : String -> String
    > exclaim "HI"
    "HI!" : String
    

uncurried/curried 스타일 다인자 함수:

    > plus (x, y) = x + y
    <function> : ( number, number ) -> number
    > plus = \(x, y) -> x + y
    <function> : ( number, number ) -> number
    > plus xy = fst xy + snd xy
    <function> : ( number, number ) -> number
    
    > plus x y = x + y
    <function> : number -> number -> number
    > plus x = \y -> x + y
    <function> : number -> number -> number
    > plus = \x -> \y -> x + y
    <function> : number -> number -> number
    

curried 함수를 활용한 부분 애플리케이션:

    > plus3 = plus 3
    <function> : number -> number
    > plus3 5
    8 : number
    > plus3 3.0
    6 : Float
    

`number` 타입 캐스팅을 어떻게 할 것인가. `number -> Int`는 만들 수 없지만 어짜피 `number`는 Int가 필요할 때 자동으로 변하니 그냥 작성.

    > toInt n = n // 1
    <function> : Int -> Int
    > plusInt x y = (toInt x) + y
    <function> : Int -> Int -> Int
    > plusInt x y = (toInt x  + y)
    <function> : Int -> Int -> Int
    

### 타입 어노테이션 Type Annotations

대부분의 ML 방언과 같이 자동으로 처리하지만 최상위 레벨에서 수동으로 지정해야 좋은 경우도 있음. 예제 [IntroML.elm][3] 참조.

    plus : number -> number -> number
    plus x y = x + y
    
    plusInt : Int -> Int -> Int
    plusInt x y = x + y
    
    plusInt : Int -> Int -> Int
    plusInt = plus
    

앞에서 `toInt` 쓴 것과 달리 `plusInt`에서 명시적으로 어노테이션을 지정하고 위처럼 쓸 수 있음. 클라이언트에게 공개되는 API보다 더 범용적인 코드를 구현하는 것을 강조.

### 모듈 불러오기 Importing Modules

앞서 [IntroML.elm][3]을 받는다. `exposing`을 사용하게 변경되었다. `(..)`은 모듈 내 모든 함수를 노출하게 된다. 모듈을 약어로 부를 때는 `as` 키워드를 사용한다.

    > import IntroML
    > IntroML.plusInt 2 3
    5 : Int
    > import IntroML exposing (plusInt)
    > plusInt 2 3
    5 : Int
    > import IntroML exposing (..)
    > exclaim "Awesome"
    "Awesome!" : String
    > import IntroML as M
    > m.plusInt 2 3
    5 : Int
    

`Basics`, `Maybe` 등이 포함된 [일반 라이브러리][4]는 기본으로 불러오게 됨.

### 조건문

    > if 1 == 1 then "Yes" else "No"
    "Yes" : String
    > if False then 1.0 else 1
    1 : Float
    > if | 1 == 1 -> 1.0 \
    |    | 1 == 2 -> 1
    1 : Float
    > if | 1 == 1     -> 1.0 \
    |    | otherwise  -> 1
    1 : Float
    

otherwise는 `True : Bool`. 다중조건문 multi-way-if는 조건 중 참으로 평가되는 경우가 없으면 런타임 에러가 발생. 실행되지 않을 조건이 있다면? 닿지 않는 코드는 평가도 하지 않음. 다중조건문에서 줄 맞추는 것 잊지 말 것.

### 다형성 타입 Polymorphic Types

타입변수는 소문자로 시작하거나 한글자로 지정되는 경우가 많음.

    > choose b x y = if b then x else y
    <function> : Bool -> a -> a -> a
    > choose True True False
    True : Bool
    > choose True "a" "b"
    "a" : String
    > choose True 1.0 2.0
    1 : Float
    > choose True 1 2
    1 : number
    > choose True 1 2.0
    1 : Float
    

만약 다음과 같이 타입 어노테이션을 지정한다면 다형성 타입이지만 타입을 강제할 수 있음.

    choose : Bool -> number -> number -> number
    

[Basics][5]에서 작성된 비교 연산자에는 `comparable` 이라는 특수 목적의 타입 변수가 존재함.

    > (<)
    <function> : comparable -> comparable -> Bool
    > 1 < 2
    True : Bool
    > 1 < 2.0
    True : Bool
    > "a" < "ab"
    True : Bool
    > (2, 1) < (1, 2)
    False : Bool
    > (1 // 1) < 2.0 -- 타입 불일치
    > True < False -- 타입 불일치
    

### 딴짓: 버그잡기

버그가 이미 잡혀서 내용 결과가 다름. 딴짓 실패.

버그를 찾으면 [메일링 리스트][6]에서 검색하고 버그 리포트를 남기자는 이야기.

## 리스트

cons 연산자는 코스에선 제안된 기능인데 이미 반영되서 import 할 필요 없음. 제안 기능은 불러와서 쓸 수 있는 모양. (::)는 OCaml 문법 , 는 하스켈 문법이라고.

    > 1::2::3::4::[]
    [1,2,3,4] : List number
    > [1,2,3,4]
    [1,2,3,4] : List number
    > [1..6]
    [1,2,3,4,5,6] : List number
    > [1.0..6.0]
    [1,2,3,4,5,6] : List Float
    

하스켈은 String이 List Char인데 여긴 아니라고.

    > ['a','b','c']
    ['a','b','c'] : List Char
    > "abc"
    "abc" : String
    > ['a','b','c'] == "abc" -- 타입 불일치
    

`case` 한줄로 쓰기. (갑자기 난이도 점프를 시도한 느낌.)

    > len xs = case xs of {_::xs -> 1 + len xs; [] -> 0}
    > len [1..10]
    10 : number
    > len ['a', 'b', 'c']
    3 : number
    

글자 수를 세는 len이라는 함수를 정의했다. 리스트를 `xs`로 받아서 리스트 가장 앞에 녀석을 하나 빼 글자수 1을 더하고 나머지 `xs`를 다시 `len` 함수에 보내 계속 글자 수를 알아낸다. 계속 반복해서 빈 리스트 `[]`가 되면 0을 반환해 전체 글자 수를 얻게 된다!

이 `case`가 모든 결과를 처리하지 못하면 완전하지 않은 패턴이 발견되었다고 런타임 에러가 발생한다. 다중 case문에서는 두번째 줄부터 맨 앞에 공백을 넣어야 한다.

    > hd xs = case xs of \
    |   x::_ -> x
    <function> : List a -> a
    > hd [2]
    2 : number
    > hd []
    Error: Runtime error in module Repl (between lines 4 and 5)
    Non-exhaustive pattern match in case-expression.
    Make sure your patterns cover every case!
    

### 고차함수

    > import List exposing (filter, map, foldr, foldl)
    > filter
    <function> : (a -> Bool) -> List a -> List a
    > filter (\x -> x `rem` 2 == 0) [1..10]
    [2,4,6,8,10] : List Int
    > map
    <function> : (a -> b) -> List a -> List b
    > map(\x -> x ^ 2) [1..10]
    [1,4,9,16,25,36,49,64,81,100] : List number
    > foldr
    <function: foldr> : (a -> b -> b) -> b -> List a -> b
    > foldr (\x acc -> x :: acc) [] [1..10]
    [1,2,3,4,5,6,7,8,9,10] : List number
    > foldl
    <function: foldl> : (a -> b -> b) -> b -> List a -> b
    > foldl (\x acc -> x :: acc) [] [1..10]
    [10,9,8,7,6,5,4,3,2,1] : List number
    

(::)도 함수라서 다음처럼 가능.

    > (::)
    <function> : a -> List a -> List a
    > foldl (\x acc -> (::) x acc) [] [1..10] -- eta-expanded version
    [10,9,8,7,6,5,4,3,2,1] : List number
    > foldl (::) [] [1..10] -- eta-reduced version
    [10,9,8,7,6,5,4,3,2,1] : List number
    

### 데이터타입

리스트는 귀납형 데이터 타입이라 직접 데이터 타입을 정의 할 수 있음. (enum 같은 느낌.) 값을 가지지 않을 수도, 가질 수도 있음.

    > type Diet = Herb | Carn | Omni | Other String
    > Carn
    Carn : Repl.Diet
    > Omni
    Omni : Repl.Diet
    > Other "Lactose"
    Other "Lactose" : Repl.Diet
    > Other -- Non-nullary data constructor는 그 자체로 함수
    <function> : String -> Repl.Diet
    > diets = [Herb, Omni, Omni, Other "Lactose"]
    [Herb,Omni,Omni,Other "Lactose"] : List Repl.Diet
    

패턴매칭에 유용. 결과가 나오지 않는 case를 작성하지 않도록 주의.

    > isHerb d = case d of \
    |   Herb -> True \
    |   _    -> False
    <function> : Repl.Diet -> Bool
    > List.map isHerb diets
    [True,False,False,False] : List Bool
    

### 에러를 위한 타입

앞에서 작성한 `hd` 함수는 빈 리스트를 넣었을 때 런타임 에러가 발생하고 실패함. 에러를 위한 타입을 만들어서 의미있는 결과를 받도록 처리.

    > type MaybeInt = YesInt Int | NoInt
    > hd xs = case xs of \
    |   x::xs' -> YesInt x \
    |   []     -> NoInt
    <function> : List Int -> Repl.MaybeInt
    > hd [1..4]
    YesInt 1 : Repl.MaybeInt
    > hd []
    NoInt : Repl.MaybeInt
    

다형성 타입으로 바꾸면,

    > type MaybeData a = YesData a | NoData
    > hd xs = case xs of \
    |   x::_ -> YesData x\
    |   []   -> NoData
    <function> : List a -> Repl.MaybeData a
    > hd [1]
    YesData 1 : Repl.MaybeData number
    > hd ['a','b','c']
    YesData 'a' : Repl.MaybeData Char
    > hd []
    NoData : Repl.MaybeData a
    

이 방식은 MaybeData 패턴으로 엄청 일반적이고 `Maybe`라는 [라이브러리][7]도 포함되어 있음.

    > type Maybe a = Just a | Nothing
    > hd xs = case xs of \
    |   x::_ -> Just x \
    |   []   -> Nothing
    <function> : List a -> Repl.Maybe a
    

Maybe 패턴을 활용한 Result 가 제공되고 있음. 다음은 예시에서의 코드.

    errHead : List a -> Result String a
    errHead xs = case xs of
      x::_ -> Ok x
      []   -> Err "errHead: expects non-empty list"
    

저장해서 불러오면 다음과 같은 결과.

    > import MaybeStudy exposing (errHead)
    > errHead ["What", "WHhooo"]
    Ok "What" : Result.Result String String
    > errHead []
    Err ("errHead: expects non-empty list") : Result.Result String a
    

### 이항 연산자 infix Operators

(<|), (|>), (<<), (>>)를 [Basics][5] 문서에서 찾아보라고.

(<|)는 괄호를 입력해야 하는 번거로움을 줄여준다.

    leftAligned (monospace (fromString "code"))
    leftAligned << monospace <| fromString "code"
    

(|>)도 괄호를 줄여주고 역순으로 입력하기 때문에 이해하기 더 쉬운 코드가 된다.

    scale 2 (move (10,10) (filled blue (ngon 5 30)))
    ngon 5 30
      |> filled blue
      |> move (10,10)
      |> scale 2
    

위 둘은 괄호를 회피하는 것 이외에도 앞서 함수의 치역과 뒤따라오는 함수의 정의역을 일치시키기 위해서 결괏값을 먼저 처리하는 것 같다.

(<<)와 (>>)는 함수 합성에 사용한다.

    (g << f) == (\x -> g (f x))
    (g >> f) == (\x -> f (g x))
    

### Let 표현식

지역 스코프 한정 변수를 let으로 지정해 선언한다. 앞 공백이 중요함. 그 밑은 같은 결과, 쉬운 표현.

    plus3 a =
      let b = a + 1 in
      let c = b + 1 in
      let d = c + 1 in
        d
    
    plus3 a =
      let b = a + 1
          c = b + 1
          d = c + 1
      in
        d
    
    plus3 a = a |> plus 1 |> plus 1 |> plus 1
    
    plus3 = plus 1 << plus 1 << plus 1
    

## 읽을 거리

### 필수

  * [문법 레퍼런스][8]
  * 라이브러리 [Basics][9], [Maybe][7], [List][10]

### 추천

  * [예제][11]
  * [문서][12]

### 그외

  * 다른 ML 방언 문법 비교 [Standard ML][13], [OCaml][14]

 [1]: http://haruair.com/frp-in-elm
 [2]: https://www.classes.cs.uchicago.edu/archive/2015/winter/22300-1/lectures/IntroML.html
 [3]: https://www.classes.cs.uchicago.edu/archive/2015/winter/22300-1/public-code/IntroML.elm
 [4]: http://package.elm-lang.org/packages/elm-lang/core/1.0.0/
 [5]: http://package.elm-lang.org/packages/elm-lang/core/1.0.0/Basics
 [6]: https://groups.google.com/forum/#!forum/elm-discuss
 [7]: http://package.elm-lang.org/packages/elm-lang/core/2.1.0/Maybe
 [8]: http://elm-lang.org/docs/syntax
 [9]: http://package.elm-lang.org/packages/elm-lang/core/2.1.0/Basics
 [10]: http://package.elm-lang.org/packages/elm-lang/core/2.1.0/List
 [11]: http://elm-lang.org/examples
 [12]: http://package.elm-lang.org/packages/elm-lang/core/2.1.0/
 [13]: http://www.mpi-sws.org/~rossberg/sml-vs-ocaml.html
 [14]: http://adam.chlipala.net/mlcomp/