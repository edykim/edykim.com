---
title: 워드프레스 유지보수 모드 (Maintenance mode)
author: haruair
uuid: "00d90326-07e1-4229-af70-8bca5a955b74"
type: post
date: "2015-03-16T22:36:30"
history:
  - 
    from: https://www.haruair.com/blog/2660
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: wordpress-maintenance-mode
tags:
  - 개발 이야기
  - maintenance
  - wordpress
  - 워드프레스
  - 유지보수

---
워드프레스에서 유지보수를 위해 사이트를 일시적으로 차단할 경우가 있다면 유지보수 모드(Maintenance mode)를 활용할 수 있다.

사용자로서 워드프레스를 이용하게 될 때에는 이 모드를 보게 되는 일이 거의 없다. 만약 보게 된다면 워드프레스 플러그인, 테마, 코어를 업데이트 하는 도중에 사이트에 접속하게 되는 경우다. 설치 과정을 눈여겨 본 사용자라면 유지보수 모드를 켜고 설치 과정이 진행된 후 완료 되면 다시 유지보수 모드가 해제되는 것을 확인할 수 있다.

만약 업데이트 중에 페이지를 벗어나게 된다면 유지보수 모드가 해제되지 않아 사이트가 닫힌 상태로 유지된다. 이럴 때에는 직접 유지보수 모드를 직접 해제해야 한다.

<img src="https://live.staticflickr.com/7639/16812310856_69276d5fb2_o.png?w=660&#038;ssl=1" alt="maintenance mode" class="aligncenter" />

워드프레스 웹사이트에서 다음과 같은 화면을 본다면 유지보수 모드가 켜져있는 상태다.

## 유지보수 모드 켜고 끄기

유지보수 모드는 워드프레스 최상위 폴더에 `.maintenance`라는 이름으로 빈 텍스트 파일을 생성하면 활성화 된다. 유지보수 모드를 끄려면 이 파일을 지우면 된다.

<img src="https://live.staticflickr.com/7628/16812306596_71c7bb2dc0_o.png?w=660&#038;ssl=1" alt=".Maintenance file" class="aligncenter" />

## 유지보수 페이지 변경하기

유지보수 페이지를 좀 더 친절하게 변경하고 싶다면 `wp-content/maintenance.php` 파일을 만들어 해당 내용을 작성하면 된다. 기본적으로 출력되는 유지보수 페이지는 `503 Service Unavailable` 를 반환한다는 사실을 참고하자.

    <?php
      $protocol = $_SERVER["SERVER_PROTOCOL"];
      if ( 'HTTP/1.1' != $protocol && 'HTTP/1.0' != $protocol )
        $protocol = 'HTTP/1.0';
      header( "$protocol 503 Service Unavailable", true, 503 );
      header( 'Content-Type: text/html; charset=utf-8' );
      header( 'Retry-After: 600' );
    ?>
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="utf-8">
      <title>Haruair.com 점검중</title>
    </head>
    <body>
      <h1>현재 웹사이트 점검중입니다. 잠시 후에 다시 접속해주시기 바랍니다.</h1>
    </body>
    </html>