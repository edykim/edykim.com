---
title: 터미널에서 GitHub 이슈 관리하기 ghi
author: haruair
type: post
date: "2016-04-04T00:00:55"
history:
  - 
    from: https://www.haruair.com/blog/3513
    movedAt: 2018-09-13T22:02:42+00:00
lang: ko
slug: managing-github-issues-at-the-terminal-ghi
categories:
  - 두루두루 IT
tags:
  - ghi
  - terminal
  - 터미널에서

---
조금은 생산적인 도구를 소개하는 것도 좋을 것 같아 GitHub 서비스를 위한 도구를 소개한다. GitHub API를 이용한 ghi가 꽤 많은데 API v3에 맞춰 현재까지 관리되고 있는 도구로 [ghi][1]가 있다. Github 리포지터리에 등록된 issue를 CLI에서 관리할 수 있도록 기능을 제공한다.

brew로 설치하거나 Ruby로 작성되어 있어서 gem으로도 설치 가능하다.

    $ brew install ghi
    $ gem install ghi
    

curl로도 설치할 수 있다.

    $ curl -sL https://raw.githubusercontent.com/stephencelis/ghi/master/ghi > ghi && \
    $ chmod 755 ghi && mv ghi /usr/local/bin
    

설치 후에 토큰을 발급 받기 위해서는 다음 명령이 필요하다.

    $ ghi config --auth <GitHub 사용자ID>
    

맥에서는 키체인을 이용해서 토큰과 사용자 정보를 저장하는데 키체인의 문제인지 제대로 동작하지 않는다.<sup id="fnref-3513-1"><a href="#fn-3513-1">1</a></sup> 그래서 내 경우는 수동으로 입력했는데 token을 위 방법으로 발급 받은 다음, [GitHub access tokens][2] 페이지에서 생성된 토큰을 `Edit > Regenerate token` 해서 다음과 같이 환경변수를 지정해줬다.

    $ export GHI_TOKEN=<재생성한 access token>
    

이제 `ghi`를 입력하면 현재 배정된 이슈 목록이 출력되며 전체 목록은 필터 플래그를 이용해 `ghi list -f 'all'`로 확인할 수 있다. `ghi help` 및 `ghi help <명령어>`로 도움말을 확인하자.<figure style="width: 1024px" class="wp-caption alignnone">

<img src="https://farm2.staticflickr.com/1628/26044845926_e37bdf7682_b.jpg?resize=660%2C345&#038;ssl=1" width="660" height="345" class data-recalc-dims="1" /><figcaption class="wp-caption-text">이제 웹브라우저 없이도 GitHub 이슈를 추적할 수 있다!</figcaption></figure> 

다른 도구도 많이 있는데 대부분 v2이 deprecated 된 이후로 업데이트 되지 않거나 전혀 관리되지 않고 있어서 아쉽다.

<li id="fn-3513-1">
  리포지터리에 가도 관련 이슈가 넘쳐 나는데 해결책이 뚜렷하지 않다.&#160;<a href="#fnref-3513-1">&#8617;</a> </fn></footnotes>

 [1]: https://github.com/stephencelis/ghi
 [2]: https://github.com/settings/tokens
