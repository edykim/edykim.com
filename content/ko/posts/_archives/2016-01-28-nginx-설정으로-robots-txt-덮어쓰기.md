---
title: Nginx 설정으로 robots.txt 덮어쓰기
author: haruair
type: post
date: 2016-01-28T06:25:47+00:00
history:
  - 
    from: https://www.haruair.com/blog/3349
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: overwrite-robots.txt-with-nginx-settings
categories:
  - 개발 이야기
tags:
  - nginx
  - robots.txt

---
대부분 개발은 폐쇄망에서 개발하거나 공개되어도 auth 등을 걸어둬 아무나 접속하지 못하는 환경이기 때문에 큰 문제가 없다. 하지만 가끔 크롤링 되지 말아야 할 사이트가 검색엔진에 크롤링 되는 경우가 종종 있다. robots.txt을 `.gitignore`에 넣어 각 환경에 맞게 파일을 분리해서 사용하는 경우도 있는데 제대로 설정이 되지 않아서 크롤링이 되는 경우도 있다. (누가 뭘 한 지는 모르겠지만.)

이럴 때 nginx에 다음 설정을 추가하는 것으로 `robots.txt` 파일의 유무와 상관 없이 disallow 규칙을 반환하게 할 수 있다.

    location /robots.txt {
        return 200 "User-agent: *\nDisallow: /";
    }
    

사소한 팁이긴 하지만 아직도 호스팅 환경을 FTP로 클라이언트와 공유하게 되는 경우가 많아 이런 문제가 종종 발생한다. (클라이언트의 엄마친구아들이 좀 안다고 들어와서 만져놓고 우리한텐 안만졌는데 고장났다고 하거나) 이렇게 서버 레벨에서 제어하는 것이 유용할 때가 있다.