---
title: "리액트 훅(hook): 제 테스트는 어떻게 되나요?"
author: haruair
type: post
date: "2019-03-21T16:52:00"
lang: ko
slug: react-hooks-whats-going-to-happen-to-my-tests
headline:
  - 새로 나온 기능 훅(hook)에 대비해서 테스트는 어떻게 준비할지 알아봅니다
categories:
  - 개발 이야기
  - 번역
tags:
  - react
  - js
  - testing
  - react hooks
---

<div class="translation-note">

이 포스트는 [Kent C. Dodds](https://twitter.com/kentcdodds)의 [React Hooks: What's going to happen to my tests?](https://kentcdodds.com/blog/react-hooks-whats-going-to-happen-to-my-tests)를 번역한 글입니다.

</div>

새로 나오는 리액트의 훅(hook) 기능에 대해 가장 많이 받는 질문 중 하나가 바로 테스팅입니다. 만약 지금 테스트가 다음과 같은 모양이라면 그 걱정을 충분히 이해할 수 있습니다.

```jsx
// 이전 블로그 포스트에서 빌린 예제
// https://kcd.im/implementation-details
test('setOpenIndex sets the open index state properly', () => {
  const wrapper = mount(<Accordion items={[]} />)
  expect(wrapper.state('openIndex')).toBe(0)
  wrapper.instance().setOpenIndex(1)
  expect(wrapper.state('openIndex')).toBe(1)
})
```

이 enzyme 테스트는 `Accordion`이 클래스 컴포넌트며 `instance`가 존재하는 경우에만 동작합니다. 하지만 함수 컴포넌트라면 "인스턴스"라는 개념이 존재하지 않습니다. 그러므로 상태와 생명주기가 있는 클래스 컴포넌트에서 훅을 사용한 컴포넌트로 리팩토링했을 때에는 이 테스트의 `.instance()`나 `.state()`가 동작하지 않을 겁니다.

이제 `Accordion` 컴포넌트를 함수 컴포넌트로 리팩토링 한다면 이 테스트는 고장 나게 됩니다. 그럼 테스트를 던지거나 다시 작성하지 않고 훅을 사용해서 코드를 리팩토링할 방법은 없을까요? 위 테스트처럼 컴포넌트의 인스턴스를 참조하는 enzyme API의 사용을 피하는 일에서부터 시작할 수 있습니다. 이 내용은 [제 "구현 상세(implementation details)" 포스트에서](https://kcd.im/imp-deets) 확인할 수 있습니다.

이제 클래스 컴포넌트의 간단한 예제를 확인해봅시다. 제가 가장 좋아하는 `<Counter />` 컴포넌트 예제는 다음과 같습니다.

```jsx
// counter.js
import React from 'react'

class Counter extends React.Component {
  state = {count: 0}
  increment = () => this.setState(({count}) => ({count: count + 1}))
  render() {
    return <button onClick={this.increment}>{this.state.count}</button>
  }
}

export default Counter
```

이제 이 컴포넌트를 테스트하는데 어떤 방식으로 작성하면 훅이든 클래스 컴포넌트든 상관없이 테스트할 수 있을까요?

```jsx
// __tests__/counter.js
import React from 'react'
import 'react-testing-library/cleanup-after-each'
import {render, fireEvent} from 'react-testing-library'
import Counter from '../counter.js'

test('counter increments the count', () => {
  const {container} = render(<Counter />)
  const button = container.firstChild
  expect(button.textContent).toBe('0')
  fireEvent.click(button)
  expect(button.textContent).toBe('1')
})
```

이 테스트는 통과할 겁니다. 이제 동일한 컴포넌트를 훅으로 작성해보겠습니다.

```jsx
// counter.js
import React from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  const incrementCount = () => setCount(c => c + 1)
  return <button onClick={incrementCount}>{count}</button>
}

export default Counter
```

이 테스트는 구현 상세를 피해서 테스트하고 있기 때문에 훅으로 만든 테스트도 문제 없습니다. 정말 멋지지 않나요? :)

## `useEffect`는 `componentDidMount` + `componentDidUpdate` + `componentWillUnmount`가 아닙니다.

`useEffect` 훅을 사용하기 전에 고려해야 하는 점이 있습니다. 이 훅은 조금 특별하고 다르고 멋지기 때문인데요. 클래스 컴포넌트에서 훅으로 리팩토링할 때에 `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`를 하나 이상의 `useEffect` 콜백 함수로 바꾸게 될 겁니다. (컴포넌트의 수명주기에 포함된 컴포넌트의 관심사에 따라 다릅니다.) 하지만 이 코드는 엄밀히 말해서 리팩토링이 _아닙니다_. "리팩토링"이 무엇인지 빠르게 살펴보도록 하겠습니다.

코드를 리팩토링할 때는 사용자가 볼 수 있는 변화를 만들지 않고 내부 구현을 바꿔야 합니다. [다음은 위키피디아가 말하는 "코드 리팩토링"입니다.](https://en.wikipedia.org/wiki/Code_refactoring)

> **코드 리팩토링**은 존재하는 컴퓨터 코드를 구조를 조정하는 과정으로 외부 동작을 바꾸지 않고 [팩토링](https://en.wikipedia.org/wiki/Decomposition_%28computer_science%29) 즉, 분해(decomposition)를 수행하는 일을 의미합니다.

이제 다음 코드에서 개념을 살펴봅니다.

```js
const sum = (a, b) => a + b
```

이제 이 함수를 리팩토링해 보도록 하겠습니다.

```js
const sum = (a, b) => b + a
```

앞서 함수와 동일하게 동작하지만 구현은 약간 다릅니다. 근본적으로 이 과정이 "리팩토링"입니다. 다음은 리팩토링이 _아닌_ 경우입니다.

```js
const sum = (...args) => args.reduce((s, n) => s + n, 0)
```

멋진 코드입니다. `sum`은 더 멋지게 동작하지만, 엄밀히 따지면 리팩토링이 _아니라_ 개선입니다. 비교해봅시다.

| 호출 | 이전 결과 | 이후 결과 |
|-|-|-|
| sum() | `NaN` | 0 |
| sum(1) | `NaN` | 1 |
| sum(1, 2) | 3 | 3 |
| sum(1, 2, 3) | 3 | 6 |

왜 이 변경은 리팩토링이 아닌가요? 그 이유는 "외부 동작을 변경"했기 때문입니다. 새 코드는 이전 코드보다 바람직하지만 기존 동작을 바꿨습니다.

그러면 왜 이 내용이 `useEffect`를 사용하는 것과 어떤 관련이 있을까요? 앞서 본 카운터 클래스 컴포넌트에서 새로운 기능을 추가한 예제를 살펴보도록 하겠습니다.

```jsx
class Counter extends React.Component {
  state = {
    count: Number(window.localStorage.getItem('count') || 0),
  }
  increment = () => this.setState(({count}) => ({count: count + 1}))
  componentDidMount() {
    window.localStorage.setItem('count', this.state.count)
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.count !== this.state.count) {
      window.localStorage.setItem('count', this.state.count)
    }
  }
  render() {
    return <button onClick={this.increment}>{this.state.count}</button>
  }
}
```

이 코드에서는 `count`의 값을 `componentDidMount`와 `componentDidUpdate`를 사용해서 `localStorage`에 저장합니다. 구현 상세에 영향받지 않는 테스트는 다음과 같습니다.

```jsx
// __tests__/counter.js
import React from 'react'
import 'react-testing-library/cleanup-after-each'
import {render, fireEvent, cleanup} from 'react-testing-library'
import Counter from '../counter.js'

afterEach(() => {
  window.localStorage.removeItem('count')
})

test('counter increments the count', () => {
  const {container} = render(<Counter />)
  const button = container.firstChild
  expect(button.textContent).toBe('0')
  fireEvent.click(button)
  expect(button.textContent).toBe('1')
})

test('reads and updates localStorage', () => {
  window.localStorage.setItem('count', 3)
  const {container, rerender} = render(<Counter />)
  const button = container.firstChild
  expect(button.textContent).toBe('3')
  fireEvent.click(button)
  expect(button.textContent).toBe('4')
  expect(window.localStorage.getItem('count')).toBe('4')
})
```

테스트가 통과했습니다! 이제 이 컴포넌트를 "리팩토링"하는데 훅을 사용해보겠습니다.

```jsx
import React, {useState, useEffect} from 'react'

function Counter() {
  const [count, setCount] = useState(() =>
    Number(window.localStorage.getItem('count') || 0),
  )
  const incrementCount = () => setCount(c => c + 1)
  useEffect(() => {
    window.localStorage.setItem('count', count)
  }, [count])
  return <button onClick={incrementCount}>{count}</button>
}

export default Counter
```

좋습니다. 사용자의 관점에서 보면 이 컴포넌트는 이전과 _똑같이_ 동작할 겁니다. 하지만 이 변경은 이전의 동작과는 다릅니다. 여기서 **`useEffect` 콜백은 이후에 구동하도록 _예정_ 되었습니다.** 이전 코드에서는 컴포넌트가 렌더링 된 후에 값을 `localStorage`에 동기적으로 저장했습니다. 새 코드에서는 렌더링 된 후에 호출되도록 변경했습니다. 왜 그럴까요? [리액트 훅 문서에 설명된 부분을 확인해봅니다.](https://reactjs.org/docs/hooks-effect.html#detailed-explanation)

> `componentDidMount`나 `componentDidUpdate`와 다르게 `useEffect`로 예정한 효과는 브라우저가 화면을 업데이트하는 것을 막지 않습니다. 앱이 더 높은 응답성을 제공할 수 있도록 이렇게 동작합니다. 대부분의 효과는 동기적으로 구동될 필요가 없습니다. 동기적으로 동작하는 경우는 레이아웃을 측정해야 한다거나 하는 등 특수한 경우에 해당합니다. 이런 코드는 [`useLayoutEffect`](https://reactjs.org/docs/hooks-reference.html#uselayouteffect)에 넣을 수 있으며 `useEffect`와 동일하게 동작하는 API입니다.

이제 `useEffect`를 사용해서 더 나은 성능을 얻을 수 있게 되었습니다! 멋지지 않나요! 향상된 컴포넌트를 작성한 것 뿐만 아니라 더 가볍게 구동되는 컴포넌트 코드를 작성했습니다.

하지만 이 과정은 리팩토링이 _아닙니다_. 실제로는 컴포넌트의 동작을 변경했기 때문입니다. _최종_ 사용자의 입장에서는 이 변화를 눈치채기 힘듭니다. 테스트를 작성할 때 구현 상세를 피하려고 노력했다면 이런 변화 또한 테스트에서 관측되지 않을겁니다.

다른 두 컴포넌트를 문제 없이 테스트가 가능한 이유는 [`react-dom/test-utils`](https://reactjs.org/docs/test-utils.html)에서 제공하는 새 [`act`](https://reactjs.org/docs/test-utils.html#act) 유틸리티 덕분입니다. `react-testing-library`는 이 유틸리티와 통합되어 있습니다. 그 덕분에 위 테스트가 문제 없이 통과할 수 있는 것입니다. 그래서 구현 상세에 의존하지 않는 테스트를 계속 작성할 수 있으며 소프트웨어를 기존에 개발하던 방식과 큰 차이 없이 개발을 계속 할 수 있게 되었습니다.

### 렌더링 프로퍼티 컴포넌트는 어떻게 테스트하죠?

이 부분이 제가 좋아하는 부분입니다. 프로퍼티를 렌더링하는 간단한 카운터 컴포넌트를 확인합니다.

```js
class Counter extends React.Component {
  state = {count: 0}
  increment = () => this.setState(({count}) => ({count: count + 1}))
  render() {
    return this.props.children({
      count: this.state.count,
      increment: this.increment,
    })
  }
}
// 사용방법:
// <Counter>
//   {({ count, increment }) => <button onClick={increment}>{count}</button>}
// </Counter>
```

```jsx
// __tests__/counter.js
import React from 'react'
import 'react-testing-library/cleanup-after-each'
import {render, fireEvent} from 'react-testing-library'
import Counter from '../counter.js'

function renderCounter(props) {
  let utils
  const children = jest.fn(stateAndHelpers => {
    utils = stateAndHelpers
    return null
  })
  return {
    ...render(<Counter {...props}>{children}</Counter>),
    children,
    // 이 부분으로 컴포넌트 내부의 증감과 횟수에 접근할 수 있는 방법을 제공합니다
    ...utils,
  }
}

test('counter increments the count', () => {
  const {children, increment} = renderCounter()
  expect(children).toHaveBeenCalledWith(expect.objectContaining({count: 0}))
  increment()
  expect(children).toHaveBeenCalledWith(expect.objectContaining({count: 1}))
})
```

이제 이 컴포넌트를 훅을 사용해서 리팩토링 합니다.

```js
function Counter(props) {
  const [count, setCount] = useState(0)
  const increment = () => setCount(currentCount => currentCount + 1)
  return props.children({
    count: count,
    increment,
  })
}
```

좋습니다. 앞서 작성한 테스트를 문제 없이 통과합니다. 하지만 [리액트 훅: 렌더링 프로퍼티는 어떻게 되나요?](https://blog.kentcdodds.com/8ade1f00f159) (역자 주: [번역](https://edykim.com/ko/post/react-hooks-whats-going-to-happen-to-render-props/))에서 배운 것처럼 커스텀 훅(custom hook)은 리액트에서 코드 공유에 더 나은 자료 형식(primitive)입니다. 위 코드를 커스텀 훅으로 다시 작성해보도록 하겠습니다.

```js
function useCounter() {
  const [count, setCount] = useState(0)
  const increment = () => setCount(currentCount => currentCount + 1)
  return {count, increment}
}

export default useCounter

// 사용방법:
// function Counter() {
//   const {count, increment} = useCounter()
//   return <button onClick={increment}>{count}</button>
// }
```

멋집니다... 하지만 이제 `useCounter`는 어떻게 테스트 하나요? 새 `useCounter` 훅을 사용한다고 코드 전체를 갱신할 수는 없습니다. `<Counter />`라는 렌더링 프로퍼티 기반 컴포넌트가 수 백 군데에 위치하면 어떻게 하죠? 정말 최악일 겁니다.

제가 도와드리죠. 다음처럼 해결하세요.

```js
function useCounter() {
  const [count, setCount] = useState(0)
  const increment = () => setCount(currentCount => currentCount + 1)
  return {count, increment}
}

const Counter = ({children, ...props}) => children(useCounter(props))

export default Counter
export {useCounter}
```

이제 새로 작성한 `<Counter />` 렌더링 프로퍼티 기반 컴포넌트는 기존에 사용하던 컴포넌트와 _완전히_ 동일한 형태입니다. 이 방법이 진정한 의미의 리팩토링이죠. 또한 이제 누구든지 `useCounter` 커스텀 훅을 사용해서 코드를 개선하는 것도 가능하게 되었습니다.

더 대단한 점은 앞서 작성한 테스트가 여전히 통과한다는 점입니다. 멋지지 않습니까?

이제 모든 코드를 새로운 훅을 사용해서 갱신하고 나면 더이상 Counter 함수는 필요가 없어지겠죠? 물론 이 함수를 제거할 수도 있지만 그대로 `__tests__` 폴더로 옮겨도 좋을 겁니다. _이 방법이_ 바로 커스텀 훅을 테스트하는 방법이기 때문입니다. 저는 커스텀 훅을 사용해서 렌더링 프로퍼티 기반 컴포넌트를 만드는 것을 선호하는데 실제로 렌더링 된 결과를 함수 호출 결과와 비교하는 데 유용하기 때문입니다.

흥미로운 기법이죠? 저의 [새로운 egghead.io 코스](https://kcd.im/refactor-react)에서도 확인할 수 있습니다.

## 그럼 훅 라이브러리는 어떻게 하죠?

일반적인 훅이나 오픈소스 훅을 작성한다면 특정 컴포넌트를 생각하지 않고서 테스트를 작성해야 합니다. 그런 경우에는 [`react-hooks-testing-library`](https://www.npmjs.com/package/react-hooks-testing-library)를 사용하길 권합니다.

## 결론

코드를 리팩토링하기 전에 할 수 있는 가장 좋은 일은 좋은 테스트 슈트(suite)와 타입 정의를 준비해서 우연히 무언가를 고장 내더라도 그 실수를 바로 알아차릴 수 있도록 하는 일입니다. 하지만 **리팩토링을 할 때 테스트 슈트를 집어 던진다면 아무런 의미 없는 일이 되고 맙니다.** 제가 드릴 수 있는 조언은 테스트 내에서 [구현 상세를 피하라](https://kcd.im/imp-deets)입니다. 지금 클래스 컴포넌트와도 동작하고 미래에 훅으로 만든 함수가 오더라도 동작하는 테스트를 작성하세요.
