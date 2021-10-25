---
title: Aptana Studio 3.0 에서 SVN 사용하기
author: haruair
type: post
date: "2011-10-12T00:25:53"
history:
  - 
    from: https://www.haruair.com/blog/857
    movedAt: 2018-09-13T22:02:40+00:00
lang: ko
slug: using-svn-with-aptana-studio-3.0
tags:
  - 개발 이야기
  - aptana
  - ide
  - SVN

---
## 안내 : 이 글은 2011년에 작성한 글입니다[^1]

최근에 [@sh84ahn][1]님이 관련 글을 작성하셔서 링크를 남깁니다.

  * [Aptana Studio SVN error folder &#8221; does not exist remotely 대처법][2]

* * *

개발에 Eclipse php development tools(PDT)를 사용했는데 syntax highlighter의 문제인지 들여쓰기를 조정하다보면 일부 부분들이 없어지는 현상이 자주 발생한다. 그런 이유로 Aptana를 설치하게 되었다.

Aptana studio는 웹개발에 최적화된 도구로 syntax highlighter도 잘 동작하고 들여쓰기 문제나 자동완성 부분도 상당히 편리하게 구성되어 있다. 요즘 유행하는 git도 별도의 설치 없이 바로 사용할 수 있고 remote(FTP)를 통해 프로젝트를 관리하기에도 상당히 편리하다. 하지만 SVN은 기본 설치가 되어 있지 않아 별도로 설치해줘야 한다. eclipse 설치하는 것과 같이 Help > Install New Software&#8230; 메뉴에 들어와 Work with에 아래의 주소를 입력한다.

> http://subclipse.tigris.org/update_1.6.x

위 주소를 입력하고 아래에 해당 사항을 체크해 설치하면 된다. 기본 eclipse 값과 다른 부분이 있어서 그런지 모두 선택해서 설치하면 설치가 되지 않는다.

    Subclipse Integration for mylyn 3.x (Optional)
    Subversion Revision Graph
    

두가지 체크를 풀어 설치하면 바로 설치되어 사용할 수 있다.

[^1]:    
    오랜 기간이 지났는데도 신기하게 이 키워드로 검색 유입이 상당히 많습니다.

 [1]: https://twitter.com/sh84ahn
 [2]: http://lab.ash84.net/1056