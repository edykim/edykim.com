---
title: 간편하게 .gitignore 파일 생성하기 – gitignore.io
author: haruair
type: post
date: "2014-03-04T01:15:41"
history:
  - 
    from: https://www.haruair.com/blog/2017
    movedAt: 2018-09-13T22:02:40+00:00
lang: ko
slug: creating-a-.gitignore-file-with-ease-gitignore.io
categories:
  - 개발 이야기
tags:
  - git
  - gitignore
  - 이상한
  - 이상한 모임

---
예전에 트위터에서 누군가 소개해줘서 알게 되었는데, 도메인이 도저히 기억나지 않아 한참 검색하다가 다시 찾아서 까먹지 않기 위해 포스트. (허무하게 gitignore.io라니&#8230;)

> <http://gitignore.io> 

git에서는 커밋에 포함하지 않기 위한 규칙을 리포지터리 최상위 `.gitignore` 파일에 저장하는데 이 템플릿들을 제공하는 서비스다. 사이트 들어가보면 알겠지만 필요한 OS, IDE, 개발언어나 프레임워크 등의 이름을 넣으면 그에 맞는 gitignore 파일을 제공한다.

![gitignore.io](Screen-Shot-2014-03-04-at-12.10.04-pm-1024x581.png)

[Command Line 도구][2]를 설치하면 콘솔에서 간편하게 내려받을 수 있다. OSX에서는 다음과 같이 설치해 사용할 수 있다.

    $ echo "function gi() { curl http://www.gitignore.io/api/\$@ ;}" >> ~/.bash_profile && source ~/.bash_profile
    $ gi wordpress,osx >> /path/to/.gitignore
    

정말 사소한 부분이지만 이런 부분까지 자동화 하는 게으름(?)이 존경스럽다.

[2]: http://www.gitignore.io/cli