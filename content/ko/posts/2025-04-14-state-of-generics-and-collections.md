---
title: PHP 제네릭과 컬렉션 논의 현황
author: haruair
uuid: "3cc42410-9aeb-4a9f-8021-6795907b1a27"
type: post
date: 2025-04-14T08:07:02
lang: ko
slug: state-of-generics-and-collections
tags:
  - 개발 이야기
  - 번역
  - php
---

The PHP Foundationd에서 게시한 [State of Generics and Collections][1]를
번역했습니다.


## Table of Contents

# 제네릭과 컬렉션 현황

제네릭은 오랜 기간 동안 많은 PHP 개발자가 원했던 기능 중 하나입니다. 이 주제는
매번 Q&A 세션에서 언급되기도 합니다. 이 주제에 관해서 현재 상황과 함께 다양한
접근 방식에 대해 논의해보려고 합니다.

## 완전히 구체화된 제네릭

제네릭이 있다면 클래스를 선언할 때 프로퍼티와 메소드에 플레이스홀더를 활용할 수
있습니다. 이렇게 선언된 제네릭은 클래스가 인스턴스로 생성될 떄 타입이 결정되게
됩니다. 이 방식은 코드 재사용성을 높이고 여러 데이터 타입에서 타입 안정성을
제공하게 됩니다. "구체화된" 제네릭은 제네릭 타입에 대한 정보가 클래스 정의에
사용될 뿐만 아니라 제네릭 요구사항을 런타임에서도 강제하게 됩니다.

PHP의 문법으로 보면 이렇습니다.

```php
class Entry<KeyType, ValueType>
{
  public function __construct(protected KeyType $key, protected ValueType $value)
  {
  }

  public function getKey(): KeyType
  {
    return $this->key;
  }

  public function getValue(): ValueType
  {
    return $this->value;
  }
}

new Entry<int, BlogPost>(123, new BlogPost());
```

클래스로 인스턴스를 생성하면 다음과 같이 제네릭 타입으로 선언한 `KeyType`은
`int`로, `ValueType`은 `BlogPost`로 결정되어 해당 개체는 다음 클래스 정의와 같이
동작하게 됩니다.

```php
class IntBlogPostEntry
{
  public function __construct(protected int $key, protected BlogPost $value)
  {
  }

  public function getKey(): int
  {
    return $this->key;
  }

  public function getValue(): BlogPost
  {
    return $this->value;
  }
}
```

그동안 이 기능을 추가하기 위한 여러 번의 시도가 있었습니다. 2020/2021년에는
Nikita Popov의 [가장 포괄적인 실험 구현][2]이 있었고 2016년의 [RFC 초안][3],
그리고 이 주제에서 남아있는 과제를 정리한 [레딧 포스트][4] 등에서 그 시도를
확인해볼 수 있습니다.

2024년에 PHP 파운데이션의 지원 아래, Arnaud Le Blanc이 Nikita Popov의 구현을
출발점으로 [이 작업을 다시 시작][5]했습니다. 비록 많은 기술적인 이슈가 해결되긴
했지만 여전히 많은 부분이 풀리지 않은 상태입니다.

가장 큰 도전 과제는 타입 추론입니다. 제네릭을 활용하는데 있어서 코드가
장황해지는 경향이 있는데 매번 제네릭 타입이 참조될 때마다 타입 인자를 필요로
하기 때문입니다. 다음 예시를 보면 명확합니다.

```php
funciton f(List<Entry<int,BlogPost>> $entries): Map<int, BlogPost>
{
  return new Map<int, BlogPost>($entries);
}

function g(List<BlogPostId> $ids): List<BlogPost>
{
  return map<int, BlogostId, BlogPost>($ids, $repository->find(...));
}
```

타입 추론은 이처럼 장황한 부분을 컴파일러에서 적절한 타입을 자동으로 적용하는
방식으로 해결할 수 있습니다. 위 에시에서는 컴파일러가 반환 값인 `new Map()`과
`map()`을 보고서 알맞은 반환 타입을 자동으로 정할 수 있습니다. 다만 이런 접근
방식은 PHP에서 어렵습니다. Nikita에 따르면 PHP의 컴파일러는 주로 한번에 파일을
하나씩만 보는 등 아주 제한적으로 코드베이스를 읽기 때문에 쉽지 않습니다.

다음 예시를 고려해봅니다.

```php
class Box<T>
{
  public function __construct(public T $value) {}
}

new Box(getValue());
```

이 경우에는 `getValue()` 표현이 런타임에서 실제로 함수가 호출되기 전까지는 어떤
타입인지 확인할 수 없기 때문에 `new Box(...)`의 `T`를 컴파일 단계에서 추론하기
어렵습니다.

`T`를 런타임 기준으로 함수의 반환값을 사용할 수는 있겠지만 결과적으로 안정적이지
못한 타입 선언이 됩니다. 앞서 예시에서는 `new Box()`가 `getValue()`의 반환값
구현에 의존적인 상태가 되는데요. 의도와 다르게 불변적인 형태가 되어서 실제
코드에서는 그다지 유용하지 못한 형태가 될 수 있습니다.

```php
interface ValueInterface {]
class A implements ValueInterface {}
class B implements ValueInterface {}

function getValue(): ValueInterface
{
  return new A();
}

function doSomething(Box<ValueInterface> $box)
{
}

$box = new Box(getValue()); // 런타임: Box<A>, 정적: Box<ValueInterface>
doSomething($box); // Box<A>가 아닌 Box<ValueInterface>가 필요
```

타입은 컴파일 단계에서 구현에 의존하지 않은 정적 정보를 제공할 때 가장
유용합니다.

참고: 이 예제에서 `Box`는 불변이며 제네릭 클래스의 형태로 자주 구현됩니다. `X`와
`Y` 타입이 어떤 관계이든지 간에 `Box<X>`는 `Box<Y>`의 서브타입도, 수퍼타입도
아니라는 의미인데, 위 예시에서 `Box<A>`는 `Box<ValueInterface>`의 서브타입도
아니고 `doSomething()`이 `Box<A>`를 파라미터로 받을 수도 없다는 뜻입니다.

제네릭 클래스는 타입 플레이스홀더가 읽기(반환 타입 등)과 쓰기(파라미터 타입
등)에 함께 사용되면 불변이라고 합니다. 프로퍼티 타입은 읽기와 쓰기 모두에 위치할
수 있습니다.

다음 예시를 보면 좀 더 명확합니다.

```php
function changeValue(Box<ValueInterface> $box)
{
  $box->value = new B();
}
```

`changeValue()` 함수는 `Box<ValueInterface>`를 파라미터로 받기 때문에
`ValueInterface`의 어떤 서브타입이든 `$box->value`의 타입으로 배정될 수 있어야
합니다. 하지만 `Box<A>`를 전달한 후에 (`A`는 `ValueInterface`의 서브타입)
`ValueInterface`지만 `A`가 아닌 타입을 전달하게 되면 이 계약 관계가 준수되질
않습니다.

다른 제네릭 언어에서의 일반적인 해결 방법은 타입 파라미터에 직접 어떤
변성(variant)인지 직접 지정하는 방식으로 해결합니다. 일반적으로 `in` 또는 `out`등
단방향으로만 움직이도록, 파라미터나 반환 타입에 지정하는 방식을 활용합니다. 이런
방식으로 반공변성이나 공변성을 명시적으로 지정할 수 있습니다.

### 타입 추론의 하이브리드 접근 방식

이런 문제를 해결하기 위해서는 하이브리드 접근 방식이 필요한데, 즉 모든 정보가
가능하지 않은 컴파일 타임에 제네릭 파라미터에 대한 정적 타입 추론을 구현할 수
있어야 합니다. 다시 말하면 컴파일 타임에서 알 수 없는 타입을 심볼로만 표현하는
방식입니다 예를 들어 `getValue()`는 `fcall<getValue>` 식으로 표현할 수 있습니다.
심볼릭 타입은 런타임에서 함수와 클래스가 모두 불려온 이후에 해석되며
런타임에서의 전체 분석을 필요로 하기 때문에 일정량의 실행 비용을 소비하게
됩니다. 물론 이 동작은 상속이 캐시되는 것처럼 요청을 처리하는 동안에는 캐시를
통해 처리될 수 있습니다.

개념 증명은 이미 구현되었고 제네릭 타입 파라미터에서 데이터 흐름 기반, 지역적,
또는 단방향의 타입 추론은 PHPStan/Psalm의 동작 방식처럼 동일하게 작동합니다. 이
접근 방식이라면 다른 타입 추론도 실험해볼 수 있게 됩니다.

### 성능 고려사항

제네릭에 있어 다른 고민거리는 바로 성능에 미치는 영향입니다. 벤치마크를 관찰한
결과,

- 제네릭 유무가 제네릭이 없는 코드에서 성능 영향을 미치지 않음
- 단순한 제네릭 코드는 특수 코드와 비교해서 1~2% 정도의 크지 않은 성능 저하가 발생

하지만 이후에 얘기하게 될 union과 같은 복합 타입의 경우는 타입 체크에
초선형(superlinear) 시간 복잡도를 보이기 때문에 잠재적으로 상당한 성능 감소를
야기할 수 있습니다. 예를 들면 `A|B`가 `B`를 받을 수 있는지 확인하는 것은
선형적이지만 `Box<A|B>()`를 `Box<A|B>()`와 확인하게 되면 O(nm)이 됩니다.

초선형 복잡도는 복합 타입을 합치는 중에 심볼릭 타입을 확인하려고 해도 발생할 수
있습니다.


### 이후 방향

구체화된 제네릭은 다음과 같은 연구 과제가 남아있습니다.

- 복합 타입, 극단적인 경우 어떤 영향이 있는지 평가 필요
- 인라인 캐시에서 타입 체크를 구현하고 복합 타입을 처리하는 더 똑똑한 알고리즘이
  있는지 연구
- 즉시 오토로딩(eager-autoloading) 또는 상속 캐시와 같은 방식으로 심볼릭 타입의
  양을 줄이는 방법을 탐구

## 컬렉션

제네릭의 주된 사용 케이스로 자주 언급되는 부분은 타입 배열입니다. PHP에서는
스위스 군용칼 같은 배열 타입이 사용 또는 과용되는 데는 많은 이유가 있습니다.
하지만 현재는 배열에 키 또는 값에 타입을 강제할 수 있는 방법은 존재하지
않습니다.

병렬 프로젝트에서는 전용 컬랙션 문법을 사용하는 방식으로 완전한 제네릭보다는
부족하지만 그래도 도움이 될 수 있습니다.

컬랙션은 집합, 목록, 사전 등의 형식으로 주로 활용됩니다. 집합과 목록의 경우에는
값에 대한 타입이 정의되며 사전 형식은 키와 값 모두에 타입이 지정됩니다. 다음
같은 식의 문법을 활용 할 수 있겠습니다.

```php
class Article
{
  public function __construct(public string $subject) {}
}

collection(Seq) Articles<Article>
{
}

collection(Dict) YearBooks<int => Book>
{
}
```

다음처럼 목록을 인스턴스로 만들어서 일반 클래스처럼 사용할 수 있게 됩니다.

```php
$a1 = new Articles();
$b1 = new YearBooks();
```

목록과 사전 형식은 자동으로 [많은 메소드가 정의][6]되며 PHP에서 `array_*`
함수처럼 제공되었던 것들이 기본적인 기능으로 제공됩니다. 컬렉션에 정의된
메소드를 사용해 개체를 추가하거나 수정하려 한다면 컬렉션의 정의된 바에 따라 키와
값의 타입을 맞춰야 합니다.

위 예시에서 `YearBooks` 사전에 `add()` 메소드를 사용한다면 키는 `int` 타입만
사용할 수 있고 값은 `Book` 타입 인스턴스만 가능합니다. 주요 조작 메소드
(`add`, `get`, `unset`, `isset`)와 `ArrayAccess` 스타일의 오버로드 동작도 여전히
사용 가능하며 연산자 오버로드도 적용 가능할 수 있습니다.

이 방식의 단점은 컬랙션을 직접 선언해야 한다는 점입니다. 다음 예시에서 볼 수
있는 것처럼 단일 라인 선언이 별도의 파일에 각각 컬렉션을 위해 존재해야 합니다.

다른 우려 사항은 잠재적으로 메모리 사용량이 높다는 점인데 각 클래스 PHP가 모든
연관 메소드 목록을 포함한 해당 클래스 항목을 계속 들고 있어야 한다는 점입니다.

세번째 우려할 만한 부분은 `instanceof/is-a` 관계가 호환 가능한 유형의 컬렉션
사이에서 존재하지 않는다는 점입니다.

```php
class A {}
class B extends A {}

seq As<A> {}
seq Bs<B> {}

new B() instanceof A // true
new Bs() instanceof As // false
```

또는

```php
namespace Foo;
seq As<A> {}

namespace Bar;
seq As<A> {}

namespace;
new Foo\As instanceof Bar\As; // false
```

컬렉션은 제네릭에 비해서는 부족한 면이 있으며 훨씬 복잡도를 높히는 경향이 있지만
제네릭의 사용 케이스 대부분을 대체할 수 있습니다. 다만 이 구현은 제네릭에 비해
훨씬 간단하며 이 [실험 브랜치][7]에서 사용해볼 수 있습니다. 하지만 완전한
제네릭을 구현할 수 있다면 이런 컬렉션 구현 방식보다 제네릭을 활용하는 것이 훨씬
선택할 만한 방향입니다.

Larry Garfield는 다른 언어에서 컬렉션 API가 얼마나 광범위한지 [연구를
수행][8]하기도 했습니다. 아직 대략적이긴 하지만 "모든 것을 포함"하는 방향으로
합의되었고 아마도 여러 개의 개별 인터페이스로 나뉘어질 예정입니다. 앞으로의
대략적인 방향은 문서 끝에서 제시하는 방식을 따라갈 것 같습니다.

컬렉션 패치는 [https://github.com/php/php-src/pull/15429][9]에서 찾을 수
있습니다.


## 다른 대안

### 정적 분석

근래 들어 정적 분석기가 부상하고 있습니다. [PHPStan][10]과 [Psalm][11] 모두
제네릭을 지원하며 많은 오픈소스 라이브러리와 개별 프로젝트에서 활용되고
있습니다.

다음은 일반적인 `Dict` 클래스를 PHPStan과 Psalm에서 지원하는 방식대로 작성한
예시입니다.

```php
/**
 * @template Key
 * @template Value
 */
class Dict
{
  /**
   * @param array<Key,Value> $entries
   */
  public function __construct(private array $entries) {}

  /**
   * @param Key $key
   * @param Value $value
   */
  publci function set($key, $value): self
  {
    $this->entries[$key] = $value;
    return $this;
  }
}

/** @param Dict<string,string> $dict */
function f($dict) {}

$dict = new Dict([1 => 'foo']);
$dict->set('foo', 'bar'); // 정적 분석에서 오류 발생
$dict->set(1, 'bar');     // 통과
f($dict);                 // 정적 분석에서 오류 발생
```

`template` 이라는 docblock 어노테이션이 사용된 점에는 역사적인 이유가 있지만
제네릭에 실제적 구현에서는 자바의 제네릭 타입과 유사합니다. 제네릭 타입은 정적
분석 단계에서만 제네릭을 확인하지 실제 런타임에서는 보이지 않습니다.

이 방식은 제네릭의 장점인 타입 안전을 제공하긴 하지만 다음과 같은 아쉬움이
있습니다.

- docblock은 장황하기 쉬움
- 타입 체크가 별도의 도구를 통해서만 이루어짐 (PHPStan, 또는 Psalm)
- 제네릭 타입 정보가 런타임에서는 활용 불가능
- 제네릭 타입 정보가 런타임에서 강제되지 않음 (즉 코드 실행 전에 정적 분석을
  수행하지 않으면 아무런 의미가 없게 됨)

### 소거된 제네릭 타입 선언

PHP 코어에서 구체화된 제네릭 구현의 어려움이 있기 때문에 문법 수준에서만
지원하고 타입 검사 자체는 정적 분석기를 활용하자는 제안도 있습니다.

이 대안에서는 PHP 문법에서 타입, 클래스, 함수 정의에서 제네릭 문법을 허용하지만
PHP 엔진 자체에서는 타입 체크를 수행하지 않는 것입니다.

이 방식을 "소거된" 타입 선언이라고 부르는 이유는 엔진이 단순히 런타임에서
무시해버리기 때문에 그렇습니다. 이 대안은 다양한 방법을 구현할 수 있습니다.

- php-src의 일부분으로
- 확장으로
- 오토로더 수준에서
- 그 외

앞서 본 `Dict` 클래스는 다음처럼 작성 가능합니다.

```php
class Dict<Key,Value>
{
    public function __construct(private array<Key,Value> $entries) {}

    public function set(Key $key, Value $value): self
    {
        $this->entries[$key] = $value;
        return $this;
    }
}

function f(Dict<string,string> $dict) {}

$dict = new Dict([1 => 'foo']);
$dict->set('foo', 'bar'); // 정적 분석에서 오류 발생
$dict->set(1, 'bar');     // 통과
f($dict);                 // 정적 분석에서 오류 발생
```

이 방식은 정적 분석기에서 docblock이 장황해지던 문제를 해결하긴 하지만 일관성이
부족한 문제가 있습니다. 일반적인 타입 선언은 자동 형 변환(Type coercion)이
가능하지만 소거된 제네릭 타입 선언은 그렇지 않습니다.

다음 예시를 보면 알 수 있습니다.

```php
class StringList
{
  public function add(string $value)
  {
    $this->values[] = $value;
  }
}

class List<T>
{
  public function add(T $value)
  {
    $this->values[] = $value;
  }
}

$list = new StringList();
$list->add(123); // 문자열로 형변환이 됨

$list = new List<string>();
$list->add(123); // 문자열로 형변환 되지 않음
```

이 시나리오에서 첫 `add()` 호출은 형변환이 되어 인자가 문자열로 전환되었지만
두번째 경우는 그렇지 않습니다.

자바의 경우에는 소거된 제네릭이 전통적인 타입 시스템 위에 구현되어 있어서
컴파일러가 타입 체크를 수행하기 때문에 위와 같은 문제는 발생하지 않습니다.
하지만 PHP의 경우는 이 문제를 피할 수 없는 상황입니다.

소거된 제네릭 방식의 다른 단점은 런타임 단계에서 제네릭이 보이지 않는다는
점입니다. 이는 패턴 매칭과 같이 제네릭 타입 인자를 봐야 하는 상황 등에서 한계를
보입니다.

### 완전히 소거된 타입 선언

소거된 제네릭의 비일관성을 해결하는 방법 중 하나는 모든 타입 선언을 제거해버리는
방식입니다. `declare()`를 사용해서 선택적으로 적용할 수 있습니다.

```php
declare(types=erased);
```

이 대안에서는 엔진이 런타임에서 타입 체크를 더이상 수행하지 않게 됩니다.
즉 `add()`를 호출하던 앞서 예시에서 두 경우 모두 자동 형변환을 수행하지
않습니다. 즉 사용자가 직접 분석기를 통해 타입을 확인해야 합니다.

주류 인터프리터 언어에는 이런 접근 방식이 그렇게 새로운 것은 아닙니다.
타입스크립트를 통한 자바스크립트, 파이썬, 루비 등 여러 언어에서 완전히 소거된
타입 선언을 활용하고 있습니다.

사용자가 완전히 소거된 타입과 제네릭을 파일 단위로 선택적 적용을 할 수 있게 하는
방식으로 PHPStan/Psalm의 장황한 제네릭을 덜 복잡하게 활용할 수 있게 됩니다. 이
접근 방식은 다음과 같은 장점도 있습니다.

- 단기적으로는 선택적으로 런타임 타입 체크를 끄기 때문에 성능 향상이 있을 수
  있음
- 잠재적으로 더 고수준의 타입 시스템으로 확장해서 `non-empty-string`, `list`,
  `int`, `class-string`, 조건부 타입 등과 같은 고급 타입을 지원할 수 있음

하지만 다음과 같은 큰 단점도 존재합니다.

- 리플렉션이나 리플렉션에 의존하고 있는 라이브러리가 이 완전히 소거된 타입에
  어떤 영향을 받게 될지 명확하지 않음
- 타입을 강제하는 것이 개발자가 적극적으로 정적 분석을 사용해야만 달성할 수 있게
  되는데 이는 현재 대부분의 PHP 생태계에서는 흔하지 않음
- 현재 강타입과 약타입 두 가지에서도 개발자가 고려해야 할 부분이 많은 편인데
  3번쨰 "타입 모드"를 만드는 것이 맞는 방향인지 의문 (거기에 더해 사용자가
  유사 타입이 타입 강제 모드에서는 호환도 되지 않음)
- 이 접근 방식이 "어떤 타입은 강제되지만 다른 것을 그렇지 않은" 문제를 해결하지
  못함. 제네릭을 사용하면서도 완전히 소거된 타입을 원하지 않는 사람이라면 여전히
  부분적인 타입 강제 수준에 머물게 됨.
- PHP는 주요 스크립트 언어 중 타입을 강제하는 유일한 언어. 이를 잃으면
  시장에서의 장점도 잃을 수 있음.

## 제네릭 배열

이 문서에서 제네릭 개체에 대한 얘기를 하고 있으니 제네릭 배열에 대한 얘기도
언급하고자 합니다.

### 유동적 배열

배열은 작성할 때 복사하게 됩니다. 수정하게 되면 새로운 사본을 만들고 (다른 곳에
사본이 존재한다면), 그리고 사본을 수정하게 됩니다 (복사시점 변경,
copy-on-write). 이 접근 방식으로 배열을 다른 곳으로 보내고도 함수가 해당 배열을
수정하는 것에 대한 걱정을 할 필요가 없게 됩니다. (참조로 보내지 않는 한에는
말입니다.)

타입 과점에서 봤을 떄는 배열은 언제나 내부에 있는 내용을 기준으로 타입이
정해지고 배열을 수정했을 떄는 새로운 배열이 생성되기 때문에 타입이 변경되지
않습니다.

제네릭 관점에서 봤을 때는 아주 편리한 특성인데 배열이 가변적이라는 의미이기
떄문입니다. 즉 배열은 상위 타입과 하위 타입을 모두 포함할 수 있습니다. 즉 다음
코드도 타입 안전성을 보장합니다.

```php
class A {}
class B extends A {}

function f(array $a) {}
function g(array<A> $a) {}
function h(array<B> $a) {}

$array = [new B()];

f($array);
g($array);
h($array);
```

일반적으로 제네릭 컨테이너는 비가변적인데 타입 플레이스홀더가 읽기와 쓰기 모두에
사용되기 때문입니다. 여기서의 경우는 문법적으로 불변이며 복사시점 변경을
수행하기 때문에 문제가 되지 않습니다.

그래서 자연스럽게 제네릭 배열을 구현하는 것이 가능합니다.

```php
$a = [1];         // array<int>
$b = [new A()];   // array<A>
$c = $b;          // array<A>
$c[] = new B();   // array<A|B>
$b;               // array<A>
```

이 방식은 API 경계 즉 함수에 인자로 전달할 때나 값을 반환할 때, 개체를 업데이트
하는 등의 상황에서 타입을 확인하기 때문에 타입 안전성을 제공합니다.

```php
function f(array<int> $a) {}
$a = [1];
f($a); // ok

$b = [new A()];
f($b); // error
```

증명 구현은 이미 되었지만 아직 성능에 어떤 영향을 주는지는 잘 평가되지
않았습니다. 다른 문제도 있는데 이 방식에서는 참조나 타입 프로퍼티를 지원하는
것은 어려울 수 있습니다.

### 정적 배열

유동적 배열의 대안은 인스턴스화에서 타입을 지정하는 방식입니다.

```php
$a = array<int>(1); // array<int>
$a[] = new A();     // error
```

하지만 이 대안은 현재 PHP에서 배열이 어떻게 사용되고 있는지와 정면으로
충돌합니다. 또한 이 접근 방식은 배열을 반변적으로 만듭니다.

```php
function f(array<int> $a) {}
function g(array $a) {}

$a = [1];
f($a); // ok
g($a); // error
```

왜 `g($a)`에 오류가 발생하느냐 하면 제네릭의 반변성을 참고하세요. `g()` 는
`array` (`array<mixed>`)를 인자로 받는데 어떤 타입의 개체든 추가할 수 있는
배열이란 얘기입니다. 하지만 `array<int>`를 여기에 전달했기 때문에 이 계약이
깨지게 됩니다. 그래서 `array`는 `array<int>`를 받을 수 없습니다.

불변성은 배열에 제네릭을 적용하기 어렵게 합니다. 라이브러리가 제네릭 배열에 타입
힌트를 추가하면 사용자 코드를 깨뜨리게 될 것이고 반대로 사용자는 제네릭 배열을
라이브러리에 전달하려면 타입 선언에 제네릭 배열을 쓰지 않고서는 라이브러리를
사용하지 못하게 됩니다.

이런 문제로 개체 기반 컬렉션을 사용할 수 밖에 없습니다. 대다수 현대적인 언어처럼
컬렉션을 선언하는데 커스텀 문법을 사용하거나 더 확실한 제네릭 문법을 활용해야
할 것입니다. 물론 이 두 방식은 서로 상호적으로 호환이 가능할 겁니다.

## 결론

이 글에서 PHP에 제네릭을 구현한다는 것이 어떤 의미인지, 그리고 어떤 선택지가
있는지, 제네릭 개체와 컬렉션, 그리고 여러 연관된 기능에 대해 살펴봤습니다.
앞으로도 더 많은 작업이 필요하고 이런 작업은 게속 진행될 예정이며 어떤 기능이
가장 필요하며 가능한 방법인지 계속 논의될 예정입니다.

앞으로의 방향은 이렇습니다.

- 구체화된 제네릭을 위한 타입 추론에 대해 조사를 지속할 예정이며 이해할 수 있는
  수준의 트레이드오프가 있는 방안이 가장 알맞은 방향으로 판단되면 컬렉션은 그
  방식으로 구현될 예정.
- 소거된 제네릭이 여기에 논의된 것 외의 단점으로 실현이 불가능한 방식인지 파악
- 완전히 소거된 제네릭 타입이 여기에 논의된 것 외의 단점으로 실현이 불가능한
  방식인지 파악
- 컬렉션을 위한 기능을 최적화하고 전용 문법이나 제네릭네서 사용될 수 있는지 확인
- 컬렉션에서 더 나은 성능과 단순함을 위해 해시맵 (배열) 대신 사용할 수 있는 내부
  자료형이 있는지 연구 (이런 이유에서 컬렉션은 사용자 공간에서 구현되지 않을
  가능성이 높음)
- 타입 배열은 배열 동작의 복잡도, 구현 이후의 이득을 고려했을 때 큰 가치가 없는
  것으로 판단되어 타입 배열에 대한 연구는 중단

현재는 다음 질의에 대한 피드백을 구하는 것에 집중하고 있습니다.

- 만약 구체화된 제네릭이 불가능한 방식으로 판명되면 소거된 제네릭 방식이 맞는
  접근법이 될지, 아니면 계속 사용자 공간에서의 도구로 남겨둬야 할지
- 어떤 제네릭 기능이 구현에 포함되고 포함되지 않아야 하는지? (예를 들면 합
  타입에 제네릭을 허용하지 않는다, 합 제네릭이 느리게 동작해도 상관하지 않는다,
  in/out 변성 마커를 지원할 필요 없다 등)
- 만약 소거된 제네릭이 포함된다면, 타입을 검증하기 위한 공식 린터를 만들 필요가
  있을지 아니면 계속 사용자 공간의 도구를 활용할지
- 만약 구체화된 제네릭이 불가능한 방식으로 판명되면 여기서 보여준 컬렉션 문법이
  괜찮은지
- 소거된 제네릭을 먼저 적용한 후에 구체화된 제네릭을 적용하는 것이 가능하다면
  이 전략을 채택하는 것이 맞는지

## 논의

- [PHP Internals mailing list][12]
- [Reddit][13]


[1]: https://thephp.foundation/blog/2024/08/19/state-of-generics-and-collections/
[2]: https://github.com/PHPGenerics/php-generics-rfc/issues/45
[3]: https://wiki.php.net/rfc/generics
[4]: https://www.reddit.com/r/PHP/comments/j65968/comment/g83skiz/
[5]: https://github.com/arnaud-lb/php-src/pull/4
[6]: https://github.com/php/php-src/compare/master...derickr:php-src:collections#diff-eeb1e0848e9a25b7492398bf5ddf9be15995a67d44a23c336869bf9f36910d1b
[7]: https://github.com/derickr/php-src/tree/collections
[8]: https://github.com/Crell/php-rfcs/blob/master/collections/research-notes.md
[9]: https://github.com/php/php-src/pull/15429
[10]: https://phpstan.org/blog/generics-in-php-using-phpdocs
[11]: https://psalm.dev/docs/annotating_code/templated_annotations/
[12]: https://externals.io/message/125049
[13]: https://www.reddit.com/r/PHP/comments/1ew7hik/state_of_generics_and_collections/

