---
title: node.js의 module.exports와 exports
author: haruair
type: post
date: "2018-07-02T22:35:48"
history:
  - 
    from: https://www.haruair.com/blog/4542
    movedAt: 2018-09-13T22:02:42+00:00
lang: ko
slug: module.exports-and-exports-in-node.js
headline:
  - 이 둘은 무엇이고 어떻게 사용하고 사용하지 말아야 하는가, 번역.
  - 번역
tags:
  - 개발 이야기
  - exports
  - module.exports
  - nodejs
  - js


---
[lazlojuly][1]의 글 [Node.js module.exports vs. exports][2]을 번역했다.

* * *

# node.js의 module.exports와 exports

(노트: 이 글은 Node.js 6.1.0 릴리즈 이후에 작성되었습니다.)

## 요약

  * `module.exports`는 `require()` 함수를 사용했을 때 반환 받는 변수라고 생각해봅시다. 비어 있는 객체가 기본값이며 어떤 것으로도 자유롭게 변경할 수 있습니다.
  * `exports` 자체는 절대 반환되지 않습니다! `exports`는 단순히 `module.exports`를 참조하고 있습니다. 이 편리한 변수를 사용하면 모듈을 작성할 때 더 적은 양의 코드로 작성할 수 있습니다. 이 변수의 프로퍼티를 사용하는 방법도 안전하고 추천하는 방법입니다.

```js
exports.method = function () { /* ... */ }
// vs.
module.exports.method = function () { /* ... */ }
```

## 간단한 모듈 예제

먼저 예제로 사용할 코드가 필요합니다. 간단한 계산기로 시작합니다.

```js
// calculator.js

module.exports.add = (a, b) => a + b
```

다음처럼 사용할 수 있습니다.

```js
// app-use-calculator.js

const calculator = require('./calculator.js')
console.log(calculator.add(2, 2) // 출력: 4
```

## 모듈 감싸기

Node.js는 `require()`로 모듈을 불러올 때 함수 래퍼(wrapper) 형태를 사용해 **내부적으로 감싸서** 호출합니다.

```js
(function (exports, require, module, __filename, __dirname) {
  // calculator.js의 내용은 여기에 추가해 실행합니다.
  module.exports.add = (a, b) => a + b
});
```

## `module` 객체

변수 **&#8220;module&#8221;**은 객체로 현재 모듈을 나타냅니다. 이 변수는 **각 모듈에 지역적**이며 비공개(private) 입니다. (모듈 코드에서만 접근할 수 있습니다.)

```js
// calcualtor-printed.js

module.exports.add = (a, b) => a + b
console.log(module)

// 이 모듈을 require('./calculator-printed.js')로 호출하면 다음과 같은 결과를 볼 수 있습니다.
//
// Module {
//   id: '/Users/laz/repos/module-exports/calculator-printed.js',
//   exports: { add: [Function] },
//   parent: 
//     Module { ... }
//   filename: '/Users/laz/repos/module-exports/calculator-printed.js',
//   loaded: false,
//   children: [],
//   paths: [ ... ]
// }
```

## `module.exports`

  * 객체 참조로 `require()` 호출을 하면 받는 값입니다.
  * Node.js에 의해 자동으로 생성됩니다.
  * 일반 JavaScript 객체를 참조합니다.
  * 또한 기본값은 비어 있습니다. (앞서 코드에서는 `add()` 메소드를 추가했습니다.)

다음 두 방법으로 `module.exports`를 사용합니다.

  1. **공개(public) 메소드를 붙여** 사용합니다. (앞서 작성한 예제가 이 방법입니다.)
  2. 직접 작성한 객체나 함수로 **대체하는 방식**을 사용합니다.

왜 대체하는 방식으로 사용할까요? 대체하는 방식으로 사용하면 다른 클래스를 임의적으로 수정해 반환하는 것도 가능합니다. 다음 ES2015 예제를 보겠습니다.

```js
// calculator-base.js

module.exports = class Calculator {
  add(a, b) {
    return a + b
  }
  substract(a, b) {
    return a - b
  }
}
```

이 calculator-base 예제에서는 클래스를 내보냈습니다. 다음 예제에서는 &#8220;Calcaulator&#8221; 클래스를 확장한 후, 클래스의 개체를 내보냅니다.

```js
// calculator-advanced.js

const Calculator = require('./calculator-base.js')

class AdvancedCalculator extends Calculator {
  multiply(a, b) {
    return a * b
  }
  devide(a, b) {
    return a / b
  }
}

module.exports = new AdvancedCalculator()
```

```js
// app-use-advanced-calculator.js

const calculator = require('calculator-advanced.js')

console.log(calculator.add(2, 2))      // 출력: 4
console.log(calculator.multiply(3, 3)) // 출력: 9
```

## exports 별칭(alias)

  * **`exports`는 편의 변수로 모듈 작성자가 코드를 덜 작성하도록 돕습니다.**
  * 이 변수의 프로퍼티를 사용하는 방식은 안전하고 추천하는 방법입니다. (예를 들면 `exports.add = function () { /* ... */ }` 식으로)
  * **`exports`** 는 `require()` 함수에서 반환되지 않습니다. (`module.exports`는 반환하지만요!)

좋은 예제와 나쁜 예제를 확인합니다.

```js
// calculator-exports-exmaples.js

// 좋음
module.exports = {
  add(a, b) { return a + b }
}

// 좋음
module.exports.subtract = (a, b) => a - b

// 가능함
exports = module.exports

// 위에서 작성한 코드보다 간단하고 짧은 코드
exports.multiply = (a, b) => a * b

// 나쁨, exports는 바깥으로 전달되지 않음
exports = {
  divide(a, b) { return a / b }
}
```

**노트:** `module.exports`를 함수나 객체로 대체하는 경우는 일반적인 접근법입니다. 이렇게 대체하면서도 여전히 `exports` 축약을 사용하고 싶다면 `exports`를 새로 대체할 객체를 가리키도록 설정해야 합니다. (위에서도 이런 방법을 사용헀습니다.)

```js
exports = module.exports = {}
exports.method = function () { /* ... */ }
```

## 결론

변수명은 `exports`지만 실제로 내보내지 않는다는 사실은 좀 혼란스러울 수 있습니다. 막 node.js를 시작한 사람이라면 특히 그럴겁니다. 공식 문서에서도 이 부분이 조금 이상합니다.

> exports와 module.exports의 관계가 마술처럼 느껴진다면 exports는 무시하고 module.exports만 사용하도록 지침을 드립니다. 

제 경우엔 이런 코드가 마술이라고 생각하지 않습니다. 개발자라면 사용하는 플랫폼과 언어가 어떻게 동작하는지 깊게 이해하려는 노력을 항상 해야합니다. 이처럼 깊게 이해하는 과정에서 프로그래머는 값진 자신감과 지식을 얻으며 코드 품질, 시스템 구조와 생산성에 긍정적인 영향을 주게 됩니다.

제 글을 읽어주셔서 감사합니다. 의견이나 생각은 언제나 환영하니 덧글로 남겨주세요.

 [1]: https://twitter.com/lazlojuly
 [2]: https://medium.freecodecamp.org/node-js-module-exports-vs-exports-ec7e254d63ac