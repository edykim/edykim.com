---
title: PHP 기반의 Micro Frameworks 정리
author: haruair
type: post
date: "2013-10-29T06:24:34"
history:
  - 
    from: https://www.haruair.com/blog/1863
    movedAt: 2018-09-13T22:02:40+00:00
lang: ko
slug: php-based-micro-frameworks-theorem
tags:
  - 개발 이야기
  - micro framework
  - php

---
근래 들어서는 공개적으로 하는 작업은 아니지만 잔잔하게 프로토타이핑은 꾸준히 하고 있는데 `flask`와 `sqlalchemy` 조합으로 진행하고 있었다.

  * `flask`는 micro web framework이며 micro 답게 간단하게 작성 가능해 생각나는 대로 작성하기 편리
  * `sqlalchemy`는 class 정의 만으로 db를 쉽게 구성하고 코드와 스키마를 두번 작성하는 수고를 줄여주는, 짱짱 좋은 ORM

호기심으로 로컬의 php를 이번달에 공개한 5.5.5으로 업데이트 하면서 micro framework이 없을까 찾아봤더니 비슷한 컨셉의 프레임워크가 많이 보여 간단하게 정리해봤다. (sqlalchemy를 대안으로 사용할 php orm은 제대로 찾아보지 못했다.)

찾아보니 생각보다 많은 편이었고 flask에서 이용한 파이썬의 `delegate`과 같은 feature는 php에 존재하지 않기 때문에 다양한 방식으로 구현되어 있었다. 특히 php에서 `익명함수(Anonymous function)`는 5.3.0 이후 제공되고 있기 때문에 이를 기준으로 지원 여부를 살펴보는 것도 도움이 된다. [^1]

  * Slim <http://www.slimframework.com/>
  * Limonade <http://limonade-php.github.io/>
  * Flight <http://flightphp.com/>
  * Silex <http://silex.sensiolabs.org/>
  * Bullet <http://bulletphp.com/>
  * GluePHP <http://gluephp.com/>

대다수 micro framework는 `Composer`라는 의존성 관리도구를 설치하길 권장한다. [Composer 시작하기][1] 문서를 살펴보면 도움이 된다.

<!--more-->

## Slim

Slim은 composer를 통해 간편하게 설치할 수 있으며 PHP 5.3.0 이상을 요구한다.

    $app = new \Slim\Slim();
    $app->get('/hello/:name', function($name){
        echo 'Hello, ' . $name;
    });
    $app->run();
    

`$app`에 인스턴스를 할당할 때 mode, debug 등 다양한 옵션을 넣을 수 있으며 `use`[^3]를 이용한 스코핑 인젝션 등이 가능하다. 익명함수, 일반함수 두가지 모두 가능하다. Route가 명시적이라 코드 리딩이 더 쉬운 편이다. 자세한 내용은 Slim의 문서 <http://www.slimframework.com/> 참고.

## Limonade

Limonade <http://limonade-php.github.io/>는 루비의 Sinatra와 Camping, Lua의 Orbit의 영감으로 만들어진 PHP micro framework이다.

    require_once 'vendors/limonade.php';
    dispatch('/', 'hello');
      function hello()
      {
          return 'Hello world!';
      }
    run();
    

각 기능을 함수로 선언해 `dispatch`를 이용해 각 URL에 라우팅 하는 형태로, 직관적인 코드 작성이 가능하지만 동일한 함수명을 사용하지 않도록 주의해야 한다.

## Flight

Flight라는 Public class를 이용해 작성해나가는 형태의 framework이다.

    require 'flight/Flight.php';
    
    Flight::route('/', function(){
        echo 'hello world!';
    });
    
    Flight::start();
    

사용자가 선언한 인스턴스가 아닌 Flight를 반복적으로 입력해야 해서 별로 좋은 것 같진 않다. Flight <http://flightphp.com/>

## Silex

Silex <http://silex.sensiolabs.org/>는 앞서 살펴본 Slim과 상당히 유사하며 Symfony2 컴포넌트를 기반으로 한 특징을 가지고 있다.

    require_once __DIR__.'/../vendor/autoload.php'; 
    
    $app = new Silex\Application(); 
    
    $app->get('/hello/{name}', function($name) use($app) { 
        return 'Hello '.$app->escape($name); 
    }); 
    
    $app->run(); 
    

## Bullet

PHP 5.3+을 요구, 5.4 이상을 추천하는 framework이다. Composer로 패키지 관리가 가능하다.

    $app = new Bullet\App();
    $app->path('/', function($request) {
        return "Hello World!";
    });
    
    echo $app->run(new Bullet\Request());
    

확장성을 고려해 구현해둔 부분이 많이 보인다. [Bullet 문서][2] 참고.

## GluePHP

그냥 받아서 압축을 해제하면 바로 사용할 수 있는 micro framework이다. 다른 것들에 비해 가장 생각없이(?) 쉽게 사용할 수 있다.

    <?php
        require_once('glue.php');
        $urls = array(
            '/' => 'index'
        );
        class index {
            function GET() {
                echo "Hello, World!";
            }
        }
        glue::stick($urls);
    ?>
    

url에 대해 정규표현식으로 지정할 수 있는 특징이 있다. 각각의 메소드를 바인딩 하는 것이 아니라 클래스를 바인딩하며 각 클래스마다 `GET(), POST()` 등의 메소드를 호출하는 형태다. [^2]

[^1]:    
    사실 대다수의 micro framework는 5.3 이상을 요구한다. 그래도 예전에 비해 php 최근 버전을 지원하는 호스팅이 많이 늘었다.

[^3]:    
    익명함수 내부에서 외부의 변수를 이용하기 위해 사용하는 메소드다.

[^2]:    
    클래스의 단위를 잘 고려하지 않으면 쉽게 지저분해질 것 같다.

 [1]: http://haruair.com/blog/1860
 [2]: http://bulletphp.com/