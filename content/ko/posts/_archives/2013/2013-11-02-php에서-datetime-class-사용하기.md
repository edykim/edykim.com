---
title: PHP에서 DateTime Class 사용하기
author: haruair
type: post
date: "2013-11-02T12:07:22"
history:
  - 
    from: https://www.haruair.com/blog/1871
    movedAt: 2018-09-13T22:02:40+00:00
lang: ko
slug: using-datetime-class-in-php
categories:
  - 개발 이야기
tags:
  - datetime
  - php

---
PHP에서의 DateTime은 늘 문자열로 처리되어 `strtotime()`를 엄청나게 사용하게 되고, 기간 비교를 위해 timestamp를 직접 다뤄야 하는 번거로움 등 불편함을 다 적기에 시간이 부족할 정도다. 5.2.0 이후 지원되는 `DateTime`은 다른 언어들과 비교하면 아직 모자란 부분이 많이 있지만 그래도 쓸만한 구석은 거의 다 갖추고 있다. 모든 시간을 문자열로 다뤄 데이터의 의미를 제대로 살리지 못했던 과거에 비해, 더 읽기 쉽고 다루기 편한 코드를 작성하는데 도움이 된다.

PHP 5.2.0 이후 DateTime Class가 지원되기 시작했으며 버전이 계속 올라가면서 다양한 DateTime 관련 Class가 추가되었다.

  * DateTime (PHP 5 >= 5.2.0)
  * DateTimeImmutable (PHP 5 >= 5.5.0)
  * DateTimeInterface (PHP 5 >= 5.5.0)
  * DateTimeZone (PHP 5 >= 5.2.0)
  * DateInterval (PHP 5 >= 5.3.0)
  * DatePeriod (PHP 5 >= 5.3.0)

## 짧은 요약

  * 버전이 5.3.0 이상은 되야
  * 문자열로 DateTime을 사용하는 것에 비해 훨씬 편리
  * 시간 비교가 편리해짐
  * 타임존 변경이 비교적 편리해짐

<!--more-->

## 살펴보기

`DateTime` 클래스는 문자열로 바로 선언해 사용할 수 있으며 `setDate()`, `setTime()` 같은 메소드도 지원한다. [^1]

    $now = new DateTime();
    $yesterday = new DateTime('yesterday');
    $birthday = new DateTime('1988-06-08');
    

출력은 기존에 `date()` 함수를 사용하던 것과 유사하다. `format()` 메소드를 통해 문자열 format을 지정해 출력할 수 있다.

    print $now->format('Y-m-d H:i:s');
    

선언한 DateTime에 시간을 더하거나 뺄 때는 `DateInterval` 클래스를 활용할 수 있다. [^2]

    $date = new DateTime('2013-12-24');
    
    $term = new DateInterval('P100D');
    $date->sub($term);
    print $date->format('Y-m-d'); // 2013-09-15
    
    $date->add(new DateInterval('P1M10D'));
    print $date->format('Y-m-d'); // 2013-10-25
    

또한 기간끼리의 비교도 간편하게 지원한다. `diff()`를 활용해 기간을 비교할 수 있다. [^3]`diff()`는 `DateInterval` 객체를 반환한다.

    $now = new DateTime();
    $birthday = new DateTime("1988-06-08");
    $diff = $now->diff($birthday);
    print $diff->days;
    

`DateTime`으로 생성되는 시간은 시스템에 설정된 시간대를 기준으로 생성된다. [^4]`DateTimeZone` 클래스를 이용해 시간대를 지정할 수 있으며 지정할 때는 `setTimezone()` 메소드를 이용하면 된다.

    $date = new DateTime("now");
    print $date->format("c");
    $date->setTimezone(new DateTimeZone("Asia/Seoul"));
    print $date->format("c");
    $us_date = new DateTime("now", new DateTimeZone("US/Eastern"));
    print $date->format("c");
    

주의해야 할 부분은 일광절약시간을 사용하는 지역이다. 일광절약시간(Daylight saving time)을 사용하는 경우 1년에 특정 시간이 2번 나타나거나 아예 안나타나는 시간이 존재한다. 예를 들면 호주 멜번에서는 2014년 4월 6일 일광절약시간이 종료되는데 그로 인해 새벽 2시가 2번 나타나야 한다.

    $term = new DateInterval("PT1H");
    $au_date = new DateTime("2014-04-06 00:00:00",
                            new DateTimeZone("Australia/Melbourne"));
    
    print $au_date->format("c");  // 2014-04-06T00:00:00+11:00
    $au_date->add($term);
    print $au_date->format("c");  // 2014-04-06T01:00:00+11:00
    $au_date->add($term);
    print $au_date->format("c");  // 2014-04-06T02:00:00+10:00
    

일광절약시간 해제는 정상적으로 되지만 2시는 두번 나타나지 않는다. 이런 문제는 시간을 UTC로 다뤄야 해결할 수 있다.

    $term = new DateInterval("PT1H");
    $utc = new DateTimeZone("UTC");
    $melb = new DateTimeZone("Australia/Melbourne");
    
    $utc_date_before = new DateTime("2014-04-05 15:00:00", $utc);
    $utc_date_before->setTimezone($melb);
    
    $utc_date_after = new DateTime("2014-04-05 16:00:00", $utc);
    $utc_date_after->setTimezone($melb);
    
    print $utc_date_before->format("c");  // 2014-04-06T02:00:00+11:00
    print $utc_date_after->format("c");   // 2014-04-06T02:00:00+10:00
    

이런 경우 `DateTimeImmutable` 클래스를 사용하면 좀 더 편리하다. 이 클래스는 객체를 변경하지 않는 대신 새 객체를 반환한다.

    $term = new DateInterval("PT1H");
    $utc = new DateTimeZone("UTC");
    $melb = new DateTimeZone("Australia/Melbourne");
    
    $utc_date = new DateTimeImmutable("2014-04-05 15:00:00", $utc);
    $utc_date_after = $utc_date->add($term);
    
    print $utc_date->setTimezone($melb)->format("c");
                                            // 2014-04-06T02:00:00+11:00
    print $utc_date_after->setTimezone($melb)->format("c");
                                            // 2014-04-06T02:00:00+10:00
    

마지막으로 `DatePeriod` 클래스는 반복문에서 유용하게 사용되는 클래스다. 일정 기간동안 특정 주기를 반복적으로 처리할 때 유용한 클래스며 5.0.0 에서 추가된 Traversable 내장 클래스를 상속하는 클래스다. 특히 주기를 [상대적인 포맷(Relative formats)][1]을 사용해 작성할 수 있다.

    $begin = new DateTime('2013-01-01 00:00:00');
    $end = new DateTime('2013-12-31 23:59:59');
    $interval = DateInterval::createFromDateString('next monday');
    
    $period = new DatePeriod($begin, $interval, $end, DatePeriod::EXCLUDE_START_DATE);
    
    foreach ($period as $dt){
        echo $dt->format("l Y-m-d") . "\n";
    }
    

* * *

## 시간을 다루는 편리한 방법, 단 버전이 된다면

이상으로 PHP에서 쉽게 시간을 다룰 수 있도록 하는 클래스인 `DateTime`을 살펴봤다. 몇 클래스는 5.5.0 이상에서만 지원하고 있기 때문에 바로 사용하긴 어려울 수 있을지도 모르겠다. 하지만 PHP에서 시간을 문자열로 다루는 것은 여전히 번거로운 작업이므로 적극적으로 도입해야 하지 않나 생각이 든다. 환경이 5.3.0 이상이라면 꼭 사용해보도록 하자.

이 글은 [PHP 레퍼런스의 datetime 항목][2]을 토대로 정리했다. 자세한 내용은 해당 메뉴얼을 살펴보면 확인할 수 있다.

[^1]:    
    DateTime class <http://www.php.net/manual/en/class.datetime.php>

[^2]:    
    DateInterval class <http://www.php.net/manual/en/class.dateinterval.php>

[^3]:    
    DateTime diff method <http://www.php.net/manual/en/datetime.diff.php>

[^4]:    
    date\_default\_timezone_get() 함수를 통해 현재 설정된 타임존을 확인할 수 있다.

 [1]: http://php.net/manual/en/datetime.formats.relative.php
 [2]: http://www.php.net/manual/en/book.datetime.php