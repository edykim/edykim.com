---
title: React에서 Redux 전에 배워야 할 8가지
author: haruair
type: post
date: 2018-10-18T06:52:00-07:00
lang: ko
slug: learn-react-before-using-redux
headline:
  - React에 Redux (또는 MobX)를 사용하기 전에 알아야 할 사실들, 번역
categories:
  - 개발 이야기
  - 번역
tags:
  - react
  - js
draft: true
---

이 글은 [Robin Wieruch](https://twitter.com/rwieruch)의 [8 things to learn in React before using Redux](https://www.robinwieruch.de/learn-react-before-using-redux/) 번역입니다.

---

# React에서 Redux 전에 배워야 할 8가지

상태 관리(State management)는 어렵습니다. React같은 뷰 라이브러리는 지역 컴포넌트 상태를 관리하는 일이 가능합니다. 하지만 이 상태는 특정 시점에서 확장해야 하는 일이 생깁니다. 리엑트는 단순히 뷰 계층 라이브러리 입니다. 언젠가는 Redux와 같이 더 수준 높은 상태 관리 솔루션으로 넘어가는 결정을 하게 될 겁니다. 하지만 이 글에서는 Redux 열차에 올라타기 전에 React에서 알아야 하는 부분에 대해서 지적하고 싶습니다.

Often people learn React and Redux altogether. But it has drawbacks:

사람들은 간혹 React와 Redux를 함께 배웁니다. 하지만 거기에 문제점이 있습니다.

* people never run into the problems of scaling state management with local state (this.state) only
  * thus people don't understand the need of a state management library like Redux
  * thus people complain that it adds too much boilerplate
* people never learn to manage local state in React
  * thus people will manage (and clutter) **all** of their state in a state container provided by Redux
  * thus people never use the local state management

* 지역 상태 (`this.state`)만 사용하는 경우에 왜 상태 관리에 확장 문제가 발생하는지 겪어보지 못합니다
  * 그래서 왜 Redux 같은 상태 관리 라이브러리가 필요한지 이해하지 못합니다
  * 그래서 너무 많은 보일러플레이트에 대해 불평합니다
* React에서 지역 상태를 관리하는 방법을 배우지 못합니다
  * 그래서 **모든** 상태를 Redux에서 제공하는 상태 컨테이너에 담아두고 관리하려고 합니다
  * 그래서 지역 상태 관리를 전혀 사용하지 않게 됩니다

Because of these drawbacks, you will often get the advice to learn React first and opt-in Redux to your tech stack in a later point in time. But only opt-in Redux if you run into issues scaling your state management. These scaling issues [only apply for larger applications](https://www.robinwieruch.de/react-global-state-without-redux). Often you will {{% a_blank "not need a state management library" "https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367" %}} such as Redux on top. The book [The Road to learn React](https://www.robinwieruch.de/the-road-to-learn-react/) demonstrates how an application can be build in plain React without external dependencies like Redux.

이런 문제점으로 인해서 React를 먼저 배우고 나중에 필요하다고 느낄 때 Redux를 배우도록 조언합니다. 확장 문제는 [대형 애플리케이션에서만 나타납니다](https://www.robinwieruch.de/react-global-state-without-redux). 가끔 Redux를 사용하고 있으면서도 [상태 관리 라이브러리가 필요하지 않은 경우](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)가 있습니다. 책 [The Road to learn React](https://www.robinwieruch.de/the-road-to-learn-react/)에서는 Redux와 같은 외부 의존성 없이 있는 그대로의 React로 애플리케이션을 만드는 방법을 설명합니다.

However, now you decided to jump on the Redux train. So here comes my list of what you should know about React before using Redux.

하지만 당신은 지금 Redux 열차에 올라타기로 결정했습니다. 그래서 이 글에서는 Redux를 쓰기 전에 React에서 알아야 할 내용을 살펴봅니다.

## React에서의 지역 상태는 자연스럽다

The already mentioned most important advice is to learn React first. Thus you cannot avoid to breathe life into your components by using local state with `this.setState()` and `this.state`. You should feel comfortable using it.

이미 언급했지만 가장 중요한 조언은 React를 먼저 학습하라는 점입니다. 컴포넌트에 지역 상태 즉, `this.setState()`와 `this.state`를 사용해서 생명을 불어 넣는 일을 피할 수는 없습니다. 이 방식에 익숙해져야 합니다.

```js
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
  }

  render() {
    return (
      <div>
        Counter: {this.state.counter}

        <button
          type="button"
          onClick={() => this.setState({ counter: this.state.counter + 1 })}>
          Click!
        </button>
      </div>
    );
  }
}
```

A React component has an initial state defined in the constructor. Afterward, you can update it with its `this.setState()` method. The updating of the state object is a shallow merge. Thus you can update the local state object partially yet it will keep other properties in the state object intact. Once the state got updated, the component re-renders. In the previous case, it will display the updated value: `this.state.counter`. Basically that's one closed loop in React's unidirectional data flow.

React 컴포넌트는 초기 상태를 생성자(constructor)에서 정의하고 있습니다. 그런 후에 `this.setState()` 메소드를 사용해서 갱신할 수 있습니다. 상태 객체의 갱신은 얕은 병합(shallow merge)으로 수행됩니다. 그러므로 지역 상태 객체를 부분적으로 갱신하고도 상태 객체의 다른 프로퍼티는 손대지 않고 그대로 유지할 수 있습니다. 상태가 갱신된 후에는 컴포넌트가 다시 렌더링을 수행합니다. 앞에서 예로 든 코드에서는 `this.state.counter`의 갱신된 값을 보여줄 것입니다. 이 예제에서는 React의 단방향 데이터 흐름을 사용해 하나의 닫힌 루프(loop)를 작성했습니다.

## React 함수형 지역 상태

`this.setState()` 메소드는 지역 상태를 비동기적으로 갱신합니다. 그러므로 언제 상태가 갱신되는지에 대해 의존해서는 안됩니다. 상태 갱신은 결과적으로 나타납니다. 대부분의 경우에는 이런 방식이 별 문제 없습니다.

하지만 컴포넌트의 다음 상태를 위해 연산을 하는데 현재 지역 상태에 의존한다고 가정해봅시다. 앞서 작성했던 예제에서는 다음처럼 작성했습니다.

```js
this.setState({ counter: this.state.counter + 1 });
```

The local state (this.state.counter) that is used for the computation is only a snapshot in time. Thus when you update your state with `this.setState()` but the local state changes before the asynchronous execution kicks in, you would operate with a stale state. That can be difficult to grasp the first time being confronted with it. That's why a code snippet says more than a thousand words:

지역 상태(`this.state.counter`)는 연산에서 바로 그 시점의 상태로 사용했습니다. 그러므로 `this.setState()`를 사용해서 상태를 갱신하긴 했지만 지역 상태는 비동기 실행이 수행되기 전에 신선하지 않은 상태값을 사용해 연산하게 됩니다. 이런 점은 처음 보고 나서는 바로 파악하기 어렵습니다. 천 마디 말 보다 다음 코드를 보는게 더 빠를 것 같습니다.

```js
this.setState({ counter: this.state.counter + 1 }); // this.state: { counter: 0 }
this.setState({ counter: this.state.counter + 1 }); // this.state: { counter: 0 }
this.setState({ counter: this.state.counter + 1 }); // this.state: { counter: 0 }

// 예상한 상태: { counter: 3 }
// 실제 갱신된 상태: { counter: 1 }
```

이 코드에서 확인할 수 있는 것처럼 지역 상태를 갱신할 때 현재 상태에 의존해서는 안됩니다. 이런 접근 방식은 버그를 만듭니다. 그래서 이런 상황에서는 다음과 같은 방식으로 지역 상태를 갱신합니다.

The `this.setState()` function takes as alternative a function instead of an object. The function that it takes has the local state in its function signature at the time when `this.setState()` executes asynchronously. It is a callback that executes with the correct state at this point in time and thus can be relied upon.

`this.setState()`에는 객체 대신 함수도 사용할 수 있습니다. 함수는 비동기적으로 `this.setState()`가 실행될 때, 함수 시그니처에 지역 상태를 전달합니다. 그래서 이 함수는 콜백 함수로 정확한 시점에 올바른 상태를 갖고 실행되기 때문에 문제 없이 사용할 수 있게 됩니다.

```js
this.setState(previousState => ({ counter: previousState.counter + 1 }));
```

이 방법으로 `this.setState()`를 여전히 이용하면서도 객체 대신 함수를 사용해서 이전 상태를 활용할 수 있습니다.

추가적으로 프로퍼티(props)에 의존적인 갱신이 필요한 경우에도 이 접근 방식을 따라야 합니다. 비동기적 실행이 수행되기 이전에 부모 컴포넌트에서 받은 프로퍼티가 변경되어서 값이 이전 정보가 되는 경우가 있기 때문입니다. 그래서 `this.setState()`의 두 번째 인자로 프로퍼티가 전달됩니다.

```js
this.setState((prevState, props) => ...);
```

이제 올바른 상태와 프로퍼티를 사용해서 상태를 갱신할 수 있게 됩니다.

```js
this.setState((prevState, props) => ({ counter: prevState.counter + props.addition }));
```

Another benefit is that you can test the state updating in isolation when using a function. Simply extract the callback function that is used in `this.setState(fn)` to be standalone and export it to make it testable. It should be a pure function where you can test simply the output depending on the input.

객체 대신에 함수를 사용하면서 얻을 수 있는 또 다른 장점은 바로 상태를 갱신하는 방법을 격리된 상태에서 테스트 해볼 수 있다는 점입니다. 단순히 `this.setState(fn)`을 사용하는 함수를 추출한 다음에 독립적으로 둔 다음에 테스트가 가능하도록 작성할 수 있습니다. 이 함수는 입력으로 간단히 출력을 확인할 수 있는 순수 함수여야 합니다.


## React의 상태와 프로퍼티

State is managed in a component. It can be passed down as props to other components. These components can consume the props or pass it even further down to their child components. In addition, child components can receive callback functions in the props from their parent components. These functions can be used to alter the local state of parent components. Basically props flow down the component tree, state is managed by a component alone and functions can bubble up to alter the state in a component that manages state. The updated state can be passed down as props again.

상태는 컴포넌트 안에서 관리됩니다. 이 상태는 다른 컴포넌트에 프로퍼티로 내려줄 수 있습니다. 이 컴포넌트는 프로퍼티를 사용하거나 더 깊히 자식 컴포넌트로 전달할 수 있습니다. 덧붙여 자식 컴포넌트는 부모 컴포넌트로부터 콜백 함수를 전달 받을 수 있습니다. 이렇게 전달 받은 함수를 사용하면 부모 컴포넌트의 지역 상태를 변경하는 일도 가능합니다. 기본적으로 프로퍼티는 컴포넌트 트리를 타고 내려갑니다. 상태는 하나의 컴포넌트에서 관리합니다. 하위 컴포넌트에서는 프로퍼티로 전달한 함수를 사용해서 상태를 관리하는 컴포넌트까지 거슬러 올라와 상태를 변경할 수 있습니다. 갱신된 상태는 프로퍼티로 다시 하위 컴포넌트로 전달됩니다.

A component can manage a whole lot of state, pass it down as props to its child components and pass a couple of functions along the way to enable child components to alter the state in the parent component again.

컴포넌트는 전체적인 상태를 관리할 수 있으며 자식 컴포넌트에게 프로퍼티를 전달할 수 있습니다. 프로퍼티에 함수를 전달하는 방법으로 자식 컴폰넌트가 부모 컴포넌트의 상태를 변경할 수 있게 합니다.

However, the child components are not aware of the origin nor the functionality of the functions received in the props. These functions can update the state in a parent component yet could do something else. The child components only execute them. The same applies for the props. A component doesn't know if the received props are props, state or other derived properties from the parent component. The child component just consumes them.

하지만 자식 컴포넌트는 전달된 함수의 출처가 어디인지, 프로퍼티로 받은 함수가 어떤 동작을 하는지 알지 못합니다. 이 함수는 부모 컴포넌트의 상태를 변경할 수도 있지만 다른 일을 할 가능성도 있습니다. 자식 컴포넌트는 단순히 실행하는 역할을 합니다. 프로퍼티도 동일합니다. 컴포넌트는 받은 프로퍼티가 프로퍼티인지, 상태인지, 또는 부모 컴포넌트에서 파생된 프로퍼티인지 알 방법이 없습니다. 자식 컴포넌트는 그저 사용할 뿐입니다.

It is important that you grasp the idea of props and state. All the properties that are used in your component tree can be divided into state and props ( and derived properties from state/props). Everything that needs to stay interactive goes into the state. Everything else is just passed down as props.

프로퍼티와 상태의 개념을 이해하는 일은 중요합니다. 컴포넌트 트리에서 사용하는 모든 속성은 프로퍼티와 상태로 (그리고 프로퍼티와 상태에서 파생된 속성으로) 나눌 수 있습니다. 무엇이든 상호작용이 필요한 경우에는 상태에 보관되어야 합니다. 그 외 나머지는 모두 프로퍼티 형식으로 전달합니다.

Before relying on a sophisticated state management library, you should have passed your props a couple of components down the component tree. You should know the feeling of *"there needs to be a better way to do this"* when you only pass props down a handful of components without using these props in the components between but only in the very last child component.

수준 높은 상태 관리 라이브러리를 사용하기 전에 컴포넌트 트리를 따라 프로퍼티를 보내본 적이 있어야 합니다. 가장 끝에 있는 자식 컴포넌트에서 특정 값을 사용하려고 중간 컴포넌트에서는 전혀 쓰지 않는, 수많은 프로퍼티를 전달하는 코드를 작성하면서 *"분명 이보다 더 나은 방법이 있을 거야"* 생각해본 적이 었어야 합니다.

## React 상태 옮기기

Do you lift your local state layer already? That's the most important strategy to scale your local state management in plain React. The state layer can be lifted up and down.

이미 지역 상태 계층(local state layer)을 옮겼나요? 이 방식은 일반 React에서 지역 상태 관리를 확장하는데 가장 중요한 전략입니다. 상태 계층은 올릴 수도, 내릴 수도 있습니다.

You can **lift your local state down** to make it less accessible for other components. Imagine you have a component A as parent component of components B and C. B and C are child components of A and they are siblings. Component A is the only component that manages local state but passes it down to its child components as props. In addition, it passes down the necessary functions to enable B and C to alter its own state in A.

다른 컴포넌트에서의 접근을 줄이기 위해 **지역 상태 계층을 하위로 내릴 수** 있습니다. 컴포넌트 A가 자식 컴포넌트로 B와 C를 갖고 있다고 상상해봅시다. B와 C는 A의 자식 컴포넌트로 동등합니다. 컴포넌트 A는 유일하게 지역 상태를 관리하며 자식 컴포넌트에 프로퍼티를 전달합니다. 덧붙여 B와 C에서 A의 상태를 변경할 수 있는 함수도 전달합니다.

```js
          +----------------+
          |                |
          |       A        |
          |                |
          |    Stateful    |
          |                |
          +--------+-------+
                   |
         +---------+-----------+
         |                     |
         |                     |
+--------+-------+    +--------+-------+
|                |    |                |
|                |    |                |
|       B        |    |        C       |
|                |    |                |
|                |    |                |
+----------------+    +----------------+
```

Now, half of the local state of component A is consumed as props by component C but not by component B. In addition, C receives functions in its props to alter the state in A that is only consumed in C. As you can see, component A manages the state on behalf of component C. In most cases, it is just fine to have one component that manages all the state of its child components. But imagine in addition that between component A and C are several other components. All the props that are needed from component A need to traverse down the component tree to reach component C eventually. Still component A manages the state on behalf of component C.

이제 컴포넌트 A의 지역 상태 절반은 컴포넌트 C에서 프로퍼티를 통해 쓰고 있으며 컴포넌트 B에서는 전혀 사용하고 있지 않습니다. 게다가 C는 A 컴포넌트에서 C에서만 사용하는 상태만 제어할 수 있는 함수를 프로퍼티로 전달했습니다. 여기서 볼 수 있는 것처럼 컴포넌트 A는 컴포넌트 C를 대신해서 상태를 관리하고 있습니다. 대부분의 경우에는 한 컴포넌트가 자식 컴포넌트의 모든 상태를 관리하는 일에 큰 문제가 없습니다. 하지만 컴포넌트 A와 컴포넌트 C 사이에 다른 컴포넌트가 추가된다고 생각해봅시다. 컴포넌트 A에서 컴포넌트 C에 전달해야 하는 프로퍼티를 컴포넌트 트리에 따라 전달합니다. 컴포넌트 A는 여전히 컴포넌트 C의 상태를 관리하고 있습니다.

```js
          +----------------+
          |                |
          |       A        |
          |                |
          |                |
          |    Stateful    |
          +--------+-------+
                   |
         +---------+-----------+
         |                     |
         |                     |
+--------+-------+    +--------+-------+
|                |    |                |
|                |    |        +       |
|       B        |    |        |Props  |
|                |    |        v       |
|                |    |                |
+----------------+    +--------+-------+
                               |
                      +--------+-------+
                      |                |
                      |        +       |
                      |        |Props  |
                      |        v       |
                      |                |
                      +--------+-------+
                               |
                      +--------+-------+
                      |                |
                      |                |
                      |        C       |
                      |                |
                      |                |
                      +----------------+
```

That's the perfect use case to lift React state down. When component A only manages the state on behalf of component C, this slice of state could be solely managed in component C. It could be autonomous in this respective. When you lift the local state management down to component C, all the necessary props don't need to traverse down the whole component tree.

이런 경우가 React의 상태를 아래로 내려야 하는 완벽한 경우입니다. 컴포넌트 A는 컴포넌트 C의 상태를 관리하고 있지만 이 상태 일부는 컴포넌트 C가 스스로 관리해도 문제가 없습니다. 즉, 각각의 상태에 대해 각 컴포넌트가 자율적으로 움직일 수 있습니다. 지역 상태 관리를 컴포넌트 C로 옮기면 더이상 컴포넌트 트리를 따라 프로퍼티를 전달하지 않아도 됩니다.

```js
          +----------------+
          |                |
          |       A        |
          |                |
          |                |
          |    Stateful    |
          +--------+-------+
                   |
         +---------+-----------+
         |                     |
         |                     |
+--------+-------+    +--------+-------+
|                |    |                |
|                |    |                |
|       B        |    |                |
|                |    |                |
|                |    |                |
+----------------+    +--------+-------+
                               |
                      +--------+-------+
                      |                |
                      |                |
                      |                |
                      |                |
                      |                |
                      +--------+-------+
                               |
                      +--------+-------+
                      |                |
                      |                |
                      |        C       |
                      |                |
                      |     Stateful   |
                      +----------------+
```

In addition the state in component A gets decluttered. It only manages the necessary state of its own and of its closest child components.

컴포넌트 A의 상태도 덩달아 깔끔해졌습니다. 이 컴포넌트는 필요에 따라 자신의 상태와 가장 가까운 자식 컴포넌트의 상태만 관리하게 됩니다.

The state lifting in React can go the other way too: **lifting state up**. Imagine you have again component A as parent component and component B and C as its child components. It doesn't matter how many components are between A and B and A and C. However, this time C already manages its own state.

React에서 상태 옮기기는 다른 방향, 즉 **상태 위로 옮기기**도 가능합니다. 부모 컴포넌트인 컴포넌트 A와 자식 컴포넌트인 컴포넌트 B, C로 다시 돌아와서 살펴봅니다. A, B, C 사이에 얼마나 많은 컴포넌트가 있는지 상관 없습니다. 하지만 이번에는 컴포넌트 C가 이미 자신의 상태를 관리하고 있습니다.

```js
          +----------------+
          |                |
          |       A        |
          |                |
          |                |
          |    Stateful    |
          +--------+-------+
                   |
         +---------+-----------+
         |                     |
         |                     |
+--------+-------+    +--------+-------+
|                |    |                |
|                |    |                |
|       B        |    |                |
|                |    |                |
|                |    |                |
+----------------+    +--------+-------+
                               |
                      +--------+-------+
                      |                |
                      |                |
                      |        C       |
                      |                |
                      |    Stateful    |
                      +----------------+
```

What if component B needs state that is managed in C? It cannot be shared, because state can only be passed down as props. That's why you would lift the state up now. You can lift the state up from component C until you have a common parent component for B and C (which is A). If all state that is managed in C is needed in B, C becomes even a stateless component. The state can be managed in A but is shared across B and C.

만약 컴포넌트 B가 C에서 관리하는 상태가 필요하다면 어떻게 해야 할까요? 이 상황에서는 공유할 수 없습니다. 상태는 프로퍼티 형태로 아래로만 넘겨줄 수 있기 때문인데요. 이런 이유에서 상태 계층을 위로 이동시킬 필요가 있습니다. 컴포넌트 C의 상태를 컴포넌트 B와 C가 공통으로 갖는 부모 컴포넌트의 위치로 올릴 수 있습니다. (여기서는 A가 해당되겠군요.) 만약 C가 관리하는 상태를 B에서 필요로 한다면 C는 상태 없는 컴포넌트가 됩니다. 상태는 A에서 관리되며 B와 C에 공유됩니다.

```js
          +----------------+
          |                |
          |       A        |
          |                |
          |                |
          |    Stateful    |
          +--------+-------+
                   |
         +---------+-----------+
         |                     |
         |                     |
+--------+-------+    +--------+-------+
|                |    |                |
|                |    |        +       |
|       B        |    |        |Props  |
|                |    |        v       |
|                |    |                |
+----------------+    +--------+-------+
                               |
                      +--------+-------+
                      |                |
                      |                |
                      |        C       |
                      |                |
                      |                |
                      +----------------+
```

Lifting state up and down enables you to scale your state management with plain React. When more components are interested in particular state, you can lift the state up until you reach a common parent component for the components that need access to the state. In addition, the local state management stays maintainable, because a component only manages as much state as needed. If the state is not used in the component itself or its child components, it can be lifted down to its respective components where it is needed.

상태를 위로, 또는 아래로 옮기는 전략에서 단순 React를 사용할 때는 어떻게 상태 관리를 확장하는지 배울 수 있습니다. 더 많은 컴포넌트가 특정 상태에 관심을 가져야 하는 경우에은 상태에 접근해야 하는 컴포넌트 간의 공통 부모 컴포넌트까지 거슬러 올라가 상태를 둬야 합니다. 덧붙여 지역 상태 관리에서 충분히 관리할 수 있다면 컴포넌트는 필요한 만큼 상태를 관리하고 있기 때문입니다. 만약 컴포넌트 자체나 자식 컴포넌트에서 사용하지 않는 상태가 있다면 그 상태는  상태가 필요한 컴포넌트의 위치로 이동해야 합니다.

React의 상태 들어 올리기는 [공식 문서](https://facebook.github.io/react/docs/lifting-state-up.html)에서 더 자세히 살펴볼 수 있습니다.


## React의 고차 컴포넌트

Higher order components (HOCs) are an advanced pattern in React. You can use them to abstract functionality away but reuse it as opt-in functionality for multiple components. A higher order component takes a component and optional configuration as input and returns an enhanced version of the component. It builds up on the principle of higher order functions in JavaScript: A function that returns a function.

고차 컴포넌트 (Higher order components, HOCs)는 React의 고급 패턴입니다. 이 패턴은 추상적인 기능이 필요할 때 사용할 수 있으며 여러 컴포넌트에서 선택적으로 기능이 필요할 때 활용할 수 있습니다. 고차 컴포넌트는 컴포넌트를 받아서 선택적 설정을 입력으로 받아 강화된 버전의 컴포넌트를 반환합니다. 이 기능은 JavaScript의 고차 함수 원칙인 함수를 반환하는 함수처럼 구현되었습니다.

If you are not familiar with higher order components, I can recommend you to read [the gentle Introduction to React's Higher Order Components](https://www.robinwieruch.de/gentle-introduction-higher-order-components/). It teaches React's higher order components with the use case of [React's conditional renderings](https://www.robinwieruch.de/conditional-rendering-react/).

만약 고차 컴포넌트가 익숙하지 않다면 [React의 고차 컴포넌트 안내](https://www.robinwieruch.de/gentle-introduction-higher-order-components/)를 읽어보길 추천합니다. 이 글은 React의 고차 컴포넌트를 [React의 조건부 렌더링](https://www.robinwieruch.de/conditional-rendering-react/)의 용례와 함께 설명합니다.

Higher order components are important later on, because you will be confronted with them when using a library like Redux. When a library such as Redux "connects" its state managements layer with React's view layer, you will often run into a higher order component that takes care of it (connect HOC in {{% a_blank "react-redux" "https://github.com/reactjs/react-redux" %}}).

고차 컴포넌트는 뒤에서 더 중요해지는데 Redux와 같은 라이브러리를 사용하게 되면 마주하게 되기 때문입니다. Redux 같은 라이브러리는 React의 뷰 계층(view layer)와 라이브러리의 상태 관리 계층과 "연결"하게 되며 이 과정에서 고차 컴포넌트를 사용해 처리하게 됩니다. (고차 컴포넌트로 이뤄지는 연결은 [react-redux](https://github.com/reactjs/react-redux)를 사용합니다.)

The same applies for other state management libraries such as MobX. Higher order components are used in these libraries to glue the state management layer to the view layer.

MobX와 같은 다른 상태 관리 라이브러리도 동일한 방식으로 적용합니다. 고차 컴포넌트는 라이브러리에서 제공하는 상태 관리 계층과 React의 뷰 계층을 붙이는데 사용합니다.

## React의 Context API

React's {{% a_blank "context" "https://facebook.github.io/react/docs/context.html" %}} API is rarely used. I wouldn't give the advice to use it, because its API is not stable and it adds implicit complexity to your application. However, it makes sense to understand its functionality.

React의 [context](https://facebook.github.io/react/docs/context.html) API는 드물게 사용됩니다. 이 API를 사용하라 충고하지 않는 편인데 이 API는 안정적이지 않고 애플리케이션의 묵시적 복잡도(implicit complexity)를 높이기 때문입니다. 하지만 어떤 기능을 하는지 들어보면 왜 이런 기능이 있는지 충분히 이해할 수 있을 겁니다.

So why should you bother about this? The context in React is used to pass down properties implicitly the component tree. You can declare properties as context somewhere up in a parent component and pick it up again in a child component somewhere down the component tree. Yet everything without the need to pass the props explicitly down each component that sits between the context producing parent component and the context consuming child component. It is an invisible container that you can reach down your component tree. It avoids the so called "props drilling" in React, because you don't need to reach your props through all components which are not interested in them. So again, why should you care?

왜 이 기능을 알아야 할까요? React의 context는 컴포넌트 트리에서 속성을 묵시적으로 전달할 때 사용됩니다. 부모 컴포넌트에서 속성을 context로 선언하면 컴포넌트 트리 아래에 있는 자식 컴포넌트에서 활용할 수 있습니다. 명시적으로 각각의 컴포넌트 계층에 일일이 전달할 필요 없이 단순히 부모-자식 관계라면 부모 컴포넌트가 생성한 context를 자식 컴포넌트가 집어 사용할 수 있습니다. 모든 컴포넌트 트리에 걸쳐 언제든 꺼내서 쓸 수 있는, 보이지 않는 컨테이너가 존재합니다. 이 컨테이너 덕분에 컴포넌트에서 필요하지 않는 프로퍼티는 접근할 일이 없어지기 때문에 React에서 "프로퍼티 구멍내기(props drilling)"라고 하는 일을 피할 수 있게 됩니다. 다시 원래 주제로 돌아와서 왜 이런 API를 알아야 할까요?

Often when using a sophisticated state management library, such as Redux or MobX, you glue the state management layer at some point to the React view layer. That's why you have the mentioned higher order components in React. The glueing should allow you to access the state and to modify the state. The state itself is often managed in some kind of state container.

Redux나 MobX와 같은 세련된 상태 관리 라이브러리를 사용하다보면 어떤 시점에서 상태 관리 계층을 React 뷰 계층에 붙여야 하는 상황이 생깁니다. React의 고차 컴포넌트를 언급한 이유가 여기에 있습니다. 이 붙이는 과정을 통해 상태에 접근하고 수정할 수 있게 됩니다. 상태 자체는 일종의 상태 컨테이너 안에서 관리됩니다.

But how would you make this state container accessible to all the React components that need to be glued to the state? It would be done by using React's context. In your top level component, basically your React root component, you would declare the state container in the React context so that it is implicitly accessible for each component down the component tree. The whole thing is accomplished by [React's Provider Pattern](https://www.robinwieruch.de/react-provider-pattern-context/).

상태 컨테이너에 모든 

After all, that doesn't mean that you need to deal with React's context yourself when using a library such as Redux. Such libraries already come with solutions for you to make the state container accessible in all components. But the underlying mechanics, why this works, are a good to know fact when making your state accessible in various components without worrying where the state container comes from.

{{% chapter_header "React's Stateful Components" "react-stateful-components" %}}

React comes with two versions of component declarations: ES6 class components and functional stateless components. A functional stateless component is only a function that receives props and outputs JSX. It doesn't hold any state nor does it have access to React's lifecycle methods. It is stateless as the name implies.

```js
function Counter({ counter }) {
  return (
    <div>
      {counter}
    </div>
  );
}
```

React's ES6 class components, on the other hand, can have local state and lifecycle methods. These components have access to `this.state` and the `this.setState()` method. This means that ES6 class components can be stateful components. But they don't need to use the local state, so they can be stateless too. Usually ES6 class component that are stateless make use of lifecycle methods to justify that they are classes.

```js
class FocusedInputField extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.input.focus();
  }

  render() {
    return (
      <input
        type="text"
        value={this.props.value}
        ref={node => this.input = node}
        onChange={event => this.props.onChange(event.target.value)}
      />
    );
  }
}
```

The conclusion is that only ES6 class components can be stateful, but they can be stateless too. Functional stateless components alone are always stateless.

In addition, higher order components can be used to add state to React components too. You can write your own higher order component that manages state or use a library such as {{% a_blank "recompose" "https://github.com/acdlite/recompose" %}} with its higher order component `withState`.

```js
import { withState } from `recompose`;

const enhance = withState('counter', 'setCounter', 0);

const Counter = enhance(({ counter, setCounter }) =>
  <div>
    Count: {counter}
    <button onClick={() => setCounter(n => n + 1)}>Increment</button>
    <button onClick={() => setCounter(n => n - 1)}>Decrement</button>
  </div>
);
```

When using React's higher order components, you can opt-in local state to any component in React.

{{% chapter_header "Container and Presenter Pattern" "container-presenter-react" %}}

The container and presenter pattern got popular in a {{% a_blank "blog post" "https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0" %}} by Dan Abramov. If you are not familiar with it, now is your chance to dig into it. Basically it divides components into two types: container and presenter. A container component describes *how things work* and a presenter component describes *how things look*. Often it implies that a container component is a ES6 class component, for instance because it manages local state, and a presenter component is a functional stateless component, for instance because it only displays its props and uses a couple of functions that were passed down from the parent component.

Before diving into Redux, it makes sense to understand the principle behind this pattern. With a state management library you will "connect" components to your state. These component don't care *how things look*, but more about *how things work*. Thus these components are container components. To be more specific, you will often hear the term **connected component** when a component gets connected to the state management layer.

{{% chapter_header "MobX or Redux?" "mobx-redux" %}}

Among all state management libraries, Redux is the most popular one yet MobX is a valuable alternative to it. Both libraries follow different philosophies and programming paradigms.

Before you decide to use one of them, make sure that you know the things about React that were explained in the article. You should feel comfortable with the local state management, yet know enough about React to apply different concepts to scale your state management in plain React. In addition, be sure that you need to scale your state management solution because your application becomes larger in the future. Perhaps lifting your state or using React's context once with the React's provider pattern would already solve your problem.

So if you decide to make the step towards Redux or MobX, you can read up the following article to make a more elaborated decision: [Redux or MobX: An attempt to dissolve the Confusion](https://www.robinwieruch.de/redux-mobx-confusion/). It gives a useful comparison between both libraries and comes with a couple of recommendations to learn and apply them. Otherwise checkout the [Tips to learn React + Redux](https://www.robinwieruch.de/tips-to-learn-react-redux/) article to get started in Redux.

<hr class="section-divider">

Hopefully this article gave you clarification about what you should learn and know before using a state management library like Redux. If you are curious about more Redux and MobX, checkout the ebook/course called Taming the State in React.
