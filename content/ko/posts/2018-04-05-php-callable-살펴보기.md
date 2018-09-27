---
title: php callable 살펴보기
author: haruair
type: post
date: 2018-04-05T02:59:00+00:00
history:
  - 
    from: https://www.haruair.com/blog/4431
    movedAt: 2018-09-13T22:02:42+00:00
lang: ko
slug: a-look-at-php-callable
headline:
  - 문자열도 배열도 객체도 callable일 수 있는 신비한 php의 세계에서 callable을 알아보자
categories:
  - 개발 이야기
tags:
  - callable
  - closure
  - interface
  - php

---
php에서는 `callable` 이라는 타입 힌트를 제공한다. 이 타입 힌트는 말 그대로 호출이 가능한 클래스, 메소드, 또는 함수인 경우에 사용할 수 있다. php에서는 타입이 별도의 타입으로 존재하지 않는 대신에 문자열로 처리하고 있어서 다소 모호한 부분도 있다. `callable`을 타입 힌트로 사용했을 때 어떤 값을 넘길 수 있는지 명확히 알고 있어야 한다.

```php
function callableOnly(callable $callable): void {
    // callable에 해당하면 다음처럼 호출할 수 있음
    call_user_func($callable);

    // 일부를 제외하고는 다음과 같이 호출 가능함
    $callable();
}
```

특히 callable은 명확한 제한 없이 열어두고 사용하면 보안 문제 등을 만들어낼 수 있기 때문에 유의해야 한다.

## `callable`

다음은 `callable`에 해당하는 경우로 상당히 다양한 형태로 `callable`을 정의할 수 있다. 여기서는 `callable`인지 확인하는 `is_callable()` 함수를 사용했다.

### 함수

```php
function sayHello() {
    echo 'Hello';
}
is_callable('sayHello'); // true
```

꼭 사용자 정의 함수가 아니더라도 이와 같이 사용할 수 있다. 다만 언어에서 제공하는 구조는 callable에 해당하지 않는다. 예를 들면 `isset()`, `empty()`, `list()`는 callable이 아니다.

```php
is_callable('isset'); // false
```

### 익명 함수

```php
$hello = function () {
    echo 'Hello';
};

is_callable($hello); // true
```

### 정적 메소드

```php
class HelloWorld()
{
    static function say()
    {
        echo 'Hello World!';
    }
}
is_callable('HelloWorld::say'); // true
is_callable(['HelloWorld', 'say']); // true
is_callable([HelloWorld::class, 'say']); // true
```

`::class` 상수는 PHP 5.5.0 이후로 사용할 수 있는데 해당 클래스의 네임스페이스를 포함한 전체 클래스명을 반환한다. 문자열로 사용하는 경우에는 개발도구에서 정적분석을 수행하지 못하기 때문에 오류를 검출하기 어렵다. 대신에 이 상수를 사용하면 현재 맥락에서 해당 클래스가 선언되어 있는지 없는지 검사해주기 때문에 이런 방식으로 많이 작성한다.

주의할 점은 정적분석 기능이 없는 개발도구에서는 `::class`를 사용해도 문자열을 사용하는 것과 차이가 없다. `::class`는 실제로 해당 클래스로 인스턴스를 생성하거나 하지 않기 때문에 autoload와는 상관 없이 동작하기 때문이다.

```php
echo SomethingNotDefined::class; // "SomethingNotDefined"
```

대신 런타임에서 `is_callable`을 사용하거나 `callable`로 넘겨주는 경우에 정적 메소드의 경우는 autoload를 통해 검사하는 식으로 동작한다.

### 클래스 인스턴스 메소드

```php
class Person
{
    protected $name;

    public function __construct(string $name)
    {
        $this-&gt;name = $name;
    }

    public function getName(): string
    {
        return $this-&gt;name;
    }
}

$edward = new Person('Edward');
is_callable([$edward, 'getName']); // true
```

### 클래스의 스코프 해결 연산자를 이용한 메소드

스코프 해결 연산자(Scope Resolution Operator)를 `callable`에서도 사용할 수 있다. Paamayim Nekudotayim라고 부르는 `::`를 의미한다.

```php
class Animal
{
    public function getType()
    {
        echo 'Animal';
    }
}

class Dog extends Animal
{
    public function getType()
    {
        echo 'Dog';
    }
}

$dog = new Dog;
is_callable([$dog, 'parent::getType']); // true
call_user_func([$dog, 'parent::getType']); // Animal

$callable(); // 이 경우에는 이 방식으로 호출할 수 없음
```

구현 메소드 대신 부모 클래스의 메소드를 직접 호출할 수 있다. 관계를 뒤집는 좋지 않은 구현이므로 이런 방식에 의존적인 코드는 작성하지 않는다.

### 매직 메소드 `__invoke()`

`__invoke()` 매직 메소드가 구현된 클래스는 인스턴스를 일반 함수처럼 호출할 수 있다.

```php
class PersonSay
{
    protected $name;

    public function __construct(string $name)
    {
        $this-&gt;name = $name;
    }

    public function __invoke()
    {
        echo "Hello, {$this-&gt;name} said.";
    }
}

$say = new PersonSay('Edward');
is_callable($say); // true
call_user_func($say); // Hello, Edward said.
```

익명 클래스의 경우도 호출 가능하다.

```php
$say = new class {
    public function __invoke(string $name)
    {
        echo "What up, {$name}?";
    }
};
is_callable($say); // true
call_user_func($say, 'Edward'); // What up, Edward?
```

이 매직 메소드는 손쉽게 상태를 만들어낼 수 있어서 유용할 때가 종종 있다.

* * *

## Iterator를 `callable`로 사용할 수 있을까?

Iterator를 넘기면 인스턴스를 넘긴 것으로 인식해서 `__invoke()` 구현을 확인한다. 즉, Iterator를 루프를 돌려서 사용하지는 않는다.

## `Closure` vs `callable` vs 인터페이스

매개변수로 익명함수만을 받고 싶다면 `Closure`를 지정할 수 있다. 하지만 익명함수에도 `use` 키워드로 스코프를 집어 넣거나 `global`로 전역 변수에 접근하는 방식도 여전히 가능하기 때문에 `callable`이 아니더라도 `callable` 만큼 열려 있는 것이나 마찬가지라는 점에 유의해야 한다. 열려있는 것 자체는 문제가 아니지만 `Closure`, `callable`은 전달받은 함수가 사용하기 적합한지 판단해야 하는 경우가 생긴다. 예를 들면 매개변수의 숫자라든지, 타입이라든지 사용 전에 확인해야 하는 경우가 있다.

그래서 단순히 함수 기능이 필요하더라도 계약을 명확하게 들어내야 한다면 인터페이스를 활용하는게 바람직하다. 인터페이스를 사용하면 전통적인 방식대로 인터페이스를 구현해서 사용하면 되겠다. 물론 익명 클래스로 다음처럼 사용할 수 있다. 익명 함수에 비해서는 다소 장황하게 느껴질 수 있지만 사전조건으로 검증해야 하는 내용을 줄일 수 있다.

```php
interface NamedInterface
{
    public function getName(): string;
}

function sayHello(NamedInterface $named): void {
    echo "Hello! {$named-&gt;getName()} said.";
}

sayHello(new class implements NamedInterface {
    public function getName(): string {
        return 'Edward';
    }
});
```

모든 방법에는 장단점이 있으므로 필요에 따라 어느 접근 방식을 택해야 할지 결정 해야겠다.