---
title: naver smart editor에서 jindo 네임스페이스 사용하기
author: haruair
uuid: "ff1f0f23-2821-4960-8b3d-d582772494eb"
type: post
date: "2011-11-08T09:44:32"
history:
  - 
    from: https://www.haruair.com/blog/911
    movedAt: 2018-09-13T22:02:40+00:00
lang: ko
slug: using-naver-smart-editor-with-jindo-namespace
tags:
  - 개발 이야기
  - front

---
**2014년 4월 추가 :** 에디터 적용을 위해 이 글을 보고 있다면 Summernote를 확인하자. <http://hackerwins.github.io/summernote/>

* * *

에디터 문제로 늘 골머리를 썩히고 있는데 <a href="http://dev.naver.com/projects/smarteditor" target="_blank">naver smart editor</a>를 적용하자니 <a href="http://dev.naver.com/projects/jindo" target="_blank">jindo</a>라는 프레임워크를 하나 더 올리는게 부담스러워서 사용하지 않았었습니다. 한동안 열심히 에디터를 찾아봤지만 적당한 대안이 없어 &#8230;그냥 도입하기로 했습니다.

적용하려고보니 약간 문제가 있었습니다. jindo 에서 jQuery랑 동일하게 $를 사용하고 있는 문제로 jquery에 네임스페이스(namespace)를 지정해서 사용해야 했는데 jindo를 에디터에만 사용하기 때문에 스마트 에디터를 수정해서 jindo의 네임스페이스를 사용하는 편이 낫다는 판단을 했습니다. 앗, 절대 jindo가 별로라거나 나쁘다는 의미가 아닙니다&#8230;ㅎㅎ 사내에서 이미 jQuery를 많이 사용하고 있어서 교차로 사용하기엔 교육 문제도 있으니까요.

  1. 먼저 nforge에서 smart editor, jindo(namespace)를 내려받습니다.
  2. jindo를 js 폴더에 넣고 js 폴더에 있는 js 파일들을 열어 아래의 정규식으로 치환해줍니다.
  
    > (\$\$\(|\$\$\.|\$A\(|\$A\.|\$Agent\(|\$Agent\.|\$Ajax\(|\$Ajax\.|\$Class\(|\$Class\.|\$Cookie\(|\$Cookie\.|\$Date\(|\$Date\.|\$Document\(|\$Document\.|\$Element\(|\$Element\.|\$ElementList\(|\$ElementList\.|\$Event\(|\$Event\.|\$Fn\(|\$Fn\.|\$Form\(|\$Form\.|\$H\(|\$H\.|\$Jindo|\$Json\(|\$Json\.|\$S\(|\$S\.|\$Template\(|\$Template\.|\$Window\(|\$Window\.)
    
    > jindo.\1

내용은 jindo 레퍼런스에서 긁어와서 무식하게 만들었습니다; 저는 에디터 플러스에서 했습니다. 정규표현식으로 치환이 가능한 도구를 사용하시면 되겠습니다. 

차기 네이버 스마트 에디터에서는 네임스페이스 버전을 제공한다고 개발자센터에 써져 있는 것 보면 얼른 업데이트 되길 기대해봅니다. 근데 최종이 2009년 9월이네요.