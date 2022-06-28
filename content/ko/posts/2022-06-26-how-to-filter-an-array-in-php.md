---
title: "PHP에서 callable로 배열 필터하기"
author: haruair
type: post
date: "2022-06-27T03:36:10.811Z"
headline:
  - 배열을 필터하는 예제와 함께 callable 타입을 꼼꼼하게 살펴봅니다
lang: ko
tags:
  - 개발 이야기
  - php
slug: "how-to-filter-an-array-using-callable-in-php"
---

어떤 프로그램이든 배열이나 목록과 같은 자료구조에서 조건에 맞는 요소(element)를 찾아 하위 집합을 만들어야 하는 경우가 있습니다. PHP에서는 배열(array)이 기본이 되는 자료구조 중 하나인데요. 이 배열을 대상으로 내장 함수인 [`array_filter()`](https://www.php.net/manual/en/function.array-filter.php)를 사용해서 조건에 맞는 요소만 골라내는 작업을 수행할 수 있습니다.

빠르게 callable 표현식/문법만 확인하고 싶다면 [callable 정리](#callable-정리) 부분을 참고하세요.

- [배열 필터하기](#배열-필터하기)
  - [문자열로 된 callable 타입](#문자열로-된-callable-타입)
  - [정적 클래스 메소드를 `callable`로](#정적-클래스-메소드를-callable로)
  - [개체(object)를 활용하는 `callable`](#개체object를-활용하는-callable)
  - [클로저(Closure)를 `callable`로 활용하기](#클로저closure를-callable로-활용하기)
  - [`CallableExpr(...)` 문법으로 `callable` 날개 달기](#callableexpr-문법으로-callable-날개-달기)

# 배열 필터하기

먼저 공식 사이트에서 함수 시그니처를 확인합니다. 함수 시그니처에서는 어떤 타입의 값을 넣어야 하는지, 함수의 결과는 어떤 타입으로 반환되는지 확인할 수 있습니다.

```php
array_filter(
  array $array,
  ?callable $callback = null,
  int $mode = 0
): array
```

함수 시그니처를 확인하셨나요? `$array`에는 대상이 되는 배열, `$callback`에는 배열 요소가 찾으려는 조건에 맞는지 검사하는 함수, 마지막 `$mode`는 검사하는 함수에 인자를 어떻게 입력하는지 정하는 플래그를 넣을 수 있습니다.

어떤 타입을 넣어야 하는가도 알 수 있습니다. `$array`는 array 타입, `$callback` callable 또는 null 타입, `$mode`는 정수형 타입을 넣을 수 있습니다. 함수의 반환 타입은 array 타입이고요. `$callback`과 `$mode`에는 각각 null과 0이 기본값으로 배정되어 있습니다.

예시로 다음 같은 배열이 있다고 생각해봅니다.

```php
$nums = array(1, 2, 3, 4, 5, 6, 7);
```

이 배열에서 짝수인 숫자만 모아서 배열을 만들려고 합니다. 그렇다면 숫자 하나를 입력으로 받아서 짝수인지 아닌지 검사하는 함수를 먼저 생각해봅시다. 다음처럼 함수를 작성할 수 있습니다.

```php
function is_even($number) {
  return $number % 2 === 0;
}
```

이제 대상이 되는 배열과 검사하는 함수를 `array_filter()`에 인자로 전달합니다. 그 결과로 짝수만 들어있는 배열이 반환됩니다.

```php
$even_nums = array_filter($nums, 'is_even');

// 어떤 값이 있는지 `var_dump()` 함수로 검사합니다.
var_dump($even_nums);
// array(3) {
//   [1]=>
//   int(2)
//   [3]=>
//   int(4)
//   [5]=>
//   int(6)
// }
```

필요로 한 결과가 나왔지만 자세히 보면 흥미로운 부분이 있습니다. 두 번째 인자로 사용한 `'is_even'`은 문자열인데 어떻게 `array_filter()`가 함수로 인식한 것일까요?

## 문자열로 된 callable 타입

앞서 본 예시처럼 `array_filter()` 함수에는 사용자 정의 함수를 인자로 전달해야 합니다. 다만 이전 버전의 PHP에서는 함수를 직접 넣어서 전달할 수 있는 방법이 없었습니다. 대신에 그 해결책으로 `callable` 타입이 존재하게 되었는데 함수명을 문자열로 저장하면 그 함수를 호출할 수 있게 됩니다.

다음 함수가 있다고 가정해봅니다.

```php
function sayHello() {
  echo "Hello!";
}
```

첫 예제는 함수를 직접 호출했습니다. 당연한 결과가 나옵니다.

```php
// 1.
sayHello(); // "Hello!"
```

함수명을 문자열로 `$a`에 저장합니다. 함수처럼 다뤄볼까요?

```php
// 2.
$a = 'sayHello';
$a(); // "Hello!"
```

함수가 호출됩니다. 저장 안하고 문자열을 그냥 호출하는 것도 가능할까요?

```php
// 3.
'sayHello'(); // "Hello!"

// 4.
$b = 'Hello';
"say$b"(); // "Hello!"
```

문자열에 함수명이 저장되어 있으면 그 자체로 호출이 가능합니다. 이렇게 문자열에 호출할 수 있는 **무언가**가 있는 경우를 `callable` 타입으로 볼 수 있습니다. 물론 그 문자열로 저장된 함수가 실제로 존재해야겠죠? 저장된 문자열이 `callable`인지 아닌지는 [`is_callable()`](https://www.php.net/manual/en/function.is-callable.php) 함수로 검사할 수 있습니다.

```php
var_dump(is_callable("sayHello"));  // true
var_dump(is_callable("sayWhaatt")); // false, 없는 함수
```

문자열로 된 `callable` 타입 덕분에 다른 함수에 어떤 함수를 호출해야 하는지 전달할 수 있게 되었습니다. 다시 원래 주제로 돌아가서 얘기하면 `array_filter()` 함수에 문자열로 조건 검사를 수행할 함수 이름만 전달해도 기대한 것처럼 동작하게 됩니다.

## 정적 클래스 메소드를 `callable`로

앞에서는 단순한 예제라서 단순히 함수를 전달하는 것으로도 충분했습니다. 프로젝트가 좀 더 커져서 여러 필터가 필요한 상황을 생각해봅시다. 여러 필터를 함수로 관리하다보면 다른 배열을 대상으로 하는 비슷한 이름의 함수가 많아질 수 있습니다.

```php
// 홀수를 검사하는 함수
function is_odd($num) {
  return $num % 2 === 1;
}

// 이상한 사람을 검사하는 함수
function is_odd($person) {
  return $person['is_odd'] === true;
}
// Fatal error:  Cannot redeclare is_odd() (previously declared ...)
```

이런 충돌을 피하기 위해서 긴 함수명을 선택할 수 있지만 깔끔해보이진 않습니다. (다른 영어 단어를 선택할 수도 있지만... 여기서는 같은 이름의 함수여야만 한다고 생각해봅시다. 의외로 그런 경우가 꽤 있거든요.)

```php
function is_odd_number($num) {
  return $num % 2 === 1;
}

function is_odd_person($person) {
  return $person['is_odd'] === true;
}
```

이럴 때 정적 클래스 메소드를 사용하면 이런 함수를 좀 더 깔끔하게 관리할 수 있습니다. 조금 전통적인 방식 중 하나입니다.

```php
class NumberFilter {
  public static function is_odd($num) {
    return  $num % 2 === 1;
  }
}

class PersonFilter {
  public static function is_odd($person) {
    return $person['is_odd'] === true;
  }
}

NumberFilter::is_odd(3); // true
PersonFilter::is_odd(['name' => 'Edward', 'is_odd' => false ])); // false
```

이런 함수도 `callable`로 호출 할 수 있을까요? 정적 클래스 메소드도 문자열 형태로 호출이 가능합니다. `is_callable()`로 확인해보고 `array_filter()`까지도 사용해봅시다.

```php
var_dump(is_callable('NumberFilter::is_odd')); // true

// [$a, $b, ...] 은 array($a, $b, ...) 처럼 배열을 입력하는 간편 문법입니다.
$nums = [1, 2, 3, 4, 5, 6, 7];

$odd_nums = array_filter($nums, 'NumberFilter::is_odd');

// 어떤 값이 있는지 `var_dump()` 함수로 검사합니다.
var_dump($odd_nums);
// array(4) {
//   [0]=>
//   int(1)
//   [2]=>
//   int(3)
//   [4]=>
//   int(5)
//   [6]=>
//   int(7)
// }
```

클래스명을 문자열로 넣는다면 글자를 빼먹거나 잘못된 문자가 들어가서 의도와 다르게 동작할 수도 있습니다. 그나마 그런 문제를 해소하기 위해 특별 상수인 **클래스 상수**를 사용하기도 합니다.

```php
is_callable(NumberFilter::class . '::is_odd');
// true, 'NumberFilter::is_odd'과 동일
array_filter($nums, NumberFilter::class . '::is_odd');
```

클래스 상수는 클래스명을 문자열로 반환합니다. 반환된 클래스명과 나머지 메소드명을 병합해서 위와 동일한 결과를 만들었습니다. 클래스 상수는 네임스페이스도 알아서 처리해주는 장점이 있습니다. 또한 `callable`이 실행될 때 해당 클래스가 코드에서 실제로 접근할 수 있는 것인지도 코드를 작성할 때 확인할 수 있습니다.

아직 조금 아쉬운 점도 있습니다. 정적 메소드 접근을 위한 `'::'`을 문자열로 적어야 한다는 점, 문자열을 합치는 과정도 필요하다는 부분인데요. PHP는 이런 불편함을 조금 덜 수 있도록 배열 형태의 `callable`을 지원합니다.

```php
$a = 'NumberFilter::is_odd';           // 문자열 callable
$b = NumberFilter::class . '::is_odd'; // 클래스 상수를 활용한 문자열 callable
$c = [NumberFilter::class, 'is_odd'];  // 배열 callable

is_callable($a); // true
is_callable($b); // true
is_callable($c); // true

array_filter($nums, [NumberFilter::class, 'is_odd']);
```

이제 정적 클래스 메소드도 문제 없이 사용할 수 있게 되었습니다. 조금 더 까다로운 필터가 필요하다면 어떻게 해야 할까요? 검사하는 함수를 재사용 가능하게 만들 수 있을까요? 방금 살펴본 배열 형태의 `callable`을 활용하면 더 다채로운 형태로 구현할 수 있습니다.

## 개체(object)를 활용하는 `callable`

앞에서 `callable`은 배열 형태로도 사용할 수 있다는 점을 배웠습니다. 정적 클래스 메소드에서는 클래스명과 함수명을 배열에 넣는 방식으로 사용했습니다. 클래스명 대신에 개체를 넣으면 개체의 메소드를 활용할 수 있습니다. 코드를 살펴봅시다.

먼저 개체를 만들 클래스를 작성합니다.

```php
class CompareWithFilter {
  protected $num;

  public function __construct($num) {
    $this->num = $num;
  }

  public function isSmallerThan($input) {
    return $input > $this->num;
  }
}
```

`CompareWithFilter` 클래스는 개체를 생성할 때 숫자를 받습니다. 이 숫자를 보관하고 있다가 `isSmallerThan()` 메소드를 비교할 숫자를 넣어 호출하면 보관된 숫자와 비교해서 결과를 반환합니다. 이 개체의 `isSmallerThan()` 메소드를 `callable`로 호출하려고 합니다. 앞서 본 배열의 형태로 전달하면 됩니다.

```php
$nums = [1, 2, 3, 4, 5, 6, 7];

// 앞서 작성한 필터를 생성합니다
$five = new CompareWithFilter(5);

// 5보다 작은 숫자를 걸러냅니다
$filtered = array_filter($nums, [$five, 'isSmallerThan']);
// 5가 1보다 작다? -> false
// 5가 2보다 작다? -> false
// 5가 3보다 작다? -> false
// 5가 4보다 작다? -> false
// 5가 5보다 작다? -> false
// 5가 6보다 작다? -> true
// 5가 7보다 작다? -> true

var_dump($filtered);
// array(2) {
//   [5]=>
//   int(6)
//   [6]=>
//   int(7)
// }
```

개체를 활용하는 더 간단한 방법도 있을까요? 클래스에 `__invoke()` 매직 메소드를 선언하면 그 개체 자체를 호출할 수 있습니다.

```php
class SmallerThan {
  protected $num;
  public function __construct($num) {
    $this->num = $num;
  }
  public function __invoke($input) {
    return  $input > $this->num;
  }
}

$two_is_smaller_than = new SmallerThan(2);
is_callable($two_is_smaller_than); // true
var_dump($two_is_smaller_than(3)); // true
```

위에서 확인할 수 있는 것처럼 이렇게 생성한 인스턴스도 `callable` 타입에 해당합니다. `array_filter()` 함수에서도 문제 없이 동작하는 것을 확인할 수 있습니다.

```php
$nums = [1, 2, 3, 4, 5, 6, 7];
$five_is_smaller_than = new SmallerThan(5);
$filtered = array_filter($nums, $five_is_smaller_than);
// array(2) {
//   [5]=>
//   int(6)
//   [6]=>
//   int(7)
// }
```

그런데 PHP에는 익명 클래스도 존재합니다. 간단하게 사용할 클래스라면 익명 클래스를 활용할 수도 있습니다. 여기서 배운 `__invoke()` 매직 메소드를 사용하면 익명 클래스도 `callable`로 사용할 수 있습니다.

```php
//@ PHP >= 7.0
// $num의 배수만 골라내는 클래스에 3으로 초기화하고 사용
array_filter($nums, new class(3) {
  protected $num;
  public function __construct($num) {
    $this->num = $num;
  }
  public function __invoke($input) {
    return $input % $this->num === 0;
  }
});
// array(2) {
//   [2]=>
//   int(3)
//   [5]=>
//   int(6)
// }
```

장황하게 보이지만 신기하게도 가능합니다.

그렇다면 반대로 `callable`을 아주 간단하게 작성할 방법은 없을까요? 용도가 유일해서 다른 곳에서 쓸 일이 없는 필터라면 명시적인 클래스나 함수로 선언하지 않는 것이 가장 깔끔할 겁니다.

## 클로저(Closure)를 `callable`로 활용하기

다른 곳에서 활용할 일이 없는 필터라면 익명 함수를 활용해도 간단하고 편리합니다.

```php
//@ PHP >= 5.3
$is_even = function ($num) {
  return $num % 2 === 0;
};

var_dump($is_even(2)); // true
var_dump(is_callable($is_even)); // true

var_dump($is_even);
// object(Closure)#1 (1) {
//   ["parameter"]=>
//   array(1) {
//     ["$num"]=>
//     string(10) "<required>"
//   }
// }
```

위 결과처럼 익명 함수를 선언하면 클로저 개체로 반환됩니다. 이 클로저 클래스에는 `__invoke()` 메소드가 내장되어 있어서 앞서 본 예제와 같이 실행 가능한 개체로 동작합니다. 위에서는 변수에 할당했지만 아래처럼 바로 사용하는 것도 문제 없습니다.

```php
$nums = [1, 2, 3, 4, 5, 6, 7];
// 짝수만 골라내는 익명 함수
$even_nums = array_filter($nums, function ($num) {
  return $num % 2 === 0;
});
var_dump($even_nums);
// array(3) {
//   [1]=>
//   int(2)
//   [3]=>
//   int(4)
//   [5]=>
//   int(6)
// }
```

앞서 작성한 숫자 비교는 이 익명 함수에서 어떻게 작성할 수 있을까요? 비교하려는 숫자를 함수 내에 명시하지 않고 외부에서 지정하는 것도 가능합니다. 익명 함수를 작성할 때, `use` 키워드로 바깥 스코프에 있는 변수를 사용할 수 있습니다.

```php
$nums = [1, 2, 3, 4, 5, 6, 7];
$other_num = 5;

// `$other_num`보다 작은 숫자만 골라내기
$filtered = array_filter($nums, function ($num) use ($other_num) {
  return $num < $other_num;
});

var_dump($filtered);
// array(4) {
//   [0]=>
//   int(1)
//   [1]=>
//   int(2)
//   [2]=>
//   int(3)
//   [3]=>
//   int(4)
// }
```

화살표 함수를 사용하면 더 간단하게 작성할 수 있습니다. 화살표 함수는 익명 함수를 더 간결하게 작성할 수 있는 문법입니다.

```php
//@ PHP >= 7.4
// `$other_num`보다 작은 숫자만 골라내기
$filtered = array_filter($nums, fn($num) => $num < $other_num);
```

이 화살표 함수는 앞서 작성한 익명 함수와 동일한 역할을 하면서도 더 간결합니다. 부모 스코프에 있는 변수도 별도 지정 없이 바로 사용할 수 있습니다.

## `CallableExpr(...)` 문법으로 `callable` 날개 달기

마지막으로 살펴 볼 내용은 `CallableExpr(...)` 문법입니다. 이 문법을 사용하면 `callable` 문자열로 처리하는 동안 생기는 말썽을 해결할 수 있습니다. 하지만 이 문법을 보기 전에 먼저 `Closure::fromCallable()` 메소드를 확인합니다.

이 정적 메소드는 `callable`을 전달하면 `Closure` 개체로 감싸서 반환하는 래퍼 함수(wrapper function)입니다.

```php
function sayHello() {
        echo "Hello!";
}       

//@ PHP >= 7.4
$actor = Closure::fromCallable('sayHello');
var_dump($actor);
// object(Closure)#1 (0) {
// }

$actor(); // Hello!
```

문자열로 되어 있는 `callable`을 `Closure` 인스턴스로 바꿔서 활용합니다. 이 메소드를 `CallableExpr(...)` 문법으로 사용할 수 있습니다.

```php
$a = Closure::fromCallable('sayHello');
$b = sayHello(...); // 위 메소드 호출과 동일한 표현

var_dump($a == $b); // true
```

다음과 같은 방식으로 사용하게 됩니다.

```php
$nums = [1, 2, 3, 4, 5, 6, 7];

function is_even($number) {
  return $number % 2 === 0;
}

//@ PHP >= 8.1
$even_nums = array_filter($nums, is_even(...));

var_dump($even_nums);
// array(3) {
//   [1]=>
//   int(2)
//   [3]=>
//   int(4)
//   [5]=>
//   int(6)
// }
```

이전에 문자열일 때는 존재하지 않는 함수명을 적을 수 있는 문제가 있었습니다.  `CallableExpr(...)` 문법은  `callable`에 없는 메소드 등을 사용하는걸 방지하는데 도움이 됩니다. 또한 문자열이나 배열로 된 `callable`을 다루는 방식보다 이 문법은 좀 더 일관성이 있습니다.

이 문법은 어떤 `callable`이든 활용할 수 있습니다. 앞에서 살펴본 `callable` 예제를 이 문법으로 작성하면 다음과 같습니다.

```php
// 1. 함수
// array_filter($nums, 'is_even');
array_filter($nums, is_even(...));

// 2. 정적 클래스 메소드
// array_filter($nums, 'NumberFilter::is_odd');
// array_filter($nums, NumberFilter::class . '::is_odd');
// array_filter($nums, [NumberFilter::class, 'is_odd']);
array_filter($nums, NumberFilter::is_odd(...));

// 3. 개체 메소드
// array_filter($nums, [$five, 'isSmallerThan']);
array_filter($nums, $five->isSmallerThan(...));
```

## `callable` 정리

이 글에서 다룬 모든 `callable` 타입 표현을 정리합니다.

### 문자열 callable

```php
$a = 'sayHello';
$b = 'Foo\Bar\SomeClass::filter';
$c = Foo\Bar\SomeClass::class . '::filter';
```

### 배열 callable

```php
$a = [Foo\Bar\SomeClass::class, 'filter'];
$b = [$obj, 'methodName'];
```

### `__invoke()` 매직 메소드가 있는 인스턴스

```php
//@ PHP >= 5.3
$obj;
```

### 익명함수 (클로저) callable

```php
//@ PHP >= 5.3
$a = function ($num) use ($other) { /* ... */ };
//@ PHP >= 7.4
$b = fn($num) => $num > $other; // 축약식 (화살표 함수)
```

### `__invoke()` 매직 메소드가 있는 익명 클래스

```php
//@ PHP >= 7.0
$a = new class () {
  public function __invoke() {
    /* ... */
  }
};
```

### `Closure::fromCallable()`로 만든 클로저 callable

```php
//@ PHP >= 7.4
$a = Closure::fromCallable('sayHello');
```

### `CallableExpr(...)`로 만든 클로저 callable

```php
//@ PHP >= 8.1
$a = sayHello(...);
$b = Foo\Bar\SomeClass::is_odd(...);
$c = $obj->methodName(...);
```
