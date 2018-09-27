---
title: PHP에서 커링 currying 함수 작성하기
author: haruair
type: post
date: 2018-01-27T01:55:11+00:00
history:
  - 
    from: https://www.haruair.com/blog/4149
    movedAt: 2018-09-13T22:02:42+00:00
lang: ko
slug: writing-a-curling-currying-function-in-php
categories:
  - 개발 이야기
tags:
  - curry
  - php

---
[JavaScript에서 커링 currying 함수 작성하기][1]를 다시 보다가 PHP로도 작성해봤다.

```php
function curry($fn) {
    $arity = (new ReflectionFunction($fn))-&gt;getNumberOfParameters();

    return ($resolver = function (...$memory) use ($fn, $arity, &$resolver) {
        return function (...$args) use ($fn, $arity, $resolver, $memory) {
            $local = array_merge($memory, $args);
            $next = count($local) &gt;= $arity ? $fn : $resolver;
            return $next(...$local);
        };
    })();
}
```

js 버전도 요즘 스타일로 작성하면 좀 더 간결할 것 같다. php와 js와의 차이점을 적어보면,

  * 함수에서 몇 개의 파라미터를 사용하는지 알아내기 위해 리플렉션을 사용했다.
  * js는 lexical scoping이지만 php에서는 스코프 내에서 사용할 컨텍스트를 명시적으로 적어줘야 한다.
  * 함수 내에서 named function을 선언할 수 있지만 이 함수에는 인자로 전달하지 않는 이상 스코프를 공유할 방법이 없다. 대신에 아직 선언되지 않은 변수명을 레퍼런스로 선언 내에 전달하고(`&$resolver`) `$resolver`에 익명 함수를 저장하는 것으로 스코프 내로 넣을 수 있다.
  * js에서는 배열도 passed by reference지만 php에서 배열은 passed by value다. 그래서 js 코드처럼 매번 slice 할 필요가 없다.

아래는 함수 작성하면서 사용한 테스트다.

```php
$nullary = curry(function() { return 1; });
assert($nullary() === 1, 'nullary failed');

$unary = curry(function($a) { return $a; });
assert($unary(2) === 2, 'unary with one param failed');

$binary = curry(function($a, $b) { return $a + $b; });
assert($binary(2)(10) === 12, 'binary, one and one param failed case 1');
assert($binary(2)(20) === 22, 'binary, one and one param failed case 2');
assert($binary(2, 20) === 22, 'binary, two param failed');

$ternary = curry(function($a, $b, $c) { return $a + $b + $c; });
assert($ternary(2)(10)(4) === 16, 'ternary, one and one and one param failed');
assert($ternary(2, 20)(2) === 24, 'ternary, two and one param failed');
assert($ternary(4)(2, 20) === 26, 'ternary, one and two param failed case 1');
assert($ternary(4)(4, 20) === 28, 'ternary, one and two param failed case 2');
assert($ternary(4, 4, 20) === 28, 'ternary, three param failed');

function ternary($a, $b, $c) {
    return $a + $b + $c;
}

$namedTernary = curry('ternary');
assert($namedTernary(2)(10)(4) === 16, 'named ternary, one and one and one param failed');
assert($namedTernary(2, 20)(2) === 24, 'named ternary, two and one param failed');
assert($namedTernary(4)(2, 20) === 26, 'named ternary, one and two param failed case 1');
assert($namedTernary(4)(4, 20) === 28, 'named ternary, one and two param failed case 2');
assert($namedTernary(4, 4, 20) === 28, 'named ternary, three param failed');
```

 [1]: http://www.haruair.com/blog/2993