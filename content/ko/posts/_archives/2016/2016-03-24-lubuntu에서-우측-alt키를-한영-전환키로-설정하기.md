---
title: Lubuntu에서 우측 Alt키를 한영 전환키로 설정하기
author: haruair
type: post
date: "2016-03-23T16:00:14"
history:
  - 
    from: https://www.haruair.com/blog/3468
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: setting-up-the-right-alt-key-in-lubuntu-with-the-hanyou-conversion-key
headline:
  - xkb로 우측 Alt키를 Hangul키로 바인딩해서 한영키 설정하는 방법
tags:
  - 개발 잡동사니
  - lubuntu
  - xkb

---
맥 환경을 사용할 때는 Ctrl + Space를 사용하고 있지만 지금 lubuntu를 설치해서 사용하는 노트북은 키보드 사이즈가 작은 문제인지 Ctrl + Space가 손에 잘 익지 않았다. 그래서 한영 전환키로 우측 Alt 키를 배정해서 사용하고 있었는데 작성하다보면 변경이 되었다 말았다 하는 문제가 있었다. 단순히 입력기 문제라고 생각하고 있었는데 Alt키의 기본 동작이 동시에 나타나는 문제였다.

lubuntu는 xkb를 통해 키보드 맵핑을 처리하고 있다. `/usr/share/X11/xkb/symbols/altwin`을 열어서 다음 부분을 확인한다.

```bash
$ sudo vim /usr/share/X11/xkb/symbols/altwin
```

    // Meta is mapped to second level of Alt keys.
    partial modifier_keys
    xkb_symbols "meta_alt" {
        key <LALT> { [ Alt_L, Meta_L ] };
        key <RALT> { type[Group1] = "TWO_LEVEL",
                     symbols[Group1] = [ Alt_R, Meta_R ] };
        modifier_map Mod1 { Alt_L, Alt_R, Meta_L, Meta_R };
    //  modifier_map Mod4 {};
    };
    
    

RALT 즉, 우측 Alt키에 `Alt_R, Meta_R`이 배정된 것을 확인할 수 있다. 이 키의 키맵을 아래와 같이 `Hangul`로 변경한다.

    // Meta is mapped to second level of Alt keys.
    partial modifier_keys
    xkb_symbols "meta_alt" {
        key <LALT> { [ Alt_L, Meta_L ] };
        key <RALT> { type[Group1] = "TWO_LEVEL",
                     symbols[Group1] = [ Hangul ] };
        modifier_map Mod1 { Alt_L, Alt_R, Meta_L, Meta_R };
    //  modifier_map Mod4 {};
    };
    

키맵 설정은 컴파일 과정을 거쳐 `/var/lib/xkb` 위치에 xkm 파일로 저장되어 있다. 해당 파일을 제거한다. 제거하면 위에서 변경한 설정을 반영한 새로운 파일을 생성할 준비가 끝난다.

```bash
$ sudo rm /var/lib/xkb/*.xkm
```

이제 로그아웃, 로그인을 다시 해서 위에서 제거한 파일을 다시 생성한다. 오른쪽 Alt키가 Hangul키로 변경 된다. 한글 입력기에서 한영 전환키를 다시 설정하면 RALT 대신 Hangul 키로 잡히고 이제 입력이 올바르게 잘 동작하는 것을 확인할 수 있다.