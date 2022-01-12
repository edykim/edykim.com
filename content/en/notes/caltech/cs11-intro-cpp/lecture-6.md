---
title: "CS11 Intro C++: Lecture 6"
author: haruair
type: page
date: "2020-05-18T19:48:00"
lang: en
url: /note/cs-11-intro-cpp/lecture-6
linkToParent: true
tags:
  - cs11
---

## Copy constructor

```cpp
Complex c1{5, 2};
Complex c2{c1}; // Makes a copy!
```

```cpp
double magnitude(Complex c);
```

The copy constructor is used when objs are passed by value.

1. `c` is passed by value
1. A copy of `c` is made, and magnitude operats on the copy
1. The copy constructor is used

```cpp
Complex(const Complex &c);
// beacuse it is already copied from passing by value step
```

## Copy-assignment operator

```cpp
Complex c1{5, 2};
Complex c2;
c2 = c1;
```

```cpp
Complex & Complex::operator=(const Complex &c);
// return non-const reference to the LHS of the assignment,
// in order to support operator-chaning e.g. c3 = c2 = c1;
```

## Allocating an Object on the Heap

When you need a large chunk of memry, or you need to create objects that live beyond the lifetime of a specific function call, you can allocate memory from the heap.

```cpp
Complex *p = new Complex{3, 5};
cout << p.real() << ", " << p.imag();   // error
cout << p->real() << ", " << p->imag(); // OK!

delete p; // need to release it
// still contain the address but don't use it
```

```cpp
Complex *p = new Complex[1000];
// init objs with default constructor
// if there is no default one, unavailable to allocate

p[0].real();

delete[] p;
// `new` => `delete`, or `new[]` => `delete[]`
```

## Heap-Allocating Arrays of Primitives

No constructor or destructors so the values are uninitialized. If there is something at the memory location, there is a possibility that something is in the pointer eventually.

```cpp
double *array = new double[numValues];
for (int i = 0; i < numValues; i++)
  array[i] = 0;
delete[] array;
```

## Managing Heap-Allocated Memory

Simple Solution: Don't heap-allocate memory at all. Use `std::vector<T>`, `std::array<T>`, `std::string`, etc.

- Or, use **Resource Acquisition Is Initialization (RAII)** Pattern
  - Heap-allocate memory in class constructor (and in a very few other places)
  - Free memory in destructor
  - The object manage memory for you -- abstraction/encapsulation

## Array of Floats

```cpp
class FloatArray {
  int count;
  float *elem;
public:
  FloatArray(int n);
  ~FloatArray();
}

FloatArray::FloatArray(int n) {
  count = n;
  elems = new float[count];
  for (int i = 0; i < count; i++)
    elems[i] = 0;
}

FloatArray::~FloatArray() {
  delete[] elems;
}

float getAverage() {
  int numFloats;
  cin >> numFloats;
  FloatArray f{numFloats};
  for (int i = 0; i < numFloats; i++) {
    float value;
    cin >> value;
    f.set(i, value);
  }
  return f.average();
}

// after getAverage() called, destructor is called automatically
// so that heap memory allocated within f is freed
```

### Custom Copy Constructor

`FloatArray` stores elems on the heap. When it need to be copied, it will performs a **shallow copy**. Deep copy requires custom copy constructor.

```cpp
FloatArray::FloatArray(const FloatArray &f) {
  count = f.count;
  elems = new float[count];
  for (int i = 0; i < count; i++)
    elems[i] = f.elems[i];
}

FlatArray fa1{n};
FlatArray fa2{fa1};
```

### Custom copy-assignment operator

Assigning also needs a custom copy-assignment operator.

- **The Rule of Three**: If your class defines any of a dsestructor, a copy-constructor, and a copy-assignment operator, it probably needs to define all three. (`std::vector<T>`, `std::array<T>` is simple way to deal from these issues)
- **The Rule of Zero**: Write classes in such a way that you can rely on the default behavior of operations like the destructor, copy-constructor, copy-assignment, etc.

Make sure to release any dynamically-allocated resources, then allocate new res to receive the values from the RHS.

```cpp
FloatArray & FloatArray::operator=(const FloatArray &f) {
  delete[] elems; // Release old memory
  count = f.count;
  elems = new float[count]; // Allocate new memory
  for (int i = 0; i < count; i++)
    elems[i] = f.elems[i];

  // Return non-const reference to myself
  return *this;
}
```

Identify and handle self-assignment for avoiding waste.

```cpp
FloatArray & FloatArray::operator(const FloatArray &f) {
  // Detect and handle self-assignment
  if (this == &f)
    return *this;
  
  delete[] elems; // Release old memory
  count = f.count;
  elems = new float[count];
  for (int i = 0; i < count; i++)
    elems[i] = f.elems[i];

  // Return non-const refrence to myself
  return *this;
}
```

## `bool` Type

```cpp
bool operator==(const MyClass &c1, const MyClass &c2) {
  //...
}
bool operator!=(const MyClass &c1, const MyClass &c2) {
  return !(c1 == c2);
}
```

## Inline Functions

If a function is short and simple, the compiler can simply replace the function-invocation with the function's body rather than spend function invocations.

```cpp
// definition of functions as a part of the declaration
// no need to define the member functions in cpp file
class Complex {
  double re, im;
public:
  double real() const {
    return re;
  }
  double imag() const {
    return im;
  }
}

cout << c.real();
// Compiles into:
cout << c.re;
```

The compiler will inline function when it is simple and straightforward only.

Defines a top-level function with `inline` keyword (not a member-function in a class):

```cpp
// in the header file
inline book operator==(const Complex &c1, const Complex &c2) {
  return c1.real() == c2.real() && c1.imag() == c1.imag();
};
// without `inline`, it will return multiple definition errors
```

---

## Coming up next


- [Lecture 7](/note/cs-11-intro-cpp/lecture-7)
