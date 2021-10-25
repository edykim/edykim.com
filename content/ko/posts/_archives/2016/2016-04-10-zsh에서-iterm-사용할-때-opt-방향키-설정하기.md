---
title: iterm에서 zsh 사용할 때 `Opt + 방향키` 설정하기
author: haruair
type: post
date: "2016-04-10T00:08:18"
history:
  - 
    from: https://www.haruair.com/blog/3549
    movedAt: 2018-09-13T22:02:42+00:00
lang: ko
slug: setting-opt-direction-keys-when-using-zsh-in-iterm
tags:
  - 개발 이야기
  - iterm

---
이전에도 iterm을 설치했었지만 키맵이 영 익숙해지지 않고 기본 터미널과 맞추려니 이것저것 찾아보는게 귀찮아서 계속 터미널을 사용하고 있었다. neovim을 설치하는 차에 iterm3 베타가 나왔다는 얘기가 생각나서 iterm도 설치했다.

<kbd>Opt + 방향키</kbd>로 단어 사이 이동을 종종 하는 편인데 iterm 키맵엔 이 설정이 포함되어 있지만 쉘에서 추가적인 설정이 필요하다. 구글링 해보면 `~/.inputrc`에 다음과 같이 추가하면 동작한다고 하는데 이 방법은 bash를 사용하는 경우에 해당한다.

    "\e\e[D": backward-word
    "\e\e[C": forward-word
    

zsh의 경우는 `~/.zshrc`에 다음처럼 추가하면 된다.

    bindkey "\e\e[D" backward-word
    bindkey "\e\e[C" forward-word
    

추가. 설정할 때는 몰랐는데 iTerms의 키맵이 어떻게 되어 있는가에 따라 다르다. junho85님의 경우는 아래 키맵으로 설정했다고 한다.

    bindkey -e
    bindkey "^[[1;9C" forward-word
    bindkey "^[[1;9D" backward-word