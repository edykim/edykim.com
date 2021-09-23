---
title: 리눅스 노트
author: haruair
type: page
date: "2021-09-23T05:28:41"
lang: ko
url: linux
---

리눅스에서 어떤 프로그램을 사용하고 있는지, 어떤 설정을 사용하고 있는지 정리하는 노트입니다. 랩탑에서 메인으로 사용하고 있는데 그래픽 세팅으로 사용하면 아무래도 자잘하게 설정할 것도 많고... 여기에 빵가루를 남깁니다.

# 사용하는 프로그램

- [Manjaro]: Arch linux 기반.
- [suckless dwm](https://dwm.suckless.org/): X용 동적 창 관리자. 화면을 꽉 채우는 방식이 기본이라서 편리. 커스텀을 많이 할 수 있는데 거의 기본으로 사용중.
- [suckless st](https://st.suckless.org/): 단순한 터미널인데 dwm과 잘 맞음.
- zsh: oh-my-zsh에서 테마만 바꾸는 수준 ;ㅅ;
- fcitx: 한글 입력기. 다들 잘 안된다고 불편한 프로그램이라는데 어쩐지 내 컴퓨터에서는 잘 돌아감.
- [nvim](https://neovim.io/): 빔빔빔
- scrot: 스크린샷 캡쳐 도구
- go-chromecast: 크롬캐스트 제어할 수 있는 cli
- nemo: 파일 탐색기. 특별한건 없는데 아이콘 크기를 키울 수 있어서.

dwm 쓰고 있어서 다른 wm 사용하면 편하게 할 것을 안편하게 쓰고 있는 부분이 많습니다. 더 좋은 것 있으면 언제든지 알려주세요.

# `open` 사용하기

맥에서는 `open` 명령어 사용하는 것처럼 리눅스에서는 `xdg-open`을 사용할 수 있는데 약간 동작이 다르다. 다음 스크립트로 비슷하게 동작하는 `open`을 만들 수 있다. `/usr/local/bin/open`에 아래 내용으로 저장한다.

```sh
#!/bin/bash
CMD="xdg-open \"$(pwd)/$1\""
bash -c "$CMD" 2> /dev/null &
```

`xdg-open`은 mime에 따라 어떤 프로그램으로 실행할지 지정할 수 있는데 `xdg-mime`으로 현재 설정을 확인하거나 변경할 수 있다. `nemo`를 파일 탐색기로 사용하려면 다음처럼 지정한다.

```bash
$ xdg-mime query default inode/directory # 현재 지정된 프로그램 확인
$ xdg-mime default nemo.desktop inode/directory # nemo로 변경
```

# 마우스 커서 크기 변경

`~/.Xresources`에 다음처럼 입력한다.

```
Xcursor.size: 48
!Xcursor.theme: Hackneyed !지정하고 싶은 cursor theme
```

# HiDPI / 배경화면 설정

`~/.xprofile`에 추가한다.

```bash
xrandr --dpi 144 # xorg-xrandr 필요

# 단색 설정
xsetroot -solid "#1a1b23" # xorg-xsetroot 필요

# 이미지 설정
feh --bg-scale /path/to/image.jpg # feh 필요
```

# `pbcopy`, `pbpaste` 사용하기

맥에서 쓰던 명령어가 손에 익어서 똑같은 기능을 하는 단축어를 만들었다. 터미널에서 시스템 클립보드와 유닉스 파이프로 상호작용이 필요할 때 유용하다. 다음 내용을 `.zshrc`에 추가한다.

```bash
alias pbcopy='xclip -selection clipboard'
alias pbpaste='xclip -selection clipboard -o'
```

다음처럼 쓸 수 있다.

```bash
$ cat hello.md | pbcopy # 시스템 클립보드에 저장됨
$ pbpaste > something.js
```

# 청색광 켜고 끄기

청색광 차단 효과는 왈가왈부가 많지만 그래도 밤에 쨍한 화면보는 것보다는 눈이 편하니까 만든 단축어다.

`redshift`라는 프로그램도 있는데 뭔가 잘 동작하지 않아서 `xrandr`를 사용하고 있다.

`xrandr`를 사용해서 감마값을 조정한다. (`xorg-xrandr` 필요) 먼저 현재 모니터 포트를 확인한다.

```bash
$ xrandr --listmointors
 0: +*eDP1 2560/310x1440/170+0+0  eDP1
```

내 경우에는 eDP1이 해당 출력이다. 다음처럼 `.zshrc`에 추가한다.

```bash
alias daylight_mode="xrandr --output eDP1 --gamma 1:1:1 --brightness 1.0"
alias night_mode="xrandr --output eDP1 --gamma 1:0.72:0.43 --brightness 0.55"
```

모니터가 여럿이면 `--output eDP1 --output eDP2` 이런 식.

