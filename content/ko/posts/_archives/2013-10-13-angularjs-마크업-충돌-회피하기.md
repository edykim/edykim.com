---
title: AngularJS 마크업 충돌 회피하기
author: haruair
type: post
date: 2013-10-13T08:55:11+00:00
history:
  - 
    from: https://www.haruair.com/blog/1841
    movedAt: 2018-09-13T22:02:40+00:00
lang: ko
slug: avoid-angularjs-markup-collision
categories:
  - 개발 이야기
tags:
  - angularjs
  - front

---
`AngularJS`는 `{{}}` 방식의 인터폴레이션 마크업을 사용하는데 `flask(jinja)`나 `django` 등에서 `{{ foo }}` 형태의 템플릿 마크업을 이미 사용하고 있어서 문제가 된다. 이런 경우를 위해 AngularJS에서 `$interpolateProvider`를 지원하는데 이를 이용해 문제를 회피할 수 있다.

    var customInterpolationApp = angular.module('customInterpolationApp', []);
    
    customInterpolationApp.config(function($interpolateProvider) {
        $interpolateProvider.startSymbol('{@');
        $interpolateProvider.endSymbol('@}');
    });
    

자세한 내용은 [AngularJS의 $interpolateProvider][1] 문서에서 확인할 수 있다.

 [1]: http://docs.angularjs.org/api/ng.$interpolateProvider