---
title: ssh config로 ssh 접속 간편하게 하기
author: haruair
type: post
date: 2014-06-30T23:52:36+00:00
history:
  - 
    from: https://www.haruair.com/blog/2219
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: simplifying-ssh-with-ssh-config
categories:
  - 개발 이야기
tags:
  - ssh

---
일반적으로 ssh에 접속하기 위해 다음과 같은 명령어를 사용한다.

    $ ssh edward@dev.haruair.com
    

사실 단순해 보이지만 개발자는 게을러야 하므로 `~/.ssh/config`에 설정을 작성해두면 더 짧게 사용할 수 있다. `~/.ssh/config`가 없다면 빈 파일을 만들면 된다. 파일 내용은 다음과 같다.

    Host dev
        HostName dev.haruair.com
        User edward
    

이렇게 작성하면 다음과 같이 접속 가능하다. (만약 동작하지 않는다면 퍼미션을 확인해주세요. [ChangWan Jun][1]님이 `chmod 440 ~/.ssh/config` 식으로 퍼미션 지정이 필요하다고 알려주셨습니다.)

    $ ssh dev
    

해당 서버가 ssh key를 기본값인 id_rsa를 사용하고 있다면 접속에 문제가 없다. (ssh key를 생성하는 방법은 [이 페이지를 참조][2]) 하지만 각각 서버마다 다른 키를 사용하고 있다면 여전히 `-i` 플래그를 이용해야 해서 번거롭다.

    $ ssh dev -i ~/.ssh/haruair.dev
    $ ssh company -i ~/.ssh/edward.company
    

각각 서버마다 어떤 키를 참조할지 config에 미리 작성해둘 수 있다.

    Host dev
        HostName dev.haruair.com
        User edward
        PreferredAuthentications publickey
        IdentityFile ~/.ssh/haruair.dev
    
    Host company
        HostName dev.haruair.company
        User edward
        PreferredAuthentications publickey
        IdentityFile ~/.ssh/edward.company
    

내 경우엔 Github용 키를 별도로 생성해서 등록했는데 다음과 같이 쓸 수 있다.

    Host github.com
        User git
        IdentityFile ~/.ssh/haruair.github
    

이렇게 등록해두면 다음과 같이 해당 주소의 ssh를 사용할 때 해당 키를 참조하게 된다.

    $ git clone git@github.com:haruair/some-repo.git
    

2차 도메인 등의 경우, 다음과 같이 와일드카드로도 지정이 가능하다.

    Host *.haruair.com
        User edward
        PreferredAuthentications publickey
        IdentityFile ~/.ssh/haruair.dev
    

config 파일은 상당히 세세한 범위까지 설정이 가능한데 그 내용은 [ssh_config 메뉴얼][3]에서 확인할 수 있다.

 [1]: https://www.facebook.com/wan2land
 [2]: http://haruair.com/blog/2220
 [3]: https://developer.apple.com/library/Mac/documentation/Darwin/Reference/ManPages/man5/ssh_config.5.html