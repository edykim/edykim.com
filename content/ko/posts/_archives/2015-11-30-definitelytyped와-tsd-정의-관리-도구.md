---
title: DefinitelyTyped와 `tsd` 정의 관리 도구
author: haruair
type: post
date: "2015-11-29T22:27:10"
history:
  - 
    from: https://www.haruair.com/blog/3268
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: definitelytyped-and-tsd-definition-management-tool
headline:
  - 인터페이스가 있는 JavaScript가 쓰고 싶다면, TypeScript에 DefinitelyTyped는 필수.
categories:
  - 개발 이야기
tags:
  - tsd
  - typescript

---
TypeScript는 MS에서 개발한 JavaScript 슈퍼셋 언어다. 이 TypeScript를 사용하면 정적 검사를 활용할 수 있어 개발에 많은 편의를 제공한다. 물론 기존에 있던 JavaScript 라이브러리에 대해서도 정적 검사를 수행하려면 해당 라이브러리도 정의 파일, 다시 말해 타입 검사를 위한 인터페이스를 제공해야 한다. 그래서 나온 프로젝트가 [DefinitelyTyped][1]인데 TypeScript의 타입 정의를 제공하는 리포지터리 서비스다. 사용하는 라이브러리의 인터페이스가 이 리포지터리에 등록되어 있다면 손쉽게 내려받아 그 정의를 사용할 수 있다.

이 서비스는 `tsd`라는 TypeScript 정의 관리 도구로 사용한다. tsd 페이지에서 [설치 방법과 제공 정의 목록][2]을 확인할 수 있다. `tsd`로 설치한 라이브러리는 별다른 설정이 없으면 `tsd.json`에서 메타 정보가 관리되고 해당 파일은 `typings`에 저장된다. `tsd`로 설치된 정의는 `typings/tsd.d.ts` 파일을 참조하는 것으로 활용할 수 있다.

설명이 필요 없을 정도로 사용 방법은 간단한데 몇 가지 혼동이 오는 부분이 있어서 적어보면, `tsd install <package>`로 설치를 하면 해당하는 패키지의 **정의**를 내려받는 것이지 실제 패키지를 내려 받는 것은 아니다. 해당 패키지는 jspm, npm, bower 또는 직접 내려받아야 한다. 패키지와 타입은 전혀 별개라는 점을 처음에 이해하지 못해서 고생을 했다.

그리고 `tsd link`라는 명령어가 생각처럼 동작하지 않아서 한참을 살펴보게 되었다. (설명을 너무 대충 본 탓.) 설명을 읽어보면 `package.json`과 `bower.json`에 정보가 있는 패키지를 DefinitelyTyped에서 자동으로 찾아 정의를 받아줄 것처럼 보이지만 실제로는 다음에 충족되는 패키지에 대해서만 동작한다.

  1. 해당 패키지에 대한 타입 인터페이스를 `.d.ts`와 함께 제공
  2. 해당 패키지의 configuration에서 `"typescript": { "definition": "dist/foo.d.ts" }` 형태로 해당 타입 인터페이스를 명시한 경우

이런 패키지를 bower나 npm을 통해 설치한 후, `tsd link`를 입력하면 `typings/tsd.d.ts`에 아래처럼 참조를 등록해준다. 위 두 가지에 충족되지 않으면 마법같이 연결되는 일은 일어나지 않는다 😛

    /// <reference path="jquery/jquery.d.ts" />
    /// <reference path="../bower_components/angular/angular.d.ts" />
    

tsd의 모든 명령어는 [DefinitelyTyped/tsd][3]에서 확인할 수 있다.

 [1]: http://definitelytyped.org/
 [2]: http://definitelytyped.org/tsd/
 [3]: https://github.com/DefinitelyTyped/tsd