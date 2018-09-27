---
title: 맥에서 키보드 맵핑 바꾸기, Karabiner
author: haruair
type: post
date: 2015-11-15T10:44:48+00:00
history:
  - 
    from: https://www.haruair.com/blog/3213
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: changing-keyboard-mapping-on-mac-karabiner
headline:
  - 일반 키보드에서 다 HHKB 같은 기운이 오게 만드는 맵핑 프로그램, Karabiner와 설정
categories:
  - 두루두루 IT
tags:
  - karabiner
  - 키보드

---
저번에 한참 HHKB를 구입하고 싶어서 구입창을 몇번이고 열었다 닫았다 했는데 이미 [레오폴드서 구입한 키보드][1]가 있었다. 회사에서 사용했는데 아무래도 MS 키보드 레이아웃이라서 자주 안쓰게 되서 집에 가져와서 먼지를 배양하고 있었다. 이 키보드도 맵핑만 바꾸면 나름 HHKB 분위기로 사용할 수 있다는 얘기를 듣고 솔깃해서 [Karabiner][2]를 받아서 키맵을 설정해서 사용하기 시작했다. 그러고서 계속 혼용해서 쓰다가 어느 순간부터 레오폴드 키보드를 메인으로 사용하게 되었다. (드디어!)

<a data-flickr-embed="true"  href="https://www.flickr.com/photos/90112078@N08/23005940656/in/datetaken/" title="Karabiner"><img src="https://farm1.staticflickr.com/570/23005940656_fc29778fab_b.jpg?w=660&#038;ssl=1" alt="Karabiner" data-recalc-dims="1" /></a>

엄청나게 강력한 키맵을 제공하는데 오픈소스로 개발되고 있다. 제공되는 설정 목록을 보면 대부분 시나리오에 맞는 키맵 설정이 존재한다. 정말 방대한데다 직접 커스텀해서 만드는 것도 가능한데 옵션이 너무 많아서 한참 찾다가 찾지 못한 부분은 직접 확장을 만들었다. 아마 내장된 확장이나 누군가 만든, 더 좋은 확장도 분명 있을게 분명한데 찾아서 적용해서 확인할 시간 많은 분은 찾아보는게 좋겠다. (찾으면 알려주세요..)

내 확장은 [gist][3]에 올려놨다.

  * 애플 키보드는 키맵 적용 안함
  * 애플 마우스/트랙패드는 키맵 적용 안함 (필요한진 몰라도)
  * 좌측 Ctrl을 Alt/Option으로
  * 좌측 Alt를 Cmd로
  * 우측 Ctrl을 Fn으로
  * F1~12를 애플 키보드 기본 기능으로

나름 해피해킹스러운 맵도 넣었다.

  * Fn + {1~=} 조합을 F1~12로 (이건 내장된게 의도랑 다르게 동작해서 커스텀으로 추가)
  * Fn + ;[&#8216;/ 조합을 방향키로

화면 끄는 키가 없어서 이 키도 추가했다. Eject로 모니터만 끈다거나 슬립모드로 간다거나 하는 단축키를 쓸 수 있다.

  * F13(Print Screen)을 Eject로

HHKB의 꽃인 CapsLock 위치 키에 맵핑 하려면 [Seil][4]이 필요하다. 정말 HHKB 스타일로 만들려면 필수적이겠지만 기본 동작을 변경해야 하는 부분이 있어서 설치하진 않았다.

일반 키보드로 HHKB를 체험(?)해보고 싶다면, 또는 필요한 키를 변경하고 싶다면 강력하게 추천하고 싶은 앱이다.

 [1]: http://haruair.com/blog/2202
 [2]: https://pqrs.org/osx/karabiner/
 [3]: https://gist.github.com/haruair/b71687c42a31762be793
 [4]: https://pqrs.org/osx/karabiner/seil.html