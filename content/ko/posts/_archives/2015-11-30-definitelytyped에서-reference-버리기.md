---
title: 'TypeScript에서 <reference> 없이 쓰기'
author: haruair
type: post
date: 2015-11-30T00:00:08+00:00
history:
  - 
    from: https://www.haruair.com/blog/3256
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: how-to-use-typescript-without-reference
headline:
  - 'TypeScript의 tsconfig.json으로 &lt;reference path="foo.ts" /&gt;에서 탈출하는 방법'
categories:
  - 개발 이야기
tags:
  - dts
  - typescript

---
TypeScript를 사용한다면 다음과 같은 참조를 많이 봤을 것이다.

    /// <reference path="../../typings/tsd.d.ts" />
    

TypeScript 1.5부터 추가된 `tsconfig.json`을 프로젝트에 넣으면 레퍼런스를 일일이 적지 않고도 알아서 인터페이스를 불러온다. 별다른 설정 없이 `tsconfig.json`을 생성하는 것으로도 모든 디렉토리를 기본값으로 참조하게 된다. 기본적인 파일은 다음 내용으로 작성하면 된다.

    {}
    

추가적인 설정을 하고 싶다면 MS TypeScript의 [tsconfig.json][1]을 참고하자.

명시적으로 참조할 파일을 지정하고 싶다면 `files` 프로퍼티에 목록으로 작성한다. `files`에 명시적으로 파일명을 기록하면 명시적으로 기록되어 있는 ts 파일만 불러와서 컴파일하는 점에 유의해야 한다.

    {
      "files" : [
        "./src/app.ts",
        "./typings/tsd.d.ts",
        "./typings/angularjs/angular.d.ts",
        "./typings/jquery/jquery.d.ts"
      ]
    }
    

위 설정처럼 모두 나열해서 작성하면 해당 파일만 참조한다. 위 작성된 목록을 보면 알겠지만 아직 와일드카드(*)로 경로를 지정하는 방식이 지원되지 않고 있다.

Atom에서는 `fileGlobs`에 와일드카드로 경로를 지원하는데 아직 atom-typescript에서만 사용 가능한 기능이다. atom에서 `fileGlobs`를 와일드카드로 작성했다면, 자동으로 `files`의 목록이 갱신되는 것을 확인할 수 있다.

    {
      "filesGlob": [
        "./**/*.ts",
        "!./node_modules/**/*.ts"
      ],
      "files": [ /* 이 부분은 atom-typescript에 의해 자동으로 생성된다. */
        "./globals.ts",
        "./linter.ts",
        "./main/atom/atomUtils.ts",
        "./main/atom/autoCompleteProvider.ts",
        "./worker/messages.ts",
        "./worker/parent.ts"
      ]
    }
    

atom-typescript의 [tsconfig.json][2]를 보면 사용할 수 있는 추가적인 기능을 확인할 수 있다.

`tsconfig.json`은 원래 atom-typescript에서 사용하던 방식인데 TypeScript에 PR되어 일부 반영된 상태다. 아직 `fileGlobs` 구현이나 `files`, `exclude`에서 경로 단위로 설정하는 기능은 아직 구현이 없지만 PR은 열려있다고 하니 누군가 조만간 개선하지 않을까 생각이 든다 🙂

 [1]: https://github.com/Microsoft/typescript/wiki/tsconfig.json
 [2]: https://github.com/TypeStrong/atom-typescript/blob/master/docs/tsconfig.md