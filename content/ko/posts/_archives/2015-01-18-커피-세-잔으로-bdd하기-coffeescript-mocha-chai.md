---
title: 커피 세 잔으로 BDD하기 – CoffeeScript, Mocha, Chai
author: haruair
type: post
date: 2015-01-18T13:28:53+00:00
history:
  - 
    from: https://www.haruair.com/blog/2621
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: bdd-with-three-cups-of-coffee-coffeescript-mocha-chai
categories:
  - 개발 이야기
tags:
  - BDD
  - chai
  - coffeescript
  - mocha

---
CoffeeScript에 대한 얘기는 정말 많이 들었고 주변에서도 많이 사용하고 있지만 정작 제대로 살펴본 적이 없었다. 주말 시간을 내서 [Better CoffeeScript Testing With Mocha][1] 글을 중점으로 여러 아티클을 읽어보고 정리하는 차원에 남기는 포스트다.

이 모든 내용을 포스트 하나에서 다루기에는 각각의 내용이 방대하기 때문에 개론적으로만 읽고 각 소제목에 따른 더 읽을 거리를 참고 했으면 좋겠다.

## BDD (Behavior-Driven Development)

BDD 즉, 행위/행동 주도 개발은 애자일 방법론 중 하나로 TDD와 인수 테스트 주도 계획(Acceptance Test-Driven Planning)에서 진화한 방법론이다. TDD를 한다는 본질은 다르지 않지만 **사용자 스토리**와 같은 인수 테스트를 기준으로 기획하게 된다.
  
<!--more-->


  
유닛테스트는 올바른 코드를 작성했는가 즉, 개개의 클래스와 메소드를 테스트 한다면 인수테스트는 올바른 소프트웨어를 작성했는가 즉, 시스템 전반에 걸친 기능에 대해 테스트하게 된다. 그 결과로 Domain-Driven Design과 같이 기획과 개발에서 같은 시나리오로 이야기 할 수 있게 되고, 개발에서는 사용자 스토리의 맥락을 통해 요구사항을 쉽게 이해할 수 있게 된다.

더 읽어볼 만한 내용은 마지막 섹션인 더 읽을 거리에서 찾아볼 수 있다.

## CoffeeScript

[CoffeeScript][2]는 JavaScript로 컴파일 할 수 있는 작은 언어다. JavaScript에서 반복적으로 사용되는 코드를 효과적으로 짧게 사용할 수 있도록 도와주고 그로 인해 가독성도 높아지는 등 여러 장점이 있어 많은 사람들이 사용하고 있다. 공식 사이트를 보면 알겠지만 축약 문법을 제공한다고 생각하면 이해하기 쉽다.

nodejs가 설치되어 있다면 npm으로 간단하게 설치해서 사용할 수 있다.

    npm install -g coffee-script
    

js파일을 node에서 실행해볼 때 `node something.js` 와 같이 실행한다면 CoffeeScript에서는 `coffee something.coffee` 처럼 실행할 수 있다. 앞서 이야기 한 것처럼 CoffeeScript는 JavaScript로 컴파일되어 실행되는데 js파일로 어떻게 컴파일되는지 확인하고 싶다면 `--compile` 플래그를 사용해 js파일을 확인해볼 수 있다.

    coffee --compile something.coffee
    # something.js 파일로 결과물이 나온다
    

CoffeeScript의 문법은 [CoffeeScript 웹사이트][2]에서 확인할 수 있다.

## Mocha, Chai

[Mocha][3]는 JavaScript 테스트 프레임워크로 node, 브라우저, 비동기 테스트까지 가능하다. 순수하게 테스트를 위한 프레임워크라서 [assertion을 위해 다른 라이브러리를 사용][4]해야 한다. 이 포스트에서는 [chai][5] BDD/TDD assertion 라이브러리를 사용한다.<sup id="fnref-2621-1"><a href="#fn-2621-1" rel="footnote">1</a></sup>

## 커피 세 잔으로 BDD하기

내가 읽은 글은 Todo 만들기였는데 이 포스트에서는 서점 만들기<sup id="fnref-2621-2"><a href="#fn-2621-2" rel="footnote">2</a></sup>를 해보려고 한다. 앞서 언급한 세 모듈을 로컬에만 설치해서 `node_modules/.bin/coffee <blarblar>` 식으로 사용해도 되지만 그냥 전역으로 설치했다.

    $ npm install --global coffee-script mocha chai
    

먼저 `npm init`로 `package.json`을 생성하고 앞서 세 모듈을 의존성 모듈로 추가한다.

    $ mkdir bookstore
    $ cd bookstore
    $ npm init
    $ npm install coffee-script --save
    $ npm install mocha chai --save-dev
    

`Mocha`는 기본적으로 `test` 폴더 내에 있는 파일들을 실행한다. `test` 폴더를 생성하고 `bookstore_test.coffee`를 추가해 테스트를 작성한다.

    $ mkdir test
    $ touch test/bookstore_test.coffee
    

`Chai`는 BDD와 TDD 모두 지원하는데 BDD 스타일로 사용하려면 `chai`를 불러온 후 `chai.should()`를 호출해야 한다. 다음과 같이 `describe`와 `it`으로 테스트 파일을 작성한다.

    chai = require 'chai'
    chai.should()
    
    {Book} = require '../src/bookstore'
    
    describe 'Book', ->
      it 'should have a title', ->
        book1 = new Book 'Colorless Tsukuru Tazaki'
        book1.title.should.equal 'Colorless Tsukuru Tazaki'
    

위 파일에서 assert 라이브러리 `chai`를 불러오고 `Book` 클래스를 앞으로 작성할 파일인 `bookstore.coffee`에서 불러왔다. 그리고 `책은 제목을 가져야 한다`는 시나리오를 작성하고 그에 맞는 테스트를 추가했다. 이제 프로젝트 디렉토리로 이동해서 mocha로 테스트를 실행한다.

    $ mocha
    0 passing (1ms)
    

mocha는 실행되었지만 작성한 파일이 실행되지 않았다. 만약 여기서 `Error: cannot resolve path (or pattern) 'test'`가 난다면 프로젝트 최상위 위치가 아니기에 test 디렉토리를 찾지 못해 발생하는 에러다.

여기서 mocha를 별다른 플래그 없이 실행하면 기본값인 JavaScript 파일만 확인해서 실행이 된다. 이 테스트가 CoffeeScript로 작성되어 있으므로 `--compiler` 플래그를 다음과 같이 추가해야 한다.

    $ mocha --compilers coffee:coffee-script/register
      Book
        1) should have a title
    
      0 passing (4ms)
      1 failing
    
      1) Book should have a title:
         ReferenceError: Book is not defined
         ...
    

작성한 코드가 실행되었고 아직 `Book`을 작성하지 않았기 때문에 실패했다. (위 코드에서 보듯 ReferenceError가 발생했다.) `src` 디렉토리에 `bookstore.coffee`를 추가하고 코드를 작성한다.

    class Book
      constructor: (@title) ->
        true
    
    root = exports ? window
    root.Book = Book
    

CoffeeScript는 컴파일되면 익명함수 속으로 들어가서 실행되기 때문에<sup id="fnref-2621-3"><a href="#fn-2621-3" rel="footnote">3</a></sup> 마지막 두 줄을 추가해 다른 곳에서도 해당 클래스를 사용할 수 있도록 해야 한다.

이제 파일을 작성했으니 `mocha`를 실행해야 한다. `mocha`를 실행할 때 `--compiler` 플래그 등의 설정값을 [설정파일을 만들어서][6] 대체할 수 있다. `test` 폴더 내에 `mocha.opts` 파일을 만들고 해당 플래그를 추가한다.

    --compilers coffee:coffee-script/register
    

이제 `mocha`를 실행하면 다음과 같이 테스트가 성공하는 것을 확인할 수 있다.

    $ mocha
      Book
        ✓ should have a title 
    
      1 passing (3ms)
    

여기서 `책은 새 책/헌 책 일 수 있다`, `책은 시리즈물 일 수 있다`는 행동을 추가해 다음과 같이 작성했다.

    describe 'Book', ->
      book1 = book2 = null
    
      it 'should have a title', ->
        book1 = new Book 'Colorless Tsukuru Tazaki'
        book1.title.should.equal 'Colorless Tsukuru Tazaki'
    
      it 'should be a series of books', ->
        book1 = new Book "Harry Potter and the Philosopher's Stone"
        book2 = new Book "Harry Potter and the Chamber of Secrets"
    
        book2.seriesOf book1
    
        book2.volume.should.equal 'series'
        book2.original.should.equal book1
        book1.sequel.should.equal book2
    
      it 'should be initially new', ->
        book1.status.should.equal 'new'
    
      it 'should be used', ->
        book1.use().should.be.true
        book1.status.should.equal 'used'
    

위 테스트를 통과할 수 있도록 `seriesOf`, `use` 메소드와 `volume`, `status` 프로퍼티를 추가해 `Book` 클래스를 작성하면 다음과 같다.

    class Book
      constructor: (@title) ->
        @volume = 'single'
        @status = 'new'
        true
    
      seriesOf: (@original) ->
        @original.sequel = @
        @volume = 'series'
    
      use: ->
        @status = 'used'
        true
    

테스트를 실행하면 테스트를 모두 통과하는 것을 볼 수 있다.

    $ mocha
    
    Book
      ✓ should have a title 
      ✓ should be a series of books 
      ✓ should be initially new 
      ✓ should be used 
    
    4 passing (3ms)
    

## 직접 작성해보기

어떤 과정으로 프로젝트를 시작하고 BDD를 통해 개발을 하는지 간단하게 확인했다. 원 글에서는 다른 클래스에 대해서도 설명했지만 같은 내용을 반복하는 것보다 추가적인 과정은 직접 해보고 리포지터리랑 비교해보는게 좋을 것 같아서 여기까지만 작성했다.

`Bookshelf`는 다음과 같은 시나리오로 작성을 했다.

  * 책장은 처음에는 비어 있을 것이다.
  * 책장은 새 책을 넣을 수 있을 것이다.
  * 책장은 새 책 제목 만으로도 새 책으로 넣을 수 있을 것이다.
  * 책장은 책을 뺄 수 있을 것이다.
  * 책장은 모든 책 목록을 보여줄 수 있을 것이다.

`Mocha`와 `chai`로 다양한 시나리오를 작성해보고 그에 맞는 코드를 CoffeeScript로 작성해보는 것은 분명 도움이 되리라 믿는다. 내가 작성한 최종 코드는 [이 리포지터리][7]에서 확인할 수 있다.

## 더 읽을 거리

[Better CoffeeScript Testing With Mocha][1]는 위 내용보다 더 세세하게 다루고 있어서 이 글 보다 이해하기 쉽다.

BDD에 대해서 더 알고 싶다면 다음 글이 도움이 된다.

  * [TDD에 대한 조금 다른 생각][8]
  * [BDD 너는 어디서 온거니?][9]
  * [테스트 주도 개발(TDD)을 넘어서 &#8211; 동작 지향 개발(BDD)][10]
  * [Introducing BDD 번역][11]
  * [They&#8217;re not User Stories][12]

여기서 사용한 모듈은 전부 문서화가 잘 되어있는 편이었다.

  * [CoffeeScript][13]
  * [CoffeeScript Style Guide][14]
  * [Chai Assertion Library &#8211; assertion styles][15]
  * [Mocha][3]</p> 
  * [CoffeeScript의 기본적인 문법과 Function][16]

  * [mocha: node.js 테스트 프레임워크][17]

<li id="fn-2621-1">
  <p>
    이름만으로는 도대체 무슨 역할을 하는지 알 수 없는 시대다. 커피 이름 종류별로 다 쓰고 나면 나중엔 WhiteChocolateMochaFrappuccino 같은 이름을 써야할지도.&#160;<a href="#fnref-2621-1" rev="footnote">&#8617;</a> </li> 
    
    <li id="fn-2621-2">
      결국은 같은데 이름만 다른 코드 아니냐 하시면 할 말은 없습니다. 녜. (&#8230;)&#160;<a href="#fnref-2621-2" rev="footnote">&#8617;</a>
    </li>
    <li id="fn-2621-3">
      <code>coffee -c filename.coffee</code> 명령어로 어떻게 컴파일이 되는지 눈으로 확인하면 이해가 쉽다.&#160;<a href="#fnref-2621-3" rev="footnote">&#8617;</a> </fn></footnotes>

 [1]: http://code.tutsplus.com/tutorials/better-coffeescript-testing-with-mocha--net-24696
 [2]: http://coffeescript.org/
 [3]: http://mochajs.org/
 [4]: http://mochajs.org/#assertions
 [5]: http://chaijs.com/
 [6]: http://mochajs.org/#mocha.opts
 [7]: https://github.com/haruair/bookstore
 [8]: http://oddpoet.net/blog/2010/08/02/a-new-look-at-test-driven-development-kr/
 [9]: http://woogri.tistory.com/13
 [10]: http://www.moreagile.net/2014/03/beahvior-driven-development.html
 [11]: http://blog.jaigurudevaom.net/319
 [12]: http://lizkeogh.com/2010/02/02/theyre-not-user-stories/
 [13]: http://coffeescript.org
 [14]: https://github.com/polarmobile/coffeescript-style-guide
 [15]: http://chaijs.com/guide/styles/
 [16]: http://blog.outsider.ne.kr/680
 [17]: http://blog.outsider.ne.kr/770