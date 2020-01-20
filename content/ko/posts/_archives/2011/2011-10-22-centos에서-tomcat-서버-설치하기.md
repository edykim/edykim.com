---
title: centOS에서 tomcat 서버 설치하기
author: haruair
type: post
date: "2011-10-22T05:52:16"
history:
  - 
    from: https://www.haruair.com/blog/887
    movedAt: 2018-09-13T22:02:40+00:00
lang: ko
slug: installing-tomcat-server-on-centos
categories:
  - 개발 이야기
tags:
  - centos
  - java
  - tomcat

---
java 소스도 겨우 읽는데 tomcat 서버 설치하느라 고생했습니다. 상당히 단순한 절차인데도 개발자분이 올린 소스가 계속 에러가 나서 설치 문제인줄 알고 몇번이고 다시 설치를 시도했는데 다행히도(?) 폴더명이 문제였습니다. 지웠다가 재설치 하는 작업은 반복적으로 하면 서버가 지저분해지는 문제점(?)이 있어 싫어하는데 이번에 처음으로 해본 가상서버 호스팅은 간편하게 서버를 초기화 할 수 있어 엄청나게 편리했습니다. 이 내용은 centOS (64bit)를 기준으로 작성하였습니다.

1. 먼저 jdk를 설치해야 합니다. http://java.sun.com/javase/downloads/index.jsp 로 가서 해당 환경에 맞는 버전을 내려 받아 설치합니다.

> cd /usr/tmp
  
> wget http://download.oracle.com/otn-pub/java/jdk/7u1-b08/jdk-7u1-linux-x64.rpm
  
> rpm -Uvh jdk-7u1-linux-x64.rpm

위와 같이 입력하면 JDK 설치는 완료 됩니다.

2. tomcat을 설치합니다. http://tomcat.apache.org/ 에 가서 사용하고자 할 버전에 맞춰 내려 받습니다.

> wget http://apache.mirror.cdnetworks.com/tomcat/tomcat-7/v7.0.22/bin/apache-tomcat-7.0.22.tar.gz
  
> tar xvfpz apache-tomcat-7.0.22.tar.gz
  
> mv apache-tomcat-7.0.22 /usr/local/tomcat

3. tomcat을 서비스로 등록해야합니다. 아래의 쉘 스크립트를 작성해서 /etc/rc.d/init.d/에 저장합니다.

> <pre>#!/bin/sh
# Startup script for Tomcat
#
# chkconfig: 35 85 15
# description: apache tomcat 6.x
#
# processname: tomcat
#
# Source function library.
export JAVA_HOME=/usr/java/default
export CATALINA_HOME=/usr/local/tomcat
export PATH=$PATH:$JAVA_HOME/bin:$CATALINA_HOME/bin
# See how we were called.
case "$1" in
  start)
  echo -n "Starting tomcat: "
  $CATALINA_HOME/bin/catalina.sh start
  echo
  ;;
  stop)
  echo -n "Shutting down tomcat: "
  $CATALINA_HOME/bin/catalina.sh stop
  echo
  ;;
  restart)
  $0 stop
  sleep 2
  $0 start
  ;;
  *)
  echo "Usage: $0 {start|stop|restart}"
  exit 1
esac
exit 0</pre>
> 
> cat /etc/rc.d/init.d/tomcat #위 내용을 저장
  
> chmod 755 /etc/rc.d/init.d/tomcat

4. tomcat을 서비스로 등록한 후 서비스 시작을 해줍니다.

> chkconfig &#8211;add tomcat
  
> service tomcat start

apache-tomcat으로 설치해줬기 떄문에 웹서버 설정은 별도로 변경할 필요가 없습니다. http://localhost:8080 으로 접속하면 tomcat 고양이가 야옹거리며 기다리고 있습니다.

설정하면서 기억할만한 내용들은 아래와 같습니다.

  * web manager, host manager 를 지원하는데 /usr/local/tomcat/tomcat-user.xml 에 계정을 추가해주면 사용할 수 있다.
  * tomcat은 WAS(web application server) 개념이다. 각각의 프로젝트가 /usr/local/tomcat/webapps 에 각 디렉토리로 저장이 되는데 LAPM에서 계정발급 해주고 FTP 접속 열어주고 하는 것처럼 하려면 webapps 쪽으로 vsftp를 수정하기 보다는 기존 계정 발급과 동일하게 생성해주고 webapps 폴더에 해당 계정 디렉토리 심볼릭 링크를 걸어주는 편이 한결 간편하고 쉽다.