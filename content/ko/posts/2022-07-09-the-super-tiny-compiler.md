---
title: "아주 조그마한 컴파일러 만들기"
author: haruair
type: post
date: "2022-07-09T18:16:12.847Z"
lang: ko
headline:
  - 자바스크립트로 작은 컴파일러를 만들며 컴파일러 원리 배우기, 번역.
tags:
  - 개발 이야기
  - 번역
  - 컴파일러
  - js
slug: "the-super-tiny-compiler"
---

프로그래밍을 한다면 컴파일러는 빼놓을 수 없는 부분입니다. 항상 사용하지만
어떻게 내부적으로 구현되어 있는지는 잘 알기 어려울 수 있습니다. 이 글은
작은 컴파일러를 직접 만들어보는 과정을 통해서 현대적인 컴파일러가 어떤 방식으로
동작하는지 설명합니다. 적은 양의 코드지만 구조나 동작 원리를 이해하는 데에는
부족함이 없습니다. 더 자세히 알고 싶다면 찾아볼 수 있도록 각각의 키워드를
잘 알려주고 있어서 아주 유익합니다.

이 포스트는 [jamiebuilds/the-super-tiny-compiler](https://github.com/jamiebuilds/the-super-tiny-compiler)의 번역글입니다. 그리고 전체 코드는 [the-super-tiny-compiler.js](https://github.com/jamiebuilds/the-super-tiny-compiler/blob/master/the-super-tiny-compiler.js)에서 확인할 수 있습니다.

----

# 아주 조그마한 컴파일러 만들기

오늘은 함께 컴파일러를 작성하려고 합니다. 하지만 그냥 아무 컴파일러가 아닌
엄청나게 작고 조그만 컴파일러를 만들겁니다! 컴파일러가 엄청 작은 나머지
파일에 있는 주석을 모두 지운다면 코드는 200여 줄만 남습니다.

여기서는 lisp 스타일의 함수 호출을 C 스타일의 함수 호출로 컴파일 하려고 합니다.
물론 이 스타일에 익숙하지 않을 수 있으니 짧게 설명하고 지나갈게요!
만약 두 함수 `add`와 `subtract`가 각 스타일로 작성되었다고 하면 다음과 같습니다.

```
               LISP 스타일                 C 스타일
2 + 2          (add 2 2)                 add(2, 2)
4 - 2          (subtract 4 2)            subtract(4, 2)
2 + (4 - 2)    (add 2 (subtract 4 2))    add(2, subtract(4, 2))
```

간단하죠?

이게 바로 우리가 컴파일 할 내용입니다. 완벽한 LISP이나 C 문법은 아니긴 하지만
요즘 현대적인 컴파일러가 어떤 역할을 하고 있는지 대략적으로 보여주기엔 적당한
예제입니다.

대부분 컴파일러는 분석, 변환, 코드 생성 같은 단계를 거칩니다.

1. **분석(parsing)** 단계에서는 코드 그대로를 좀 더 추상화된 코드로 변환합니다.
2. **변환(transformation)** 단계는 이 추상화된 코드를 컴파일러가 하려는 작업에
   용이하도록 조작합니다.
3. **코드 생성(code generation)** 단계는 이 변환된 코드 표현을 갖고서 새로운
   코드 형태로 변환하는 일을 합니다.

## 컴파일 단계

### 분석 (Parsing)

분석 단계는 일반적으로 어휘 분석과 구문 분석 단계로 나눠집니다.

1. **어휘 분석(Lexical Analysis)** 단계는 코드를 더 작은 형태인 토큰(token)
   단위로 나누는 작업을 합니다. 토크나이저(tokenizer) 또는 렉서(lexer)가
   이 작업을 수행합니다.

   토큰은 배열 형태의 작은 개체로 한 조각의 문법을 담고 있습니다. 숫자나
   꼬리표(labels), 구두법, 연산자 등 어떤 것이든 이렇게 저장됩니다.

2. **구문 분석(Syntatic Analysis)** 단계는 앞 단계에서 만든 토큰을 각각의 문법이나
   서로 관계를 잘 표현하는 형태로 재구성하게 됩니다. 이 과정으로 만든 결과물을
   중간 표현(intermediate representation) 또는 추상 구문 트리(Abstract Syntax
   Tree)이라고 말합니다.

   추상 구문 트리(줄여서 AST)는 깊숙하게 중첩된 형태의 개체로 존재합니다. 그
   형태로 코드가 쉽게 동작할 수 있으며 동시에 많은 정보를 알려줍니다.

다음 구문을 봅시다.

```lisp
(add 2 (subtract 4 2))
```

이 구문에서 생성한 토큰은 다음과 같은 모습입니다.

```js
[
  { type: 'paren',  value: '('        },
  { type: 'name',   value: 'add'      },
  { type: 'number', value: '2'        },
  { type: 'paren',  value: '('        },
  { type: 'name',   value: 'subtract' },
  { type: 'number', value: '4'        },
  { type: 'number', value: '2'        },
  { type: 'paren',  value: ')'        },
  { type: 'paren',  value: ')'        },
]
```

그리고 추상 구문 트리(AST)는 이런 모습이 될 겁니다.

```js
{
  type: 'Program',
  body: [{
    type: 'CallExpression',
    name: 'add',
    params: [{
      type: 'NumberLiteral',
      value: '2',
    }, {
      type: 'CallExpression',
      name: 'subtract',
      params: [{
        type: 'NumberLiteral',
        value: '4',
      }, {
        type: 'NumberLiteral',
        value: '2',
      }]
    }]
  }]
}
```

### 변환 (Transformation)

컴파일러의 다음 단계는 변환입니다. 다시 말하면 앞 단계에서 생성한 AST를
갖고서 변환 작업을 수행합니다. AST를 동일한 언어로 조작하거나 완전히 다른
언어로 번역할 수도 있습니다.

이제 이 AST를 어떻게 변환하는지 확인해봅시다.

AST를 보면 비슷하게 생긴 요소가 많은걸 알 수 있습니다. 각 개체마다 타입
속성(property)를 포함하고 있습니다. 각각 개체를 AST 노드라고 부릅니다.
이 각각의 노드는 여러 속성이 있으며 동시에 트리의 일부를 각자 정의하는
역할을 하고 있습니다.

"NumberLiteral" 노드를 상상해봅시다.

```js
{
  type: 'NumberLiteral',
  value: '2',
}
```

또는 "CallExpression" 이라는 노드도 존재할 수 있죠.

```js
  {
    type: 'CallExpression',
    name: 'subtract',
    params: [...여기에 중첩 노드가 위치합니다...],
  }
```

AST를 변환하면서 속성을 추가하거나 제거, 치환하는 식으로 노드를 조작할 수
있습니다. 그러면서 새로운 노드를 추가하거나 제거하거나 아니면 아예 AST를
그대로 두고 완전 새로운 트리를 만들어낼 수도 있습니다.

여기서는 새로운 언어로 변환하는 것이 목표이기 때문에 목표가 되는 언어에
딱 맞춰서 새로운 AST를 만들기로 합니다.


### 순회 (Traversal)

이 노드를 모두 탐색하려면 일일이 순회 할 필요가 있습니다. 이 순회 과정은
AST의 각 노드를 깊이 우선으로 탐색합니다.

```js
{
  type: 'Program',
  body: [{
    type: 'CallExpression',
    name: 'add',
    params: [{
      type: 'NumberLiteral',
      value: '2'
    }, {
      type: 'CallExpression',
      name: 'subtract',
      params: [{
        type: 'NumberLiteral',
        value: '4'
      }, {
        type: 'NumberLiteral',
        value: '2'
      }]
    }]
  }]
}
```

이 AST라면 다음 같은 순서로 접근하게 됩니다.

  1. Program - AST의 가장 윗 단계에서 시작
  2. CallExpression (add) - Program의 첫 요소로 이동
  3. NumberLiteral (2) - CallExpression 속성의 첫 번째 요소로 이동
  4. CallExpression (subtract) - CallExpression 속성의 두 번째 요소로 이동
  5. NumberLiteral (4) - CallExpression 속성의 첫 번째 요소로 이동
  6. NumberLiteral (2) - CallExpression 속성의 두 번째 요소로 이동

만약 분리된 AST를 생성하는 것 대신에 AST를 직접 변환한다면 여기서 온갖 종류의
추상적 접근을 소개해야 합니다. 다만 여기서의 목적으로는 단순히 트리 내 각 노드를
일일이 보는, 방문하는 정도면 충분하겠습니다.

여기서 "방문하다(visiting)"이란 표현을 사용한건 이유가 있습니다. 바로 개체
구조의 요소를 대상으로 연산하게 되는데 거기서 사용하는 패턴이 비지터 패턴을 사용하기
때문입니다.

### 방문자(Visitors)

여기서 "방문자" 개체를 만드는데 이 개체에 각각 메소드로 다른 노드 타입을
처리하도록 하는게 기본 아이디어입니다.

```js
var visitor = {
  NumberLiteral() {},
  CallExpression() {},
};
```

AST를 순회하면서 노드에 "입장"할 때면 그 노드 타입에 맞춰서 이 방문자 개체에
있는, 동일한 이름의 메소드를 호출할 겁니다.

이걸 유용하게 만들려면 해당 노드와 함께 부모 노드의 참조도 그 메소드에
전달해야 합니다.

```js
var visitor = {
  NumberLiteral(node, parent) {},
  CallExpression(node, parent) {},
};
```

하지만 "퇴장"하는 경우에 무언가를 호출해야 하는 가능성도 있습니다. 앞서 트리
구조를 목록 형태로 다시 확인해봅시다.

- Program
  - CallExpression
    - NumberLiteral
    - CallExpression
      - NumberLiteral
      - NumberLiteral

트리를 순회해서 가지(branch) 끝까지 내려가면 더이상 갈 곳이 없는 곳에 도달하게
됩니다. 각 가지 끝에 도달하면 그 가지에서 "퇴장"해야 합니다. 즉 트리를 타고
내려가면 각 노드에 "입장"해야 하고 다시 올라오면서 "퇴장"해야 하는 겁니다.

```
-> Program (입장)
  -> CallExpression (입장)
    -> Number Literal (입장)
    <- Number Literal (퇴장)
    -> Call Expression (입장)
        -> Number Literal (입장)
        <- Number Literal (퇴장)
        -> Number Literal (입장)
        <- Number Literal (퇴장)
    <- CallExpression (퇴장)
  <- CallExpression (퇴장)
<- Program (퇴장)
```

최종적으로 입장과 퇴장을 처리할 수 있는 방문자 개체의 모습은 다음과 같습니다.

```js
var visitor = {
  NumberLiteral: {
    enter(node, parent) {},
    exit(node, parent) {},
  }
};
```

### 코드 생성 (Code Generation)

컴파일러 최종 단계는 코드 생성입니다. 컴파일러는 종종 변환 단계서 하는 작업과
겹치는 작업을 여기서 하게 되는데 대부분 코드 생선 단계에서는 AST를 가지고
문자열 같은 코드 형태로 출력하는 일을 하게 됩니다.

코드 생성기는 여러 다른 방식으로 동작하는데 어떤 컴파일러는 앞서 생성한 토큰을
재활용하기도 하고 또 다른 방식은 완전히 코드와 분리된 표현식을 생성해서 노드를
선형적으로 생성하기도 합니다. 하지만 여기서 얘기하자면 대부분은 동일한 AST를
생성하기 때문에 여기서도 그 방법에 집중하려고 합니다.

코드 생성기는 모든 다른 노드 타입을 어떻게 "출력"하는지 실질적으로 알고 있게
될 겁니다. 또한 중첩된 노드를 하나의 긴 문자열 코드로 전부 출력할 때까지
스스로를 재귀적으로 호출하도록 작성하려고 합니다.

---

여기까지! 컴파일러에 필요한 모든 부분을 확인했습니다.

물론 모든 컴파일러가 여기서 설명한 것처럼 완전 동일하게 동작하진 않을 겁니다.
컴파일러는 각각 다른 용도에 따라 쓰이기도 하고 여기서 설명보다 더 많은 단계로
동작하기도 합니다.

하지만 컴파일러 대부분에서 찾을 수 있는 고수준의 개념은 여기서 다 얘기했습니다.
이제 모든 내용을 설명했으니 가서 컴파일러를 직접 만들 수 있으시겠죠?

물론 농담입니다 :) 여기서 함께 작성해보도록 합시다!

## 코드 작성하기

### 토크나이저 (Tokenizer)

컴파일러의 가장 첫 단계인 분석에서 어휘 분석을 토크나이저로 시작합니다.
다음 코드 문자열을 갖고 토큰 배열 형태로 변환할 겁니다.

```
(add 2 (subtract 4 2))   =>   [{ type: 'paren', value: '(' }, ...]
```

이제 코드를 작성해봅시다.
```js
// 여기서 문자열 형태로 코드를 받을 겁니다. 먼저 변수 둘을 준비합니다.
function tokenizer(input) {

  // `current` 변수는 커서처럼 코드에 어느 위치에 있는지 저장합니다.
  let current = 0;

  // `tokens`는 토큰을 보관할 배열입니다.
  let tokens = [];

  // 먼저 반복문 내에서 증가하는 `current` 변수를 검사하도록 `while` 반복문을
  // 만듭니다.
  //
  // 토큰이 어떤 길이가 되든 처리할 수 있도록 하기 위해서 이렇게 작성했습니다.
  // 즉 반복문을 한 번만 거치더라도 원하는 대로 커서의 위치를 변경하는 것이
  // 가능합니다.
  while (current < input.length) {

    // 먼저 `current` 위치에 존재하는 문자를 `input`에 저장합니다.
    let char = input[current];

    // 가장 먼저 열린 소괄호를 확인하려고 합니다. 이 부분은 나중에
    // `CallExpression`로 다뤄질 부분인데 일단 지금은 문자만 신경쓰도록
    // 합니다.
    //
    // 열린 소괄호가 있나요?
    if (char === '(') {

      // 있다면 `paren` 타입의 새 토큰을 만들어서 집어넣습니다.
      // 값으로 열린 소괄호를 넣습니다.
      tokens.push({
        type: 'paren',
        value: '(',
      });

      // 한 글자를 확인했으니 `current`를 증가해서 커서를 옮깁니다.
      current++;

      // 반복문을 다음 사이클로 넘어가기 위해 `continue`를 사용합니다. 
      continue;
    }

    // 다음으로 확인할 문자는 닫힌 소괄호입니다. 앞서 수행한 방식과 동일하게
    // 닫힌 소괄호를 확인하고, 새로운 토큰을 만들고, `current`를 옮기고,
    // `continue`로 넘어갑니다.
    if (char === ')') {
      tokens.push({
        type: 'paren',
        value: ')',
      });
      current++;
      continue;
    }

    // 다음 차례로 넘어갑니다. 이제 공백을 확인하려고 합니다. 이 과정이 조금
    // 흥미롭게 보일 수 있습니다. 문자 사이에 공백이 있는지 없는지는 중요하긴
    // 하지만 토큰으로 저장할 만큼 중요하진 않다는 부분인데요. 토큰으로 만들어도
    // 나중에 그 토큰을 버리는 일이나 하게 되기 때문에 그렇습니다.
    //
    // 그러니까 여기서는 단순히 공백이 존재하는지 확인만 합니다. 존재한다면
    // 커서를 다음 문자로 옮기고 반복문을 다음 사이클로 넘깁니다.
    let WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }

    // 다음 토큰 타입은 숫자입니다. 여기서는 앞서 본 방식과는 조금 다르게 처리
    // 하게 되는데요. 그 이유는 한 글자만 확인해서 숫자라면 그게 한 자리 숫자인지
    // 여러 자리 숫자인지 확인해서 일련의 숫자를 모두 하나의 토큰에 저장해야
    // 하기 때문입니다.
    //
    //   (add 123 456)
    //        ^^^ ^^^
    //        즉, 여기가 숫자 토큰 두 개로 처리가 되어야 합니다
    //
    // 먼저 숫자가 존재하는지 확인부터 합니다.
    let NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {

      // `value` 변수를 만들어서 문자가 숫자라면 여기에 쌓도록 문자열로
      // 지정했습니다.
      let value = '';

      // 그런 후에 작은 반복문으로 그 이후에 나오는 문자를 하나씩 확인해서
      // 숫자가 아닌 글자가 나올 때까지 확인합니다. 확인 할 때마다 숫자가 나오면
      // 그 숫자는 `value` 변수에 붙여서 저장하고 `current`를 증가하며 다음
      // 문자를 검사하게 됩니다. 숫자가 아니라면 이 작은 반복문은 종료됩니다.
      while (NUMBERS.test(char)) {
        value += char;
        char = input[++current];
      }

      // 이 과정이 끝나면 `number` 토큰을 숫자와 함께 `tokens` 배열에 저장합니다.
      tokens.push({ type: 'number', value });

      // 그리고 반복문을 다음 사이클로 넘깁니다.
      continue;
    }

    // 이 언어의 문자열 처리를 위해서 쌍따옴표(")로 감싼 문자열을 검사합니다.
    //
    //   (concat "foo" "bar")
    //            ^^^   ^^^ 문자열 토큰 둘
    //
    // 먼저 열린 따옴표를 확인합니다.
    if (char === '"') {
      // 문자열 토큰을 만들기 위해 `value` 변수를 준비합니다.
      let value = '';

      // 먼저 열린 쌍따옴표를 건너 뜁니다.
      char = input[++current];

      // 그리고 각 문자를 다음 쌍따옴표가 나올 때까지 `value`에 저장하며
      // 커서를 계속 옮깁니다. 쌍따옴표가 나오면 멈춥니다.
      while (char !== '"') {
        value += char;
        char = input[++current];
      }

      // 닫는 쌍따옴표도 건너 뜁니다.
      char = input[++current];

      // 이제 `string` 토큰을 만들어서 `tokens` 배열에 저장합니다.
      tokens.push({ type: 'string', value });

      continue;
    }

    // 마지막 토큰 타입은 `name` 토큰입니다. 숫자 대신 이 일련의 문자는
    // lisp 문법에서 함수의 이름을 의미하게 됩니다.
    //
    //   (add 2 4)
    //    ^^^
    //    이름 토큰
    //
    let LETTERS = /[a-z]/i;
    if (LETTERS.test(char)) {
      let value = '';

      // 앞서 방법과 동일하게 반복문을 사용해서 `value` 값을 만듭니다.
      while (LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }

      // 그리고 값을 `name` 타입 토큰으로 저장하고 반복문을 돌립니다.
      tokens.push({ type: 'name', value });

      continue;
    }

    // 최종적으로 앞에서 확인하지 못한 문자는 오류를 내고 거기서 종료해버립니다.
    throw new TypeError('I dont know what this character is: ' + char);
  }

  // 토큰 배열을 반환하며 `tokenizer`를 끝냅니다.
  return tokens;
}
```

### 파서 (Parser)

파서에서는 토큰이 담긴 배열을 AST로 변환하려고 합니다.

```
[{ type: 'paren', value: '(' }, ...]  =>  { type: 'Program', body: [...] }
```

코드를 작성해봅시다.

```js
'use strict';
// 먼저 `tokens` 배열을 받는 `parser` 함수를 정의합니다.
function parser(tokens) {

  // 앞서 방법처럼 `current` 변수에 현재 위치를 저장할 겁니다.
  let current = 0;

  // 하지만 이번에는 `while` 반복문 대신에 재귀를 사용하려고 합니다. 그래서
  // `walk` 함수를 정의합니다.
  function walk() {

    // 이 함수에서 `current` 위치에 있는 토큰을 가져오는 것으로 작업을
    // 시작합니다.
    let token = tokens[current];

    // 각각의 토큰을 다른 코드 경로로 분리하려고 합니다. 먼저 `number`
    // 토큰부터 시작합니다.
    //
    // 먼저 `number` 토큰인지 검사부터 합니다.
    if (token.type === 'number') {

      // 숫자 토큰이면 `current`를 증가해서 다음 토큰으로 커서를 옮깁니다.
      current++;

      // 그리고 새 AST 노드인 `NumberLiteral`을 반환하면서 토큰에 담긴 값을
      // 이 노드에 저장합니다.
      return {
        type: 'NumberLiteral',
        value: token.value,
      };
    }

    // 문자열 토큰이 있다면 위에서 숫자 토큰을 처리했던 방식처럼
    // `StringLiteral` 노드를 만들어서 토큰의 값을 저장합니다.
    if (token.type === 'string') {
      current++;

      return {
        type: 'StringLiteral',
        value: token.value,
      };
    }

    // 다음은 CallExpessions를 확인할 차례입니다. 먼저 열린 소괄호를 확인
    // 하는 것으로 시작합니다.
    if (
      token.type === 'paren' &&
      token.value === '('
    ) {
      
      // AST에서는 괄호가 의미 없으므로 `current`를 증가해서 다음 토큰으로
      // 넘어갑니다.
      token = tokens[++current];

      // 이제 `CallExpression`이라는 기반 노드를 생성합니다. 그리고 현재 토큰
      // 값으로 이름을 지정합니다. 열린 괄호 뒤에 오는 이름이 바로 호출하려는
      // 함수의 이름이기 때문입니다. (예를 들어 `(add 2 3)`을 보면 `(` 뒤에
      // 바로 함수 이름이 나오는 걸 볼 수 있습니다.)
      let node = {
        type: 'CallExpression',
        name: token.value,
        params: [],
      };

      // 이제 이름 토큰 다음 토큰을 얻기 위해 `current`를 한번 더 옮깁니다.
      token = tokens[++current];

      // 이제는 닫힌 소괄호가 나올 때까지 각 토큰을 반복적으로 검사해서
      // `CallExpression`에 있는 `params`에 계속 넣으려고 합니다.
      //
      // 여기서부터 코드는 재귀로 동작합니다. 중첩된 노드를 직접 무한대로 열어서
      // 처리하는 것 대신에 재귀로 문제를 해결할 수 있습니다.
      //
      // 이 방식을 설명하기 위해 Lisp 코드를 다시 봅니다. 이제 `add` 함수를
      // 보면 하나의 숫자와 숫자가 포함된 `CallExpression`이 중첩되어 있는
      // 것을 확인할 수 있습니다.
      //
      //   (add 2 (subtract 4 2))
      //
      // 이 코드로 생성한 토큰을 보면 닫힌 소괄호가 여러 차례 나타난다는 점을
      // 확인할 수 있습니다.
      //
      //   [
      //     { type: 'paren',  value: '('        },
      //     { type: 'name',   value: 'add'      },
      //     { type: 'number', value: '2'        },
      //     { type: 'paren',  value: '('        },
      //     { type: 'name',   value: 'subtract' },
      //     { type: 'number', value: '4'        },
      //     { type: 'number', value: '2'        },
      //     { type: 'paren',  value: ')'        }, <<< 닫힌 소괄호
      //     { type: 'paren',  value: ')'        }, <<< 닫힌 소괄호
      //   ]
      //
      // `walk` 함수를 중첩해서 호출하는 방식으로 `current` 변수를 계속
      // 증가시키는데 이 방법으로 중첩된 `CallExpression`을 처리합니다.
      
      // 그런 이유로 `while` 반복문을 사용해서 계속 `walk` 함수를 호출하는데
      // `type`이 `'paren'`이고 `value`에 닫힌 소괄호가 나올 때까지만
      // 반복합니다.
      while (
        (token.type !== 'paren') ||
        (token.type === 'paren' && token.value !== ')')
      ) {
        // `walk` 함수를 호출해서 반환되는 `node`를 `node.params` 배열에
        // 추가합니다.
        node.params.push(walk());
        token = tokens[current];
      }

      // 최종적으로 `current`를 한 번 옮기는 것으로 닫는 소괄호를 건너 뜁니다.
      current++;

      // 그리고 노드를 반환합니다.
      return node;
    }

    // 만약 인식할 수 없는 토큰을 만나면 오류로 처리합니다.
    throw new TypeError(token.type);
  }

  // 이제 AST를 만드려고 합니다. 이 AST의 뿌리로 볼 수 있는 `Program`노드를
  // 다음처럼 작성합니다.
  let ast = {
    type: 'Program',
    body: [],
  };

  // 이제 `walk` 함수를 호출합니다. 호출해서 생성한 노드를 `ast.body`
  // 배열에 저장합니다.
  //
  // 여기서 반복문으로 이 호출을 수행하는 이유는 `CallExpression`이 중첩되지
  // 않고 다음처럼 나란히 존재할 경우도 있기 때문입니다.
  //
  //   (add 2 2)
  //   (subtract 4 2)
  //
  while (current < tokens.length) {
    ast.body.push(walk());
  }

  // 최종적으로 생성한 AST를 반환합니다.
  return ast;
}
```

### 트래버서 (Traverser, 순회자)

AST까지 만들었으니 방문자가 각 노드를 방문하는 작업을 해야 합니다. 매 노드를
방문하면서 노드의 타입과 일치하는 방문자의 메소드를 호출하는 코드를 작성해야
합니다.

```js
traverse(ast, {
  Program: {
    enter(node, parent) {
      // ...
    },
    exit(node, parent) {
      // ...
    },
  },

  CallExpression: {
    enter(node, parent) {
      // ...
    },
    exit(node, parent) {
      // ...
    },
  },

  NumberLiteral: {
    enter(node, parent) {
      // ...
    },
    exit(node, parent) {
      // ...
    },
  },
});
```

이제 코드로 적어봅시다.

```js
// 이제 AST와 방문자를 전달할 수 있는 순회 함수를 작성합니다.
// 내부에서는 두 함수를 정의합니다.
function traverser(ast, visitor) {

  // `traverseArray` 함수는 배열을 대상으로 `traverseNode` 함수를
  // 반복해서 실행합니다. 이 함수는 아래서 정의합니다.
  function traverseArray(array, parent) {
    array.forEach(child => {
      traverseNode(child, parent);
    });
  }

  // `traverseNode`는 `node`와 부모 노드인 `parent` 노드를 받습니다.
  // 그래서 이 둘을 방문자 메소드에 전달하게 됩니다.
  function traverseNode(node, parent) {

    // 방문자에 노드의 `type`과 일치하는 메소드가 있는지 확인합니다. 
    let methods = visitor[node.type];

    // 만약 그 메소드에 입장 할 때 실행할 내용이 있다면 `enter` 메소드를
    // `node`와 `parent`를 사용해서 실행합니다.
    if (methods && methods.enter) {
      methods.enter(node, parent);
    }

    // 노드 타입에 따라 다른 방식으로 처리합니다. 
    switch (node.type) {

      // 최상위 레벨인 `Program`으로 시작합니다. 프로그램 노드는 body라는
      // 속성에 노드 배열을 보관하고 있습니다. 이 배열을 순회하며 확인하기
      // 위해 `traverseArray`를 호출합니다.
      //
      // (`traverseArray`는 `traveseNode`를 호출하니까 트리 전체를
      // 재귀적으로 순회하게 됩니다.)
      case 'Program':
        traverseArray(node.body, node);
        break;

      // 다음으로 `CallExpression`을 만나면 `params` 배열을 순회하도록
      // 코드를 작성합니다.
      case 'CallExpression':
        traverseArray(node.params, node);
        break;

      // `NumberLiteral`과 `StringLiteral`를 만나면 순회해서 확인할 자식
      // 노드가 없기 때문에 별도 처리 없이 끝냅니다.
      case 'NumberLiteral':
      case 'StringLiteral':
        break;

      // 알 수 없는 노드 타입을 만나면 오류로 처리합니다.
      default:
        throw new TypeError(node.type);
    }

    // 만약 해당 노드 타입에 `exit` 메소드, 즉 퇴장 메소드가 정의되어 있다면
    // 해당 메소드를 `node`, `parent`와 함께 호출합니다.
    if (methods && methods.exit) {
      methods.exit(node, parent);
    }
  }

  // 이제 모든 함수가 준비되었습니다. AST와 null을 `traverseNode` 함수에 넣어
  // 실행합니다. 왜 parent 자리가 null일까요? AST에서 가장 위에 있다면 이미 더
  // 이상 위로 올라갈 곳이 없기 때문입니다.
  traverseNode(ast, null);
}
```

### 트랜스포머 (transformer, 변환자)

다음은 트랜스포머입니다. 생성한 AST를 방문자와 함께 순회 함수로 호출하면 새로운 AST를 생성하게 됩니다.

```
----------------------------------------------------------------------------
  원본 AST                         |   변환된 AST
----------------------------------------------------------------------------
  {                                |   {
    type: 'Program',               |     type: 'Program',
    body: [{                       |     body: [{
      type: 'CallExpression',      |       type: 'ExpressionStatement',
      name: 'add',                 |       expression: {
      params: [{                   |         type: 'CallExpression',
        type: 'NumberLiteral',     |         callee: {
        value: '2'                 |           type: 'Identifier',
      }, {                         |           name: 'add'
        type: 'CallExpression',    |         },
        name: 'subtract',          |         arguments: [{
        params: [{                 |           type: 'NumberLiteral',
          type: 'NumberLiteral',   |           value: '2'
          value: '4'               |         }, {
        }, {                       |           type: 'CallExpression',
          type: 'NumberLiteral',   |           callee: {
          value: '2'               |             type: 'Identifier',
        }]                         |             name: 'subtract'
      }]                           |           },
    }]                             |           arguments: [{
  }                                |             type: 'NumberLiteral',
                                   |             value: '4'
---------------------------------- |           }, {
                                   |             type: 'NumberLiteral',
                                   |             value: '2'
                                   |           }]
 (미안하지만 변환된 쪽이 더 길어요..)      |         }
                                   |       }
                                   |     }]
                                   |   }
----------------------------------------------------------------------------
```

이제 AST를 받는 변환 함수를 작성합니다.

```js
function transformer(ast) {

  // 먼저 `newAst`를 생성하는데 이전 AST와 같이 프로그램 노드로 시작합니다.
  let newAst = {
    type: 'Program',
    body: [],
  };

  // 여기서는 약간 변칙적인 방법을 사용하려고 하는데요. 여기서 `context`라는
  // 속성을 부모 노드에 만들고 새로운 노드를 여기에 추가하려고 합니다.
  // 일반적으로는 이 방법보다 더 나은 추상화가 필요하지만 지금 컴파일러를
  // 작성하는 목적에 맞게 최대한 단순하게 만들고 있습니다.
  //
  // 단순하게 이전 AST에서 새 AST를 참조하는 역할을 한다고 생각하면 됩니다.
  //
  ast._context = newAst.body;

  // AST와 방문자를 순회 함수에 넣어 호출하는 작업으로 시작합니다.
  traverser(ast, {

    // 첫 방문자 메소드는 `NumberLiteral`을 처리합니다.
    NumberLiteral: {
      // 입장할 때 호출하는 메소드입니다.
      enter(node, parent) {
        // `NumberLiteral` 이름으로 새 노드를 만들어 부모 컨텍스트에 추가합니다.
        parent._context.push({
          type: 'NumberLiteral',
          value: node.value,
        });
      },
    },

    // 다음으로 `StringLiteral`을 처리합니다.
    StringLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: 'StringLiteral',
          value: node.value,
        });
      },
    },

    // 이제 `CallExpression`을 처리합니다.
    CallExpression: {
      enter(node, parent) {

        // 중첩된 `Identifier`와 함께 `CallExpression` 노드를 생성합니다.
        let expression = {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: node.name,
          },
          arguments: [],
        };

        // 다음으로 기존 `CallExpression` 노드에 새 `context`를 정의해서
        // `expression`의 인자를 참조하는데 사용합니다. 이제 여기에
        // 새 인자를 집어넣을 수 있습니다.
        node._context = expression.arguments;

        // 이제 부모 노드가 `CallExpression`인지 아닌지 확인합니다.
        // 아니라면...
        if (parent.type !== 'CallExpression') {

          // `CallExpression` 노드를 `ExpressionStatement`라는 노드로
          // 감쌉니다. 이렇게 처리하는 이유는 자바스크립트에서 최상위
          // `CallExpression`은 실제로 명령문으로 다뤄지기 때문입니다.
          expression = {
            type: 'ExpressionStatement',
            expression: expression,
          };
        }

        // 끝으로 (아마도 감싸져 있는) `CallExpression`을 부모 노드의
        // `context`에 넣으며 끝냅니다.
        parent._context.push(expression);
      },
    }
  });

  // 마지막으로 이 변환 함수에서 방금 새로 만든 AST를 반환합니다.
  return newAst;
}
```

### 코드 제너레이터 (Code generator, 코드 생성기)

이제 마지막 단계인 코드 생성기를 살펴봅니다.

이 코드 생성기는 함수 스스로를 재귀적으로 호출해서 트리에 있는 각 노드를 하나의 긴 문자열로 출력하게 됩니다.

```js
function codeGenerator(node) {

  // 이제 각 `node`의 `type`으로 구분해 동작합니다.
  switch (node.type) {

    // `Program` 노드를 만났습니다. `body`에 있는 각 노드에 코드 생성 함수를
    // 맵핑해서 구동합니다. 그리고 각각의 결과를 개행 문자로 합칩니다.
    case 'Program':
      return node.body.map(codeGenerator)
        .join('\n');

    // `ExpressionStatement`를 만나면 중첩된 노드를 대상으로 코드 생성
    // 함수를 실행합니다. 그 결과에 세미콜론을 더해서 반환합니다.
    case 'ExpressionStatement':
      return (
        codeGenerator(node.expression) +
        ';' // << (...왜냐하면 코드가 제대로 동작되려면 필요하니까요.)
      );

    // `CallExpression`에서는 `callee`를 출력하고 열린 괄호를 추가합니다.
    // 그리고 노드의 `arguments` 배열에 코드 생성 함수를 맵핑합니다.
    // 그렇게 생성한 각각의 결과를 쉼표로 합친 후에 닫힌 괄호를 더해 반환
    // 합니다.
    case 'CallExpression':
      return (
        codeGenerator(node.callee) +
        '(' +
        node.arguments.map(codeGenerator)
          .join(', ') +
        ')'
      );

    // `Identifier`를 만나면 `node`의 이름을 반환합니다.
    case 'Identifier':
      return node.name;

    // `NumberLiteral`을 만나면 `node`의 값을 반환합니다.
    case 'NumberLiteral':
      return node.value;

    // `StringLiteral`을 만나면 `node`의 값을 쌍따옴표로 감싸서 반환합니다.
    case 'StringLiteral':
      return '"' + node.value + '"';

    // 만약 인식하지 못하는 노드라면 오류를 냅니다.
    default:
      throw new TypeError(node.type);
  }
}
```

### 컴파일러 (compiler)

드디어 끝났습니다! 이제 `compiler` 함수를 만듭니다. 지금까지 만든, 모든
함수를 하나의 함수로 묶습니다.

1. 입력 => 토크나이저 => 토큰 묶음
2. 토큰 묶음 => 파서 => 추상 구문 트리(AST)
3. AST => 트랜스포머 => 새 AST
4. 새 AST => 코드 생성기 => 출력

함수와 인자명으론 다음처럼 정리할 수 있습니다.

```
1. input  => tokenizer   => tokens
2. tokens => parser      => ast
3. ast    => transformer => newAst
4. newAst => generator   => output
```

이제 함수로 작성해볼까요?

```js
function compiler(input) {
  let tokens = tokenizer(input);
  let ast    = parser(tokens);
  let newAst = transformer(ast);
  let output = codeGenerator(newAst);

  // 그리고 결과물을 반환합니다!
  return output;
}
```

모두 완성되었습니다! ([테스트 코드](https://github.com/jamiebuilds/the-super-tiny-compiler/blob/master/test.js)도 확인해보세요.)
