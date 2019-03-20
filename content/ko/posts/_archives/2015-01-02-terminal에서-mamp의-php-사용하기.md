---
title: Terminal에서 MAMP의 php 사용하기
author: haruair
type: post
date: "2015-01-02T01:33:14"
history:
  - 
    from: https://www.haruair.com/blog/2604
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: using-php-with-mamp-in-terminal
categories:
  - 개발 이야기
tags:
  - mamp
  - php
  - terminal

---
요즘 대부분의 php 도구들이 콘솔에서 사용할 수 있도록 제공되고 있다. OSX에는 기본적으로 php가 설치되어 있고 별다른 설정이 없다면 이 php를 사용하게 된다. [composer][1] 같은 도구는 php 버전이나 모듈과는 큰 영향이 없어서 기본 설치 과정을 따라해도 큰 문제가 없지만 데이터베이스 연결이 필요하거나 하는 경우에는 문제가 발생할 수 있다.

[MAMP][2] 환경을 설치해서 개발에 사용하고 있다면 이 MAMP에서 사용하고 있는 php를 간단하게 연결해서 활용할 수 있다.

이와 관련해서 검색해보면 직접 컴파일해서 패키지를 설치하라거나 mamp-php 등의 이름으로 심볼릭 링크를 연결해주는 등 여러 방법이 있었는데 다 장단점이 있었고 가장 간단하고 별 문제 없는 방식이 기존 설치되어 있는 php를 mamp 안에 있는 php로 심볼릭 링크를 생성해주는 방법이었다.

먼저 php가 설치되어 있는 위치를 찾는다.

    $ which php
    /usr/local/opt/php56/bin/php
    

내 경우는 brew로 php5.6을 설치해 경로가 다른데 `/usr/local/bin/php` 쯤 될 것이다. 파일명을 변경하고 심볼릭 링크를 생성한다.

    $ cd /usr/local/opt/php56/bin/
    $ mv php php_backup
    $ ln -s /Applications/MAMP/bin/php/php<사용하는 php version>/bin/php php
    

이렇게 변경하면 기본 php를 mamp에서 사용하는 php로 사용할 수 있다.

* * *

2015년 1월 20일 추가.

환경변수를 추가해주는 방법도 있었다. (왜 이걸 생각하지 못했는지 ㅠㅠ) 다음 두 값을 zsh 사용자는 `.zshrc`, bash 사용자는 `.bash_profile`에 추가하면 된다.

    export MAMP_PHP=/Applications/MAMP/bin/php/php<사용하는 php version>/bin
    export PATH="$MAMP_PHP:$PATH"
    

환경변수에 선언되어 있는 순서대로 명령어를 실행할 수 있는 프로그램이 있는지 확인한다. 정상적으로 연결되어 있는지는 앞서 사용했던 `which` 명령어로 확인할 수 있다.

 [1]: http://haruair.com/blog/1860
 [2]: http://haruair.com/blog/2231