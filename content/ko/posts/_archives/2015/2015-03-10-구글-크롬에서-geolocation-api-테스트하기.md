---
title: 구글 크롬에서 Geolocation API 테스트하기
author: haruair
type: post
date: "2015-03-10T05:08:20"
history:
  - 
    from: https://www.haruair.com/blog/2653
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: testing-the-geolocation-api-in-google-chrome
categories:
  - 개발 이야기
tags:
  - Chrome
  - geolocation

---
HTML5에서 추가된 Geolocation API는 웹 브라우저에서 사용자 위치를 찾을 수 있도록 도와주는 API다. 이 API를 기반으로 웹앱을 만들거나 웹사이트에서 기능을 구현하면 임의의 경도, 위도로 변경해 테스트를 해야 하는 경우가 있는데 Google Chrome 개발자 도구에서 이 Geolocation 위치를 변경하는 기능을 지원한다.

개발자 도구에서 스마트폰 모양 아이콘을 클릭해 emulation 모드를 활성화 한 후, 하단 emulation 탭에서 좌측 Sensors 항목을 클릭하면 Emulate geolocation coordinates 항목을 확인할 수 있다.

[<img src="https://farm9.staticflickr.com/8678/16584287368_cd7866943e_o.png?w=660&#038;ssl=1" alt="emulate geolcation coordinates" class="aligncenter" data-recalc-dims="1" />][1]

좌표를 입력하면 API에서의 좌표가 변경된 것을 볼 수 있다.

[<img src="https://farm9.staticflickr.com/8599/16584457060_7c70645024_o.png?w=660&#038;ssl=1" alt="geolocation result" class="aligncenter" data-recalc-dims="1" />][2]

 [1]: http://www.flickr.com/photos/90112078@N08/16584287368 "emulate geolcation"
 [2]: http://www.flickr.com/photos/90112078@N08/16584457060 "geolocation result"