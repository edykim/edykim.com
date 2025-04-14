---
title: 'C# Obfuscation 난독화하기'
author: haruair
uuid: "157b564a-6aae-4dc0-a715-6591caf9845d"
type: post
date: "2014-12-21T06:33:21"
history:
  - 
    from: https://www.haruair.com/blog/2572
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: how-to-obfuscate-c-sharp-code
tags:
  - 개발 이야기
  - csharp
  - obfuscate
  - 난독화

---
최근 회사 프로젝트에서 C# 어플리케이션을 obfuscate 하면서 알게 된 부분들을 정리한 포스트.

내 (얕은) 지식으로는 컴파일 언어는 &#8220;컴파일러를 통해 바이너리로 치환되서 컴파일된 결과물만 가지고 소스를 복구할 수 없다&#8221;고 알고 있었는데 현대 언어에서는 그게 그렇게 단순한 부분이 아닌 것 같다. C# 프로그램은 dll이든 exe든 디컴파일러를 통해 내부 구조를 볼 수 있다. 심지어 그런 디컴파일러가 불법적으로 암암리에 유포된다거나 하는 것이 아니라 무료로 공개되어 있기도 하고 다들 많이 사용하는 모양이다. (예를 들면, Jetbrain의 [dotpeek][1].)

## 컴파일 언어인데 어떻게 가능하지

C# 왕초보라 정확한 설명인지는 잘 모르겠지만 이것저것 찾아서 읽어본 글에 따르면,

  * C#은 Common Language Runtime(CLR) 위에서 돌아가는 언어
  * CLR은 MS에서 Common Language Infrastructure(CLI)를 구현한 구현체
  * CLI 규격에 의해 C#도 메타데이터를 포함

C#의 경우 이 메타데이터가 가지는 장점으로 쉽게 reflection 가능한 구조로 되어 있고 이를 통해 어셈블리의 타입이나 멤버, 메소드, 심지어는 내부 로직까지도 들여다볼 수 있다고 한다.

  * [Metadata as Source][2]
  * [Metadata and Self-Describing Components][3]

좋은 일에 쓴다면 엄청난 효율을 만드는 장점이지만 내부 로직이 공개될 위험이 있다. 그래서 디컴파일을 방지할 수 있는가에 대한 답변을 SO에서 찾아봤는데 대부분 답변이 둘로 수렴했다. 하나는 obfuscate 난독화를 하는 것이고, 다른 하나는 PaaS로 서비스하라는 얘기였다. 현재 프로젝트는 장기적으로 PaaS로 가겠지만 일단은 전자의 방식을 사용하기로 결정했다.

## C# 난독화

Obfuscation은 코드를 읽기 어렵게 만들어서 내부 로직을 쉽게 들여다볼 수 없게 만드는 과정이다. 메소드, 변수 등을 a, b, c 등으로 수정해서 무슨 로직으로 동작하는지 알아보기 어렵게 만드는 것이다. 목적은 다르지만 결과물로 보면 JavaScript에서 js minify 한 것과 비슷하다.

Obfuscate하는 도구는 시중에 엄청 많이 나와 있는데 Visual Studio 2012를 설치하면 포함되어 있는 [Dotfuscator][4]를 사용했다. Dotfuscator의 사용 방법은 파일 추가 > 결과물 위치 지정 > 실행, 3단계로 아주 단순하다.

[<img src="https://farm8.staticflickr.com/7532/15446515934_7a88773077_o.png?w=660&#038;ssl=1" alt="dotfuscator" class="alignnone " data-recalc-dims="1" />][5]

다만 Dotfuscator를 하게 되면 모든 클래스, 메소드 등 대부분의 명칭이 a, b, c 와 같이 변하기 때문에 문제가 되는 부분이 있을 수 있다. 가령 JSON을 사용하는 경우라면 Serialize 될 때 해당 멤버변수명을 그대로 사용해야 한다. 그런 경우 다음과 같이 attribute로 예외를 지정해주면 된다.

    class PolicyContainer
    {
        [Obfuscation(Feature = "renaming", Exclude = true)]
        public IList<POLICY> Policys;
    ...
    

위 attribute와 같이 작성하면 해당 변수는 obfuscate되지 않는다. [ObfuscationAttribute Class][6]에서 더 자세한 내용을 확인할 수 있다.

 [1]: https://www.jetbrains.com/decompiler/
 [2]: http://msdn.microsoft.com/en-us/library/ms236403.aspx
 [3]: http://msdn.microsoft.com/en-us/library/xcd8txaw(v=vs.110).aspx
 [4]: http://www.preemptive.com/products/dotfuscator/overview
 [5]: http://www.flickr.com/photos/90112078@N08/15446515934 "dotfuscator"
 [6]: http://msdn.microsoft.com/en-us/library/system.reflection.obfuscationattribute.aspx