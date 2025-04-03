---
title: 터미널에서 REST API 테스트하기 HTTPie
author: haruair
type: post
date: "2016-04-11T00:00:41"
history:
  - 
    from: https://www.haruair.com/blog/3516
    movedAt: 2018-09-13T22:02:42+00:00
lang: ko
slug: testing-the-rest-api-in-terminal-httpie
tags:
  - 개발 잡동사니
  - HTTPie
  - terminal
  - 터미널에서

---
REST API를 테스트하는데 curl과 wget을 사용할 수 있겠지만 좀 더 읽기 쉽고 사용하기 좋은 도구가 있다. [HTTPie][1]는 cURL-like tool for humans라는 멋진 태그라인을 갖고 있는 강력한 CLI 도구다. 따지고 보면 curl에서도 모두 가능한 기능이지만 플래그를 주렁주렁 입력할 필요가 없이 간편하게 사용할 수 있고 컬러 스킴이 있어 훨씬 읽기 편하다.

이 도구는 온갖 패키지 관리자에 다 들어있기 때문에 있는 패키지 관리자로 설치하면 된다. 파이썬으로 작성된 도구라서 `pip`로도 설치 가능하다.

    # 하나만.. 다음 중 하나만 설치
    $ brew install httpie
    $ port install httpie
    $ apt-get install httpie
    $ yum install httpie
    $ pip install httpie
    

사용 방법은 아주 단순하다.

    $ http httpie.org
    

`http [flags] [METHOD] URL [ITEM [ITEM]]` 형태로 보낼 수 있다.

    # HTTP 메소드와 해더, JSON 데이터 전송
    $ http PUT example.org X-API-Token:123 name=John
    # 폼 전송
    $ http -f POST example.org hello=World
    # request 출력
    $ http -v example.org

<figure class="wp-caption alignnone">

<figure><img src="https://farm2.staticflickr.com/1578/26005228831_21b2563ccf_b.jpg?resize=660%2C936&#038;ssl=1" width="660" height="936" class data-recalc-dims="1" /><figcaption class="wp-caption-text">cURL보다 간단하게 사용할 수 있다. 별 내용 아니지만 색깔 이쁘면 보기 좋지 않습니까.</figcaption></figure> 

이외에도 세션과 같은 다양한 기능을 제공한다. auth는 [auth 플러그인][2]으로 제공하고 있고 외부 json 파일이나 바이너리 파일을 전송하는 기능도 있다. curl만큼 방대한 기능을 제공하고 있으니 [HTTPie 리포지터리][1]를 확인해서 어떤 유용한 기능이 있는지 살펴보는 것도 좋겠다.

요즘은 REST API 테스트하는 도구가 워낙 잘 나와서 curl도 잘 안쓰게 되는 편이긴 하다. 그래도 간단한 테스트는 HTTPie로 더 쉽고 간단하게 수행할 수 있어서 요긴하게 사용하고 있어 만족스럽다.

 [1]: https://github.com/jkbrzt/httpie
 [2]: https://github.com/jkbrzt/httpie#auth-plugins