---
title: "서브타이핑, 서브클래스, 개체 지향 프로그래밍의 문제"
author: haruair
type: post
date: "2022-07-24T14:12:51.963Z"
lang: ko
tags:
  - 개발 이야기
  - 번역
  - OOP
slug: "subtyping"
---

Oleg Kiselyov의 글, [Subtyping, Subclassing, and Trouble with OOP](https://okmij.org/ftp/Computation/Subtyping/)를 번역했습니다.

---

## OOP의 인터페이스는 정말 구현과 분리되나요?

구현과 추상을 분리하는 것은 좋은 디자인의 궁극적인 목표 중 하나입니다. 일반적으로 개체 지향 프로그래밍(Object-oriented programming)과 캡슐화(encapsulation)를 통해서 그런 분리를 구현할 수 있다고 주장하며 그로 인해 더 안정적인 코드가 가능하다고 이야기합니다. 최종적으로 프로그래밍 방법론을 진정으로 평가하기 위해서 봐야 할 부분은 생산성과 품질입니다. 이 글은 간단한 예제를 통해서 개체 지향 프로그래밍이 정말 구현을 인터페이스와 분리할 수 있는지 확인합니다. 서브클래스와 서브타입의 차이를 이 예제에서 확인할 수 있습니다. 이 글은 우수한 소프트웨어 공학을 따르는 것으로 시작합니다. 그러므로 좋은 결과가 나오지 않으면 썩 좋은 기분은 아니겠죠.

이 글에서는 좀 더 "실제적인" 예제를 다루는데 촛점을 두고 있어서 직접 실행하고 결과를 볼 수 있습니다. 다만 예제이기 때문에 특정 언어로 구현하기는 해야 해서 여기서는 C++를 사용했습니다. 하지만 다른 개체 지향 언어(자바, 파이썬 등)에서도 비슷한 코드와 유사한 결론을 내리게 될 겁니다.

`Bag`을 구현하는 일감을 받았다고 가정해봅니다. 이 `Bag`은 순서 없는 컬랙션으로 중복된 내용을 포함할 수 있습니다. (예시에서는 정수 integer를 사용합니다.) 다음과 같은 인터페이스를 따릅니다.

```cpp
typedef int const * CollIterator; // 원시적이나 동작합니다
class CBag {
  public:
    int size(void) const;             // bag 안에 있는 엘리먼트의 수
    virtual void put(const int elem); // bag 안에 엘리먼트 넣기
    int count(const int elem) const;  // 제시한 엘리먼트가 bag 안에 몇 차례나
                                      // 나타나는지 확인
    virtual bool del(const int elem); // 제시한 엘리먼트를 bag에서 제거
                                      // 존재하지 않으면 false 반환
    CollIterator begin(void) const;   // 표준 열거자 인터페이스
    CollIterator end(void) const;

    CBag(void);
    virtual CBag * clone(void) const; // bag 복사
  private:
    // 구현 상세는 생략합니다
}
```

다음은 CBag의 내부 구현을 모르고도 작성할 수 있는 유용한 CBag의 연산자입니다. CBag의 공개 인터페이스만 갖고 다음 함수를 작성할 수 있습니다.

```cpp
// 표준 "print-on" 연산자
ostream& operator << (ostream& os, const CBag& bag);

// 두 bag을 병합합니다.
// 서브클래스의 복잡함을 피하기 위해 반환 타입은 void로 지정합니다.
// (현재 예시에서는 부수적인 부분이기 때문입니다)
void operator += (CBag& to, const CBag& from);

// a가 b의 하위 bag인지 판단합니다.
bool operator <= (const CBag& a, const CBag& b);

inline bool operator >= (const CBag& a, const CBag& b)
{ return b <= a; }

// bag의 구조적 동치를 확인합니다.
// 만약 동일한 갯수의 동일 엘리먼트를 반환하면 동일한 백입니다.
inline bool operator == (const CBag& a, const CBag& b)
{ return a <= b && a >= b; }
```

강조하고 싶은 부분은 CBag의 세부적인 구현을 알아야 하는 기능 수를 최소가 되도록 패키지를 설계했다는 점입니다. [검증 코드](http://okmij.org/ftp/packages/subclassing-problem.tar.gz)에서는 모든 CBag 패키지에 있는 모든 함수와 메소드를 테스트했고 일반적인 무공변성(invariant)을 검증했습니다.

이제 Set 패키지를 만들어야 한다고 지시를 받았다고 칩시다. 상사가 설명하기를 set은 순서 없는 컬렉션으로 각 엘리먼트는 꼭 하나만 존재해야 한다고 합니다. 즉, 중복이 없는 bag을 구현하려고 합니다. 이제 CBag 패키지를 보면 몇 가지 추가적인 변경이 필요하다는 걸 알게 될겁니다. bag을 활용해 Set을 정의한다면 CBag의 코드를 몇 가지 제약과 함께 재사용해서 간단하게 작성 할 수 있을 것으로 판단했습니다.

```cpp
class CSet : public CBag {
  public:
  bool memberof(const  int elem) const { return count(elem) > 0; }

  // CBag::put을 오버라이드 합니다
  void put(const int elem)
  { if (!memberof(elem)) CBag::put(elem); }

  CSet * clone(void) const
  { CSet * new_set = new CSet(); *new_set += *this; return new_set; }
  CSet(void) {}
}
```

CSet과 CBag을 섞어 쓸 수 있게 CSet이 정의되었습니다. 다시 말하면 `set += bag;`이나 `bag += set;`도 동작합니다. 이런 연산자는 잘 정의가 되어 있어서 set은 각 엘리먼트가 딱 하나만 있도록 숫자를 세고 있게 구현되어 있습니다. 예를 들어서 `set += bag;`은 bag에 있는 모든 엘리먼트 중 이미 없는 것만 set에 추가합니다. `bag += set;`은 다른 bag과 병합하는 것과 다르지 않습니다.

CSet의 모든 메소드를 검증하는 테스트를 작성할 수 있을겁니다. (새로 작성한 것이나 bag에서 상속받은 것을 말이죠.) 일반적인 속성도 검증할 수 있습니다. 예를 들면 `a+=a`는 `a`입니다.

제 패키지에는 다음처럼 함수를 정의하고 구현했습니다.

```cpp
// 예시 함수. 3개의 bag (a, b, c)를 받아서 a+b가 c의 하위 bag인지 검사.
bool foo(const CBag& a, const CBag& b, const CBag& c)
{
  CBag & ab = *(a.clone()); // 먼저 다른 영향이 없도록 복제합니다.
  ab += b;                  // ab는 이제 a와 b의 병합 bag이 됩니다.
  bool result = ab <= c;
  delete &ab;
  return result;
}
```

이 코드는 회귀 테스트에서 검증되었습니다. set으로 동일하게 작성해도 동작하는 것을 확인할 수 있습니다.

이후에 `ab` 개체가 불필요하게 힙 영역을 잡아먹는 것을 발견했습니다. 이 비효율을 개선하기 위해 다음처럼 다시 작성했습니다.

```cpp
bool foo(const CBag& a, const CBag& b, const CBag& c)
{
  CBag ab;
  ab += a;
  ab += b;
  bool result = ab <= c;
  return result;
}
```

원래의 `foo()`와 완전히 동일한 인터페이스를 갖고 있습니다. 코드는 거의 변경하지 않았습니다. CBag 패키지만 생각한다면 새로운 구현도 동일하게 동작합니다. 하지만 저는 누가 제 CBag 패키지를 가져다가 쓰고 있는지 전혀 모릅니다. 여기서는 `foo()`를 대상으로 회귀 테스트를 다시 구현했고 모든 결과가 정상으로 나왔습니다.

하지만 새로 구현한 `foo()`와 함께 코드를 돌리면 무언가 달라졌다는 점을 알게 될 겁니다! 직접 [코드 전체](http://okmij.org/ftp/packages/subclassing-problem.tar.gz)를 받아서 확인해보세요. `vCBag1`와 `vCBag2`를 만들어서 `foo()` 함수의 첫 구현과 두 번째 구현을 대상으로 테스트를 검증해보세요. 두 테스트는 모두 성공함과 동시에 동일한 결과를 반환합니다. 이제 `vCSet1`과 `vCSet2`를 만들어서 CSet 패키지를 테스트합니다. `foo()` 테스트만 제외하고 모두 성공할 겁니다. 이상하게도 `foo()` 결과가 달라졌습니다. 어느 `foo()` 구현이 CSet에 맞는 답을 반환하고 있는지는 논의의 여지가 있습니다. 어떤 쪽이 맞는 답이든 간에 순수 함수 `foo()`가 동일한 인터페이스를 따르고 있다면 잘 동작하는 코드를 고장내는 일은 없어야 할겁니다. 무슨 일이 일어난 걸까요?

특히 이 문제는 두 구현이 모두 교과서적인 방식대로 이뤄졌기 때문에 더 심란합니다. 안전하게 타입을 확인하고 코드를 작성했습니다. 캐스팅도 하지 않았습니다.  g++ (2.95.2) 컴파일러를 사용하면서 `-W`와 `-Wall` 플래그를 활성화해도 경고 하나 존재하지 않습니다. 평소에는 엄청 귀찮게 만드는 플래그인데도 말이죠. 고의적으로 고장내려고 `CBag`의 메소드를 수정하거나 한 것도 아닙니다. `CBag`의 무공변성을 유지하기도 했습니다. (필요에 따라서 약간 약화시킨 부분도 있지만요.) 실제 세계의 클래스라면 대수학의 속성보다 더 불분명한 형태로 작성될 겁니다. 여기서는 CBag과 CSet 모두 회귀 테스트를 작성했고 테스트를 통과했습니다. 여기서 인터페이스와 구현을 분리하려는 모든 노력이 실패로 돌아갔습니다. 프로그래밍 언어나 프로그래밍 방법론이 이 문제에 대한 책임이 조금이라도 있는 건 아닐까요?

## 서브타입과 서브클래스

CSet의 문제점은 CSet의 디자인이 리스코프 치환 원칙(Liskov substitution principle, LSP)를 위반했기 때문입니다. CSet은 CBag의 서브클래스로 선언되었습니다. 그러므로 C++ 컴파일러의 타입체커는 CSet 개체를 전달하거나 함수에서 CSet 참조를 수행할 때 CBag 개체나 참조도 문제 없이 통과시킵니다. 그러나 CSet은 CBag의 서브타입이 아닙니다. 이 부분은 아래에서 간단한 증명으로 살펴보겠습니다.

Bags와 Sets를 순수 _값_ 으로 고려해서 어떤 상태나 고유한 동작을 수행하지 않는 형태로 만드는 것도 한 방식이 될 수 있습니다. 즉, 정수처럼 다룬다는 이야기죠. (이 [문제 해결 글](https://okmij.org/ftp/Computation/Subtyping/Preventing-Trouble.html)에서 다룹니다.) 또 다른 방식은 개체 지향 프로그래밍으로 개체에 상태와 동작을 캡슐화 하는 접근법입니다. 동작의 의미는 개체가 메시지를 받거나 응답을 보내고, 상태도 변경할 가능성도 있다는 뜻입니다. Bag과 Set의 관계는 제쳐두고 둘을 따로 생각해봅시다. 여기서는 논의를 조금 더 명확하게 하기 위해서 간결한 표기법을 활용하겠습니다.

Bag을 개체로 정의하고 두 메시지를 받는다고 가정합니다.

```lisp
(send a-Bag 'put x)     ; x 엘리먼트를 bag에 넣습니다.
(send a-Bag 'count x)   ; x 엘리먼트가 몇 개 있는지 확인합니다.
                        ; 그 과정에서 상태를 변경하지 않습니다.
```

이제 Set도 비슷하게 정의합니다.

```lisp
(send a-Set 'put x)     ; x 엘리먼트를 set에 (존재하지 않으면) 넣습니다.
(send a-Set 'count x)   ; x 엘리먼트가 set에 몇 개 있는지 확인합니다.
                        ; (항상 0 또는 1이 나옵니다.)
```

이제 함수를 생각해봅시다.

```lisp
(define (fnb bag)
  (send bag 'put 5)
  (send bag 'put 5)
  (send bag 'count 5))
```

이 함수의 동작은 다음처럼 정리할 수 있습니다. "Bag이 하나 제공되면 두 엘리먼트를 추가하고 반환한다."

```lisp
(+2 (send orig-bag 'count 5))
```

기술적으로는 `fnb` 함수에 Set 개체를 전달하는 것이 가능합니다. Bag이 `put`과 `count` 메시지를 이해할 수 있는 것처럼 Set도 이해하기 떄문입니다. 하지만 `fnb`에 Set 개체를 넣으려고 하면 위에서 명시된 것처럼 함수의 사후 조건(post-condition)을 어기게 됩니다. 그러므로 set 개체를 bag 개체가 필요한 곳에 넣으면 어떤 프로그램에서 기대했던 동작이 달라지게 됩니다. 리스코프 치환 원칙(LSP)에 따르면 Bag을 Set으로 치환할 수 없고 Set은 Bag의 서브타입이 될 수 없습니다.

다음 함수를 고려해봅니다.

```lisp
(define (fns set)
  (send set 'put 5)
  (send set 'count 5))
```

이 함수의 동작은 이렇습니다. "Set이 하나 제공되면 엘리먼트를 하나 추가하고 1을 반환한다." 이 함수에 bag을 전달하면 `fns` 함수는 1보다 큰 수를 반환할 수도 있습니다. (왜냐면 bag도 `put`과 `count`를 구현하고 있기 때문입니다.)

그러므로 개체지향 관점에서 본다면 Bag과 Set은 어느 쪽의 서브타입도 아닙니다. 이게 이 문제에서 가장 중요한 부분입니다. Bag과 Set은 단지 닮았을 뿐입니다. Bag과 Set의 인터페이스와 구현은 그 유사성 때문에 서로를 서브타입으로 삼으려고 합니다. 다만 그렇게 서브타입으로 만드는 것으로 LSP를 위반하게 됩니다. 위에서처럼 눈에 잘 띄지 않는 오류를 마주할 각오를 해야만 할겁니다. 위에서 든 예제는 LSP를 의도적으로 어겨서 어떻게 교활한 오류를 만들어 내는지, 그리고 얼마나 찾아내는데 어려운지 보여줬습니다. Set과 Bag은 아주 비슷하면서도 간단한 타입으로 실무에서 만나게 될 코드보다 훨씬 단순한 예시입니다. OOP의 관점에서 봤을 때 LSP는 명확하게 들어나지 않는 부분인 것을 감안해야 합니다. 컴파일러가 이 문제를 지적해주리라고 기대하기는 어렵습니다. 회귀 테스트에도 의존할 수 없습니다. 수작업으로 직접 문제를 봐야만 알 수 있습니다.

### 서브타입과 불변성

누구는 이렇게 얘기할 수도 있습니다. "Set은 Bag이 아니지만 불변 Set은 불변 Bag입니다", 라고 말이죠. 하지만 그렇지도 않습니다. 불변성을 얘기한다고 하더라도 파생된 데이터 클래스를 서브타입으로 고려할 수는 없습니다. 앞서 예제와는 조금 다른 다음 코드를 살펴봅시다. 다시 C++ 코드로 보겠지만 다른 코드로 작성하더라도 이 예제는 동일할 겁니다.

```cpp
class BagV {
  virtual BagV put(const int) const;
  int count(const int) const;
  // ... // 다른 유사한 const 멤버
}

class SetV {
  virtual SetV put(const int) const;
  int count(const int) const;
  // ... // 다른 유사한 const 멤버
}
```

BagV와 SetV의 인스턴스는 불변입니다. 하지만 각 클래스는 여전히 서로의 서브타입이 아닙니다. 다음과 같은 폴리모픽(polymorphic) 함수를 생각해봅시다.

```cpp
template <typename T> int f(const T& t)
{ return t.put(1).count(1); }
```

BagV 인스턴스에서 다음 함수의 동작은 무공변적으로 표현할 수 있습니다.

```
f(bag) == 1 + bag.count(1)
```

만약 `asetv = SetV().put(1)`처럼 할당하고 `f()`에 전달하면 위의 무공변성을 어기게 됩니다. 정리하면 이렇습니다. LSP에 의해서 SetV는 BagV를 치환할 수 없습니다. 그러므로 SetV는 BagV가 아닙니다.

위 함수를 다시 정의하면 이렇습니다.

```cpp
int fb(const BagV& bag) { return bag.put(1).count(1); }
```

물론 SetV 인스턴스를 지금도 이 함수에 넣을 수는 있습니다. 예를 들면 SetV를 BagV의 서브클래스로 만들거나 `reinterpret_cast<const BagV&>(aSetV)`식으로 집어넣을 수 있습니다. 이렇게 작성하면 오류가 발생하지는 않지만 `fb()`의 무공변성을 깨고 프로그램의 동작을 예측할 수 없는 방향으로 바꾸게 됩니다. "BagV는 SetV의 서브타입이 아니다", 라는 명제에도 유사한 논의가 가능합니다.

C++ 개체는 레코드 기반입니다. 서브클래스는 래코드를 확장하는 방법이며 부모 레코드의 일부를 수정할 가능성이 존재합니다. 이 일부 영역에 대해서는 수정이 가능하다는 명시적인 표시를 위해 `virtual` 키워드를 사용합니다. 이 맥락에서 보면, 변형을 방지하면서도 동작을 덮어 쓸 수 있게 했지만 동시에 서브클래스가 서브타입을 수반하게 만듭니다. 이게 [B규칙이 존재하는 이유](https://okmij.org/ftp/Computation/Subtyping/Preventing-Trouble.html)입니다.

하지만 개체의 상태를 불변성으로 선언하는 것만으로는 서브타입으로 파생되지 않도록 보장하기에 충분하지 않습니다. 개체는 부모를 직접 수정하지 않고도 부모의 동작을 덮어쓸 수 있습니다. 개체가 함수 클로저처럼 메시지를 받을 때 응답형으로 콜백 등의 핸들러가 있거나 프로토타입 기반의 개체지향 시스템에서는 부모 클래스를 수정하지 않고도 동작을 조작할 수 있습니다. 파생 개체가 기반 개체를 수정할 수 있다면 동작 덮어쓰기를 암묵적으로 허용하는 것이나 마찬가집니다. 예를 들어 A 개체가 내부에 B 개체를 저장해놓고 M 메시지를 받을 때마다 B 개체에 전달해주는 경우를 생각해봅시다. A 개체에서 파생한 C 개체가 그 내부 동작을 덮어쓴다면 여전히 M 메시지를 받으면서도 다른 형태로 동작하게 됩니다.

예를 들면 [Scheme에서 순수 함수형 개체지향 시스템](http://okmij.org/ftp/Scheme/index.html#pure-oo)을 구현할 수 있습니다. 개체의 독자성, 상태, 동작, 상속과 다형성까지 지원하며 시스템 내 모든 것이 불변입니다. 하지만 여전히 BagV와 같은 것도 정의할 수 있으며 SetV를 put 메시지 핸들러를 덮어쓰는 방식으로 파생시켜 사용하는 것도 가능합니다. 다만 이런 접근 방식은 여기서도 좋지 않고 앞서 LSP를 어겼을 때 나타나는 문제와 유사합니다. 이 예시는 불변성 또한 개체 파생에서 나타나는 서브타이핑 문제에 자유롭지 않다는 점을 보여줍니다.
