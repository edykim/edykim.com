---
title: wordpress plugin 개발 후기
author: haruair
type: post
date: "2012-08-20T13:33:17"
history:
  - 
    from: https://www.haruair.com/blog/1301
    movedAt: 2018-09-13T22:02:40+00:00
lang: ko
slug: wordpress-plugin
categories:
  - 개발 이야기
tags:
  - plugin
  - wordpress

---
WordPress에 폼메일을 위한 강력한 플러그인이 참 많은데 그 중 contact form 7이 유명하기도 하고 편리하다. 이 폼메일과 mailchimp를 연동하기 위해 플러그인을 검색해봤지만 3rd party integration plugin은 있는데 영 사용하는 방법이 직관적이지 않아서 contact form 7 with mailchimp plugin을 만들게 되었다.

독립적으로 운영되는 plugin이 아닌 dependancy가 있는 plugin이지만 wordpress에서 기능 확장을 어떤 방식으로 하는지 알 수 있는 좋은 기회였다.

플러그인에서 가장 기본적인 방식은 hooking 인데 값을 변경하거나 프로세스를 추가하고 싶은 소스에서 do\_action()을 찾아 메소드를 add\_action()을 통해 붙여주면 hooking으로 실행되는 방식이다. 쉽게 생각해보면 소스에 일종의 색인이 있는데 그 색인에 기능을 연결해주면 그곳을 통과할 때 그 기능도 실행이 된다는 것.

더 나아가 워드프레스 플러그인 개발에 확장성을 고려한다면 do_action()을 메소드의 before, after 또는 각 프로세스 부분마다 미리 넣어주는 것이 중요하다.

워드프레스 관리자에 메뉴를 추가할 때도 submenu 관련 함수와 해당 메뉴에 접근했을 때 실행될 function을 연결(binding 하는 느낌으로..)하면 해당 메뉴가 생성되며 그 페이지로 들어갔을 때 해당 function이 실행이 된다.

워낙에 reference가 잘 되어 있어서 필요한 method는 금방 금방 검색해서 찾을 수 있었다.

filter도 mailchimp로 전송하는 내용을 치환하는 부분에서 사용하긴 했는데 기존 contact form 7에 것 그대로 사용해서 자세히 들여보지는 않았는데 callback method도 사용 가능한 것으로 보아&#8230; 모르겠다. 나중에 더 자세히 보고.

환경설정을 저장할 때는 get\_config()랑 set\_config()가 있는데 따로 데이터베이스 작업 없이도 알아서 저장된다. custom post type도 따로 작업 없이 가능하다.

각각의 contact form에 맞는 mailchimp 데이터를 저장하기 위해 custom post type을 사용했는데 해당 post를 잡아내 post\_id를 가져오려는데 WP\_Query()의 s 파라미터를 사용했다. 더 간편한 방법이 있을 것 같은데 문서 찾아봐도 잘 모르겠어서 그냥 while statement로 작업했다.

한두번 작업 더하면 익숙해져서 뭐든 할 것 같은 이 근거없는 자신감!

joomla에서도 플러그인 작업을 해봤는데 MVC로 구현할 수 있는 샘플 플러그인으로 작업했는데 모델, 컨트롤러, 뷰컨트롤러, 뷰 이렇게 4단계인 기분이었다. 줌라는 그냥 CI처럼 추가기능 개발하고 그냥 데이터베이스에 바로 쿼리 넣고 받아오고 이랬는데 wordpress는 wp만의 스타일을 느낄 수 있어서 좋았다.

drupal이나 magento도 경험해볼 기회가 왔으면 좋겠다.