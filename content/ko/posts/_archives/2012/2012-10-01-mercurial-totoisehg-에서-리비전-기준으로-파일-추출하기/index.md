---
title: Mercurial, totoiseHg 에서 리비전 기준으로 파일 추출하기
author: haruair
uuid: "13a65ea7-9c13-48f6-830f-0b5481858e48"
type: post
date: "2012-10-01T05:34:57"
history:
  - 
    from: https://www.haruair.com/blog/1346
    movedAt: 2018-09-13T22:02:40+00:00
lang: ko
slug: extracting-files-based-on-revisions-from-mercurial-totoisehg
tags:
  - 개발 이야기
  - mercurial
  - SVN
  - tortoiseHg

---
몇번이고 키워드를 바꿔 검색해봤지만 나오질 않았다. 그래서 영어로 검색했더니 바로 나오는&#8230; 영어로 검색하면 커맨드 라인으로 추출하라느니 얘기가 많이 나온다. 혹시나 같은 고민 하는 분 있을까 싶어 글을 적어본다.

업데이트 또는 특정 이유로 인해 해당 리비전에서 업데이트 된 파일을 추출할 경우 TortoiseHg에서 아래와 같은 방식으로 처리할 수 있다.

![screenshot](archive.png)

  1. 추출하고자 하는 리비전에서 우클릭 후 export > archive&#8230;
  2. 추출할 리비전을 선택
  3. Only files modified/created in this revision 체크
  4. 경로 설정&#8230; 나머지 필요것 설정 후 Archive

(이런 별 것 아닌 부분에 이렇게 시간을 허비할 줄은 몰랐다.)

맥에서는 <a href="www.sourcetreeapp.com" target="_blank">Atlassian SourceTree</a>를 사용하면 mercurial, git을 동일한 UI에서 사용할 수 있어 둘 다 별 차이 없는 기분으로 쓸 수 있지만 윈도우에서는 그렇게 멋진 도구를 아직 보질 못했다. 그래서 그나마 간편한 TortoiseHg 설치하고 사용하는 중이고 만족하는 편. 그렇게 복잡한 기능을 사용하고 있지 않아서 어떤 Version Control이든 크게 차이를 느끼지 못하고 있다.

Mercurial을 위한 서비스는 bitbucket에서 제공하고 있으며 소규모 개발을 위한 private 리포지터리도 무료로 준다. 로컬 작업용으로 많이 쓰고 있어서 bitbucket을 사용해본 적이 거의 없지만 GitHub를 조금이라도 본 적 있다면 상당히 비슷한 느낌으로 사용할 수 있다.
