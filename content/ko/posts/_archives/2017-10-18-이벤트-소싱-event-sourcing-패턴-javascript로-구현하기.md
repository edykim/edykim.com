---
title: 이벤트 소싱 event-sourcing 패턴 JavaScript로 구현하기
author: haruair
type: post
date: "2017-10-18T00:52:04"
history:
  - 
    from: https://www.haruair.com/blog/4014
    movedAt: 2018-09-13T22:02:42+00:00
lang: ko
slug: event-sourcing-implementing-eventsourcing-patterns-with-javascript
categories:
  - 개발 이야기
tags:
  - event sourcing

---
얼마 전 [이벤트 소싱 패턴에 대한 글][1]을 작성했다. 글을 읽고나서 js로 간략하게 구현해봤던 내용을 글로 정리했다. 개념을 나눠 설명하기 위해 CQRS 부분은 다른 글을 통해 덧붙이려고 한다. 여기서 사용하는 구현은 프로덕션에서 사용하기에 부족한 점이 많기 때문에 개념 이해에 중점을 맞춰 코드를 보면 좋겠다. 여기서는 은행 계좌를 예시로 작성했으며 구현하는 부분은 다음과 같다.

  * `AggregateRoot`: 이벤트가 반영될 집합체
  * `BankAccount`: 집합체 구현
  * `*Event`: 각각의 이벤트
  * `EventSourcingRepository`: 이벤트를 사용해서 데이터를 다루는 리포지터리 클래스
  * `InMemoryForTestingEventStore`: 이벤트 저장소 동작을 확인하기 위한 클래스
  * `EventStoreData`: 이벤트 저장소에서 저장되는 데이터 개체 클래스

전체 코드는 [gist][2]에서 확인할 수 있으며 [jsbin.com][3]에서 테스트해볼 수 있다.

* * *

가장 먼저 집합체를 구현한다. 집합체는 일련의 이벤트를 투영할 수 있는 개체다. 은행 계좌를 열고, 닫고, 입출금을 한다면 그 정보의 집합체는 은행 계좌가 될 것이다. 먼저 `AggregateRoot` 클래스를 작성한다. 이 클래스는 이벤트를 받고 해당 메소드를 호출한다. js는 메서드 오버로딩이 없기 때문에 `handle(event)` 메소드가 `apply{이벤트명}` 메소드를 찾는다.

```js
class AggregateRoot {
    apply(event) {
        this.handle(event)
        return this
    }

    handle(event) {
        var eventName = event.constructor.name
        var eventMethod = `apply${eventName}`

        if (! this[eventMethod]) {
            throw new TypeError(`${eventMethod} is not a function`)
        }

        this[eventMethod](event)
    }
}
```

은행계좌를 개설하는 이벤트를 작성한다.

```js
class OpenedEvent {
    constructor(id: number, name: string) {
        this.id = id
        this.name = name
    }
}
```

은행 계좌 클래스를 추가한다. 이 클래스로 생성한 개체가 집합체가 되며 이벤트를 통해 갱신된다.

```js
class BankAccount extends AggregateRoot {
    static open(id: number, name: string) {
        var bankAccount = new BankAccount
        bankAccount.apply(new OpenedEvent(id, name))
        return bankAccount
    }

    applyOpenedEvent(event) {
        this.id = event.id
        this.name = event.name

        this.closed = false
        this.balance = 0
    }
}
```

아래 예제에서 이벤트로 프로퍼티가 갱신되는 것을 확인할 수 있다.

```js
var bankAccount = BankAccount.open(123456, 'Koala')
console.log(bankAccount.id, bankAccount.name) // 123456, 'Koala'
```

이제 여러 이벤트를 추가한다.

```js
class WithdrawnEvent {
  constructor(id: number, amount: number) {
    this.id = id
    this.amount = amount
  }
}

class DepositedEvent {
  constructor(id: number, amount: number) {
    this.id = id
    this.amount = amount
  }
}

class ClosedEvent {
  constructor(id: number) {
    this.id = id
  }
}
```

메소드도 추가한다.

```js
class BankAccount extends AggregateRoot {
    // ... 이전 코드
    withdraw(amount) {
        if (this.closed) {
            throw new Error(`${this.id} account is closed.`)
        }
        this.apply(new WithdrawnEvent(this.id, amount))
        return this
    }

    deposit(amount) {
        if (this.closed) {
            throw new Error(`${this.id} account is closed.`)
        }
        this.apply(new DepositedEvent(this.id, amount))
        return this
    }

    close() {
        if (!this.closed) {
            this.apply(new ClosedEvent(this.id))
        }
        return this
    }

    applyWithdrawnEvent(event) {
        this.balance -= event.amount
    }

    applyDepositedEvent(event) {
        this.balance += event.amount
    }

    applyClosedEvent(event) {
        this.closed = true
    }
}
```

```js
var bankAccount = BankAccount.open(123456,  'Koala')
  .deposit(10000)
  .withdraw(1000)
  .deposit(3000)
  .close()

console.log(bankAccount.name, bankAccount.balance, bankAccount.closed ? 'closed' : 'opened')
// Koala 12000 closed
```

집합체를 사용해서 내부적으로는 이벤트를 통해 데이터가 갱신되고 있지만 개체의 일반적인 사용과 큰 차이가 없는 것을 확인할 수 있다. 각각의 메소드는 실제로 개체의 정보를 갱신하지 않고 이벤트를 생성하는 역할만 하며 이벤트를 적용하는 `apply*` 메소드에서만 실질적인 변화가 일어나고 있다.

정말 이 은행 계좌는 일련의 이벤트로 결과를 얻을 수 있을까? 다음 예를 보면 알 수 있다.

```js
var events = [
    new OpenedEvent(123456, 'Koala'),
    new DepositedEvent(123456, 10000),
    new WithdrawnEvent(123456, 1000),
    new DepositedEvent(123456, 3000),
    new ClosedEvent(123456),
]

var bankAccount = new BankAccount
events.forEach(event => bankAccount.apply(event))

console.log(bankAccount.name, bankAccount.balance, bankAccount.closed ? 'closed' : 'opened')
// Koala 12000 closed
```

동일한 결과를 확인할 수 있다. 위 코드는 `AggregateRoot`에 다음처럼 추가한다.

```js
class AggregateRoot {
    // ... 이전 코드
    initializeState(events) {
        events.forEach(event => this.apply(event))
    }
}
```

이제 일련의 이벤트를 다루고 저장할 수 있도록 리포지터리를 만든다.

```js
class EventSourcingRepository {
    constructor(eventStore, aggregateType) {
        this.eventStore = eventStore
        this.aggregateType = aggregateType
    }

    load(id) {
        var events = this.eventStore.load(id)

        var aggregate = Object.create(this.aggregateType.prototype)
        aggregate.initializeState(events)
        return aggregate
    }

    save(aggregate) {
        var uncommittedEvents = aggregate.getUncommittedEvents()
        this.eventStore.append(uncommittedEvents)
    }
}
```

저장하지 않은 이벤트를 가져올 수 있도록 `getUncommittedEvents()`를 `AggregateRoot`에 구현한다. 또한 상태 초기화 시 저장하지 않은 이벤트로 다루지 않도록 `initializeState` 메소드도 변경한다.

```js
class AggregateRoot {
    // ...
    uncommittedEvents = []

    getUncommittedEvents() {
        var events = this.uncommittedEvents
        this.uncommittedEvents = []
        return events
    }

    apply(event) {
        this.handle(event)
        this.uncommittedEvents.push(event)
        return this
    }

    initializeState(events) {
        events.forEach(event => this.handle(event))
    }
}
```

여기서는 예로 간단한 이벤트 저장소를 구현해서 사용한다. 이벤트를 저장하기 위한 구조로 `EventStoreData`를 다음처럼 작성한다.

```js
class EventStoreData {
    constructor(rootId, event, createdAt) {
        this.rootId = rootId
        this.event = event
        this.createdAt = createdAt
    }
}
```

이벤트가 데이터베이스에 저장될 때 `EventStoreData`의 정의대로 저장된다고 생각해보자. 관계형 데이터베이스를 예로 든다면 이 클래스가 테이블의 스키마를 반영하고 있다고 볼 수 있다. 다음은 이 개체를 그대로 메모리에서 사용하는 예제 이벤트 저장소 클래스다.

```js
class InMemoryForTestingEventStore {
    constructor(events) {
        this.data = events ? this.convertEvents(events) : []
    }

    load(rootId) {
        return this.data
            .filter(data => data.rootId === rootId)
            .map(data => data.event)
    }

    append(events) {
        var newData = this.convertEvents(events)
        this.data = this.data.concat(newData)
    }

    convertEvents(events) {
        return events.map(event => this.convertEventToData(event))
    }

    convertEventToData(event) {
        var createdAt = new Date().getTime()
        return new EventStoreData(event.id, event, createdAt)
    }
}
```

다음처럼 리포지터리로 저장하고 불러올 수 있게 되었다.

```js
var eventStore = new InMemoryForTestingEventStore()
var repository = new EventSourcingRepository(eventStore, BankAccount)

var bankAccount = BankAccount.open(654321,  'Edward')
  .deposit(20000)
  .withdraw(1000)
  .withdraw(1000)

repository.save(bankAccount)
```

```js
var loaded = repository.load(654321)
console.log(bankAccount.name, bankAccount.balance, bankAccount.closed ? 'closed' : 'opened')
// Edward 18000 opened
```

`eventStore`에 저장된 이벤트 저장소 데이터를 살펴보면 이 동작이 좀 더 와닿는다.

```js
console.log(eventStore.data)
```

<img src="https://user-images.githubusercontent.com/1009457/31695810-79fa95e2-b3f8-11e7-86d1-bab9752efab4.png?w=660&#038;ssl=1" alt="eventStore.data" data-recalc-dims="1" />

* * *

앞에서도 말했지만 여기서 사용하는 구현은 프로덕션에서 사용하기에 부족한 점이 많다. 예를 들면 AggregateRoot에 최종 일관성을 확인하기 위한 version도 구현되어 있지 않고 EventData에 id도 정의되어 있지 않다. 패턴에 대해 이해가 되었다면 실제로 구현한 패키지를 확인하면 도움이 된다.

그리고 CQRS 패턴을 함께 사용하지 않는다면 이벤트소싱은 반쪽에 불과하다. 여기서 살펴본 이벤트소싱에 더해 CQRS를 적용하면 유연하고 강력한 아키텍처를 구성할 수 있다. CQRS 패턴은 다음 글에서 살펴보려고 한다.

 [1]: http://www.haruair.com/blog/4008
 [2]: https://gist.github.com/haruair/7da296b853e0866a9d2fdeb9372bc99c
 [3]: http://jsbin.com/memidopike/edit?js,console