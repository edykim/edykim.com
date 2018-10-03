# [The Supermarket Queue](https://www.codewars.com/kata/the-supermarket-queue/solutions/javascript)

> There is a queue for the self-checkout tills at the supermarket. Your task is write a function to calculate the total time required for all the customers to check out!
> 
> The function has two input variables:
> - customers: an array (list in python) of positive integers representing the queue. Each integer represents a customer, and its value is the amount of time they require to check out.
> - n: a positive integer, the number of checkout tills.
>
> The function should return an integer, the total time required.

## My Solution

```js
function queueTime(customers, n) {
  var tills = new Array(n).fill(0);
  while (customers.length > 0) {
    const next = customers.shift();
    tills = tills.sort(sortByTime);
    tills[0] += next;
  }
  return Math.max.apply(null, tills);
}

function sortByTime(a, b) {
  return a - b;
}
```

It was a 6 kyu Kata and it wasn't that complicated. After I submitted the form, however, I realised that my code is not that good solution in some many points.

- loop the customers rather than using shift method.
- find a short queue directly rather than reassigning it.
- `apply` method can be replaced by a spread operator.

## Other solution

[This one](https://www.codewars.com/kata/reviews/57b0804926ca429ed4000054/groups/57b158e8db5b3d7c1c000048) is very clean and easy to read.

```js
function queueTime(customers, n) {
  var w = new Array(n).fill(0);
  for (let t of customers) {
    let idx = w.indexOf(Math.min(...w));
    w[idx] += t;
  }
  return Math.max(...w);
}
```

[What is different between `for...in` and `for...of`?](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of#Difference_between_for...of_and_for...in) The `for...in` statement iterates over the enumerable properties of an object, in an arbitrary order. The `for...of` statement iterates over data that iterable object defines to be iterated over.

