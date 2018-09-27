---
title: mysql의 enum 타입을 where절에서 사용하기
author: haruair
type: post
date: 2012-01-19T03:36:44+00:00
history:
  - 
    from: https://www.haruair.com/blog/1079
    movedAt: 2018-09-13T22:02:40+00:00
lang: ko
slug: using-the-mysql-enum-type-in-the-where-clause
categories:
  - 나의 이야기

---
    animal enum('코끼리','사자','호랑이','기린')
    

위와 같은 enum 필드가 있다고 하자.

    SELECT animal from tbl where animal < '호랑이'
    

이러면 `코끼리, 사자`가 출력될 것 같지만 `코끼리, 사자, 기린`이 출력된다. enum이 각각의 index값을 순서대로 가지는 것은 맞지만 **string으로 처리**되기 때문에 비교연산자 처리 결과가 이렇게 나온다.

만약 코끼리, 사자의 결과를 가지고 싶다면 아래와 같이 index 값으로 처리해준다.

    SELECT animal from tbl where animal < 4
    

index값이 궁금하다면 아래와 같이 확인할 수 있다. (물론 순서대로지만)

    SELECT animal+0, animal FROM tbl
    

자세한 내용은 MySQL의 [enum 문서][1]에서 확인할 수 있다.

 [1]: http://dev.mysql.com/doc/refman/5.6/en/enum.html