---
title: 터미널에서 문자를 ASCIIArt로 출력하기 FIGlet
author: haruair
type: post
date: 2016-04-14T00:00:56+00:00
history:
  - 
    from: https://www.haruair.com/blog/3542
    movedAt: 2018-09-13T22:02:42+00:00
lang: ko
slug: outputting-characters-in-terminal-as-asciiart-figlet
categories:
  - 두루두루 IT
tags:
  - figlet
  - terminal
  - 터미널에서

---
터미널을 사용하다보면 영문자를 아스키 아트로 출력해서 프로그램명이나 제작 크레딧을 멋지게 꾸민 경우를 종종 볼 수 있다. FIGlet은 영문자를 입력하면 아스키 아트로 출력해주는 간단한 도구다. 앞서 살펴본 [cowsay][1]도 있지만 이 도구는 문자를 직접 아스키 아트로 출력한다는 점이 다르다.

이 도구도 상당히 오래 전에 개발되었기에 어느 플랫폼이든 손쉽게 설치할 수 있다.

```bash
$ brew install figlet
$ apt-get install figlet
```

사용 방법도 간단하다. `figlet` 명령과 출력하려는 텍스트를 입력하면 된다.

```bash
$ figlet HelloWorld
 _   _      _ _    __        __         _     _ 
| | | | ___| | | __\ \      / /__  _ __| | __| |
| |_| |/ _ \ | |/ _ \ \ /\ / / _ \| '__| |/ _` |
|  _  |  __/ | | (_) \ V  V / (_) | |  | | (_| |
|_| |_|\___|_|_|\___/ \_/\_/ \___/|_|  |_|\__,_|
```

`-f` 플래그로 다른 폰트도 사용 가능하다. 다른 폰트는 [FIGlet][2] 사이트에서 폰트를 받아 추가할 수 있다.

```bash
$ figlet -f isometric1 jeju

       ___         ___            ___         ___     
      /\  \       /\  \          /\  \       /\__\    
      \:\  \     /::\  \         \:\  \     /:/  /    
  ___ /::\__\   /:/\:\  \    ___ /::\__\   /:/  /     
 /\  /:/\/__/  /::\~\:\  \  /\  /:/\/__/  /:/  /  ___ 
 \:\/:/  /    /:/\:\ \:\__\ \:\/:/  /    /:/__/  /\__\
  \::/  /     \:\~\:\ \/__/  \::/  /     \:\  \ /:/  /
   \/__/       \:\ \:\__\     \/__/       \:\  /:/  / 
                \:\ \/__/                  \:\/:/  /  
                 \:\__\                     \::/  /   
                  \/__/                      \/__/    
```

사실 이 도구는 cli 외에도 각 프로그래밍 언어마다 이미 구현이 있을 정도다.

  * [pwaller/pyfiglet][3] python
  * [patorjk/figlet][4] nodeJS
  * [tim/figlet][5] ruby
  * [auriou/figlet][6] C#

이제 터미널로 접속할 때마다 뜨는 메시지, 밋밋한 콘솔의 서비스명을 더 힙하게 표시해보자!

 [1]: http://haruair.com/blog/3521
 [2]: http://www.figlet.org/fontdb.cgi
 [3]: https://github.com/pwaller/pyfiglet
 [4]: https://www.npmjs.com/package/figlet
 [5]: https://github.com/tim/figlet
 [6]: https://github.com/auriou/FIGlet