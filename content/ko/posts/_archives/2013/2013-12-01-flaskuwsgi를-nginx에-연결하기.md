---
title: Flask(uWSGI)를 nginx에 연결하기
author: haruair
uuid: "c30295aa-4d4f-4215-9b0c-fb466023a666"
type: post
date: "2013-12-01T10:35:09"
history:
  - 
    from: https://www.haruair.com/blog/1900
    movedAt: 2018-09-13T22:02:40+00:00
lang: ko
slug: connecting-flask-uwsgi-to-nginx
tags:
  - 번역
  - flask
  - nginx
  - python
  - uwsgi
  - wsgi

---
WSGI는 Web Server Gateway Interface의 약어로 **웹서버와 웹어플리케이션이 어떤 방식으로 통신하는가에 관한 인터페이스**를 의미한다. 웹서버와 웹어플리케이션 간의 소통을 정의해 어플리케이션과 서버가 독립적으로 운영될 수 있게 돕는다. WSGI는 파이썬 표준인 [PEP333][1], [PEP3333][2]에 의해 제안되었고, 이 이후에 여러 언어로 구현된 프로젝트가 생겨나기 시작했다.

WSGI 어플리케이션은 uWSGI라는 컨테이너에 담아 어플리케이션을 실행하게 되며, uWSGI가 각각의 웹서버와 소통하도록 설정하면 끝이다. Flask, django와 같은 프레임워크는 이미 WSGI 표준을 따르고 있기 때문에 바로 웹서버에 연결해 사용할 수 있다.

이 글에서는 Flask를 nginx에 연결하는 방법을 설명한다. 이 글은 기록용이라 <del>상당히 불친절하기 때문에</del> 관련된 내용에 관심이 있다면 다음 페이지들을 참고하자.

  * [웹 서버 게이트웨이 인터페이스 &#8211; 한국어 위키피디아][3]
  * [Flask로 만들어 보는 WSGI 어플리케이션 &#8211; Spoqa Tech Blog][4]
  * [Learn about WSGI][5]
  * [PEP 333 &#8211; Python Web Server Gateway Interface v1.0][1]
  * [uWSGI의 고급 기능들][6]

## uWSGI 설치하기

먼저 uwsgi가 설치되어 있는지 확인한다. 현재 데비안 기반(우분투 등)의 환경이라면 uwsgi가 이미 설치되어 있는데 고대의 버전이라 기존 설치본을 삭제하든 변경하든 해서 새 버전으로 설치해줘야 한다.

    $ mv /usr/bin/uwsgi /usr/bin/uwsgi-old
    

그리고 uwsgi를 설치해준다.

    $ pip install uwsgi
    $ ln -s /usr/local/bin/uwsgi /usr/bin/uwsgi
    

이제 uwsgi로 해당 어플리케이션을 실행한다.

    $ uwsgi -s /tmp/uwsgi.sock --module yourapplication --callable app --venv .venv
    

`--socket, -s`는 통신을 위한 소켓, `--venv, -H`는 virtualenv 경로, `--module`은 어플리케이션, `--callable`은 WSGI의 시작점을 설정해주는 파라미터이다. 내 경우에는 파일명이 이상(?)해서인지 다음의 방식으로 실행했다.

    $ uwsgi -s /tmp/uwsgi.sock --wsgi-file app.py --callable app -H .venv
    

파라미터를 매번 입력하면 번거로우므로 다음과 같이 ini 파일을 작성해 저장해놓고 실행해도 된다.

    [uwsgi]
    chdir=/home/ubuntu/helloWorld
    chmod-socket=666
    callable=app
    module=app
    socket=/tmp/uwsgi.sock
    virtualenv=/home/ubuntu/helloWorld/.venv
    

이렇게 ini파일로 저장한 후 다음 명령어로 실행한다.

    $ uwsgi <filename> &
    

## nginx 설치, 설정하기

nginx를 apt-get 등을 통해 설치한다.

    $ apt-get install nginx-full
    

`/etc/nginx/sites-available/default` 파일을 열어 설정을 해준다.

    server {
            listen   8080;
    
            server_name helloworld.haruair.com;
    
            location / {
                    try_files $uri @helloworld;
            }
    
            location @helloworld {
                    include uwsgi_params;
                    uwsgi_pass unix:/tmp/uwsgi.sock;
            }
    }
    

위 설정을 통해 nginx로 들어오는 모든 요청을 uWSGI로 보내고 또 돌려받아 nginx를 통해 클라이언트에 전달하게 된다. nginx를 재구동하면 적용된다.

    /etc/init.d/nginx restart
    

사실 [Flask에서의 nginx 설치 문서][7]에 있는 글로도 충분한데 명령어가 계속 에러를 내는 탓에 한참 검색하게 되었다. 문제는 uwsgi의 낮은 버전이었고, 앞서 언급한 바와 같이 최신 버전으로 설치하면 해결된다.

 [1]: http://www.python.org/dev/peps/pep-0333/
 [2]: http://www.python.org/dev/peps/pep-3333/
 [3]: http://ko.wikipedia.org/wiki/%EC%9B%B9_%EC%84%9C%EB%B2%84_%EA%B2%8C%EC%9D%B4%ED%8A%B8%EC%9B%A8%EC%9D%B4_%EC%9D%B8%ED%84%B0%ED%8E%98%EC%9D%B4%EC%8A%A4
 [4]: http://spoqa.github.io/2012/01/16/wsgi-and-flask.html
 [5]: http://wsgi.readthedocs.org/en/latest/learn.html
 [6]: http://dittos.github.io/2015/10/24/advanced-uwsgi/
 [7]: http://flask.pocoo.org/docs/deploying/uwsgi/