---
title: 애플리케이션 상태 관리
type: post
date: "2019-03-20T11:52:00"
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

어떤 추상을 사용해야 하는가에 대한 핵심은 그 추상의 비용과 잇점을 이해하는 데 있습니다. 이득이 무엇인지 알려면 그 추상이 풀기 위한 문제가 무엇인지, 그 문제를 해결하기 위한 다른 해법은 무엇인지 이해할 필요가 있습니다. 이 글에서는 제가 사용해보고 좋았던 추상도 공유하려고 합니다. _물론 여기서는 책이 아니기 때문에 모든 경우를 다 다루지 않고 기본적인 부분에 대해서만 설명합니다._

I'm going to organize this in the same way you should consider adding these
abstractions to your application as it grows in size/complexity. It's important
to not add an abstraction too early, otherwise the cost you're paying is greater
than the benefit the abstraction can add.

Also, this is pretty react-specific, but hopefully the general ideas translate
well to other frameworks.

### Component state

This is where you start. It's really likely that you'll use `setState` somewhere
in your application if it's at all interactive. I feel like React's component
state API is severely under-appreciated and under-used. It's an incredibly
simple API and doesn't add much complexity to your application at all.

For learning/reviewing your knowledge about this, I recommend watching this 7
minute (free) video:
["Use Component State with React"](https://egghead.io/lessons/react-use-component-state-with-react).
Then give the official docs about
[lifting state up](https://reactjs.org/docs/lifting-state-up.html#lifting-state-up)
a look!

**I seriously recommend seeing how far you can get with this API before
continuing further.** It's super powerful on its own.

Where things start to break down with component state is when you bump into
problems with "prop drilling." Learn more about this here:

[**Prop Drilling**](https://blog.kentcdodds.com/prop-drilling-bb62e02cb691)

### JavaScript Module (Singleton)

If you're unfamiliar with the singleton pattern, don't worry, in JavaScript it's
pretty straightforward. It's basically just state that you have inside a module.
Here's a simple implementation of this pattern in JS:

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

The singleton pattern is a pretty ok option because it allows you to import the
state using regular JS modules. So rather than drilling props down to the
components that need them, the components themselves can import the module and
get the state they need.

This comes with a serious limitation however, and that is when you attempt to
update the state in the singleton, the components need to be made aware of the
update so they'll re-render themselves. This requires a bit more effort to
implement (you basically need to implement a simple event emitter), but it's not
terribly challenging, and there are libraries to help with this as well (no, I
don't have a favorite off the top of my head), so a singleton in this way is
still not a bad option. That is,
[unless you're trying to do server-side rendering](https://stackoverflow.com/a/40974748/971592)
(which most of you probably aren't so....)...

### Context

The new Context API in React is super duper awesome. If you haven't read my post
about that yet, give it a look:

[**React's ⚛️ new Context API**](https://medium.com/dailyjs/reacts-%EF%B8%8F-new-context-api-70c9fe01596b)

React context allows you to overcome the prop-drilling problem _and_ the update
issues with a singleton with a simple built-in API. With this API you can pretty
easily make state accessible anywhere in the tree using the
`<ContextInstance.Provider />` and `<ContextInstance.Consumer />` components
without much difficulty.

Honestly, because the new context API is so simple, there aren't a ton of
situations where a singleton would be a whole lot more simple. This is awesome
news because it means that React (which solved the component state problem so
well with `setState`) could now be solving the application state problem in a
great way with `createContext`.

### [Unstated](https://github.com/jamiebuilds/unstated)

[James Kyle](https://medium.com/u/cc2eaf4f2cd2) created a new library for state
management that utilizes the new context API. I'm pretty sure this is my new
go-to for any non-trivial app that needs to share state across the application.
I like it because it's not a whole lot more on top of context, it's a small
library, and it very cleanly separates state containers and presentational
components in a way that makes everything easier to test and think about.

### [redux](https://redux.js.org/)

The problem redux is intended to solve was to make
[flux](https://facebook.github.io/flux) more palatable. The problem flux is
intended to solve is predictable state flow, improved state debuggability, and
simplify the calculation of derived data across stores. It does this through a
clean separation of concerns and unidirectional data flow.

**Redux seriously simplified things** and basically ended the "flux wars"
of 2015. It still allows you the benefits of flux, without a lot of the
boilerplate of the original abstractions. There is a strong place and use case
for redux-based state management and _I'm so glad that it's here to help solve
problems in application state management. It's really helped a lot of people!_

That said, it does add a significant amount of complexity to any app that
implements it. It forces a layer of
[indirection](https://en.wikipedia.org/wiki/Indirection) on your application
that can make following complex user interactions and state updates a real
challenge. If you've ever jumped in a project and had to follow the flow of
dispatches/action creators/reducers all the while searching for the action type
name and opening a half dozen or more files, you know what I'm talking about.

I think a reason that so many applications use and embrace redux is because it
incidentally solves the prop-drilling problem with the `connect` higher order
component that react-redux gives you. The prop-drilling problem is a pain that
even relatively small applications face, so they reach for redux to solve that
problem without realizing that **there are several other much simpler
alternatives**.

> **When you choose redux to solve the prop-drilling problem, you're bringing in
> a cost that is intended to solve problems you don't have and hence the cost is
> greater than the benefit.**

Try other solutions first. And **limit the amount of state in you store in redux
to only the state that _needs_ to be at that level of the tree** (probably the
root if you're a typical redux user).
[Here](https://twitter.com/housecor/status/962754389533429760) are some wise
words from [Cory House](https://medium.com/u/e986f7cdb458) about using redux
prematurely/for everything:

https://twitter.com/housecor/status/962754389533429760

### Conclusion

There are SO many other abstractions and
[patterns](http://kcd.im/advanced-react) you could implement, but it's getting
late and I don't have all _year_ to write about them all 😉

I should emphasize that **state should exist and be stored as close to where
it's needed as possible.** In practical terms, this means that you do NOT need
to store a form input's error state in the global store unless it's absolutely
necessary (which it very likely is not). This means that you will _very likely_
be using component state in your application. You _may_ want to use context or
singletons somewhere within your application. Even in a small sub-section of the
tree this could be useful. Good luck! 👍

