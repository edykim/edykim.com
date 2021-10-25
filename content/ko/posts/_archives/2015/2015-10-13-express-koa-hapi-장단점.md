---
title: Express, Koa, Hapi 장단점 비교
author: haruair
type: post
date: "2015-10-13T00:00:35"
history:
  - 
    from: https://www.haruair.com/blog/3107
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: express-koa-hapi-pros-and-cons-comparison
  - 번역
tags:
  - 개발 이야기
  - express
  - hapi
  - koa
  - nodejs
  - js


---
nodejs로 개발을 한다면 Express, Koa, Hapi 중 하나는 꼭 접하게 된다. 내 경우는 Express를 맨 처음 접해서 가장 익숙하지만 generator를 지원하는 koa에 대한 이야기도 들어봤고 hapi도 최근 react나 angular와 함께 사용하는 얘기를 자주 들을 수 있었다.

어떤 차이가 있는지 검색하다가 간단하게 정리된 [Jonathan Glock][1]의 글 [Node.js Framework Comparison: Express vs. Koa vs. Hapi][2]을 접하게 되었고 장단점 부분만 간단하게 번역했다. 원문에는 비교 코드도 포함되어 있어서 코드를 보고 싶다면 원문을 살펴보길 권한다.

<div style="border:1px solid #dfdfdf; padding: 1.4em 1em; font-size: 0.8em;">
  Thank you <a href="https://www.airpair.com/" rel="nofollow">Airpair</a> for giving me the opportunity to translate this article. If you want to check the original, please visit <a href="https://www.airpair.com/node.js/posts/nodejs-framework-comparison-express-koa-hapi">Node.js Framework Comparison: Express vs. Koa vs. Hapi</a> page.
</div>

## 각 프레임워크의 장단점

### Express

Node.js 프레임워크 중 커뮤니티가 가장 크다. 거의 5년 가량 개발되어 가장 성숙했고 StrongLoop에 의해 관리되고 있다. 서버를 쉽게 실행/운영할 수 있다. 내장된 라우터로 코드를 쉽게 재사용 가능하다.

수작업으로 해줘야 하는 부분이 많다. 내장된 에러 핸들링이 없어서 미들웨어를 잃어버릴 수 있다. 한 문제를 해결하기 위해 여러 방법으로 접근할 수 있다. Express는 스스로를 완고하다고 표현하는데 이 부분은 양날의 검이며 초보인 경우에는 단점으로 작용한다. 다른 프레임워크에 비해 메모리를 많이 차지한다.

### Koa

메모리를 덜먹고 표현력이 좋다. 다른 프레임워크에 비해 미들웨어 작성이 쉽다. 기본적으로 뼈대 프레임워크라서 제공되는 미들웨어와 함께 사용해야만 하는 Express와 Hapi와 달리, 개발자가 필요한 미들웨어만 구성해 사용할 수 있다. ES6를 도입하고 있어 ES6 제너레이터를 사용할 수 있다.

여전히 불안정하고 많은 양의 개발이 진행중이다. ES6를 사용하기 위해 최신 버전의 node.js를 사용해야 한다. (주, 이 문제는 지금도 해당하는지 모르겠음.) 미들웨어를 직접 작성할 수 있는게 장점일 수 있지만 단점일 수도 있다. 예제서 살펴본 라우터는 훨씬 다양한 옵션을 다뤄야 한다.

### Hapi

코드보다 설정을 더 많이 해야 해서 정말 좋은 프레임워크인지 말이 많다. 견고함과 재사용성을 요구하는 큰 규모 팀에서는 흔하게 사용한다. 월마트랩에서 만들고 이름있는 회사에서 많이 쓰고 있어서 검증되었다고 보는 편이다. 좋은 프레임워크로 계속 성장할 것으로 보인다.

Hapi는 크고 복잡한 어플리케이션에 특성화 되어 있다. 보일러플레이트로 작성해야 할 코드가 많아서 작은 웹앱에서는 쓰기 불편하고, 예제 및 hapi로 작성된 오픈소스 앱도 적다. 이 프레임워크를 선택하면 서드파티 미들웨어에 기대는 쪽보다 개발자가 직접 작성해야 할 부분이 더 많을 것이다.

* * *

위 프레임워크 중 Express만 경험해봐서 각각 예제 코드가 살펴보는데 도움되었다. Koa는 tj가 노드를 떠난다는 글 쓴 이후로 시들할줄 알았는데 (그 핑계로 Koa를 딱히 살펴보지 않았는데) 여전히 잘 관리되고 있었다. 다양한 라이브러리가 매일같이 쏟아져 나와 봐야할 것도 많긴 하지만 잘 정착하는 프레임워크도 늘어나고 있어 커뮤니티가 잘 성숙하고 있다는 인상을 준다.

## 각 프레임워크 웹사이트

  * [Express.js][3]
  * [Koajs][4]
  * [Hapi][5]

 [1]: https://twitter.com/pupster
 [2]: https://www.airpair.com/node.js/posts/nodejs-framework-comparison-express-koa-hapi
 [3]: http://expressjs.com/
 [4]: http://koajs.com/
 [5]: http://hapijs.com/