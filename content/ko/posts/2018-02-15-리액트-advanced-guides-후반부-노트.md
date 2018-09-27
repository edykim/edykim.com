---
title: 리액트 Advanced guides 후반부 노트
author: haruair
type: post
date: 2018-02-15T01:50:12+00:00
history:
  - 
    from: https://www.haruair.com/blog/4329
    movedAt: 2018-09-13T22:02:42+00:00
lang: ko
slug: rearact-advanced-guides-late-notes
categories:
  - 개발 이야기
tags:
  - react
  - js

---
[리액트의 Advanced guides 페이지][1]를 따라하면서 노트한 내용이다. 가이드 쪽은 옴니버스 같은 기분이라서 반반으로 나눠 읽기로 했다. 기록하고 싶은 부분만 남겼기 때문에 자세한 내용은 각 페이지를 참고한다.

## Reconciliation

React는 선언형 API를 사용하고 있어서 변경에 대해 일일이 신경쓰지 않아도 된다. 이 가이드에서는 React가 어떤 비교 알고리즘을 사용해서 고성능을 내는지 설명한다.

모든 컴포넌트를 다 새로 그리면 O(n<sup>3</sup>)인데 다음 두 가정으로 발견적(휴리스틱, heuristic) O(n) 알고리즘을 사용한다. 대부분의 경우는 이 가정에 문제가 없다.

  1. 다른 타입의 두 엘리먼트는 다른 트리를 만듬
  2. 개발자가 `key`로 힌트를 제공해서 자식 엘리먼트가 반복되는 렌더링에서 안정된 상태인걸 확인할 수 있음

엘리먼트가 갱신될 때, 어떤 식으로 갱신이 발생하는가는 다음과 같다.

  * 다른 타입의 엘리먼트인 경우, 트리 전체를 다시 그림 (언마운트 && 마운트 발생)
  * 동일 타입의 DOM 엘리먼트의 경우, 어트리뷰트만 갱신함, 어트리뷰트 일부만 갱신된 경우 변경된 부분만 갱신 (e.g. `style`의 `fontWeight`)
  * 동일 타입의 컴포넌트 엘리먼트의 경우, 인스턴스가 유지되며 state도 보존됨. 대신 하위 컴포넌트에는 변경 사항을 `componentWillReceiveProps()`와 `componentWillUpdate()`로 전파함.

자식노드가 갱신될 때는 신경써야 한다.

```html
// 1.
&lt;ul&gt;
  &lt;li&gt;Edward&lt;/li&gt;
&lt;/ul&gt;

// 2. 뒤로 추가되는 경우에는 기존 엘리먼트가 유지됨
&lt;ul&gt;
  &lt;li&gt;Edward&lt;/li&gt;
  &lt;li&gt;Mindy&lt;/li&gt;
&lt;/ul&gt;

// 3. 앞으로 추가되는 경우에는 노드 전체를 다시 그림
//    당연히 성능 하락 발생하며 컴포넌트 엘리먼트 경우
//    언마운트 마운트하게 된다
&lt;ul&gt;
  &lt;li&gt;Mindy&lt;/li&gt;
  &lt;li&gt;Edward&lt;/li&gt;
&lt;/ul&gt;

// 4. 앞서의 가정 2에 따라서 `key`를 제공하면
//    새로 그리지 않고 반영할 수 있게 됨
&lt;ul&gt;
  &lt;li key="1029"&gt;Edward&lt;/li&gt;
&lt;/ul&gt;

&lt;ul&gt;
  &lt;li key="2012"&gt;Mindy&lt;/li&gt;
  &lt;li key="1029"&gt;Edward&lt;/li&gt;
&lt;/ul&gt;
```

id가 없다면 적당히 hash를 생성해서 쓴다. 동일 계층에서만 유일값을 가지면 된다. 최후의 수단은 배열의 index인데 배열 순서가 바뀌지 않는다는 가정이 있어야 한다. 순서가 바뀌면 key를 써도 느리다. 별로 권장하지 않는다.

최종적인 결과는 동일하지만 어떻게 구현되어 있는지 아는 것으로 성능 향상을 할 수 있다. 휴리스틱에 기반한 알고리즘이라서 다음 경우엔 좋지 않다.

  1. 하위 트리의 컴포넌트가 일치하는지 검사하지 않는다. 두 컴포넌트가 비슷한 결과를 낸다면 하나로 만드는걸 고려한다.
  2. 키는 안정적이고 예측 가능하며 유일해야 한다. 이 규칙을 지키지 않으면 성능 하락이나 자식 컴포넌트가 state를 잃어버리는 경우가 발생한다.

## Context

props로 일일이 내려주기 번거로울 때 `contextTypes`로 지정하면 하위 트리에 전역으로 전달된다. [prop-types][2]가 필요하다. 흑마법이므로 사용하지 말 것. 실험적인 API로 차후 문제가 될 가능성이 높다. 문서 내내 쓰지 말라는 말이 반복된다.

## Fragments

엘리먼트를 반환할 때 컨테이너 역할을 하는 `<div>` 등을 쓰기 마련인데 테이블 같은 걸 조립할 때는 마크업에 맞지 않다. 이런 경우를 위해 정말 컨테이너 역할만 하는 `<React.Fragment>`를 사용할 수 있다.

```jsx
class Columns extends React.Component {
  render() {
    return (
      &lt;React.Fragment&gt;
        &lt;td&gt;Hello&lt;/td&gt;
        &lt;td&gt;World&lt;/td&gt;
      &lt;/React.Fragment&gt;
    );
  }
}
```

약식 표기로 `<>`, `</>`를 사용할 수 있지만 현재 툴에서 지원하지 않을 수도 있으니 위 방식으로 사용한다.

`<React.Fragment>`로 묶을 때 `key`도 지정할 수 있다.

```jsx
function TodoList(props) {
  return (
    &lt;dl&gt;
    {props.items.map(item => (
      &lt;React.Fragment key={item.id}&gt;
        &lt;dt&gt;{item.thing}&lt;/dt&gt;
        &lt;dd&gt;{item.done}&lt;/dd&gt;
      &lt;/React.Fragment&gt;
    ))}
    &lt;/dl&gt;
  );
}
```

## Portals

컴포넌트를 부모 컴포넌트의 DOM 트리 바깥에 붙일 때 사용하는 방법이다. 전체화면에 모달 띄우기 이런 동작 필요할 때 쓴다. 아래 코드에서 `child`는 렌더링 가능한 리엑트 엘리먼트고 `container`는 DOM 엘리먼트다.

```js
ReactDOM.createPortal(child, container)
```

DOM에서 이벤트 전파(Event bubbling)는 실제 노드를 타고 올라가는 식이지만 포털은 다른 DOM 노드에 위치하고 있더라도 React 컴포넌트의 노드 트리를 타고 전파된다. DOM의 바인딩만 트리 바깥에서 일어나고 실제 모든 컴포넌트는 기존과 동일한 방식으로 동작한다.

## 에러 바운더리

기존엔 에러가 발생하면 컴포넌트 트리가 멍텅구리 되었는데 에러 바운더리를 사용해서 해결할 수 있다. 오류가 발생했을 때 동작을 `componentDidCatch(error, info)`에 선언한다. `error`는 발생한 오류고 `info`는 `componentStack` 키를 포함한 객체로 오류 발생 시, 스택 정보를 제공한다.

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // 오류 발생 UI 표시
    this.setState({ hasError: true });
    // 로그로 남김
    logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      return &lt;h1&gt;Something went wrong.&lt;/h1&gt;;
    }
    return this.props.children;
  }
}
```

```xml
&lt;ErrorBoundary&gt;
  &lt;MyWidget /&gt;
&lt;/ErrorBoundary&gt;
```

에러 바운더리는 다음처럼 컨텍스트 바깥에서 발생하는 오류는 잡지 못한다.

  * 이벤트 핸들러
  * 비동기 코드
  * 서버측 렌더링
  * 하위 컴포넌트가 아닌 에러 바운더리 자체에서 발생한 오류

react 16부터는 에러 바운더리로 에러가 잡히지 않았을 때 리엑트 컴포넌트 트리 전체를 언마운트한다. 문제 있는 UI를 그대로 두면 사용자의 잘못된 조작을 야기할 수 있기 때문이라고 한다.

create react app 사용하면 스택 추적에서 어디서 오류가 났는지 명확히 보인다. create react app을 사용하지 않는다면 [플러그인][3]을 설치하면 된다. 다만 프로덕션에서는 꺼야 한다.

`try ... catch`는 명령행 코드에서만 동작한다. 이벤트 핸들러의 에러는 이벤트 바운더리에서 잡지 못한다. 이벤트 핸들러의 에러는 `try ... catch`를 사용한다.

15에서는 `unstable_handleError`였다고 한다.

## 웹 컴포넌트

[웹 컴포넌트][4]를 react 내에서 사용할 경우에는 일반 DOM 컴포넌트를 사용하는 것처럼 쓸 수 있다. 웹 컴포넌트는 명령형 API를 쓰는 경우가 종종 있는데 `ref`로 참조를 받아와 DOM 노드를 직접 호출해야 할 수도 있다. 또한 웹 컴포넌트에서 발생한 이벤트가 리액트 컴포넌트에 제대로 전이되지 않을 수 있으므로 직접 핸들러를 연결해야 할 수도 있다.

웹 컴포넌트에서 React 컴포넌트를 사용하려면 `ReactDOM.render`로 [직접 렌더링][5] 해야한다.

## 고차 컴포넌트

고차 컴포넌트는 컴포넌트를 입력 받아 새로운 컴포넌트를 반환하는 함수를 의미한다. (고차 함수와 같은 접근 방식이다.) Redux의 [`connect`][6], Relay의 [`createFragmentContainer`][7]도 동일한 방식이다.

```js
function withSubscription(WrappedComponent, selectedData) {
  return class extends React.Component {
    // ...
  }
}
```

고차 컴포넌트 내에서 기존 컴포넌트를 변경하지 않도록 주의한다. 고차 컴포넌트 내에서 기존 컴포넌트를 변경하면 추상성이 무너진다. 순수 함수처럼 작성해야 한다. 이 접근 방식은 책임을 분리한다는 점에서 컨테이너 컴포넌트와 유사한 점이 있다.

```jsx
render() {
  // 불필요한 prop을 제거하거나 추가적으로 필요한 prop을 전달한다.
  const { extraProp, ...passThroughProps } = this.props;
  const injectedProp = someStateOrinstanceMethod;
  return (
    &lt;WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    /&gt;
  );
}
```

`compose` 같은 합성 함수를 사용하면 편리하다. `lodash`나 `Redux`, `Ramda`에서도 제공한다.

고차 컴포넌트에서 반환하기 전에 displayName을 추가하면 디버그를 쉽게 할 수 있다.

```jsx
function withSubscription(WrappedComponent) {
  class WithSubscription extends React.Component { /* ... */ };
  WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithSubscription;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
```

고차 컴포넌트에서 지켜야 할 사항이 있다.

  1. `render()` 내에서는 고차 컴포넌트를 사용하지 않는다. 렌더링 할 때마다 새로운 컴포넌트를 만들고 최악의 경우 노드의 모든 상태를 잃게 된다.
  2. 고차 컴포넌트를 만들 때는 정적 메소드도 직접 복사해야 한다. [hoist-non-react-statics][8] 같은 패키지를 사용해도 된다.
  3. 고차 컴포넌트는 [`ref`를 전달하지 못한다][9]. `ref`는 일반 prop이 아니기 때문인데 부모 컴포넌트에 [ref 노출하는 식][10]으로 별도의 prop을 만들어서 전달해야 한다. 깔끔한 해결책은 아니다.

## Render Props

Render props은 prop에 엘리먼트를 반환하는 함수를 전달해서 재사용성을 높이는 방법이다. [React Router][11]와 [downshift][12]에서 사용하는 방식이라고 한다.

```jsx
&lt;Mouse render={mouse => (
  &lt;Cat mouse={mouse} /&gt;
)}/&gt;
```

구체적으로 구현하는 방식보다 동작을 사용자에게 위임하는 방식으로 구현하는 접근법으로 `Mouse` 커서 위치를 전달하는 예를 들었다.

이런 방식으로 사용하는걸 render props라고 하지만 꼭 props가 render일 필요는 없다. 패턴 이름일 뿐이다.

설명에는 ShallowEquals 때문에 `React.PureComponent`에서는 익명함수가 계속 새로 생성된다고 나오는데 내가 테스트를 제대로 못하는건지 `React.Component`에서 하는거랑 차이가 없어 보인다. 여튼 익명함수를 반복해서 생성하고 싶지 않다면 익명함수 대신 선언한 메소드를 전달해주는 방식으로 해결할 수 있다.

```jsx
constructor(props) {
  super(props);
  this.renderTheCat = this.renderTheCat.bind(this);
}
// ...
renderTheCat(mouse) {
  return &lt;Cat mouse={mouse} /&gt;;
}
// ...
return &lt;Mouse render={this.renderTheCat} /&gt;;
```

## 다른 라이브러리와 함께 사용하기

DOM을 직접 제어하는 플러그인과 함께 사용하려면 `ref`로 DOM 엘리먼트를 노출하고 직접 제어한다.

```jsx
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen();
}

componentWillUnmount() {
  this.$el.chosen('destroy');
}
render() {
  return (&lt;select ref={el => this.el = el}&gt;{this.props.children}&lt;/select&gt;);
}
```

다른 뷰 라이브러리와 연동하기에서는 리액트로 포팅하는 방법이랑 Backbone.View에 리액트 컴포넌트를 어떻게 넣는지 설명한다.

React state, flux, redux를 권하긴 하지만 모델 레이어와도 통합이 가능하다.

Backbone의 모델을 컴포넌트에서 사용하려면 backbone에서 사용하는 방식대로 사용하면 되고 Backbone의 모델에서 데이터를 가져오는 방식으로는 고차 컴포넌트 형태로 활용할 수 있다.

설명은 Backbone으로 했지만 여기서 사용한 기법 자체는 제한적이지 않다.

## 접근성

WAI-ARIA 적용, 시멘틱 HTML, 폼 접근성, 포커스 컨트롤 등 접근성 관련된 내용을 설명하는데 읽어봐야 하는 문서를 전부 나열하고 있다. 리액트에 특정한 부분이 아니라서 각 링크는 [본문을 확인][13]한다.

```jsx
// for 대신 htmlFor를 사용
&lt;label htmlFor="namedInput"&gt;Name:&lt;/label&gt;
&lt;input id="namedInput" type="text" name="name"/&gt;
```

포커스 제어는 `ref`로 직접 DOM을 받아서 처리한다.

## 코드 분할

`import()` 등 nodejs에서 사용하는 일반적인 코드 분할 기법을 설명한다.

  * [React Loadable][14]
  * [React Router][15]

 [1]: https://reactjs.org/docs/reconciliation.html
 [2]: https://www.npmjs.com/package/prop-types
 [3]: https://www.npmjs.com/package/babel-plugin-transform-react-jsx-source
 [4]: https://developer.mozilla.org/en-US/docs/Web/Web_Components
 [5]: https://reactjs.org/docs/web-components.html#using-react-in-your-web-components
 [6]: https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options
 [7]: http://facebook.github.io/relay/docs/en/fragment-container.html
 [8]: https://github.com/mridgway/hoist-non-react-statics
 [9]: https://reactjs.org/docs/higher-order-components.html#refs-arent-passed-through
 [10]: https://reactjs.org/docs/refs-and-the-dom.html#exposing-dom-refs-to-parent-components
 [11]: https://reacttraining.com/react-router/web/api/Route
 [12]: https://github.com/paypal/downshift
 [13]: https://reactjs.org/docs/accessibility.html
 [14]: https://github.com/thejameskyle/react-loadable
 [15]: https://reacttraining.com/react-router/