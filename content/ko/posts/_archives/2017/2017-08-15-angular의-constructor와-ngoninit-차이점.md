---
title: Angular의 constructor와 ngOnInit 차이점
author: haruair
type: post
date: "2017-08-15T10:38:24"
history:
  - 
    from: https://www.haruair.com/blog/3989
    movedAt: 2018-09-13T22:02:42+00:00
lang: ko
slug: difference-between-angular-constructor-and-ngoninit
  - 번역
tags:
  - 개발 이야기
  - angularjs
  - js
  - constructor
  - lifecycle
  - ngOnInit
  - 생애주기

---
[Todd Motto][1]의 글 [Angular constructor versus ngOnInit][2]를 번역했다.

* * *

## Angular의 constructor와 ngOnInit 차이점

Angular는 [여러 생애주기 훅][3]이 존재하지만 여전히 `constructor`도 있다. 이 글에서는 `ngOnInit` 생애주기 훅과 차이점을 확인한다. 이 차이는 Angular를 처음 시작할 때 혼란하게 만드는 근원이다.

왜 `constructor`를 사용할 수 있는데도 생애주기 훅인 `ngOnInit`을 사용해야 할까?

### 차이점은 무엇인가

ES6의 `constructor`메소드 (여기서는 타입스크립트)는 Angular의 기능이 아니라 클래스 자체의 기능이다. `constructor`가 호출되는 시점은 Angular의 제어 바깥에 있다. 즉, Angular가 컴포넌트를 초기화 했는지 알기에는 적합하지 않은 위치다.

`constructor`를 살펴보자.

```js
import { Component } from '@angular/core';

@Component({})
class ExampleComponent {
  // 이 부분은 Angular가 아닌
  // 자바스크립트에서 실행
  constructor() {
    console.log('Constructor initialised');
  }
}

// 생성자(constructor)를 내부적으로 호출
new ExampleComponent();
```

`constructor`를 호출하는 주체가 Angular가 아닌 자바스크립트 엔진이라는 점이 중요하다. 그런 이유로 `ngOnInit`(AngularJS에서는 `$onInit`) 생애주기 훅이 만들어졌다.

생애주기 훅을 추가하면서 Angular는 컴포넌트가 생성된 후에 설정을 마무리하기 위한 메소드를 한 차례 실행할 수 있게 되었다. 이름에서 알 수 있는 것처럼 컴포넌트의 _생애주기_를 다루는데 사용한다.

```js
import { Component, OnInit } from '@angular/core';

@Component({})
class ExampleComponent implements OnInit {
  constructor() {}

  // Angular에서 필요에 맞게 호출
  ngOnInit() {
    console.log('ngOnInit fired');
  }
}

const instance = new ExampleComponent();

// 필요할 때 Angular에서 호출
instance.ngOnInit();
```

### Constructor 용도

생애주기 훅을 사용해야 하는 경우도 있지만 `constructor`를 사용해야 적합한 시나리오도 있다. 이 생성자는 의존적인 코드를 컴포넌트에 전달하는 의존성 주입을 하기 위해서는 필수적으로 필요하다.

`constructor`는 자바스크립트 엔진에 의해 초기화 되는데 타입스크립트에서는 Angular에 의존성이 어느 프로퍼티에 적용되는지 직접 지정 안하고도 사용할 수 있다.

```js
import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({})
class ExampleComponent {
  constructor(
    private router: Router,
    private el: ElementRef
  ) {}
}
```

> [Angular의 의존성 주입은 여기서 더 읽을 수 있다][4]. 

위 코드는 `Router`를 `this.router`에 넣고 컴포넌트 클래스에서 접근할 수 있도록 한다.

### ngOnInit

`ngOnInit`은 순수하게 Angular가 컴포넌트 초기화를 완료했다는 점을 전달하기 위해 존재한다.

이 단계는 컴포넌트에 프로퍼티를 지정하고 첫 변경 감지가 되는 범위까지 포함되어 있다. `@Input()` [데코레이터][5]를 사용하는 경우를 예로 들 수 있다.

`@Input()` 프로퍼티는 `ngOnInit` 내에서 접근 가능하지만 `constructor`에서는 `undefined`를 반환하는 방식으로 디자인되어 있다.

```js
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({})
class ExampleComponent implements OnInit {
  @Input()
  person: Person;

  constructor(
    private router: Router,
    private el: ElementRef
  ) {
    // undefined
    console.log(this.person);
  }

  ngOnInit() {
    this.el.nativeElement.style.display = 'none';
    // { name: 'Todd Motto', location: 'England, UK' }
    console.log(this.person);
  }
}
```

`ngOnInit` 생애주기 훅은 바인딩한 값을 읽을 수 있다고 _보장할 수 있는_ 상황에서 호출된다.

 [1]: https://twitter.com/toddmotto
 [2]: https://toddmotto.com/angular-constructor-ngoninit-lifecycle-hook
 [3]: https://angular.io/docs/ts/latest/guide/lifecycle-hooks.html
 [4]: https://toddmotto.com/angular-dependency-injection
 [5]: https://toddmotto.com/angular-decorators