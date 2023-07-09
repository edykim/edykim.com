---
title: "PHPStan으로 PHP 제네릭 활용하기"
author: haruair
type: post
date: "2022-08-29T02:42:22.879Z"
lang: ko
tags:
 - 개발 이야기
 - php
 - generic
slug: "php-generics-with-phpstan"
---

여러 동적 타입 언어가 각자의 방식대로 강타입을 지원해가는 과정은 정말 흥미롭습니다. php에서도 타입에 대한 더욱 다양한 지원을 추가하려는 노력이 계속되고 있는 데다 [PHPStan](https://phpstan.org/), [Psalm](https://psalm.dev/)과 같은 정적 분석 도구의 도움으로 더 단단한 코드를 쉽게 작성할 수 있게 되었습니다. 특히 [제네릭 부재에 대해 글](https://edykim.com/ko/post/php-interface-without-generics/)을 쓴 적도 있었을 만큼 제네릭이 도입되기를 기대하고 있었는데요. 수 년이 지난 지금은 PHP에서도 제네릭을 충분히 사용할 수 있는 환경이 되었습니다. phpdoc의 `@template` 키워드를 사용해서 작성하면 PHPStan과 같은 정적 분석 도구로 검사를 수행하는 방식으로 제네릭을 활용할 수 있습니다.

php에서는 별도의 빌드/컴파일 과정이 없기 때문에 정적 분석을 수행하는 과정이 낯설 수 있지만 실제로 코드를 실행하지 않고도 파일을 분석해서 문제를 검출할 수 있다는 점 자체는 정말 큰 장점입니다. PHPStorm은 이미 내장된 플러그인이 있어서 패키지를 설치하고 설정 파일만 작성하면 편리하게 개발 환경에 적용할 수 있습니다. VS Code에서도 또한 플러그인이 있어서 제네릭에 맞춰 반환 타입을 보여주는 등 편리하게 활용 가능합니다.

- [phpstan - PHP 정적 코드 분석기로 코드 품질 검사하기 - lesstif](https://www.lesstif.com/php-and-laravel/phpstan-php-static-analysis-tool-87949666.html) 정광섭님의 블로그에서 PHPStan을 어떻게 설치/설정하고 활용할 수 있는지 소개하고 있습니다.
- [VSCode 플러그인 - phpstan](https://marketplace.visualstudio.com/items?itemName=SanderRonde.phpstan-vscode)
- [PHPStorm에서의 PHPStan 설정 (영문) - JetBrains](https://www.jetbrains.com/help/phpstorm/using-phpstan.html)

제네릭(generic)은 클래스, 인터페이스, 메소드, 함수 등에서 타입을 미리 선언하되 나중에 사용할 때 어떤 타입인지 지정하는 식으로 활용할 수 있는 프로그래밍 스타일입니다. 대다수 프로그래밍 언어에서는 리스트와 배열 같은 자료 구조에서 가장 먼저 배우게 됩니다.

목록이라는 이름으로 자료 구조를 만든다고 생각해봅시다. 목록의 동작 방식을 코드로 작성하되 무슨 목록인지는 정하지 않습니다. 다시 말하면 구체적인 타입 대신 제네릭을 활용해서 작성하는 겁니다. 나중에 책이든 자동차든 어떤 타입이든 이 제네릭 목록에 적용해서 책 목록, 자동차 목록, 어떤 목록으로든 활용하는 것이 가능합니다.

먼저 기존 방식을 생각해봅시다. PHP에서 제공하고 있는 타입 힌트를 사용해서 다음처럼 `BookList` 클래스를 작성합니다.

```php
class Book
{
    public function __construct(protected string $title)
    {
    }
}

class BookList
{
    /**
     * @var Book[] $items
     */
    protected array $items = [];

    /**
     * @param Book[] $items
     */
    public function __construct(array $items = [])
    {
        $this->items = $items;
    }

    /**
     * 목록에서 인덱스에 해당하는 항목을 반환합니다
     */
    public function get(int $index): Book
    {
        return $this->items[$index];
    }

    /**
     * 목록에 제공된 항목을 추가합니다
     */
    public function add(Book $item): void
    {
        $this->items[] = $item;
    }
}

$list = new BookList([
    new Book('그리고 아무도 없었다'),
    new Book('바스커빌 가의 개'),
]);
$list->add(new Book('주홍색 연구'));
$list->get(2); // Book('주홍색 연구')

// PHPStan: [OK] No errors
```

위 코드에서는 `Book` 개체만 사용할 수 있는 `BookList` 클래스를 작성했습니다. 만약 `Car` 클래스를 추가한다면 위 코드와 별 차이는 없지만 별도의 `CarList`를 작성해야 합니다. 코드를 분리한다고 해도 각 메소드에서 타입을 지정하고 있기 때문에 별반 다르지 않은 상황입니다. 이런 상황에서 제네릭이 빛을 발합니다.

이제 `@template` 키워드를 사용해서 제네릭 목록 클래스를 작성합니다.

```php
/**
 * @template T
 */
class GenericList
{
    /**
     * @var T[] $items
     */
    protected array $items = [];

    /**
     * @param T[] $items
     */
    public function __construct(array $items = [])
    {
        $this->items = $items;
    }

    /**
     * 목록에서 인덱스에 해당하는 항목을 반환합니다
     *
     * @param int $index
     * @return T
     */
    public function get(int $index)
    {
        return $this->items[$index];
    }

    /**
     * 목록에 제공된 항목을 추가합니다
     *
     * @param T $item
     * @return void
     */
    public function add($item): void
    {
        $this->items[] = $item;
    }
}
```

달라진 점을 살펴봅니다. 클래스에서 어떤 제네릭 타입을 사용할지 `@template`을 사용했고 각 메소드의 인자에 직접 지정한 타입 힌트 대신 phpdoc으로 제네릭 타입을 지정했습니다. 다른 클래스인 `Computer`를 추가해서 이 제네릭 목록이 제대로 동작하는지 확인합니다.

```php
class Computer
{
    public function __construct(protected string $name)
    {
    }
}

$list = new GenericList([
    new Book('그리고 아무도 없었다'),
    new Book('바스커빌 가의 개'),
]);
$list->add(new Book('주홍색 연구'));
$list->add(new Computer('내 컴퓨터'));

// PHPStan: [ERROR] Found 1 error
// Parameter #1 $item of method GenericList<Book>::add()
//   expects Book, Computer given.
``` 

`GenericList<Book>`에 `Book`이 아닌 `Computer`를 추가했다는 에러가 발생합니다. 정적 분석으로 이 코드에 문제가 발생할 수 있음을 확인했습니다. 다만 이 코드는 현재로는 문제없이 실행 가능한 코드입니다. 실제 구동에 문제가 없더라도 코드 작성자의 의도에 맞게 동작하고 있는지는 또 고민해야 할 부분입니다. 책 목록에 자동차가 들어가는 상황은 괜찮을까요? 위 예제 코드에서는 큰 문제가 없지만 책 목록에서 책 제목을 찾는다고 가정하면 자동차 순서가 왔을 때 문제가 발생하게 됩니다. 이렇게 코드가 구동되는 런타임에서만 발견되는 문제는 문제 해결은 물론 원인을 추적하는 일조차 복잡한 일이 될 수도 있습니다.

다른 언어에서는 정적 분석에 오류가 있는 경우, 수정할 때까지 실행을 해보는 것 자체가 되질 않지만 PHP는 그런 과정 없이 실행할 수 있기 때문에 미리 잡을 수 있는 문제도 놓칠 수 있습니다. 그래서 이 정적 분석이 더 중요한 역할을 수행하게 됩니다.

사실 위 코드에서는 다른 문제가 발생할 수 있습니다.

```php
$list = new GenericList([
    new Book('그리고 아무도 없었다'),
    new Computer('도서관 공공 컴퓨터'),
]);
$list->add(new Book('주홍색 연구'));
$list->add(new Computer('내 컴퓨터'));
// PHPStan: [OK] No errors
```

위 코드를 보면 목록을 초기화하며 `Book`과 `Computer`가 동시에 존재합니다. PHPStan은 제네릭을 적용할 때 타입을 추론하기 때문에 위 코드에서는 `GenericList<Book|Computer>` 타입이 됩니다. 즉, `Book`과 `Computer`를 둘 다 사용할 수 있는 목록을 `$list`에 할당합니다.

가장 심각한 상황은 초기화 배열이 없는 경우입니다. 아무런 배열을 전달하지 않으면 `GenericList<mixed>`로 추론되어 아무 값이나 다 넣어도 오류가 발생하지 않습니다. 이런 추론은 php 맥락에서는 아주 자연스럽지만 코드를 작성한 의도와는 차이가 많이 날 수 있습니다. 단순하게 정적 분석에 의존하기를 넘어서 제대로 작성 의도가 반영되고 있는 지도 유심하게 봐야 합니다.

책만 다뤄야 하는 목록이라면 `@extends` 키워드를 활용해서 `GenericList<Book>`을 확장하는 `BookList` 클래스를 정의할 수 있습니다.

```php
/**
 * @extends GenericList<Book>
 */
class BookList extends GenericList {}

$list = new BookList([
    new Book('그리고 아무도 없었다'),
    new Book('바스커빌 가의 개'),
    new Computer('내 컴퓨터'),
]);

// PHPStan: [ERROR] Found 1 error
// Parameter #1 $items of class BookList constructor
//    expects array<Book>, array<int, Book|Computer> given.
```

또는 `@param` 키워드를 활용해서 `GenericList<Book>`만 인자로 허용하도록 작성할 수 있습니다.

```php
/**
 * @param GenericList<Book> $list
 * @return void
 */
public function updateBookTitles(GenericList $list): void
{
    // do something
}

$list = new GenericList([
    new Book('그리고 아무도 없었다'),
    new Book('바스커빌 가의 개'),
    new Computer('내 컴퓨터'),
]);

updateBookTitles($list);
// PHPStan: [ERROR] Found 1 error
// Parameter #1 $list of function updateBookTitles() expects
//   GenericList<Book>, GenericList<Book|Computer> given.
```

다음과 같은 파생 클래스를 생각해봅시다.

```php
class Book
{
    public function __construct(protected string $title)
    {
    }
}

class ClassicBook extends Book
{
}

class RomanceBook extends Book
{
}
```

이 각각의 파생 클래스로 이뤄진 목록에서 첫번째 책을 가져오려고 합니다. 다음처럼 함수를 작성해볼 수 있겠지만 아쉽게도 오류가 발생합니다.

```php
/**
 * @param GenericList<Book> $list
 * @return Book
 */
public function getFirstBook(GenericList $list): Book
{
    return $list->get(0);
}

$list = new GenericList([
    new ClassicBook('오디세이'),
    new RomanceBook('오만과 편견'),
]);

getFirstBook($list);

// PHPStan: [ERROR] Found 1 error
// Parameter #1 $list of function getFirstBook() expects
//    GenericList<Book>, GenericList<ClassicBook|RomanceBook> given. 
```

제네릭은 기본적으로 무공변성(invariant)으로 정의됩니다. 즉, `GenericList<Book>`은 `Book`만 허용합니다. 그렇다고 매번 새로운 책 타입이 추가될 때마다 `GenericList<ClassicBook|ScienceFictionBook|RomanceBook|HistoryBook>` 식으로 수정하긴 어렵습니다. 이런 경우에는 `@template-covariant` 키워드를 활용해서 타입이 공변성(covariant)을 지니고 있음을 정의해야 합니다.

공변성을 정말 간단하게 정리하면 다음과 같습니다. [공변성과 반공변성은 무엇인가?](https://edykim.com/ko/post/what-are-covariance-and-contravariance/) 글에서 좀 더 예시를 볼 수 있습니다.

- 공변성(covariance): 지정된 타입과 같거나 그보다 범위가 작아진 타입 허용
- 무공변성(invariance): 지정된 타입만 허용
- 반공변성(contravariance): 지정된 타입과 같거나 그보다 범위가 넓어진 타입 허용

먼저 다음과 같이 인터페이스를 추출할 수 있습니다.

```php
/**
 * @template-covariant T
 */
interface ReadableListInterface {
    /**
     * 목록에서 인덱스에 해당하는 항목을 반환합니다
     *
     * @param int $index
     * @return T
     */
    public function get(int $index);
}

/**
 * @template T
 */
interface WritableListInterface {
    /**
     * 목록에 제공된 항목을 추가합니다
     *
     * @param T $item
     * @return void
     */
    public function add($item): void;
}
```

제네릭 목록은 이 두 인터페이스를 모두 구현하고 있습니다. 다음처럼 정리할 수 있습니다.

```php
/**
 * @template T
 * @extends ReadableListInterface<T>
 * @extends WritableListInterface<T>
 */
interface GenericListInterface
    extends ReadableListInterface, WritableListInterface {}

/**
 * @template T
 * @implements GenericListInterface<T>
 */
class GenericList implements GenericListInterface
{
    /**
     * @var T[] $items
     */
    protected array $items = [];

    /**
     * @param T[] $items
     */
    public function __construct(array $items = [])
    {
        $this->items = $items;
    }

    public function get(int $index)
    {
        return $this->items[$index];
    }

    public function add($item): void
    {
        $this->items[] = $item;
    }
}
```

앞서의 함수도 다음처럼 `ReadableListInterface<Book>` 인터페이스를 사용하도록 수정합니다.

```php
/**
 * @param ReadableListInterface<Book> $list
 * @return Book
 */
public function getFirstBook(ReadableListInterface $list): Book
{
    return $list->get(0);
}

$list = new GenericList([
    new ClassicBook('오디세이'),
    new RomanceBook('오만과 편견'),
]);
getFirstBook($list);

// PHPStan: [OK] No errors
```

`ReadableListInterface<T>`에서의 `T`는 공변성을 지니고 있다고 `@template-covariant`로 정의한 덕분에 위처럼 파생 클래스를 대상으로도 동작하게 됩니다.

참고로 `ReadableListInterface<T>`와 `WritableListInterface<T>`로 분리하는 이유는 함수에서 인자 타입은 반공변성을 갖고 반환 타입은 공변성을 갖기 때문입니다. 이 부분은 PHP 자체에서도 강제하고 있습니다. 그래서 `WritableListInterface<T>`에서 `T`는 인자 타입에 사용되고 있는 상황에서 이 타입에 공변성이 있다고 정의하면 서로 충돌합니다. 다행히 이런 부분도 오류로 모두 확인할 수 있습니다. 인자 타입의 반공변성과 반환 타입의 공변성은 [공변성과 반공변성은 무엇인가?](https://edykim.com/ko/post/what-are-covariance-and-contravariance/)에서 더 자세히 확인할 수 있습니다.

---

여기까지 간단하게 제네릭 목록을 구현하면서 어떤 방식으로 제네릭을 활용할 수 있는지 확인했습니다. 아쉽게도 아직 반공변성을 위한 키워드는 제공되고 있지 않지만 PHPStan은 아직도 활발하게 개발이 진행되고 있어서 앞으로 기대해도 좋을 것 같습니다. 제네릭은 이 글에서 살펴본 방식 이외에도 다양하게 활용할 수 있습니다. PHPStan 블로그에 게시된 아래 글에서 더 많은 예시를 확인하시기 바랍니다.

- [Generics in PHP using PHPDocs - PHPStan](https://phpstan.org/blog/generics-in-php-using-phpdocs)
- [Generics By Examples - PHPStan](https://phpstan.org/blog/generics-by-examples)
