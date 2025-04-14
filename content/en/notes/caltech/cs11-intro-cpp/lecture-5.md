---
title: "CS11 Intro C++: Lecture 5"
author: haruair
uuid: "6237f327-123d-4eb7-ad0c-c50429510fc3"
type: page
date: "2020-05-18T17:00:00"
lang: en
url: /note/cs-11-intro-cpp/lecture-5
linkToParent: true
tags:
  - cs11
---

## Operator Overloading

```cpp
Complex c1{5, 2}, c2{-4, 4};
Complex c3 = c1 + c2;

// Compiler sees:
Complex c3 = operator+(c1, c2);
operator<<(cout, c3);
```

### non-member operator overloads

```cpp
Complex operator+(const Complex &lhs,
                  const Complex &rhs) {
    return Complex{lhs.real() + rhs.real(),
                   lhs.imag() + rhs.imag()};
}
Complex c3 = operator+(c1, c2);
// Operator-overload is provided as a separate function
// defined outside of the class
```

### member operator overloads

```cpp
class Complex {
  double re, im;
public:
  Complex operator+(const Complex &rhs) const {
    return Complex{re + rhs.re, im + rhs.im};
  }
};

Complex c3 = c1.operator(c2);
// Operator-overload is specified as a member function on the type
// LHS of the operation is the obj that the function is called on
```

### Comparison

```cpp
Complex c3 = operator+(c1, c2); // non-member
Complex c3 = c1.operator+(c2);  // member
```

Member operator overload is unavailable in some cases e.g. c1 is primitive.

### Tips

Use other implementation by switching the order of operation. Also, it is great to implement this way when operators are opposite meaning.

```cpp
Complex operator+(const Complex &c, double v);
Complex operator+(double v, const Complex &c);

Complex operator+(const Complex &c, double v) {
  // do the operator work
}
Complex operator+(double v, const Complex &c) {
  return c + v; // swap and use the other operator
}
```

## Complex Constructors

```cpp
// all the cases
Complex(double re, double im);
Complex(double re);
Complex();
// or, single constructor with default value
Complex(double re = 0, double im = 0);
```

## Implicit Conversion on Constructors

```cpp
Complex(double re = 0, double im = 0);
Complex operator+(const Complex &, const Complex &) { /* ... */ };
Complex c1{5, 3};
Complex c2 = c1 + 4;
// compilter will automatically convert this way
Complex c2 = operator+(c1, Complex{4});
```

## Artimetic Assignment

```cpp
Complex & Complex::operator+=(const Complex &rhs) {
  re += rhs.re;
  im += rhs.im;
  return *this;
};

Complex c1{10, -5}, c2{3, 4};
c1 += c2; // c1 = {13, -1}
```

`*this` dereferences the pointer to get to the object itself.

```cpp
Complex operator+(const Complex &lhs, const Complex &rhs) {
  return Complex{lhs} += rhs;
}
```

## Output Stream

- Output your type's value in some clean, simple way
- Do not output any newlines
- Return `ostream` reference as the function's return-value

```cpp
Complex c3 = c1 + c2;
cout << c3 << "\n";
```

```cpp
// `ostream` is in the standard library so it is unable to create
// member overload.
ostream & operator<<(ostream &os, const Complex &c) {
  os << "(" << c.real() << "," << c.imag() << ")";
  return os;
}
```

Expression is evaluated from left to right. Each `operator<<` call returns the output-stream, so that the next `operator<<` call can use it for output.

---

## Coming up next


- [Lecture 6](/note/cs-11-intro-cpp/lecture-6): Copy and assignment operator with Heap, Inline
