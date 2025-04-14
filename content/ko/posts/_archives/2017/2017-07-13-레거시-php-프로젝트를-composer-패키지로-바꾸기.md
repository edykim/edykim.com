---
title: 레거시 php 프로젝트를 composer 패키지로 바꾸기
author: haruair
uuid: "6f253217-3d63-43e9-8b13-cd518270862e"
type: post
date: "2017-07-13T08:41:27"
history:
  - 
    from: https://www.haruair.com/blog/3968
    movedAt: 2018-09-13T22:02:42+00:00
lang: ko
slug: replace-a-legacy-php-project-with-a-composer-package
tags:
  - 개발 이야기
  - composer
  - php

---
요즘 작업하는 환경이 상당히 오래된 코드를 접할 수 있는 환경이라서 코드를 정리하는 일이 많은데 최근 버전에서도 돌아갈 수 있도록 코드를 정리하는 김에 패키지로 관리하고 테스트도 작성하도록 팀에 권하고 있다. 특별하다고 볼 만한 부분은 아니지만 정리 겸 작성한다. 사실 제목에 비해 내용이 별로 많질 않다. 나중에 기회가 되면 더 세세하게 작성해보고 싶다.

## 프로젝트 구조 잡기

새로운 프로젝트를 시작하든 레거시 프로젝트를 리팩토링하든 `composer.json`을 작성하는 작업으로 시작하게 된다. `composer.json`은 `composer init` 명령을 사용하면 인터렉티브로 쉽게 생성할 수 있다.

최종적인 프로젝트의 디렉토리/파일 구조는 다음과 같다.

    my-project/
        src/     -- 소스 코드
        tests/   -- 테스트 코드
        bin/     -- 실행 파일이 있는 경우
        public/  -- 웹 프로젝트인 경우
            index.php
            .htaccess
        composer.json
        phpunit.xml.dist
        .gitignore
        readme.md
    

가장 먼저 설치하는 패키지는 phpunit이다. 개발에만 사용하는 패키지로 `require-dev`로 설치한다.

    $ composer require --dev phpunit/phpunit
    

`composer.json` 파일을 열어 내 코드를 위한 `autoload`, `autoload-dev` 항목을 추가한다.

    "autoload": {
        "psr-4": {
            "MyProject\\": "src"
        }
    },
    "autoload-dev": {
        "psr-4": {
            "MyProject\\Test\\": "tests"
        }
    }
    

autoload 규칙을 갱신한다.

    $ composer dump-autoload
    

이제 각 `src`, `tests` 내에 PSR-4에 따라 파일을 작성한다면 네임스페이스를 통해 사용할 수 있게 되었다.

테스트는 주로 phpunit을 사용하고 있다. 기본적으로 사용하는 최소 설정 파일이 있고 그 외 데이터베이스 등을 환경변수로 추가해서 사용하고 있다. `phpunit.xml.dist`으로 저장한다.

    <?xml version="1.0" encoding="UTF-8"?>
    <phpunit colors="true"
             bootstrap="vendor/autoload.php"
             stderr="true">
        <testsuites>
            <testsuite name="all">
                <directory suffix="Test.php">tests/</directory>
            </testsuite>
        </testsuites>
    </phpunit>
    

`.gitignore`에 `phpunit.xml`을 추가한다. phpunit은 `phpunit.xml`이 있으면 해당 파일을 설정에 사용하게 된다. 없는 경우에는 `phpunit.xml.dist`를 사용한다. 여기서는 별다른 설정이 필요 없으니 `phpunit.xml`을 생성하지 않는다.

[정적 분석을 위해 phan도 설치][1]한다.

## 테스트와 코드 작성

`test` 폴더에 `HelloWorldTest.php`를 생성하고 예제를 위한 테스트를 작성한다.

```php
<?php
namespace MyProject\Test;

use PHPUnit\Framework\TestCase;
use MyProject\HelloWorld;

class HelloWorldTest extends TestCase
{
    public function testSaySomething()
    {
        $expected = 'Hello world';

        $world = new HelloWorld;
        $actual = $world->saySomething();

        $this->assertEquals($expected, $actual);
    }
}
```

`vendor/bin/phpunit`을 실행하면 다음처럼 테스트에 실패하는 것을 확인할 수 있다.

    PHPUnit 6.1.3 by Sebastian Bergmann and contributors.
    
    E                                                                   1 / 1 (100%)
    
    Time: 90 ms, Memory: 10.00MB
    
    There was 1 error:
    
    1) MyProject\Test\HelloWorldTest::testSaySomething
    Error: Class 'MyProject\HelloWorld' not found
    
    /Users/edward/Documents/php/my-project/tests/HelloWorldTest.php:13
    
    ERRORS!
    Tests: 1, Assertions: 0, Errors: 1.
    

에러 메시지에 따라서 `MyProject\HelloWorld` 클래스를 만들어야 한다. `src`에 `HelloWorld.php`를 추가한다.

```php
<?php
namespace MyProject;

class HelloWorld
{
}
```

다시 PHPUnit을 실행한다.

    There was 1 error:
    
    1) MyProject\Test\HelloWorldTest::testSaySomething
    Error: Call to undefined method MyProject\HelloWorld::saySomething()
    
    /Users/edward/Documents/php/my-project/tests/HelloWorldTest.php:14
    

이번에는 정의되지 않은 `saySomething()` 메소드를 호출했다. 메소드를 작성한다.

```php
<?php
namespace MyProject;

class HelloWorld
{
    public function saySomething()
    {
    }
}
```

다시 phpunit을 실행한다.

    There was 1 failure:
    
    1) MyProject\Test\HelloWorldTest::testSaySomething
    Failed asserting that null matches expected 'Hello world'.
    

이제 오류는 없어진 대신 실패가 발생했다. 이제 반환값을 지정한다.

```php
<?php
namespace MyProject;

class HelloWorld
{
    public function saySomething()
    {
        return 'Hello world';
    }
}
```

phpunit을 구동하면 테스트를 통과하는 것을 확인할 수 있다.

* * *

여기서는 예제라는 생각으로 HelloWorld를 가장 먼저 작성했지만 주로 엔티티가 되는 단위를 먼저 작성하고 엔티티를 사용하는 리포지터리, 리포지터리를 사용하는 서비스, 서비스를 사용하는 컨트롤러 순으로 주로 작성하고 있다. 레이어가 많아지면 자연스럽게 의존성 주입을 담당하는 패키지를 사용하게 되는데 [php-di][2]를 주로 사용하고 있다.

phpunit은 테스트 데이터베이스를 위해 [dbunit][3]을 제공하고 있는데 여기서 쓰는 클래스가 좀 깔끔하질 못해서 `DatabaseTestCase`를 프로젝트 내에 재정의하는 경우가 많이 있다. 그리고 phpunit에서 의존성 주입을 자체적으로 지원하지 않고 있기 때문에 어쩔 수 없이 서비스 로케이터 패턴처럼 사용해야 한다. 이를 위해 container에 접근할 수 있도록 하는 `TestCase`도 프로젝트 내에 재정의해서 사용하고 있다.

목킹은 phpunit에서 기본적으로 제공하는 mockBuilder를 사용하고 있다.

레거시 코드에서 컴포저로 변경하는 경우에는 기존 파일 구조에 위에서 언급한 구조대로 생성한 후, 하나씩 정리하고 테스트를 작성하며 `src` 아래로 옮기는 방식으로 진행하고 있다. 여기서는 phpunit에서 `vendor/autoload.php`를 바로 불러오고 있지만 그 외 추가적인 작업이 필요한 경우에는 `tests/bootstrap.php`를 만들어서 테스트에만 필요한 코드를 추가하는 방식으로 많이 작성하고 있다.

레거시 프로젝트는 비지니스 로직을 코드 레벨이 아니라 쿼리 레벨에서 처리하는 경우가 많아 ORM을 바로 도입하기 어려운 경우가 많았다. 그래서 `PDO`를 사용하는 경우가 많이 있다. `PDO`를 사용할 때는 `PDO::ERRMODE_EXCEPTION`를 적용해서 예외 처리를 하는 편이고 `PDO::FETCH_CLASS`를 사용해서 배열보다 개체 형식으로 데이터를 처리하고 있다. 클래스를 사용하기 어려운 테이블 구조(예로 EAV 모델)인 경우는 어쩔 수 없이 직접 클래스에 주입하는 편이다.

환경설정은 [phpdotenv][4]를 사용하는 편인데 팀 내 윈도 사용자들이 어색하다는 언급이 좀 있어서 `.env` 대신 `config.dist.php`, `config.php`를 최상위에 두는 방식으로도 작성한다.

 [1]: http://www.haruair.com/blog/3962
 [2]: http://php-di.org/
 [3]: https://github.com/sebastianbergmann/dbunit
 [4]: https://github.com/vlucas/phpdotenv