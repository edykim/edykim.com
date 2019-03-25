---
title: "리액트 훅(Hooks): 컨텍스트(context) API는 어떻게 되나요?"
author: haruair
type: post
date: "2019-03-25T09:58:00"
lang: ko
slug: react-hooks-whats-going-to-happen-to-react-context
headline:
  - 리액트의 새로운 기능(Hooks/Suspense)이 추가되면 컨텍스트 API에는 어떤 영향이 있는지 확인합니다.
categories:
  - 개발 이야기
  - 번역
tags:
  - react
  - react hooks
  - js
  - react props
  - react context
---

<div class="translation-note">

이 포스트는 [Kent C. Dodds](https://twitter.com/kentcdodds)의 [React Hooks: What's going to happen to react context?](https://kentcdodds.com/blog/react-hooks-whats-going-to-happen-to-react-context)를 번역한 글입니다.

</div>

2018년 초, 리액트 팀은 처음으로 공식 컨텍스트(context) API를 소개했습니다. 이 [새 API에 대해서 글을 쓰기도 했고](https://kentcdodds.com/blog/reacts-new-context-api) 많은 사람들이 이 기능에 꽤나 흥분했습니다.

이 API에 대한 가장 흔한 푸념 중 하나는 컨텍스트를 실질적으로 사용하려면 렌더링 프로퍼티 API를 사용해야 한다는 점이었습니다. 여러 컨텍스트를 사용하려고 하면 결국 (로직 재활용을 위해) 여러 렌더링 프로퍼티 API를 사용하게 되고 결과적으로 많은 중첩(nesting)이 발생하게 됩니다. 그래서 여러 렌더링 프로퍼티 기반 API를 조합해서 하나의 함수 컴포넌트를 만들어 컨텍스트를 소비하는 방식을 이전 블로그 포스트에서 제시했습니다.

```jsx
const ThemeContext = React.createContext('light')
class ThemeProvider extends React.Component {
  /* code */
}
const ThemeConsumer = ThemeContext.Consumer
const LanguageContext = React.createContext('en')
class LanguageProvider extends React.Component {
  /* code */
}
const LanguageConsumer = LanguageContext.Consumer

function AppProviders({children}) {
  return (
    <LanguageProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </LanguageProvider>
  )
}

function ThemeAndLanguageConsumer({children}) {
  return (
    <LanguageConsumer>
      {language => (
        <ThemeConsumer>{theme => children({language, theme})}</ThemeConsumer>
      )}
    </LanguageConsumer>
  )
}

function App() {
  return (
    <AppProviders>
      <ThemeAndLanguageConsumer>
        {({theme, language}) => (
          <div>
            {theme} and {language}
          </div>
        )}
      </ThemeAndLanguageConsumer>
    </AppProviders>
  )
}
```

리액트 컴포넌트의 강력한 합성 덕분에 위 예시처럼 문제를 해결할 수 있습니다. 이런 해법이 썩 맘에 들지 않습니다. 게다가 저만 그렇게 생각한 것이 아닙니다.

> 클래스 컴포넌트에서는 새 렌더링 프로퍼티 API를 적용하기 어렵다는 피드백을 받았습니다. 그래서 클래스 컴포넌트에서도 쉽게 컨텍스트 값을 사용할 수 있도록 [새로운 편의 API를 추가했습니다.](https://reactjs.org/docs/context.html#classcontexttype) - [React v16.6.0: lazy, memo와 contextType](https://reactjs.org/blog/2018/10/23/react-v-16-6.html)

이 새로운 편의 API는 클래스 컴포넌트에서 단 하나의 컨텍스트만 소비한다면 `contextType`이라는 정적 프로퍼티를 정의하는 것으로 사용하고 싶은 컨텍스트를 할당 받아 `this.context`로 접근할 수 있도록 기능을 제공합니다. 단일 컨텍스트만 필요로 한다면 일반적인 상황에서 꽤 깔끔하고 멋진 방법입니다.

이 편의 API는 정말 만족스럽습니다. 하지만 저는 리액트 컨텍스트의 미래에 영향을 줄 리액트 훅이 더 기대됩니다. 위에서 봤던 코드를 `useContext` 훅을 사용해서 다시 작성해보겠습니다.

```jsx
const ThemeContext = React.createContext('light')
class ThemeProvider extends React.Component {
  /* code */
}
const LanguageContext = React.createContext('en')
class LanguageProvider extends React.Component {
  /* code */
}

function AppProviders({children}) {
  return (
    <LanguageProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </LanguageProvider>
  )
}

function App() {
  const theme = useContext(ThemeContext)
  const language = useContext(LanguageContext)
  return (
    <div>
      {theme} and {language}
    </div>
  )
}

ReactDOM.render(
  <AppProviders>
    <App />
  </AppProviders>,
  document.getElementById('root'),
)
```

멋지지 않습니까? 렌더링 프로퍼티 기반으로 만든 코드만큼 강력하면서도 훨씬 쉽게 읽고, 이해할 수 있고, 리팩토링하고 관리하기 좋은 구현입니다. 단순히 적은 코드가 아닙니다. 간혹 코드 양을 줄이는 과정에서 코드가 주는 명료성을 해쳐 의사소통에 문제를 만들 때도 있습니다. 하지만 이 경우에는 적은 코드이면서도 _동시에_ 쉽게 이해할 수 있습니다. 이 컨텍스트 API는 강력하며 동시에 새 훅 API에 큰 기능을 제공합니다.

리액트 훅의 또 다른 큰 기능은 완전히 선택적인 기능이며 하위호환성이 보장됩니다. 아마 페이스북은 세계에서 _가장 크고 오래된_ 리액트 코드베이스를 운용하고 있으니 엔지니어에게 고통을 주는 결정을 할 수는 없었을 겁니다. 리액트가 점진적으로 새로운 훅의 세계로 이끌고 있다는 점이 너무나도 멋집니다. 리액트 팀에게 감사합니다. 공식 릴리즈가 기대되네요. (역자 주: [`useContext`](https://reactjs.org/docs/hooks-reference.html#usecontext)는 현재 16.8에 릴리즈되었습니다.)

## 결론

리액트의 멋진 점은 세세한 구현에 개의치 않고 실제 세계의 문제를 해결하는데 집중할 수 있도록 한다는 점입니다. 크로스 브라우징이나 성능 문제를 오랜 기간동안 겪었습니다. 이제는 리액트를 통해 더 나아가 문제를 단순화했습니다. 이제 간단히 읽고 이해할 수 있는 코드를 작성하고 리팩토링하며 유지관리만 하면 됩니다. 저도 제 코드를 통해서 다른 이들의 작업을 단순하게 할 수 있을 지 궁금하네요 🤔.