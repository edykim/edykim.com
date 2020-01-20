---
title: SQLAlchemy 시작하기 – Part 2
author: haruair
type: post
date: "2013-08-14T01:00:00"
history:
  - 
    from: https://www.haruair.com/blog/1695
    movedAt: 2018-09-13T22:02:40+00:00
lang: ko
slug: getting-started-with-sqlalchemy-part-2
categories:
  - 번역
tags:
  - python
  - sqlalchemy
  - 대충번역
  - 입문
  - 튜토리얼

---
앞서 작성한 [SQLAlchemy 시작하기 &#8211; Part 1][1]에서 이어지는 번역이다.

(여기서 뭔가 모자란 부분이나 틀린게 있으면 틀린게 맞으므로 언제든 지적해주시고, 애매한 표현은 원본 문서를 봐주시면 감사하겠습니다. 원본 문서는 [SQLAlchemy Tutorial][2]. 한글로 된 sqlalchemy 튜토리얼 있으면 알려주세요!)

* * *

### 리스트와 Scalars 반환하기

`Query` 객체의 `all()`, `one()`, `first()` 메소드는 즉시 SQL을 호출하고 non-iterator 값을 반환한다. `all()`은 리스트를 반환한다.

    query = session.query(User).filter(User.name.like('%air')). order_by(User.id)
    query.all()
    # [<User('haruair', 'Edward Kim', '1234')>, <User('wendy','Wendy Williams', 'foobar')>]
    

<!--more-->

`first()`는 첫째를 리밋으로 설정해 scalar로 가져온다.

    query.first()
    # <User('haruair', 'Edward Kim', '1234')>
    

`one()`은 모든 행을 참조해 식별자를 값으로 가지고 있지 않거나 여러 행이 동일한 값을 가지고 있는 경우 에러를 만든다.

    from sqlalchemy.orm.exc import MultipleResultsFound
    try:
        user = query.one()
    except MultipleResultsFound, e:
        print e
    
    
    from sqlalchemy.orm.exc import NoResultFound
    try:
        user = query.filter(User.id == 99).one()
    except NoResultFound, e:
        print e
    

### 문자로 된 SQL 사용하기

문자열을 `Query`와 함께 유연하게 쓸 수 있다. 대부분 메소드는 문자열을 수용한다. 예를 들면 `filter()`와 `order_by()`에서 쓸 수 있다.

    for user in session.query(User).\
                filter("id<224").\
                order_by("id").all():
        print user.name
    

연결된 파라미터에서는 콜론을 이용한, 더 세세한 문자열 기반의 SQL를 사용할 수 있다. 값을 사용할 때 `param()` 메소드를 이용한다.

    session.query(User).filter("id<:value and name=:name").\
        params(value=1234, name='fred').order_by(User.id).one()
    

문자열 기반의 일반적인 쿼리를 사용하고 싶다면 `from_statement()`를 쓴다. 대신 컬럼들은 매퍼에서 선언된 것과 동일하게 써야한다.

    session.query(User).from_statement(
                        "SELECT * FROM users WHERE name=:name").\
                        params(name='haruair').all()
    

또한 `from_statement()` 아래와 같은 문자열 SQL 방식으로도 쓸 수 있다.

    session.query("id", "name", "thenumber12").\
            from_statement("SELECT id, name, 12 as "
                    "thenumber12 FROM users WHERE name=:name").\
            params(name='haruair').all()
    

### 문자열 SQL의 장단점

`Query`로 생성해서 쓰는건 sqlalchemy의 이점인데 그렇게 쓰지 않으면 당연히 안좋아지는 부분이 있다. 직접 쓰면 특정하게 자기가 필요한 결과물을 쉽게 만들어낼 수 있겠지만 `Query`는 더이상 SQL구조에서 아무 의미 없어지고 새로운 문맥으로 접근할 수 있도록 변환하는 능력이 상실된다.

예를 들면 `User` 객체를 선택하고 `name` 컬럼으로 정렬하는데 name이란 문자열을 쓸 수 있다.

    q = session.query(User.id, User.name)
    q.order_by("name").all()
    

지금은 문제 없다. `Query`를 쓰기 전에 뭔가 멋진 방식을 사용해야 할 때가 있다. 예를 들면 아래처럼 `from_self()` 같은 고급 메소드를 사용해, 사용자 이름의 길이가 다른 경우를 비교할 때가 있다.

    from sqlalchemy import func
    ua = aliased(User)
    q = q.from_self(User.id, User.name, ua.name).\
        filter(User.name < ua.name).\
        filter(func.length(ua.name) != func.length(User.name))
    

`Query`는 서브쿼리에서 불러온 것처럼 나타나는데 `User`는 내부와 외부 양쪽에서 불러오게 된다. 이제 `Query`에게 name으로 정렬하라고 명령하면 어느 name을 기준으로 정렬할지 코드로는 예측할 수 없게 된다. 이 경우에는 바깥과 상관없이 aliased된 `User`를 기준으로 정렬된다.

    q.order_by("name").all()
    # [(3, u'fred', u'haruair'), (4, u'haruair', u'mary'), (2, u'mary', u'wendy'), (3, u'fred', u'wendy'), (4, u'haruair', u'wendy')]
    

`User.name` 또는 `ua.name` 같이 SQL 요소를 직접 쓰면 `Query`가 알 수 있을 만큼 충분한 정보를 제공하기 때문에 어떤 name을 기준으로 정렬해야할지 명확하게 판단하게 된다. 그래서 아래 두가지와 같은 차이를 볼 수 있다.

    q.order_by(ua.name).all()
    # [(3, u'fred', u'haruair'), (4, u'haruair', u'mary'), (2, u'mary', u'wendy'), (3, u'fred', u'wendy'), (4, u'haruair', u'wendy')]
    
    q.order_by(User.name).all()
    # [(3, u'fred', u'wendy'), (3, u'fred', u'haruair'), (4, u'haruair', u'wendy'), (4, u'haruair', u'mary'), (2, u'mary', u'wendy')]
    

### 숫자세기

`Query`는 `count()`라는 숫자를 세는 편리한 메소드를 포함한다.

    session.query(User).filter(User.name.like('haru%')).count()
    

`count()`는 몇개의 행이 반환될지 알려준다. 위 코드로 생성되는 SQL을 살펴보면, SQLAlchemy는 항상 어떤 쿼리가 오더라도 거기서 행의 수를 센다. `SELECT count(*) FROM table` 하면 단순해지지만 최근 버전의 SQLAlchemy는 정확한 SQL로 명시적으로 판단할 수 있는 경우 추측해서 처리하지 않는다.

숫자를 세야 할 필요가 있는 경우에는 `func.count()`로 명시적으로 작성하면 된다.

    from sqlalchemy import func
    session.query(func.count(User.name), User.name).group_by(User.name).all()
    # [(1, u'fred'), (1, u'haruair'), (1, u'mary'), (1, u'wendy')]
    

`SELECT count(*) FROM table`만 하고 싶으면

    session.query(func.count('*')).select_from(User).scalar()
    

User의 primary key를 사용하면 select_from 없이 사용할 수 있다.

    session.query(func.count(User.id)).scalar() 
    

### 관계(relationship) 만들기

이제 `User`와 관계된, 두번째 테이블을 만들 것이다. 계정당 여러개 이메일 주소를 저장할 수 있게 만들 것이다. users 테이블과 연결되는, 일대다 테이블이므로 테이블 이름을 addresses라고 정하고 전에 작성했던 것처럼 Declarative로 `address` 클래스를 작성한다.

    from sqlalchemy import ForeignKey
    from sqlalchemy.orm import relationship, backref
    
    class Address(Base):
        __tablename__ = 'addresses'
        id = Column(Integer, primary_key=True)
        email_address = Column(String, nullable=False)
        user_id = Column(Integer, ForeignKey('users.id'))
    
        user = relationship("User", backref=backref('addresses', order_by=id))
    
        def __init__(self, email_address):
            self.email_address = email_address
    
        def __repr__(self):
            return "<Address('%s')>" % self.email_address
    

위 클래스는 `ForeignKey`를 어떻게 만드는지 보여준다. `Column`에 직접 넣은 지시자는 이 컬럼의 내용이 대상된 컬럼을 따르도록 만든다. 이 점이 관계 데이터베이스의 주요 특징 중 하나인데 풀과 같은 역할을 해, 연결되지 않은 테이블 사이를 잘 붙여준다. 위에서 작성한 `ForeignKey`는 `addresses.user_id` 컬럼이 `users.id` 컬럼을 따르도록 만든다.

두번째 지시자인 `relationship()`은 ORM에게 `Address` 클래스 자체가 `User` 클래스에 연결되어 있다는 사실을 `Address.user` 속성을 이용해 알 수 있게 해준다. `relationship()`은 외래키 연결에서 두 테이블 사이에 `Address.user`로 다대일 관계임을 결정한다.

덧붙여 `relationship()`내에서 호출하는 `backref()`는 역으로 클래스를 이용할 수 있도록, 즉 `Address` 객체에서 `User`를 참조할 수 있도록 `User.addresses`를 구현한다. 다대일 관계의 반대측은 항상 일대다의 관계이기 때문이다. 자세한건 [기본 관계 패턴][3] 문서를 참고.

`Address.user`와 `User.addresses`의 관계는 **양방향 관계(bidirectional relationship)**로 SQLAlchemy ORM의 주요 특징이다. [Backref로 관계 연결하기][4] 에서 `backref`에 대한 자세한 정보를 확인할 수 있다.

`relationship()`을 원격 클래스를 객체가 아닌 문자열로 연결하는 것에 대해 Declarative 시스템에서 사용하는 것으로 문제가 될 수 있지 않나 생각해볼 수 있다. 전부 맵핑이 완료된 경우, 이런 문자열은 파이썬 표현처럼 다뤄지며 실제 아규먼트를 처리하기 위해 사용된다. 위의 경우에선 `User` 클래스가 그렇다. 이런 이름들은 이것이 만들어지는 동안에만 허용되고 모든 클래스 이름은 기본적으로 선언될 때 사용이 가능해진다. (주. 클래스의 선언이 순차적으로 진행되기 때문에 클래스 선언 이전엔 에러가 나므로 이런 방식을 사용하는 것으로 보인다.)

아래는 동일하게 &#8220;addresses/user&#8221; 양방향 관계를 User 대신 Address로 선언한 모습이다.

    class User(Base):
        # ...
        addresses = relationship("Address", order_by="Address.id", backref="user")
    

상세한 내용은 [relationship()][5]를 참고.

#### 이건 알고 계시나요?

  * 대부분의 관계형 데이터베이스에선 외래키 제약이 primary key 컬럼이나 Unique 컬럼에만 가능하다.
  * 다중 컬럼 pirmary key에서의 외래키 제약은 스스로 다중 컬럼을 가지는데 이를 `합성외래키(composite foreign key)`라고 한다. 이 또한 이 컬럼의 서브셋을 레퍼런스로 가질 수 있다.
  * 외래키 컬럼은 연결된 컬럼이나 행의 변화에 자동으로 그들 스스로를 업데이트 한다. 이걸 CASCADE referential action이라고 하는데 관계형 데이터베이스에 내장된 함수다.
  * 외래키는 스스로의 테이블을 참고할 수 있다. 이걸 자기참조(self-referential) 외래키라고 한다.
  * 외래키에 대해 더 알고 싶다면 [위키피디아 외래키][6] 항목을 참고.

addresses 테이블을 데이터베이스에 생성해야 하므로 metadata로부터 새로운 CREATE를 발행한다. 이미 생성된 테이블은 생략하고 생성한다.

    Base.metadata.create_all(engine)
    

### 관계된 객체 써먹기

이제 `User`를 만들면 빈 `addresses` 콜렉션이 나타난다. 딕셔너리나 set같은 다양한 컬랙션이 있는데 기본으로 컬랙션은 파이썬의 리스트다. (컬렉션 접근을 커스터마이징 하려면 [이 문서][7] 참고)

    jack = User('jack', 'Jack Bean', 'sadfjklas')
    jack.addresses # [] 빈 리스트를 반환
    

자유롭게 `Address` 객체를 `User` 객체에 넣을 수 있다. 그냥 리스트 사용법이랑 똑같다.

    jack.addresses = [
                    Address(email_address='jack@gmail.com'),
                    Address(email_address='jack@yahoo.com')]
    

양방향 관계인 경우 자동으로 양쪽에서 접근할 수 있게 된다. 별도의 SQL 없이 양쪽에 on-change events로 동작한다.

    jack.addresses[1]       # <Address(email_address='jack@yahoo.com')>
    jack.addresses[1].user  # <User('jack', 'Jack Bean', 'sadfjklas')>
    

데이터베이스에 저장해보자. `User`인 Jack Bean을 저장하면 두 `Address`도 알아서 cascading으로 저장된다.

    session.add(jack)
    session.commit()
    

Jack을 쿼리해서 다시 불러보자. 이렇게 Query하면 아직 주소들은 SQL을 호출하지 않은 상태다.

    jack = session.query(User).\
    filter_by(name='jack').one()
    Jack        # <User('jack', 'Jack Bean', 'sadfjklas')>
    

하지만 `addressses` 컬랙션을 호출하는 순간 SQL이 만들어진다.

    jack.addresses
    # [<Address(email_address='jack@gmail.com')>, <Address(email_address='jack@yahoo.com')>]
    

이렇게 뒤늦게 SQL로 불러오는걸 게으른 불러오기 관계(lazy loading relationship)라고 한다. 이 `addresses`는 이제 불러와 평범한 리스트처럼 동작한다. 이렇게 컬랙션을 불러오는 방법을 최적화하는 방법은 나중에 살펴본다.

### Join과 함께 쿼리하기

두 테이블이 있는데 `Query`의 기능으로 양 테이블을 한방에 가져오는 방법을 살펴볼 것이다. SQL JOIN에 대해 join 하는 방법과 여러가지 좋은 설명이 [위키피디아][8]에 있으니 참고.

간단하게 `User`와 `Address` 두 테이블을 완전 조인하는 방법은 `Query.filter()`로 관계있는 두 컬럼이 동일한 경우를 찾으면 된다.

    for u, a in session.query(User, Address).\
                        filter(User.id==Address.user_id).\
                        filter(Address.email_address=='jack@gmail.com').\
                        all():
        print u, a
    # <User('jack', 'Jack Bean', 'sadfjklas')> <Address('jack@gmail.com')>
    

반면 진짜 SQL JOIN 문법을 쓰려면 `Query.join()`을 쓴다.

    session.query(User).join(Address).\
            filter(Address.email_address=='jack@gmail.com').\
            all()
    # [<User('jack', 'Jack Bean', 'sadfjklas')>]
    

`Query.join()`은 `User`와 `Address` 사이에 있는 하나의 외래키를 기준으로 join한다. 만약 외래키가 없거나 여러개라면 `Query.join()` 아래같은 방식을 써야한다.

    query.join(Address, User.id==Address.user_id)   # 정확한 상태를 적어줌
    query.join(User.addresses)                      # 명확한 관계 표기 (좌에서 우로)
    query.join(Address, User.addresses)             # 동일, 명확하게 목표를 정해줌
    query.join('addresses')                         # 동일, 문자열 이용
    

외부 join은 `outerjoin()`을 쓴다.

    query.outerjoin(User.addresses)     # left outer join
    

`join()`이 궁금하면 문서를 참고하자. 어떤 SQL에서든 짱짱 중요한 기능이다.

### 별칭(aliases) 사용하기

여러 테이블을 쿼리하면 같은 테이블을 여러개 불러와야 할 떄가 있는데 그럴 때 동일 테이블명에 별칭(alias)를 지정해 다른 테이블과 문제를 이르키지 않도록 해야한다. `Query`는 별칭으로 된 녀석들도 잘 알아서 처리해준다. 아래 코드는 `Address` 엔티티를 두번 조인해서 한 행에 두 이메일 주소를 가져오도록 하는 예시다.

    from sqlalchemy.orm import aliased
    adalias1 = aliased(Address)
    adalias2 = aliased(Address)
    for username, email1, email2 in \
        session.query(User.name, adalias1.email_address, adalias2.email_address).\
        join(adalias1, User.addresses).\
        join(adalias2, User.addresses).\
        filter(adalias1.email_address=='jack@gmail.com').\
        filter(adalias2.email_address=='jack@yahoo.com'):
        print username, email1, email2
    # jack jack@gmail.com jack@yahoo.com
    

### 서브쿼리 사용하기

`Query`는 서브쿼리 만들 때에도 유용하다. `User` 객체가 몇개의 `Address`를 가지고 있는지 알고 싶을 때 서브쿼리는 유용하다. SQL을 만드는 방식으로 생각하면 주소 목록의 수를 사용자 id를 기준으로 묶은 후(grouped by), User와 join하면 된다. 이 상황에선 LEFT OUTER JOIN이 사용자의 모든 주소를 가져오므로 적합하다. SQL의 예를 보자.

    SELECT users.*, adr_count.address_count
    FROM users
    LEFT OUTER JOIN (
            SELECT user_id, count(*) AS address_count
            FROM addresses GROUP BY user_id
        ) AS adr_count
        ON users.id = adr_count.user_id
    

`Query`를 사용하면 명령문을 안에서 밖으로 빼내듯 쓸 수 있다. 명령문 접근자는 일반적인 `Query`를 통해 SQL 표현을 나타내는 명령문을 생성해 반환한다. 이건 `select()`를 쓰는 것과 비슷한데 자세한건 [SQL 표현 언어 튜토리얼 문서][9]를 참고.

    from sqlalchemy.sql import func
    stmt = session.query(Address.user_id, func.count('*').label('address_count')).\
            group_by(Address.user_id).subquery()
    

`func` 키워드는 SQL 함수를 만들고 `subquery()` 메소드는 별칭을 이용해 다른 query에 포함할 수 있는 SELECT 명령문의 형태로 반환해준다. (`query.statement.alias()`를 줄인 것)

이렇게 만든 서브쿼리는 `Table`처럼 동작한다. 아래 코드를 잘 모르겠으면 튜토리얼 앞부분에서 Table을 어떻게 다뤘는지 살펴보면 도움이 된다. 여기서는 컬럼에 접근할 때 `table.c.컬럼명`으로 접근했던, 그 방법처럼 사용한다.

    for u, count in session.query(User, stmt.c.address_count).\
        outerjoin(stmt, User.id==stmt.c.user_id).order_by(User.id):
        print u, count
    # <User('wendy', 'Wendy Williams', 'foobar')> None
    # <User('mary', 'Mary Contrary', 'xxg527')> None
    # <User('fred', 'Fred Flinstone', 'blar')> None
    # <User('haruair', 'Edward Kim', '1234')> None
    # <User('jack', 'Jack Bean', 'sadfjklas')> 2
    

### 서브쿼리서 엔티티 선택하기

위에서는 서브쿼리서 컬럼을 가져와서 결과를 만들었다. 만약 서브쿼리가 엔티티를 선택하기 위한 맵이라면 `aliased()`로 매핑된 클래스를 서브쿼리로 활용할 수 있다.

    stmt = session.query(Address).\
                    filter(Address.email_address != 'jack@yahoo.com').\
                    subquery()
    adalias = aliased(Address, stmt)
    for user, address in session.query(User, adalias).\
            join(adalias, User.addresses):
        print user, address
    # <User('jack', 'Jack Bean', 'sadfjklas')> <Address('jack@gmail.com')>
    

## EXISTS 사용하기

SQL에서 EXISTS 키워드는 불린 연산자로 조건에 맞는 행이 있으면 True를 반환한다. 이건 많은 시나리오에서 join을 위해 쓰는데, join에서 관계 테이블서 적합한 값이 없는 행을 처리하는데에도 유용하다.

외부 EXISTS는 이런 방식으로 할 수 있다.

    from sqlalchemy.sql import exists
    stmt = exists().where(Address.user_id==User.id)
    for name, in session.query(User.name).filter(stmt):
        print name
    # jack
    

`Query`의 기능 중 몇가지 연산자에서는 EXISTS를 자동으로 사용한다. 위 같은 경우는 `User.addresses` 관계에 `any()`를 사용하면 가능하다.

    for name, in ssession.query(User.name).\
            filter(User.addresses.any()):
        print name
    # jack
    

`any()`는 특정 기준이 있어 제한적으로 매치해준다.

    for name, in session.query(User.name).\
        filter(User.addresses.any(Address.email_address.like('%gmail%'))):
        print name
    # jack
    

`has()`도 `any()`와 동일한 기능을 하는데 대신 다대일 관계에서 사용한다. (~연산자는 NOT이란 뜻이다.)

    session.query(Address).\
        filter(~Address.user.has(User.name=='jack')).all()
    # []
    

### 일반 관계 연산자

관계(relationship)에서 사용할 수 있는 모든 연산자인데 각각 API 문서에서 더 자세한 내용을 볼 수 있다.

#### `__eq__()` 다대일에서의 equals 비교

    query.filter(Address.user == someuser)
    

#### `__ne__()` 다대일에서의 not equals 비교

    query.filter(Address.user != someuser)
    

#### IS NULL 다대일 비교 (`__eq__()`)

    query.filter(Address.user == None)
    

#### `contains()` 일대다 컬렉션에서 사용

    query.filter(User.addresses.contains(someaddress))
    

#### `any()` 컬렉션에서 사용

    query.filter(User.addresses.any(Address.email_address == 'bar'))
    
    # 키워드 아규먼트도 받음
    query.filter(User.addresses.any(email_address='bar'))
    

#### `has()` scalar 레퍼런스서 사용

    query.filter(Address.user.has(name='ed'))
    

#### `Query.with_parent()` 어떤 관계서든 사용

    session.query(Address).with_parent(someuser, 'addresses')
    

### 선행 로딩 (Eager Loading)

lazy loading의 반대 개념으로 `User.addresses`를 `User` 호출할 때 바로 불러오도록 하는 방법이다. eager loading으로 바로 불러오면 쿼리 호출의 수를 줄일 수 있다. SQLAlchemy는 자동화와 사용자정의 기준을 포함해 3가지 타입의 선행 로딩(eager loading)를 제공한다. 3가지 모두 query options로 제어하는데 `Query`에 불러올 때 `Query.options()` 메소드를 통해 쓸 수 있다.

#### 서브쿼리 로딩

선행로딩하도록 `User.addresses`에 표기하는 방법이다. `orm.subqueryload()`를 이용해서 서브쿼리를 불러올 떄 한번에 연계해 불러오도록 처리한다. 기존의 서브쿼리는 재사용이 가능한 형태지만 이것는 바로 `Query`를 거쳐 선택되기 때문에 관계된 테이블을 선택하는 것과 상관없이 서브쿼리가 동작한다. 복잡해보이지만 아주 쉽게 쓸 수 있다.

    from sqlalchemy.orm import subqueryload
    jack = session.query(User).\
                    options(subqueryload(User.addresses)).\
                    filter_by(name='jack').one()
    jack
    # <User('jack', 'Jack Bean', 'sadfjklas')>
    jack.addresses
    # [<Address('jack@gmail.com')>, <Address('jack@yahoo.com')>]
    

#### 연결된 로딩 (Joined Load)

또 다른 자동 선행로딩 함수로 `orm.joinedload()`가 있다. join할 때 사용할 수 있는 방법으로 관계된 객체나 컬렉션을 불러올 때 한번에 불러올 수 있다. (LEFT OUTER JOIN이 기본값) 앞서의 addresses를 동일한 방법으로 불러올 수 있다.

    from sqlalchemy.orm import joinedload
    
    jack = session.query(User).\
                    options(joinedload(User.addresses)).\
                    filter_by(name='jack').one()
    jack
    # <User('jack', 'Jack Bean', 'sadfjklas')>
    jack.addresses
    # [<Address('jack@gmail.com')>, <Address('jack@yahoo.com')>]
    

사실 OUTER JOIN 결과라면 두 행이 나타나야 하는데 여전히 `User` 하나만 얻을 수 있다. 이 이유는 `Query`는 엔티티를 반환할 때 객체 유일성을 위해 &#8220;유일하게 하기(uniquing)&#8221; 전략을 취한다.

`joinedload()`는 오랜동안 써왔지만 `subqueryload()` 메소드가 더 새로운 형태의 선행로딩 형태다. 둘 다 한 행을 기준으로 관계된 객체를 가져오는 것은 동일하지만 `subqueryload()`는 적합한 관계 컬렉션을 가져오기에 적합하고 반면 `joinedload()`가 다대일 관계에 적합하다.

#### `joinedload()`는 `join()`의 대체재가 아니다.

`joinedload()`으로 join을 생성하면 익명으로 aliased되어 쿼리 결과에 영향을 미치지 않는다. `Query.order_by()`나 `Query.filter()` 호출로 이런 aliased된 테이블을 참조할 수 없기 때문에 사용자 공간에서는 `Query.join()`을 사용해야 한다. `joinedload()`은 단지 관계된 객체 또는 콜랙션의 최적화된 내역을 불러오기 위해 사용하는 용도이기 때문에 추가하거나 제거해도 실제 결과엔 영향을 미치지 않는다. 더 궁금하면 [선행 로딩의 도][10]를 참고.

### 명시적 Join + 선행로딩

세번째 스타일의 선행 로딩은 명시적 Join이 primary 행에 위치했을 때 추가적인 테이블에 관계된 객체나 컬렉션을 불러온다. 이 기능은 `orm.contains_eager()`를 통해 제공되는데 다대일 객체를 미리 불러와 동일 객체에 필터링 할 경우에 유용하게 사용된다. 아래는 `Address`행에 연관된 `User` 객체를 가져오는 코드인데 &#8220;jack&#8221;이란 이름의 `User`를 `orm.contains_eager()`를 사용해 user 컬럼을 `Address.user` 속성으로 선행로딩한다.

    from sqlalchemy.orm import contains_eager
    jack_addresses = session.query(Address).\
                                join(Address.user).\
                                filter(User.name=='jack').\
                                options(contains_eager(Address.user)).\
                                all()
    jack_addresses
    # [<Address('jack@gmail.com')>, <Address('jack@yahoo.com')>]
    jack_addresses[0].user
    # <User('jack', 'Jack Bean', 'sadfjklas')>
    

기본적으로 어떻게 불러오는지 설정하는 다양한 방법 등 선행 로딩의 추가적인 정보는 [관계 불러오기 테크닉][11] 문서를 참고.

### 삭제하기

`jack`을 삭제해보자. 삭제하고나면 `count`는 남은 행이 없다고 표시한다.

    session.delete(jack)
    session.query(User).filter_by(name='jack').count()
    # 0
    

여기까진 좋다. `Address` 객체는 어떤지 보자.

    session.query(Address).filter(
        Address.email_address.in_(['jack@gmail.com','jack@yahoo.com'])
    ).count()
    # 2
    

여전히 남아있다. SQL을 확인해보면 해당 Address의 `user_id` 컬럼은 모두 NULL로 되어 있지만 삭제되진 않았다. SQLAlchemy는 제거를 종속적으로(cascade) 하지 않는데 필요로 한다면 그렇게 할 수 있다.

### 삭제/삭제-외톨이 종속처리 설정하기

`cascade` 옵션을 변경하기 위해서는 `User.addresses`의 관계에서 행동을 변경시켜야 한다. SQLAlchemy는 새 속성을 추가하는 것과 관계를 맵핑하는 것은 언제나 허용되지만 이 경우에는 존재하는 관계를 제거하는게 필요하므로 맵핑을 완전히 새로 시작해야한다. 먼저 `Session`을 닫는다.

    session.close()
    

그리고 새 declarative_base()를 사용한다.

    Base = declarative_base()
    

다음으로 `User` 클래스를 선언하고 `addresses` 관계를 종속처리 설정과 함께 추가한다. (생성자는 대충 두자)

    class User(Base):
        __tablename__ = 'users'
    
        id = Column(Integer, primary_key=True)
        name = Column(String)
        fullname = Column(String)
        password = Column(String)
    
        addresses = relationship("Address", backref='user', cascade="all, delete, delete-orphan")
    
        def __repr__(self):
            return "<User('%s','%s','%s'>" % (self.name, self.fullname, self.password)
    

그리고 `Address`도 다시 생성한다. 이 경우에는 이미 `User`에서 관계를 생성했기 때문에 `Address.user`는 따로 생성할 필요가 없다.

    class Address(Base):
        __tablename__ = 'addresses'
        id = Column(Integer, primary_key=True)
        email_address = Column(String, nullable=False)
        user_id = Column(Integer, ForeignKey('users.id'))
    
        def __repr__(self):
            return "<Address('%s')>" % self.email_address
    

이제 Jack을 불러오고 삭제하면 Jack의 addresses 컬랙션은 Address에서 삭제된다.

    # jack을 primary key로 불러옴
    jack = session.query(User).get(5)
    # 첫 Address를 삭제 (지연 로딩이 동작한다)
    del jack.addresses[1]
    # address는 하나만 남는다
    session.query(Address).filter(
        Address.email_address.in_(['jack@gmail','jack@yahoo.com'])
    ).count()
    # 1
    

Jack을 지우면 Jack과 남은 Address도 삭제된다.

    session.delete(jack)
    session.query(User).filter_by(name='jack').count()
    # 0
    session.query(Address).filter(
        Address.email_address.in_(['jack@gmail.com','jack@yahoo.com'])
    ).count()
    # 0
    

#### 종속처리(cascade)에 대해

종속처리에 대한 더 자세한 설정은 Cascades 문서를 참고. 종속처리는 함수적으로 관련된 데이터베이스가 자연스럽게 `ON DELETE CASCADE`될 수 있도록 통합할 수 있다. [Using Passive Deletes][12] 문서 참고

### 다대다 관계(Many To Many Relationship) 만들기

일종의 보너스 라운드로 다대다 관계를 만드는 방법을 살펴본다. 블로그와 같은걸 만들 때를 예로 들면 `BlogPost`와 그에 따른 `Keyword`를 조합해야 하는 경우가 있다.

평범한 다대다 관계를 위해, 맵핑되지 않은 `Table` 구조를 조합 테이블로 만들 수 있다.

    from sqlalchemy import Table, Text
    # 조합 테이블
    post_keywords = Table('post_keywords', Base.metadata,
        Column('post_id', Integer, ForeignKey('posts.id')),
        Column('keyword_id', Integer, ForeignKey('keywords.id'))
    )
    

위 코드는 맵핑된 클래스를 선언하는 것과는 약간 다르게 `Table`를 직접 선언했다. `Table`은 생성자 함수로 각각 개별의 `Column` 아규먼트를 쉼표(comma)로 구분한다. `Column` 객체는 클래스의 속성명을 가져오는 것과 달리 이름을 명시적으로 작성해준다.

다음은 `BlogPost`와 `Keyword`를 `relationship()`으로 `post_keywords` 테이블에 연결해 정의한다.

    class BlogPost(Base):
        __tablename__ = 'posts'
    
        id = Column(Integer, primary_key=True)
        user_id = Column(Integer, ForeignKey('users.id'))
        headline = Column(String(255), nullable=False)
        body = Column(Text)
        # 다대다 관계 : BlogPost <-> Keyword
        keywords = relationship('Keyword', secondary=post_keywords, backref='posts')
    
        def __init__(self, headline, body, author):
            self.author = author
            self.headline = headline
            self.body = body
    
        def __repr__(self):
            return "<BlogPost('%r', '%r', '%r')>" % (self.headline, self.body, self.author)
    
    class Keyword(Base):
        __tablename__ = 'keywords'
    
        id = Column(Integer, primary_key=True)
        keyword = Column(String(50), nullable=False, unique=True)
    
        def __init__(self,keyword):
            self.keyword = keyword
    

위에서 `BlogPost.keywords`는 다대다 관계다. 다대다 관계를 정의하는 기능은 `secondary` 키워드로 연관 테이블인 `Table`객체를 참조한다. 이 테이블은 단순히 양측의 관계를 참고하는 형태며 만약 다른 컬럼이 있다면, 예를 들어 자체 primary key가 있거나 foreign key를 가진다면 **연관 객체(association object)** 라는 다른 형태의 사용패턴을 사용해야 한다. [연관 객체][13] 문서 참고.

그리고 `BlogPost` 클래스는 `author`필드를 가진다. 그래서 다른 양방향 관계를 만들 것인데 단일 사용자가 엄청나게 많은 블로그 포스트를 가질 수 있다는 문제점을 처리해야한다. 다시 말해 `User.posts`에 접근하면 모든 포스트를 불러올 것이 아니라 일부 필터된 결과만 가져와야 한다. 이런 경우를 위해 `relationship()`은 `lazy='dynamic'`을 지원하는데 속성을 불러오는 전략의 대안 중 하나다. 이것을 `relationship()`의 역방향으로 사용하려면 `backref()`를 사용하면 된다.

    from sqlalchemy.orm import backref
    # User에서의 관계를 "다이나믹" 로딩 처리
    BlogPost.author = relationship(User, backref=backref('posts', lazy='dynamic'))
    

그리고 새 테이블을 생성한다.

    Base.meta.create_all(engine)
    

사용 방법은 크게 다르지 않다.

    wendy = session.query(User).\
                    filter_by(name='wendy').\
                    one()
    post = BlogPost("Wendy's Blog Post", "This is a test", wendy)
    session.add(post)
    

지금 키워드는 데이터베이스에 각각 유일하게 저장한다. 아직 뭔가 거창한걸 한건 아니고 그냥 생성할 뿐이다.

    post.keywords.append(Keyword('wendy'))
    post.keywords.append(Keyword('firstpost')) 
    

이제 키워드가 &#8216;firstpost&#8217;인 모든 글을 찾아볼 것이다. 여기서 `any` 연산자로 &#8216;firstpost&#8217;인 글을 찾는다.

    session.query(BlogPost).\
            filter(BlogPost.keywords.any(keyword='firstpost')).\
            all()
    # [BlogPost("Wendy's Blog Post", 'This is a test', <User('wendy','Wendy Williams', 'foobar')>)]
    

만약 Wendy의 포스트만 보고 싶다면,

    session.query(BlogPost).\
            filter(BlogPost.author=wendy).\
            filter(BlogPost.keywords.any(keyword='firstpost')).\
            all()
    # [BlogPost("Wendy's Blog Post", 'This is a test', <User('wendy','Wendy Williams', 'foobar')>)]
    

또는 Wendy가 소유하고 있는 `posts` 관계 즉 dyanmic 관계를 이용해 불러오는 방법은 아래와 같다.

    wendy.posts.\
        filter(BlogPost.keywords.any(keyword='firstpost')).\
        all()
    # [BlogPost("Wendy's Blog Post", 'This is a test', <User('wendy','Wendy Williams', 'foobar')>)]
    

* * *

### 이후 읽어볼 만한 문서

(주. 아마 아래 문서 중 세션과 관계 문서를 먼저 옮길 것 같습니다.)

  * [쿼리에 관해][14]
  * [매퍼 설정하기][15]
  * [관계 설정하기][16]
  * [세션 사용하기][17]

 [1]: http://haruair.com/blog/1682
 [2]: http://docs.sqlalchemy.org/en/latest/orm/tutorial.html
 [3]: http://docs.sqlalchemy.org/en/latest/orm/relationships.html#relationship-patterns
 [4]: http://docs.sqlalchemy.org/en/latest/orm/relationships.html#relationships-backref
 [5]: http://docs.sqlalchemy.org/en/latest/orm/relationships.html#sqlalchemy.orm.relationship
 [6]: http://en.wikipedia.org/wiki/Foreign_key
 [7]: http://docs.sqlalchemy.org/en/latest/orm/collections.html#custom-collections
 [8]: http://en.wikipedia.org/wiki/Join_%28SQL%29
 [9]: http://docs.sqlalchemy.org/en/latest/core/tutorial.html
 [10]: http://docs.sqlalchemy.org/en/latest/orm/loading.html#zen-of-eager-loading
 [11]: http://docs.sqlalchemy.org/en/latest/orm/loading.html
 [12]: http://docs.sqlalchemy.org/en/latest/orm/collections.html#passive-deletes
 [13]: http://docs.sqlalchemy.org/en/latest/orm/relationships.html#association-pattern
 [14]: http://docs.sqlalchemy.org/en/latest/orm/query.html
 [15]: http://docs.sqlalchemy.org/en/latest/orm/mapper_config.html
 [16]: http://docs.sqlalchemy.org/en/latest/orm/relationships.html
 [17]: http://docs.sqlalchemy.org/en/latest/orm/session.html