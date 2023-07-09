---
title: 터미널에서 백그라운드 작업 관리하기 job-control
author: haruair
type: post
date: "2016-04-02T12:26:13"
history:
  - 
    from: https://www.haruair.com/blog/3530
    movedAt: 2018-09-13T22:02:42+00:00
lang: ko
slug: managing-background-jobs-in-a-terminal-jobcontrol
tags:
  - 개발 잡동사니
  - jobs
  - terminal
  - 터미널에서

---
bash나 zsh에서는 작업 제어(job control)을 기본적으로 제공하고 있다. 현재 동작하고 있는 프로그램을 백그라운드로 보내거나 백그라운드에 있는 프로그램을 다시 꺼내서 사용하는 것도 가능하다.

평소에 다음과 같이, 끝에 `&`을 붙여 명령어를 사용해본 적이 있다면 자신도 모르는 사이에 이미 사용하고 있다는 뜻이다.

    $ npm start &
    [1] + running    npm start
    

먼저 간단하게 예제를 보자. 다음 예시는 간단하게 `sleep`을 사용하고 있다. `&`와 함께 실행하면 백그라운드로 구동한다는 의미다.

    $ sleep 10 &
    [1] 3901
    $ sleep 20 &
    [2] 3902
    $ sleep 30 &
    [3] 3903
    

현재 실행하고 있는 작업 목록은 `jobs`로 확인할 수 있다.

    $ jobs
    [1]   running    sleep 10
    [2] - running    sleep 20
    [3] + running    sleep 30
    

현재 실행하고 있는 프로세스를 일시 정지하고 백그라운드로 보내는 키는 <kbd>Ctrl + z</kbd>다. (tmux를 사용하고 있다면 이 키로는 동작하지 않을 수 있다.)

    $ vim hello
    # <Ctrl + z>을 누름
    [1] + 4049 suspended   vim hello
    

다시 해당 프로세스를 포그라운드로 부르기 위해서는 `fg` 명령을 사용할 수 있다. `fg` 뒤 인자는 직접 입력해도 되지만 tab 키를 누르면 알아서 자동완성 해준다.

    $ fg %1
    $ fg %vim\ hello
    

만약 백그라운드에서 일시 정지가 아니라 계속 구동하려고 한다면 어떻게 해야 할까? 그때는 백그라운드 명령인 `bg`를 사용할 수 있다.

    $ sleep 30
    # <Ctrl + z>을 누름
    [1] + 4050 suspended  sleep 30
    $ bg %sleep
    # 아래처럼 간단하게 가능
    $ %sleep &
    [1] - 4050 continued  sleep 30
    $ jobs
    [1] - 4050 running    sleep 30
    $
    [1] - 4050 done       sleep 30
    

알고 나니 별 내용은 아니지만 지금까지 전혀 모르고 사용했다는 점에 반성하는 마음에서, 그리고 매번 백그라운드를 끌 줄 몰라서 `kill`을 당해야만 했던 수많은 프로세스를 추모하며 작성했다. 지금까지 몰랐다는데 참 억울하지만 앞으로는 프로세스 번호 찾으려고 애쓸 일이 없다는 점이 참 감사하다.