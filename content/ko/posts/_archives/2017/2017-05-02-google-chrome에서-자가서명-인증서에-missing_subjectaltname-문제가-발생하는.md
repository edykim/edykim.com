---
title: Google Chrome에서 자가서명 인증서에 missing_subjectAltName 문제가 발생하는 경우
author: haruair
type: post
date: "2017-05-02T05:25:11"
history:
  - 
    from: https://www.haruair.com/blog/3887
    movedAt: 2018-09-13T22:02:42+00:00
lang: ko
slug: google-chrome-has-a-missingsubjectaltname-issue-with-a-selfsigned-certificate
categories:
  - 개발 이야기
tags:
  - google chrome
---

Google Chrome 58 에서 정책 EnableCommonNameFallbackForLocalAnchors의 기본 설정이 변경되었다. 이 변경으로 개발 환경에서 https에 사용하는 사내 자가서명 인증서에 `missing_subjectAltName` 문제로 접근이 차단되었다.

보안상 이 설정을 변경하지 않는 것이 옳지만 인증서를 다시 발급받는 과정이 오래 걸리고 그 동안 가만히 있을 순 없기 때문에 해법을 검색했다. 최근 변경사항이라 글이 많지 않았지만 답을 찾을 수 있었다. 앞서 언급한 EnableCommonNameFallbackForLocalAnchors 설정을 활성화하면 된다.

각 운영체제에 따라 크롬의 정책을 변경하는 방법이 다르기 때문에 [각 운영체제의 Quick Start][1]를 참고한다. 다만 맥에서는 Workgroup Manager를 더이상 지원하지 않는다. 대신 아래 방식으로 설정을 전환할 수 있다. 터미널에서 다음 명령을 실행한다.

    $ defaults write com.google.Chrome EnableCommonNameFallbackForLocalAnchors -bool true
    

변경된 설정은 `chrome://policy/`에 접속하면 확인할 수 있다.

다음 페이지를 참고했고 더 자세한 내용을 확인할 수 있다.

  * [EnableCommonNameFallbackForLocalAnchors 정책 (chromium.org)][2]
  * [기본 설정 변경 이슈 (bugs.chromium.org)][3]
  * [Chrome 58 & HTTPS decryption proxy issues (reddit)][4]
  * [Chrome 58 displays an untrusted warning for certs that don&#8217;t have a subject alternate name? (reddit)][5]

 [1]: http://www.chromium.org/administrators
 [2]: https://www.chromium.org/administrators/policy-list-3#EnableCommonNameFallbackForLocalAnchors
 [3]: https://bugs.chromium.org/p/chromium/issues/detail?id=700595&desc=2
 [4]: https://www.reddit.com/r/sysadmin/comments/66hitj/chrome_58_https_decryption_proxy_issues/
 [5]: https://www.reddit.com/r/sysadmin/comments/66clon/chrome_58_displays_an_untrusted_warning_for_certs/