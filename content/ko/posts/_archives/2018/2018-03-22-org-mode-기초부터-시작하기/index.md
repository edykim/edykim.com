---
title: Org-mode 기초부터 시작하기
author: haruair
uuid: "f188cf8b-9b47-4db1-9eb0-a02a0f164a42"
type: post
date: "2018-03-22T05:24:14"
history:
  - 
    from: https://www.haruair.com/blog/4386
    movedAt: 2018-09-13T22:02:42+00:00
lang: ko
slug: start-with-orgmode-basics
headline:
  - Emacs에서 사용할 수 있는 강력한 생산성 도구 Org-mode 튜토리얼, 번역.
tags:
  - 번역
  - 개발 이야기
  - emacs
  - org-mode

---

<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/lisp.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

<p>최근 emacs에 대한 유튜브를 보는데 전혀 IT쪽 일을 하지 않는 사람도 <a href="http://orgmode.org/">org-mode</a> 때문에 emacs를 사용한다는 얘기를 듣고 문서를 찾아보게 되었다.</p>

<p>emacs는 아예 처음 사용해보는데 이 문서에 emacs 기능도 간략하게 설명하고 있어서 org-mode의 기능을 살펴보는데 불편함이 없었다. 각각 기능도 강력하고 일반 텍스트를 이렇게 멋지게 조작 가능한게 놀랍다. markdown이나 html로 내보내는 기능도 멋지다. 내보내는 포맷은 플러그인으로 추가도 가능하다. 익숙해지면 정말 유용할 것 같다.</p>

<p>이 번역 문서는 GNU 자유 문서 사용 허가서 버전 1.3 또는 그 이후의 버전이 적용된다. 코드 예제는 GNU GPL 버전 3 또는 이후 버전이 적용된다. 원본은 <a href="https://orgmode.org/worg/org-tutorials/org4beginners.html">Org mode beginning at the basics 페이지</a>에서 찾을 수 있다.</p>

<hr>

<div class="figure">

![](org-mode-unicorn-logo.png)

</div>

<h1>Org-mode 기초부터 시작하기</h1>


<p>Org-mode는 <a href="http://orgmode.org/">공식 웹페이지</a>에서 설명하는 것과 같이 노트와 할 일 목록을 관리하고 프로젝트 계획을 작성하거나 저작하는데 사용할 수 있는, 빠르고 효과적인 플레인 텍스트 시스템입니다. Emacs 22.2와 XEmacs 22.1부터 지원하기 시작했습니다. 아래 내용은 간단한 튜토리얼로 Emacs와 org-mode를 사용하는 방법을 설명합니다.</p>

<div id="outline-container-sec-1" class="outline-2">
<h2 id="sec-1">Emacs에 대해 알아야 할, 정말 최소한의 지식</h2>
<div class="outline-text-2" id="text-1">

<p><i>무엇이든지</i> 하고싶은 일을 하기 위해서 Emacs에서 필수적으로 알아야 할 최소 지식은 다른 애플리케이션에서 알아야 하는 양보다 많습니다. 하지만 이런 비교는 일반적인 장난감과 레고를 비교하는 것과 같습니다. 레고는 시작하기 어렵지만 (작은 플라스틱 조각이 가득한 상자에서 시작합니다) 장기적으로 봤을 때는 더 많은 것을 만들 수 있습니다.</p>


<p>Emacs는 단축키가 풍부합니다. 처음 시작할 때는 이런 특징에 짜증날지 모르지만 시간이 흐를수록 마우스를 점점 적게 사용하게 되고 실제로 더 빠르게 작업을 할 수 있게 될겁니다.</p>


<p>기본적인 모든 동작은 마우스를 사용할 수 있습니다. 파일을 열거나 저장하는 등의 작업은 메뉴에서 모두 가능한 동작입니다. 하지만 키보드에서 손을 때고 마우스를 잡는 방법보다 단축키를 사용하는 방식이 훨씬 빠르다는 것을 알게될 것입니다.</p>


<p>Emacs는 이중 단축키를 많이 사용합니다. 대부분의 애플리케이션처럼 Alt-F 나 Alt-S 대신에 <b>Control-X Control-F</b> 와 <b>Control-X Control-S</b> 를 사용합니다. 처음에는 생산성에 반하는 것처럼 느껴질지 몰라도 금방 익숙해질 겁니다.</p>


<p><b>노트:</b> 키 축약 표현</p>

<ul class="org-ul">
  <li><b>M</b> – Alt (고대 키보드에서는 Meta 키였습니다.)</li>
  <li><b>C</b> – Control</li>
  <li><b>S</b> – Shift</li>
  <li><b>C-x f</b> – 이 표기는 Control <i>과</i> x를 누른 후, 둘 다 손을 땐 다음에 f를 누른다는 의미입니다.</li>
</ul>
</div>

<div id="outline-container-sec-1-1" class="outline-3">
<h3 id="sec-1-1">어느 버전의 Emacs를 사용해야 하나요?</h3>
<div class="outline-text-3" id="text-1-1">

<p>어느 버전이든 다 똑같이 느껴진다면 XEmacs보다 Emacs를 선택하기 바랍니다. (이 말에 동의하지 못한다면 이미 이 문장을 넘겨도 될 만큼 알고 있다는 의미입니다.) 다음 링크가 도움이 될 겁니다.</p>

<ul class="org-ul">
  <li><a href="http://aquamacs.org/">Aquamacs: Mac OS X를 위한 Emacs</a> (제 취향입니다)</li>
  <li><a href="http://homepage.mac.com/zenitani/emacs-e.html">Carbon Emacs for OSX</a></li>
  <li><a href="http://emacsformacosx.com/">Regular Emacs for OS X</a></li>
  <li><a href="http://ftp.gnu.org/gnu/emacs/windows/">Emacs for MS Windows</a></li>
</ul>


<p>리눅스에서는 패키지 매니저를 사용해서 Emacs를 설치합니다. 데비안이라면 다음처럼 설치합니다.</p>
<pre><code class="bash">sudo apt-get install emacs</code></pre>
</div>
</div>

<div id="outline-container-sec-1-2" class="outline-3">
<h3 id="sec-1-2">설정하기</h3>
<div class="outline-text-3" id="text-1-2">

<p>Emacs를 시작할 때 가장 큰 고통은 바로 설정하기에 있습니다. 설정을 위한 메뉴도 없고 텍스트 파일을 수정해야 합니다. (메뉴가 있다고 얘기하긴 하는데 그건 그냥 순수한 사람들을 낚는 겁니다.) 설정 파일의 위치는 (심지어 이름까지도) 어떤 운영체제를 사용하느냐에 따라 다릅니다. 하지만 플랫폼에 상관없이 그 내용은 거의 일치합니다. 대다수 사람들은 동일한 설정 파일을 다른 운영체제서 사용합니다. 장기적으로 보면 최고의 선택이나 마찬가지죠!</p>


<p>설정 파일의 위치는 다음과 같습니다.</p>

<ul class="org-ul">
  <li>Aquamacs: ~/Library/Preferences/Aquamacs Emacs/Preferences.el</li>
  <li>일반적인 emacs on Linux or OS X: ~/.emacs</li>
  <li>Windows: c:\emacs\.emacs.d\init.txt (<a href="http://www.claremontmckenna.edu/math/alee/emacs/emacs.html">예제 설치에 따르면 이렇습니다</a>)</li>
</ul>
</div>
</div>
</div>

<div id="outline-container-sec-2" class="outline-2">
<h2 id="sec-2">org-mode 시작하기</h2>
<div class="outline-text-2" id="text-2">

<p>이 챕터에서 사용하는 새로운 단축키는 다음과 같습니다.</p>
<ul class="org-ul">
  <li><b>C-x s</b> – 문서 저장하기</li>
  <li><b>C-x f</b> – 문서 열기</li>
</ul>
</div>

<div id="outline-container-sec-2-1" class="outline-3">
<h3 id="sec-2-1">첫 org-mode 문서</h3>
<div class="outline-text-3" id="text-2-1">

<p>이제 첫 org-mode 문서를 시작하기 위해서 알아야 할 모든 지식을 습득했습니다. Emacs를 시작합니다. 완전히 새로 설치한 Emacs라면 Emacs의 스플래시 화면을 볼 수 있을 겁니다. 이 화면에는 Emacs 튜토리얼과 여러 문서를 볼 수 있는 바로가기가 있지만 지금은 건너뛰고 다음으로 넘어갑니다.</p>

<p><b>C-x f</b> 단축키를 사용해서 새 문서를 시작합니다. 이 단축키는 문서를 열기 위한 기능을 제공합니다. (Emacs에서는 버퍼라고 말합니다.) 여기에 *1.org*라고 입력합니다. 이제 새로운 빈 문서가 화면에 나타납니다.</p>

<p>이 문서를 저장하기 위해서 저장 아이콘을 누르거나 <b>C-x s</b> 단축키를 누르고 1.org를 입력합니다.</p>

<p>Emacs는 org-mode 문서를 편집하려고 한다는 점을 아직 이해하지 못합니다. 현재 문서에서 org-mode를 활성화하려면 다음 명령을 입력합니다.</p>

<pre><code>M-x org-mode</code></pre>

<p>이 명령으로 현재 문서에서 org-mode를 활성화 할 수 있습니다.</p>

<p>Emacs가 org-mode 문서를 인식하도록 다음 내용을 문서 <b>상단</b> 에 추가합니다.</p>

<pre><code class="language-bash">MY PROJECT -*- mode: org -*-</code></pre>


<p>여기에 사용한건 뺄셈 기호며 밑줄이 <i>아닙니다</i>. MY PROJECT는 문서의 제목이며 마음대로 지정할 수 있습니다.</p>

<p>이 한 줄의 내용이 이 문서에서 org-mode를 활성화합니다. 이 내용을 넣으면 파일 확장자와 상관없이 org-mode가 동작합니다.</p>

<p>org 파일에서 항상 org-mode를 활성화하려면 Emacs 설정을 수정해야 합니다. 수정하는 방법은 다음 섹션에서 설명합니다.</p>
</div>
</div>

<div id="outline-container-sec-2-2" class="outline-3">
<h3 id="sec-2-2">Emacs 설정 처음으로 수정하기</h3>
<div class="outline-text-3" id="text-2-2">

<p>Emacs 설정 파일을 엽니다. Emacs에서 이 파일을 열기 위해서 <b>C-x f</b> 를 사용합니다. (설정 파일의 경로는 <i>설정</i>을 참고합니다.) 그리고 다음 내용을 추가합니다.</p>

<pre><code class="lisp">;; -*- mode: elisp -*-

;;스플래시 화면을 끔 (다시 켜려면 t를 0으로 변경)
(setq inhibit-splash-screen t)

;;문법 강조를 활성화
(global-font-lock-mode t)
(transient-mark-mode 1)

;;;;org-mode 설정
;;org-mode 활성화
(require 'org)
;;org-mode를 .org로 끝나는 파일에서 활성화
(add-to-list 'auto-mode-alist '("\\.org$" . org-mode))
</code></pre>


<p>Emacs를 재시작합니다.</p>


<p><b>노트:</b> 앞에서 추가했던 mode 행은 1) Emacs의 설정에 지정한 org-mode 확장자와 다른 확장자를 사용하는 경우 (예로 myfile.txt) 2) auto-mode-alist 행을 설정에 추가하지 않은 경우에만 필요합니다.</p>
</div>
</div>
</div>

<div id="outline-container-sec-3" class="outline-2">
<h2 id="sec-3">목록과 노트 관리하기</h2>
<div class="outline-text-2" id="text-3">

<p>이 장에서 사용하는 단축키입니다.</p>
<ul class="org-ul">
<li><b>TAB</b> / <b>S-TAB</b> – 접기/펴기</li>
<li><b>M-up/down</b> – 제목행 위/아래로 이동하기</li>
<li><b>M-left/right</b> – 제목행 수준 높이기/낮추기</li>
<li><b>M-RET</b> – 새 제목행 추가하기</li>
<li><b>C-x s</b> – 파일 저장하기</li>
<li><b>C-h t</b> – Emacs 튜토리얼</li>
</ul>


<p>이제 org-mode 문서를 사용할 수 있도록 설정한 Emacs가 있으니 이제 시작하기만 하면 됩니다. org-mode를 시작하는데 도움이 될 개요를 적는 것으로 시작합니다. 새 문서를 열고 (<b>C-x b</b>) 2.org를 입력한 다음에 아래 내용을 복사해서 붙여넣습니다.</p>

<pre><code class="language-bash">#-*- mode: org -*-
#+STARTUP: showall

* org-mode 시작을 환영합니다
  Org-mode에 오신 것을 환영하고 감사드립니다. org에서 개요를 작성하기는 매우 간편합니다.
  그냥 텍스트거든요! 그저 입력하면 됩니다.

* 제목행은 하나 이상의 별 문자로 시작합니다.
  제목은 별 하나, 부제목은 별 두 개 방식으로 숫자를 늘려갑니다.

* 목록 작성하기
** 개요 이동하기
** 제목행 이동하기
</code></pre>


<p>파일을 2.org로 저장합니다. (<b>C-x s</b>) 저장하면 문법 강조가 켜져있어서 색상이 변경되는 것을 확인할 수 있습니다. Emacs가 org-mode에서 작업중인 것을 알고 있기 때문입니다.</p>


<p>이제 정말로 org-mode를 시작할 준비가 되었습니다!</p>
</div>

<div id="outline-container-sec-3-1" class="outline-3">
<h3 id="sec-3-1">목록 작업하기</h3>
<div class="outline-text-3" id="text-3-1">

<p>목록은 브레인스토밍과 모든 항목을 관리하는데 뛰어난 방식입니다. 목록을 사용하면 기록을 하는 동안 큰 그림 그리기에 집중할 수 있도록 돕습니다.
</p>

<p>가장 먼저 할 일은 접기입니다. 특히 문서가 길어질 때는 이 기능이 유용합니다. 예제 문서에서 첫 제목행인  이동합니다. (방향키를 사용하세요.) <b>org-mode 시작을 환영합니다</b> 에 커서를 위치한 후에 <b>TAB</b> 을 눌러봅니다. 그리고 <b>S-TAB</b> 도 사용해봅니다. <b>Tab</b> 은 현재 부분을 접거나 펼 수 있습니다. 시프트 키와 함께 누르면 전체 문서를 접고 펼 수 있습니다. </p>

<p>브레인스토밍의 기본적인 아이디어는 항목을 목록으로 적는 것입니다. 적은 후에 항목의 순서를 중요도 순서로 다시 정렬하고 싶을 것입니다. 제목행을 위로, 또는 아래로 이동하기 위해서 제목행에서 <b>M-up/down</b> 을 사용할 수 있습니다. 목록을 모두 접어서 제목만 보이는 상태는 전체 개요를 파악하는데 도움됩니다. 동시에 세부적인 내용도 잃어버리지 않고 잘 보존하고 있습니다.</p>

<p>다음으로 제목 계층을 올리거나 낮출 수 있습니다. 예를 들어 <b>제목행은 하나 이상의 별 문자로 시작합니다.</b> 행을 <b>목록 작성하기</b> 의 부제로 만들고 싶다면 제목의 위치를 아래로 이동한 후에 <b>M-right</b> 으로 계층을 낮출 수 있습니다.</p>

<p>마지막으로 새 제목행을 추가하기 위해서는 <b>M-RET</b> 을 사용합니다.</p>


<p>목록은 순서 없는 목록과 순서 있는 목록이 있습니다. 다음을 확인하세요.</p>

<pre><code class="language-bash">** 반지의 제왕
   가장 좋아하는 장면 (순서대로)
   1. 로히림 전투
   2. 에오윈과 마술사왕의 싸움
      + 이 내용은 이미 책에서도 가장 좋아하는 장면
      + 미란다 오토를 정말 좋아함
   3. 레골라스에게 화살 맞는 피터 잭슨
      - DVD에만 있음
      화살 맞을 때 정말 웃긴 표정이었음.
   하지만 결과적으로 각각의 장면이 아니라 영화 전체가 좋았다.
   영화에서 중요했던 배우:
   - 일라이저 우드 :: 프로도 역
   - 숀 애스틴 :: 샘 역, 프로도 친구로 나옴. 여전히 그를 구니스에서 나온 미키 월쉬로
     잘 기억하고 있음.
</code></pre>


<p>순서 없는 목록은 -, + 또는 \*로 시작합니다. 순서 있는 목록은 숫자와 점으로 시작합니다. 설명은 ::이 붙습니다.
</p>


<p>더 보기: 이 <a href="http://lumiere.ens.fr/~guerry/org-playing-with-lists-screencast.php">스크린캐스트</a> 에서는 일반 목록의 몇 가지 기능을 설명합니다. 이 내용은 <a href="http://orgmode.org/manual/Plain-lists.html#Plain-lists">메뉴얼</a> 에서도 볼 수 있습니다.</p>
</div>
</div>

<div id="outline-container-sec-3-2" class="outline-3">
<h3 id="sec-3-2">기록하기</h3>
<div class="outline-text-3" id="text-3-2">

<p>내용을 작성할 때 쓸 수 있는 몇 가지 표준적인 마크업이 있습니다. 다음과 같은 마크업을 사용할 수 있습니다.</p>

<pre><code>단어에 *굵게*, /기울임꼴/, _밑줄_, =코드=, ~요약~ 등의 마크업을 쓸 수 있다. 꼭 필요한 경우 +삭제선+도 가능하다.</code></pre>


<p>다음처럼 표현됩니다.</p>


<p>단어에 <b>굵게</b>, <i>기울임꼴</i>, <span class="underline">밑줄</span>, <code>코드</code>, <code>요약</code> 등의 마크업을 쓸 수 있다. 꼭 필요한 경우 <del>삭제선</del> 도 가능하다.</p>


<p>여기까지 봤다면 Emacs 튜토리얼을 살펴보는 것도 좋습니다. <b>C-h t</b> 로 Emacs에 내장되어 있는 튜토리얼을실행할 수 있습니다. 튜토리얼은 몇 가지 Emacs 단축키와 함께 어떻게 문서를 이동하는지 알려줄 것입니다.</p>
</div>
</div>
</div>

<div id="outline-container-sec-4" class="outline-2">
<h2 id="sec-4">할 일 항목 사용하기</h2>
<div class="outline-text-2" id="text-4">

<p>이 챕터에서 사용하는 새 단축키입니다.</p>
<ul class="org-ul">
<li><b>S-left/right</b> – 워크플로를 변경</li>
<li><b>C-c C-v</b> – 현재 문서에 있는 할 일 목록 보기</li>
</ul>
</div>

<div id="outline-container-sec-4-1" class="outline-3">
<h3 id="sec-4-1">기본 할 일 기능</h3>
<div class="outline-text-3" id="text-4-1">

<p>org-mode를 사용하는 가장 큰 이유는 할 일을 관리하는데 사용하기 위해서 입니다. 먼저 할 일 기능을 사용하기 위해서는 특별히 해야 하는 작업 없이 TODO 키워드를 제목행에 추가하면 됩니다.</p>

<pre><code class="language-bash">** TODO 비행기 구입하기
</code></pre>


<p>할일 목록을 빠르게 사용하려면 다음 단축키를 사용합니다.</p>

<ul class="org-ul">
  <li><b>S-left/right</b></li>
</ul>

<p>이 단축키는 <b>TODO</b> 에서 <b>DONE</b> 까지, 그리고 빈 칸을 순환하며 상태를 변경합니다.</p>


<p>큰 문서를 작업하고 있고 문서 곳곳에 할 일 목록이 흩어져 있는 상황에서는 <b>C-c / t</b> 로 현재 할 일 항목만 남기고 나머지는 모두 접을 수 있습니다.</p>
</div>
</div>

<div id="outline-container-sec-4-2" class="outline-3">
<h3 id="sec-4-2">할 일 설정하기</h3>
<div class="outline-text-3" id="text-4-2">
</div><ul class="org-ul"><li><a id="sec-4-2-1" name="sec-4-2-1"></a>파일 내에서 설정하기<br><div class="outline-text-4" id="text-4-2-1">

<p>Org-mode 파일에서는 워크플로 상태를 파일 시작 위치에서 설정할 수 있습니다. 다음과 같이 파일 시작부에 작성합니다.
</p>

<pre><code class="language-bash">#+TODO: TODO IN-PROGRESS WAITING DONE
</code></pre>


<p>이 행은 파일 상단에 위치해야 하며 상단과 #+TODO 행 사이에 빈 행이 <i>없어야</i> 합니다.</p>


<p>새 워크플로를 활성화하기 위해서는 파일을 새로 열거나 파일 최상단에 #로 시작하는 행으로 이동한 다음에 <b>C-c C-c</b> 를 입력합니다.</p>


<p>워크플로를 복사해서 테스트 파일인 1.org에 붙여놓고 차이를 확인해봅시다.</p>
</div></li>
<li><a id="sec-4-2-2" name="sec-4-2-2"></a>Emacs 설정 파일에서<br><div class="outline-text-4" id="text-4-2-2">

<p>워크플로 상태를 모든 org 파일에 직접 추가하는 방법은 번거롭습니다. 어디서나 사용할 수 있도록 설정하려면 설정 파일에 추가합니다. 다음 내용은 (require 'org) 행 <i>이후에</i> 추가합니다.</p>

<pre><code class="lisp">(setq org-todo-keywords
  '((sequence "TODO" "IN-PROGRESS" "WAITING" "DONE")))
</code></pre>

<p>워크플로 상태를 활성화하기 위해서 Emacs를 재시작합니다.</p>
</div>
</li></ul>
</div>
</div>

<div id="outline-container-sec-5" class="outline-2">
<h2 id="sec-5">아젠다</h2>
<div class="outline-text-2" id="text-5">

<p>이 장에서 사용하는 단축키입니다.</p>

<ul class="org-ul">
  <li><b>C-c a</b> – 아젠다</li>
  <li><b>C-c [</b> – 아젠다 파일 목록에 문서를 추가</li>
  <li><b>C-c ]</b> – 아젠다 파일 목록에서 문서를 제거</li>
  <li><b>C-c .</b> – 일자 추가</li>
  <li><b>C-u C-c .</b> – 일자와 시각 추가</li>
  <li><b>C-g</b> – 하던 일을 멈추고 벗어남</li>
</ul>


<p>아젠다(agenda)라는 단어의 기본적인 의미는 <i>완료 해야 할 것</i> 으로 라틴어인 <i>agendum</i> 에서 왔습니다. Org-mode는 다양한 종류의 아젠다, 일감 목록을 만들고 하나 또는 여러 org 문서에서 이런 일감을 수집하기 매우 좋습니다.</p>
</div>

<div id="outline-container-sec-5-1" class="outline-3">
<h3 id="sec-5-1">활성화된 모든 일감 목록 생성하기</h3>
<div class="outline-text-3" id="text-5-1">

<p>1.org를 기본 아젠다 파일로 사용하고 나중에 Emacs의 설정 파일에서 어떻게 동작하는지 살펴보겠습니다.</p>

<p>1.org를 엽니다. <b>C-c a</b> 를 눌러서 아젠다를 엽니다. 아젠다는 다음처럼 나옵니다.</p>

<pre><code>Press key for an agenda command
-------------------------------
a Agenda for the current week or day
t List of all TODO entries</code></pre>


<p>위 내용은 일부 내용이고 실제로는 더 많은 내용이 출력될 것입니다.</p>

<p>아쉽게도 위 두 항목은 빈 목록을 보여줄 것입니다. (직접 눌러서 확인해볼 수 있습니다.) 그러므로 이 상태에서 <b>C-g</b> 를 눌러 빠져 나옵니다. 이제 1.org를 아젠다 파일로 추가하기 위해서 <b>C-c [</b> 를 사용합니다. 이제 아젠다 메뉴로 가서 (<b>C-c a</b>) <b>t</b> 를 누르면 모든 할 일 항목 목록을 확인합니다.</p>

<p><a href="#sec-4">할 일 항목 사용하기</a>에서 설명한 방식대로 더 적절한 워크플로를 추가하는 과정을 했다면 DONE을 제외한 모든 항목이 모두 나타나는 것을 볼 수 있습니다.</p>


<p>이 과정은 여러 문서에서 반복할 수 있습니다. 아젠다는 할 일 전체 목록을 제공할 것입니다. 만약 문서를 아젠다 파일 목록에서 빼고 싶다면 <b>C-c ]</b> 를 사용하면 됩니다.</p>
</div>
</div>

<div id="outline-container-sec-5-2" class="outline-3">
<h3 id="sec-5-2">약속과 마감 일시</h3>
<div class="outline-text-3" id="text-5-2">

<p>일반적으로 시간 설정이 필요한 일감은 달력에 표시합니다. org-mode는 이 방식도 지원합니다. 아젠다는 모든 할 일을 시간 기반 목록으로 볼 수 있습니다. 다음 내용을 참고하기 바랍니다.</p>


<p>1.org에 새 (부)제목을 <i>프레드에게 전화하기</i> 라고 추가합니다. (<b>M-RET</b>프레드에게 전화하기) 다 입력한 후에 <b>C-c .</b> 를 입력합니다. 이 명령을 입력하면 화면 밑에 일자 선택지가 표시됩니다. 직접 손으로 입력할 수도 있고 <b>S-left/right</b> 으로 선택할 일자를 변경할 수 있습니다. 만약 일자 외에 시간도 추가하고 싶다면 <b>C-c .</b> 대신에 <b>C-u C-c .</b> 를 입력합니다.</p>


<p>이제 아젠다 (<b>C-c a</b>)로 이동해서 <b>a</b> 를 누르면 아젠다 항목을 확인할 수 있습니다.</p>


<p>더 읽을 거리:</p>
<ul class="org-ul">
  <li><a href="http://doc.norang.ca/org-mode.html#ClockingBernt">http://doc.norang.ca/org-mode.html#ClockingBernt</a> Hansens extensive description Time Clocking: Usage, Customization, Workflow description</li>
  <li><a href="http://sachachua.com/wp/2007/12/30/clocking-time-with-emacs-org/">Clocking time with Emacs Org</a></li>
  <li>그리고 <a href="http://orgmode.org/manual/Dates-and-Times.html#Dates-and-Times">메뉴얼</a>도 있습니다.</li>
</ul>

</div>
</div>

<div id="outline-container-sec-5-3" class="outline-3">
<h3 id="sec-5-3">Emacs 설정 파일에서 아젠다 설정하기</h3>
<div class="outline-text-3" id="text-5-3">

<p>
<b>C-c [</b> 을 사용해서 아젠다 목록에 추가한 후에 Emacs의 설정 파일을 확인하면 다음 내용을확인할 수 있습니다.
</p>

<pre><code class="lisp">(custom-set-variables
  ;; custom-set-variables was added by Custom.
  ;; If you edit it by hand, you could mess it up, so be careful.
  ;; Your init file should contain only one such instance.
  ;; If there is more than one, they won't work right.
 '(org-agenda-files (quote ("~/Documents/Projects/org4beginners/2.org"
 "~/Documents/Projects/org4beginners/1.org"))))
(custom-set-faces
  ;; custom-set-faces was added by Custom.
  ;; If you edit it by hand, you could mess it up, so be careful.
  ;; Your init file should contain only one such instance.
  ;; If there is more than one, they won't work right.
 )
</code></pre>


<p>Emacs lisp의 세계에 오신 것을 환영합니다. Emacs가 설정 파일을 변경한 경우에 이런 방식으로 기록됩니다. (<b>참고:</b> Aquamacs 에서는 customizations.el이라는 별도 파일에 저장됩니다.)</p>


<p>여기서 중요한 내용은 중간에 있는데 (5, 6행) <i>org-agenda-files</i> 내용을 확인할 수 있습니다. 아젠다 목록을 만들기 위해 사용하는 아젠다 파일의 목록이 여기에 지정되어 있습니다. 지금은 일단 그대로 둡니다. 다음에 설정 파일을 살펴볼 일이 있다면 적어도 이게 무슨 기능을 하는지 알 수 있을 것입니다.</p>


<p>더 읽을 거리: <a href="http://orgmode.org/worg/org-tutorials/org-custom-agenda-commands.html">사용자 정의 아젠다 명령</a></p>
</div>
</div>
</div>

<div id="outline-container-sec-6" class="outline-2">
<h2 id="sec-6">GTD</h2>
<div class="outline-text-2" id="text-6">

<p>이 챕터에서 사용하는 단축키입니다.</p>

<ul class="org-ul">
  <li><b>C-c C-c</b> – 태그 추가</li>
</ul>


<p><i>Getting things done</i> 은 유명한 시간 관리 방법 중 하나로 구글에서 검색하면 1억 5천 여 항목에 이릅니다. 태그를 사용하면 org mode에서도 비슷한 방식으로 할 일 관리를 할 수 있습니다.</p>


<p>태그는 다른 종류의 할일 목록을 조직화하는데 사용합니다. 예를 들면 전화 일정, 읽을 책 목록, 장바구니 목록을 묶기 위해 씁니다.</p>


<p>태그를 추가하기 위해서 다음 설정을 문서 상단에 추가합니다.</p>

<pre><code class="language-bash">#+TAGS: { @OFFICE(o) @HOME(h) } COMPUTER(c) PHONE(p) READING(r)</code></pre>


<p>문서를 다시 불러오거나 #으로 시작하는 곳에서 <b>C-c C-c</b> 를 입력합니다.</p>


<p>이제 문서 어느 행에서든 하나 또는 그 이상의 태그를 등록할 수 있습니다. <b>C-c C-c</b> 를 누르면 다음과 같은 팝업이 나타납니다.</p>

<pre class="example"><code>Inherited:
Current:
{ [o] @OFFICE     [h] @HOME    }
  [C] COMPUTER   [p] PHONE   [r] READING
</code></pre>


<p>문서 서두에 정의한 태그를 사용할 수 있는 바로가기입니다. 첫 두 태그는 (OFFICE와 HOME)은 상호배타적이라 둘 중 하나만 선택할 수 있지만 나머지는 자유롭게 추가할 수 있습니다.</p>

<p>GTD 설정의 좋은 예제로는 이 글을 참고하세요: <a href="http://members.optusnet.com.au/~charles57/GTD/gtd_workflow.html">Emacs에 Org-mode를 사용해서 GTD 구현하기</a></p>

</div>

<div id="outline-container-sec-6-1" class="outline-3">
<h3 id="sec-6-1">Emacs 설정 파일에 태그 추가하기</h3>
<div class="outline-text-3" id="text-6-1">

<p>Emacs 설정 파일에 태그를 추가하려면 다음처럼 설정에 입력합니다.</p>

<pre><code class="lisp">(setq org-tag-alist '(("@work" . ?w) ("@home" . ?h) ("laptop" . ?l)))</code></pre>


<p>설정 파일에서 상호배타적인 태그 그룹을 만들기 위해서는 <a href="http://orgmode.org/org.html#Setting-tags">메뉴얼 내용</a>을 참고합니다.</p>

<p>이 설정은 문서 상단에 추가한 내용으로 덮어쓰는 것이 가능합니다. 그래서 각 문서에 개별적인 워크플로와 태그를 직접 설정해서 사용할 수 있습니다.</p>

<p>태그를 활발히 활용하는 예제는 <a href="http://sachachua.com/wp/2008/01/04/tagging-in-org-plus-bonus-code-for-timeclocks-and-tags/">여기서</a> 확인할 수 있습니다.</p>

</div>
</div>
</div>

<div id="outline-container-sec-7" class="outline-2">
<h2 id="sec-7">내보내기</h2>
<div class="outline-text-2" id="text-7">

<p>여기서 사용하는 단축키는 다음과 같습니다.</p>
<ul class="org-ul">
<li><b>C-c C-e</b> – 내보내기 메뉴</li>
</ul>


<p>org-mode에서만 문서 작업을 한다면 큰 문제가 없습니다. 하지만 간혹 다른 포맷으로 문서를 내보내야 할 필요가 있습니다.</p>

<p>예를 들어 현재 문서를 내보내는데 html로 내보내려고 합니다. <b>C-c C-e</b> 를 누른 후에 <b>h o</b> 를 순서대로 누릅니다. 이 방법은 문서를 html로 내보낸 후, 그 내보낸 파일을 브라우저로 열게 됩니다.</p>


<p>더 읽을 거리: <a href="http://orgmode.org/worg/org-tutorials/org-publish-html-tutorial.html">html 출판 튜토리얼</a>을 보면 여기서 설명한 내용보다 더 상세하게 다룹니다. 이 방법으로 완전한 웹사이트를 출판하는 것도 가능합니다. 그리고 <a href="http://orgmode.org/manual/Exporting.html#Exporting">메뉴얼</a>에서 html, latex, pdf 그리고 다른 포맷으로 내보내는 방법을 설명합니다.</p>
</div>
</div>

<div id="outline-container-sec-8" class="outline-2">
<h2 id="sec-8">org-mode에 능숙해지기</h2>
<div class="outline-text-2" id="text-8">

<p>효율적인 도구를 사용해서 시간을 아끼려면 그 도구를 잘 알아야 합니다. org-mode를 잘 알기 위해서는 메뉴얼을 읽고 사용하는게 중요합니다. Org-mode는 문서화가 잘 되어 있습니다. 가장 빠르게 org-mode 문서를 Emacs에서 읽는 방법으로는 info browser를 사용할 수 있습니다.</p>

<p>이 창을 호출하기 위해서는 <b>C-h i</b>를 입력합니다. 그리고 링크 간 이동하기 위해서 <b>TAB</b> 키를 사용합니다.</p>

<p>info-browser를 이동할 때는 다음 키를 쓸 수 있습니다.</p>

<ul class="org-ul">
<li>u – 위로(up)</li>
<li>n – 다음(next)</li>
<li>p – 이전(previous)</li>
</ul>


<p>org-mode 메뉴얼 다음으로는 <a href="https://orgmode.org/worg/">worg 웹사이트</a>가 있습니다. 여러 재밌는 아이디어와 <a href="https://orgmode.org/worg/org-tutorials/index.html">튜토리얼</a>을 찾을 수 있습니다.</p>

<p>기능을 빠르게 참고할 수 있는 <a href="https://orgmode.org/orgcard.pdf">org-mode 치트시트</a>와 emacs 치트시트가 있습니다. 이 두 문서는 귀찮은 단축키를 기억하는데 도움이 될 것입니다.</p>

</div>
</div>

<div id="outline-container-sec-9" class="outline-2">
<h2 id="sec-9">기초를 넘어서</h2>
<div class="outline-text-2" id="text-9">

<p>Geek 유머에 "여기에 용이 있어요!"가 있습니다. 여기서부터는 org-mode를 자유롭지만 스스로 책임져야 하는 사용법을 설명합니다. 대부분 다음 내용은 실제로 정말 어렵거나 한 것은 아니지만 적어도 중요한 데이터는 백업을 해두시기 바랍니다. 만약 다음 내용에서 궁금한 부분이 있다면 메뉴얼과 질문 답변을 확인합니다. 또한 IRC (freenode의 #orgmode)에서 질문하는 것도 좋은 방법입니다.</p>
</div>

<div id="outline-container-sec-9-1" class="outline-3">
<h3 id="sec-9-1"><span class="todo TODO">TODO</span> Quickly adding tasks with remember</h3>
<div class="outline-text-3" id="text-9-1">

<p>(역주: 아직 내용이 존재하지 않는 항목입니다.)</p>
</div>
</div>

<div id="outline-container-sec-9-2" class="outline-3">
<h3 id="sec-9-2">최신 버전 org-mode 사용하기</h3>
<div class="outline-text-3" id="text-9-2">

<p>여기서 사용하는 명령입니다.</p>
<ul class="org-ul">
<li><b>M-x org-reload</b> – 업데이트 후 org-mode를 다시 불러오기</li>
<li><b>M-x org-version</b> – org-mode 버전 확인하기</li>
</ul>


<p>Emacs가 업데이트 되는 속도보다 org-mode가 더 빠르게 개발되는 것을 아마 알 수 있을겁니다. 게다가 매일 org-mode의 개발 버전을 받아서 사용하는 것도 가능합니다.</p>

<p>어떻게 가능할까요?</p>

<ol class="org-ol">
<li>git 설치하기
org-mode 튜토리얼에서 다룰 부분은 아니지만 다음 내용을 참고하세요.
<ul class="org-ul">
<li><a href="http://code.google.com/p/git-osx-installer/">Git OS X installer</a></li>
<li><a href="http://code.google.com/p/msysgit/">Myssysgit</a> git Windows 용</li>
<li>리눅스에서는 패키지 매니저를 사용:</li>
</ul>
<pre><code class="bash">sudo apt-get install git</code></pre></li>

<li>org-mode의 코드를 어디에 저장할지 결정합니다. 여기서는 <b>~/Build/Emacs/org-mode</b> 에 저장하지만 어디 하나 별 차이가 없으니 편한 위치에 저장하기 바랍니다.</li>

<li>org-mode의 최신 버전을 받습니다.
<pre><code class="bash">mkdir ~/Build/Emacs
cd ~/Build/Emacs
git clone git://orgmode.org/org-mode.git
cd org-mode &amp;&amp; make &amp;&amp; make doc
</code></pre></li>

<li>Emacs-init 파일에 다음 내용을 추가합니다.
<pre><code class="lisp">(setq load-path (cons "~/Build/Emacs/org-mode/lisp" load-path))
(setq load-path (cons "~/Build/Emacs/org-mode/contrib/lisp"
load-path))

(require 'org-install)
</code></pre>

<p>
<b>중요!</b> 일반 버전의 org-mode라면 다음을 사용합니다.
</p>

<p>:(require 'org)
다음을 사용한다면 위 행은 <b>반드시</b> 제거해야 합니다.</p>


<p>
:(require 'org-install)
</p></li>

<li>최신 org-mode를 유지하려면 다음 명령을 사용합니다.
<pre><code class="bash">cd ~/Build/Emacs/org-mode
git pull &amp;&amp; make clean &amp;&amp; make &amp;&amp; make doc
</code></pre></li>

<li>org-mode를 다시 불러옵니다. <b>M-x org-reload</b> 또는 Emacs를 재시작하세요.</li>
</ol>


<p>
어떤 버전의 org-mode를 사용하고 있는지 확인하려면 <b>M-x org-version</b> 을 입력합니다.
</p>
</div>
</div>
</div>
