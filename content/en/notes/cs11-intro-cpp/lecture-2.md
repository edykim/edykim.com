---
title: "CS11 Intro C++: Lecture 2"
author: haruair
type: note
date: "2020-05-18T11:28:00"
lang: en
url: /note/cs-11-intro-cpp/lecture-2

---

## Compilation

```bash
> g++ -Wall -Werror units.cpp convert.cpp -o convert
```

1. Compiler performs preprocessing and compilation on `units.cpp` and `convert.cpp` separately: Produces `units.o`, `convert.o`
1. The linking phase combines the results of the compilation phase: `units.o` + `convert.o` = `convert`.
