---
title: mysql에서 group by에 문자열 합치기
author: haruair
type: post
date: "2012-02-19T16:09:45"
history:
  - 
    from: https://www.haruair.com/blog/1212
    movedAt: 2018-09-13T22:02:40+00:00
lang: ko
slug: merging-strings-into-group-by-in-mysql
tags:
  - 나의 이야기

---
MySQL에서 문자열을 병합할 때 `concat()`을 사용할 수 있는데 `group by`로 묶은 쿼리에서 `concat()`을 사용하면 해당하는 행 중 하나의 값만 도출된다. 합친 문자열이 필요한 경우 `group_concat()`을 사용해야 한다.

    # `website` table
    type      name
    1         twitter
    1         facebook
    2         daum
    2         naver
    
    # select type, group_concat(name) as name from website group by type
    type     name
    1        twitter, facebook
    2        daum, naver
    

`Group by`에서 사용할 수 있는 함수는 다음의 [레퍼런스 문서][1]에서 확인할 수 있다.

 [1]: http://dev.mysql.com/doc/refman/5.7/en/group-by-functions.html