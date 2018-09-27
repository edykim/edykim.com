---
title: 리액트 quick start 노트
author: haruair
type: post
date: 2018-02-11T11:49:07+00:00
history:
  - 
    from: https://www.haruair.com/blog/4303
    movedAt: 2018-09-13T22:02:42+00:00
lang: ko
slug: react-quick-start-notes
categories:
  - 개발 이야기
tags:
  - react
  - js

---
[리액트의 Quick start 페이지][1]를 따라하면서 노트한 내용이다. js의 컨텍스트에서 이해할 수 있는 부분은 적지 않았다. 코드 스니핏도 간단히 알아볼 수 있게만 적어놔서 전체 내용이나 설명이 궁금하다면 본문을 확인하는게 좋겠다.

## 연습 환경 설치

node를 쓴지 오래되어서 업데이트부터 했다. [`nvm`][2]이 있어야 한다.

```bash
$ nvm ls-remote
$ nvm install v9.3.0 && nvm alias default v9.3.0
$ nvm use default
$ npm install -g yarn
```

`npx`를 이용해서 playground라는 이름으로 프로젝트를 생성한다. `npx`는 npm 5.2.0+부터 사용할 수 있다.

```bash
$ npx create-react-app playground
$ cd playground
$ yarn start
```

## JSX

리액트는 마크업과 로직을 인위적으로 분리하지 않고 대신에 컴포넌트라는 단위를 만들어 약하게 결합하도록 만들었다. JSX를 꼭 사용할 필요는 없지만 시각적으로 더 편리하다.

리액트 엘리먼트는 `ReactDOM.render()`로 렌더링한다. root DOM 노드를 지정하면 그 내부의 모든 노드를 리액트가 관리한다.

```js
const element = &lt;h1&gt;Hello, world&lt;/h1&gt;;
ReactDOM.render(element, document.getElementById('root'));
```

```jsx
function formatName(user) { /* ... * /}

const element = (
  &lt;h1&gt;
    Hello, {formatName(user)}!
  &lt;/h1&gt;
);

// 함수형 컴포넌트
function HelloBlock() {
  return &lt;div&gt;Hello&lt;/div&gt;;
}

// 클래스 컴포넌트
class GoodbyeBlock extends React.Component {
  render() {
    return &lt;div&gt;Good bye&lt;/div&gt;;
  }
}
```

노드 트리를 직접 조회하지 않고 ReactDOM을 통해 비교한 후, 변경된 사항만 반영하기 때문에 DOM을 직접 읽고 조작하는 방식보다 간결하다.

## props

컴포넌트는 자바스크립트 함수와 같아서 인자 입력(props)을 받고 리액트 엘리먼트를 반환한다.

```jsx
const Greeting = (props) => &lt;h1&gt;Hello, {props.name}!&lt;/h1&gt;;

function Greeting(props) {
  return (
    &lt;h1&gt;Hello, {props.name}!&lt;/h1&gt;
  );
}

class Greeting extends React.Component {
  render () {
    return &lt;h1&gt;Hello, {this.props.name}!&lt;/h1&gt;
  }
}
```

props는 엘리먼트의 어트리뷰트로 전달한다. expression은 `{}`로, 문자열은 `""`로 보낸다.

```jsx
const element = &lt;Comment user={user} text="string value blarblar" /&gt;;
```

모든 리액트 컴포넌트는 props를 변경하지 않는 순수 함수처럼 동작해야 한다. 이 규칙을 깨지 않고 출력값을 변경하기 위해 state라는 개념이 있다.

## State

State는 props과 비슷하지만 private이고 컴포넌트가 전적으로 제어한다. state는 클래스로 작성한 컴포넌트에서 사용할 수 있다.

이 State를 제어하기 위해 `componentDidMount()`와 `componentWillUnmount()`와 같은 생애주기 훅(hook)을 사용한다. State에 대한 지정은 `setState()` 메소드를 사용한다.

`this.state = {}` 형태는 오직 `constructor()` 내에서만 사용 가능하며 그 외에는 `setState()`를 사용해야 한다. 그러지 않으면 렌더링에 반영되지 않는다.

한번 갱신하는데 `setState()` 호출을 여러 차례 한다면 경쟁 상태가 될 수 있다. 대신 함수 형태로 전달하는 것이 가능하다.

```jsx
this.setState((prevState, props) => ({
  conter: prevState.counter + props.increment
}));
```

`setState`로 전달한 개체는 `this.state`에 병합되는 방식으로 동작한다. 전달하지 않은 프로퍼티는 영향을 받지 않는다.

state는 컴포넌트에 속했기 때문에 외부에서는 어떻게 정의되어 있는지 알 수 없고 알 필요도 없다. 지역적, 캡슐화되어 있다고 이야기하는 이유.

컴포넌트가 stateful, stateless인지는 때마다 다르게 정의해서 사용할 수 있음.

## 이벤트 제어

```jsx
return &lt;a href="#" onClick={handleClick}&gt;Click Me&lt;/a&gt;;
```

(이제는 시멘틱웹 얘기 부질 없는 것입니까. 나 너무 오래된 사람인듯.)

`handleClick`에 `e.preventDefault()`를 명시적으로 사용해야 함. (`return false` 넣는거 싫어하는 사람이라서 이런 방식 좋음.) 이 e는 W3C 스펙에서의 그 SyntheticEvent인데 리액트에 맞게 랩핑되어 있다.

이벤트에 넘겨줄 때는 js 특성 상 컨텍스트를 명시적으로 지정해야 한다. 즉, `this` 바인딩을 잊지 말아야 한다.

```js
constructor(props) {
  super(props);
  // ...
  this.handleClick = this.handleClick.bind(this);
}
```

인자를 전달할 때는,

    <button onClick={this.deleteRow.bind(this, id)}>Delete This</button>
    // 이러면 클릭했을 때 `deleteRow(id, e)`로 호출해준다.
    

이 귀찮음을 피하기 위한 대안 두 가지로 public class fields 문법을 사용하는 방식과 익명 함수를 사용해 스코프를 전달하는 방식을 제안하는데 전자는 아직 확정된 문법이 아니다. 후자는 그나마 깔끔하지만 렌더링 될 때마다 새 콜백이 생성된다. 대부분 괜찮지만 하위 컴포넌트로 전달되었을 때 불필요한 추가 랜더링이 계속 나타나서 성능에 영향을 줄 수 있다.

```jsx
// 1. public class fields syntax (experimental)
class Button extends React.Component {
  handleClick = () => {
    console.log('this is', this);
  }
  // ...
}

// 2. arrow funtion as callback
class Button extends React.Component {
  render () {
    return &lt;button onClick={(e) => this.handleClick(e)}&gt;Click me&lt;/button&gt;;
  }
}
```

## 조건부 렌더링

`if` 사용하면 된다! 인라인으로 사용하고 싶다면 `{ expression && <p>Elements</p> }` 식으로 사용한다. `if-else`는 삼항연산자를 사용한다.

`null`을 반환하면 화면에 렌더링하지 않는다. 예시로 에러 메시지 표시 나왔다. 렌더링 안해도 생애주기 훅은 여전히 호출된다.

## 리스트와 키

```jsx
const faces = ['?', '?', '?', '?', '?', '?', '?', '?'];
const listItems = faces.map((face, index) => (
  &lt;li key={index}&gt;
    {face}
  &lt;/li&gt;
));

// 안정적인 id를 key로 사용하고 없으면 최후의 수단으로
// 배열 자체의 인덱스를 사용한다. 여기는 예시니까 그냥
// 인덱스를 사용했다.

const FaceList = () => &lt;ul&gt;{listItems}&lt;/ul&gt;;

// or inline format
const FaceList = () => (
  &lt;ul&gt;
  {faces.map((face, index) => (
    &lt;li key={index}&gt;
      {face}
    &lt;/li&gt;
  ))}
  &lt;/ul&gt;
)
```

변화를 감지하고 반영하기 위해서는 id가 필요한데 key로 지정된 값을 활용한다. 또한 같은 계층에는 키가 유일해야 한다.

키는 리스트에서만 사용하고 각 항목 컴포넌트 정의에서 지정하지 않는다. 위에서 보면 `li` 역할하는 컴포넌트를 정의할 때 `key`를 지정하는게 아니라 `listItems`처럼 배열을 책임지는 컴포넌트에서 key를 지정해야 한다.

key는 prop처럼 작성하지만 실제로 해당 컴포넌트에 전달되진 않는다. 전달하려면 다른 이름의 prop을 명시적으로 지정해야 한다.

# 폼 Form

그냥 html 쓰듯 작성해도 문제 없다! 하지만 js가 있어야 미려한 기능을 만들 수 있는건 당연하고. 이럴 때는 controlled 컴포넌트를 만들어서 해결한다.

`<input>` 같은 엘리먼트는 상태를 스스로 관리한다. 리액트는 가변값을 state에 저장하고 `setState()`를 사용한다. 이 두가지를 하나로 합쳐 State를 &#8220;single source of truth&#8221;로 사용하고 사용자의 입력을 여기에 반영하는 식으로 만든다. 폼 엘리먼트를 리액트에서 관리하니까 controlled 컴포넌트라고 한다.

```jsx
// bind 생략
handleChange(event) {
  this.setState({
    address: event.target.value
  });

  // 여러 input을 처리할 때는 computed property name 문법으로
  this.setState({
    [event.target.name]: event.target.value
  });
}
// ...
render() {
  return &lt;input name="address" type="text" value={this.state.value} onChange={this.handleChange} /&gt;
}
```

`input[type="file"]`은 읽기 전용인데 이런 경우는 uncontrolled 컴포넌트라고 한다.

`value`에 직접 값을 전달하면 사용자가 값을 변경할 수 없다. 값을 전달한 이후에 다시 값을 변경할 수 있게 하려면 `undefined`나 `null`을 다시 전달해야 한다.

## state 위로 보내기 lifting state up

prop에 state를 조작할 수 있는 함수를 만들어서 전달하면 자식 노드에서도 부모 노드의 state를 간접적으로 조작할 수 있다. 이 방법을 &#8220;lifting state up&#8221; 라고 말한다.

아래는 `NameInput`에서 변경된 내용을 `WelcomeBoard`에서 전달받은 `onNameChange`를 사용해 갱신하는 방식이다.

```jsx
class NameInput extends React.Component {
  handleChange(e) {
    this.props.onNameChange(e.target.value);
  }
  render() {
    return (
      &lt;input type="text"
        value={this.props.name}
        onChange={this.handleChange.bind(this)} /&gt;
    )
  }
}

class WelcomeBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: 'stranger'};
  }

  handleNameChange(name) {
    this.setState({
      name: name === '' ? 'stranger' : name,
    });
  }

  render() {
    return (
      &lt;div&gt;
        &lt;p&gt;Hello, {this.state.name}!&lt;/p&gt;
        &lt;NameInput
          name={this.state.name}
          onNameChange={this.handleNameChange.bind(this)} /&gt;
      &lt;/div&gt;
    )
  }
}
```

## 구성 vs 상속

자식 노드로 어떤 것이 오게 될지 미리 알 수 없다. 그래서 특별한 prop으로 `children`이 존재한다.

```js
function Box() {
  return &lt;div&gt;{props.children}&lt;/div&gt;;
}
```

이제 다음과 같이 사용하면 알아서 내부 노드로 처리한다.

```xml
&lt;Box&gt;
  &lt;NameInput /&gt;
  &lt;NameInput /&gt;
  &lt;NameInput /&gt;
&lt;/Box&gt;
```

Containment의 예시로 SplitPane를 작성했다.

Specialization의 예시로 Dialog를 작성했다.

상속을 사용하는 경우는 적절한 유즈케이스가 없다고 한다. UI와 관련되지 않은 로직을 공유해야 할 경우라도 상속보다는 별도의 JS 모듈로 작성해서 `import` 하는 방식을 권장한다.

## 리액트 식으로 생각하기

리액트를 사용할 때 어떤 방식으로 접근해야 하는지 설명한다.

  1. Mock에서 시작. 프로토타이핑과 mock 데이터를 갖고 시작한다.
  2. UI를 나눠 컴포넌트 계층을 만든다. 
      * 단일 책임 원칙
      * 데이터 구조에 맞게
  3. React에서 정적인 페이지로 작성한다. 
      * state를 사용하지 않음
      * 데이터는 단방향으로
  4. UI state의 Representation을 모든 경우를 소화할 수 있으면서도 최소한으로 파악한다.
  5. state가 어디에 위치해야 하는지 파악한다. 
      * owner 컴포넌트, 또는 상위 컴포넌트
      * 적당한 컴포넌트가 없다면 빈 컴포넌트라도 만들어서
  6. 데이터 흐름이 반대가 되야 하는 경우를 파악한다. 
      * lifting state up

 [1]: https://reactjs.org/docs/hello-world.html
 [2]: https://github.com/creationix/nvm