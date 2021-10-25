---
title: PHP 의존성 관리도구 – Composer 시작하기
author: haruair
type: post
date: "2013-10-29T06:14:30"
history:
  - 
    from: https://www.haruair.com/blog/1860
    movedAt: 2018-09-13T22:02:40+00:00
lang: ko
slug: php-dependency-management-tool-getting-started-with-composer
tags:
  - 번역
  - composer
  - Dependency
  - php
  - psr

---
[Composer][1]라는 PHP 의존성 관리도구가 있다고 하길래 재빨리 찾아 Getting Started만 발번역했다. npm이나 apt, pip같은 것들과는 닮았지만 다른 부분이 많은데 그만큼 PHP라는 언어에 대한 고민의 흔적을 느낄 수 있다.

* * *

Composer는 PHP를 위한 의존성 관리도구다. 이 도구를 사용해 해당 프로젝트에서 요구하는, 의존적인 라이브러리를 선언해 프로젝트에서 설치해 사용할 수 있도록 돕는다.

# 의존성 관리도구

Composer는 패키지 관리도구가 아니다. 물론 각 프로젝트 단위로 패키지나 라이브러리를 다룬다면 그런 역할을 할 수 있다. 하지만 이 패키지나 라이브러리는 프로젝트 내 디렉토리 단위로 설치된다. (예로 `vender`) 기본적으로 composer는 절대 전역적으로 사용하도록 설치하지 않는다. 그러므로 의존성 관리도구라고 부른다.

<!--more-->

이 아이디어는 새로운 것이 아니며 Composer는 nodejs의 npm이나 ruby의 bundler에 커다란 영감을 얻어 만들어졌다. 그러나 이러한 도구는 PHP에 적합하지 않았다.

Composer가 해결한 문제는 다음과 같다:

a) 프로젝트가 여러개의 라이브러리에 의존적이다 b) 몇 라이브러리가 다른 라이브러리에 의존성이 있다 c) 무엇에 의존성이 있는지 선언할 수 있다 d) Composer는 설치할 필요가 있는 패키지 버전을 찾아 설치한다. (프로젝트 안으로 설치한다는 뜻이다)

# 의존성 선언

프로젝트를 생성할 때 필요로 하는 라이브러리를 적어줘야 한다. 예를 들어 [monolog][2]를 프로젝트에서 사용하기로 결정했다고 치자. 그렇다면 필요로 하는 것은 `composer.json` 파일을 생성하고 프로젝트의 의존성을 명시적으로 작성해주면 된다.

    {
        "require": {
            "monolog/monolog": "1.2.*"
        }
    }
    

# 시스템 요구사항

Composer는 동작하기 위해 PHP 5.3.2 이상을 요구한다. 또한 몇가지의 php 세팅과 컴파일 플래그를 필수적으로 요구하며 설치할 때 적합하지 않은 부분에 대해 경고해줄 것이다.

소스로부터 패키지를 설치할 때 단순히 zip 압축파일을 받는 대신 어떻게 패키지가 버전관리 되는지에 따라 git, svn 또는 hg가 필요할 것이다.

Composer는 멀티플랫폼을 지원하며 Windows, Linux와 OSX에서 동일하게 동작하도록 만들기 위해 노력하고 있다.

# *nix 환경 설치

## 실행 가능한 composer 다운로드하기

### 지역 설치 (locally)

Composer를 받기 위해서는 두가지가 필요하다. 첫째로 Composer를 설치하는 것이다. (프로젝트에 Composer를 내려받는다는 의미):

    $ curl -sS https://getcomposer.org/installer | php
    

이 과정은 요구되는 PHP 세팅 몇가지를 확인한 후 `composer.phar`를 작업 디렉토리에 내려받는다. 이 파일은 Composer 바이너리이며 PHAR(PHP 아카이브)로 PHP를 커맨드 라인으로 실행할 수 있도록 해주는 아카이브 포맷이다.

당신은 Composer를 `--install-dir` 옵션과 함께 경로 디렉토리를 입력해 특정 디렉토리에 설치가 가능하다 (절대경로와 상대경로 모두 가능):

    $ curl -sS https://getcomposer.org/installer | php -- --install-dir=bin
    

### 전역 설치 (Globally)

이 파일은 어디든 원하는 곳에 위치할 수 있다. 이 파일의 위치를 `PATH` 환경변수에 지정된 곳에 넣어두면 전역적으로 사용할 수 있다. unix와 같은 시스템에서 `php` 없이 실행할 수 있도록 만들 수도 있다.

아래의 명령어는 `composer`로 시스템 어디에서든 쉽게 실행할 수 있도록 한다:

    $ curl -sS https://getcomposer.org/installer | php
    $ mv composer.phar /usr/local/bin/composer
    

노트: 권한 문제가 있다면 `mv` 부분은 sudo를 이용해 다시 실행한다.

그리고 `php composer.phar`로 실행하는 대신 `composer`로 실행하면 된다.

### 전역 설치 (homebrew를 이용해 OSX에서 설치)

Composer는 homebrew-php 프로젝트의 일부다.

  1. homebrew-php가 아직 설치되지 않았다면 brew를 통해 설치: `brew tap josegonzalez/homebrew-php`
  2. `brew install josegonzalez/php/composer`를 실행
  3. `composer` 명령어로 사용

노트: PHP53 또는 그 이상의 버전이 존재하지 않는다는 에러가 나타나면 `brew install php53-intl`로 설치한다.

# Windows 환경 설치

## 인스톨러 이용

Composer를 설치하기 가장 쉬운 방법이다.

[Composer-Setup.exe][3] 를 내려받아 실행한다. 이 인스톨러는 가장 최신 버전의 Composer를 `PATH`로 설정된 경로에 설치해 어느 경로에서든 `composer` 명령어를 사용할 수 있도록 해준다.

## 수동 설치

`PATH` 경로로 이동해 설치 스니핏을 실행하여 composer.phar를 내려받는다:

    C:\Users\username>cd C:\bin
    C:\bin>php -r "eval('?>'.file_get_contents('https://getcomposer.org/installer'));"
    

노트: 위 내용 중 file\_get\_contents 함수가 동작하지 않는다면 `http` 주소로 내려받거나 php.ini에 php_openssl.dll를 활성화한다.

`composer.phar`를 위한 `composer.bat`를 생성한다:

    C:\bin>echo @php "%~dp0composer.phar" %*>composer.bat
    

현재 터미널을 닫고 새 터미널에서 아래와 같이 테스트한다:

    C:\Users\username>composer -V
    Composer version 27d8904
    
    C:\Users\username>
    

# Composer 사용하기

이제 Composer를 사용해 프로젝트에서 의존하고 있는 라이브러리를 내려받는다. `composer.json` 파일이 현재 디렉토리에 존재하지 않는다면 [Basic Usage][4] 챕터로 넘어가도 된다.

의존적인 라이브러리를 내려받기 위해서, `install` 명령어를 실행한다:

    $ php composer.phar install
    

전역 설치를 했다면 phar 없이 아래와 같이 실행한다:

    $ composer install
    

위에서 예로 들었던 부분에 따라, 위 명령어를 통해 monolog를 `vendor/monolog/monolog` 디렉토리로 내려받게 된다.

# 자동 불러오기

라이브러리를 다운받는 것 이외에 Composer는 어떤 라이브러리든 자동으로 적합한 라이브러리를 불러와 사용하도록 돕는다. 자동 불러오기를 사용하려면 단지 아래의 코드를 넣어준다:

    require 'vendor/autoload.php';
    

이제 monolog를 바로 사용할 수 있다. Composer에 대해 더 배우기 위해서는 [Basic Usage][4] 챕터를 참고한다.

* * *

### 더 읽을 거리

Xpressengine에서 [Composer 문서를 전문 번역][5]했다.

 [1]: http://getcomposer.org/
 [2]: https://github.com/Seldaek/monolog
 [3]: https://getcomposer.org/Composer-Setup.exe
 [4]: http://getcomposer.org/doc/01-basic-usage.md
 [5]: http://xpressengine.github.io/Composer-korean-docs/