---
title: "CS11 Intro C++: Lecture 4"
author: haruair
type: page
date: "2020-05-18T16:00:00"
lang: en
url: /note/cs-11-intro-cpp/lecture-4
linkToParent: true
---

## Build Automation

`make` is a standard tool for automating builds.

- `Makefile`
- **build targets**, specfies its **dependencies**
- Only Tab indentation works
- `make` will only build what is _needed_ by file's modified date
  - Use `touch units.cpp` when it need to rebuild

```Makefile
convert : units.o convert.o
	g++ -std=c++17 -Wall units.o convert.o \
		-o convert

units.o : units.cpp units.h
	g++ -std=c++17 -Wall -c units.cpp

... (more rules)

clean :
	rm -f convert hw3testunits *.o *~
```

Usually, the first target in the makefile is named `all`, and it builds everything of interest.

```Makefile
all : convert hw3testunits
```

Specify one or more build targets to `make`.

```bash
> make clean convert
```

### Build Targets

- Real Build Target: a real file such as `units.o`
- Phony Build Target: e.g. `clean`
  - Use `.PHONY` to specify which targets are phony one

```Makefile
.PHONY: clean all
```

### Chains of Build Rules

`make` figures out the graph of dependencies. If the dependencies don't exist, `make` will use their build ruels to make them.

```makefile
convert : units.o convert.o
	g++ -std=c++14 -Wall units.o convert.o \
		-o convert

units.o : units.cpp units.h
	g++ -std=c++14 -Wall -c units.cpp
```

### Makefile Variables

```Makefile
# Usually ALL_CAPS
CONVERT_OBJS = units.o convert.o

convert : $(CONVERT_OBJS)
	g++ $(CONVERT_OBJS) -o convert
```

### Implicit Build Rules

There are built-in implicit build rules for the convenience.

- [GNU make - Using Implicit Rules](https://www.gnu.org/software/make/manual/html_node/Using-Implicit.html)
- [GNU make - Catalogue of Built-In Rules](https://www.gnu.org/software/make/manual/html_node/Catalogue-of-Rules.html)

e.g. if `foo.o` is a dependency but it doesn't have real build target, make look up the file and build it.

```Makefile
CONVERT_OBJS = units.o convert.o
all : convert hw3testunits

convert : $(CONVERT_OBJS)
	g++ -std=c++14 -Wall $(CONVERT_OBJS) \
		-o convert

clean :
	rm -f convert hw3testunits *.o *~

.PHONY : all clean
```

C++ compilation implicit rule:

```Makefile
%.o : %.cpp
	$(CXX) -c $(CPPFLAGS) $(CXXFLAGS) $< -o $@

# CXX: the compiler to use (g++ as a default)
# CPPFLAGS: the preprocessor flags
# CXXFLAGS: the compiler flags
```

So that,

```Makefile
CXXFLAGS = -Wall -std=c++14
CONVERT_OBJS = units.o convert.o
all : convert hw3testunits

convert : $(CONVERT_OBJS)
	$(CXX) $(CXXFLAGS) $(CONVERT_OBJS) \
		-o convert $(LDFLAGS)

clean :
	rm -f convert hw3testunits *.o *~

.PHONY : all clean
```

### Using Automatic Variables

- `%`: matches the filename
- **automatic variables** `$`
  - `$<`: the first prerequisite in the deps list
  - `$@`: the filename of the target
  - `$^`: a list of all prerequisites in the deps list

```Makefile
CXXFLAGS = -Wall -std=c++14
CONVERT_OBJS = units.o convert.o
all : convert hw3testunits

convert : $(CONVERT_OBJS)
	$(CXX) $(CXXFLAGS) $^ -o $@ $(LDFLAGS)

clean :
	rm -f convert hw3testunits *.o *~

.PHONY : all clean
```

## Doxygen: Automatic Document Generation

Write the comment and it converts to the document using [Doxygen](http://www.doxygen.nl/).

```bash
# Doxyfile is a default filename
> doxygen -g [filename]
```

```doxyfile
INPUT = .
OUTPUT_DIRECTORY = ./docs
PROJECT_NAME = HelloWorld
JAVADOC_AUTOBRIEF = YES
EXTRACT_ALL = YES
EXTRACT_PRIVATE = YES
EXTRACT_STATIC = YES
```

```cpp
/**
 * this is a comment
 *
 * @param name Description
 * @return something fun
 */

/** @file ... */

/** My widget */
MyWidget mw;
MyWidget mw; /**< My widget */
```

---

## Coming up next


- [Lecture 5](/note/cs-11-intro-cpp/lecture-5): Operator overloading, Constructors, Output Stream
