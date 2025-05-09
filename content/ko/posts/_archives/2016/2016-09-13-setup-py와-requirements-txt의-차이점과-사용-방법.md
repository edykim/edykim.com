---
title: setup.py와 requirements.txt의 차이점과 사용 방법
author: haruair
uuid: "3bcda87d-e8a4-436f-a00b-5dded4495f41"
type: post
date: "2016-09-13T01:21:02"
history:
  - 
    from: https://www.haruair.com/blog/3719
    movedAt: 2018-09-13T22:02:42+00:00
lang: ko
slug: how-does-setup.py-differ-from-requirements.txt-and-how-to-use-it
headline:
  - 파이썬의 의존성 관리 양대산맥, setup.py vs requirements.txt 용도와 차이점 살펴보기, 번역
tags:
  - 번역
  - 개발 이야기
  - pypi
  - python
  - reqruirements.txt
  - setup.py

---
파이썬을 사용하다보면 setup.py와 requirements.txt를 필연적으로 마주하게 된다. 처음 봤을 때는 이 둘의 용도가 비슷하게 느껴져서 마치 둘 중 하나를 골라야 하는지, 어떤 용도로 무엇을 써야 하는지 고민하게 된다. 같은 내용을 이상한모임 슬랙에서 물어봤었는데 [Donald Stufft][1]의 글 [setup.py vs requirements.txt][2]를 [raccoonyy][3]님이 소개해줬다. 이 두 도구를 사용하는 방식을 명확하게 잘 설명하는 글이라서 허락 받고 번역으로 옮겼다.

* * *

# setup.py와 requirements.txt의 차이점과 사용 방법

`setup.py`와 `requirements.txt`의 역할에 대한 오해가 많다. 대부분의 사람들은 이 두 파일이 중복된 정보를 제공하고 있다고 생각한다. 심지어 이 &#8220;중복&#8221;을 다루기 위한 [도구][4]를 만들기까지 했다.

## 파이썬 라이브러리

이 글에서 이야기하는 파이썬 라이브러리는 타인이 사용할 수 있도록 개발하고 릴리스하는 코드를 의미한다. 다른 사람들이 만든 수많은 라이브러리는 [PyPI][5]에서 찾을 수 있을 것이다. 각각의 라이브러리가 제공될 때 문제 없이 배포될 수 있도록 패키지는 일련의 메타데이터를 포함하게 된다. 이 메타데이터에는 명칭, 버전, 의존성 등을 적게 된다. 라이브러리에 메타데이터를 작성할 수 있도록 다음과 같은 형식을 `setup.py` 파일에서 사용할 수 있다.

```python
from setuptools import setup

setup(
    name="MyLibrary",
    version="1.0",
    install_requires=[
        "requests",
        "bcrypt",
    ],
    # ...
)
```

이 방식은 매우 단순해서 필요한 메타 데이터를 정의하기에 부족하지 않다. 하지만 이 명세에서는 이 의존성을 어디에서 가져와 해결해야 하는지에 대해서는 적혀있지 않다. 단순히 &#8220;requests&#8221;, &#8220;bcrypt&#8221;라고만 적혀있고 이 의존성이 위치하고 있는 URL도, 파일 경로도 존재하지 않는다. 어디서 의존 라이브러리를 가져와야 하는지 분명하지 않지만 이 특징은 매우 중요한 것이다. 이 특징을 지칭하는 특별한 용어가 있는 것은 아니지만 이 특징을 일종의 &#8220;추상 의존성(abstract dependencies)&#8221;라고 이야기할 수 있다. 이 의존성에는 의존 라이브러리의 명칭만 사용할 수 있고 선택적으로 버전 지정도 가능하다. 의존성 라이브러리를 사용하는 방식이 덕 타이핑(duck typing)과 같은 접근 방식을 사용한다고 생각해보자. 이 맥락에서 의존성을 바라보면 특정 라이브러리인 &#8220;requests&#8221;가 필요한 것이 아니라 &#8220;requests&#8221;처럼 보이는 라이브러리만 있으면 된다는 뜻이다.

## 파이썬 어플리케이션

여기서 이야기하는 파이썬 어플리케이션은 일반적으로 서버에 배포(deploy)하게 되는 부분을 뜻한다. 이 코드는 PyPI에 존재할 수도 있고 존재하지 않을 수도 있다. 하지만 어플리케이션에서는 재사용을 위해 작성한 부분은 라이브러리에 비해 그리 많지 않을 것이다. PyPI에 존재하는 어플리케이션은 일반적으로 배포를 위한 특정 설정 파일이 필요하다. 여기서는 &#8220;배포라는 측면에서의&#8221; 파이썬 어플리케이션을 중심으로 두고 살펴보려고 한다.

어플리케이션은 일반적으로 의존성 라이브러리에 종속되어 있으며 대부분은 복잡하게 많은 의존성을 갖고 있는 경우가 많다. 과거에는 이 어플리케이션이 어떤 라이브러리에 의존성이 있는지 확인할 수 없었다. 이렇게 배포(deploy)되는 특정 인스턴스는 라이브러리와 다르게 명칭이 없는 경우도 많고 다른 패키지와의 관계를 정의한 메타데이터도 갖고 있지 않는 경우도 많았다. 이런 상황에서 의존 라이브러리 정보를 저장할 수 있도록 [pip][6]의 requirements 파일을 생성하는 기능이 제공되게 되었다. 대부분의 requirements 파일은 다음과 같은 모습을 하고 있다.

```ini
# 이 플래그의 주소는 pip의 기본 설정이지만 관계를 명확하게 보여주기 위해 추가함
--index-url https://pypi.python.org/simple/

MyPackage==1.0
requests==1.2.0
bcrypt==1.0.2
```

이 파일에서는 각 의존성 라이브러리 목록을 정확한 버전 지정과 함께 확인할 수 있다. 라이브러리에서는 넓은 범위의 버전 지정을 사용하는 편이지만 어플리케이션은 아주 특정한 버전의 의존성을 갖는다. requests가 정확하게 어떤 버전이 설치되었는지는 큰 문제가 되지 않지만 이렇게 명확한 버전을 기입하면 로컬에서 테스트하거나 개발하는 환경에서도 프로덕션에 설치한 의존성과 정확히 동일한 버전을 사용할 수 있게 된다.

파일 첫 부분에 있는 `--index-url https://pypi.python.org/simple/` 부분을 이미 눈치챘을 것이다. `requirements.txt`에는 PyPI를 사용하지 않는 경우를 제외하고는 일반적으로 인덱스 주소를 명시하지 않는 편이지만 이 첫 행이 `requirements.txt`에서 매우 중요하다. 이 내용 한 줄이 추상 의존성이었던 `requests==1.2.0`을 &#8220;구체적인&#8221; 의존성인 &#8220;https://pypi.python.org/simple/에 있는 requests 1.2.0&#8243;으로 처리하게 만든다. 즉, 더이상 덕 타이핑 형태로 의존성을 다루는 것이 아니라 `isinstance()` 함수로 직접 확인하는 방식과 동일한 패키징 방식이라고 할 수 있다.

## 추상 의존성 또는 구체적인 의존성에는 어떤 문제가 있을까?

여기까지 읽었다면 이렇게 생각할 수도 있다. `setup.py`는 재배포를 위한 파일이고 `requirements.txt`는 배포할 수 없는 것을 위한 파일이라고 했다. 그런데 이미 `requirements.txt`에 담긴 항목이 `install_requires=[...]`에 정의된 의존성과 동일할텐데 왜 이런 부분을 신경써야 할까? 이런 의문이 들 수 있을 것이다.

추상 의존과 구체적 의존을 분리하는 것은 중요하다. 의존성을 두 방식으로 분리해서 사용하면 PyPI를 미러링해서 사용하는 것이 가능하게 된다. 또한 같은 이유로 회사 스스로 사설(private) 패키지 색인을 구축해서 사용할 수 있는 것이다. 동일한 라이브러리를 가져와서 버그를 고치거나 새로운 기능을 더한 다음에 그 라이브러리를 의존성으로 사용하는 것도 가능하게 된다. 추상 의존성은 명칭, 버전 지정만 있고 이 의존성을 설치할 때 해당 패키지를 PyPI에서 받을지, Create.io에서 받을지, 아니면 자신의 파일 시스템에서 지정할 수 있기 때문이다. 라이브러리를 포크하고 코드를 변경했다 하더라도 라이브러리에 명칭과 버전 지정을 올바르게 했다면 이 라이브러리를 사용하는데 전혀 문제가 없을 것이다.

구체적인 의존성을 추상 의존성이 필요한 곳에서 사용했을 때는 문제가 발생하게 된다. 그 문제에 대한 극단적인 예시는 [Go 언어][7]에서 찾아볼 수 있다. go에서 사용하는 기본 패키지 관리자(`go get`)는 사용할 패키지를 다음 예제처럼 URL로 지정해서 받아오는 것이 가능하다.

```go
import (
    "github.com/foo/bar"
)
```

이 코드에서 의존성을 특정 주소로 지정한 것을 볼 수 있다. 이제 이 라이브러리를 사용하다보니 &#8220;bar&#8221; 라이브러리에 존재하는 버그가 내 작업에 영향을 줘서 &#8220;bar&#8221; 라이브러리를 교체하려고 한다고 생각해보자. &#8220;bar&#8221; 라이브러리를 포크해서 문제를 수정했다면 이제 &#8220;bar&#8221; 라이브러리의 의존성이 명시된 코드를 변경해야 한다. 물론 지금 바로 수정할 수 있는 패키지라면 상관 없겠지만 5단계 깊숙히 존재하는 라이브러리의 의존성이라면 일이 커지게 된다. 단지 조금 다른 &#8220;bar&#8221;를 쓰기 위한 작업인데 다른 패키지를 최소 5개를 포크하고 내용을 수정해서 라이브러리를 갱신해야 하는 상황이 되고 말았다.

### Setuptools의 잘못된 기능

Setuptools는 Go 예제와 비슷한 기능이 존재한다. [의존성 링크(dependency links)][8] 라는 기능이며 다음 코드처럼 작성할 수 있다.

Setup

```python
from setuptools import setup

setup(
    # ...
    dependency_links = [
        "http://packages.example.com/snapshots/",
        "http://example2.com/p/bar-1.0.tar.gz",
    ],
)
```

이 setuptools의 의존성 링크 &#8220;기능&#8221;은 의존성 라이브러리의 추상성을 지우고 강제로 기입(hardcode)하는 기능으로 이 의존성 패키지를 정확히 어디에서 찾을 수 있는지 url로 저장하게 된다. 이제 Go에서 살펴본 예제처럼 패키지를 조금 수정한 다음에 패키지를 다른 서버에 두고 그 서버에서 의존성을 가져오는 간단한 작업에도 `dependency_links`를 변경해야 한다. 사용하는 패키지의 모든 의존성 체인을 찾아다니며 이 주소를 수정해야 하는 상황이 되었다.

## 다시 사용할 수 있도록 만들기, 같은 일을 반복하지 않는 방법

&#8220;라이브러리&#8221;와 &#8220;어플리케이션&#8221;을 구분해서 생각하는 것은 각 코드를 다루는 좋은 방식이라고 할 수 있다. 하지만 라이브러리를 개발하다보면 언제든 _그 코드_가 어플리케이션처럼 될 때가 있다. 이제는 `setup.py`에 기록한 추상 의존성과 `requirements.txt`에 저장하게 되는 구체적 의존성으로 분리해서 의존성을 저장하고 관리해야 한다는 사실을 알게 되었다. 코드의 의존성을 정의할 수 있고 이 의존성을 받아오고 싶은 경로를 직접 지정할 수 있기 때문이다. 하지만 의존성 목록을 두 파일로 분리해서 관리하다보면 언젠가는 두 목록이 어긋나는 일이 필연적으로 나타난다. 이런 상황을 해결할 수 있도록 pip의 requirements 파일에서 다음 같은 기능을 제공한다. `setup.py`와 동일한 디렉토리 내에 아래 내용처럼 requirements 파일을 작성하자.

```ini
--index-url https://pypi.python.org/simple/

-e .
```

이렇게 파일을 작성하더라도 `pip install -r requirements.txt` 명령을 실행해보면 이전과 다르지 않게 동작하게 된다. 이 명령은 먼저 파일 경로 `.`에 위치한 라이브러리를 설치한다. 그리고 추상 의존성을 확인할 때 `--index-url` 설정의 경로를 참조해서 구체적인 의존성으로 전환하고 나머지 의존성을 마저 설치하게 된다.

이 방식을 사용하면 또 다른 강력한 기능을 활용할 수 있다. 만약 단위별로 나눠서 배포하고 있는 라이브러리가 둘 이상 있다고 생각해보자. 또는 공식적으로 릴리스하지 않은 기능을 별도의 부분 라이브러리로 분리해서 개발하고 있다고 생각해보자. 라이브러리가 분할되어 있다고 하더라도 이 라이브러리를 참조할 때는 최상위 라이브러리 명칭을 의존성에 입력하게 된다. 모든 라이브러리 의존성은 그대로 설치하면서 부분적으로는 개발 버전의 라이브러리를 설치하고 싶은 경우에는 다음처럼 `requirements.txt`에 개발 버전을 먼저 설치해서 개발 버전의 부분 라이브러리를 사용하는 것이 가능하다.

```ini
--index-url https://pypi.python.org/simple/

-e https://github.com/foo/bar.git#egg=bar
-e .
```

이 설정 파일은 먼저 &#8220;bar&#8221;라는 이름을 사용하고 있는 bar 라이브러리를 https://github.com/foo/bar.git 에서 받아 설치한 다음에 현재 로컬 패키지를 설치하게 된다. 여기서도 의존성을 조합하고 설치하기 위해 `--index` 옵션을 사용했다. 하지만 여기서는 &#8220;bar&#8221; 라이브러리 의존성을 github의 주소를 사용해서 먼저 설치했기 때문에 &#8220;bar&#8221; 의존성은 index로부터 설치하지 않고 github에 있는 개발 버전을 사용하는 것으로 계속 진행할 수 있게 된다.

_이 포스트는 [Yehuda Katz의 블로그 포스트][9]에서 다룬 `Gemfile`과 `gemspec`에서 영감을 얻어 작성했다._

* * *

이 글에서 의존성의 관계를 추상적/구체적인 것으로 구분해서 보는 관점과 그 나눠서 다루는 방식에서 얻을 수 있는 이점이 명확하게 와닿았다.

추상과 대비해서 사용하는 concreate는 &#8220;구상&#8221;으로 번역하게 되는데 추상에 비해 익숙하지 않아서 구체적으로 번역했다. 만약 구상이 더 편한 용어라면 구체적 의존성을 구상 의존성으로 읽으면 도움이 되겠다.

 [1]: https://caremad.io/about/
 [2]: https://caremad.io/2013/07/setup-vs-requirement/
 [3]: https://twitter.com/raccoonyy
 [4]: https://pypi.python.org/pypi/pbr/#requirements
 [5]: https://pypi.python.org/pypi
 [6]: http://pip-installer.org/
 [7]: http://golang.org/
 [8]: http://pythonhosted.org/setuptools/setuptools.html#dependencies-that-aren-t-in-pypi
 [9]: http://yehudakatz.com/2010/12/16/clarifying-the-roles-of-the-gemspec-and-gemfile/