---
title: PHP 클래스 자동으로 불러오기 (Autoloading)
author: haruair
type: post
date: "2014-09-15T22:51:33"
history:
  - 
    from: https://www.haruair.com/blog/2323
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: autoloading-php-classes
tags:
  - 개발 이야기
  - autoloading
  - class
  - php
  - psr
  - PSR-0

---
객체 지향 프로그래밍에 익숙한 개발자라면 하나의 파일에 하나의 클래스를 작성하는 방식에 익숙할 것이다. 다만 php는 다른 언어와 같이 라이브러리를 일괄적으로 불러오는 방법이 없어 위와 같은 접근 방법으로는 `require` 또는 `include`를 이용해 수많은 단일 파일을 불러들여야만 했었다.

PHP5에서는 클래스 또는 인터페이스 등을 호출했을 때 해당 파일을 자동으로 불러올 수 있도록 여러 함수를 제공한다. 먼저 `__autoload` 함수를 이용한 예제다.

    <?php
    function __autoload($className){
      include $className . '.php';
    }
    
    $foo = new Foo();
    $bar = new Bar();
    ?>
    

위와 같이 함수를 선언하면 `new Foo()`와 같이 클래스를 사용하는 순간 해당 클래스명으로 `__autoload` 함수가 실행, `Foo.php` 파일을 include한다.

다만 `__autoload` 함수는 `spl_autoload_register` 함수를 통해 대체될 수 있기 때문에 권장되지 않는다. `spl_autoload_register`는 다음과 같이 사용한다.

    <?php
    function my_autoloader($className){
      include 'classes/' . $className . '.class.php';
    }
    
    spl_autoload_register('my_autoloader');
    ?>
    

## PSR-0 Autoloading Standard

위 함수를 통해 모듈화가 가능하도록 PHP Framework Interop Group(PHP-FIG)에서 [PSR-0 Autoloading Standard][1]가 제안되었다. 해당 제안은 다음의 규약을 포함하고 있다.

  * 네임스페이스와 클래스명으로의 자격을 갖추기 위해서는 다음의 구조를 따라야 한다. `\<Vendor Name>\(<Namespace>\)*<Class Name>`
  * 각 네임스페이스는 최상위 네임스페이스를 가져야 한다. (&#8220;Vendor Name&#8221;)
  * 각 네임스페이스는 필요에 따라 서브 네임스페이스를 가질 수 있다.
  * 각 네임스페이스 구분자는 파일 시스템에서 해당 파일을 불러오기 위한 `디렉토리 구분자`로 사용된다.
  * 클래스명에 들어있는 `_` 글자도 디렉토리 구분자로 사용된다. 네임스페이스에서의 `_`는 특별한 의미가 없다.(PEAR 구현을 포함)
  * 완전한 네임스페이스와 클래스는 파일 시스템에서 불러올 때 `.php`를 접미어로 붙여 불러온다.
  * 알파벳으로 구성된 벤더명, 네임스페이스, 클래스명은 대소문자를 구분한다.

위 규약에 따른 예제는 PSR-0 문서에서 제공되고 있으며 [SplClassLoader 구현][2]도 해당 문서에서 확인할 수 있다.

다음은 문서에서 제공되는 `autoload` 함수 예제다.

    <?php
    function autoload($className) {
      $className = ltrim($className, '\\');
      $fileName = '';
      $namespace = '';
      if($lastNsPos = strpos($className, '\\')) {
        $namespace = substr($className, 0, $lastNsPos);
        $className = substr($className, $lastNsPos + 1);
        $fileName = str_replace('\\', DIRECTORY_SEPARATOR, $namespace) . DIRECTORY_SEPARATOR;
      }
      $fileName .= str_replace('_', DIRECTORY_SEPARATOR, $className) . '.php';
      require $fileName;
      }
    }
    ?>
    

## Composer 활용하기

Composer는 [PSR-4 Autoloader][3] 제안과 함께 위에서 살펴본 PSR-0를 준수하고 있어서 간단한 설정으로 PSR-0 방식을 사용할 수 있다. `composer.json`에 autoload 경로를 등록하면 composer의 `ClassLoader`와 맵핑되어 자동으로 불러온다.

    {
      ...
      "autoload": {
        "psr-0": {"": "<path>/"}
      },
      ...
    }
    

위 내용을 추가한 후 `composer update` 등을 통해 갱신하면 `vendor/composer/autoload_namespaces.php` 파일 안에 `composer.json`에서 작성한 경로가 추가된 것을 확인할 수 있다.

## 더 읽을 거리

  * [PHP: Autoloading Classes][4]
  * [PHP: spl\_autoload\_register][5]
  * [PSR-0 Autoloading Standard][1]
  * [Composer: Composer.json Schema][6]

 [1]: http://www.php-fig.org/psr/psr-0/
 [2]: http://gist.github.com/221634
 [3]: http://www.php-fig.org/psr/psr-4/
 [4]: http://php.net/manual/en/language.oop5.autoload.php
 [5]: http://php.net/manual/en/function.spl-autoload-register.php
 [6]: https://getcomposer.org/doc/04-schema.md