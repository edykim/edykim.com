---
title: git 한글 파일명 사용 문제 고치기 core.quotepath
author: haruair
type: post
date: 2016-05-04T09:43:50+00:00
history:
  - 
    from: https://www.haruair.com/blog/3582
    movedAt: 2018-09-13T22:02:42+00:00
lang: ko
slug: git-fix-problem-using-filename-core.quotepath
categories:
  - 개발 이야기
tags:
  - git

---
지금까지 git을 숱하게 사용했지만 한글 파일명은 문제가 생긴다는 사실을 이제야 알았다.

다음처럼 `core.quotepath`를 끄면 `commit`, `status` 등에서 한글 출력이 정상으로 돌아온다. 이 설정은 일반적이지 않은 문자를 탈출문자로 처리하는 기능을 수행한다. 그래서 한글 앞에 탈출 문자를 붙인 탓에 이런 문제가 발생했다.

    git config --global core.quotepath false
    

### 관련 링크

  * [git-config의 core.quotepath][1]

 [1]: https://www.kernel.org/pub/software/scm/git/docs/git-config.html