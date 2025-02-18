---
title: 마트가서 우유 하나 사고 아보카도 있으면 6개 사와
author: haruair
type: post
date: 2024-05-08T17:13:25
lang: ko
slug: milk-and-avocado
tags:
  - 개발 잡동사니
---

"마트가서 우유 하나 사고 아보카도 있으면 6개 사와" 요즘 숏폼으로도 많이
돌아다니길래 재미삼아서. 가장 먼저 코드를 작성하기 전에 요구사항을 잘
읽는다.

- 마트가서: 가야 할 장소
- 우유 하나 사고: 품목과 수량, 수행해야 할 작업
  - 사고: AND
- 아보카도: 품목
  - 있으면: 조건 (있으면 사고 없으면 안사도 되는)
  - 6개 사와: 수량과 수행해야 할 작업

정리하면

- 구입할 물건과 수량: 우유 1개, 아보카도 6개
- 구입해야 하는 장소: 마트
- 조건: 아보카도는 있으면 구입

명시되지 않은 상황과 조건은 다시 확인이 필요하다.

- 우유는 없고 아보카도만 있으면 아보카도만이라도 사올지
- 마트 간 곳에 우유가 없으면 다른 마트라도 가서 우유 사와야 하는지

```javascript
// 마트가서 우유 하나 사고 아보카도 있으면 6개 사와

function okJob1(person, place) {
    person.purchase("milk", 1, place)
    if (place.has("avocado")) {
        person.purchase("avocado", 6, place)
    }
}

function okJob2(person, place) {
    person.purchase("milk", 1, place)
    place.has("avocado") && person.purchase("avocado", 6, place)
}

function buggyJob(person, place) {
    // 아보카도가 있으면 우유 6개 사온다는 설정은
    // 코드로 봐도 좀 이상한 결정인 것 같은데
    // 세상은 넓고 요구사항은 다양하니까...
    person.purchase("milk", place.has("avocado") ? 6 : 1, place)
}
```

대략 이런 구현을 사용해서 일을 잘 정리했는지 테스트해본다.

```javascript
class Location {
    constructor(name, inventory) { this.name = name; this.inventory = inventory; }
    has(item) { return this.inventory.includes(item); }
}

class Person {
    constructor(name) { this.name = name; }
    purchase(item, count, location) {
        console.log(`${this.name} purchased ${count} ${item} from ${location.name}.`)
    }
}

const memberOfHousehold = new Person("Spouse");
const marketWithAvocado = new Location("market", ["milk", "avocado"]);
const marketWithoutAvocado = new Location("market", ["milk"]);
```

```javascript
okJob1(memberOfHousehold, marketWithAvocado);
// Spouse purchased 1 milk from market.
// Spouse purchased 6 avocado from market.

okJob1(memberOfHousehold, marketWithoutAvocado);
// Spouse purchased 1 milk from market.

okJob2(memberOfHousehold, marketWithAvocado);
// Spouse purchased 1 milk from market.
// Spouse purchased 6 avocado from market.

okJob2(memberOfHousehold, marketWithoutAvocado);
// Spouse purchased 1 milk from market.

buggyJob(memberOfHousehold, marketWithAvocado);
// Spouse purchased 6 milk from market.

buggyJob(memberOfHousehold, marketWithoutAvocado);
// Spouse purchased 1 milk from market.
```

간 김에 이것저것 장을 많이 봐서 올 것 같은데. 내일 아침은 아보카도 토스트
해야겠다.

