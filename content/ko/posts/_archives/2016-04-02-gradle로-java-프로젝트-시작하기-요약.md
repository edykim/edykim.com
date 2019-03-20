---
title: Gradle로 Java 프로젝트 시작하기 요약
author: haruair
type: post
date: "2016-04-02T13:44:20"
history:
  - 
    from: https://www.haruair.com/blog/3535
    movedAt: 2018-09-13T22:02:42+00:00
lang: ko
slug: start-a-java-project-with-gradle-summary
categories:
  - 개발 이야기
tags:
  - gradle
  - java
  - spring

---
[spring의 gradle로 프로젝트 시작하기][1]를 따라하며 정리한 글이다.

먼저 brew로 java와 의존성 및 빌드 관리/자동화 도구인 [gradle][2]을 설치한다.

```bash
$ brew tap caskroom/cask
$ brew install brew-cask
$ brew cask install java
$ brew install gradle
```

문제없이 설치되었다면 버전 정보를 출력한다.

```bash
$ gradle -v
```

gradle로 프로젝트를 초기화한다.

```bash
$ gradle init
```

초기화하면 기본적으로 gradle wrapper를 생성해주는데 이 스크립트는 gradle이 없는 환경에서도 gradle을 사용할 수 있도록 돕는 스크립트다.

예제 클래스를 먼저 작성한다.

```bash
$ mkdir -p src/main/java/hello
```

```java
// src/main/java/hello/HelloWorld.java

package hello;

public class HelloWorld {
  public static void main(String[] args) {
    Greeter greeter = new Greeter();
    System.out.println(greeter.sayHello());
  }
}
```

```java
// src/main/java/hello/Greeter.java

package hello;

public class Greeter {
  public String sayHello() {
    return "Hello world!";
  }
}
```

빌드와 관련한 모든 설정은 `build.gradle`에 담겨 있다. 빌드를 위해 다음 내용을 `build.gradle`에 추가한다.

```gradle
apply plugin: 'java'
```

그리고 빌드를 하면 `build` 디렉토리를 생성하고 빌드를 진행한다.

```bash
$ gradle build
```

아래 내용을 추가해서 어플리케이션을 직접 구동할 수 있다.

```gradle
apply plugin: 'application'
mainClassName = 'hello.HelloWorld'
```

gradle을 설치한 환경에서는 gradle을 사용해도 되겠지만 다음과 같이 앞에서 생성한 wrapper를 사용해서 구동할 수 있다.

```bash
$ ./gradlew run
```

다음은 튜토리얼에서 최종적으로 작성하게 되는 gradle 파일이다.

```gradle
apply plugin: 'java'
apply plugin: 'eclipse'
apply plugin: 'application'

mainClassName = 'hello.HelloWorld'

// tag::repositories[]
// 서드파티 라이브러리의 소스 출처를 추가한다
repositories {
    mavenCentral()
}
// end::repositories[]

// tag::jar[]
// 빌드에서 jar를 생성할 때 메타를 추가한다
jar {
    baseName = 'gs-gradle'
    version =  '0.1.0'
}
// end::jar[]

// tag::dependencies[]
// 버전 의존성을 추가한다
sourceCompatibility = 1.8
targetCompatibility = 1.8

// 의존 라이브러리를 추가한다
dependencies {
    compile "joda-time:joda-time:2.2"
}
// end::dependencies[]

// tag::wrapper[]
// wrapper로 설치할 gradle version을 정한다
task wrapper(type: Wrapper) {
    gradleVersion = '2.3'
}
// end::wrapper[]
```

 [1]: http://spring.io/guides/gs/gradle/
 [2]: http://gradle.org/