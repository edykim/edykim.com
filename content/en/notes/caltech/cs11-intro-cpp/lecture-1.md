---
title: "CS11 Intro C++: Lecture 1"
author: haruair
type: page
date: "2020-05-18T11:28:00"
lang: en
url: /note/cs-11-intro-cpp/lecture-1
linkToParent: true
---

## Books!

Books from Bjarne Stroustrup.

- [A Tour of C++ 2nd ed.](http://www.stroustrup.com/tour2.html) if you know what you do or
- [Programming: Principles and Practice Using C++](http://www.stroustrup.com/programming.html)

## Compilers

- GNU g++: Linux, Windows with cygwin, `gdb`
- LLVM clang++: Apple MacOSX, `lldb`

Specify c++ version using `-std` flag, e.g. `g++ -std=c++14`.

## Philosophy

- **"Close to the problem to be solved"**: abstractions, modularity
- **"Close to the machine"**: ability to handle low levels
- "You don't pay for what you don't use"

## Hello World

```cpp
// hello.cpp
#include <iostream>
using namespace std;

int main() {
  // print string using stream IO
  cout << "Hello, World!" << endl;
  return 0; // 1..63 for error
}
```

## Compile

```bash
> g++ -std=c++14 -Wall hello.cpp -o hello
> ./hello
```

## `<<` and `>>` operator

It means "shift left or right" to the stream.

```cpp
string name = "Hello";
cout << "name = " << name << endl;
cin >> name;
```

## Namespaces

**Namespaces** are used to group related items. All standard library is in `std` namespace.

```cpp
std::string name; // this form is called `qualified name`
```

## Classes

Classes are made up of **members**.

- Data members
- Member functions
  - Constructors: For initializing a new instance.
  - Destructors: For cleaning up. Only one, no args, no return.
  - Accessors: retrieve internal states
  - Mutators: modify internal states
- Declaration: describes member variables, functions, access constraints. It's in the header file. (`.h`)
- Definition: specifies the behavior. (`.cpp`)

### Abstraction

- Present a clean, simplified interface
- Hide unnecessary detail from users of the class

### Encapsulation

- Allow an object to protect its internal state from external access and modification
- The object itself governs all internal state-changes
- Methods can ensure only valid state changes (validation, sanitization)

### Access Modifiers

- `public`
- `private`: a default access level.
- `protected`

## Example: `Point` class

A declaration of `Point` class in the header file:

```cpp
// `point.h`: A 2D point class
class Point {
  double x, y; // Data-members
public:
  Point(); // Constructors
  Point(double x, double y);
  ~Point(); // Destructor
  double get_x(); // Accessors
  double get_y();
  void set_x(double x); // Mutators
  void set_y(double y);
}
```

A definition of `Point` class in the cpp file:

```cpp
#include "point.h"

// Default (no-argument) constructor
Point::Point() {
  x = 0;
  y = 0;
}

// Two-args constructor - sets point to (x, y)
Point:: Point(double x, double y) {
  // Because of variable shadowing, use `this` pointer
  // for resolving ambiguity of the code.
  this->x = x;
  this->y = y;
}

// Cleans up a Point object
Point::~Point() {
  // nothing to do
}

// Returns x of a Point
double Point::get_x() {
  return x;
}
double Point::get_y() {
  return y;
}
void Point::set_x(double x) {
  this->x = x;
}
void Point::set_y(double y) {
  this->y = y;
}
```

Usage of `Point` class:

```cpp
#include "point.h"

Point p1;
Point p2{3, 5};
cout << "P2 = (" << p2.get_x() << ", " << p2.get_y << ")\n";
p1.set_x(210);
p1.set_y(100);

// Compiler reports an error because of the  access-level.
p1.x = 452;
```

## `std::string` class

```cpp
#include <string>
// with many features over `char*` string
```

```cpp
string name;
cout << "What is your name? ";
cin >> name;
cout << "Hello " << name << ".";

string favorite_color{"green"};
string mood = "happy";
mood = "cheery";
```

---

## Coming up next


- [Lecture 2](/note/cs-11-intro-cpp/lecture-2): Build phase, structs & vector, exception handling
