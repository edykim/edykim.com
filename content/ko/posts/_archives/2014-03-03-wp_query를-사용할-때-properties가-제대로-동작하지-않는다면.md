---
title: WP_Query를 사용할 때 Properties가 제대로 동작하지 않는다면
author: haruair
type: post
date: "2014-03-03T10:48:37"
history:
  - 
    from: https://www.haruair.com/blog/2012
    movedAt: 2018-09-13T22:02:40+00:00
lang: ko
slug: if-properties-does-not-work-properly-when-using-wpquery
categories:
  - 개발 이야기
tags:
  - hook
  - php
  - wordpress
  - wp_query
  - 이상한 모임

---
WordPress에서 제공하는 클래스인 `WP_Query`는 wordpress의 컨텐츠(Post, Page, Custom content etc.)를 쉽게 불러 사용할 수 있도록 도와준다. Widget이나 테마 등에서 컨텐츠 목록을 제공할 필요가 있을 때 편리하게 사용할 수 있다.

    <?php    
    // The Query
    $the_query = new WP_Query( $args );
    
    // The Loop
    while ( $the_query->have_posts() ) {
        $the_query->the_post();
        echo '<li>' . get_the_title() . '</li>';
    }
    

자세한 내용은 WordPress에서 제공하는 [WP_Query][1] 문서에서 확인할 수 있다.

`WP_Query`에서는 데이터를 가져올 때 array의 형태로 properties를 추가해 활용한다. 한 페이지에서 `WP_Query`를 여러번 사용할 수도 있는데 이런 경우, 재사용성을 높이기 위해 이전의 설정들이 저장되어 의도하지 않은 데이터가 출력될 때가 있다. 그런 경우를 위해 설정을 초기화 하는 함수인 `wp_reset_postdata()`가 제공된다.

    <?php    
    // The Query
    $the_query = new WP_Query( $args );
    
    // The Loop
    while ( $the_query->have_posts() ) {
        $the_query->the_post();
        echo '<li>' . get_the_title() . '</li>';
    }
    wp_reset_postdata();
    
    $new_query = new WP_Query( $new_args );
    

`wp_reset_postdata()`를 사용했는데도 입력한 properties가 무시되는 등 의도한 대로 동작하지 않는 경우가 있다. 이 경우는 `WP_Query` 클래스에서 포스트를 가져올 때 `pre_get_posts` hook을 실행하는데 이 포인트에 query 결과를 조작하는 action이 등록되어 있을 가능성이 높다.

이 hook을 잘못 건들면 대다수의 플러그인과 테마에서 문제가 발생할 수 있기 때문에 만지지 않는걸(should not) 권장한다. Woo Commerce와 같은, 규모가 큰 플러그인은 구현 편의를 위해 이 hook을 사용해 개발하는 경우가 있다. 즉, `WP_Query`가 제대로 동작하지 않는다면 다른 플러그인이나 테마에서 `pre_get_posts`를 조작하고 있는지 확인해야 한다.

    <?php
    
    wp_reset_postdata();
    
    global $evil_class;
    remove_action( 'pre_get_posts', array( $evil_class, 'inject_get_posts' ) );
    
    // The Query
    $the_query = new WP_Query( $args );
    
    // The Loop
    while ( $the_query->have_posts() ) {
        $the_query->the_post();
        echo '<li>' . get_the_title() . '</li>';
    }
    
    // Recover
    wp_reset_postdata();
    add_action( 'pre_get_posts', array( $evil_class, 'inject_get_posts' ) );

 [1]: http://codex.wordpress.org/Class_Reference/WP_Query