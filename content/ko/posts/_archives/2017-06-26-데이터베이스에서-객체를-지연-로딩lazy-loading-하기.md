---
title: 데이터베이스에서 객체를 지연 로딩(lazy loading) 하기
author: haruair
type: post
date: 2017-06-26T00:03:40+00:00
history:
  - 
    from: https://www.haruair.com/blog/3955
    movedAt: 2018-09-13T22:02:42+00:00
lang: ko
slug: lazy-loading-of-objects-in-the-database
categories:
  - 개발 이야기
  - 번역
tags:
  - doctrine
  - lazy loading
  - php

---
최근 프로젝트에서 PDO를 사용해 작업하다보니 아무래도 ORM에 비해 아쉬운 점이 많아 ORM의 구현을 살펴보는 일이 잦아졌다. Giorgio Sironi의 글 [Lazy loading of objects from database][1]을 번역했다. 좀 오래된 글이긴 하지만 지연 로딩을 위해 프록시 패턴을 사용하는 방식을 설명하고 있다.

이 번역은 원 포스트의 명시와 같이 [CC BY-NC-SA 3.0 US][2]에 따른다.

* * *

## 데이터베이스에서 객체를 지연 로딩(lazy loading) 하기

지연 로딩(lazy loading)은 무엇인가? 객체/관계 맵핑에서는 전체 객체의 연결 관계를 메모리상에서 나타내는 방식이 관행이다. 모든 객체를 실제로 만드는 대신 환영을 만드는 방법을 이 글에서 살펴본다.

### 예시

PHP 애플리케이션에서 전형적인 `User`와 `Group` 객체가 있다고 생각해보자. 단지 PHP 코드 예제를 사용했을 뿐이지 Java/Hibernate 예제처럼 관계형 데이터베이스를 사용하는 언어라면 이 글의 내용은 유효할 것이다.

`User`와 `Group`은 전형적인 다대다 관계다. 사용자는 여러 그룹에 포함될 수 있고 그룹은 여러 사용자를 구성원으로 할 수 있다. 즉 데이터베이스에서 불러온 객체는 다음처럼 탐색할 수 있다.

```php
$user = find(42); // id가 42인 사용자를 찾는다
echo $user->groups[3]->users[2]->groups[4]->name;
```

객체 그래프를 무한으로 탐색할 수 있는 경우는 좋은 관례가 아니다. 하지만 종종 다대다 관계에서는 이런 탐색이 필요한 경우가 있으며 단순한 API인데도 자원을 과도하게 사용하게 되는 접근법 중 하나다. 왜 자원을 과도하게 사용하는지 뒤에서 설명한다.

가장 요점인 문제는 모든 객체 그래프를 불러올 수 없다는 점인데 데이터베이스의 크기에 따라서 서버의 메모리보다 커질 수도 있고 객체로 전환하는 데 시간이 한참 걸릴 수도 있기 때문이다. 그렇다고 관계 일부만 불러올 수도 없는데 그룹과 사용자를 원하는 만큼 탐색하려면 모든 그래프가 필요하기 때문이다. 일부만 불러온 상황에서 그래프의 끝 단까지 간다면 객체가 있어야 할 위치에 null 값/null 포인터를 반환하게 되는 것은 문제가 된다.

### 해결책: 지연 로딩

[프록시 패턴][3]을 이 상황에 적용할 수 있다.

> 일반적으로 프록시는 다른 무언가와 이어지는 인터페이스의 역할을 하는 클래스이다. 프록시는 어떠한 것(이를테면 네트워크 연결, 메모리 안의 커다란 객체, 파일, 또 복제할 수 없거나 수요가 많은 리소스)과도 인터페이스의 임무를 수행할 수 있다. 

첫 탐색에서는 첫 그룹의 하위 클래스인 프록시를 반환한다. [데이터 맵퍼][4]는 추가적인 명령 없이도 해당 타입의 객체 그래프를 제공하게 된다.

    var_dump($user); // User
    var_dump($user->groups[3]); // Group_SomeOrmToolNameProxy
    var_dump($user->groups[3] instanceof Group); // true
    

앞서 이야기한 것처럼 ORM은 프록시 클래스를 사용해서 원래의 클래스를 대체하는 방법으로 지연 로딩을 제공한다. 이 클래스를 위한 코드는 즉석에서 생성하며 대략 다음과 같은 형태가 된다.

```php
class Group_SomeOrmToolNameProxy
{
    public function __construct(DataMapper $mapper, $identifier)
    {
        // 참조하는 필드를 인자 형태로 저장
    }

    private function _load()
    {
        $this->loader->load($this, $id);
    }

    public function sendMessageToAllUsers($text)
    {
        $this->_load();
        parent::sendMessageToAllUsers($text);
    }
}
```

새 클래스는 원래의 메소드를 대신해 호출하긴 하지만 호출하기 전에 `_load()` 메소드를 호출해서 객체를 사용할 수 있는 상태로 바꾼다. `_load()`를 호출하기 전이나 프록시 메소드를 호출하기 전에는 이 도메인 객체는 식별자 필드(id)만 내부 데이터 구조에 저장하고 있다.

이 코드를 사용할 때는 기존 Group과 같은 인터페이스를 제공하기 때문에 사용자 입장에서는 서버 자원에서 자유로운 Group 클래스를 사용한다는 점을 눈치채기도 어렵다.

### 무슨 뜻일까?

첫 단계의 객체는 완전히 불러오지만 두 번째 단계는 해당 객체를 불러올 수 있는 정보만 포함하는 플레이스홀더만 존재한다. 실제로 접근했을 때만 해당 필드를 데이터베이스에서 가져와 처리하게 된다.

```php
$user = $em->find(42); // user 테이블에서 호출함
echo $user->groups[3]->name; // groups와 user_groups 테이블에서 호출함
```

이 패턴을 원하는 만큼 더 복잡한 환경에서도 적용할 수 있다.

  * `join()` 명령을 호출 객체에 정의하거나 &#8216;join&#8217; 선택지를 데이터맵퍼의 메소드로 제공해서 최초 로딩에서 어느 깊이까지 객체를 불러올 것인가 지정할 수 있다. 최초에 사용자의 두 번째 단계 그래프까지 불러올 때 쿼리 한 번으로 불러오는 것이다. 물론 여전히 3번째 단계부터는 (`$user->groups[3]->users[2]->role`) `$user`를 다시 구성하지 않는 이상은 데이터베이스에 추가적인 요청을 보내 성능에 영향을 줄 것이다.
  * 지연 로딩을 켜거나 끌 수 있다. 또는 실행 과정을 기록해서 성능에 영향을 주는 지점을 찾을 수 있다.

Java의 Hibernate는 객체 프로퍼티와 관계의 지연 로딩 기능을 이 접근 방식으로 제공한다. Doctrine 1.x는 더 단순한 방식을 사용하는데 액티브 레코드를 사용하고 있고 `Doctrine_Record`라는 기반 클래스 상에서 모델을 구현하고 있기 때문이다.

오늘 Doctrine 2의 `ORM\Proxy`네임스페이스에 코드를 기여했다. 이 컴포넌트는 프록시 클래스와 객체를 기존 클래스의 메타데이터를 기반으로 생성해준다. 지연 로딩을 기존 코드 변경 없이도 바로 사용할 수 있을 것이다.

 [1]: http://www.giorgiosironi.com/2009/07/lazy-loading-of-objects-from-database.html
 [2]: https://creativecommons.org/licenses/by-nc-sa/3.0/us/
 [3]: https://ko.wikipedia.org/wiki/%ED%94%84%EB%A1%9D%EC%8B%9C_%ED%8C%A8%ED%84%B4
 [4]: https://www.martinfowler.com/eaaCatalog/dataMapper.html