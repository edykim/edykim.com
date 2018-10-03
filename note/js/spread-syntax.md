# Spread syntax

- [Spread syntax - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

Spread syntax help reducing verbosity in many cases.

- Spread in function calls
  - Replace apply `hello(...args)` like `hello.apply(null, args)`
  - Apply for new `new Something(...args)`
- Spread in array literals
  - `['head', ...parts, 'and', 'toes']`
  - Copy an array `[...arr]` like `arr.slice()`
  - concatenate arrays `[...arr1, ...arr2]`
- Spread in object literals `{ ...obj }`

It can be applied only iterable objects.

## Example

```js
const numbers = [1, 9, 3]
console.log(Math.max.apply(null, numbers))
// output: 9
console.log(Math.max(...numbers))
// output: 9
```

