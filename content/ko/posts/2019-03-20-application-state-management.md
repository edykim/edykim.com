---
title: 애플리케이션 상태 관리
type: post
date: "2019-03-20T20:52:00"
lang: ko
slug: application-state-management
headline:
  - 소프트웨어에서 가장 복잡한 문제 중 하나인 상태 관리를 어떻게 해야 하는지 그 접근법을 알아봅니다
categories:
  - 개발 이야기
  - 번역
tags:
  - react
  - state

---

<div class="translation-note">

이 포스트는 [Kent C. Dodds](https://twitter.com/kentcdodds)의 [Application State Management](https://kentcdodds.com/blog/application-state-management)을 번역한 글입니다.

</div>

One of the hardest parts of software development is managing state. Life could
be so simple if the user couldn't interact with the application at all, but that
sounds like a 90s website and most of us are building interactive applications,
so we've got to put state somewhere.

소프트웨어 개발에서 가장 어려운 부분 중 하나는 상태 관리(managing state)입니다. 만약 사용자가 애플리케이션과 상호작용을 전혀 하지 않았더라면 우리 삶은 훨씬 단순했을 겁니다. 물론 90년대 웹사이트에서나 할 이야기입니다. 우리는 상호작용이 필요한 애플리케이션을 만들어야 하니 어디엔가 상태를 저장해야 합니다.

Because state is so complicated and use cases differ so greatly across different
applications, there are TONS of ways to manage application state. They each are
intended to solve some specific problems with managing state and as is true of
any abstraction, they add a level of complexity to the application in exchange
for relieving the pains of those problems.

상태는 정말 복잡하기 때문이며 애플리케이션마다 사용 사례가 극과 극으로 다릅니다. 그래서 애플리케이션에서 상태를 관리하는 방법도 엄청나게 다양합니다. 각각의 방법은 특정 방법을 해결하는데 촛점을 맞추고 있으며 어떤 추상이든 이 문제에 따른 고통을 완화하기 위해 애플리케이션에 복잡도를 추가하게 됩니다.

The key to knowing which abstractions to use is understanding the cost and
benefit of the abstraction. To understand the benefit, you have to understand
the problems it's intended to solve and how it goes about solving those problems
relative to other options. In this newsletter I want to share with you some of
the abstractions I've tried and like. _This is not at all comprehensive and it
will be pretty basic because I'm not writing you a book right now 😉._

어떤 추상을 사용해야 하는가에 대한 핵심은 그 추상의 비용과 이점을 이해하는 데 있습니다. 이득이 무엇인지 알려면 그 추상이 풀기 위한 문제가 무엇인지, 그 문제를 해결하기 위한 다른 해법은 무엇인지 이해할 필요가 있습니다. 이 글에서는 제가 사용해보고 좋았던 추상도 공유하려고 합니다. _물론 여기서는 책이 아니기 때문에 모든 경우를 다 다루지 않고 기본적인 부분에 대해서만 설명합니다._

I'm going to organize this in the same way you should consider adding these
abstractions to your application as it grows in size/complexity. It's important
to not add an abstraction too early, otherwise the cost you're paying is greater
than the benefit the abstraction can add.

이 글에서는 애플리케이션의 규모와 복잡도가 성장할 때 추상을 추가하는 것을 어떻게 고려하게 되는지와 동일한 방법으로 접근합니다. 추상을 너무 이르게 추가하지 않는 것은 중요합니다. 필요보다 먼저 추가한 추상은 그 이득보다 더 많은 비용을 지불하게 될 수 있습니다.

Also, this is pretty react-specific, but hopefully the general ideas translate
well to other frameworks.

그리고 여기서는 리액트에 특정한 해법이긴 하지만 다른 프레임워크에서도 충분히 적용할 수 있는 일반적인 개념이 되었으면 합니다.

## 컴포넌트의 상태

This is where you start. It's really likely that you'll use `setState` somewhere
in your application if it's at all interactive. I feel like React's component
state API is severely under-appreciated and under-used. It's an incredibly
simple API and doesn't add much complexity to your application at all.

여기서 시작합니다. 상호작용이 필요한 애플리케이션이라면 어디선가 `setState`를 사용하게 될겁니다. 저는 생각보다 리액트 컴포넌트의 상태 API가 심할 정도로 인정을 덜 받고 덜 사용된다고 느낍니다. 믿을 수 없을 정도로 단순한 API며 애플리케이션에 그다지 복잡도를 추가하지도 않습니다. 

For learning/reviewing your knowledge about this, I recommend watching this 7
minute (free) video:
["Use Component State with React"](https://egghead.io/lessons/react-use-component-state-with-react).
Then give the official docs about
[lifting state up](https://reactjs.org/docs/lifting-state-up.html#lifting-state-up)
a look!

이 지식을 배우거나 다시 살펴보고 싶다면 다음 7분 분량의 (무료) 비디오를 확인해보세요. ["리액트에서 컴포넌트 상태 사용하기"](https://egghead.io/lessons/react-use-component-state-with-react). 그리고 공식 문서의 [상태 들어 올리기](https://reactjs.org/docs/lifting-state-up.html#lifting-state-up)를 확인해보세요.


**I seriously recommend seeing how far you can get with this API before
continuing further.** It's super powerful on its own.

**이후 내용을 더 보기 전에 상태 API를 어디까지 사용할 수 있는지 보는 것을 진지하게 추천합니다.** 이 API 자체만으로도 정말 강력합니다.

Where things start to break down with component state is when you bump into
problems with "prop drilling." Learn more about this here:

컴포넌트 상태가 고장나기 시작하는 지점은 "프로퍼티 내리꽂기"에서 문제를 마주하게 될 때입니다. [프로퍼티 내리꽂기](https://blog.kentcdodds.com/prop-drilling-bb62e02cb691)를 참고하세요. (역주: [번역](https://edykim.com/ko/post/prop-drilling/))

### 자바스크립트 모듈 (싱글톤)

If you're unfamiliar with the singleton pattern, don't worry, in JavaScript it's
pretty straightforward. It's basically just state that you have inside a module.
Here's a simple implementation of this pattern in JS:

만약 싱글톤(singleton) 패턴에 익숙하지 않더라도 걱정하지 마세요. 자바스크립트에서는 상당히 직관적인 편입니다. 이는 단순히 모듈 안에 상태를 보관하는 패턴입니다. 이 패턴을 JS로 간단히 구현하면 다음과 같습니다.

```js
const state = {}

const getState = () => state
const setState = newState => Object.assign(state, newState)

export {getState, setState}
```

One reason you might decide to move on from component state is when you start
feeling some pain from "the prop-drilling problem". This is that as your React
application grows, the "component tree" also grows meaning that as you lift
state up the tree to have it shared across the application, it can become a real
chore to get state to the parts of the tree it needs to be _and_ handlers for
updating that state.

"프로퍼티 내리꽂기 문제"에서 오는 불편함을 느끼기 시작할 때 컴포넌트 상태 API에서 다음 단계로 넘어가는 것을 고려하게 됩니다. 리액트 애플리케이션이 성장하면 "컴포넌트 트리"도 함께 성장한다는 뜻입니다. 이 과정에서 애플리케이션에서 널리 공유되는 상태를 트리 위로 끌어 올리게 됩니다. 비대해진 컴포넌트 트리에서 컴포넌트가 필요로 하는 상태와 상태를 갱신하기 위한 핸들러를 내려받는 과정이 정말 번거로워집니다.

The singleton pattern is a pretty ok option because it allows you to import the
state using regular JS modules. So rather than drilling props down to the
components that need them, the components themselves can import the module and
get the state they need.

일반적인 JS 모듈을 사용해서 상태를 불러올 수 있다는 점에서 싱글톤 패턴은 꽤 괜찮은 선택지입니다. 그러니 프로퍼티를 내려 꽂는 것보다 컴포넌트 스스로 모듈을 불러와서 상태를 사용하도록 하세요.

This comes with a serious limitation however, and that is when you attempt to
update the state in the singleton, the components need to be made aware of the
update so they'll re-render themselves. This requires a bit more effort to
implement (you basically need to implement a simple event emitter), but it's not
terribly challenging, and there are libraries to help with this as well (no, I
don't have a favorite off the top of my head), so a singleton in this way is
still not a bad option. That is,
[unless you're trying to do server-side rendering](https://stackoverflow.com/a/40974748/971592)
(which most of you probably aren't so....)...

물론 이 방법은 심각한 한계가 있습니다. 이 싱글톤으로 상태를 갱신할 때마다 컴포넌트가 다시 렌더링을 할 수 있도록 주의해야 합니다. 이 과정은 구현에 조금 더 노력을 필요로 합니다. (즉, 간단히 말해서 이벤트 에미터 (event emitter)를 구현할 필요가 있습니다.) 하지만 엄청 어려운 것은 아니며 이 과정을 도와줄 라이브러리도 존재합니다. 그러니 싱글톤 패턴을 사용하는 방법이 그렇게 나쁜 선택지는 아닙니다. [서버-사이드 렌더링을 필요로 하지 않는 경우라면 말이죠.](https://stackoverflow.com/a/40974748/971592) (물론 대부분은 이 부분도 필요로 할 겁니다...)

## 컨텍스트 Context

The new Context API in React is super duper awesome. If you haven't read my post
about that yet, give it a look:

리액트의 새 컨텍스트 API는 정말 멋집니다. 아직 이 기능을 모르신다면 [리액트⚛️ 의 새 컨텍스트 API](https://medium.com/dailyjs/reacts-%EF%B8%8F-new-context-api-70c9fe01596b)를 확인해보세요.

React context allows you to overcome the prop-drilling problem _and_ the update
issues with a singleton with a simple built-in API. With this API you can pretty
easily make state accessible anywhere in the tree using the
`<ContextInstance.Provider />` and `<ContextInstance.Consumer />` components
without much difficulty.

리액트 컨텍스트를 사용하면 프로퍼티 내리꽂기 문제와 싱글톤을 갱신하는 문제를 간단한 내장 API로 극복할 수 있게 됩니다. 이 API는 간단히 `<ContextInstance.Provider />`와 `<ContextInstnace.Consumer />` 컴포넌트를 사용해서 어디서든지 상태에 접근할 수 있도록 구성할 수 있게 됩니다.

Honestly, because the new context API is so simple, there aren't a ton of
situations where a singleton would be a whole lot more simple. This is awesome
news because it means that React (which solved the component state problem so
well with `setState`) could now be solving the application state problem in a
great way with `createContext`.

새로운 컨텍스트 API가 매우 단순한 덕분에 정말 많은 상황에서 단순히 싱글톤 패턴을 적용하는 것이 훨씬 간단해졌습니다. 리액트에서 컴포넌트 상태를 `setState`로 간단히 해결하는 것처럼 `createContext`를 사용해서 애플리케이션 상태를 해결할 수 있게 되었다는 점에서 정말 멋진 기능입니다.

## [Unstated](https://github.com/jamiebuilds/unstated)

[James Kyle](https://medium.com/u/cc2eaf4f2cd2) created a new library for state
management that utilizes the new context API. I'm pretty sure this is my new
go-to for any non-trivial app that needs to share state across the application.
I like it because it's not a whole lot more on top of context, it's a small
library, and it very cleanly separates state containers and presentational
components in a way that makes everything easier to test and think about.

[제임스 카일](https://medium.com/u/cc2eaf4f2cd2)은 새 컨텍스트 API와 함께 사용할 수 있는, 새로운 상태 라이브러리를 만들었습니다. 이 라이브러리는 제가 상태를 공유할 일이 있는 앱이 있을 때 사용할, 새로운 최애 라이브러리입니다. 이 라이브러리는 컨텍스트 위에 많은 것을 올리지 않는 조그마한 라이브러리라 좋습니다. 그리고 상태 컨테이너와 표현 컴포넌트를 명확하게 분리하고 있어서 모든 코드가 테스트하기 편리하니 한번 염두해보세요.


### [redux](https://redux.js.org/)

The problem redux is intended to solve was to make
[flux](https://facebook.github.io/flux) more palatable. The problem flux is
intended to solve is predictable state flow, improved state debuggability, and
simplify the calculation of derived data across stores. It does this through a
clean separation of concerns and unidirectional data flow.

redux가 풀려고 의도했던 문제는 [flux](https://facebook.github.io/flux)를 좀 더 손쉽게 사용할 수 있도록 하는 부분이었습니다. Flux는 상태의 흐름을 예측 가능하도록 만들어서 상태를 디버깅하는 방법을 개선하려고 했습니다. 또한 저장소에서 나온 데이터를 연산하는 과정을 단순화하려고 했습니다. 이 두 문제를 해결하기 위해서 명확한 관심사 분리와 단방향 데이터 흐름을 사용했습니다.

**Redux seriously simplified things** and basically ended the "flux wars"
of 2015. It still allows you the benefits of flux, without a lot of the
boilerplate of the original abstractions. There is a strong place and use case
for redux-based state management and _I'm so glad that it's here to help solve
problems in application state management. It's really helped a lot of people!_

**Redux는 이 과정을 정말 단순화해서** "flux 전쟁"을 2015년에 종식했습니다. 기존 Flux라면 필요했던 수많은 추상을 구현하지 않고도 flux의 이점을 누릴 수 있게 되었습니다. Redux 기반 상태 관리는 강점을 갖는 경우도 많고 사용 사례 또한 많습니다. _저는 이 라이브러리가 애플리케이션 상태 관리의 어려움을 해결했다는 점에 너무 기쁩니다. 이 라이브러리는 정말 많은 사람에게 도움이 되었습니다!_

That said, it does add a significant amount of complexity to any app that
implements it. It forces a layer of
[indirection](https://en.wikipedia.org/wiki/Indirection) on your application
that can make following complex user interactions and state updates a real
challenge. If you've ever jumped in a project and had to follow the flow of
dispatches/action creators/reducers all the while searching for the action type
name and opening a half dozen or more files, you know what I'm talking about.

다시 말하면, 이 라이브러리를 사용한 앱이라면 엄청난 양의 복잡도를 더하게 되었다는 의미입니다. 이 라이브러리는 [우회](https://en.wikipedia.org/wiki/Indirection)적인 계층을 애플리케이션에 추가하는 것으로 복잡한 사용자 상호작용을 구현하고 상태를 갱신했습니다. 이 라이브러리를 사용하는 프로젝트에 참여한 적이 있다면 디스패치와 액션, 크리에이터와 리듀서를 다 열어서 액션 타입명을 비교하는 일을 해봤을 겁니다. 그렇다면 복잡도에 대한 이야기도 이해할거라 생각합니다.

I think a reason that so many applications use and embrace redux is because it
incidentally solves the prop-drilling problem with the `connect` higher order
component that react-redux gives you. The prop-drilling problem is a pain that
even relatively small applications face, so they reach for redux to solve that
problem without realizing that **there are several other much simpler
alternatives**.

많은 애플리케이션이 redux를 사용하고 채택하는 이유는 react-redux의 `connect` 고차 함수가 프로퍼티 내리꽂기 문제를 우연히 해결했기 때문이라 봅니다. 프로퍼티 내리꽂기 문제는 상대적으로 작은 애플리케이션에서도 겪을 수 있는 고통인데 이 문제를 해결하기 위해 redux를 고려하는 경우가 많습니다. **더 쉬운 대안이 있다는 것을 모른 상태로 말이죠.**

> **When you choose redux to solve the prop-drilling problem, you're bringing in
> a cost that is intended to solve problems you don't have and hence the cost is
> greater than the benefit.**

**프로퍼티 내리꽂기 문제를 해결하기 위해 redux를 선택한다면 해결할 필요 없던 문제를 위해 비용을 지불하게 되는데 그로 인해 실제로 얻는 이득보다 더 많은 비용을 내게 됩니다.**

Try other solutions first. And **limit the amount of state in you store in redux
to only the state that _needs_ to be at that level of the tree** (probably the
root if you're a typical redux user).

다른 해결책을 먼저 사용해보세요. 그리고 **상태를 _필요로 하는_ 트리를 기준으로 redux에 보관하는 상태의 분량을 제한하세요.** (일반적인 redux 사용자라면 최상위에 위치하고 있을 겁니다.)

[Here](https://twitter.com/housecor/status/962754389533429760) are some wise
words from [Cory House](https://medium.com/u/e986f7cdb458) about using redux
prematurely/for everything:

[코리 하우스](https://medium.com/u/e986f7cdb458)가 이른 redux 적용에 대해 다음과 같은 트윗을 남겼습니다.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Realization: Putting Redux in our company framework by default was a mistake.<br><br>Result:<br>1 People connect *every* component.<br>2 People embed Redux in &quot;reusable&quot; components.<br>3 Everyone uses Redux. Even when they don&#39;t need it.<br>4 People don&#39;t know how to build an app with just React.</p>&mdash; Cory House 🏠 (@housecor) <a href="https://twitter.com/housecor/status/962754389533429760?ref_src=twsrc%5Etfw">February 11, 2018</a></blockquote>

> 깨달음: Redux를 회사 프레임워크에 기본으로 넣은 것은 실수였다.
>
> 결과:
> 1. 사람들이 *모든* 컴포넌트를 연결함.
> 2. 사람들이 재사용 가능한 컴포넌트에도 Redux를 포함함.
> 3. 모두가 Redux를 사용함. 심지어 필요가 없는 경우에도.
> 4. 사람들이 React만 갖고 앱을 만들 줄 모름.
>
> — [코리 하우스](https://twitter.com/housecor/status/962754389533429760?ref_src=twsrc%5Etfw)

## 결론

There are SO many other abstractions and
[patterns](http://kcd.im/advanced-react) you could implement, but it's getting
late and I don't have all _year_ to write about them all 😉

이 문제를 해결하기 위해 구현할 수 있는 수많은 추상과 [패턴](http://kcd.im/advanced-react)이 있지만 제가 이걸 다 적으려면 올해 내내 적어도 시간이 모자랄 겁니다. 😉

I should emphasize that **state should exist and be stored as close to where
it's needed as possible.** In practical terms, this means that you do NOT need
to store a form input's error state in the global store unless it's absolutely
necessary (which it very likely is not). This means that you will _very likely_
be using component state in your application. You _may_ want to use context or
singletons somewhere within your application. Even in a small sub-section of the
tree this could be useful. Good luck! 👍

그래서 제가 강조하고 싶은 부분은 **상태가 존재한다면 필요한 곳에 최대한 가까이 보관하라**는 점입니다. 실무적인 용어로 설명하면 폼 입력창의 오류 상태를 전역 스토어에 보관하지 말라는 뜻입니다. 정말로 필요한 경우가 아니라면 말이죠. (그런 경우는 분명 드물껍니다.) 대신에 애플리케이션에서 컴포넌트 상태를 사용할 가능성이 _매우 높다_ 는 뜻이고 이런 경우에 컨텍스트나 싱글톤을 애플리케이션 어딘가에서 _아마도_ 사용하고 싶어질 겁니다. 컴포넌트 트리의 작은 일부 영역이라도 이 접근 방법은 매우 유용합니다.
