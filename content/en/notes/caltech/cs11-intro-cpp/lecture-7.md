---
title: "CS11 Intro C++: Lecture 8"
author: haruair
type: page
date: "2020-05-18T21:58:00"
lang: en
url: /note/cs-11-intro-cpp/lecture-7
linkToParent: true
tags:
  - cs11
---

## Copying Objects: The Rule of Three

Define a destructor, a copy-constructor, a copy-assignment operator.

```cpp
class FloatArray {
  int count;
  float *elems;
public:
  FloatArray(int n);
  // Copy-constructor
  FloatArray(const FloatArray &f);

  // Destructor
  ~FloatArray();

  // Copy-assignment operator
  FloatArray & operator=(const FloatArray &f);
}
```

## Resource perspective

```cpp
FloatArray filterAbove(const FloatArray &input, float value) {
  FlatArray result;
  for (int i = 0; i < input.size(); i++) {
    if (input.getValue(i) <= value)
      result.addValue(input.getValue(i));
  }
  return result;
}

FloatArray data = /* ... */;
FlatArray filtered = filterAbove(data, 10.0);
```

`filterAbove()` call evaluates to a temporary `FloatArray` object, which is then pass to the `FloatArray` copy-constructor to initialize `filtered`. The temporary obj will then be destructed after copying.

C++11 requires compilers to perform **copy-elision**; i.e. eliminate copy-constructor invocations where possible. Good compilers will likely construct result directly into **filtered**.

- `filtered` is an **lvalue**
  - It can appear on the left-hand side of an assignment
  - It persists across multiple statements
- `filterAbove()` is an **rvalue**
  - It is a temporary object that will be destructed at the end of statement execution

Therefore, we can recycle rvalue for lvalue rather than destructed it by _moving_ it. C++11 and later support this approach with **move-construction** and **move-assignment**.

## Move Construction

`FloatArray &&` is called an **rvalue reference**: temporary object by evaluating an expression, not const because of that.

```cpp
FloatArray(FloatArray &&f) {
  size = f.size;
  elems = f.elems;
  f.elems = nullptr;
  // by assigning null pointer here, elems are not destructed
  // when it goes out of scope. Also, this is the reason why
  // the args cannot be const as well.
}

FloatArray filtered = filterAbove(data, 10.0);
```

## Move Assignment

```cpp
FloatArray & FloatArray::operator=(FloatArray &&f) {
  if (this == &f)
    return *this; // handle self-assignment

  size = f.size;
  delete[] elems; // free any memory the LHS obj is using
  elems = f.elems;
  f.elems = nullptr;
  return *this;
}

filtered = filterAbove(data, 10.0);
```

## Copy and Move Operators

- Copy operators (construction/assignment) are about correctness
- Move operators are about performance
  - The compiler will generate only if:
    - the class has no user-declared copy constructor
    - the class has no user-declared copy-assignment operator
    - the class has no user-declared destructor
  - It will be incorrect if the class have any of these even the compiler generates it.

## The Rule of Five

If the class defins any of the following:

- A destructor, a copy-constructor, a copy-assignment operator (The Rule of Three)
- A move-constructor, a move-assignment operator

and move semantics are desirable, the class need to have _all five_.

## Member Initializer Lists

**Member initializer list**: a more succinct mechanism for specifying initial values in constructors.

```cpp
// Can specify only a subset of the data members
FloatArray(int n) : count{n} {
                     // ↑ Can optionally specify
                     // initialization of data-members here
  elems = new float[n];
  for (init i = 0; i < n; i++)
    elems[i] = 0;
}

// Move-constructor becomes very short
FloatArray(FloatArray &&f) : count{f.count}, elems{f.elems} {
  f.elems = nullptr;
}
```

## Delagating Constructors

```cpp
class Point {
  double x_coord, y_coord;
public:
  // Must specify a constructor body
  Point(double x, double y) : x{x_coord}, y{y_coord} { }
  Point() : Point{0, 0} { } // Delegates to Point(x, y)
  // ...
};
```

In these cases, can only specify a target constructor in the member initializer list. (Not allowed to specify any other member initializers)
