---
title: 프로퍼티 내리꽂기 (prop drilling)
author: haruair
type: post
date: "2019-03-20T11:52:00"
lang: ko
slug: prop-drilling
headline:
  - 프로퍼티 내리꽂기가 무엇인지, 장단점은 무엇인지, 사용하면서 겪는 문제를 피하는 방법을 살펴봅니다
  - 번역
tags:
  - 개발 이야기
  - react

---

<div class="translation-note">

이 포스트는 [Kent C. Dodds](https://twitter.com/kentcdodds)의 [Prop Drilling](https://kentcdodds.com/blog/prop-drilling)을 번역한 글입니다.

</div>

이 글에서는 프로퍼티 내리꽂기(prop drilling)를 이해하는데 그치지 않고 어떤 부분이 문제가 될 수 있는지, 이 문제를 피하기 위해 사용할 수 있는 방법이 무엇인지 확인하려고 합니다. (혹자는 "나사 구멍 내기 threading" 라고도 합니다.)

## 프로퍼티 내리꽂기가 무엇인가요?

프로퍼티 내리꽂기(또는 나사 구멍 내기)는 리액트의 컴포넌트 트리에서 데이터를 전달하기 위해서 필요한 과정을 의미합니다. 다음 간단한 상태 컴포넌트 예제로 살펴보도록 합니다. (제가 가장 좋아하는 컴포넌트 예제입니다.)

```jsx
class Toggle extends React.Component {
  state = {on: false}
  toggle = () => this.setState(({on}) => ({on: !on}))
  render() {
    return (
      <div>
        <div>The button is {on ? 'on' : 'off'}</div>
        <button onClick={this.toggle}>Toggle</button>
      </div>
    )
  }
}
```

이 컴포넌트를 둘로 리팩토링합니다.

```jsx
class Toggle extends React.Component {
  state = {on: false}
  toggle = () => this.setState(({on}) => ({on: !on}))
  render() {
    return <Switch on={this.state.on} onToggle={this.toggle} />
  }
}

function Switch({on, onToggle}) {
  return (
    <div>
      <div>The button is {on ? 'on' : 'off'}</div>
      <button onClick={onToggle}>Toggle</button>
    </div>
  )
}
```

`Switch`는 `toggle`과 `on` 상태(state)에 대한 참조가 필요하기 때문에 간단히 프로퍼티로 전달했습니다. 한번 더 리펙토링 과정을 거쳐 컴포넌트 트리에 하나의 레이어를 더 추가합니다.


```jsx
class Toggle extends React.Component {
  state = {on: false}
  toggle = () => this.setState(({on}) => ({on: !on}))
  render() {
    return <Switch on={this.state.on} onToggle={this.toggle} />
  }
}

function Switch({on, onToggle}) {
  return (
    <div>
      <SwitchMessage on={on} />
      <SwitchButton onToggle={onToggle} />
    </div>
  )
}

function SwitchMessage({on}) {
  return <div>The button is {on ? 'on' : 'off'}</div>
}

function SwitchButton({onToggle}) {
  return <button onClick={onToggle}>Toggle</button>
}
```

이 과정을 프로퍼티 내리꽂기라고 합니다. `on` 상태와 `toggle` 핸들러를 필요한 위치에 두기 위해서 프로퍼티를 내려 꽂아(또는 나사 구멍을 내서) `Switch` 컴포넌트까지 전달해야 합니다. `Switch` 컴포넌트 자체는 동작을 위해 이 프로퍼티가 필요한 것이 아니더라도 자식 컴포넌트에 필요하기 때문에 프로퍼티로 받아서 전달해야 합니다.

## 왜 프로퍼티 내리꽂기가 좋은가요?

한번이라도 전역 변수를 사용하는 애플리케이션을 작업한 적이 있나요? AngularJS 애플리케이션에서 고립되지 않은 `$scope`를 사용하는 경우를 겪어본 적이 있나요? 많은 사람들이 이런 기법을 크게 거부하는 이유는 애플리케이션의 데이터 모델을 아주 혼란스러운 모습으로 이끌기 때문입니다. 누구든 데이터가 어디서 초기화되고 갱신되며 사용되는지 판단하기 쉽지 않은 상황에 마주하게 됩니다. **이런 상황에서 "이 코드를 수정하거나 지워도 다른 곳이 고장나지 않을까" 하는 질문에 답하기란 어렵습니다. 또한 이 질문은 당신이 작성한 코드를 최적화하는데 물어봐야 할 필수적인 질문입니다.**

전역 변수보다 ES모듈을 선호하는 이유 중 하나는 이 모듈이 값이 어디서 사용되는지 더 명시적이며, 값을 추적하는데 더 쉽고, 코드 변경이 애플리케이션의 다른 영역에 어떤 영향을 주는지 파악하는데 용이하기 때문입니다.

가장 기초적인 수준의 프로퍼티 내리꽂기를 생각해보면 단순히 애플리케이션의 뷰에 어떤 값을 명시적으로 전달하는가에 해당합니다. 위 예제의 `Toggle`에서 `on` 상태를 열거형(enum)으로 리팩토링한다고 가정해보면 이 방식이 좋은 이유를 알 수 있습니다. 코드를 실행하지 않고도 정적으로 따라가는 것으로 어디서 사용하는지 쉽게 파악할 수 있고 수정도 간단하게 할 수 있습니다. 여기서 중요한 점은 암시적인 것보다 명시적으로 작성하는데 있습니다.


## 프로퍼티 내리꽂기로 발생하는 문제는 무엇인가요?

위에서 본 예제에서는 전혀 문제가 없습니다. 하지만 애플리케이션이 성장하면 여러 계층의 컴포넌트를 만들며 프로퍼티 내리꽂기를 하기 위해 이곳저곳에 깊은 구멍을 만드는 자신을 마주하게 될 겁니다. 일반적으로 작성하는 초기에는 큰 문제가 아닙니다. 코드를 계속 몇 주간 작성하다 보면 이런 과정이 거추장스럽게 느껴지는 몇 가지 경우를 겪게 됩니다.

- 일부 데이터의 자료형을 바꾸게 되는 경우 (예: `{user: {name: 'Joe West'}}` -\>
  `{user: {firstName: 'Joe', lastName: 'West'}}`)
- 필요보다 많은 프로퍼티를 전달하다가 컴포넌트를 분리하는 과정에서 필요 없는 프로퍼티가 계속 남는 경우
- 필요보다 적은 프로퍼티를 전달하면서 동시에 `defaultProps`를 과용한 결과로 필요한 프로퍼티가 전달되지 않은 상황을 문제를 인지하지 어려운 경우 (또한 컴포넌트 분리 과정에서도)
- 프로퍼티의 이름이 중간에서 변경되어서 값을 추적하는데 쉽지 않아지는 경우 (예를 들어 `<Toggle on={this.state.on} />`에서 `<Switch toggleIsOn={on} />`를 렌더링)

이외에도 프로퍼티 내리꽂기로 나타나는 여러 문제 상황이 있습니다. 특히 리펙토링을 진행하다보면 이런 부분에 고통을 겪습니다.

## 프로퍼티 내리꽂기에서 나타나는 문제를 어떻게 피할까요?

프로퍼티 내리꽂기에서 문제를 더 악화시키는 것 중 하나는 `render` 메소드를 불필요하게 여러 컴포넌트로 나누는 경우입니다. 큰 `render` 메소드 하나를 사용하는 것이 상황을 얼마나 쉽게 만들 수 있는가에 놀랄 겁니다. 가능한 한 메소드에 두세요. 이 메소드를 너무 성급하게 나눠야 할 필요가 없습니다. 다시 재사용해야 하는 상황이 될 때까지 기다린 후에 나누기 바랍니다. 그렇게 하면 불필요한 프로퍼티 내리꽂기를 할 필요가 없게 될겁니다.

> 재미있는 사실은 단 하나의 리액트 컴포넌트에 애플리케이션 전체를 작성한다고 한들 기술적으로 제약된 부분이 전혀 없습니다. 전체 애플리케이션의 상태를 관리하고 하나의 거대한 render 메소드를 사용하는 것도 가능합니다. 물론 이 방법을 권장하는 것은 아니지만요. 한번 생각해볼 만한 부분이라고 봅니다. :)

_노트: 이 개념을 [컴포넌트를 여러 컴포넌트로 나눠야 할 때](https://blog.kentcdodds.com/when-to-break-up-a-component-into-multiple-components-4ee75ab53bbc) (역자 주: [번역](https://edykim.com/ko/post/when-to-break-up-a-component-into-multiple-components/))에서 작성했습니다. 관심있다면 확인해보세요._

프로퍼티 내리꽂기로 나타나는 문제를 완화하는 또 다른 방법은 `defaultProps`를 필수 프로퍼티에 사용하지 않는 방법입니다. `defaultProps`를 사용하면 컴포넌트가 제대로 동작하기 위해 실제로 필요한 프로퍼티를 전달받지 못한 상황인데도 중요한 오류가 숨겨지고 소리없이 실패하게 됩니다. 그렇기 때문에 `defaultProps`는 컴포넌트에 필수적이지 않은 부분에만 사용하기 바랍니다.

관련있는 상태는 될 수 있으면 가까이에 보관하기 바랍니다. 애플리케이션의 특정 부분에만 상태가 필요하다면 그 상태는 애플리케이션의 가장 높은 계층에 저장할 것이 아니라 최소 공통 부모 컴포넌트에서 관리해야 합니다. 상태 관리에 관해서는 [애플리케이션 상태 관리](https://blog.kentcdodds.com/application-state-management-66de608ccb24) (역자 주: [번역](https://edykim.com/ko/post/application-state-management/))를 참고하기 바랍니다.

상태가 리액트 계층에서 정말로 깊숙이 위치한 경우라면 [리액트의 새 컨텍스트 API](https://blog.kentcdodds.com/migrating-to-reacts-new-context-api-b15dc7a31ea0)를 사용하세요. 상태라고 애플리케이션 내 어디서나 다 접근할 필요는 없기 때문입니다. (컨텍스트 제공자는 어디서나 렌더링 할 수 있습니다.) 이 API는 프로퍼티 내리꽂기로 나타나는 몇 문제를 피하는 데 도움이 됩니다. 물론 이 컨텍스트는 전역 변수로 문제를 해결하는 방식과 유사성이 있습니다. 하지만 API가 디자인된 방식이 다르기 때문에 여전히 컨텍스트의 원천도 정적으로 찾을 수 있으며 어떻게 사용하든 상대적으로 손쉽게 사용 가능합니다.

## 결론

프로퍼티 내리꽂기는 장점도, 단점도 있는 양날의 검입니다. 위에서 언급한 올바른 사용법을 따르면 더 유지보수하기 쉬운 애플리케이션을 만드는데 도움되는 기능이 될 겁니다.
