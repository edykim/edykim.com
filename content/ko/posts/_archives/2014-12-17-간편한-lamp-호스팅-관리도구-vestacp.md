---
title: 간편한 LAMP 호스팅 관리도구 VestaCP
author: haruair
type: post
date: 2014-12-17T02:46:06+00:00
history:
  - 
    from: https://www.haruair.com/blog/2586
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: easy-lamp-hosting-management-tool-vestacp
categories:
  - 개발 이야기
tags:
  - LAMP
  - vesta

---
PHP를 대차게 까는 분들이 가끔 워드프레스 설치하는 환경을 물어보기도 하고 또 환경 설정을 알려주면 설치하면서도 잔소리를 계속 하길래 이런 도구를 소개하는 것도 도움이 될 것 같아 짧게 소개글을 남긴다.

이제는 일반적인 웹호스팅 비용이나 AWS, Azure와 같은 IaaS의 요금이랑 큰 차이가 없어지고 있는데다 오히려 후자가 저렴한 경우도 많다. 게다가 서버 환경 설정을 마음대로 할 수 없고 해당 호스팅 업체에서 제공하는 서비스가 제한적일 때도 많아서 자연스럽게 가상 서버 환경을 염두하게 된다.

요즘은 이미 호스팅 환경이 설치되어 있는 서버 이미지를 제공하는 경우도 있고 앱 컨테이너로 쉽게 올릴 수 있는 플랫폼을 제공하는 경우도 많지만 웹호스팅에서 옮겨오려고 고민하는 케이스에는 굉장히 거창하고 막막할 수 밖에 없다. 겨우 필요한건 MySQL, Apache, PHP 환경인데 1) 안전하고 제대로 설치하는게 맞는지, 2) 튜토리얼이 엄청 많은데 어느 글을 따라해야 하는지, 3) 매번 콘솔에서 작업해야 하는지 등 고민이 줄줄이 나온다.

이 문제를 간단히 해결해줄 호스팅 관리도구 [VestaCP][1]가 있다. (No strings attached.)

명령어 2줄로 LAMP 환경을 모두 설치해주고 함께 설치되는 관리자 화면은 아주 심플한데다 국내 웹호스팅에서 제공하는 기능 정도는 [다 제공한다][2]. (SSL 설정, cron 설정 같은 것도.) 추가적인, 세세한 설정이 필요하다면 여전히 콘솔을 통해 작업을 해야 하지만 워드프레스 사이트를 운영한다던지, 간단한 LAMP 환경 개발 같은 경우에는 별도의 수정 없이도 충분히 사용이 가능했다.

설치는 다음과 같이 가능하다.

    # Download installation script
    curl -O http://vestacp.com/pub/vst-install.sh
    # Run it
    bash vst-install.sh
    

AWS Free-tier를 사용해도 문제 없이 잘 돌아간다. EC2 Ubuntu 이미지라면 다음과 같이 설치해야 한다.

    # Download installation script
    curl -O http://vestacp.com/pub/vst-install.sh
    # Run it
    sudo bash vst-install.sh --force
    

회사에서 [cPanel][3] (&WHM)과 [Plesk][4]를 사용하고 있었다. 이 둘은 엄청나게 세세하고 다양한 기능을 제공하긴 하지만 최근 작업한 magento 기반 프로젝트들은 다른 사이트와 함께 쓰기에는 무거운 감이 있어서 별개의 가상서버를 사용하게 되었고 기존 사용하던 관리도구들이 비용 문제, 고사양이 필요한 문제가 있었다. 그래서 대안을 찾다 VestaCP를 알게 되었고 최근 구축한 사이트는 다 이 관리도구를 이용한 서버에서 운영하고 있다.

추가적인 설정이 필요한 경우 [Vesta 문서][5]를 참고하자.

 [1]: http://vestacp.com/
 [2]: http://vestacp.com/#features
 [3]: http://cpanel.net/
 [4]: http://www.plesk.com/
 [5]: http://vestacp.com/docs/