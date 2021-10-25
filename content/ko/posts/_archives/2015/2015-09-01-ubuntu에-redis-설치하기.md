---
title: Ubuntu에 Redis 설치하기
author: haruair
type: post
date: "2015-09-01T12:10:04"
history:
  - 
    from: https://www.haruair.com/blog/3037
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: installing-redis-on-ubuntu
headline:
  - Redis 설치 삽질 기록. Ubuntu에 Redis를 빠르게 설치하기 위한 치트 노트.
tags:
  - 개발 이야기
  - redis
  - server
  - ubuntu

---
[Redis][1]를 리눅스 박스에 직접 설치해본 적이 한번도 없었다. Ubuntu에 redis를 설치하려니 빌드가 생각처럼 진행되질 않아서 계속 검색을 하게 되었는데 기록 삼아 블로그에 적어둔다.

    $ apt-get update
    $ apt-get install build-essential
    $ wget http://download.redis.io/releases/redis-3.0.3.tar.gz # 버전은 달라질 수 있으니 사이트를 확인
    $ tar xzf redis-3.0.3.tar.gz
    $ cd redis-3.0.3
    $ cd ./deps
    $ make hiredis jemalloc linenoise lua
    $ cd ..
    $ make
    $ ./src/redis-server
    $ make test # 얘네들이 권장하는데 tcl 설치해야 함
    $ make install # 취향에 따라
    $ redis-server
    

의존성 라이브러리 때문에 에러가 계속나서 라이브러리를 한참 찾았는데 `deps` 디렉토리가 있는걸 나중에야 알았다. 라이브러리가 없으면 자동으로 `make`을 하는 것 같은데 어중간하게 라이브러리 직접 설치한, 나같은 사람은 수동으로 `make` 해줘야 한다. 안그러면 다음 에러가 계속 난다. 뭔가 꼬인 것 같으면 `make clean`을 사용한 후, 다시 `make`을 진행한다.

    root@koala:~/redis-3.0.3# make
    cd src && make all
    make[1]: Entering directory `/root/redis-3.0.3/src'
        LINK redis-server
    cc: error: ../deps/hiredis/libhiredis.a: No such file or directory
    cc: error: ../deps/lua/src/liblua.a: No such file or directory
    cc: error: ../deps/jemalloc/lib/libjemalloc.a: No such file or directory
    make[1]: *** [redis-server] Error 1
    make[1]: Leaving directory `/root/redis-3.0.3/src'
    make: *** [all] Error 2
    

이런 삽질 하지 말라고 docker가 나왔는데 아무래도 익숙해지지 않아 걱정이다.

 [1]: http://redis.io/