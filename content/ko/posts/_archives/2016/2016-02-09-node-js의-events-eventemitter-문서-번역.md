---
title: Node.js의 Events `EventEmitter` 번역
author: haruair
type: post
date: "2016-02-09T05:00:57"
history:
  - 
    from: https://www.haruair.com/blog/3396
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: events-eventemitter-translation-in-node.js
categories:
  - 개발 이야기
  - 번역
tags:
  - eventemitter
  - nodejs
  - js


---
`EventEmitter`는 Node.JS에 내장되어 있는 일종의 옵저버 패턴 구현이다. node 뿐만 아니라 대부분의 프레임워크나 라이브러리에서 이 구현을 쓰거나 유사한 구현을 활용하고 있는 경우가 많다. DOM Event Listener를 사용해본 경험이 있다면 사실 특별하게 새로운 기능은 아니지만, 요즘 이 패턴으로 작성된 라이브러리가 많고 특히 node 코어 라이브러리도 이 구현을 사용한 경우가 많아 살펴볼 만한 내용이다.

물론 Node 뿐만 아니라 front-end 환경에서도 [Olical/EventEmitter][1]와 같은 구현을 통해 손쉽게 활용할 수 있다.

이 글은 [Node.js v5.5.0의 Events 문서][2]를 기준으로 번역했고 버전에 따라 내용이 변경될 수 있다.

* * *

# [이벤트][2]

Node.js의 코어 API 대부분은 관용적으로 비동기 이벤트 기반 아키텍처를 사용해서 만들어졌다. (&#8220;에미터 emitter&#8221;로 불리는) 어떤 종류의 객체를 이벤트 이름으로 정의된 특정 이벤트에 정기적으로 전달해 &#8220;리스너 listener&#8221;로 불리는 함수 객체를 실행한다.

예를 들어 [`net.Server`][3] 객체는 매번 사용자가 접속할 때마다 이벤트를 호출하고 [`fs.ReadStream`][4]은 파일을 열 때마다 이벤트를 호출한다. [stream][5]은 어떤 데이터든 데이터를 읽을 수 있는 상황이 되면 이벤트를 호출한다.

이벤트를 내보내는 모든 객체는 `EventEmitter` 클래스의 인스턴스다. 이 객체는 하나 이상의 함수를 이벤트로 사용할 수 있도록 이름을 넣어 추가하는 `eventEmiter.on()` 함수를 사용할 수 있다. 이벤트 이름은 일반적으로 카멜 케이스로 작성된 문자열이지만 JavaScript의 프로퍼티 키로 사용할 수 있는 모든 문자열을 사용할 수 있다.

`EventEmitter` 객체로 이벤트를 호출할 때, 해당 이벤트에 붙어 있는 모든 함수는 _동기적_으로 호출된다. 호출을 받은 리스너가 반환하는 결과는 어떤 값이든 _무시_되고 폐기된다.

다음은 `EventEmitter` 인스턴스를 단일 리스너와 함께 작성한 예다. `eventEmitter.on()` 메소드는 리스너를 등록하는데 사용한다. 그리고 `eventEmitter.emit()` 메소드를 통해 등록한 이벤트를 호출할 수 있다.

```js
const EventEmitter = require('events');
const util = require('util');

function MyEmitter() {
  EventEmitter.call(this);
}
util.inherits(MyEmitter, EventEmitter);

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
myEmitter.emit('event');
```

어떤 객체든 상속을 통해 `EventEmitter`가 될 수 있다. 위에서 작성한 예는 `util.inherits()` 메소드를 사용했으며 이는 프로토타입으로 상속하는 방법으로 전통적인 Node.js 스타일이다. ES6 클래스 문법으로도 다음과 같이 사용할 수 있다:

```js
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
myEmitter.emit('event');
```

## 인자와 `this`를 리스너에 전달하기

`eventEmitter.emit()` 메소드는 인자로 받은 값을 리스너 함수로 전달한다. 이 과정에서 기억해야 할 부분이 있는데 일반적으로 `EventEmitter`를 통해 호출되는 리스너 함수 내에서는 `this`가 이 리스너 함수를 부착한 `EventEmitter`를 참조하도록 의도적으로 구현되어 있다.

```js
const myEmitter = new MyEmitter();
myEmitter.on('event', function(a, b) {
  console.log(a, b, this);
    // Prints:
    //   a b MyEmitter {
    //     domain: null,
    //     _events: { event: [Function] },
    //     _eventsCount: 1,
    //     _maxListeners: undefined }
});
myEmitter.emit('event', 'a', 'b');
```

ES6의 Arrow 함수를 리스너로 사용하는 것은 가능하지만 이 기능의 명세대로 이 함수 내에서의 `this`는 더이상 `EventEmitter` 인스턴스를 참조하지 않는다:

```js
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
    // Prints: a b {}
});
myEmitter.emit('event', 'a', 'b');
```

## 비동기 vs. 동기

`EventListener`는 모든 리스너를 등록한 순서대로 동기적으로 처리한다. 즉 이벤트를 적절한 순서로 처리하는 것을 보장해 경쟁 조건(race condition)이나 로직 오류를 피하는 것이 중요하다. 이 모든 것이 적절하게 구현되었을 때, `setImmediate()`이나 `process.nextTick()`메소드를 사용해 리스너 함수를 비동기도 동작하도록 전환할 수 있다.

```js
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('this happens asynchronously');
  });
});
myEmitter.emit('event', 'a', 'b');
```

## 단 한 번만 동작하는 이벤트

`eventEmitter.on()` 메소드로 등록된 리스너는 이벤트 이름이 호출되는 _매 횟수만큼_ 실행된다.

```js
const myEmitter = new MyEmitter();
var m = 0;
myEmitter.on('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
  // Prints: 1
myEmitter.emit('event');
  // Prints: 2
```

`eventEmitter.once()`메소드로 등록한 리스너는 호출한 직후 제거되어 다시 호출해도 실행되지 않는다.

```js
const myEmitter = new MyEmitter();
var m = 0;
myEmitter.once('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
  // Prints: 1
myEmitter.emit('event');
  // Ignored
```

## 오류 이벤트

`EventEmitter` 인스턴스에서 오류가 발생했을 때의 전형적인 동작은 `'error'` 이벤트를 호출하는 것이다. 이 경우는 Node.js에서 특별한 경우로 다뤄진다.

오류가 발생한 `EventEmitter`에 `'error'` 이벤트로 등록된 리스너가 하나도 _없는_ 경우에는 오류가 던져지고(thrown) 스택 추적이 출력되며 Node.js의 프로세스가 종료된다.

```js
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
  // Throws and crashes Node.js
```

Node.js 프로세스가 멈추는 것을 막기 위해서는 `process.on('uncaughtException')` 이벤트에 리스너를
  
등록하거나 [`domain`][6] 모듈을 사용할 수 있다. (_하지만 `domain` 모듈은 더이상 사용하지 않는다(deprecated)_)

```js
const myEmitter = new MyEmitter();

process.on('uncaughtException', (err) => {
  console.log('whoops! there was an error');
});

myEmitter.emit('error', new Error('whoops!'));
  // Prints: whoops! there was an error
```

개발자가 항상 `'error'` 이벤트에 리스너를 등록하는 것이 가장 좋은 방법이다:

```js
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.log('whoops! there was an error');
});
myEmitter.emit('error', new Error('whoops!'));
  // Prints: whoops! there was an error
```

## 클래스: EventEmitter

`EventEmitter` 클래스는 `events` 모듈에 의해서 정의되고 제공된다.

```js
const EventEmitter = require('events');
```

모든 EventEmitters는 새로운 이벤트를 등록할 때마다 `'newListner'` 이벤트를 호출하고 리스너를 제거할 때마다 `'removeListner'`를 호출한다.

### 이벤트: &#8216;newListener&#8217;

  * `event` {String|Symbol} 이벤트명
  * `listener` {Function} 이벤트 처리 함수

`EventEmitter` 인스턴스는 인스턴스 자신의 `'newListener'` 이벤트를 리스너를 내부 리스너 배열에 _추가하기 전에_ 호출한다.

`'newListener'` 이벤트에 리스너가 전달되기 위해 이벤트 명칭과 추가될 리스너의 참조가 전달된다.

실제로 리스너가 추가되기 전에 이 이벤트가 호출된다는 점으로 인해 다음과 같은 중대한 부작용이 나타날 수 있다. 어떤 _추가적인_ 리스너든 동일한 `명칭`의 리스너를 `'newListener'` 콜백에서 먼저 등록한다면 추가하려는 해당 리스너가 실제로 등록되기 전에 이 함수가 먼저 추가될 것이다.

```js
const myEmitter = new MyEmitter();
// Only do this once so we don't loop forever
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // Insert a new listener in front
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
  // Prints:
  //   B
  //   A
```

### 이벤트: &#8216;removeListener&#8217;

  * `event` {String|Symbol} 이벤트명
  * `listener` {Function} 이벤트 처리 함수

`'removeListener'` 이벤트는 리스너가 _제거된 후_에 실행된다.

### EventEmitter.listenerCount(emitter, event)

안정성: 0 &#8211; 추천 안함: [`emitter.listenerCount()`][7]을 대신 사용할 것.

인자로 넘긴 `emitter`에 해당 `event`가 리스너를 몇 개나 갖고 있는지 확인하는 클래스 메소드다.

```js
const myEmitter = new MyEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(EventEmitter.listenerCount(myEmitter, 'event'));
  // Prints: 2
```

### EventEmitter.defaultMaxListeners

기본값으로 한 이벤트에 최대 `10`개 리스너를 등록할 수 있다. 이 제한은 각각의 `EventEmitter`의 인스턴스에서 [`emitter.setMaxListeners(n)`][8] 메소드로 지정할 수 있다. _모든_ `EventEmitter` 인스턴스의 기본값을 변경하려면 `EventEmitter.defaultMaxListeners` 프로퍼티를 사용할 수 있다.

`EventEmitter.defaultMaxListeners` 설정을 변경할 때는 _모든_ `EventEmitter` 인스턴스에게 영향을 주기 때문에 이 변경 이전에 만든 부분에 대해서도 주의해야 한다. 하지만 [`emitter.setMaxListeners(n)`][8]를 호출해서 설정한 값이 있다면 `EventEmitter.defaultMaxListeners`의 값보다 우선으로 적용된다.

참고로 이 값은 강제적인 제한이 아니다. `EventEmitter` 인스턴스는 제한된 값보다 더 많은 리스너를 추가할 수 있지만 `EventEmitter 메모리 누수의 가능성`이 있는 것으로 보고 stderr를 통해 경고를 보내 개발자가 문제를 인지할 수 있게 한다. 어떤 `EventEmitter`든 `emitter.getMaxListeners()`와 `emitter.setmaxListeners()` 메소드를 사용해 이 경고를 임시로 피할 수 있다:

```js
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // do stuff
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```

### emitter.addListener(event, listener)

`emitter.on(event, listener)`의 별칭이다.

### emitter.emit(event\[, arg1\]\[, arg2\][, &#8230;])

`event`에 등록된 리스너를 등록된 순서에 따라 동기적으로 호출한다. 제공되는 인자를 각각 리스너로 전달한다.

이벤트가 존재한다면 `true`, 그 외에는 `false`를 반환한다.

### emitter.getMaxListeners()

현재 `EventEmitter`에 지정된 최대 리스너 수를 반환한다. 기본값은 [`EventEmitter.defaultMaxListeners`][9]이며 [`emitter.setMaxListeners(n)`][8]로 변경했을 경우에는 그 값을 반환한다.

### emitter.listenerCount(event)

  * `event` {Value} The type of event
  * `event` {Value} 이벤트 이름

해당 `event` 이름에 등록되어 있는 리스너의 수를 반환한다.

### emitter.listeners(event)

해당 `event`에 등록된 리스너 배열의 사본을 반환한다.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
console.log(util.inspect(server.listeners('connection')));
  // Prints: [ [Function] ]
```

### emitter.on(event, listener)

`listener` 함수를 지정한 `event`의 리스너 배열 가장 끝에 추가한다. `listener`가 이미 추가되어 있는 함수인지 확인하는 과정이 없다. 같은 조합의 `event`와 `listener`를 여러 차례 추가했다면 추가한 만큼 여러번 호출된다.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
```

`EventEmitter`의 참조를 반환하기 때문에 연속해서 호출하는 것이(chaining) 가능하다.

### emitter.once(event, listener)

**일회성** `listener` 함수를 `event`에 등록한다. 이 이벤트는 다음 차례 `event`가 호출될 때 한 번만 실행한 후 제거된다.

```js
server.once('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

`EventEmitter`의 참조를 반환하기 때문에 연속해서 호출하는 것이 가능하다.

### emitter.removeAllListeners([event])

모든 리스너, 또는 지정한 `event`의 리스너를 제거한다.

코드 다른 곳에 추가되어 있는 리스너를 제거하는 것은 좋지 않은 방법이다. 특히 `EventEmitter` 인스턴스가 다른 컴포넌트나 모듈에서 생성되었을 때는 더 유의해야 한다. (예를 들어, 소켓이나 파일 스트림 등)

`EventEmitter`의 참조를 반환하기 때문에 연속해서 호출하는 것이 가능하다.

### emitter.removeListener(event, listener)

특정 `event`에 등록되어 있는 특정 `listener`를 제거한다.

```js
var callback = (stream) => {
  console.log('someone connected!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```

`removeListener`는 한 인스턴스 내에 존재하는 리스너 배열에서 해당 리스너를 하나 제거한다. 만약 한 리스너를 여러 차례 특정 `event`에 등록해서 배열 내 여러 개 존재한다면, 그 모든 리스너를 지우기 위해서는 `removeListener`를 여러 번 호출해야 한다.

이 메소드로 리스너가 하나 _지워진 후에_ 등록되어 있는 리스너의 위치 인덱스가 변경되는데 리스너가 내부 배열로 관리되기 때문이다. 이 동작은 리스너가 호출되는 순서에는 영향을 주지 않지만 `emitter.listeners()` 메소드로 생성한 리스너 배열의 사본이 있다면 다시 생성해야 할 필요가 있다.

`EventEmitter`의 참조를 반환하기 때문에 연속해서 호출하는 것이 가능하다.

### emitter.setMaxListeners(n)

EventEmitters의 기본값인 `10`보다 더 많은 리스너가 등록되어 있다면 경고가 출력된다. 이 함수는 어디에서 메모리 누수가 발생하는지 찾는데 유용하다. 명백하게도 모든 이벤트가 10개의 리스너 제한이 필요한 것은 아니다. `emitter.setMaxListeners()` 메소드를 사용하면 특정 `EventEmitter` 인스턴스에 대해 그 제한을 변경할 수 있다. `Infinity` (또는 ``)을 지정하면 리스너를 숫자 제한 없이 등록할 수 있다.

`EventEmitter`의 참조를 반환하기 때문에 연속해서 호출하는 것이 가능하다.

 [1]: https://github.com/Olical/EventEmitter
 [2]: https://nodejs.org/dist/v5.5.0/docs/api/events.html
 [3]: https://nodejs.org/dist/v5.5.0/docs/api/net.html#net_class_net_server
 [4]: https://nodejs.org/dist/v5.5.0/docs/api/fs.html#fs_class_fs_readstream
 [5]: https://nodejs.org/dist/v5.5.0/docs/api/stream.html
 [6]: https://nodejs.org/dist/v5.5.0/docs/api/domain.html
 [7]: https://nodejs.org/dist/v5.5.0/docs/api/events.html#events_emitter_listenercount_event
 [8]: https://nodejs.org/dist/v5.5.0/docs/api/events.html#events_emitter_setmaxlisteners_n
 [9]: https://nodejs.org/dist/v5.5.0/docs/api/events.html#events_eventemitter_defaultmaxlisteners