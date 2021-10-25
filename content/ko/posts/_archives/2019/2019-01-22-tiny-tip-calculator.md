---
title: Tiny Tip Calculator 개발기
author: haruair
type: post
date: "2019-01-22T11:52:00"
lang: ko
slug: postmortem-tiny-tip-calculator
tags:
  - 개발 이야기
  - app
  - ios
  - ionic
  - tiny tip calculator

---

<img src="https://c2.staticflickr.com/8/7857/45926354015_c7ec87b7cf_h.jpg" alt="App Screenshot" />

iOS 앱 [Tiny Tip Calculator](https://itunes.apple.com/app/tiny-tip-calculator/id1448227957?mt=8)를 만들었다.

## 계기

매번 식사를 밖에서 할 때마다 팁을 계산하는 모습을 보고 간편한 팁 계산기가 있으면 좋겠다고 생각했다. 그래서 앱스토어에서 받으려고 검색했는데 수많은 팁 계산기가 다음 부류였다.

- 광고가 지나치게 많아서 사용성을 크게 해침
- 결과를 보기까지 인터렉션이 너무 많이 필요
- 그냥 안 이쁨

어떤 앱은 세 가지 모두에 해당했다. 그래서 간단한 앱을 하나 만들기로 했다.

## 도구 선정

집에 있는 모든 사람이 아이폰을 사용하고 있어서 iOS 앱을 만들기로 했고 무엇으로 개발할지 고민했다.

- Swift는 일단 네이티브니 성능도 좋고 원하는 만큼 뜯어고칠 수 있겠지만 익숙하지 않았다. 물론 만들면서 배우는 것만큼 학습에 좋은 방식은 없지만 원하는 결과물을 만들어 내는 데 집중하고 싶었다.
- [React Native](https://facebook.github.io/react-native/)도 고려했다. React Native의 툴링도 좋고, 성능도 마음에 들고 예전보다 확실히 리소스가 많았다. [expo.io](https://expo.io/)도 멋지다.
- [Ionic](https://ionicframework.com/)은 Cordova와 Angular를 잘 섞은 프레임워크였는데 아무래도 웹앱이라서 성능에 대한 걱정이 들었다. 그래도 문서도 정리가 잘 된 편이었고 네이티브 기능을 쉽게 사용할 수 있도록 플러그인도 많이 제공했다.

React도 계속 공부하고 써보려고 하고 있지만, 여전히 Angular가 익숙한 데다 생각보다 Ionic의 성능이 좋아서 Ionic으로 선택했다. React에 좀 더 익숙하다면 React Native를 고민 없이 선택했을 것이다. 결과물을 빠르게 보겠다는 생각 탓에 편향적인 결정을 내렸다.

## 개발 목표

개발하기 전에 다음 목표를 정했다.

- 내장 키보드 말고 키패드 직접 만들 것, 계산기처럼 모든 기능이 보이도록.
- 입력 횟수를 최소로 하기.
- 팁 비율을 목록으로 보여줌. 비율은 프리셋 설정할 수 있도록.
- 이쁘고 깔끔하게, 슬라이드 같은 것도 넣지 말고. 테마도 지원하면 좋겠음.
- 앱처럼 보이도록!

## 개발 계획

프로젝트를 생성할 때 정도만 문서를 봤고 Angular는 이미 익숙해서 평소 작업하듯 만들었다. 로직은 별문제 없이 만들었지만, 스타일에 수고가 많이 들었다.

전체적으로 페이지 수는 얼마 되지 않았다.

- 계산 페이지
  - (계산 모드)
  - (결과 모드)
- 설정 목록
  - 통화 및 팁 비율 설정
  - 테마 설정
  - 소개 페이지

Angular는 각 컴포넌트나 디렉티브, 모듈의 선언적 관리가 전체적인 코드 구성에 정말 편리했다. TypeScript와 함께 궁합도 너무 좋았다. 프레임워크 답게 전체적인 만듦새나 구조는 Angular가 확실히 더 이해하기 좋게 느껴진다.

앱에서 필요한 부분은 모두 ionic에서 제공하는 플러그인으로 충분했다. Storage 등도 이미 다 고수준으로 제공하고 있는 데다 angular에서 손쉽게 의존성 주입으로 활용할 수 있었다.

## Good & Bad

웹과 다른 흐름의 도구를 제대로 만들어서 결과를 낸 것은 처음이었다. 이 과정에서 좋았던 점은 다음 같았다.

- 익숙한 도구를 선택해서 빠른 결과를 냈다. 첫 PoC를 만드는 데 하루 걸렸고 전체적으로 코드를 정리하고 작성하는데 3일 정도 사용했다. 테마 구현을 가장 고민했었는데 의외로 손쉽게 해결했다.
- 다른 앱의 리뷰를 찾아보고 새로운 유즈케이스를 찾아 기능을 추가했다. 리뷰 중에 세금 불포함 계산 방식이 필요하다는 이야기가 반복되었지만 지원하는 앱이 거의 없었다. 그래서 해당 기능을 첫 릴리즈 이후 추가해서 배포했다.
- 파워 유저(이자 아내)에게 빠른 피드백을 받을 수 있었다. 실제로 앱을 사용하는 과정도 옆에서 볼 수 있었던 점도 새로운 경험이었다. 버튼의 위치나 세부적인 기능에 대한 조언은 앱에 반영되었다.

아쉬운 점도 있었다.

- 익숙한 도구를 사용해서 기술 배경에서 크게 도전적인 프로젝트는 아니었다. 게다가 네이티브 환경이 아니라서 이쁘지 않은 부분이 계속 눈에 걸렸다. 예를 들면 스크롤바가 화면 밖에 걸쳐 있다든지 하는 부분은 하이브리드앱에서 흔히 겪는 문제다. 이런 부분이 크게 사용성을 해치는 상황은 아니지만 안 이쁜 건 계속 거슬렸다.
- 테스트가 미흡했다. Ionic과 Angular 모두 테스트에 유리한 환경을 기본적으로 제공하는데도 테스트를 부지런히 작성하지 않았다. 빠르게 작성하는 데는 성공했지만 좋은 품질을 유지하고 작성하는 일에는 소홀했다.
- 수익성을 고려하지 않았고 프로모션도 하지 않았다. 다른 앱 리뷰에서 광고 얘기를 보면서 아예 광고를 생각하지 않았다. 지금이야 크게 나쁜 결정이라는 생각은 들지 않지만, 애플 개발자 계정을 연장할 때면 왜 이런 결정을 했을까 생각 들 것 같다.

## 결과

이미 많은 앱이 존재해서 검색 목록 위로 올라가는 일조차 쉽지 않지만 어떤 방식으로든 결과물을 빠르게 냈다는 점에 즐거웠다. 그리고 작은 앱이더라도 옆에서 부지런히 쓰는 사용자가 있어서 재미있었다. 다음 또 앱을 만든다면 어떤 점을 미리 고려해야 하는지도 배웠다.

----

## 트러블 슈팅

### iOS에서 overflow로 생성한 스크롤 부드럽게(?) 하기

스타일에서 `overflow` 프로퍼티를 적용하면 웹 페이지 내에 스크롤을 넣을 수 있다. 그런데 iOS에서는 그 스크롤을 써보면 일반적으로 경험할 수 있는 스크롤처럼 부드럽지 않고 뻑뻑하게 움직인다. 이 동작을 iOS의 기본 동작처럼 바꾸려면 다음 스타일을 추가로 넣어야 한다.

```css
--webkit-overflow-scrolling: touch;
```

### 최근 모델의 notch 해결하기

*이 스타일은 Safari만 지원한다.*

먼저 웹뷰의 페이지에서는 기본적으로 상단의 스테이터스바를 안전 영역으로 처리한다. 그래서 고정 영역을 예로 들어 `top: 0`로 설정해도 스테이터스바 바로 아래에 자리를 잡는다. 화면 전체를 웹 영역에 넣고 처리하고 싶은 경우에는 `viewport-fit`을 viewport에 추가해야 한다.

`viewport-fit`은 다음 3가지 값을 지원한다. [csswg 문서](https://drafts.csswg.org/css-round-display/#viewport-fit-descriptor)에 그림을 잘 그려놨다.

- `auto`: 기본 값으로 아무 동작하지 않는다.
- `contain`: 웹뷰 영역이 잘리지 않도록 디바이스 영역에 맞춘다.
- `cover`: 디바이스 영역에 빈틈이 없도록 웹뷰 영역을 맞춘다.

```html
<meta name="viewport" content="viewport-fit=cover, ..." />
```

이제 화면 전체 영역을 사용할 수 있게 되었다. 이제 스테이터스바 영역만큼 밀어야 할 필요가 생긴다.

```css
header.global {
    padding-top: 20px;
}
```

하지만 이렇게 고정값을 넣으면 노치가 없는 기기에서 높이가 이상해진다. 이런 상황에서는 `safe-area-inset-*` 상수를 사용하면 된다.

```css
heaader.global {
    padding-top: constant(safe-area-inset-top); /* iOS 11.0 */
    padding-top: env(safe-area-inset-top); /* iOS 11+ */
}
```

`constraint()`는 없어질 예정이며 이후로는 `env()`를 사용하면 되겠다.

- [env() - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/env)
- [viewport-fit - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@viewport/viewport-fit)

### CSS Grid

고정된 화면을 기준으로 각 컴포넌트를 배치하는데 css grid가 정말 편했다. `vw`, `vh`와 `calc()`를 함께 쓰면 어떤 컴포넌트든 원하는 위치에 놓을 수 있었다.

- [Basic Concepts of grid layout - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout)
- [A Complete Guide to Grid - CSS-TRICKS](https://css-tricks.com/snippets/css/complete-guide-grid/)

### `position: sticky`

`sticky`를 `position` 프로퍼티에 사용하면 필요한 요소를 고정으로 띄울 수 있다. 예전엔 위치 계산해서 `fixed`를 직접 설정해줬어야 했는데 손쉽게 구현할 수 있다.

다만 iOS에서 `sticky`에 배경을 지정해도 위에 1px 정도 아래 엘리먼트가 보이는 문제가 있었다. `transform: translateY(-1px)`를 추가해서 약간 비틀어서 해결되었고 GPU 가속이 동작해선지 약간 버벅이던 동작도 없어졌다.


- [position - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/position)

### `:host-context()`

하위 컴포넌트가 상위 컴포넌트의 스타일에 따라 스타일을 제어해야 할 때가 있는데 여기에 `:host-context()`를 사용할 수 있다. `[theme]`과 같은 디렉티브를 사용해서 부모 엘리먼트에 클래스를 추가하도록 했다면 `:host-context()`로 해당 클래스를 추적하는 것이 가능하다.

```scss
// hello.theme.scss
:host-context(.theme--hello) {
    * {
        font-family: 'Arial Rounded MT Bold', sans-serif;
    }

    header {
        color: #ff00c3;
    }
    // ...
}
```

현재는 이렇게 만든 각 테마 scss를 한 곳에서 모두 불러오는 구조로 되어 있다. 이 구현을 다시 한다면 중간에 테마를 제어하는 컴포넌트를 `ViewEncapsulation.None`로 놓고 테마 스타일을 동적으로 불러오도록 처리하고 싶다.

- [:host-context() - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/:host-context())

### 오버 스크롤 끄기

하이브리드앱을 가장 하이브리드앱처럼 보이게 하는 동작 중 하나가 오버 스크롤이다. 이 동작으로 전체 레이아웃이 고정된 부분 없이 움직이면 앱처럼 느껴지지 않는다. Cordova에서는 다음 속성을 `config.xml`에 추가하면 이 문제를 해결할 수 있다.

```xml
<!--config.xml in the project-->
<preference name="DisallowOverscroll" value="true" />
```

### Version API 만들기

최신 버전을 확인하고 새 버전이 있다면 업데이트를 하도록 작은 버튼을 띄워주고 싶었다. 예전엔 블로그용 서버가 있어서 코드를 작성해서 올리면 되었겠지만 이제는 정적 블로그를 사용하고 있어서 아무래도 제한되는 부분이 있었다. 요구 사항은 이랬다.

- 적어도 response header를 제어할 수 있어야 함
- 반환값은 하드 코딩이어도 큰 상관 없음, 디비 연동도 필요 없음
- 비용으로 가장 저렴할 것 (연 5불 이하)
- 인증 필요 없음
- https 지원
- 관리는 최소로

그래서 [Azure Functions](https://azure.microsoft.com/en-us/services/functions/)를 선택하게 되었다.

```js
module.exports = async function (context) {
    context.res = {
        headers: {
            'Content-Type': 'application/json',
        },
        body: {
            version: '1.1.4',
            tagline: 'New Theme: Mono',
            link: 'https://itunes.apple.com/app/tiny-tip-calculator/id1448227957?mt=8'
        }
    };
};
```

아쉽게도 현재 netlify에 물려 있는 도메인을 사용해서는 API 주소를 https로 사용할 수 없었다. Azure의 앱서비스 내로 도메인을 가져와야만 A 레코드로 사용할 수 있었고 CNAME은 https의 인증서에 문제가 있다고 접근이 되질 않았다. 큰 기능의 API도 아닌 탓에 그냥 기본으로 제공하는 azurewebsites.net의 서브 도메인을 사용했다.

Azure Functions의 비용은 앱 서비스 플랜과 종량제 플랜 중 하나를 고를 수 있는데 앱 서비스 플랜의 경우는 앱 서비스를 사용해서 function app을 실행하는 방식으로 앱 서비스만큼 비용을 내야 하고 종량제는 쓰는 만큼 비용을 지불하는 방식이다. 내 경우에는 크게 사용량이 많지 않을 것이라는 판단에서 종량제 플랜을 선택했다.

하지만 종량제 플랜에서는 Cold start가 너무 느렸다. 앱서비스 플랜은 인스턴스를 계속 띄우고 있기 때문에 항상 빠른 응답을 받을 수 있다. 하지만 종량제 플랜에서는 Function app 호출이 특정 시간 동안 없을 땐 해당 코드가 구동되는 인스턴스를 없엤다가 호출이 있을 때 인스턴스를 다시 생성해서 코드를 올려 구동한다. 그래서 인스턴스가 올라와 있는 상황에서 호출하면 warm start로 응답이 100ms 미만으로 매우 빠르지만, cold start는 인스턴스를 올리는 것부터 시작하기 때문에 더 오랜 시간이 걸렸다. 내 경우에는 코드가 의존성도 없고 매우 단순한데도 8초에서 22초까지 걸렸다. 비용은 코드를 실행해서 결과를 반환하기까지 시간에 대해서만 청구되기 때문에 비용적으로 문제는 없었다.

현재 사용량이 상당히 적은 상태인데 이 문제 때문에 앱 서비스 플랜을 사용하고 싶지는 않았다. 그래서 해결 방법을 찾아보니 그냥 계속 살아 있도록 function을 호출하는 방법이 있었다. 그래서 5분 간격으로 function app을 실행하도록 Timer 트리거를 추가했다.

```json
{
  "bindings": [
    {
      "name": "myTimer",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 */5 * * * *"
    }
  ]
}
```

```js
module.exports = async function () {
    console.log('health checked');
};
```

만약 사용량이 많아지면 Azure Functions는 알아서 스케일링을 수행한다. 스케일링을 수행하면 새 인스턴스가 생성되면서 cold start가 다시 발생할 수 있지만, 현재는 두 API 모두 큰 자원을 소모하지 않고 있고 사용량도 적기 때문에 계속 warm start를 유지할 수 있었다. 만약 다른 인스턴스가 올라가서 다시 cold start가 감지된다면 그때는 앱 서비스 플랜으로 변경할 생각이다.

현재까지 비용 예측은 월간 $0.25 정도고 이조차도 Functions 호출 비용보다 코드가 저장된 공간인 스토리지의 비용이 대부분을 차지하고 있다.

### 빌드와 배포

빌드와 배포 과정에서 문제가 되었던 부분이 몇 있었는데 검색으로 쉽게 해소했다.

- Xcode의 모던 빌드 시스템을 사용하면 문제가 생긴다. 빌드를 생성할 때 다음 플래그를 추가한다.
  ```
  $ ionic cordova build ios -- --buildFlag="-UseModernBuildSystem=0"
  ```
- Xcode에서 **File > Project Settings...**에 들어가서 Build System을 **Legacy Build System**으로 변경한다.
- Signing에 문제가 있다고 나오면 `Automatically manage signing`의 체크 박스를 해제하고 Xcode를 다시 실행해서 다시 체크한다.
- 일반적인 암호화 외의 기능을 사용하면 앱 배포에 추가적인 절차가 필요하다. 하지만 단순히 API 호출에 HTTPS를 사용하거나 인증 절차에 사용하는 경우에는 예외에 해당한다. `info.plist`에 `ITSAppUsesNonExemptEncryption`를 `NO`로 설정한다.

----

- [Tiny Tip Calculator - Apple App Store](https://itunes.apple.com/app/tiny-tip-calculator/id1448227957?mt=8)
