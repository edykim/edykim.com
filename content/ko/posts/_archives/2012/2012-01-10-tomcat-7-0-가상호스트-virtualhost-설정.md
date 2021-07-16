---
title: tomcat 7.0 가상호스트 virtualhost 설정
author: haruair
type: post
date: "2012-01-10T02:44:27"
history:
  - 
    from: https://www.haruair.com/blog/1021
    movedAt: 2018-09-13T22:02:40+00:00
lang: ko
slug: tomcat-7.0-virtual-host-virtualhost-setup
categories:
  - 개발 이야기

---
java는 기껏해야 headfirst 한권 읽은 수준인데 tomcat 서버 설정을 하려니 막막했다. 검색을 해봐도 한글 문서는 흔치 않았고&#8230; 며칠 생각했는데 답은 그냥 레퍼런스에서 나오는 내용이었다. 바로 레퍼런스 봤으면 5분도 안되서 해결했을 내용 XP

tomcat에서 도메인을 기준으로 여러개의 사이트를 운영 즉, 가상호스트를 설정하려면 아래와 같이 하면 된다.

```
<Hostname="localhost" appBase="webapps"
  unpackWARs="true" autoDeploy="true"
  xmlValidation="false" xmlNamespaceAware="false">
</Host>
<Host name="www.testdomain.com" appBase="new_webapps"
  unpackWARs="true" autoDeploy="true"
  xmlValidation="false" xmlNamespaceAware="false">
</Host>
```

appBase 경로는 tomcat 경로를 기준으로 되어 있고 절대경로를 입력해줘도 된다. 그리고 ROOT라는 파일 또는 디렉토리가 default값으로 설정되는데 심볼릭 링크로 /home/아이디 식으로 주면 그쪽 파일로 연결된다. ftp 생각하면 유저 발급해주고 이렇게 걸어주면 편하다. (SVN 없는&#8230; 상황에서는;)

그런데 이렇게 걸었더니 문제가 www 없이 도메인을 입력하고 들어가면 not found가 되거나 localhost로 연결이 된다. 그냥 apache라면 alias를 지정해주면 되었는데&#8230; xml 형태라 어떻게 해줘야하나 몰라서 host를 동일하게 추가해보기도 했고 name에 와일드카드(*)를 넣어보기도 했다. 당연히 결과는&#8230;ㅋㅋ 답은 레퍼런스에서 찾았다.

```
<Host name="www.testdomain.com" appBase="new_webapps"
  unpackWARs="true" autoDeploy="true"
  xmlValidation="false" xmlNamespaceAware="false">
  <Alias>testdomain.com</Alias>
</Host>
```

다시금 레퍼런스의 중요함을 깨닫는 순간이었다;;