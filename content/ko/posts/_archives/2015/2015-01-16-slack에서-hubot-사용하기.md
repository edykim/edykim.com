---
title: Slack에서 Hubot 사용하기
author: haruair
type: post
date: "2015-01-16T14:00:00"
history:
  - 
    from: https://www.haruair.com/blog/2617
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: using-hubot-in-slack
categories:
  - 개발 이야기
tags:
  - hubot
  - slack
  - backend

---
최근에 [#이상한모임 slack이 개설][1]되었다. 순식간에 많은 분들이 가입해서 왕성한 활동 펼치고 있어 신기해 하는 한편 같이 휩쓸려(?) 잘 놀고 있다. [골빈해커님][2]이 hubot으로 weirdbot을 만들어서 재미있는 기능들을 만드는 것을 보고 hubot을 어떻게 만들 수 있는지 찾아보게 되었다.

[Hubot][3]은 GitHub에서 공개한, 자동화를 위한 채팅봇이다. Node.js 기반에 CoffeeScript로 짜여져 있고 Heroku와 같은 곳에 손쉽게 디플로이 해서 활용 가능하며 확장도 간편하게 가능하도록 구성되어 있다. 또한 이미 많은 기능들이 구현되어 있어서 npm에서 hubot-script을 내려받고 설정하는 것으로도 강력하게 활용할 수 있다.

[Slack][4]은 협업을 위한 채팅 도구로 GitHub, Trello 등 다양한 Integration, 여러 체널의 Push notification 지원 등 편리한 기능을 많이 제공한다. 이전까지는 몰랐는데 내부적으로는 IRC로 구현되어 있는 모양이다. IRC에 친숙하다면 쉽게 적응해서 사용할 수 있을 정도로 유사한 부분이 많다.

Slack에서 Integration을 통해 Hubot을 추가하면 API키를 발급해줘서 쉽게 연동이 가능한데 무료 정책 내에서는 연동할 수 있는 서비스 수가 제한되어 있기 때문에 여기서는 IRC gateway를 활용했다. IRC Gateway는 보안상 기본 설정에서는 사용할 수 없다. 사용하려면 slack의 primary owner에게 요청해 기능을 사용할 수 있도록 활성화 해야 한다. 다만 이 gateway를 사용하게 되면 채팅방의 내용이 외부로 노출될 가능성이 있다는 요지의 안내를 받을 수 있는데 보안성에 민감한 slack이라면 이 방법보다 앞서 얘기한 hubot integration을 사용하는 편이 낫다.

이 글에서는 다음과 같은 방법으로 Hubot을 만들어 사용했다. (늘 그렇듯 OSX 기준으로 작성되어 있다.)

  * 로봇을 돌리기 위한, slack 일반 계정을 생성
  * IRC Gateway 사용
  * Heroku 사용

## Slack 계정 생성하기

본인 그룹의 slack에서 IRC Gateway 사용이 가능하다면 로봇으로 상주시킬 계정을 새로 생성한 후 `Account > Settings > Gateways` 에서 Gateway Configuration 버튼을 눌러 `Host`, `User`, `Pass` 정보를 확인한다.

## Hubot 설치하기

사실 이런 포스트 할 필요도 없을 정도로 [Hubot 문서][5]는 깔끔하게 잘 되어 있다. 먼저 기본적으로 `nodejs`는 설치되어 있어야 한다.

    $ npm install -g yo generator-hubot
    $ mkdir koalabot
    $ cd koalabot
    $ yo hubot
    

`[yeoman](http://yeoman.io/)` 제너레이터로 hubot을 생성할 수 있다. `yo hubot` 명령어를 입력하면 봇을 생성하는 인터프리터가 나타나는데 내용에 맞게 작성자, 봇 이름, 설명 등을 순차적으로 입력하면 된다. 여기서는 IRC Gateway를 사용하므로 adapter에는 irc을 입력하면 된다. 그러면 알아서 irc에 맞는 어뎁터가 설치된다.

[<img src="https://farm8.staticflickr.com/7473/15670711134_26db71c303_o.png?w=660&#038;ssl=1" alt="yo hubot" class="aligncenter " data-recalc-dims="1" />][6]

여기서 `unicode/ucsdet.h`를 찾을 수 없다는 에러가 나타나면 다음 명령어로 command line developer tool을 설치한다.

    $ xcode-select --install
    

이제 초기 생성이 끝났다. 이제 설치된 hubot을 shell adapter를 통해 콘솔에서 확인할 수 있다. `hubot help`를 입력하면 사용 가능한 명령어를 볼 수 있다.

    $ bin/hubot --name <봇이름>
    

## Heroku로 디플로이 하기

이제 [heroku로 봇을 내보낼 차례][7]다. heroku를 사용하기 위해서는 [heroku][8]에 먼저 가입을 해야 하고 [heroku toolbalt][9]를 설치해야 한다. 그리고 나서 생성한 hubot을 git에 커밋한다.

    $ git init
    $ git add .
    $ git commit -m "Initial commit"
    

앞서 가입한 heroku를 `heroku login`을 통해 로그인하고 dyno라고 불리는 컨테이너를 생성한 후 환경설정을 한 다음에 앞서 만들었던 hubot을 내보내는 순서로 진행된다.

    $ heroku login
    # 앞서 가입한 정보로 로그인
    $ heroku create
    # heroku에 dyno가 생성됨, dyno 주소를 알려준다.
    
    # 환경변수를 다음과 같이 지정하는데 서버, 닉네임, 비밀번호는 앞서 IRC Gateway에서의 정보를 입력해야 한다.
    $ heroku config:set HUBOT_IRC_SERVER="<IRC Server>"
    $ heroku config:set HUBOT_IRC_NICK="<IRC Nickname>"
    $ heroku config:set HUBOT_IRC_PASSWORD="<IRC Password>"
    
    # 자동으로 접속하게 될 방 목록을 `,`로 구분해서 입력한다.
    $ heroku config:set HUBOT_IRC_ROOMS="#koala,#kangaroo,#melbourne"
    $ heroku config:set HUBOT_IRC_UNFLOOD="false"
    $ heroku config:set HUBOT_IRC_USESSL=1
    
    # dyno가 생성될 때 알려준 주소를 입력한다.
    $ heroku config:set HEROKU_URL=http://hot-koala-2015.herokuapp.com
    
    # heroku로 git을 push하면 끝난다.
    $ git push heroku master
    

## Hubot 기능 추가하기

### Hubot 스크립트 설치

[hubot-scripts][10]에 포함되어 있는 스크립트는 `hubot-scripts.json`에 추가하는 것으로 바로 사용할 수 있다. 사용 가능한 목록은 [카탈로그 페이지][11]에서 확인할 수 있다.

### 외부 스크립트 설치

외부 스크립트 설치도 지원한다. 다음은 [hubot-thank-you][12]를 설치하는 예로 아래와 같이 npm으로 설치한 후 `external-scripts.json`에 배열로 해당 스크립트명을 추가하면 된다.

    $ npm install hubot-thank-you --save
    # external-scripts.json을 열어서 "hubot-thank-you"를 json스럽게(...) 추가한다.
    

### 직접 만들기

직접 만들고 싶다면 scripts 폴더에 있는 `example.coffee`를 참고해 만들면 된다. 자세한 가이드는 [Scripting][13] 항목에서 볼 수 있다.

* * *

아무리 재미있는 도구들이 나와도 회사에서 적용하지 않는 경우엔 둘러보는 정도로 그칠 때가 많았는데 이 기회에 살펴볼 수 있어서 좋았다. CoffeeScript는 아직도 어색한데 익숙해질 수 있도록 좀 더 살펴봐야겠다.

 [1]: https://twitter.com/minieetea/status/555186265302110208
 [2]: https://twitter.com/golbin
 [3]: https://hubot.github.com
 [4]: http://slack.com
 [5]: https://github.com/github/hubot/tree/master/docs/index.md
 [6]: http://www.flickr.com/photos/90112078@N08/15670711134 "yo hubot"
 [7]: https://github.com/github/hubot/blob/master/docs/deploying/heroku.md
 [8]: https://www.heroku.com/
 [9]: https://toolbelt.heroku.com/
 [10]: https://github.com/github/hubot-scripts
 [11]: http://hubot-script-catalog.herokuapp.com/
 [12]: https://github.com/hubot-scripts/hubot-thank-you
 [13]: https://github.com/github/hubot/blob/master/docs/scripting.md
