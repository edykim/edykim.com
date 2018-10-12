---
title: 일반 PHP 프로젝트 개발 환경에서 docker 사용하기
author: haruair
type: post
date: 2018-04-05T09:54:21+00:00
history:
  - 
    from: https://www.haruair.com/blog/4430
    movedAt: 2018-09-13T22:02:42+00:00
lang: ko
slug: using-the-docker-in-a-regular-php-project-development-environment
categories:
  - 개발 이야기
tags:
  - docker
  - php

---
지금 있는 회사에서도 정말 오래된 php 페이지가 발굴되어 작업해야 하는 경우가 간혹 있다. 예전에는 그냥 MAMP 같은 패키지를 사용해도 큰 문제가 없었다. 이 회사에서는 기본적으로 포함되어 있지 않은 익스텐션을 사용하는 경우가 많아서 (ldap이라든지) 여기 온 이후로는 docker를 많이 사용하고 있다. 물론 배포 환경은 그대로라서 로컬에서만 주로 사용하고 있다. 배포까지 일괄적으로 사용하지 못하는게 좀 아쉽다.

라라벨과 같은 프레임워크를 사용하고 있으면 이미 공개된 docker도 많고 튜토리얼도 찾기 쉽다. 대신 예전 방식으로 작성된 코드를 기준으로 설명하는건 별로 못본 것 같아서 간단하게 정리하려고 한다. 이 글에서는 용어 없이 슥슥 넘어가는 부분이 많다. 또한 실제로 배포 환경까지 사용하지 않고 로컬에서만 사용하더라도 편리한 점이 많다. 그래서 단순히 로컬에서 php 프로젝트를 돌린다는 것 자체에 한정했다. 이 글에서는 **docker-compose로 php-apache, mysql 스택을 빠르게 구성하는 방법** 을 살펴본다.

도커에 대해 자세히 알고 싶다면 다음 글을 보자.

  * [도커(Docker) 튜토리얼 : 깐 김에 배포까지][1]
  * [초보를 위한 도커 안내서 &#8211; 도커란 무엇인가?][2]

이 글에서는 다음 이미지를 사용하고 있다.

  * [php][3]
  * [mariadb][4]
  * [phpmyadmin/phpmyadmin][5]

여기서 사용한 모든 코드는 [haruair/docker-simple-php][6] 리포지터리에서 확인할 수 있다.

## docker 설치하기

먼저 [docker를 받아 설치한다][7].

## 환경을 파일로 작성하기

이제 구축할 환경을 파일로 먼저 만든다. 다음 내용에 따라서 `docker-compose.yml`과 `Dockerfile`을 작성한다.

### `docker-compose.yml` 작성하기

`docker-compose.yml`은 스마트폰을 예로 들면 어떤 앱을 설치하고 앱을 어떻게 설정할지 정리한 파일이다. <sup id="fnref-4430-1"><a href="#fn-4430-1">1</a></sup> docker compose라는 도구가 이 파일을 읽어서 앱을 설치하게 된다.

먼저 다음과 같이 작성한다.

```yml
version: '3'

services:
```

`services:` 아래로는 설치할 이미지를 작성한다.

```yml
#...

services:
  db:
    image: mariadb:5.5
    volumes:
      - "./data:/var/lib/mysql:rw"
    environment:
      - "MYSQL_DATABASE=hello"
      - "MYSQL_USER=hello"
      - "MYSQL_PASSWORD=hello"
      - "MYSQL_ROOT_PASSWORD=root"
    ports:
      - "3306:3306"
```

먼저 db를 추가했다. `image`를 보면 mariadb의 공식 이미지를 사용했음을 알 수 있다. 이런 이미지는 [docker hub][8]를 통해 공유되는데 앱스토어 정도로 생각하면 되겠다. `volumes`를 사용해서 앱의 경로에 현재 폴더의 `./data`를 연결했다. mysql에 생성되는 데이터베이스는 이 폴더에 저장된다.

대부분의 도커 앱은 `environment`를 통해서 설정을 할 수 있는데 여기서는 데이터베이스명과 사용자, 비밀번호와 루트 비밀번호를 설정한 것을 볼 수 있다. `ports`는 현재 컴퓨터의 포트와 해당 앱의 포트를 연결하는 설정이다. 즉, 로컬 호스트의 3306 포트로 접속하면 해당 앱의 3306 포트로 접속하는 것과 동일하게 된다.

```yml
#...
services:
  #...
  phpmyadmin:
    image: phpmyadmin/phpmyadmin:4.7
    depends_on:
      - db
    ports:
      - "8000:80"
    environment:
      - "PMA_HOST=db"
      - "PMA_USER=root"
      - "PMA_PASSWORD=root"
```

다음으로 phpmyadmin을 추가했다. phpmyadmin을 사용하지 않는다면 이 부분은 건너뛴다. mysqlworkbench 등으로 접속해도 사용해서 된다. 나는 웹에서 쓸 수 있는 도구를 선호하는 편이라서 phpmyadmin을 개발 환경에 넣어놓는 편이다.

앞서 db와 크게 차이는 없다. `depends_on`으로 앞에서 추가한 db에 의존하고 있다고 명시했다. 환경변수에 PWA_HOST를 db라고 설정했는데 docker의 앱은 서로 지정된 이름으로 호스트를 참조할 수 있기 때문이다. 사용자명과 비밀번호는 위에서 설정한 대로 설정해서 접근할 수 있도록 했다.

```yml
#...
services:
  #...
  web:
    build:
      context: .
      dockerfile: ./Dockerfile
    volumes:
      - ".:/var/www/html"
    depends_on:
      - db
    ports:
      - "80:80"
```

마지막으로 web을 추가했다. 앞서 추가했던 이미지와 다르게 `build`가 포함되어 있다. `build`는 `Dockerfile`을 참고해서 이미지를 생성한다. 대부분 도커 앱은 환경변수로도 제어할 수 있지만 앱 안에 확장 기능을 설치하거나 하는 동작도 가능하도록 Dockerfile을 사용할 수 있다. 자세한 내용은 아래서 다룬다. `context`는 이미지 생성에서 사용할 기본 경로를 지정하는데 사용하며 다음 내용에서 설명한다. Dockerfile의 명칭이 다르거나 경로가 다르면 `dockerfile`을 통해 지정할 수 있다. `volumes`에서 현재 프로젝트의 경로를 앱 내 웹서버의 기본 경로에 연결한다. `ports`에 보면 앱의 80 포트를 로컬의 80포트와 연결했다. `http://localhost/`를 입력하면 앱에 있는 서버로 연결되게 된다.

작성을 마친 `docker-compose.yml` 파일은 다음과 같다. php앱을 구동하기 위해서 필요한 환경을 한 위치에 모두 작성했다.

```yml
version: '3'

services:
  db:
    image: mariadb:5.5
    volumes:
      - "./data:/var/lib/mysql:rw"
    environment:
      - "MYSQL_DATABASE=hello"
      - "MYSQL_USER=hello"
      - "MYSQL_PASSWORD=hello"
      - "MYSQL_ROOT_PASSWORD=root"
    ports:
      - "3306:3306"
  phpmyadmin:
    image: phpmyadmin/phpmyadmin:4.7
    depends_on:
      - db
    ports:
      - "8000:80"
    environment:
      - "PMA_HOST=db"
      - "PMA_USER=root"
      - "PMA_PASSWORD=root"
  web:
    build:
      context: .
      dockerfile: ./Dockerfile
    volumes:
      - ".:/var/www/html"
    depends_on:
      - db
    ports:
      - "80:80"
```

### `Dockerfile` 작성하기

앞서 설정에서 작성했던 내용대로 web에 사용하기로 한 `Dockerfile`을 작성해야 한다. 여기서는 php의 공식 이미지를 기반으로 사용한다. 파일에 다음 내용을 추가하자.

```Dockerfile
FROM php:5.6-apache
```

php:5.6-apache를 기반 이미지로 사용했다. Docker hub에 php:5.6-apache로 지정되어 있는 Dockerfile의 내용을 그대로 상속하게 된다. 이제 필요한 패키지와 확장을 설치한다. Dockerfile로 이미지를 생성하면 매 명령마다 중간 이미지를 생성하기 때문에 필수적인 패키지와 확장을 우선순위로 두면 나중에 비슷한 이미지를 생성할 때 더 빠르게 동작한다.

```Dockerfile
# ...
RUN apt-get update
RUN apt-get install -y git zip

RUN apt-get install -y libpng12-dev libjpeg-dev
RUN apt-get install -y mysql-client
RUN docker-php-ext-configure gd --with-png-dir=/usr --with-jpeg-dir=/usr \
&& docker-php-ext-install gd

RUN docker-php-ext-install mbstring
RUN docker-php-ext-install mysqli
RUN docker-php-ext-install pdo
RUN docker-php-ext-install pdo_mysql
RUN docker-php-ext-install opcache

RUN apt-get install -y libssl-dev openssl
RUN docker-php-ext-install phar

RUN apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
```

이제 apache의 모드를 활성화하고 웹서버에 반영하는 부분을 추가한다.

```Dockerfile
# ...
RUN a2enmod rewrite
RUN a2enmod headers
RUN apache2ctl -k graceful
```

여기서 작성한 Dockerfile의 전체 내용은 다음과 같다.

```Dockerfile
FROM php:5.6-apache

RUN apt-get update
RUN apt-get install -y git zip

RUN apt-get install -y libpng12-dev libjpeg-dev
RUN apt-get install -y mysql-client
RUN docker-php-ext-configure gd --with-png-dir=/usr --with-jpeg-dir=/usr \
&& docker-php-ext-install gd

RUN docker-php-ext-install mbstring
RUN docker-php-ext-install mysqli
RUN docker-php-ext-install pdo
RUN docker-php-ext-install pdo_mysql
RUN docker-php-ext-install opcache

RUN apt-get install -y libssl-dev openssl
RUN docker-php-ext-install phar

RUN apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN a2enmod rewrite
RUN a2enmod headers
RUN apache2ctl -k graceful
```

## docker 실행하기 및 종료하기

`docker-compose up`을 실행한다. 처음 실행하면 이미지를 받고 빌드를 시작하는 것을 확인할 수 있다.

```bash
$ docker-compose up
Creating network "dockerhello_default" with the default driver
Pulling db (mariadb:5.5)...
5.5: Pulling from library/mariadb
4269eaa217cc: Downloading [=========>      ]  14.12MB/38.11MB
b5d5817a79f8: Download complete
5a270f0327f3: Download complete
911f94a14d77: Download complete
114588764b3b: Downloading [=============>  ]   5.12MB/5.994MB
d1dcaee5ec4a: Download complete
```

모든 빌드가 완료되면 현재 폴더에 있는 내용을 `http://localhost/`를 통해 접속할 수 있다.

<img data-attachment-id="4443" data-permalink="https://edykim.com/blog/4430/screen-shot-2018-04-05-at-7-21-15-pm" data-orig-file="https://edykim.com/wp-content/uploads/2018/04/Screen-Shot-2018-04-05-at-7.21.15-pm.png?fit=1024%2C768&ssl=1" data-orig-size="1024,768" data-comments-opened="1" data-image-meta="{&quot;aperture&quot;:&quot;0&quot;,&quot;credit&quot;:&quot;&quot;,&quot;camera&quot;:&quot;&quot;,&quot;caption&quot;:&quot;&quot;,&quot;created_timestamp&quot;:&quot;0&quot;,&quot;copyright&quot;:&quot;&quot;,&quot;focal_length&quot;:&quot;0&quot;,&quot;iso&quot;:&quot;0&quot;,&quot;shutter_speed&quot;:&quot;0&quot;,&quot;title&quot;:&quot;&quot;,&quot;orientation&quot;:&quot;0&quot;}" data-image-title="localhost 화면" data-image-description="" data-medium-file="https://edykim.com/wp-content/uploads/2018/04/Screen-Shot-2018-04-05-at-7.21.15-pm.png?fit=300%2C225&ssl=1" data-large-file="https://edykim.com/wp-content/uploads/2018/04/Screen-Shot-2018-04-05-at-7.21.15-pm.png?fit=660%2C495&ssl=1" src="https://edykim.com/wp-content/uploads/2018/04/Screen-Shot-2018-04-05-at-7.21.15-pm.png?resize=660%2C495&#038;ssl=1" alt="" width="660" height="495" class="aligncenter size-full wp-image-4443" data-recalc-dims="1" />

앞서 phpmyadmin도 포함했고 포트에 연결했었다. 이제 `http://localhost:8000/`로 접속하면 phpmyadmin도 잘 실행되고 있는 것을 확인할 수 있다.

<img data-attachment-id="4444" data-permalink="https://edykim.com/blog/4430/phpmyadmin" data-orig-file="https://edykim.com/wp-content/uploads/2018/04/phpmyadmin.png?fit=1906%2C1214&ssl=1" data-orig-size="1906,1214" data-comments-opened="1" data-image-meta="{&quot;aperture&quot;:&quot;0&quot;,&quot;credit&quot;:&quot;&quot;,&quot;camera&quot;:&quot;&quot;,&quot;caption&quot;:&quot;&quot;,&quot;created_timestamp&quot;:&quot;0&quot;,&quot;copyright&quot;:&quot;&quot;,&quot;focal_length&quot;:&quot;0&quot;,&quot;iso&quot;:&quot;0&quot;,&quot;shutter_speed&quot;:&quot;0&quot;,&quot;title&quot;:&quot;&quot;,&quot;orientation&quot;:&quot;0&quot;}" data-image-title="phpmyadmin" data-image-description="" data-medium-file="https://edykim.com/wp-content/uploads/2018/04/phpmyadmin.png?fit=300%2C191&ssl=1" data-large-file="https://edykim.com/wp-content/uploads/2018/04/phpmyadmin.png?fit=660%2C420&ssl=1" src="https://edykim.com/wp-content/uploads/2018/04/phpmyadmin.png?resize=660%2C420&#038;ssl=1" alt="" width="660" height="420" class="aligncenter size-full wp-image-4444" data-recalc-dims="1" />

`docker-compose down`으로 종료한다.

## docker 컨테이너 다루기

`docker-compose`로 실행한 후에 실행된 컨테이너를 보기 위해서는 `docker ps` 명령을 사용할 수 있다.

```bash
$ docker ps
CONTAINER ID        IMAGE                       COMMAND                  CREATED             STATUS              PORTS                            NAMES
bacdc4de6660        dockerhello_web             "docker-php-entrypoi…"   6 minutes ago       Up 5 minutes        0.0.0.0:80-&gt;80/tcp               dockerhello_web_1
408909957ec4        phpmyadmin/phpmyadmin:4.7   "/run.sh phpmyadmin"     6 minutes ago       Up 5 minutes        9000/tcp, 0.0.0.0:8000-&gt;80/tcp   dockerhello_phpmyadmin_1
4949e0a2d10f        mariadb:5.5                 "docker-entrypoint.s…"   6 minutes ago       Up 5 minutes        0.0.0.0:3306-&gt;3306/tcp           dockerhello_db_1
```

그 외에도 다양한 docker 명령어를 직접 사용해서 컨테이너를 제어할 수 있다. 다음 명령으로 컨테이너에 쉘을 실행하고 접속할 수 있다.

```bash
$ docker exec -it dockerhello_web_1 bash
root@bacdc4de6660:/var/www/html# 
```

다만 이렇게 접속해서 설정을 변경한다면 지금 당장은 문제가 없겠지만 다시 이미지를 생성했을 때는 그 변경 부분이 새 이미지에서는 적용되지 않는다. 도커파일을 사용하면 그런 반복되는 과정을 없에고 파일에 명시적으로 남기는 것으로 매번 동일한 환경을 구성할 수 있다. 설정을 추가하거나 변경할 필요가 있다면 그 명령어는 `Dockerfile`에 정의하자.

* * *

docker-compose를 처음 사용하고 난 후에 docker로 환경을 구성한다는 것이 더 와닿아서 일반적인 설명과는 조금 다른 순서로 적어봤다. 시작부터 대뜸 복잡하게 느껴졌다면 (죄송하지만) 위에 추천한 글을 읽어보자.

여기서는 웹서버가 포함된 php를 사용했지만 fpm을 사용하는 php로 분리하고 별도의 웹서버 컨테이너를 사용하는 것도 가능하다. 반대로 한 이미지에 lamp 스택을 모두 담고 있는 [linode/lamp][9]와 같은 경우도 존재한다. 개인적으로는 역할별로 컨테이너를 분리하기를 선호하는데 상황에 맞게 전략을 짜야겠다.

<li id="fn-4430-1">
  이런 역할을 오케스트레이션(orchestration)이라고 한다.&#160;<a href="#fnref-4430-1">&#8617;</a> </fn></footnotes>

 [1]: http://blog.nacyot.com/articles/2014-01-27-easy-deploy-with-docker/
 [2]: https://subicura.com/2017/01/19/docker-guide-for-beginners-1.html
 [3]: https://hub.docker.com/_/php/
 [4]: https://hub.docker.com/_/mariadb/
 [5]: https://hub.docker.com/r/phpmyadmin/phpmyadmin/
 [6]: https://github.com/haruair/docker-simple-php
 [7]: https://www.docker.com/community-edition#/download
 [8]: https://hub.docker.com/
 [9]: https://hub.docker.com/r/linode/lamp/