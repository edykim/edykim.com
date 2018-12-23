# React and Redux

This is a quick note from the course.

A component is a (Function|Class) that produces HTML to show the user (uing JSX) and handles feedback from the user (using Event Handlers).

- Functional Components: Good for simple content
- Class Components: Good for just about everything else
  - Easier code organization
  - Can use 'state' (another React system) -> Easier to handle user input
    - How about Hooks?
  - Understands lifecycle events -> Easier to do things when the app first starts

## 3 Tenents of Components

Keep in mind:

- Component Nesting
- Component Reusability
- Component Configuration


faker.js

## Creating a Reusable, Configurable Component

- Identify the JSX that appears to be duplicated
- What is the purpose of that block of JSX? Think of a descriptive name for what it does
- Create a new file to house this new component - it should have the same name as the component
- Create a new component in the new file, put the JSX into it
- Make the new component configurable by using React's 'props' system

## Props

System for passing data from a parent component to a child component.

Goal is to customize or configure a child component.

## The rules of state

- You will confuse props with state
- 'State' is a JS object that contains data relevant to a component
- Updating 'state' on a component causes the component to (almost) instantly rerender
- State must be initialized when a component is created
- State can only be updated using the function `setState`

## Component Lifecycle

Time order:

- `constructor`: Good place to do one-time setup
- `render`: Avoid doing anything besides returning JSX
- Content visible on screen
- `componentDidMount`: Good place to do data loading!
- Sit and wait for updates...
- `componentDidUpdate` (when `render` is happened): Good place to do more data loading when state/props change
- Sit and wait until this component is not longer shown
- `componentWillUnmount`: Good place to do cleanup (especially for non-React stuff)

Others (rearely used):

- `shouldComponentUpdate`
- `getDerivedStateFromProps`
- `getSnapshotBeforeUpdate`
- etc.

## Controlled vs Uncontrolled Elements

Uncontrolled Element contain a data in DOM object. The code fetch the data from DOM when it requires.

Otherwise, controlled element contains data in state. DOM fetch the data from the state in the component.

```js
// Controlled element example
class SearchBar extends React.Component {
  state = { term: "" };

  render() {
    return <input
        type="text"
        value={this.state.term}
        onChange={e => this.setState({ term: e.target.value })}
      />;
  }
}
```

## Context issue

When uses event handler/listener, need to consider context of the caller.

```jsx
<form onSubmit={this.onFormSubmit}>
```

In this code, `onFormSubmit` doesn't understand the context of calling. If the code isn't using `this`, it will be okay though.

```jsx
// old style 1.
constructor(props) {
  super(props);
  this.onFormSubmit = this.onFormSubmit.bind(this);
}
// old style 2.
<form onSubmit={this.onFormSubmit.bind(this)}>

// 1.
// define the method as an arrow function
onFormSubmit = (event) => {
}
// 2.
<form onSubmit={e => this.onFormSubmit(e)}>
```

## Creating Custom Clients

axios gives the way to hold initial values.

```js
// unsplash.js
import axios from "axios";

export default axios.create({
  baseURL: "https://api.unsplash.com",
  headers: {
    Authorization: `Client-ID ${ACCESS_KEY}`
  }
});

// then,
import unsplash from "./unsplash";
const response = await unsplash.get('/search/photos', {
  params: { query: term }
});
```

## React Refs

- Gives access to a single DOM element
- We create refs in the constructor, assign them to instance variables, then pass to a particual JSX element as props.

```js
// 1.
this.imageRef = React.createRef();
// 2. in render()
<img ref={this.imageRef} />
// 3. in componentDidMount
this.imageRef.current.addEventListener('load', someCallback);
```
