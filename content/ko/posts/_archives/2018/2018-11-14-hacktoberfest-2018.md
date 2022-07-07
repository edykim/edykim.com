---
title: Hacktoberfest 2018 후기
author: haruair
type: post
date: "2018-11-14T17:02:00"
lang: ko
slug: hacktoberfest-2018
tags:
  - 개발 이야기
  - hacktoberfest
---

지난달 [Hacktoberfest 2018](https://hacktoberfest.digitalocean.com)이 열린다고 트위터에서 알게 되었다. 이번이 5회차라고 하니 여러 해 있던 행사인데 어떻게 한번도 몰랐나 싶었다. 그동안 몇 달 코드를 작성할 일이 전혀 없어서 나는 정말 개발자인가 😢 싶을 정도였는데 오랜만에 코드를 작성해서 즐거웠다.

PR을 보내며 느낀 점, 더 배우고 싶은 부분을 적어야겠다 생각했었다. 그런데 월 중순부터 여행을 다녀온 이후로 정신이 없어 까맣게 잊고 있었는데 오늘 참여 기념품이 덜컥 도착했다. 더 잊기 전에 짧게라도 작성하려고 한다.


<figure class="image-twitter">

[<img src="https://pbs.twimg.com/media/DsAzpSZUUAAKaTU.jpg">](https://twitter.com/heyedykim/status/1062906341327437825)

<figcaption>I just got a package from #Hacktoberfest! 😊😊😊</figcaption>
</figure>


참여 방법은 간단했다. 10월에 GitHub을 통해서 5건의 Pull Request를 보낸다. 물론 몇 가지 품질 표준으로 제시한 내용(빈칸 고치기 같은 것을 스크립트로 돌리지 않는다, 다른 사람의 코드로 PR을 보내지 않는다거나 하는 등)에 맞춰야 했다.

## 보낸 Pull Requests

원래 hacktoberfest에서 PR을 확인할 수 있었는데 끝나서 그런지 더는 해당 페이지를 제공하지 않는 것 같다. 분명 접근할 수 있을 텐데 주소를 찾지 못하겠다. 대신에 [Hacktoberfest Checker](https://hacktoberfestchecker.jenko.me/)에서 보낸 PR을 확인할 수 있다.

### [geokrety/geokrety-website](https://github.com/geokrety/geokrety-website)

`"label:hacktoberfest"`로 검색하던 중에 찾은 리포지터리다. php로 만든 geocaching 웹사이트인데 php도 할 줄 알고 geocaching도 좋아하는 주제라서 더 살펴보게 되었다. 코드가 엄청 깔끔하진 않지만, 이슈 내용으로는 내가 쉽게 도울 수 있는 부분이라서 코드를 보냈다.

코드 내에서 영어가 아닌 폴란드어를 자주 사용하고 있다는 점이 흥미로웠다. 예를 들면 `search.php`가 아니라 `szukaj.php`라는 파일명을 쓰거나 변수명이 `name` 대신 `nazwa`를 사용한다. 테이블 이름도 테이블 필드명도 부분마다 그랬다. (그래도 영어와는 다르긴 하지만) 알파벳을 사용하는 국가에서는 큰 어려움 없이 프로그래밍에 사용할 수 있다는 장점이 있었다. 여기서 구글 번역기의 힘이 크게 도움 되었다.

만약 반대 관점에서 한글을 로마자로 작성한 경우라면 어떨까? 가끔 용어 적절성 등의 이유로 한국어를 영어로 옮기지 못하는 경우를 종종 마주하기도 했다. 그렇다고 한글을 직접 사용하지 못하고 로마자 표기법대로 변환해서 사용하게 된다. 한국어를 전혀 모르는 사람이 이런 코드에 기여한다고 상상해보면 전혀 알 수 없는 단어를 번역기에 넣기 전에 일단 로마자-한글 변환을 해야 한다는 점부터 알아야 하는데 그렇게 쉽지는 않다. 이런 생각을 하니 폴란드어가 조금은 부러워졌다.

만약 이런 한글-로마자 변환을 써야 하는 경우라면 `CONTRIBUTING.md` 같은 곳에 어떻게 변환하고 찾아야 하는지 정리해주면 좋겠다. 별도로 glossary 페이지를 작성하는 것도 공수가 들긴 하겠지만 도움이 될 것 같다.

`docker-compose`가 들어있긴 했지만, 생각처럼 한 번에 돌지는 않았고 내 환경에 맞춰서 수정해야 했다. 그래도 어디를 보고 수정해야 하는지도 `INSTALL.md`에 문서화되어 있어서 다행이었다.

프론트 컨트롤러 패턴을 사용하고 있지 않은 php 웹사이트라서 보안도 그렇고 고쳐야 할 부분이 많이 보였다. 일단은 이슈 중심으로 PR을 보냈고 시간대 차이 덕분에 빠르게 피드백을 받을 수 있었다.

### [totuworld/time-recorder-viewer](https://github.com/totuworld/time-recorder-viewer)

어디 기여할 곳 없는가 기웃거리고 있었는데 [totu](https://twitter.com/totuworld)님이 리포지터리 주소를 던져주셨다.

작업시간 기록 도구인 [time recorder](https://github.com/totuworld/time-recorder)의 웹 뷰어인데 typescript로 작성하셔서 보는 재미가 있었다. typescript를 프로젝트에서 사용해본 적이 없었는데 express.js에 asp.net mvc처럼 쓰고 있어서 신기했다. react도 그렇고 너무 화려하다! 얼른 부트스트랩 프로젝트로 뜯어서 공개해주셨으면 좋겠다. 😇

어디에 기여해야 하는가 생각하며 코드를 보다가 쓰지 않는 파일이 있길래 파일을 제거하는 PR을 보냈다. 품질 표준 기준에 미치지 않는 것 같아 좀 찔린다. 하하하...

### [gatsbyjs/gatsby](https://github.com/gatsbyjs/gatsby)

[Gatsby](https://gatsbyjs.org)는 React 기반의 사이트 생성기다. 얼마 전에 [이 블로그도 Gatsby로 옮겨와서](https://edykim.com/ko/post/update-the-blog-from-wordpress-to-gatsby/) 익숙한 이름이기도 했고, 커뮤니티 분위기라든지 너무 좋은 프로젝트라 뭐라도 기여하고 싶었었다. 문서화도 정말 잘 되어 있어서 환경도 쉽게 구성해 시작할 수 있었다.

단일 리포지터리를 쓰는 프로젝트는 처음 봐서 이걸 여기에 이렇게 보내는 게 맞나 싶었다. 이슈는 온갖 다양한 주제로 가득했고 PR도 어떻게 담당하는 사람을 찾아가는지 대단하다 싶었다. 그래도 모든 창구가 단일화되어 운영되는 것이 오히려 전체적인 흐름을 파악하기도 쉽고 다른 의존적 코드를 참조하거나 찾는 일도 쉬웠다. 처음 리포지터리를 받아서 테스트를 돌리는데 리포지터리 내에 있는 모든 패키지가 교통정리 되면서 모든 테스트가 한꺼번에 진행되는 모습이 인상적이었다. 구조적인 장점 때문인지 몰라도 그동안 봤던 어느 프로젝트보다 많은 CI가 달려 있었다. 코드를 작성하면서 [단일 리포지터리의 좋은 점](https://edykim.com/ko/post/advantages-of-monorepos/)에 언급된 장점 대부분을 몸소 느낄 수 있었다.

Gatsby의 단일 리포지터리는 [lerna](https://github.com/lerna/lerna)를 사용해서 운영되고 있다. lerna를 처음 봤을 때는 왜 이런 수고를 하지 싶었는데 실제로 운영되는 모습을 보고 나니 역시 나는 하나도 모르는구나, 탄식했다. 조만간 사용해보고 싶다.

이 블로그에 아직 한국어 포스트만 많은데 영어 포스트도 할 생각으로 영어 포스트와 한국어 포스트의 RSS 피드를 따로 생성하고 있었다. RSS 리더기는 대부분 웹사이트를 등록하면 rss 주소를 찾아내는 auto discovery 기능을 제공한다. 이 과정에서 `<link>`의 `title`을 읽어 해당 피드의 이름으로 사용하는데 gatsby의 [gatsby-plugin-feed](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-feed)는 이 필드를 설정하는 부분이 없었다. 그래서 이 부분을 추가해서 코드를 보냈다.

Gatsby에서 `gatsby-config.js`에 [플러그인을 설정하고](https://www.gatsbyjs.org/docs/plugins/) 용도에 따라 플러그인 내에 `gatsby-*.js`를 읽어가는 부분이 흥미로워서 관심 있게 살펴봤다. 플러그인도 그렇고 확장성을 염두에 두고 메시지 기반처럼 작성된 부분이 많았다.

그리고 [jest](https://github.com/facebook/jest)를 테스트에 사용하고 있는데 [스냅샷 테스팅](https://jestjs.io/docs/en/snapshot-testing)이 두루두루 적용되어 있었다. 처음 `__snapshots__` 디렉토리를 보고 의아했는데 찾아보고서는 반하지 않을 수 없었다.

참고로 Gatsby는 기여를 하면 [Gatsby Store](https://store.gatsbyjs.org/)에서 사용할 수 있는 $10 쿠폰을 준다! Hacktoberfest가 시작되기 전에 문서에 있던 잘못된 링크를 고친 적이 있었는데 이때 받은 쿠폰으로 재빠르게 스티커랑 티셔츠를 샀다.

<figure class="image-twitter">

[<img src="https://pbs.twimg.com/media/DqCk7_NVYAEqz8y.jpg" alt="I regret everything" />](https://twitter.com/haruair/status/1054023667678474243)

<figcaption>내 웹사이트 니꺼보다 빠름 💜</figcaption>
</figure>

## 짧게는 행동으로, 길게는 영향으로

> 오픈소스 소프트웨어 커뮤니티는 우리 이전의 사람들 덕분에 지금 자리에 있을 수 있습니다. 당신의 참여는 10월(Hacktoberfest) 이후에도 많은 사람과 기술에 지속적인 영향을 줍니다. 이 과정은 경쟁이 아닌 여행입니다.
>
> — [Hacktoberfest의 가치](https://hacktoberfest.digitalocean.com/details) 중

몇 안 되는 사소한 코드긴 했지만 hacktoberfest를 기회로 오픈소스에 참여해볼 수 있어서 좋았다. 항상 사용자 입장에 있던 탓인지 언제든 이슈를 열고 PR을 보낼 수 있는 시대가 되었어도 참여는 늘 멀게만 느껴졌다. 겨우 몇 개의 PR을 작성했을 뿐이지만 앞으로는 무슨 코드든 마음 편하게 작성해서 보낼 수 있을 것 같다.

그리고 오픈소스를 프로젝트를 운영하는 방식, 라이브러리와 패키지, 마음 편히 코드를 보낼 수 있도록 돕는 도구가 얼마나 중요한지 또 상기했다. 좋은 방법과 도구는 부지런히 익숙해지도록 써보고 언제든 꺼낼 수 있도록 깊이 있게 배워야겠다.

마지막으로 작은 코드나 문서의 오타를 수정하는 정도지만 오픈소스 세상은 충분히 커서 내 조그마한 기여도 정말 많이 필요로 하는 것 같다. "경쟁이 아닌 여행"이란 부분을 상기한다. 앞으로도 얼마나 많이 기여할 수 있을지 모르겠지만 틈틈이 참여할 수 있으면 좋겠다.
