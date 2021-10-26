---
title: ino toolkit으로 Arduino 맛보기
author: haruair
type: post
date: "2015-06-19T11:57:37"
history:
  - 
    from: https://www.haruair.com/blog/2932
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: taste-arduino-with-ino-toolkit
headline:
  - 아두이노, 드라이버, ino만 설치하면 아두이노 준비 끝!
tags:
  - 개발 이야기
  - arduino
  - 아두이노

---
지난번 구입한 Raspberry Pi에 이어 이번엔 Arduino가 도착했다. 첫인상으로 비교했을 땐 Raspberry Pi는 똑똑하고 Arduino는 우직한 기분이 든다. 🙂 Arduino는 모든 정보가 오픈소스로 공개되어 있어서 훨씬 다양한 종류의 보드가 존재한다. Arduino가 적혀 있는 공식 보드도 있지만 자체 브랜드가 적혀있거나 아예 아무 내용도 적혀있지 않은, 저렴한 보드도 있다.

<a href="https://www.flickr.com/photos/90112078@N08/18952687015/" target="_blank"><img src="https://farm1.staticflickr.com/502/18952687015_72f25b8ffe_b.jpg?w=660&#038;ssl=1" alt="Arduino의 모습" data-recalc-dims="1" /></a>

ebay를 통해서 5달러로 ATmega328P가 탑재된 아두이노 호환 보드를 구입했다. 이외에도 소켓 브레드보드, ESP8266 WIFI 무선 송수신 모듈, Servo를 위한 모듈을 구입했는데 오늘 보드가 먼저 도착했다. 저항도 구입해야 하는데&#8230; 낱개로는 저렴하지만 결국 비싼 취미가 되고 있는 느낌이다.

별도 모듈 없이 보드 자체만 가지고서는 보드에 있는 LED를 껐다 켰다 하는 것이 할 수 있는 전부다. 기본적으로 보드 메모리에 설치되어 나오는 것도 이 LED를 껐다 켰다 하는 _blink_인데 전원을 넣으면 LED가 깜빡이는 것을 확인할 수 있다. 다음 사진에서 빨간 LED는 전원이고 초록색은 조작할 수 있는 LED다.

[<img src="https://farm4.staticflickr.com/3854/18331999193_46157d9096_b.jpg?w=660&#038;ssl=1" data-recalc-dims="1" />][1]

이 포스트에서는 Raspberry Pi에 Arduino를 USB로 연결해 진행했다. 여기서 사용한 ino 툴킷은 아쉽게도 맥과 리눅스 환경에서만 구동 가능하다. 만약 윈도우 환경이라면 Arduino IDE를 사용하자.

먼저 Raspberry Pi와 Arduino가 서로 통신할 수 있도록 드라이버를 설치한다. `sudo`를 쓰지 않아도 되는 환경이라면 사용하지 않아도 무관하다.

    $ sudo apt-get install arduino
    

GUI 환경에서는 Arduino IDE를 설치하면 되지만 콘솔에서 작업하고 싶다면 Python으로 작성된 [ino][2] 툴킷을 사용하면 된다. 이 라이브러리는 pip 또는 easy_install로 설치할 수 있다.

    $ sudo pip install ino
    

pip가 없다면 다음과 같이 easy_install을 사용할 수 있다. 물론 리포지터리를 받아 `setup.py`를 실행해도 된다.

    $ sudo apt-get install python-setuptools
    $ easy_install ino
    

Arduino의 HelloWorld인 blink 프로젝트를 만들어보자. blink 프로젝트를 템플릿으로 사용해 프로젝트를 초기화한다.

    $ mkdir helloWorld
    $ cd helloWorld
    $ ino init --template blink
    

lib 디렉토리와 src 디렉토리, 그리고 src/sketch.ino 가 생성된 것을 확인할 수 있다. sketch.ino를 열어보면 blink 템플릿 내용을 확인할 수 있다.

    #define LED_PIN 13
    
    void setup()
    {
        pinMode(LED_PIN, OUTPUT);
    }
    
    void loop()
    {
        digitalWrite(LED_PIN, HIGH);
        delay(100);
        digitalWrite(LED_PIN, LOW);
        delay(900);
    }
    

이제 이 코드를 빌드해서 arudino에 올려보자. `ino build`와 `ino upload`로 간단하게 빌드, 업로드 할 수 있다.

    $ ino build
    

위 명령어를 입력하면 빌드 과정을 보여준다. firmware.hex가 변환되고 업로드 할 준비가 완료된다. 이제 업로드를 진행한다.

    $ ino upload
    

업로드가 진행되고 arduino에 있는 LED가 위에서 입력한, 새로운 패턴으로 깜박이게 된다.

* * *

<blockquote class="twitter-video" lang="en">
  <p lang="ko" dir="ltr">
    헬로깜빡월드 <a href="http://t.co/Jnkt1qXdZ9">pic.twitter.com/Jnkt1qXdZ9</a>
  </p>
  
  <p>
    &mdash; 용균 (@haruair) <a href="https://twitter.com/haruair/status/611843815620546560">June 19, 2015</a>
  </p>
</blockquote>



아직 다양한 모듈이 없어서 맛보기만 했지만 LED 깜빡이는 것만 봐도 신기하다. 조만간 다른 모듈이 오면 더 재미있는 Thing을 만들 생각에 기대된다.

 [1]: https://www.flickr.com/photos/90112078@N08/18331999193/
 [2]: https://github.com/amperka/ino