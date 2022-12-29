---
title: "JetBrains TV의 PhpStorm Tips 요약 노트"
author: haruair
type: post
date: "2022-08-21T15:25:44.687Z"
lang: ko
tags:
 - 개발 이야기
 - PHP
 - phpstorm
slug: "note-for-phpstorm-tip-series"
---

[JetBrains TV의 PhpStorm Tips 시리즈](https://www.youtube.com/watch?v=3SUtEnMj1ws&list=PLQ176FUIyIUZjFbdm7Ux3Okalij5jMAgw&ab_channel=JetBrainsTV)를 보면서 정리했다.

## 스타일 설정하기

이 영상에서는 화면에 보이는 부분을 설정하는 방법을 알려준다. 최대한 깔끔한 방식을 선호해서 그런지 대부분 설정을 끄는데 취향에 맞게 따라하면 되겠다.

### 단축키

- 프로젝트 탭 열기/닫기: `cmd + 1` (`Alt + 1`)
- 전체 화면으로 변경: `ctrl + cmd + F`
- 전체 검색(Searching Everywhere): `Shift, Shift`
  - 파일 뿐만 아니라 설정 등 찾기에도 사용 가능
- 콘텍스트 메뉴 열기: `alt + enter`
  - (전구 아이콘 누르면 나타나는 메뉴)

### 설정 내역

- Material UI theme 설치, 폰트 JetBrains Mono로 변경
  - Color Scheme Font와 Console Font 설정이 따로 있음
- 필요에 따라 아래 설정 변경, 전체 검색에서 해당 설정을 찾으면 바로 변경 가능함
  - Show Status Bar: 화면 하단에 있는 상태 막대 숨기기
  - Hide Tool Window Bars: 좌우에 있는 도구 창 숨기기
  - Tab placement: 파일 탭 위치 변경 또는 숨기기
  - Show browser popup in the editor: 편집창 우측 상단에 표시되는 브라우저 숨기기
  - Breadcrumbs
  - Menus and toolbars
    - 우측 상단에 표시되는 빌드 설정 등 버튼 변경할 수 있음
    - Toolbar Run Actions 찾아서 사용하지 않는 버튼 지우기
    - 다 지우더라도 상단에 초기화 버튼으로 초기화 가능

## 효과적으로 네비게이션 사용하기

### 단축키

단축키는 모두 keymap 설정에서 변경 가능하다.

- 다음 탭으로 이동: `ctrl + right`, 또는 `shift + cmd + ]`, 또는 `ctrl + cmd + N`
- 이전 탭으로 이동: `ctrl + left`, 또는 `shift + cmd + [`, 또는 `ctrl + cmd + P`
- 최근 파일 열기: `cmd + E` (`ctrl + E`)
  - 탭을 끄고 사용하는 경우 유용
- 최근 작업한 위치 열기: `shift + cmd + E` (`shift + ctrl + E`)
- 선언 또는 구현으로 이동하기: `cmd + B` (`ctrl + B`)
  - 구현에서 사용하면 선언부로 이동됨
  - 선언에서 사용하면 이 선언을 구현한 파일이 모두 표시되며 선택해서 이동 가능
- 파일 구조 이동하기: `cmd + F12` (`ctrl + F12`)
  - 클래스 내 구조를 목록으로 표시
  - 프로퍼티나 각 메소드로 이동할 수 있음
  - 이 목록 내에서 검색은 그냥 타이핑하면 가능
- 파일 검색: `shift + cmd + O` (`shift + ctrl + N`)
- 심볼 검색: `alt + cmd + O` (`shift + ctrl + alt + N`)
- 액션 검색: `shift + cmd + A` (`shift + ctrl + A`)

## 라라벨 플러그인

- [barryvdh/laravel-ide-helper](https://github.com/barryvdh/laravel-ide-helper): php 패키지
- [PhpStorm Laravel](https://plugins.jetbrains.com/plugin/7532-laravel): PhpStorm 플러그인
- [Laravel Idea](https://plugins.jetbrains.com/plugin/13441-laravel-idea): PhpStorm 플러그인, 연 $39
  - 코드 생성 도구 지원
  - 라라벨에 맞는 자동완성 지원
    - 예를 들면 라우터에서 `PageController@show` 자동완성 지원, 모델 내 `cast`에서 캐스팅 가능한 타입을 자동완성, 요청 검증에서 검증 규칙을 자동완성 해준다든지 등

라라벨에서는 파사드 패턴으로 다양한 기능을 제공한다. 다만 프레임워크에서 기능을 주입하는 형태로 구현되어 있어서 어떤 코드가 실제로 사용되고 있는지 확인하기 어려운 경우가 많다. 라라벨 패키지에 [barryvdh/laravel-ide-helper](https://github.com/barryvdh/laravel-ide-helper)를 설치하면 PhpStorm이 사용할 수 있는 헬퍼 파일을 생성해주며 어떤 코드가 실제로 실행되고 있는지 쉽게 확인할 수 있다.

패키지 설치 후 다음 명령으로 생성한다.

```bash
$ php artisan ide-helper:generate
```

라라벨의 모델은 엘로퀸트로 작성하게 되는데 액티브레코드 패턴으로 구현되어 있다. 모델 구현체에는 각 프로퍼티가 선언되어 있지 않기 때문에 IDE의 자동 완성이 제대로 동작하지 않는다. 이 플러그인이 이런 문제도 해결한다. 다음처럼 모델 헬퍼를 사용한다.

```bash
$ php artisan ide-helper:models
```

헬퍼 파일을 생성함과 동시에 각 모델에 존재하는 프로퍼티나 메소드를 phpdoc로 작성해준다.

## 코드 스니핏

### 라이브 템플릿

설정 내 live templates에서 언어별 전체 목록을 확인할 수 있다. 예를 들면 `eco` 입력해서 자동완성 선택하면 `echo "";`로 확장, `fore` 입력하면 foreach 구문으로 확장해주는 식이다. 템플릿에서도 `$변수명$` 형태로 변수를 지정할 수 있다. 설정에서 추가/수정/삭제가 모두 가능하다.

Edit Variables 버튼을 누르면 각 사용한 변수에 표현식을 작성하는 것도 가능하다. 표현식에는 다양한 내장 함수를 지원하는데 `commentStart()`, `commentEnd()` 등을 사용해서 언어에 국한되지 않는 라이브 템플릿을 작성할 수 있다.

이렇게 작성한 라이브 템플릿은 xml 포맷으로 저장할 수 있고 또한 설정으로 공유하는 것도 가능하다.

#### 클래스 메소드

- `pubf`: `public function () {}`
- `prof`: `protected function () {}`
- `prif`: `private function () {}`
- `pubsf`: `public static function () {}`
- `prosf`: `protected static function () {}`
- `prisf`: `private static function () {}`

#### 둘러싸기

텍스트를 선택한 뒤에 태그로 감싸거나 할 때 사용하는 기능이다. `alt + cmd + T` (`ctrl + alt + T`)로 사용할 수 있다. 어떻게 동작할지 라이브 템플릿에서 지정 가능하며 이 방식으로 동작하는 코드는 `$SELECTION$` 템플릿 변수를 사용해야 한다. 예를 들어 링크를 추가한다면 다음처럼 등록한다.

```html
<a href="$URL$">$SELECTION$<a>
```

### postfix 자동완성

예를 들면 `$users.if`, `$users.isset` 등으로 입력하면 적절하게 템플릿으로 변경해준다.

```php
// $users.if
if ($users) {}
// $users.isset
if (isset($users)) {}
// $users.nn
if ($users !== null) {}
```

이 템플릿은 설정 내 postfix completion에서 찾을 수 있으며 추가/변경/삭제가 가능하다.

## 터미널 활용하기

### 단축키

- 터미널 열기: `alt + F12`
- 활성화 도구 창 숨기기: `Shift + esc`
- 터미널 창에서
  - 새 터미널 탭 열기: `cmd + t`
  - 현재 터미널 탭 닫기: `cmd + w`
  - 터미널에서 우 클릭하면 창 분할 선택 가능
  - 분할된 창 이동: `alt + tab`
  (영상에서는 창 분할이나 터미널 탭 이동 등 단축키를 등록해서 사용)
  - 터미널에서 코드 창으로 커서 이동: `esc`

## 리팩토링 기능 사용하기

클래스명을 변경하거나 메소드명을 변경하는 등의 기능은 다른 파일도 동시에 수정되야 하는데 이런 작업을 효율적으로 수행할 수 있도록 리팩토링 기능을 제공하고 있다. 단축키 `ctrl + T` (`ctrl + alt + shift + T`)를 입력하면 수행 가능한 리팩토링 목록이 나온다. 이름 변경 외에도 메소드를 상위 클래스로 이동하거나 코드를 메소드로 분리, 인터페이스로 분리하는 등의 다양한 리팩토링을 수행할 수 있다.

- 이름 변경하기: `shift + F6`
- 변수로 변경하기: `alt + cmd + V` (`ctrl + alt + V`)
- 상수로 변경하기: `alt + cmd + C` (`ctrl + alt + C`)
- 필드(프로퍼티)로 변경하기: `alt + cmd + F` (`ctrl + alt + F`)
- 인자(파라미터)로 변경하기: `alt + cmd + P` (`ctrl + alt + P`)
- 메소드로 추출하기: `alt + cmd + M` (`ctrl + alt + M`)
- 인라인으로 만들기: `alt + cmd + N` (`ctrl + alt + N`)
- Pull members up...: 상위 클래스로 이동
- pull members down...: 하위 클래스로 이동
- Make Static: 정적 메소드로 변경
  - 만약 인스턴스에 의존이 있다면 해당 내용에 대해서도 프롬프트를 보여줌
- 클래스명 위에서 리팩토링 수행
  - 클래스 이동하기: `F6`
    - 다른 네임스페이스로 클래스를 이동하는데 필요한 부수 작업을 함께 처리함

영상을 보면 실제로 리팩토링을 수행할 때 이 기능을 어떻게 활용하는지 확인할 수 있다.
