---
title: iOS SpriteKit 관련 문서 모음
author: haruair
type: post
date: "2014-02-04T00:41:57"
history:
  - 
    from: https://www.haruair.com/blog/1959
    movedAt: 2018-09-13T22:02:40+00:00
lang: ko
slug: documents-related-to-ios-spritekit
categories:
  - 개발 이야기
tags:
  - apple
  - game
  - ios
  - mac
  - objectiveC
  - spriteKit
  - 게임
  - 이상한 모임

---
예전부터 cocos2D나 unity를 배워보고 싶었는데 몇 번 글을 보고 따라해봐도 감이 안와서 미뤄왔다. 우연히 SpriteKit 튜토리얼을 보고 따라하다보니 생각보다 쉽게 결과물이 나오길래 게임 만들어보자 마음 먹고 매일 문서 찾아보며 조금씩 만들어가고 있다. 아직 Objective-C도 익숙하지 않지만 [CS 193P iPhone Application Development][1]에서 야금야금 들었던 내용 가지고 하나씩 배우고 있다.

다음 링크는 진행하면서 도움이 된 글들을 간단하게 정리해봤다. 애플 공식 문서도 깔끔하게 정리되어 있는데 좀 예제가 적은 편이라서 기본적인 내용은 공식 문서에서 확인하고서, 실제 사용하는 방법들은 구글링, Stackoverflow에서 찾을 수 있었다.[^1]

## 기초

다음 튜토리얼에서 게임에서 기초적으로 필요한 이미지 불러오기, 터치 이벤트 처리, 간단한 충돌 처리, 노드 animate 방법 등을 배울 수 있다. 리소스도 제공하고 단계별로 잘 설명하고 있어 쉽게 시작하는데 도움이 된다.

  * [초보자를 위한 SpriteKit 튜토리얼][2]
  * [Apple SpriteKit Documentation][3]

<!--more-->

## 디자인/그래픽 관련

여러 장의 이미지로 에니메이션을 처리하거나 한 장의 이미지로 여러 node를 만들려고 할 때 다음 글이 도움이 된다. 이미지 하나로 처리하는 방법은 미리 `SKTexture textureWithRect:inTexture:`로 텍스쳐를 만들어두고 사용하면 된다.

  * [Atlas로 애니메이션 만들기][4]
  * [이미지 하나로 sprite 처리하기][5]

점수나 안내 문구를 `SKLabelNode`로 사용하려고 했었기에 임베드 폰트 넣는 방법을 찾아봤다. `SKShapeNode`로 벡터 처리도 가능하다.

  * [임베딩 폰트 넣기][6]
  * [벡터로 간단한 선 그리기][7]

## 버튼 관련

시작, 다시하기, 처음으로 등 버튼을 만들기 위해 찾아본 버튼 관련 내용이다. 꼭 버튼 뿐만 아니라 `SKNode`에 다 적용되는 내용이라 이해하는데 도움이 되었다.

  * [버튼 클래스 만들기][8]
  * [토글 버튼 만들기][9]
  * [`touches`에서 특정 node만 반응하도록 만들기][10]

## 데이터 저장하기/불러오기

High Score를 저장하기 위해 찾아봤는데 여러 저장 방법이 있지만 `NSUserDefaults`를 사용하기로 했다.

  * [`NSUserDefaults`로 최고점 데이터 저장하기][11]
  * [`NSCoding` 데이터 저장하기][12]

[^1]:    
    아직 나온지 얼마 안되서 그런지 검색이 잘 안되는 경향이 있다.

 [1]: http://www.stanford.edu/class/cs193p/cgi-bin/drupal/
 [2]: http://www.raywenderlich.com/42699/spritekit-tutorial-for-beginners
 [3]: https://developer.apple.com/library/mac/documentation/GraphicsAnimation/Conceptual/SpriteKit_PG/Introduction/Introduction.html#//apple_ref/doc/uid/TP40013043
 [4]: http://www.raywenderlich.com/45152/sprite-kit-tutorial-animations-and-texture-atlases
 [5]: http://stackoverflow.com/questions/20271812/use-a-one-image-sprite-sheet-in-sprite-kit-ios
 [6]: http://codewithchris.com/common-mistakes-with-adding-custom-fonts-to-your-ios-app
 [7]: http://stackoverflow.com/questions/19092011/how-to-draw-a-line-in-sprite-kit
 [8]: http://stackoverflow.com/questions/18913673/ios-7-spritekit-buttons-menuitem
 [9]: http://stackoverflow.com/questions/19688451/how-to-make-a-toggle-button-on-spritekit/19694729#19694729
 [10]: http://stackoverflow.com/questions/19082202/spritekit-setting-up-buttons-in-skscene
 [11]: http://mobile.tutsplus.com/tutorials/iphone/nsuserdefaults_iphone-sdk/
 [12]: http://www.raywenderlich.com/1914/nscoding-tutorial-for-ios-how-to-save-your-app-data