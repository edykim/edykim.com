---
title: "리액트 훅(Hooks): 렌더링 프로퍼티는 어떻게 되나요?"
author: haruair
type: post
date: "2019-03-21T17:38:00"
lang: ko
slug: react-hooks-whats-going-to-happen-to-render-props
headline:
  - 훅 기능이 렌더링 프로퍼티 컴포넌트와 비교했을 때 얼마나 코드 재사용성을 해결하는지 확인합니다
categories:
  - 개발 이야기
  - 번역
tags:
  - react
  - react hooks
  - js
  - react props
---

<div class="translation-note">

이 포스트는 [Kent C. Dodds](https://twitter.com/kentcdodds)의 [React Hooks: What's going to happen to render props?](https://kentcdodds.com/blog/react-hooks-whats-going-to-happen-to-render-props)를 번역한 글입니다.

</div>

작년에 ["프로퍼티 게터(prop getters)를 사용해서 사용자에게 컴포넌트 렌더링 제어를 넘겨주는 방법"](https://blog.kentcdodds.com/how-to-give-rendering-control-to-users-with-prop-getters-549eaef76acf)이란 포스트를 작성했습니다. 이 글에서 (당시) [`react-toggled`](https://github.com/kentcdodds/react-toggled)의 전체 구현을 보여줬는데 [`downshift`](https://github.com/paypal/downshift)에서 사용했던 패턴을 가르치기 위해서 작성했던 라이브러리입니다. 제가 downshift에서 훨씬 간단하고 단순한 컴포넌트를 동일한 패턴으로 구현해서 사용했기 때문에 프로퍼티 게터 패턴을 가르치기 아주 좋은 방법이었습니다. 

react-toggled와 downshift는 둘 다 렌더링 프로퍼티 패턴을 사용해서 리액트 컴포넌트 간의 로직 코드를 공유했습니다. 다른 포스트인 ["렌더링 프로퍼티를 사용하지 말아야 하는 경우"](https://blog.kentcdodds.com/when-to-not-use-render-props-5397bbeff746)에서 렌더링 프로퍼티 패턴을 적용하기 좋은 경우를 확인했습니다. 하지만 리액트 훅을 적용하기 좋은 경우도 동일합니다. 리액트 훅은 클래스 컴포넌트와 렌더링 프로퍼티 조합보다 훨씬 간단합니다.

리액트 훅이 안정 버전에서 제공되기 시작하면 더이상 렌더링 프로퍼티를 쓸 필요가 없다는 의미인가요? **아닙니다!** 여전히 렌더링 프로퍼티 패턴이 아주 유용하게 쓰일 수 있는 부분이 있으며 그 부분을 곧 살펴보도록 하겠습니다. 하지만 현재의 `react-toggled`를 훅 기반으로 구현한 코드와 비교해서 왜 훅이 더 간단하다고 주장하는지 비교해보도록 하겠습니다.

코드가 궁금하다면 [현재의 `react-toggled`를 확인해보기 바랍니다](https://github.com/kentcdodds/react-toggled/blob/8452a1f2a4ec7b64588cd8c9812e0faf8deb0271/src/index.js).

가장 일반적인 `react-toggled` 사용 방법입니다.

```jsx
function App() {
  return (
    <Toggle>
      {({on, toggle}) => <button onClick={toggle}>{on ? 'on' : 'off'}</button>}
    </Toggle>
  )
}
```

단순히 간단한 토글 기능이 필요한 경우라면 훅으로 작성한 코드는 다음과 같습니다.

```js
function useToggle(initialOn = false) {
  const [on, setOn] = useState(initialOn)
  const toggle = () => setOn(!on)
  return {on, toggle}
}
```

이제 다음과 같은 방식으로 사람들이 사용할 수 있게 됩니다.

```jsx
function App() {
  const {on, toggle} = useToggle()
  return <button onClick={toggle}>{on ? 'on' : 'off'}</button>
}
```

훨씬 간단하고 멋집니다. 하지만 react-toggled의 Toggle 컴포넌트는 이보다 더 많은 기능을 제공합니다. 하나를 예로 들자면 `getTogglerProps`라는 헬퍼(helper)를 제공합니다. 이 함수는 토글하는 엘리먼트에 올바른 프로퍼티를 전달하기 위해 사용합니다. (접근성을 위한 `aria` 속성도 포함합니다.) 이 기능도 포함해봅니다.

```js
// 주어진 함수 목록을 호출하는 함수를 반환
const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args))

function useToggle(initialOn = false) {
  const [on, setOn] = useState(initialOn)
  const toggle = () => setOn(!on)
  const getTogglerProps = (props = {}) => ({
    'aria-expanded': on,
    tabIndex: 0,
    ...props,
    onClick: callAll(props.onClick, toggle),
  })
  return {
    on,
    toggle,
    getTogglerProps,
  }
}
```

이제 `useToggle` 훅에서 `getTogglerProps` 헬퍼도 사용할 수 있습니다.

```jsx
function App() {
  const {on, getTogglerProps} = useToggle()
  return <button {...getTogglerProps()}>{on ? 'on' : 'off'}</button>
}
```

기존 방식보다 더 접근하기 좋고 편리합니다. 만약 `getTogglerProps`가 필요 없는 경우라면 어떨까요? 다음처럼 코드를 조금 더 나눌 수 있습니다.

```js
// 주어진 함수 목록을 호출하는 함수를 반환
const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args))

function useToggle(initialOn = false) {
  const [on, setOn] = useState(initialOn)
  const toggle = () => setOn(!on)
  return {on, toggle}
}

function useToggleWithPropGetter(initialOn) {
  const {on, toggle} = useToggle(initialOn)
  const getTogglerProps = (props = {}) => ({
    'aria-expanded': on,
    tabIndex: 0,
    ...props,
    onClick: callAll(props.onClick, toggle),
  })
  return {on, toggle, getTogglerProps}
}
```

이제 `react-toggled`가 지원하는 `getInputTogglerProps`와 `getElementTogglerProps`도 같은 방법으로 구현할 수 있습니다. 이 접근 방식이라면 앱에서 사용하지 않는 추가적인 유틸리티를 쉽게 떨어낼 수 있고 어떤 면에서는 렌더링 프로퍼티 해결책이 오히려 사용하기 조잡하다고 느껴질 수도 있겠습니다. (불가능한 것은 아니지만 그냥 좀 깔끔하지 않습니다.) 

**하지만!** 앱에 있는 모든 렌더링 프로퍼티 API를 새 훅 API로 모두 리팩토링하고 싶지 않아요! 라고 말할 수 있습니다.

두려워하지 마세요! 다음 코드를 보기 바랍니다.

```js
const Toggle = ({children, ...props}) => children(useToggle(props))
```

여기 렌더링 프로퍼티 컴포넌트가 있습니다. 그냥 간단하게 예전 코드를 사용하면서도 시간이 흐른 후에 고쳐도 됩니다. 사실, 이 방식이 제가 커스텀 훅을 만든 후에 테스트할 때 추천하는 방법입니다.

여기에는 좀 더 내용이 있습니다. (마치 렌더링 프로퍼티 패턴에서 리액트 훅으로 바꾼 방식과 비슷합니다.) 더 설명하지 않고 이 글을 읽고 있는 당신이 발견하도록 조금 남겨두려고 합니다. 무엇인지 조금 더 생각해본 후에 [제가 작성한 과정](https://www.youtube.com/watch?v=_eVyLVFlSQk&list=PLV5CVI1eNcJgCrPH_e6d57KRUTiDZgs0u)을 확인해보세요. 훅을 사용하면서 테스팅하는데 약간 달라지는 부분을 확인해보기 바랍니다. (자바스크립트 클로저 만세!)

## 렌더링 프로퍼티 패턴을 적용할 만한 경우

자, 이제 컴포넌트에 훅을 사용해서 리팩토링을 하면서도 여전히 렌더링 프로퍼티 기반 API로 리액트 컴포넌트를 공유할 수 있습니다. (관심 있다면 [하이드라 패턴](https://americanexpress.io/hydra/)을 사용할 수도 있습니다.) 하지만 미래를 상상해봅시다. 렌더링 프로퍼티를 더이상 로직 재사용에 사용하지 않고 모두가 훅을 사용하고 있는 시대 말이죠. 그렇다면 계속 렌더링 프로퍼티 API를 작성하거나 사용해야 하는 이유가 있을까요?

그렇습니다! 보세요! 여기에 [downshift에서 react-virtualized와 함께 사용한 예시](https://github.com/paypal/downshift/blob/9b3467dce2be59832765277570857de5679d8392/stories/examples/windowing-with-react-virtualized.js)입니다. 연관된 부분을 아래서 확인해보세요.

```jsx
<List
  // ... some props
  rowRenderer={({key, index, style}) => (
    <div
    // ... some props
    />
  )}
/>
```

여기 `rowRenderer` 프로퍼티를 확인해보세요. 이 코드가 무엇인지 아세요? 바로 렌더링 프로퍼티입니다. 뭐라고요?! 🙀 바로 제어 역전을 실현한 렌더링 프로퍼티가 여기에 있습니다. 이 프로퍼티는 `react-virtualized`에서 목록에서 각 행을 렌더링하는 데 있어서 제어를 사용자에게 넘겨주기 위해 존재하는 코드입니다. 만약 `react-virtualized`를 훅으로 다시 작성한다고 하면 _아마도_ `rowRenderer`는 `useVirtualized` 훅의 인자로 받을 수 있을 겁니다. 하지만 이런 경우라면 렌더링 프로퍼티 패턴보다 이득이 있다고 말하기는 조금 어렵습니다. 그러니 이런 사용 예시에서는 이 패턴(과 이 방식의 제어 역전)을 사용하는 방법이 더 적합하다고 봅니다.

## 결론

이 내용이 흥미 있고 도움이 되었기를 바랍니다. 리액트 훅은 아직 알파 단계이며 변경 예정에 있습니다. (역자 주: 현재 16.8.0에 포함되어 배포되었습니다.) 이 기능은 철저히 선택 기능이며 리액트의 다른 API에 문제를 만들지 않습니다. 제가 보기엔 정말 좋은 기능이라고 생각합니다. 앱을 다시 작성하지 마세요! 대신 리팩토링을 하기 바랍니다. (훅이 안정 단계에 들어오면 말입니다.)
