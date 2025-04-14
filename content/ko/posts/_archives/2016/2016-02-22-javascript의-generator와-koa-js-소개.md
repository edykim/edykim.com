---
title: JavaScript의 Generator와 Koa.js 소개
author: haruair
uuid: "b0998bd9-4a85-42ea-8979-517df6754e8c"
type: post
date: "2016-02-22T07:05:11"
history:
  - 
    from: https://www.haruair.com/blog/3425
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: introducing-javascript-generator-and-koa.js
tags:
  - 개발 이야기
  - co
  - generator
  - js
  - koa

---
사이드 프로젝트에서 Express를 오랜 기간 사용했었는데 hapi 가 좋다는 얘기를 듣고는 hapi를 많이 사용해왔다. Hapi도 단순하긴 하지만 &#8220;설정만 넣으면 되는&#8221; 단순함이라서 설정에 들어가는 수고가 꽤 컸다. 최근에는 토이 프로젝트에서 API를 작성하는데 에러 발생 여부에 따라서 `{"ok": true}` 하나 넣어주는 작업에 오만가지 코드를 작성해야 했다. express와 다르게 미들웨어에서 request, response에 접근할 수 있는 포인트가 워낙에 많아 더 복잡하게 느껴졌다. 그러던 중 예전에 잠시 비교글로 봤던 koa를 살펴봤는데 지금 필요한 상황에 맞는 것 같아 koa로 다시 코드를 작성했고 마음에 드는 구석이 많아서 간단한 소개를 작성한다.

Koa는 ES2015의 문법 중 하나인 제너레이터를 적극적으로 활용하고 있는 웹 프레임워크다. 모든 요청과 처리를 제너레이터를 활용해 파이프라인을 만드는 것이 특징이며 그 덕분에 깔끔한 async 코드를 손쉽게 작성할 수 있다. Express 만큼은 아니더라도 다양한 라이브러리를 제공하고 있고, express의 라이브러리나 미들웨어도 thenify나 co로 변환해서 활용할 수 있을 만큼 확장성이 높다.

이 포스트는 제너레이터를 먼저 살펴보고, 제너레이터를 유용하게 사용할 수 있는 co를 살펴본 후, KoaJS를 간단하게 살펴보는 것으로 마무리한다.

* * *

# 제너레이터 Generator

다른 언어에도 이미 존재하고 있기 때문에 크게 특별한 기능은 아니지만 ES6에서의 구현을 간단히 정리하려고 한다.

일반적인 함수의 경우, 매 실행마다 같은 흐름으로 모든 코드를 실행하지만 Generator 함수는 실행 중간에서 값을 반환할 수 있고, 다른 작업을 처리한 후에 다시 그 위치에서 코드를 시작할 수 있다. 이 제너레이터는 반복 함수 iterator를 `next()`로 제공하고 결과를 `value`로, 진행 상황을 `done`으로 확인할 수 있다.

구구단을 제너레이터로 작성하면 다음과 같다.

```js
function* nTimesTable(n) {
  for(var i = 1; i <= 9; i++) yield n * i;
}
```

제너레이터는 위와 같이 `function* fnName(){}` 식으로 *을 넣어 선언한다. 익명 함수의 경우도 `function*(){}` 식으로 선언한다.

이제 이터레이터(iterator)를 `nineTimesTable`에 반환 받는다.

```js
var nineTimesTable = nTimesTable(9);
```

이터레이터는 `next()`를 통해 실행할 수 있다. 이 함수로 중단한 위치의 결과가 반환된다.

```js
var result = nineTimesTable.next();
console.log(result); // { value: 9, done: false }
result = nineTimesTable.next();
console.log(result); // { value: 18, done: false }
result = nineTimesTable.next();
console.log(result); // { value: 27, done: false }

// keep calling...

result = nineTimesTable.next();
console.log(result); // { value: 72, done: false }
result = nineTimesTable.next();
console.log(result); // { value: 81, done: false }
result = nineTimesTable.next();
console.log(result); // { value: undefined, done: true }
```

매 반복 실행에서 `value`를 반환하지만 동시에 `done`으로 해당 함수가 `yield` 결과 없이 종료되었는지 확인할 수 있다. 마지막에 별도의 return 값이 없기 때문에 `value`가 `undefined`가 된다.

이런 이터레이터의 반환 특징을 이용하면 다음과 같이 iterator를 호출하는 함수를 작성할 수 있다.

```js
function caller(iter) {
  var result, value;
  while(result = iter.next()) {
    if(result.done) break;
    value = result.value || value;
  }
  return value;
}

var result = caller(nTimesTable(3));
console.log(result); // 27
```

`done`이 `true`를 반환할 때까지 해당 이터레이터를 실행해 결과값을 가져오는 `caller`를 작성했다. 만약 매 반복에서 특정 함수를 실행하고 싶다면 다음처럼 작성할 수 있다. 앞서 작성한 `nTimesTable` 함수가 더 많은 내용을 반환하도록 수정했다.

```js
function * nTimesTable(n) {
  for(var i = 1; i <= 9; i++) yield { n: n, i: i, result: n * i };
}

function caller(iter, func) {
  var result, value;
  while(result = iter.next()) {
    if(result.done) break;
    value = result.value || value;
    if(func) func(value);
  }
  return value;
}

caller(nTimesTable(3), value => {
  console.log('%d x %d = %d', value.n, value.i, value.result);
});
```

앞서 작성한 `caller`는 제너레이터 내의 yield에 대해서는 처리를 하지 못한다. 제너레이터에서 이터레이터를 반환하고 진행을 중단했을 때 해당 이터레이터를 처리해서 다시 반환해야 한다. 결과를 넣고 다시 진행할 수 있도록 작성해야 하는 것이다.

```js
function* getAnimalInCage() {
  yield "Wombat";
  yield "Koala";
  return "Kangaroo";
}

function* Cage() {
  var cageAnimals = getAnimalInCage();

  var first = yield cageAnimals;
  var second = yield cageAnimals;
  var third = yield cageAnimals;

  console.log(first, second, third);
}
```

이 `Cage` 제너레이터를 실행하면 `yield`를 3번 사용했기 때문에 최종 `console.log`가 출력하는 결과를 보기까지 4번에 걸쳐 실행된다.

```js
var cage = Cage();
var firstStop = cage.next();
// {value: iterator, done: false}
```

첫 번째 `yield` 결과가 `firstStop`에 저장되었다. cageAnimals는 위에서 코드에서와 같이 `getAnimalInCage` 제너레이터가 생성한 이터레이터다. 이 이터레이터에 `next()` 메소드로 값을 받은 후, 그 값을 다시 `first` 변수에 다음과 같이 반환한다.

```js
var firstAnimal = firstStop.value.next();
// firstAnimal: {value: "Wombat", done: false}
var secondStop = cage.next(firstAnimal.value);
```

`next`의 인자값으로 첫 결과인 Wombat을 넣었다. 이전에 멈췄던 위치인 첫 번째 yield로 돌아가 함수 내 `first`에는 Wombat이 저장된다. 나머지도 동일하게 진행된다.

```js
var secondAnimal = secondStop.value.next();
// secondAnimal: { value: 'Koala', done: false }

var thirdStop = cage.next(secondAnimal.value);
var thirdAnimal = thirdStop.value.next();
// thirdAnimal: { value: 'Kangaroo', done: true }

var lastStop = cage.next(thirdAnimal.value);

// Wombat Koala Kangaroo
```

마지막 Kangaroo는 yield가 아닌 return이기 때문에 done이 `true`를 반환한다. 앞서 직접 호출해서 확인한 코드는 반환하는 값이나 호출하는 형태가 일정한 것을 볼 수 있다. 즉 재사용 가능한 형태로 만들 수 있다는 의미다.

다음은 `catchEscapedAnimal()`과 `getTodaysZookeeper()` 함수를 이용한 `Zoo` 제너레이터 예시다.

```js
function catchEscapedAnimal() {
  return function(done) {
    setTimeout(function() {
      done(null, {name: 'Kuma', type: 'Bear'});
    }, 1000);
  };
}

function* getTodaysZookeeper() {
  yield {status: 'loading'};
  return {status: 'loaded', name: 'Edward'};
}

function* Zoo() {
  var animal = yield catchEscapedAnimal();
  var zookeeper = yield getTodaysZookeeper();

  console.log('%s catches by %s', animal.name, zookeeper.name);
}
```

`catchEscapedAnimal()`은 ajax를 사용하는 경우를 가정해서 `setTimeout`을 이용해 콜백을 호출하는 형태로 작성되었다. `getTodaysZookeeper()`는 일반적인 제너레이터 함수로 첫 호출에는 loading을, 두번째 호출에서 최종 값을 전송한다. `Zoo`도 앞에서 본 `Cage`처럼, 중간에 yield를 사용한다. 이 함수를 처리하기 위한 `compose` 함수는 다음과 같다.

```js
function compose(iter, value, next) {
  var result = iter.next(value);
  if(result.done) return next ? next(value) : value;
  else if(typeof result.value == 'function') {
    return result.value(function(err, data) {
      if(err) throw err;
      compose(iter, data);
    });
  } else if(typeof result.value.next == 'function') {
    var _iter = iter;
    next = function(result){
      compose(_iter, result);
    };
    iter = result.value;
    result = iter.next();
  }
  return compose(iter, result.value, next);
}
```

이 `compose` 함수는 다음과 같은 경우의 수를 다룬다.

  * `yield` 된 값이 함수일 때, 호출 체인을 연결할 수 있도록 `next` 함수를 넘겨줌 (기존 callback 방식)
  * `yield` 된 값이 이터레이터일 때, 이터레이터가 done을 반환할 때까지 호출한 후 최종 값을 반환
  * 그 외의 결과를 반환할 때, 해당 값을 이터레이터에 넣고 다시 `compose`를 호출
  * 이터레이터가 종료(`done == true`)되었을 때, `next` 함수가 있다면 해당 함수로 호출을 진행하고 없으면 최종 값을 반환하고 종료

이 함수를 이용한 결과는 다음과 같다. `setTimeout()`에 의해 중간 지연이 진행되는 부분도 확인할 수 있다.

```js
compose(Zoo());
// Kuma catches by Edward
```

## 제너레이터를 코루틴으로, [co][1]

나름 잘 동작하지만 흐름을 보기 위해서 만든 함수라서 허술한 부분이 많다. 이런 부분에서 사용할 수 있는 것이 바로 [co][1]다. co는 제너레이터를 코루틴처럼 사용할 수 있도록 돕는 라이브러리로 앞서 작성했던 `compose` 함수와 같은 역할을 한다.

```js
var co = require('co');
co(Zoo());
// Kuma catches by Edward
```

이 라이브러리는 내부적으로 Promise 패턴을 사용하고 있어서 callback이든 Promise든 제너레이터든 모두 잘 처리한다. 실제로 제너레이터를 사용하고 싶다면 이 라이브러리를 사용하는 것이 큰 도움이 된다.

## Koa

Koa는 앞서 이야기한 co 라이브러리를 기본적으로 적용하고 있는 HTTP 미들웨어 라이브러리로 경량에 간단한 기능을 제공하는 것을 특징으로 한다. 제너레이터를 기본적으로 사용할 수 있어서 앞서 배운 내용을 손쉽게 적용할 수 있다.

코드를 작성하기에 앞서 간단하게 koa를 설치한다.

```bash
$ npm install --save koa
```

Hello World를 작성하면 다음과 같다.

```js
var koa = require('koa');
var app = koa();

app.use(function* () {
  this.body = {"message": "Hello World"};
});

app.listen(3000);
```

이제 <http://localhost:3000>에 접속하면 해당 json이 출력되는 것을 확인할 수 있다.

앞서 작성한 코드도 포함해보자.

```js
var koa = require('koa');
var app = koa();

function catchEscapedAnimal() {
  return function(done) {
    setTimeout(function() {
      done(null, {name: 'Kuma', type: 'Bear'});
    }, 50);
  };
}

function* getTodaysZookeeper() {
  yield {status: 'loading'};
  return {status: 'loaded', name: 'Edward'};
}

function* Zoo() {
  var animal = yield catchEscapedAnimal();
  var zookeeper = yield getTodaysZookeeper();

  this.body = { message: animal.name + ' catches by ' + zookeeper.name };
}

app.use(Zoo);
app.listen(3000);
```

Koa의 모든 추가 기능은 미들웨어 구조로 제너레이터를 통해 작성하게 된다. callback은 물론 Promise 패턴도 더 깔끔하게 사용할 수 있다.

요청과 응답은 모두 `this`에 주입되서 전달되고 흐름은 첫 인자에 `next`를 추가해 제어할 수 있다. 요청에 대한 응답 내용이 있으면 `ok`를 추가해보자.

```js
app.use(function* (next) {
  yield next;
  if(this.body) {
    this.body.ok = true;
  } else {
    this.body = { ok : false };
  }
});
```

다음과 같은 방식으로 토큰 검증도 가능하다.

```js
app.use(function* (next) {
  var requestToken = this.request.get("Authorization");
  var accessToken = yield AccessTokensModel.findAccessTokenAsync(token);
  if(accessToken) {
    yield next;
  } else {
    this.body = { error: 'invalid_token' };
  }
});
```

세부적인 내용은 [koa 웹페이지][2]에서 다루고 있다. 단순하고 간편한 기능을 원한다면 꼭 살펴보자. 실제 사용하게 될 때는 [koa-bodyparser][3], [koa-router][4]와 같은 패키지를 같이 사용하게 된다. 패키지 목록은 [koa 위키][5]에서 확인할 수 있다.

제너레이터도 충분히 편한 기능이지만 koa는 현재 await/async 문법을 지원하기 위한 다음 버전 개발이 진행되고 있다. 더 가독성도 높고 다른 언어에서 이미 구현되어 널리 사용되고 있는 문법이라 더 기대된다.

* * *

## 더 읽을 거리

  * [ES6 In Depth: 제너레이터(Generator)][6]
  * [ECMAScript 6의 generator][7]
  * [ES6시대의 JavaScript: Generator][8]
  * [자바스크립트와 비동기 오류 처리][9]
  * [MDN: function*][10]
  * [MDN: Iterators and generators][11]
  * [MDN: Generator][12]
  * [Koa][2]
  * [co][1]

 [1]: http://github.com/tj/co
 [2]: http://koajs.com
 [3]: https://github.com/koajs/body-parser
 [4]: https://github.com/alexmingoia/koa-router
 [5]: https://github.com/koajs/koa/wiki
 [6]: http://hacks.mozilla.or.kr/2015/08/es6-in-depth-generators/
 [7]: https://blog.outsider.ne.kr/979
 [8]: https://gist.github.com/marocchino/841e2ff62f59f420f9d9#generator
 [9]: http://blog.coderifleman.com/post/102749244059/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EC%99%80-%EB%B9%84%EB%8F%99%EA%B8%B0-%EC%98%A4%EB%A5%98-%EC%B2%98%EB%A6%AC
 [10]: https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/function*
 [11]: https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Iterators_and_Generators
 [12]: https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Generator