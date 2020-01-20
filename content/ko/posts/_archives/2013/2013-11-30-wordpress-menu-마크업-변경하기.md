---
title: WordPress Menu 마크업 변경하기
author: haruair
type: post
date: "2013-11-29T15:12:51"
history:
  - 
    from: https://www.haruair.com/blog/1895
    movedAt: 2018-09-13T22:02:40+00:00
lang: ko
slug: changing-wordpress-menu-markup
categories:
  - 개발 이야기
tags:
  - walker
  - walker_nav_menu
  - wordpress
  - wordpress menu
  - 워드프레스 메뉴 커스터마이즈

---
WordPress에 내장되어 있는 메뉴(Menu)는 이미 쓸만한 `class`명이 이미 다 붙어 있어 사실 딱히 수정이 필요가 없는 편이다. 예를 들면 현재 활성화 된 메뉴는 `.current-menu-item` 라든가, 해당 메뉴가 연결된 포스트의 타입을 `.menu-item-object-page` 식으로 이미 선언되어 있다. 하지만 디자인으로 인해 마크업을 추가하거나 변경해야 하는 경우가 간혹 있는데 그럴 때는 `Walker` 클래스를 사용해 변경할 수 있다.

`Walker`는 WordPress에서 트리 형태와 같이 상속이 있는 데이터 구조를 다루기 위해 사용되는 클래스이며, 자세한 내용은 WordPress의 [Walker 항목][1]을 참고하도록 한다. 문서가 조금 조잡한 감이 있는데 구글에서 검색해보면 더 자세하게 풀어서 작성한 포스트도 꽤 많이 있으므로 참고하자.

일반적으로 템플릿에서 메뉴를 불러오기 위해서 `wp_nav_menu()` 함수를 사용한다.

    <div class="nav-wrapper">
    <?php wp_nav_menu( array('menu' => 'Global Nav' )); ?>
    </div>
    

이때 `wp_nav_menu()`를 통해 생성되는 메뉴는 `walker` 파라미터가 지정되어 있지 않기 떄문에 기본값인 `Walker_Nav_Menu` 클래스를 사용해 생성하게 된다. 즉, `Walker_Nav_Menu` 클래스를 상속하는 새 클래스를 작성한 후에 `walker` 파라미터에 지정해주면 원하는 형태의 마크업으로 변경할 수 있게 된다.

다음의 예시는 다중 하위 메뉴에서 나타나는 `ul.sub-menu`를 `div.sub-menu-wrapper`로 한번 더 감싸주기 위한 클래스다. 기존 `Walker_Nav_Menu` 클래스에서 정의된 메소드를 오버라이딩해서 `div`를 추가한다.

    <?php
    class Custom_Walker_Nav_Menu extends Walker_Nav_Menu {
    
            function start_lvl( &$output, $depth = 0, $args = array() ) {
                    $indent = str_repeat("\t", $depth);
                    $output .= "\n$indent<div class=\"sub-menu-wrapper\"><ul class=\"sub-menu\">\n";
            }
    
            function end_lvl( &$output, $depth = 0, $args = array() ) {
                    $indent = str_repeat("\t", $depth);
                    $output .= "$indent</ul></div>\n";
            }
    
    }
    

`Walker_Nav_Menu`는 `wp-includes/nav-menu-template.php`에 선언되어 있으며, 오버라이딩 하고 싶은 메소드를 위와 같은 방식으로 본 클래스의 메소드 내용을 참고해 작성하면 된다.

위와 같이 작성한 클래스를 현재 사용하고 있는 템플릿의 `functions.php`에 선언해주고 `wp_nav_menu()` 함수에서 해당 `walker`를 참조하도록 추가한다.

    <div class="nav-wrapper">
    <?php wp_nav_menu( array('menu' => 'Global Nav', 'walker' => new Custom_Walker_Nav_Menu )); ?>
    </div>
    

그러면 앞서 작성한 클래스를 참고해 새로운 마크업 메뉴를 생성하게 된다.

버전 2.1에서 제안된 `Walker` 클래스들은 앞서 이야기한 바와 같이 트리 구조의 데이터를 직접 파싱하는 형태로 구성되어 있다. 자료형과 마크업이 아직도 유기적인 상태라서, 부모 메소드를 실행한 후 결과를 처리하거나 하는 방식으로 작업할 수 없다. 그로 인해 다소 지저분하고 기존 내용을 반복적으로 작성해야 하는 번거로움이 여전히 있는데 최근 버전에서 `Walker`로 처리되는 데이터 구조가 많아지고 있어 조만간 리펙토링이 진행될 것으로 보인다.

 [1]: http://codex.wordpress.org/Class_Reference/Walker