---
title: Comprehensive Google Map Plugin(CGMP) conflicted with W3 Total Cache
author: haruair
type: post
date: "2013-06-12T08:09:21"
history:
  - 
    from: https://www.haruair.com/blog/1661
    movedAt: 2018-09-13T22:02:40+00:00
lang: ko
slug: comprehensive-google-map-plugin-cgmp-conflicted-with-w3-total-cache
categories:
  - 개발 이야기
tags:
  - CGMP
  - Comprehensive Google Map Plugin
  - Conflicted
  - W3 Total Cache

---
When I installed W3 Total Cache, It was always problem with Comprehensive Google Map Plugin. Although W3 Total Cache is awesome plugin, I couldn&#8217;t use it for this problem. I spent time today and I found what problem is.

It was problem with JSON parsing. In W3 Total cache, every page minify by replacing space to new line(\n). So we can fix a code like below:

<span style="color:#E01B5D;">/plugins/comprehensive-google-map-plugin/assets/js/cgmp.framework.js</span>
  
`// CGMPGlobal.errors = parseJson(CGMPGlobal.errors);<br />
CGMPGlobal.errors = parseJson(CGMPGlobal.errors.replace(/\n/gi,""));`

And then, wrapping jQuery. It need to be run after jQuery loaded.

`jQuery(function(){ /* all code */ });`

<span style="color:#E01B5D;">/plugins/comprehensive-google-map-plugin/assets/js/cgmp.framework.min.js</span>
  
`// find w(i) and then change to the code<br />
w(i.replace(/\n/gi,""))`

Also wrapping jQuery in same way.

`jQuery(function(){ /* all code */ });`

I hope you get answer what you want.