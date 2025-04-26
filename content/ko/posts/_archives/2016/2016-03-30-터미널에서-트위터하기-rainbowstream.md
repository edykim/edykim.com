---
title: 터미널에서 트위터하기 rainbowstream
author: haruair
uuid: "b2800ca3-f08c-46c9-af5c-1425d3d59da6"
type: post
date: "2016-03-30T03:00:55"
history:
  - 
    from: https://www.haruair.com/blog/3505
    movedAt: 2018-09-13T22:02:42+00:00
lang: ko
slug: twitter-from-terminal-rainbowstream
tags:
  - 개발 잡동사니
  - rainbowstream
  - terminal
  - 터미널에서

---
터미널에서 사용할 수 있는 트위터 클라이언트는 상당히 많은 편이다. 이전까지 [node-tweet-cli][1]를 사용하고 있었는데 스트림도 지원하고 간단하게 트윗을 하기엔 편했지만 멘션에 답하는 기능이 없어서 여간 불편했었다. 그러던 중에 [rainbowstream][2]을 보고 나서 한 눈에 반해 바로 옮겨타게 되었다.

이 클라이언트는 현존하는 어떤 클라이언트보다 가장 힙스터스러운 트위터 환경을 구축해준다. 쇼케이스 보면 반하지 않을 수 없다.

<img src="https://raw.githubusercontent.com/DTVD/rainbowstream/master/screenshot/rs.gif?w=660&#038;ssl=1" alt="" />

이 툴은 pip를 통해서 설치할 수 있다. 전역 설치를 하고 싶다면 그냥 설치하면 된다.

    # 그냥... 설치
    $ sudo pip install rainbowstream
    

설치 가이드에서는 venv를 사용하길 권장하고 있다.

    # venv 설치
    $ virtualenv venv
    $ source venv/bin/activate
    $ pip install rainbowstream
    

파이썬이 없거나 환경이 필요한 경우라면 [리포지터리][2]를 참고해서 설치하자.

처음으로 실행하면 트위터의 토큰을 발행하기 위한 로그인 창이 뜬다. 토큰을 발행해서 숫자를 집어 넣으면 그때부터 사용 가능하다.

트윗 작성은 `t <내용>`으로 할 수 있으며 `h`를 입력하면 도움말 전체를 확인할 수 있다. 가장 마음에 드는 부분은 아예 쉘처럼 동작한다는 점인데 실행하는 순간부터 스트림을 시작하고 매 스트림되는 메시지마다 id를 부여해서 `rep <id> <내용>` 식으로 멘션에 대한 응답도 쉽게 작성할 수 있다. 스트림은 `p`, `r`로 멈추고 다시 시작하는 것도 가능하다. 쉘 종료는 `q`로 가능하다.

<figure class="wp-caption alignnone">

<img src="/resources/live.staticflickr.com/1508/25464896044_5f7513515e_b.webp?resize=660%2C660&#038;ssl=1" width="660" height="660" class /><figcaption class="wp-caption-text">이렇게까지 트위터 해야하냐고 그만 물어보세요&#8230;</figcaption></figure> 

심지어 테마도 지원하니 취향에 맞게 컬러 스킴도 지정해보자. `theme`으로 사용 가능한 테마 목록을 확인하고 `theme <테마명>`으로 변경할 수 있다.

tmux와 함께 사용한다면 타임라인과의 분리불안을 해소하는 것과 동시에 본업(?)을 지속할 수 있는 환경을 구성할 수 있으니 [tmux를 필히 사용][3]하자.

 [1]: https://www.npmjs.com/package/node-tweet-cli
 [2]: https://github.com/DTVD/rainbowstream
 [3]: http://haruair.com/blog/2124