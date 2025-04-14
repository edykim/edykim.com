---
title: pytz – 세계 시간대 정의를 위한 Python 라이브러리
author: haruair
uuid: "eb9e683b-9ebd-43d0-9483-6eb5327a3364"
type: post
date: "2013-09-08T09:17:57"
history:
  - 
    from: https://www.haruair.com/blog/1759
    movedAt: 2018-09-13T22:02:40+00:00
lang: ko
slug: pytz-python-library-for-world-time-zone-definition
tags:
  - 번역
  - 개발 이야기
  - python
  - pytz
  - timezone
  - 라이브러리
  - 시간대

---
근래 간단한 서비스를 만들고 있는데 시작부터 시간대로 인한 문제가 있어 이 기회에 제대로 살펴보게 되었다. 한국에서 개발할 때는 단 한번도 생각해본 적이 없던 시간대 문제에 대해서 찾아볼 수 있게 되어 참 좋았고, 국가가 시간대를 변경함에 따라 역사적으로 사라진 시간들이 존재한다는 점, 동부표준시(EST)와 미동부 시간대(US/Eastern)가 어떻게 다른가 등 상당히 재미있는 (다른 의미로 일관성 없는) 부분들이 있다는 것을 알게 되었다.

pytz는 Olson 시간대 데이터베이스를 기준으로 한, 역사적인 시간대와 현대적인 시간대를 모두 망라하고 있는 라이브러리다. 이 라이브러리 문서를 통해 시간대로 인해 발생할 수 있는 여러 경우를 살펴볼 수 있으므로 꼭 Python 개발자가 아니더라도 시간대 문제에 대해 관심이 있다면 살펴볼만한 이야기가 담겨져있다.

<!--more-->

특히 처음에 번역할 때 동부표준시와 미동부 시간대에 대해 정확한 이해가 없어서 대충 옮겼다가 전체적으로 다시 살펴보긴 했는데 여전히 오류가 있는 것 같아 앞서 그 차이를 밝혀두면, 미동부 시간대(US/Eastern)는 동부표준시인 EST와 동부일광절약시인 EDT를 교차로 사용한다. EDT 없이 EST만 사용하는 곳도 존재한다.

결론적인 부분을 먼저 적어보면, UTC로 모든 시간을 관리하고 사용자에 따라 각 시간대에 맞춰 출력해주는 방식이 시간을 다루는 가장 좋은 방법이다. (UTC 만세!)

* * *

# pytz &#8211; 세계 시간대 정의를 위한 Python 라이브러리

Stuart Bishop ([stuart@stuartbishop.net][1])

원문 <https://pypi.python.org/pypi/pytz/>

## 소개

pytz는 Olson tz databse를 Python으로 옮겨온 라이브러리다. 이 라이브러리는 정확하게, 크로스 플랫폼을 지원하는 시간대 계산도구로 Python 2.4 이상에서 사용할 수 있다. 또한 일광 절약 시간이 끝날 때 발생하는 시간의 모호한 문제를 해결해주는데 이에 대한 자세한 내용은 Python 표준 라이브러리에서 더 찾아볼 수 있다. (`datetime.tzinfo`)

거의 대부분의 Olson 시간대 데이터베이스를 지원한다.

덧붙여, 이 라이브러리는 Python API의 tzinfo 구현과는 다르다. 만약 지역의 벽시계를 만들고 싶다면 이 라이브러리의 `localize()` 메소드를 사용해야 한다. 추가적으로, 시간을 산술적으로 계산하는데 일광절약시간의 영역을 넘나든다면 그 결과물은 다른 시간대가 되어야 한다. (예를 들면 2002-10-27 1:00 동부표준시에서 1분을 빼면 2002-10-27 1:59 동부일광절약시가 아닌 2002-10-27 0:59 동부표준시를 반환할 것이다.) 이런 경우 이 라이브러리의 `normalize()` 메소드가 도움이 된다. 이러한 문제는 Python의 datetime 구현을 수정하지 않는 이상 해결하기 어려운 문제다.

## 설치

이 패키지는 설치도구를 이용해 .egg로 설치할 수도 있고 Python 표준 distutill로 tarball로부터 설치도 가능하다.

만약 tabll로 설치한다면 관리자 권한으로 아래 명령어를 실행한다::

    python setup.py install
    

만약 설치도구로 설치한다면 Python 패키지 인덱스에서 알아서 최신 버전을 받아 설치해준다::

    easy_install --upgrade pytz
    

.egg파일을 이미 가지고 있다면 아래와 같이 설치가능하다::

    easy_install pytz-2008g-py2.6.egg
    

## 예제와 사용법

## 현지 시간과 일자의 계산

    >>> from datetime import datetime, timedelta
    >>> from pytz import timezone
    >>> import pytz
    >>> utc = pytz.utc
    >>> utc.zone
    'UTC'
    >>> eastern = timezone('US/Eastern')
    >>> eastern.zone
    'US/Eastern'
    >>> amsterdam = timezone('Europe/Amsterdam')
    >>> fmt = '%Y-%m-%d %H:%M:%S %Z%z'
    

이 라이브러리는 지역 시간을 생성하기 위한 두가지 방법을 지원한다. 첫째는 pytz 라이브러리에서 제공하는 `localize()` 메소드를 이용하는 방법이다. 이 메소드는 시간대 보정이 없는, 순수한 datetime을 지역화하는데 사용한다:

    >>> loc_dt = eastern.localize(datetime(2002, 10, 27, 6, 0, 0))
    >>> print(loc_dt.strftime(fmt))
    2002-10-27 06:00:00 EST-0500
    

둘째로 `astimezone()`메소드를 이용해 이미 만들어 지역화된 시간을 변경하여 사용하는 방법이 있다:

    >>> ams_dt = loc_dt.astimezone(amsterdam)
    >>> ams_dt.strftime(fmt)
    '2002-10-27 12:00:00 CET+0100'
    

안타깝게도 표준 datetime 생성자에서 사용하는 tzinfo 아규먼트는 pytz의 많은 시간대에서 정상적으로 &#8221;동작하지 않는다&#8221;.

    >>> datetime(2002, 10, 27, 12, 0, 0, tzinfo=amsterdam).strftime(fmt)
    '2002-10-27 12:00:00 AMT+0020'
    

일광절약시간으로 변경하지 않더라도 UTC와 같은 시간대를 사용하는 것이 안전하다.

    >>> datetime(2002, 10, 27, 12, 0, 0, tzinfo=pytz.utc).strftime(fmt)
    '2002-10-27 12:00:00 UTC+0000'
    

시간을 다루는 좋은 방법은 항상 UTC로 시간을 다루고 사람이 보기 위해 출력할 때만 해당 지역 시간으로 변환해 보여주는 것이다.

    >>> utc_dt = datetime(2002, 10, 27, 6, 0, 0, tzinfo=utc)
    >>> loc_dt = utc_dt.astimezone(eastern)
    >>> loc_dt.strftime(fmt)
    '2002-10-27 01:00:00 EST-0500'
    

이 라이브러리는 지역 시간을 이용해 날짜를 산술 계산할 수 있다. UTC에서 계산하고 `normalize()` 메소드를 이용해 일광절약시간과 다른 시간대로 변환하는 것을 조정하는 것보다는 조금 복잡하지만 말이다. 예를 들면 `loc_dt`는 미국 동부(US/Eastern) 시간대의 일광 절약 시간이 종료될 때의 시간으로 값을 받는다.

    >>> before = loc_dt - timedelta(minutes=10)
    >>> before.strftime(fmt)
    '2002-10-27 00:50:00 EST-0500'
    >>> eastern.normalize(before).strftime(fmt)
    '2002-10-27 01:50:00 EDT-0400'
    >>> after = eastern.normalize(before + timedelta(minutes=20))
    >>> after.strftime(fmt)
    '2002-10-27 01:10:00 EST-0500'
    

지역 시간을 생성하는건 좀 까다롭기 때문에 지역 시간으로 작업하는 것을 권장하지 않는다. 안타깝게도 datetime을 생성할 때 `tzinfo` 아규먼트를 사용해서는 해결될 수 없다. (다음 섹션에서 더 자세하게 다룬다)

    >>> dt = datetime(2002, 10, 27, 1, 30, 0)
    >>> dt1 = eastern.localize(dt, is_dst=True)
    >>> dt1.strftime(fmt)
    '2002-10-27 01:30:00 EDT-0400'
    >>> dt2 = eastern.localize(dt, is_dst=False)
    >>> dt2.strftime(fmt)
    '2002-10-27 01:30:00 EST-0500'
    

시간대 간 변환을 할 때도 특별한 주의를 요구한다. 여기서도 `normalize()` 메소드를 활용해 이 변환이 올바르게 되도록 한다.

    >>> utc_dt = utc.localize(datetime.utcfromtimestamp(1143408899))
    >>> utc_dt.strftime(fmt)
    '2006-03-26 21:34:59 UTC+0000'
    >>> au_tz = timezone('Australia/Sydney')
    >>> au_dt = au_tz.normalize(utc_dt.astimezone(au_tz))
    >>> au_dt.strftime(fmt)
    '2006-03-27 08:34:59 EST+1100'
    >>> utc_dt2 = utc.normalize(au_dt.astimezone(utc))
    >>> utc_dt2.strftime(fmt)
    '2006-03-26 21:34:59 UTC+0000'
    

또한 UTC로 된 시간대 변환이 필요할 때 아래와 같은 지름길을 이용할 수 있다. `normalize()`와 `localize()`는 일광절약시간의 문제가 없다면 꼭 필요한 것은 아니다.

    >>> utc_dt = datetime.utcfromtimestamp(1143408899).replace(tzinfo=utc)
    >>> utc_dt.strftime(fmt)
    '2006-03-26 21:34:59 UTC+0000'
    >>> au_tz = timezone('Australia/Sydney')
    >>> au_dt = au_tz.normalize(utc_dt.astimezone(au_tz))
    >>> au_dt.strftime(fmt)
    '2006-03-27 08:34:59 EST+1100'
    >>> utc_dt2 = au_dt.astimezone(utc)
    >>> utc_dt2.strftime(fmt)
    '2006-03-26 21:34:59 UTC+0000'
    

## `tzinfo` API

`tzinfo` 인스턴스는 `timezone()`함수에 의해 반환되는데 이 함수는 모호한 시간대에 대응하기 위한 `is_dst` 파라미터를 `utcoffset()`, `dst()`, `tzname()` 와 같은 메소드를 확장한 것이다.

    >>> tz = timezone('America/St_Johns')
    
    >>> normal = datetime(2009, 9, 1)
    >>> ambiguous = datetime(2009, 10, 31, 23, 30)
    

`is_dst`파라미터는 많은 타임스템프들에서 무시된다. 단지 DST 전환에 의해 나타나는 모호한 시간을 해결하기 위해 사용된다.

    >>> tz.utcoffset(normal, is_dst=True)
    datetime.timedelta(-1, 77400)
    >>> tz.dst(normal, is_dst=True)
    datetime.timedelta(0, 3600)
    >>> tz.tzname(normal, is_dst=True)
    'NDT'
    
    >>> tz.utcoffset(ambiguous, is_dst=True)
    datetime.timedelta(-1, 77400)
    >>> tz.dst(ambiguous, is_dst=True)
    datetime.timedelta(0, 3600)
    >>> tz.tzname(ambiguous, is_dst=True)
    'NDT'
    
    >>> tz.utcoffset(normal, is_dst=False)
    datetime.timedelta(-1, 77400)
    >>> tz.dst(normal, is_dst=False)
    datetime.timedelta(0, 3600)
    >>> tz.tzname(normal, is_dst=False)
    'NDT'
    
    >>> tz.utcoffset(ambiguous, is_dst=False)
    datetime.timedelta(-1, 73800)
    >>> tz.dst(ambiguous, is_dst=False)
    datetime.timedelta(0)
    >>> tz.tzname(ambiguous, is_dst=False)
    'NST'
    

만약 `is_dst`값이 지정되지 않으면, 모호한 타임스탬프에서 `pytz.exceptions.AmbiguousTimeError` 예외가 발생한다.

    >>> tz.utcoffset(normal)
    datetime.timedelta(-1, 77400)
    >>> tz.dst(normal)
    datetime.timedelta(0, 3600)
    >>> tz.tzname(normal)
    'NDT'
    
    >>> import pytz.exceptions
    >>> try:
    ...     tz.utcoffset(ambiguous)
    ... except pytz.exceptions.AmbiguousTimeError:
    ...     print('pytz.exceptions.AmbiguousTimeError: %s' % ambiguous)
    pytz.exceptions.AmbiguousTimeError: 2009-10-31 23:30:00
    >>> try:
    ...     tz.dst(ambiguous)
    ... except pytz.exceptions.AmbiguousTimeError:
    ...     print('pytz.exceptions.AmbiguousTimeError: %s' % ambiguous)
    pytz.exceptions.AmbiguousTimeError: 2009-10-31 23:30:00
    >>> try:
    ...     tz.tzname(ambiguous)
    ... except pytz.exceptions.AmbiguousTimeError:
    ...     print('pytz.exceptions.AmbiguousTimeError: %s' % ambiguous)
    pytz.exceptions.AmbiguousTimeError: 2009-10-31 23:30:00
    

## 지역시간으로 인한 문제들

시간으로 인해 발생하는 가장 중요한 문제는 특정 일시가 1년에 두 번 나타날 수 있다는 부분이다. 예를 들면 미 동부 시간대에서 10월 마지막 일요일 아침에 아래와 같은 일련의 사건이 나타났다고 가정해보자.

    - 01:00am 동부 일광 절약 표준시가 됨
    - 1시간 후, 2:00am 시계를 1시간 뒤로 돌리면 또 01:00am가 됨
      (이 시간은 01:00 동부표준시)
    

사실 모든 인스턴스는 01:00부터 02:00 사이에 두번씩 나타난다. 이 의미는 미동부 시간대에서 표준 datetime 문법을 따르면 일광절약시간이 끝난 시간보다 전의 시간을 정의할 수 있는 방법이 없다는 뜻이다.

    >>> loc_dt = datetime(2002, 10, 27, 1, 30, 00, tzinfo=eastern)
    >>> loc_dt.strftime(fmt)
    '2002-10-27 01:30:00 EST-0500'
    

위에서 보듯, 시스템은 하나를 골라야만 하고, 이 한시간 이내에 제대로 시간이 표기될 확률은 50%가 된다. 몇 어플리케이션에서는 이런건 문제가 되지 않는다. 하지만 다양한 시간대에 살고 있는 사람들의 미팅 스케쥴을 잡아야 하거나, 로그 파일을 분석해야 한다면 이건 문제가 된다.

최고의 방법이자 가장 단순한 해결책은 UTC를 사용하는 것이다. pytz 패키지는 내부적으로 시간대를 표현하는데 UTC를 사용하기를 권장하며, 특히 Python에서 표준 레퍼런스를 기반으로 구현된 특별한 UTC 구현을 활용하는 것을 권장한다.

UTC 시간대는 같은 인스턴스가 되는 문제가 없지만 다른 pytz tzinfo 인스턴스보다는 큰 사이즈라는 문제가 있다. UTC 구현은 pytz.utc, pytz.UTC 또는 pytz.timezone(&#8216;UTC&#8217;)에 포함된다.

    >>> import pickle, pytz
    >>> dt = datetime(2005, 3, 1, 14, 13, 21, tzinfo=utc)
    >>> naive = dt.replace(tzinfo=None)
    >>> p = pickle.dumps(dt, 1)
    >>> naive_p = pickle.dumps(naive, 1)
    >>> len(p) - len(naive_p)
    17
    >>> new = pickle.loads(p)
    >>> new == dt
    True
    >>> new is dt
    False
    >>> new.tzinfo is dt.tzinfo
    True
    >>> pytz.utc is pytz.UTC is pytz.timezone('UTC')
    True
    

덧붙여, 이 UTC 인스턴스는 다른 이름에 같은 의미를 가진 시간대(GMT, 그리니치, 유니버셜 등)와 같은 인스턴스 (또는 같은 구현)이 아니다.

    >>> utc is pytz.timezone('GMT')
    False
    

지역 시간으로 표기하고 싶을 때, 이 라이브러리는 시간대들이 모호하지 않도록 편의를 제공할 것이다:

    >>> loc_dt = datetime(2002, 10, 27, 1, 30, 00)
    >>> est_dt = eastern.localize(loc_dt, is_dst=True)
    >>> edt_dt = eastern.localize(loc_dt, is_dst=False)
    >>> print(est_dt.strftime(fmt) + ' / ' + edt_dt.strftime(fmt))
    2002-10-27 01:30:00 EDT-0400 / 2002-10-27 01:30:00 EST-0500
    

is_dst 플래그를 None으로 둔 채 localize()를 사용하면, pytz는 결과값을 예측하지 못하게 되고 그로 인해 모호하거나 존재하지 않는 시간을 생성하게 되어 예외가 발생한다.

예를 들면 미국동부시에서 일광절약시간이 종료되어 시계를 한시간 뒤로 돌려 2002년 10월 27일 1:30am이 두번 나타나게 되는 경우에 아래와 같은 예외가 발생하는 것을 확인할 수 있다:

    >>> dt = datetime(2002, 10, 27, 1, 30, 00)
    >>> try:
    ...     eastern.localize(dt, is_dst=None)
    ... except pytz.exceptions.AmbiguousTimeError:
    ...     print('pytz.exceptions.AmbiguousTimeError: %s' % dt)
    pytz.exceptions.AmbiguousTimeError: 2002-10-27 01:30:00
    

유사한 이유로, 2002년 4월 7일 2:30am은 모든 미국동부 시간대에서 절대 발생하지 않는데 모든 시계가 1시간을 앞당겨 2:00am은 존재하지 않기 떄문이다:

    >>> dt = datetime(2002, 4, 7, 2, 30, 00)
    >>> try:
    ...     eastern.localize(dt, is_dst=None)
    ... except pytz.exceptions.NonExistentTimeError:
    ...     print('pytz.exceptions.NonExistentTimeError: %s' % dt)
    pytz.exceptions.NonExistentTimeError: 2002-04-07 02:30:00
    

두 예외는 공통적인 기반 클래스를 공유하고 있기 때문에 에러를 다루는데는 큰 문제가 없다:

    >>> isinstance(pytz.AmbiguousTimeError(), pytz.InvalidTimeError)
    True
    >>> isinstance(pytz.NonExistentTimeError(), pytz.InvalidTimeError)
    True
    

`localize()`로 대다수의 경우를 다룰 수 있지만, 아직까지 모든 경우를 다루지는 못한다. 국가가 시간대 정의를 변경하는 경우, 일광절약시간 종료일 같은 문제들은 어떠한 방법으로도 그 모호성을 없엘 수 없다. 그 예로 1915년 바르샤바(주. 폴란드의 수도)는 바르샤바시에서 중앙유럽시로 변경했다. 1915년 8월 5일 자정을 기해 24분을 뒤로 돌렸는데 이로 인해 정의할 수 없는 모호한 시간 기간이 생겨나게 되었고 그 기간은 축약 시간대나 실제 UTC 표준시 이외에는 표기할 방법이 없게 되었다. 이와 같이 자정이 두번 발생하는 경우는, 일광절약시간으로 발생하는 문제와도 다른 경우다:

    >>> warsaw = pytz.timezone('Europe/Warsaw')
    >>> loc_dt1 = warsaw.localize(datetime(1915, 8, 4, 23, 59, 59), is_dst=False)
    >>> loc_dt1.strftime(fmt)
    '1915-08-04 23:59:59 WMT+0124'
    >>> loc_dt2 = warsaw.localize(datetime(1915, 8, 5, 00, 00, 00), is_dst=False)
    >>> loc_dt2.strftime(fmt)
    '1915-08-05 00:00:00 CET+0100'
    >>> str(loc_dt2 - loc_dt1)
    '0:24:01'
    

이 잃어버린 24분 사이의 시간을 생성하는 방법은 다른 시간대로부터 변환하는 방법 밖에 없는데 어떤 시간대를 사용한다 하더라도 일광 절약 모드의 API를 활용한다 해도 단순하게 나타낼 방법이 없기 때문이다:

    >>> utc_dt = datetime(1915, 8, 4, 22, 36, tzinfo=pytz.utc)
    >>> utc_dt.astimezone(warsaw).strftime(fmt)
    '1915-08-04 23:36:00 CET+0100'
    

표준 Python에서 이와 같은 모호함을 처리하는 방법은 다뤄지지 않는데 Python 문서에 나온 미동부 시간대의 예제를 보면 확인할 수 있다. (이 구현은 1987년과 2006년 사이에서만 동작하는데 단지 테스트를 위해 포함되었다):

    >>> from pytz.reference import Eastern # pytz.reference only for tests
    >>> dt = datetime(2002, 10, 27, 0, 30, tzinfo=Eastern)
    >>> str(dt)
    '2002-10-27 00:30:00-04:00'
    >>> str(dt + timedelta(hours=1))
    '2002-10-27 01:30:00-05:00'
    >>> str(dt + timedelta(hours=2))
    '2002-10-27 02:30:00-05:00'
    >>> str(dt + timedelta(hours=3))
    '2002-10-27 03:30:00-05:00'
    

첫 두 결과를 확인해보면, 처음에 슬쩍 봐서는 옳은 결과값이라 생각이 들겠지만 UTC를 기준으로 편차 계산해보면 사실 우리가 요청한 1시간이 아닌 실제로 2시간임을 확인할 수 있다.

    >>> from pytz.reference import UTC # pytz.reference only for tests
    >>> str(dt.astimezone(UTC))
    '2002-10-27 04:30:00+00:00'
    >>> str((dt + timedelta(hours=1)).astimezone(UTC))
    '2002-10-27 06:30:00+00:00'
    

## 국가 정보

ISO 3166 국가 코드를 사용해 개별 국가들이 사용하는 일반적인 시간대를 접근할 수 있도록 지원한다. `pytz.timezone()`을 이용하면 문자열 리스트를 반환하는데 이 문자열을 관련된 tzinfo 인스턴스를 가져오는데 사용할 수 있다:

    >>> print(' '.join(pytz.country_timezones['nz']))
    Pacific/Auckland Pacific/Chatham
    

Olson 데이터베이스는 ISO 3166 국가 코드를 영문 국가명과 맵핑해뒀기 때문에 pytz를 딕셔너리와 같이 사용할 수 있다:

    >>> print(pytz.country_names['nz'])
    New Zealand
    

## UTC란 무엇인가

&#8216;UTC&#8217;는 협정 시간으로, 그리니치 표준시나 영국의 GMT로 많이 알려져 있다. 다른 모든 시간대는 UTC를 기준으로 편차 계산하는 방식이다. UTC에서는 일광절약시간이 존재하지 않기 때문에 산술적으로 계산하는데 아무런 문제가 없어서, 일광절약시간 변환, 국가가 시간대를 변경하는 경우, 또는 이동형 컴퓨터가 다른 여러 시간대로 이동해야 하는 경우에도 아무런 문제를 만들지 않는다.

## 헬퍼

헬퍼는 두가지 목록의 시간대를 제공한다.

`all_timezones`는 명확한 시간대명 목록으로 활용 가능하다.

    >>> from pytz import all_timezones
    >>> len(all_timezones) >= 500
    True
    >>> 'Etc/Greenwich' in all_timezones
    True
    

`common_timezones`는 현재의 시간대 목록으로 유용하게 사용할 수 있다. 이 목록은 몇가지 일반적으로 필요한 경우를 제외하고, 더이상 존재하지 않는 시간대나 역사적인 시간대를 포함시키지 않았다. 예를 들면 미국동부시의 경우는 포함되어 있다. (만약 생각하기에 여기에 포함되어야 한다고 생각하는 시간대가 있다면 버그리포트를 만들어주기 바란다.) 이 또한 문자열 목록으로 제공된다. (주. 미국동부시의 경우 동부표준시 EST와 동부일광절약시 EDT를 둘 다 사용한다. 같은 시간대에 있는 국가 중 EDT의 적용 없이 EST만 적용하는 경우도 있다.)

    >>> from pytz import common_timezones
    >>> len(common_timezones) < len(all_timezones)
    True
    >>> 'Etc/Greenwich' in common_timezones
    False
    >>> 'Australia/Melbourne' in common_timezones
    True
    >>> 'US/Eastern' in common_timezones
    True
    >>> 'Canada/Eastern' in common_timezones
    True
    >>> 'US/Pacific-New' in all_timezones
    True
    >>> 'US/Pacific-New' in common_timezones
    False
    

`common_timezones`와 `all_timezones` 두 목록은 알파벳 순으로 정렬되어 있다:

    >>> common_timezones_dupe = common_timezones[:]
    >>> common_timezones_dupe.sort()
    >>> common_timezones == common_timezones_dupe
    True
    >>> all_timezones_dupe = all_timezones[:]
    >>> all_timezones_dupe.sort()
    >>> all_timezones == all_timezones_dupe
    True
    

`all_timezones`와 `common_timezones` 두 목록은 set으로도 사용 가능하다:

    >>> from pytz import all_timezones_set, common_timezones_set
    >>> 'US/Eastern' in all_timezones_set
    True
    >>> 'US/Eastern' in common_timezones_set
    True
    >>> 'Australia/Victoria' in common_timezones_set
    False
    

또한 시간대 목록에서 개별 국가를 이용해 사용할 때 `country_timezones()` 함수를 활용할 수 있다. 이 함수는 ISO-3166 2글자 국가코드를 사용한다.

    >>> from pytz import country_timezones
    >>> print(' '.join(country_timezones('ch')))
    Europe/Zurich
    >>> print(' '.join(country_timezones('CH')))
    Europe/Zurich
    

## 라이센스

MIT license.

This code is also available as part of Zope 3 under the Zope Public License, Version 2.1 (ZPL).

I&#8217;m happy to relicense this code if necessary for inclusion in other open source projects.

## 최신 버전

이 패키지는 Olson 시간대 데이터베이스가 갱신될 때마다 업데이트 될 것이다. 최신 버전은 `Python Package Index` <http://pypi.python.org/pypi/pytz/> 에서 받을 수 있다. 이 배포판을 생성하기 위해 launchpad.net에서 호스트 되고 있으며 `Bazaar<br />
버전 컨트롤 시스템` <http://bazaar-vcs.org> 에서는 아래와 같이 사용할 수 있다:

    bzr branch lp:pytz
    

## 버그, 기능 요청과 패치

버그는 다음 경로로 제보 바란다. Launchpad <https://bugs.launchpad.net/pytz>

## 이슈와 한계점

  * UTC로부터의 편차계산은 가장 가까운 분을 기준으로 반올림 되는데 그로 인해 1937년 이전 유럽/암스테르담과 같은 시간대들은 30초씩 잃어버리게 된다. 이런 한계는 Python datatime 라이브러리의 한계다.

  * 만약 보기에 시간대 정의가 잘못되었다면, 아마 고칠 수 없으리라 본다. pytz는 Olson 시간대 데이터베이스를 그대로 번역한 것이라 시간대 정의를 변경하고 싶다면 이 데이터베이스를 수정해야 한다. 만약 시간대와 관련된 문제를 찾는다면 다음 링크의 메일링 리스트를 통해 리포트하기 바란다. <http://www.iana.org/time-zones>

## 더 읽어보기

시간대에 대한 이해가 더 필요하다면 다음 글이 도움이 될 것이다: <http://www.twinsun.com/tz/tz-link.htm>

 [1]: http://mailto://stuart@stuartbishop.net