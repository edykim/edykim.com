---
title: JavaScript로 Arduino 제어하기 Johnny-Five
author: haruair
type: post
date: "2015-06-26T14:50:52"
history:
  - 
    from: https://www.haruair.com/blog/2956
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: controlling-arduino-with-javascript-johnnyfive
headline:
  - JS의 다양한 라이브러리, 강력한 기능을 Arduino에서 활용하는 방법
tags:
  - 개발 이야기
  - Firmata
  - javascript
  - js
  - Johnny-Five
  - 아두이노

---
요즘 출퇴근 하는 시간에는 눈도 쉴 겸 팟캐스트를 자주 듣는다. 그 중 Hanselminutes을 애청하고 있는데 Scott Hanselman이 여러 분야 사람들을 인터뷰하는 방식으로 진행되는 팟캐스트다. 이 팟캐스트에서 진행한 [Getting started making NodeBots and Wearables][1] 에피소드에서 [NodeBots 프로젝트][2]와 [Johnny-Five.io][3]에 대해 알게 되어 살펴보게 되었다.

<img src="https://farm1.staticflickr.com/552/19171356032_564ff4e9b0_b.jpg?w=660&#038;ssl=1" alt="NodeBots" data-recalc-dims="1" />

NodeBots 프로젝트는 말 그대로 JavaScript를 이용해 로봇공학을 배우는 프로젝트로 세계 각지에서 진행되고 있다고 한다. JS를 사용할 수 있는 이점을 살려 쉽고 재미있는 과정을 제공하고 있는데 2015년 7월 25일은 국제 NodeBots의 날로 각 지역별로 프로그램이 진행된다.([멜번에서도!][4]) 아쉽게도 한국에는 아직 오거나이저가 없는 것 같다.

<img src="https://farm1.staticflickr.com/386/18990998609_e7626f5ef1_b.jpg?w=660&#038;ssl=1" alt="Johnny-Five는" data-recalc-dims="1" />

Johnny-Five는 JavaScript 로봇공학 프로그래밍 프레임워크로, 이전 포스트인 [ino toolkit으로 Arduino 맛보기][5]에서 C 문법 스타일의 sketch를 사용한 반면 이 프레임워크로 JavaScript를 이용해 제어할 수 있다. 그리고 REPL을 제공하고 있어서 실시간으로 데이터를 확인하거나 nodejs의 다양한 라이브러리도 활용할 수 있다. NodeBots 세션에서는 손쉽게 웹API로 만들어 브라우저를 통해 제어하는 등 이전 환경에서는 만들기 까다로웠던 부분을 재미있게 풀어가는데 활용하고 있다. 게다가 이 프레임워크는 아두이노에만 국한된 것이 아니라 [다양한 개발 보드를 지원][6]하고 있는 것도 장점이다.

그 사이 주문한 서보 모터는 도착했는데 서보 실드나 브래드보드가 도착하지 않아서 여전히 LED 깜빡이는 수준이라 아쉽다. 🙁 이 포스트에서는 Raspberry Pi에 Arduino Uno를 연결해서 진행했다.

## 요구 환경

OSX에서는 Node.js, Xcode, node-gyp가 필요하고 Windows에서는 Node.js, [VS Express][7], Python 2.7, node-gyp가 필요하다.

    $ npm install --global node-gyp
    

요구 사항은 [Getting Started 페이지][8]에서 확인할 수 있다.

## Firmata 설치하기

Arduino에서 Johnny-Five를 사용하기 위해서는 Firmata를 먼저 설치해야 한다. Firmata는 마이크로 컨트롤러를 소프트웨어로 조작하기 위한 프로토콜인데 펌웨어 형태로 제공되고 있어 arduino에 설치하기만 하면 된다.

Arduino IDE를 사용하고 있다면 아두이노를 연결한 후, `File > Examples > Firmata > StandardFirmata` 순으로 선택한 후 Upload 버튼을 클릭하면 된다고 한다.

CLI 환경에서 작업하고 있는 경우에는 Firmata 코드를 받아 ino로 빌드 후 업로드할 수 있다. 여기서는 v2.4.3 이지만 [Firmata github][9]에서 최신인지 확인하자.

    $ wget https://github.com/firmata/arduino/releases/download/v2.4.3/Arduino-1.6.x-Firmata-2.4.3.zip
    $ unzip Arduino-1.6.x-Firmata-2.4.3.zip
    $ cd ./Firmata/
    
    # StandardFirmata.ino를 복사해서 빌드에 포함시킴
    $ cp ./examples/StandardFirmata/StandardFirmata.ino ./src
    

이 상황에서 바로 빌드하면 에러가 난다. `StandardFirmata.ino`를 에디터로 열어 다음 코드를 찾는다.

    #include <Firmata.h>
    

그리고 다음처럼 `Firmata.h` 파일을 폴더 내에서 찾도록 수정한다.

    #include "./Firmata.h"
    

모든 준비가 끝났다. USB로 연결한 후, `ino`로 빌드와 업로드를 진행한다.

    $ ino build
    $ ino upload
    

Firmware를 생성하고 업로드하는 과정을 화면에서 바로 확인할 수 있다. 이제 Johnny-five를 시작하기 위한 준비가 끝났다.

## Johnny-five로 LED 깜빡이 만들기

앞서 과정은 좀 복잡했지만 johnny-five를 사용하는건 정말 간단하다. 먼저 nodejs가 설치되어 있어야 한다. 프로젝트를 만들고 johnny-five를 npm으로 설치한다.

    $ mkdir helloBlinkWorld
    $ cd helloBlinkWorld
    $ npm init # 프로젝트 정보를 입력
    $ npm install --save johnny-five
    

설치가 모두 완료되면 `blink.js`를 생성해 다음 JavaScript 코드를 입력한다.

    var five = require("johnny-five"),
        board = new five.Board();
    
    board.on("ready", function () {
    
      // 13은 보드에 설치된 LED 핀 번호
      var led = new five.Led(13);
    
      // 500ms으로 깜빡임
      led.blink(500);
    
    });
    

정말 js다운 코드다. 위 파일을 저장하고 `node`로 실행하면 보드와 연동되는 것을 확인할 수 있다. (아쉽게도 동영상은 만들지 않았다 🙂 더 재미있는 예제를 기약하며)

    $ node blink.js
    

* * *

JavaScript가 다양한 영역에서 사용되고 있다는 사실은 여전히 신기하다. 이 프레임워크도 상당히 세세하게 많이 구현되어 있어서 단순히 JS 로보틱스 입문 이상으로도 충분히 활용할 수 있겠다는 인상을 받았다. 조만간 [Tessel 2][10]도 나올 예정인데 이 기기의 js 사랑도 이 라이브러리와 견줄만 할 정도라 많이 기대된다.

 [1]: http://hanselminutes.com/476/getting-started-making-nodebots-and-wearables-with-kassandra-perch
 [2]: http://nodebots.io/
 [3]: http://johnny-five.io/
 [4]: https://www.eventbrite.com.au/e/international-nodebots-day-melbourne-july-2015-tickets-17405115168
 [5]: http://haruair.com/blog/2932
 [6]: http://johnny-five.io/platform-support/
 [7]: http://haruair.com/blog/2669
 [8]: https://github.com/rwaldron/johnny-five/wiki/Getting-Started
 [9]: https://github.com/firmata/arduino/releases
 [10]: https://tessel.io/