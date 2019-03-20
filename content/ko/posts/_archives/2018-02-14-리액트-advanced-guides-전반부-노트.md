---
title: 리액트 Advanced guides 전반부 노트
author: haruair
type: post
date: "2018-02-14T10:54:58"
history:
  - 
    from: https://www.haruair.com/blog/4313
    movedAt: 2018-09-13T22:02:42+00:00
lang: ko
slug: react-advanced-notes
categories:
  - 개발 이야기
tags:
  - react
  - js

---
[리액트의 Advanced guides 페이지][1]를 따라하면서 노트한 내용이다. 가이드 쪽은 옴니버스 같은 기분이라서 반반으로 나눠 읽기로 했다. 기록하고 싶은 부분만 남겼기 때문에 자세한 내용은 각 페이지를 참고한다.

## JSX in Depth

### 리액트 엘리먼트 타입 정의

JSX는 `React.createElement(component, props, ...children)`의 편의 문법이다. 그래서 JSX를 사용할 때는 스코프 내에 `React`가 꼭 필요하다.

다음처럼 점 표기법을 사용할 수 있다. 한번에 여러 컴포넌트 내보낼 때 편리하다.

```jsx
const MyComponents = {
  DatePicker: function DatePicker(props) {
    return <div>Imagine a {props.color} datepicker here.</div>;
  }
}

function BlueDatePicker() {
  return <MyComponents.DatePicker color="blue" />;
}
```

사용자 정의 컴포넌트는 꼭 Capitalized 되어야 한다. 소문자로 된 컴포넌트라면 사용하기 전에 Capitalized 하는 방식으로 사용할 수 있다. 동적으로 사용할 때도 이런 방식으로 사용한다.

```jsx
const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(Props) {
  // Wrong
  return <components[props.storyType] story={props.story} />;

  // Correct
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```

### Props

아래는 각각 동일한 표현이다.

```jsx
// 문자열 리터럴
<MyComponent message="hello world" />
<MyComponent message={'hello world'} />

// 문자열 리터럴은 HTML-unescaped로 처리됨
<MyComponent message="<3" />
<MyComponent message={'<3'} />

// Prop의 기본 값은 `True`
<MyComponent autocomplete />
<MyComponent autocomplete={true} />
```

Spread Attribute로 간편하게 표현할 수 있다.

```jsx
<Greeting firstName="John" lastName="Dorian" nickName="Bambi" />

const props = {firstName: 'John', lastName: 'Dorian', nickName: 'Bambi'};
<Greeting {...props} />

const { nickName, ...other } = props;
const nick = nickName === 'Bambi' ? 'Newbie' : 'Scooter';
<button nickName={nick} {...other} />
```

### 자식 노드

문자열은 문자열로 처리되고 개행은 공백으로 처리된다.

`render()`에서 배열로 반환하면 합쳐서 렌더링한다.

JS 표현식도 자식 노드에 사용할 수 있다. 배열도 렌더링 하기 때문에 다음처럼 쓸 수 있다.

```jsx
<ul>
  {todos.map((message) => <Item key={message} message={message} />)}
</ul>
```

`children`에 함수도 전달할 수 있다. Lifting state up이랑 비슷한 느낌이다. 세부 구현을 사용자에게 위임할 수 있을 것 같다.

```jsx
function Repeat(props) {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
  }
  return <div>{items}</div>;
}

function TodoList() {
  const todos = ['finish doc', 'submit pr', 'review'];
  return (
  <Repeat numTimes={10}>
    {(index) => <div key={index}>This is item {index} in the list</div>}
  </Repeat>
  );
}
```

Boolean, `null`, `undefined`는 화면에 렌더링하지 않는다.

```jsx
// 조건부 표현
{showHeader && <Header />}

// false가 아닌 falsy한 값을 반환하는 경우에는 렌더링되는 점을 주의, 명확하게 boolean으로 반환할 것
{props.messages.length > 0 && <MessageList messages={props.messages} />}
```

Boolean, `null`, `undefined`를 표시하려면 `{String(value)}` 식으로 작성한다.

## PropTypes로 타입 확인하기

정적 타입을 사용하지 않는다면 사용할 만한 검증 라이브러리다. 원래는 React에 포함되어 있다가 분리된 모양이다. 개발 모드에서만 값을 검사한다. 자세한 사용법은 [prop-types][2] 참고한다.

```js
class Greeting extends React.Component {
  // ...
}

Greeting.propTypes = {
  name: PropTypes.string,
  nicknames: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.element.isRequired
};

Greeting.defaultProps = {
  name: 'Stranger'
};
```

클래스 프로퍼티 문법으로도 사용할 수 있다.

## 정적 타입 검사

`Flow`와 `TypeScript`를 설정하고 사용하는 방법을 설명한다.

  * [Flow 설정][3]
  * [TypeScript react starter][4]

코틀린도 js를 타겟 플랫폼으로 사용 가능하다고 한다. [Kotlin Wrappers][5], [create-react-kotlin-app][6]을 참고한다.

## Refs와 DOM

일반적으로 데이터 흐름은 props를 사용하게 되어 있지만 몇몇 경우에는 이런 방식에 적합하지 않다.

  * 커서 위치, 텍스트 선택, 미디어 재생
  * 애니메이션 처리
  * 서드파티 DOM 라이브러리와 연동

선언적으로 해결할 수 있는 부분에서는 ref를 쓰지 않는 것을 권한다. 예를 들면 `Dialog` 컴포넌트에 `open()`, `close()` 메소드를 만드는 것보다 `isOpen` prop을 넘겨주는 식으로 처리한다. 안되는걸 되게 하려고 ref를 쓸 수는 있지만 쓰기 전에 컴포넌트 위계를 보고 상태를 어디에 위치해야 하는지 잘 고려해야 한다. ref를 쓰는 방식보다 상위 계층에 상태가 위치하는게 더 적절하다면 Lifting State Up 방식을 적용해서 해결한다.

Ref는 DOM 컴포넌트와 클래스 컴포넌트에서만 사용할 수 있다. 컴포넌트 자체를 레퍼런스로 넘기 때문인데 함수형 컴포넌트 내에서 DOM 컴포넌트나 클래스 컴포넌트에는 사용할 수 있다.

마운트 될 때는 인자에 해당 엘리먼트를 전달하고 언마운트에는 `null`을 전달한다. 이 `ref`는 `componentDidMount`, `componentDidUpdate` 전에 호출된다.

일반적으로 DOM 엘리먼트에 접근해야 할 일이 있을 때 많이 쓴다. `ref={input => this.textInput = input}`

```js
class AutoFocusTextInput extends React.Component {
  componentDidMount() {
    this.textInput.focusTextInput();
  }

  render() {
    return <CustomTextInput
      ref={(input) => { this.textInput = input; }}/>;
  }
}
```

하위 엘리먼트의 DOM ref를 상위에서 사용하려면 props 체인을 따라서 함수를 내려주면 된다. 여기서 `inputRef`는 일반 prop을 정의해서 쓴 것이지 `ref`처럼 특별한 기능이 있는 prop이 아니다.

```jsx
function CustomTextInput(props) {
  return <div><input ref={props.inputRef} /></div>;
}

function FormLayout(props) {
  return (
    <div>
      Name: <CustomTextInput inputRef={props.inputRef} />
    </div>
  );
}

class AwesomePage extends React.Component {
  render() {
    return <FormLayout inputRef={el => this.inputElement = el} />;
  }
}
```

가능하면 DOM을 노출해서 사용하지 않는 것이 좋다고 한다. 어쩔 수 없이 필요할 때만 사용하고 극단적으로는 `findDOMNode()`라는 흑마법도 존재한다고.

`ref`가 두 차례씩 호출되는 것(마운트 && 언마운트)은 `null`을 전달해서 기존에 연결된 레퍼런스를 지우는 역할도 겸하고 있기 때문이다. (DOM 레퍼런스를 냅두면 DOM은 해제되어도 GC가 지우지 않고 남겨둔다. 그래서 복잡한거 하지 않도록 간단한 함수 형태로만 소개하는 것 같다.)

## Uncontrolled 컴포넌트

폼 데이터를 React 컴포넌트에서 다루는 controlled 컴포넌트와 반대로 DOM 자체에서 다루도록 하는 방식의 컴포넌트를 뜻한다.

DOM 엘리먼트를 사용하면 내장된 동작을 그대로 사용할 수 있는 특징이 있다. [Controlled and uncontrolled form inputs in React don&#8217;t have to be complicated][7] 글에서 비교 도표를 볼 수 있다.

```jsx
<input defaultValue="Bob" type="text" ref={(input) => this.input = input} />
// checkbox, radio는 defaultChecked, 그 외는 defaultValue
```

`input[type="file"]`은 읽기 전용으로 항상 uncontrolled 컴포넌트다. `ref`를 사용해서 DOM을 직접 다룬다.

## 성능 최적화

프로덕션 빌드를 사용한다.

  * Create React App (이래서 다 이거 얘기하는듯)
  * 단일 파일로 빌드
  * [Brunch][8] `-p` 옵션 빌드
  * Browserify의 [envify][9], [uglifyify][10], [uglify-js][11]
  * Rollup의 replace, commonjs, uglify
  * webpack

크롬 개발자 도구의 성능 탭에서 컴포넌트를 프로파일링한다. 프로파일링 전에 크롬 확장과 React DevTool 끄는 것 잊지 않는다. [성능 테스트 과정][12] 참조.

긴 목록은 한번에 로드하지 말고 동적으로 처리해야 성능이 좋다. [react virtualized][13] 같은 패키지가 있고 Virtualize, windowing가 검색 키워드.

React devtool에서 Highlight updates 기능으로 불필요하게 렌더링이 되는 지점을 찾아서 수정한다.

`shouldComponentUpdate()`의 반환값으로 렌더링 여부를 수동으로 제어할 수 있다. 이 부분을 직접 작성하는 것보다 `React.PureComponent`를 상속받는게 낫다. PureComponent는 기존 Component 구현에 prop과 state의 shallow 비교를 포함하고 있다. [`shouldComponentUpdate()` 메소드의 동작 방식과 구현은 본문을 읽는다][14]. 갱신이 필요하면 노드를 타고 올라가서 모두 갱신하게 만든다.

불필요한 갱신은 가변 데이터에서 주로 나타나기 때문에 불변 데이터를 사용하면 이 문제를 쉽게 피할 수 있다. `Array.push()`로 기존 배열을 조작하는 것보다 `Array.concat()`, `[...words, 'new data']`을 사용해서 원 데이터가 변형되지 않도록 한다. [Immutable.js][15]을 써도 된다.

## ES6 없이 React

ES6 없이 쓸 일이 있을 때 읽는다.

## JSX 없이 React

JSX 없이 쓸 일이 있을 때 읽는다.

* * *

가이드 나머지 다 보고 나면 몇 가지 먼저 만들려고 한다. 그리고나서 enzyme이랑 상태 관리하는 패키지 redux랑 mobx? 찾아서 볼 생각이다. 많은 분들이 열심히 쓰고 있어서 주워들은 것만 공부해도 좀 걸릴 것 같다.

 [1]: https://reactjs.org/docs/jsx-in-depth.html
 [2]: https://github.com/facebook/prop-types
 [3]: https://flow.org/en/docs/react/
 [4]: https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter
 [5]: https://github.com/JetBrains/kotlin-wrappers
 [6]: https://github.com/JetBrains/create-react-kotlin-app
 [7]: http://goshakkk.name/controlled-vs-uncontrolled-inputs-react/
 [8]: https://github.com/brunch/uglify-js-brunch
 [9]: https://github.com/hughsk/envify
 [10]: https://github.com/hughsk/uglifyify
 [11]: https://github.com/mishoo/UglifyJS2
 [12]: https://building.calibreapp.com/debugging-react-performance-with-react-16-and-chrome-devtools-c90698a522ad
 [13]: https://bvaughn.github.io/react-virtualized/#/components/List
 [14]: https://reactjs.org/docs/optimizing-performance.html#shouldcomponentupdate-in-action
 [15]: https://github.com/facebook/immutable-js