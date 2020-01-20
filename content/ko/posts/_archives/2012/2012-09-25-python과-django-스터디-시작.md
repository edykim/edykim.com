---
title: python과 django 스터디 시작
author: haruair
type: post
date: "2012-09-25T00:49:58"
history:
  - 
    from: https://www.haruair.com/blog/1337
    movedAt: 2018-09-13T22:02:40+00:00
lang: ko
slug: start-python-and-django-studies
categories:
  - 나의 이야기

---
흔히 말하는 꾸준글을 잘 못하는 탓에 도움 받은 링크 및 배운 부분들을 간략하게나마 정리하는 글을 적어본다.

  * <a href="http://shop.oreilly.com/product/9780596158071.do" target="_blank">Oreilly의 python 쥐돌이책</a>으로 시작&#8230;
  
    하려다가 프로그래밍 입문자한테 설명하는 느낌이라&#8230; 출퇴근시 소설 읽듯 읽었다.
  * Python 기초는 <a href="http://wikidocs.net/read/book/136" target="_blank">왕초보를 위한 Python 2.7</a> 위키를 통해 습득했다.
  * django는 <a href="http://blog.hannal.net/01-python_django_lecture/" target="_blank">한날님의 블로그에 연재된 글</a>을 통해 그 힘을 충분히 느껴볼 수 있었다.

아래는 한날님의 포스트를 따라가며 적은 노트.

  * django 상당히 강력하다. 클래스만 만들면 알아서 다대다 테이블까지 작성해준다. 이터레이션 아이템에 대한 처리도 돋보인다.
  * django 가 1.4까지 판올림 된 상황이라 위 포스트대로 안되는 부분들이 있는데 다들 코멘트를 남겨주셔서 그거 보면 충분히 해결된다.
  * py-mysql을 안받아놔서 (집에 인터넷 안되서 강제 오프라인 스터디;) 자체적으로 지원하는 sqlite3를 썼는데&#8230; db는 설정만 해주면 어떤 db인가에 따라 알아서 처리하므로 딱히 고민 없어도 되는 모양.

그 외의 기록.

  * python 참 깔끔함. 강력함.
  * django 웹사이트에서 Documentation을 epub, pdf, html 등 다양한 포맷으로 지원해준다. 한동안 오프라인 스터디를 해야 하는 나에겐 너무나도 감사함.
  * 조금 복잡한 구조가 된다 싶으면&#8230; 예를 든다면 쇼핑 장바구니와 같은 구조라면 어떻게 모델 클래스 구성이 달라지는지 궁금함. 만약 직접 sql을 작성해야 하는 복잡스런 구조라면? (설계가 잘못되었다고 탓하려나..;)
  * django에서의 MVC 명칭이 다르다. Model, Template, View인데 View가 MVC의 Controller, Template이 View의 역할.
  * go live의 상황이 된다면 어디에 서비스를 올려야 하는가. 요즘은 가상서버 호스팅을 많이 지원하니까 딱히 걱정은 없는 편. AWS도 좋은 방법이다.