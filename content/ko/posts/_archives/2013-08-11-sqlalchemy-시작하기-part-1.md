---
title: SQLAlchemy 시작하기 – Part 1
author: haruair
type: post
date: 2013-08-11T08:56:24+00:00
history:
  - 
    from: https://www.haruair.com/blog/1682
    movedAt: 2018-09-13T22:02:40+00:00
lang: ko
slug: getting-started-with-sqlalchemy-part-1
categories:
  - 번역
tags:
  - python
  - sqlalchemy
  - 대충번역센터
  - 입문
  - 튜토리얼

---
오라일리 책을 구입해두고 안보고 있다가 이제야 보니 다른 부분이 너무나도 많아서 문서 보면서 배우기로 급 선회했다. 한글 문서로 먼저 훑어보면 좋을텐데 검색 능력이 부족해서 찾질 못하겠더라. 문서 보면서 대충 날림 번역으로 남겨놨다. 하루면 페이지 다 따라해볼 수 있을 것 같았는데 딴짓하느라 하루에 다 완료를 못해서 파트를 쪼개기로. 주중에 짬짬이 나머지를 보기로 하고 일단 먼저 업로드!

(여기서 뭔가 모자란 부분이나 틀린게 있으면 틀린게 맞으므로 언제든 지적해주시고, 애매한 표현은 원본 문서를 봐주시면 감사하겠습니다. 원본 문서는 [SQLAlchemy Tutorial][1]. 한글로 된 sqlalchemy 튜토리얼 있으면 알려주세요!)

* * *

SQLAlchemy 객체 관계형 매퍼는 데이터베이스 테이블을 이용해 사용자가 정의한 파이썬 클래스의 메소드와 각각의 행을 나타내는 인스턴스로 표현된다. 객체와 각 연관된 행들의 모든 변경점들이 자동으로 동기되어 인스턴스에 반영되며, 그와 동시에 사용자가 정의한 클래스와 각 클래스 사이에 정의된 관계에 대해 쿼리할 수 있는 (Unit of work이라 하는)시스템을 포함하고 있다.

<!--more-->

이 ORM에서 사용하는 SQLAlchemy 표현 언어는 ORM의 구성 방식과도 같다. SQL언어 튜토리얼에서는 직접적인 의견을 배제한 채 데이터베이스들의 초기에 어떻게 구성해 나가야 하는지에 대해 설명하는 반면 ORM은 고수준의, 추상적인 패턴의 사용 방식과 그에 따른 표현 언어를 사용하는 방법을 예로 보여준다.

사용 패턴과 각 표현 언어가 겹쳐지는 동안, 초기와 달리 공통적으로 나타나는 사항에 대해 표면적으로 접근한다. 먼저 사용자가 정의한 도메인 모델서부터 기본적인 저장 모델을 새로 갱신하는 것까지의 모든 과정을 일련의 구조와 데이터로 접근하게 해야한다. 또 다른 접근 방식으로는 문자로 된 스키마와 SQL 표현식이 나타내는 투시도로부터 명쾌하게 구성해, 각 개별적인 데이터베이스를 메시지로 사용할 수 있게 해야 한다.

가장 성공적인 어플리케이션은 각각 독자적인 객체 관계형 매퍼로 구성되야 한다. 특별한 상황에서는, 어플리케이션은 더 특정한 데이터베이스의 상호작용을 필요로 하고 따라서 더 직접적인 표현 언어를 사용할 수 있어야 한다.

(제 실력이 미천해 깔끔하게 번역이 안되네요. 공통된 부분에만 집중하고 각 데이터베이스의 특징을 몰개성화 하며 단순히 저장공간으로 치부하는 다른 ORM과 달리 SQLAlchemy는 각 데이터베이스의 특징도 잘 살려내 만든 ORM이다, 대충 이런 내용입니다. 원문 보세요. ㅠㅠ)

* * *

## 버전 확인하기

    import sqlalchemy
    print sqlalchemy.__version__
    

## 접속하기

이 예시는 메모리서만 사용하는 sqlite 데이터베이스를 사용. `create_engine()`을 이용해 접속.

    from sqlalchemy import create_engine
    engine = create_engine('sqlite:///:memory:', echo=True)
    

echo는 로그를 위한 플래그. 파이썬 표준 logging 모듈 사용. 순수 SQL 코드를 보여준다.

engine은 선언만 해서 바로 연결되는게 아니라 첫 실행이 될 때 연결이 됨.

    print engine.execute("select 1").scalar()
    

ORM을 사용할 때는 위처럼 engine을 직접 이용할 필요는 없다. 맨 처음 연결 할 때 작성하고 ORM 사용하면 됨.

## 매핑 선언

ORM에서는 처음에 데이터베이스 테이블을 써먹을 수 있게 설정한 다음 직접 정의한 클래스에 맵핑을 해야한다. sqlalchemy에서는 두가지가 동시에 이뤄지는데 `Declarative` 란걸 이용해 클래스를 생성하고 실제 디비 테이블에 연결을 한다.

    from sqlalchemy.ext.declarative import declarative_base
    Base = declarative_base()
    

이러면 준비 끝. 이렇게 해두면 몇개고 매핑 클래스를 만들 수 있다. 매핑 클래스 내에서 디비의 컬럼을 나타내는 `Column` 클래스, 각 컬럼의 데이터타입을 나타내는 `Integer`, `String` 클래스를 불러와야한다.

    from sqlalchemy import Column, Integer, String
    
    class User(Base):
        __tablename__ = 'users'
    
        id = Column(Integer, primary_key=True)
        name = Column(String)
        fullname = Column(String)
        password = Column(String)
    
        def __init__(self, name, fullname, password):
            self.name = name
            self.fullname = fullname
            self.password = password
    
        def __repr__(self):
            return "<User('%s', '%s', '%s')>" % (self.name, self.fullname, self.password)
    

위 `User` 클래스는 `__tablename__`에서 정의한 테이블에 맵핑되고 primary key인 id와 name, fullname, password 컬럼을 가진다.

메소드는 마음껏 만들어도 상관없다. 파이썬 기본 class와 똑같음. `__init__`와 `__repr__`도 만들어도 되고 안만들어도 된다. `Base`를 상속하지만 이는 단지 최소의 설정만 담당할 뿐이다.

Declarative system으로 만들어진 이 클래스는 table metadata를 가지게 되는데 이게 사용자정의 클래스와 테이블을 연결해주는 구실을 한다. 예전엔 이 metadata를 만들고 클래스에 맵핑해서 썼는데 그 방식을 Classical Mapping이라고 얘기한다. 그 예전 방식에서는 Table이라는 데이터 구조와 Mapper 객체로 클래스와 맵핑한다. (오라일리에서 나온 sqlalchemy 책에선 이 구방식으로 설명한다 ;ㅅ;)

metadata를 보고 싶다면,

    User.__table__
    

mapper 클래스는,

    User.__mapper__
    

Declarative 기반 클래스는 모든 Table 객체들을 MetaData로 정의해두고 `.metadata` 속성을 통해 접근할 수 있게 도와준다.

아직 위의 예제 클래스는 테이블이 생성이 되지 않은 상태인데 `MetaData`를 통해 손쉽게 생성할 수 있도록 도와준다. 테이블을 생성할 때 `MetaData.create_all()` 로 생성할 수 있는데 이 메소드를 호출하면 Engine으로 연결된 데이터베이스에 테이블을 생성해준다.

    Base.metadata.create_all(engine)
    

## 최소 테이블 묘사 vs. 완전 상세돋는 묘사

sqlite나 postgresql은 테이블을 생성할 때 `varchar` 컬럼을 길이를 설정하지 않아도 별 문제 없이 데이터타입으로 쓸 수 있지만 그 외 데이터베이스에서는 허용되지 않는다. 그러므로 컬럼 길이가 필요한 데이터베이스의 경우 length가 필요하다.

    Column(String(50))
    

`Integer`, `Numeric` 같은 경우에도 위와 동일하게 쓸 수 있다.

덧붙여 Firebird나 오라클에서는 PK를 생성할 때 sequence가 필요한데 Sequence 생성자를 써야 한다.

    from sqlalchemy import Sequence
    Column(Integer, Sequence('user_id_seq'), primary_key=True)
    

위에서의 User 클래스를 다시 작성해보면,

    class User(Base):
        __tablename__ = 'users'
        id = Column(Integer, Sequence('user_id_seq'), primary_key=True)
        name = Column(String(50))
        fullname = Column(String(50))
        password = Column(String(12))
    
        def __init__(self, name, fullname, password):
            self.name = name
            self.fullname = fullname
            self.password = password
    
        def __repr__(self):
            return "<User('%s', '%s', '%s')>" % (self.name, self.fullname, self.password)
    

파이썬 안에서만 쓸꺼라면, 그리고 디비를 밖에서 이미 생성했다면 이전에 작성한 대로만 작성해도 상관 없다.

## 매핑된 클래스로 인스턴스 만들기

    ed_user = User('haruair', 'Edward Kim', '1234')
    ed_user.name        # 'haruair'
    ed_user.password    # '1234'
    str(ed_user.id)     # 'None'
    

id는 `__init__()`에서 정의되지 않았지만 맵핑을 해뒀기 때문에 None으로 존재한다. 기본적으로 ORM에서 생성된 클래스 속성들은 테이블에 맵핑된 것으로 표현된다. 이런 클래스 속성들은 descriptors로서 존재하는데 맵핑된 클래스를 위해 instrumentation을 정의해둔다. 이 instrumentaion은 이벤트를 바꾸거나 변경을 추적하거나 자동으로 새로운 데이터를 불러온다거나 할 때 도움을 주는 기능을 한다.

위의 값에서 &#8216;Edward Kim&#8217;을 디비에 넣기 전까진 id는 None이다. 디비에 넣으면 id값은 알아서 들어오게 된다.

## 세션 만들기

ORM은 데이터베이스를 `session`을 이용해 다룰 수 있는데 처음 앱을 작성할 때 `create_engine()`과 같은 레벨에서 Session 클래스를 factory 패턴으로 생성할 수 있다.

    from sqlalchemy.orm import sessionmaker
    Session = sessionmaker(bind=engine)
    

모듈레벨에서 작성하고 있어서 Engine이 아직 존재하지 않는다면,

    Session = sessionmaker()
    

이후에 engine을 생성하고 session의 configure를 이용한다.

    Session.configure(bind=engine)
    

위처럼 작성한 Session 클래스는 새 객체를 만들어서 데이터베이스와 연결이 된다. 다른 트랜잭션을 위한 것들은 `sessionmaker()`에서 호출될 때 정의되야 하는데 자세한건 이후 챕터에서 알려준다고. 이제부터 언제든 데이터베이스와의 대화가 필요할 때 `Session`을 불러서 쓰면 된다.

    session = Session()
    

위 `Session`은 Engine과 연결이 되어 있지만 아직 연결이 열린 상태는 아니다. 앞서와 같이 처음으로 사용될 때 Engine과 연결되고 모든 변경을 커밋하고 세션을 종료할 때까지 열려있게 된다.

## 세션 생성하는 패턴들

Session은 다양한 기반에 다양한 타입의 어플리케이션, 프래임워크에서 다양한 요구사항에서 짱짱 좋다. 그러니까 Session은 오브젝트와 일반적인 데이터베이스 접속에서 쓰면 된다. 어플리케이션 스레드를 저녁 만찬이라 생각하면, 세션은 손님의 접시이고 객체는 놓여질 음식이라 볼 수 있다. (디비는 주방쯤?) 세션을 어떻게 써야할지 고민한다면 다음 [링크 참조][2].

## 새 객체 추가하기

    ed_user= User('haruair', 'Edward Kim', '1234')
    session.add(ed_user)
    

여기선 실제로 데이터베이스에 추가된게 아니라 pending인 상태다. 아직 데이터베이스에 발행되지는 않은 상태인데 입력이 필요한 순간에는 flush라는 과정을 통해 입력이 된다. 만약 디비에 쿼리를 하면 모든 pending 된 정보는 flush되고 접근 가능한 상태가 된다. (실제로 저장된 상태는 아님. 여전히 pending.)

예를 들면 아래 코드는 `User` 인스턴스를 로드해 새 `Query` 객체를 생성한다.

    our_user = session.query(User).filter_by(name='haruair').first()
    our_user     # <User('haruair', 'Edward Kim', 'secret')>
    

사실 Session은 내부적으로 맵구조의 객체라 반환하는 값이 우리가 기존에 집어넣은 인스턴스랑 동일하다.

    ed_user is our_user     # True
    

ORM의 컨셉이 identity map이라서 session에서 하는 모든 처리들이 실제 데이터셋과 함께 동작한다. Session에서 PK를 가지면 PK 가진 같은 파이썬 객체를 반환한다. 그러니까 이미 있는 PK를 입력하면 에러가 난다.

add_all()로 한방에 추가할 수도 있다.

    session.add_all([
        User('wendy', 'Wendy Williams', 'foobar'),
        User('mary', 'Mary Contrary', 'xxg527'),
        User('fred', 'Fred Flinstone', 'blar')])
    

비밀번호를 함 바꿔보자.

    ed_user.password = 'test1234'
    

Session은 계속 연결되어있는 객체를 계속 주시하고 있다. 위처럼 수정하면 session은 이미 알고있다.

    session.dirty        # IdentitySet([<User('Edward', 'Edward Kim', 'test1234')>])
    

새로 추가한 애들도 볼 수 있다.

    session.new
    # IdentitySet([<User('mary', 'Mary Contrary', 'xxg527')>,
    #              <User('wendy', 'Wendy Williams', 'foobar')>,
    #              <User('fred', 'Fred Flinstone', 'blar')>])
    

`Session`에 pending된 애들을 실행시키려면,

    session.commit()
    

`commit()`은 모든 변경, 추가 이력을 반영한다. 이 트랜잭션이 모두 실행되면 세션은 다시 connection pool을 반환하고 물려있던 모든 객체들을 업데이트 한다.

암튼, 앞서 id가 &#8216;None&#8217; 이었던 녀석을 다시 보면,

    ed_user.id    # 1
    

`Session`이 새 행을 데이터베이스에 입력한 이후에 새로 생성된 행들은 식별자들과 데이터베이스에서 기본으로 설정된 값들을 instance에서 사용할 수 있게 된다. 즉시 사용할 수 있거나 첫 액세스에 로딩될 때 모두 사용할 수 있다. 위 경우엔 `commit()`을 실행한 이후 새 트랜잭션이 실행되어 모든 행이 다시 로드된 상태다.

sqlalchemy에서는 기본적으로 이전 트랜잭션에서 새 트랜잭션으로 처음 실행될 때 모든 데이터를 새로 가져온다. 그래서 가장 최근의 상태를 바로 사용할 수 있다. 다시 불러오는 레벨을 설정하고 싶으면 [세션 사용하기 문서][3]를 확인하자.

## 세션 객체의 상태들

`User` 객체가 Session 외부에서 PK 없이 Session 안에 들어가고 실제로 데이터베이스에 추가될 때 까지 각 &#8220;객체 상태&#8221; 를 가지고 있다. transient, pending, persistent 세가지. 이 상태들을 알고 있으면 도움이 되므로 [객체 상태에 대한 설명][4]을 잽싸게 읽어보자.

## 롤백하기

Session이 트랜잭션으로 동작하고 나서 우린 롤백 하는 것도 가능하다. 롤백해보기 위해 값을 변경해보자.

    ed_user.name = 'edkim'
    

그리고 가짜 유저를 하나 생성한다.

    fake_user = User('fakeuser', 'Invalid', '12345')
    session.add(fake_user)
    

Session을 query하면 일단 flush된 현재의 트랜잭션을 확인할 수 있다.

    session.query(User).filter(User.name.in_(['edkim', 'fakeuser'])).all()
    #[<User('edkim', 'Edward Kim', 'test1234')>, <User('fakeuser', 'Invalid', '12345')>]
    

롤백을 실행하면 변경하기 전 상태로 돌아간다.

    session.rollback()
    ed_user.name            # 'haruair'
    fake_user in session    # False
    

## 쿼리 보내기

`Query` 객체는 session에서 `query()` 메소드로 생성한다. 이 함수는 다양한 수의 아규먼트를 가질 수 있는데 다양한 클래스의 조합과 클래스 descriptor를 사용할 수 있다. 사실 `Query`는 `User` 인스턴스를 부를 때 이미 써봤다. iterative context를 evaluated할 때, User 객체 리스트를 반환한다.

    for instance in session.query(User).order_by(User.id):
        print instance.name, instance.fullname
    

`Query`는 `KeyedTuple` 클래스 통해 튜플로 반환하는데 일반적인 파이썬 객체처럼 활용할 수 있다. 각 저장된 값들은 클래스 이름이나 속성 이름과 동일하다.

    for row in session.query(User, User.name).all():
        print row.User, row.name
    

`label()`을 이용하면 컬럼 이름을 다르게 쓸 수 있다. 어떤 클래스 속성이든 매핑해서 쓸 수 있다. [ColumnElement][5]-derived object.

    for row in session.query(User.name.label('name_label')).all():
        print row.name_label
    

컬럼은 위 방식으로 하지만 `User` 같은 클래스 엔티티는 `aliased`를 이용해 제어할 수 있다.

    from sqlalchemy.orm import aliased
    user_alias = aliased(User, name='user_alias')
    for row in session.query(user_alias, user_alias.name).all():
        print row.user_alias
    

`LIMIT`이나 `OFFSET`을 포함한 기본적인 Query 동작은 order by와 함께 파이썬 배열에서 쪼개는(slice) 방식처럼 쓰면 된다.

    for user in session.query(User).order_by(User.id)[1:3]:
        print user
    

결과물을 filter 할 때에는 `filter_by()`를 쓰면 된다.

    for name in session.query(User.name).filter_by(fullname='Edward Kim'):
        print name
    

또는 `filter()`를 쓰면 되는데 좀더 유연한 SQL 표현을 쓸 수 있다. 매핑클래스에서 사용한 클래스 단위의 속성과 파이썬 표준 연산자를 쓸 수 있다.

    for name in session.query(User.name).filter(User.fullname=='Edward Kim'):
        print name
    

Query 객체는 완전 생산적이라 대부분의 메소드 호출은 새 Query 객체를 반환한다. 따라서 아래와 같이 꼬리를 무는 체이닝 방식으로 사용이 가능하다. (Where &#8230; And &#8230; 식으로 된다.)

    for name in session.query(User).\
                filter(User.name=='haruair').\
                filter(User.fullname=='Edward Kim'):
        print user
    

## 일반 필터(filter) 연산자들

### equals

    query.filter(User.name == 'ed')
    

### not equals

    query.filter(User.name != 'ed')
    

### LIKE

    query.filter(User.name.like('%ed%'))
    

### IN

    query.filter(User.name.in_(['ed', 'wendy', 'jack']))
    

서브쿼리식으로도 됨

    query.filter(User.name.in_(session.query(User.name).filter(User.name.like('%ed%'))))
    

### NOT IN

    query.filter(~User.name.in_(['ed', 'wendy', 'jack']))
    

### IS NULL

    filter(User.name == None)
    

### IS NOT NULL

    filter(User.name != None)
    

### AND

    from sqlalchemy import and_
    filter(and_(User.name == 'ed', User.fillname == 'Edward Kim'))
    

또는 위에서 본 체이닝 메소드로

    filter(User.name == 'ed').filter(User.fullname == 'Edward Kim')
    

### OR

    from sqlalchemy import or_
    filter(or_(User.name == 'ed', User.name == 'wendy'))
    

### match

    query.filter(User.name.match('wendy'))
    

* * *

[SQLAlchemy 시작하기 &#8211; Part 2][6]에서 계속.

 [1]: http://docs.sqlalchemy.org/en/latest/orm/tutorial.html
 [2]: http://docs.sqlalchemy.org/en/latest/orm/session.html#session-faq
 [3]: http://docs.sqlalchemy.org/en/latest/orm/session.html
 [4]: http://docs.sqlalchemy.org/en/latest/orm/session.html#session-object-states
 [5]: http://docs.sqlalchemy.org/en/latest/core/expression_api.html#sqlalchemy.sql.expression.ColumnElement
 [6]: http://haruair.com/blog/1695