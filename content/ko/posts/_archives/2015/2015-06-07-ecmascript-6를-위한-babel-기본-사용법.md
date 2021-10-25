---
title: ECMAScript 6를 위한 Babel 기본 사용법
author: haruair
type: post
date: "2015-06-07T10:59:59"
history:
  - 
    from: https://www.haruair.com/blog/2917
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: basic-usage-of-babel-for-ecmascript-6
headline:
  - JavaScript의 최신 문법, ECMAScript 6가 적용되기 전에 사용해볼 수 있는 방법
tags:
  - 개발 이야기
  - babel
  - ECMAScript6
  - javascript
  - js
  - webpack

---
ECMAScript 6 에서 추가되는 많은 새로운 기능들이 기대가 되면서도 아직까지 직접 사용해보지 못했었다. 최근에 JavaScript 관련 컨퍼런스 영상 뿐만 아니라 대부분의 포스트도 최신 문법으로 작성되는 경우가 많아 살펴보게 되었다.

ES5 표준은 2009년에 표준화되어 점진적으로 반영되고 있지만 ECMAScript 6는 2015년 6월 승인을 목표로 작성되고 있는 새 ECMAScript 표준이다. Prototype 기반의 객체 지향 패턴을 쉽게 사용할 수 있도록 돕는 `class`의 추가, `=>` 화살표 함수 표현, 템플릿 문자열, `generator`와 `yield` 등 다른 언어에서 편리하게 사용하던 많은 기능들이 추가될 예정이다.

현재 나와있는 JS 엔진에는 극히 일부만 실험적으로 적용되어 있어서 실제로 사용하게 될 시점은 까마득한 미래와 같이 느껴진다. 하지만 현재에도 기존 JavaScript와 다른 문법을 사용할 수 있도록 돕는 [transform compiler][1]가 존재한다.

TypeScript, CoffeeScript는 JavaScript 문법이 아닌 각각의 문법으로 작성된 코드를 JavaScript에서 동작 가능한 코드로 변환한다. 이와 같은 원리로 ECMAScript 6 문법으로 작성된 파일을 변환-컴파일하는 구현이 존재한다. 이 포스트에서 소개하려는 라이브러리, [babel][2]이 바로 그 transcompiler 중 하나다.

<div style="text-align: center;">
  <img style="background:#f5da55; padding:20px; max-width:200px;" src="//babeljs.io/images/logo.svg" />
</div>

## Babel 사용하기

다른 라이브러리와 같이 npm으로 설치 가능하다.

    $ npm install --global babel
    

ES6로 작성한 파일로 js 컴파일한 결과를 확인하려면 다음 명령어를 사용할 수 있다.

    $ babel script.js
    

파일로 저장하기 위해 `--out-file`, 변경할 때마다 저장하도록 하려면 `--watch` 플래그를 활용할 수 있다. 파일 대신 경로도 사용할 수 있다.

    $ babel ./src --watch --out-file script-compiled.js
    

babel을 설치하면 node.js의 CLI와 같이 사용할 수 있는 `babel-node` 라는 CLI를 제공한다. `node`처럼 REPL나 직접 파일을 실행할 때 사용할 수 있다. 직접 실행해서 확인할 때 편리하다.

    $ babel-node # REPL 실행 시
    $ babel-node app.js
    

자세한 내용은 [babel CLI 문서][3]에서 확인할 수 있다.

## 다른 도구와 함께 Babel 사용하기

Babel은 다양한 usage에 대한 예시를 제공하고 있다. Babel의 [Using Babel][4]을 확인하면 현재 사용하고 있는 도구에 쉽게 접목할 수 있다.

Meteor는 다음 패키지를 설치하면 바로 사용할 수 있다. 이 패키지를 설치하면 `.es6.js`, `.es6`, `.es`, `.jsx` 파일을 자동으로 컴파일 한다.

    $ meteor add grigio:babel
    

Webpack을 사용하고 있다면 `babel-loader`를 설치한 후 webpack.config.js에 해당 loader를 사용하도록 설정하면 끝난다.

Webpack을 사용해보지 않았다면 다음 순서대로 시작할 수 있다. Webpack은 모듈을 하나의 파일로 묶어주는 module bundler의 역할을 하는 도구다. 먼저 CLI를 설치한다.

    $ npm install --global webpack
    

프로젝트에서 babel을 사용할 수 있도록 `babel-loader`를 추가한다.

    $ npm install babel-loader --save-dev
    

`webpack.config.js` 파일을 다음과 같이 작성한다.

    module.exports = {
      entry: "./app.js",
      output: {
        path: __dirname,
        filename: "bundle.js"
      },
      module: {
        loaders: [
          { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
      }
    }
    

위 설정은 node_modules 디렉토리를 제외한, 프로젝트 내에 있는 모든 *.js를 babel로 변환 후 묶어준다. 각각 세부적인 옵션은 [webpack 문서][5]에서 살펴볼 수 있다.

* * *

매번 비슷하면서도 전혀 새로운 라이브러리가 많이 나와 때로는 따라가기 버겁다는 생각이 들 때도 있지만 찬찬히 들여다보면 그 새로움에 자극을 받게 된다. (부지런한 사람들 같으니!) 다음 세대 ECMAScript를 준비하는 마음으로 새로운 문법도 꼼꼼히 봐야겠다. Babel, Webpack 등 최근 나오는 라이브러리는 문서화가 잘 되어있는 편이라 금방 배우기 쉬운 편이니 각 문서를 확인해보자.

## 더 읽을 거리

  * [Babel &#8211; Learn ES2015][6]: 새로운 ES6 문법을 설명
  * [Webpack &#8211; Getting Started][5]: Webpack의 기본적인 사용 방법 안내

 [1]: https://github.com/jashkenas/coffeescript/wiki/List-of-languages-that-compile-to-JS
 [2]: https://babeljs.io
 [3]: http://babeljs.io/docs/usage/cli/
 [4]: http://babeljs.io/docs/setup/
 [5]: http://webpack.github.io/docs/tutorials/getting-started/
 [6]: http://babeljs.io/docs/learn-es2015/
