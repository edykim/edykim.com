---
title: "PHP 열거형(enumerations) 정리"
author: haruair
type: post
date: "2022-07-17T18:34:05.998Z"
lang: ko
headline:
  - PHP 8.1부터 추가된 열거형 타입 살펴보기
tags:
  - 개발 이야기
  - php
slug: "enumerations-in-php"
---

PHP 8.1에 열거형이 추가되었습니다. 그동안 클래스와 클래스 상수를 사용해서 열거형처럼 사용했었는데 용도에 맞게 사용할 수 있는 타입이 생겼습니다.

[Enumerations - php](https://www.php.net/manual/en/language.enumerations.php)를 중점으로 번역했습니다.

> 열거형, "Enums"는 제한된 선택지를 정의할 수 있는 타입입니다. [...] 각 언어마다 다양한 구현이 있지만 PHP에서는 특별한 종류의 개체로 처리합니다. Enum 자체는 클래스지만 각각 케이스를 단일 인스턴스 개체로 다루는 것도 가능합니다. 즉, 개체를 사용하는 곳이라면 어디든 열거형 케이스를 적용할 수 있습니다. -- [Enumerations overview - PHP](https://www.php.net/manual/en/language.enumerations.overview.php)

## 열거형 기초

열거형을 다음처럼 선언할 수 있습니다.

```php
enum Suit
{
  case Hearts;
  case Diamonds;
  case Clubs;
  case Spades;
}
```

열거형 타입으로 `Suit`를 작성했고 4가지 허용된 값으로 `Suit::Hearts`, `Suit::Diamonds`, `Suit::Clubs`, `Suit::Spades`를 선언했습니다. 이 값을 직접 사용하거나 변수에 할당해서 사용하는 것도 가능합니다.

```php
function pick_a_suit(Suit $s)
{
  // ...
}

pick_a_suit(Suit::Diamonds);

// 변수에 할당하는 것도 가능
$suit = Suit::Clubs;
pick_a_suit($suit);

pick_a_suit('Hearts');
// TypeError: pick(): Argument #1 ($suit) must
//   be of type Suit, string given...
```

각 케이스는 별도 정의가 없으면 스칼라 값으로 다뤄지지 않습니다. 내부적으로는 해당 이름의 싱글턴 개체가 존재하기 때문에 다음처럼 작성하는 것도 가능합니다.

```php
$a = Suit::Spades;
$b = Suit::Spades;

$a === $b; // true
$a instanceof Suit; // true
```

여기서 `Suit` 타입의 케이스는 별도 데이터를 지정하지 않았기 때문에 "순수 케이스(Pure case)"로 불립니다. 순수 케이스만 포함된 열거형은 순수 열거형(Pure Enum)으로 부릅니다. 모든 순수 케이스는 해당 열거형 타입의 인스턴스로 구현되어 있으며 열거형 타입은 내부적으로는 클래스처럼 동작합니다.

모든 케이스는 읽기 전용 프로퍼티로 `name`이 존재하며 케이스 이름을 문자열로 반환합니다.

```php
print Suit::Spades->name; // "Spades"
```

## 지원 열거형 (Backed enumerations)

위에서 본 열거형은 스칼라 값이 없는, 순수한 형태입니다. 하지만 데이터를 저장한다던지 직렬화 해야 하는 경우에는 열거형에 기본값이 있으면 더 유용하게 사용할 수 있습니다.

스칼라 값을 사용하는 열거형은 다음처럼 작성합니다.

```php
enum Suit: string
{
  case Hearts = 'H';
  case Diamonds = 'D';
  case Clubs = 'C';
  case Spades = 'S';
}
```

여기서 케이스는 간단한 스칼라 값의 "지원을 받는" 케이스(backed case)입니다. 모든 케이스가 지원 케이스인 열거형을 지원 열거형(Backed Enum)이라고 합니다.

이 지원 열거형은 `int`나 `string`과 함께 사용할 수 있습니다. 동시에 둘을 지원할 수는 없습니다. 즉, `int|string`은 안됩니다. 어느 타입이든 지정하면 모든 케이스에서 값이 존재해야 합니다. 즉, `int`로 지정한다고 하더라도 자동으로 값이 지정되지 않습니다. 또한 각각 케이스의 값은 열거형 내에서 유일해야 합니다.

지정된 값은 리터럴 또는 리터럴 표현식이어야 합니다. 상수와 상수 표현식은 지원되지 않습니다. 즉, `1 + 1`은 값으로 지정할 수 있는 표현식이지만 `1 + SOME_CONST`는 불가능합니다.

지원 케이스도 `value`라는 읽기 전용 프로퍼티를 제공합니다. 정의할 때 지정한 값을 반환합니다.

```php
print Suit::Clubs->value; // "C"
```

이 지원 열거형은 내부적으로 `BackedEnum` 인터페이스를 구현하고 있습니다. 이 인터페이스는 `from(int|string): self`와 `tryFrom(int|string): ?self` 메소드를 포함하고 있습니다. 이 메소드는 다음처럼 활용할 수 있습니다.

```php
enum InvoiceState: string {
  case New = 'new';
  case Paid = 'paid';
  case Confirmed = 'confirmed';
  case Completed = 'completed';
  case Invalid = 'invalid';
}

$invoice = ['id' => 1, 'state' => 'new'];

print $invoice['state']; // 'new'

// 열거형에 정의하지 않은 값으로 테스트
$invoice['state'] = 'half-paid';

$state = InvoiceState::from($invoice['state']);
// Uncaught ValueError: "half-paid" is not a valid
//    backing value for enum "InvoiceState" in...

$state = InvoiceState::tryFrom($invoice['state'])
          ?? InvoiceState::Invalid;

print $state->value; // 'invalid'
```

이 두 함수를 직접 정의하려고 하면 오류가 발생하니 주의하세요.

## 열거형 메소드

열거형에도 메소드를 작성할 수 있으며 인터페이스를 구현하는 것도 가능합니다.

```php
interface Colorful
{
  public function color(): string;
}

enum Suit implements Colorful
{
  case Hearts;
  case Diamonds;
  case Clubs;
  case Spades;

  // 클래스처럼 메소드 작성
  public function shape(): string
  {
    return 'Rectangle';
  }

  // Colorful 인터페이스를 구현
  public function color(): string
  {
    return match($this) {
      Suit::Hearts, Suit::Diamonds => 'Red',
      Suit::Clubs, Suit::Spades => 'Black',
    };
  }
}

function paint(Colorful $c) { /* ... */ }

paint(Suit::Clubs);

print Suit::Diamonds->shape(); // 'Rectangle'
```

유심히 봐야 할 부분은 메소드 내에서 사용한 `$this`입니다. 각 열거형 케이스는 내부적으로 인스턴스가 존재하기 때문에 호출된 케이스를 `$this`로 접근할 수 있게 됩니다. 문법의 모습은 정적 클래스와 유사하기만 할 뿐 맥락이 다르다는 점을 확인할 수 있습니다.

참고로 위 구현은 온전히 예시로 작성되었으며 실제라면 별도의 `SuitColor` 열거형으로 구현하는 게 바람직합니다.

메소드의 접근자는 public, private, protected 모두 가능하지만 열거형은 상속이 불가능하기 때문에 private과 protected 사이에 실질적인 차이는 없습니다.

## 열거형 정적 메소드

열거형에 정적 메소드를 정의할 수 있습니다. 아래 코드는 정적 메소드를 별도의 생성자처럼 사용하는 예제입니다.

```php
enum Size
{
  case Small;
  case Medium;
  case Large;

  public static function fromLength(int $cm): static
  {
    return match(true) {
      $cm < 50 => static::Small,
      $cm < 100 => static::Medium,
      default => static::Large,
    };
  }
}
```

## 열거형 상수

열거형에 상수도 선언할 수 있습니다. 상수로 열거형 케이스를 지정하는 것도 가능합니다.

```php
enum Size
{
  case Small;
  case Medium;
  case Large;

  // 열거형 케이스를 할당
  public const Huge = self::Large;

  // 이런 것도 그냥 할 수 있음
  private const Someone = 'hello';
}
```

## 트레이트 (traits)

클래스처럼 동작하기 때문에 트레이트를 사용할 수 있습니다. 다만 프로퍼티가 존재하는 트레이트는 오류가 발생합니다.

```php
trait Rectangle
{
  public function shape(): string {
    return "Rectangle";
  }
}

enum Suit implements Colorful
{
  use Rectangle;

  // ...
}
```

## 열거형과 개체의 차이점

열거형은 클래스와 개체로 구현되어 있지만 모든 개체 관련 기능을 사용할 수는 없습니다. 특히 열거형은 상태를 가질 수 없습니다.

- 생성자, 소멸자 사용 금지
- 상속 미지원
- 정적 또는 개체 프로퍼티 금지
- 열거형 케이스를 복제(cloning)하는 행위 금지
- `__call`, `__callStatic`, `__invoke` 이외 매직 메소드 금지

또 다음과 같은 특징이 있습니다.

- `__CLASS__`, `__FUNCTION__` 상수 사용 가능
- `::class` 매직 상수는 열거형과 열거형 케이스에 동일하게 사용할 수 있지만 둘 다 열거형의 클래스명을 반환
- 접근자 사용 가능
- 인터페이스 상속 가능
- 어트리뷰트 사용 가능

## 값 목록

열거형은 내부적으로 `UnitEnum` 인터페이스를 구현하고 있으며 `cases()` 정적 메소드를 제공합니다. 열거형에 선언된 모든 케이스를 담은 배열을 반환합니다.

```php
var_dump(Size::cases());
// [Size::Small, Size::Medium, Size::Large]
```

## 직렬화(Serialization)

열거형 직렬화는 개체 직렬화는 다른 방식으로 구현되어 있습니다. 특히 역직렬화 할 때는 기존 싱글톤 값을 그대로 사용할 수 있어서 다음과 같은 동작이 보장됩니다.

```php
Suit::Hearts === unserialize(serialize(Suit::Hearts));
// true

print serialize(Suit::Hearts);
// 'E:11:"Suit::Hearts";'
```

순수 열거형은 JSON으로 직렬화 시 오류가 발생합니다. 지원 열거형은 표현하고 있는 스칼라 값만 남게 됩니다. 이런 기본 동작은 `JsonSerializable` 인터페이스를 구현하는 것으로 대체할 수 있습니다.

## 예제

### 제한적인 기본값 지정

```php
enum SortOrder
{
  case ASC;
  case DESC;
}

function query(
  $fields,
  $filter,
  SortOder $order = SortOrder::ASC,
) {
  /* ... */
}
```

### `match()`와 함께 활용하기

```php
enum UserStatus: string
{
  case Pending = 'P';
  case Active = 'A';
  case Suspended = 'S';
  case CanceledByUser = 'C';

  public function label(): string
  {
    return match($this) {
      static::Pending => 'Pending',
      static::Active => 'Active',
      static::Suspended => 'Suspended',
      static::CanceledByUser => 'Canceled by user',
    };
  }
}

//...

foreach (UserStatus::cases() as $case) {
  printf(
    '<option value="%s">%s</option>\n',
    $case->value,
    $case->label(),
  );
}
/**
 * result:
 * <option value="P">Pending</option>
 * <option value="A">Active</option>
 * <option value="S">Suspended</option>
 * <option value="C">Canceled by user</option>
 */
```

