---
title: VS Code에서 TypeScript 환경 꾸리기
author: haruair
type: post
date: 2016-02-02T04:00:59+00:00
history:
  - 
    from: https://www.haruair.com/blog/3379
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: configuring-the-typescript-environment-in-vs-code
categories:
  - 개발 이야기
tags:
  - typescript
  - vscode

---
Visual Studio Code에서 TypeScript을 사용하는 환경을 꾸리는 방법을 정리했다. vscode에 아직 기능이 많은 편은 아니지만 여러 편의 기능이 있어 환경을 구축하는데 활용했다. 물론 실무에서 사용할 땐 webpack이나 여타 task 관리도구를 통해 더 쉽게 사용할 수 있다.

여기서 작성하게 될 파일 구조는 이렇다.

    .vscode
      tasks.json
    dist
      app.js
      app.js.map
    src
      HelloWorld.ts
    typings
      tsd.d.ts
      angularjs/
      jquery/
      ... tsd로 설치한 애들
    tsconfig.json -- 컴파일 설정
    tsd.json -- tsd로 설치한 인터페이스 정보
    

먼저 typescript와 [tsd][1]를 설치한다.

    npm install typescript tsd -g
    

tsd로 초기화하고 필요한 라이브러리의 인터페이스를 받는다. 물론 인터페이스만 받는 것이니 실제 라이브러리는 npm이나 bower로 받아서 따로 번들해야 한다.

    tsd init
    tsd install angularjs/angular --save
    

`tsd init` 하면 `tsd.json` 파일이 생성되고 설치된 패키지의 메타 정보가 저장된다.

`tsconfig.json` 파일을 추가하고 다음 내용으로 저장한다.

```js
{
    "compilerOptions": {
        "target": "ES5",
        "module": "commonjs",
        "sourceMap": true,
        "rootDir": "src",
        "out": "dist/app.js"
    }
}
```

추가적인 내용이 필요하다면 문서를 참고하거나 vscode의 인텔리센스를 활용해서 내용을 넣을 수 있다. 그냥 공부용이라면 그냥 다음과 같이 추가하는 것만으로도 기본값을 사용할 수 있어 정신건강에 도움이 된다.

```js
{}
```

`tsconfig.json`에 대해서는 [TypeScript에서 <reference> 없이 쓰기][2] 포스트에서 다룬 적이 있다.

vscode에서 해당 디렉토리를 불러온 후 Shift + Cmd + P로 팔레트를 연 후, `Tasks: Configure Task Runner`를 실행한다. 그러면 `.vscode/tasks.json`이라는 파일이 생성되는데 vscode에서 task를 바로 실행할 수 있도록 도와주는 설정 파일이다. tsc를 사용해서 typescript를 컴파일하는 것 외에도 gulp나 webpack 등을 호출할 수 있도록 정리가 되어 있어 필요에 따라 주석을 제거하고 사용하면 된다.

`tsconfig.json`에서 컴파일 할 설정을 이미 다 설정했기 때문에 `args`를 다음처럼 고쳐준다.

```js
    // args is the HelloWorld program to compile.
    "args": [],
```

이제 `src/HelloWorld.ts`를 작성한다.

```typescript
class Startup {
    public static main(): number {
        console.log("Hello World");
        return 0;
    }
}
```

저장한 후, Shift + Cmd + B 또는 팔레트에서 Run Build Task를 하면 설정한 것에 따라서 `dist/app.js`와 `dist/app.js.map`이 생성되는 것을 확인할 수 있다.

vscode의 build task로 gulp를 사용하고 싶다면 적당하게 `gulpfile.js`를 작성하고 `tasks.json`에서 `taskName`을 변경해주면 된다.

gulp는 이렇게 설치해주고,

    npm install gulp -g
    npm install gulp gulp-typescript --save-dev
    

`gulpfile.js`는 이렇게 작성한다. 앞서 작성한 `tsconfig.json`을 그대로 활용할 수 있다. 만약 다르게 처리하고 싶다면 [gulp-typescript 문서][3]를 참조한다.

    var gulp = require('gulp');
    var ts = require('gulp-typescript');
    
    var tsProject = ts.createProject('tsconfig.json');
    
    gulp.task('scripts', function () {
        var tsResult = tsProject.src()
            .pipe(ts(tsProject));
    
        return tsResult.js.pipe(gulp.dest('release'));
    });
    

이제 `.vscode/tasks.json`을 열어 tsc를 주석 처리하고 gulp를 찾아 주석을 해제한 후, 위 `gulpfiles.js`의 task 이름에 맞게 `taskName`을 scripts로 변경한다. 저장 후 vscode의 Run Build Task를 실행하면 gulp로 빌드하는 것을 확인할 수 있다.

추가로 gulp에서 watch를 사용하고 싶다면 다음과 같이 task를 작성하면 된다.

```js
gulp.task('watch', ['scripts'], function() {
    gulp.watch(tsProject.config.compilerOptions.rootDir + '/**/*.ts', ['scripts']);
})
```

* * *

실제로 TypeScript와 Angular1.x 환경을 구축할 때는 [generator-gulp-angular][4] 같은 제네레이터를 활용하면 깔끔하게 환경을 구축할 수 있다.

 [1]: http://haruair.com/blog/3268
 [2]: http://haruair.com/blog/3256
 [3]: https://github.com/ivogabe/gulp-typescript
 [4]: https://github.com/Swiip/generator-gulp-angular