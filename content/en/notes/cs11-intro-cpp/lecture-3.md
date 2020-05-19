---
title: "CS11 Intro C++: Lecture 3"
author: haruair
type: note
date: "2020-05-18T15:24:00"
lang: en
url: /note/cs-11-intro-cpp/lecture-3
linkToParent: true
---

## File I/O

Use `fstream` like `iostream`.

- `ifstream`: for reading
- `ofstream`: for writing
- `fstream`: for both

```cpp
vector<double> read_data(string filename) {
  ifstream ifs{filename};
  vector<double> data;

  // Make sure the file was opened successfully
  if (!ifs.is_open()) // or if(!ifs)
    throw illegal_argument("Couldn't open file");

  // Read data until we hit EOF
  while (ifs.good()) { // or while(ifs)
    double v;
    ifs >> v;
    data.push_back(v);
  }
  return data;
}
```

Streams can be used in conditional expressions. (Check the comment above.)

`ifstream` destructor will automatically close the file when the `ifs` object goes out of scope. If it need to be closed, there is a member function `close()`.

## Variable Scope

A variable's scope is the part of the program where the variable is _accessible_.

- Narrow the scope as small as possible
  - Declare variables when/where you actually need them
  - Reduce bug, name conflicts, etc.
- When an object variable goes out of scope, its destructor is called automatically (only for non-primitive types)

## Function Arguments

Arguments are **pased by value** as a default. The function receives a copy of the arguments, not the original.

**Passing arguments by references** will be preferred when the data is too big to copy it.

```cpp
// use `&`
double compare_something_heavy(vector<double> &values) {
  //...
```

The function can change the original value when it passed by reference.

It is able to specify that argument's value cannot change by using `const` modifier.

```cpp
double compute_average(const vector<double> &values) {
  // Function signature need to be matched declaration and definition
  //...
```

## Guidelines

- Passing an object
  - Pass by reference and state `const` if there is no modification.
  - Pass by value if the mutation should not affect the caller.
- Passing a primitive
  - Pass by value because it is generally small and fast enough.
  - Pass by reference if it need to be modified.

## `const` and user-defined classes

Define `const` on member functions when the member functions are not mutating any data.

```php
class Point {
  // ...
  double get_x() const; // Accessors
  double get_y() const;
  // ...
}

double Point::get_x() const {
  // ...
}
// ...
```

---

## Coming up next
{class="no-number"}

- [Lecture 4](/note/cs-11-intro-cpp/lecture-4): GNU make, Doxygen
