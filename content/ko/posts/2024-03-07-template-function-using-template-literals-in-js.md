---
title: js 템플릿 리터럴을 이용한 템플릿 함수 만들기
author: haruair
type: post
date: 2024-03-07T11:40:54
lang: ko
slug: template-function-using-template-literals-in-js
tags:
  - 개발 이야기
  - js
---

블로그를 변경하면서 간단한 템플릿 엔진이 필요했다. 템플릿 엔진을 사용하려고
살펴보니 새 문법을 배우는 것도 번거롭고 정말 작은 부분 때문에 의존성을 추가하는
것도 별로 맘에 들지 않았다. 그동안 잘 사용해온 [템플릿 리터럴][0]을 그냥 사용할
방법은 없을까 찾아보다가 [`Function` 생성자][1]를 사용해서 다음처럼 작성할 수
있었다.

```js
"use strict";

function template(html, params = {}) {
  const keys = Object.keys(params);
  const ps = keys.map(k => params[k]);
  return new Function(
    ...keys,
    'return (`' + html + '`)')
  (...ps);
}
```

`Function` 생성자는 파라미터 목록과 함수 내에 들어갈 내용을 문자열로 받고 그
함수를 반환한다. 위에서 보면 전달한 `params`에서 키 값을 수집해 함수를
생성하는 일에 사용하고 또 키 이름 순서에 맞게 `ps`  배열을 만들어 함수에
전달했다.

이제 `html`로 문자열을 전달하면 템플릿 리터럴로 이용할 수 있다.

```js
const welcomePage = '<h1>${name}님 환영합니다.</h1>'
template(welcomePage, {name: '거북이'})
// "<h1>거북이님 환영합니다.</h1>"
```

다만 "\`" 문자 사용에 주의해야 한다.

```js
const welcomePage = '<h1>\\`${name}\\`님 환영합니다.</h1>'
template(welcomePage, {name: '거북이'})
// "<h1>`거북이`님 환영합니다.</h1>"
```

## 다른 도움 함수

부분함수도 손쉽게 만들 수 있다.

```js
function partial(html) {
  return function render(params) {
    return template(html, params);
  }
}
```

```js
const accountPage = '<button>${name}님의 계정 정보</button>'
const accountPartial = partial(accountPage)

const me = accountPartial({name: '나'})
// "<button>나님의 계정 정보</button>"
const koala = accountPartial({name: '코알라'})
// "<button>코알라님의 계정 정보</button>"
```

템플릿 함수가 필요하다면 다음처럼 `params`에 함께 전달할 수 있다.

```js
const balance = () => 3000 // 또는 좀 더 복잡한 코드

const balanceInfo = template('<strong>잔고: ${balance()}</strong>')({balance})
```

nodejs에서 사용하고 있기 때문에 nodejs의 모듈을 사용해 html을 불러오는 함수를
다음처럼 작성했다. 또한 템플릿 내부에서 별도의 파일을 불러올 수 있도록 `load`
함수를 경로 맥락과 함께 템플릿 내로 전달했다.

```js
import fs from 'fs'
import path from 'path'

function load(filename, basePath = '.') {
  const dirname = path.dirname(filename);
  const html = fs.readFileSync(path.join(basePath, filename));
  const partialHtml = partial(html);

  return function loadPartial(params) {
    return partialHtml({
      ...params,
      load: function loadFromSubDir(filename) {
        return load(filename, dirname);
      }
    })
  }
}
```

```html
<!-- ./templates/index.html -->
<h1>안녕하세요!</h1>

${load('./partials/info.html')({user})}
```

```html
<!-- ./templates/partials/info.html -->
<p>${user.name}님의 계정 정보</p>
```

```js
load('./template/index.html')({user: {name: '당근'}})
// "<h1>안녕하세요!</h1>\n\n<p>당근님의 계정 정보</p>"
```

템플릿 내에서 다른 유틸리티 함수가 더 필요하다면 위 함수와 같이 더 추가하면
되겠다.

## 보안 고려하기

사용자 입력을 직접 템플릿에 사용하는 것은 당연히 위험하다! 상황에 맞게 적절한
예비 조치가 필요하다.

```js
function sanitize(text) {
  return text.replace(/[^ㄱ-ㅎ|가-힣|a-z|A-Z|0-9| ]+/gi, "")
}

template(
  "<p>${sanitize(name)}님 안녕하세요!</p>", {
    name: "<strong>헤헤</strong>",
    sanitize,
  })
// "<p>strong헤헤strong님 안녕하세요!</p>"
```

---

이렇게 작은 템플릿 함수를 작성해봤다. 템플릿 리터럴을 활용하면 몇 줄 안되는
코드로도 템플릿 함수를 구현할 수 있었다. 간단한 수준에서라면 이 함수로도 충분히
활용 가능하겠지만 이 접근 방식의 한계(`Function` 내에서 바깥 스코프에 접근할 수
있는 등)로 보안 문제가 발생할 수 있다. 이런게 가능하다 정도로만 이해하고 제대로
된 라이브러리를 활용하는 것이 더 바람직하다.

[0]: https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Template_literals
[1]: https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function

