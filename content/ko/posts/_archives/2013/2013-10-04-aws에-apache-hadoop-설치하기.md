---
title: AWS에 Apache Hadoop 설치하기
author: haruair
type: post
date: "2013-10-03T20:00:32"
history:
  - 
    from: https://www.haruair.com/blog/1827
    movedAt: 2018-09-13T22:02:40+00:00
lang: ko
slug: installing-apache-hadoop-on-aws
categories:
  - 개발 이야기
  - 공부
tags:
  - hadoop
  - HDFS
  - 빅데이터
  - 스터디

---
요즘 한참 핫(!)한 빅데이터 스터디에 참여하게 되었다. AWS에서는 사실 EMR을 지원하는 등 직접 설치할 일이 없다고 하는데 [^1]EC2 Micro 인스턴스에 Hadoop을 실습을 위해 설치했다. 예/복습 차원에서 간략하게 스터디 내용을 정리해보려고 한다.

* * *

![Apache Hadoop][1]

**Apache Hadoop(High-Availability Distributed Object-Oriented Platform)**은 Apache 재단에서 진행하는 오픈소스 프로젝트로 대량의 자료(빅데이터)를 처리할 수 있는 분산 시스템을 구축할 수 있게 돕는 소프트웨어 라이브러리다. 이 프로젝트는 다음의 모듈을 포함하고 있다.

  * Hadoop Common: Hadoop 모듈을 지원하기 위한 일반적인 유틸리티들
  * Hadoop Distributed File System (HDFS): 어플리케이션 데이터를 대량으로 처리할 수 있게 접근이 가능한 분산 파일 시스템
  * Hadoop YARN: job 스케쥴링과 클러스터 리소스 관리를 위한 프레임워크
  * Hadoop MapReduce: YARN을 기반으로 한 대형 데이터 셋 병렬처리 시스템

<!--more-->

## Hadoop HDFS 간단히 알기

HDFS는 **namenode**와 **datanode**로 구성되어 있다. Namenode는 HDFS의 파일 구조를 저장하는 영역이고 datanode는 실제 파일을 저장하는 영역이다. 일반적으로 사용되는 NTFS나 FAT같은 파일 시스템은 파일 구조의 위치에 실제 파일이 저장되지만 [^2]HDFS는 그 파일 경로와 실제 파일이 분리되어 각각의 노드에 저장되는 형태이다. Namenode에는 datanode가 어디에 존재하는지 저장되어 있으며, 클라이언트가 해당 파일을 namenode에 요청하면 저장되어 있는 datanode를 알려줘 파일을 내려받을 수 있도록 돕는다. 이와 같이 HDFS는 구조(namenode)와 데이터(datanode)를 분리했기 때문에 데이터의 분산 처리가 가능하다.

**Datanode**는 자료를 분산해서 저장함과 동시에 복제본을 담아둬 데이터를 유실했을 때를 대비한다.[^3]

**Namenode**는 HDFS의 모든 파일 명령 수행 목록을 Edits에 저장을 한다. FsImage는 Edits를 병합해 기록해둔 파일이다. **Secondary namenode**는 Namenode를 대체하거나 하진 않고 Edits 파일을 불러다가 FsImage로 병합해 namenode에게 돌려주는 역할을 한다.

## Hadoop MapReduce 간단히 알기

구조와 데이터를 분산해서 처리한 것과 같이 데이터를 다루는 프로그램도 분산해서 각각의 데이터를 처리할 수 있도록 도와주는 것이 **MapReduce**이다.

MapReduce는 **Job tracker**와 **Task tracker**로 구성이 되어 있는데 Job tracker는 Task tracker의 할 일을 관리하는 역할이고 Task tracker는 각 분산된 datanode에서 연산과정을 처리하는 역할을 한다.

# AWS에 Hadoop 설치하기

## 설치 준비하기

AWS에서 인스턴스 생성해서 콘솔로 접속한다. AWS 인스턴스를 시작하는 것은 검색하면 많이 나온다. ubuntu 12.04 LTS를 선택했다.

    $ ssh ubuntu@instance-address
    

jdk를 설치한다.

    $ sudo apt-get update
    $ sudo apt-get install openjdk-6-jdk
    

Hadoop을 [아파치 다운로드 사이트][2]에서 찾아 내려받고 압축을 해제한다.

    $ wget http://apache.mirror.uber.com.au/hadoop/common/hadoop-1.2.1/hadoop-1.2.1.tar.gz
    $ tar xvfz hadoop-1.2.1
    $ cd hadoop-1.2.1
    

## Hadoop 환경 설정

Hadoop은 Java 기반이므로 사용할 환경의 경로를 지정해야 한다. `conf/hadoop-env.sh`을 열어 경로를 지정한다.

    $ vim conf/hadoop-env.sh
    

`JAVA_HOME`의 주석을 지우고, jdk의 경로를 정해준다.

    # Set Hadoop-specific environment variables here.
    
    # The only required environment variable is JAVA_HOME.  All others are
    # optional.  When running a distributed configuration it is best to
    # set JAVA_HOME in this file, so that it is correctly defined on
    # remote nodes.
    
    # The java implementation to use.  Required.
    export JAVA_HOME=/usr/lib/jvm/java-6-openjdk-amd64/jre
    
    # Extra Java CLASSPATH elements.  Optional.
    # export HADOOP_CLASSPATH=
    

Pseudo-Distibuted로 동작할 것이므로 각각의 configuration을 작성해준다.

core-site.xml에서 fs.default.name 프로퍼티는 namenode가 동작하는 서버를 적어준다. secondary namenode, datanode, task tracker는 이 프로퍼티를 참고한다.

    $ vim conf/core-site.xml
    

파일에서 아래 부분을 추가한다.

    <configuration>
        <property>
            <name>fs.default.name</name>
            <value>hdfs://localhost:9000</value>
        </property>
    </configuration>
    

hdfs-site.xml에서 dfs.replication 프로퍼티는 복제 개수를 의미한다. 이 숫자가 3이면 동일한 데이터를 3개로 중복으로 저장해 유실을 방지할 수 있다.

    $ vim conf/hdfs-site.xml
    

파일에서 아래 부분을 추가한다.

    <configuration>
        <property>
            <name>dfs.replication</name>
            <value>1</value>
        </property>
    </configuration>
    

mapred-site.xml에서 mapred.job.tracker 프로퍼티는 task tracker를 위해 job tracker가 동작하는 서버를 적어준다.

    $ vim conf/mapred-site.xml
    

파일에서 아래 부분을 추가한다.

    <configuration>
        <property>
            <name>mapred.job.tracker</name>
            <value>localhost:9001</value>
        </property>
    </configuration>
    

## SSH 설정하기

각각의 node와 tracker끼리 데이터를 주고 받을 때를 위해 ssh key를 등록해준다.

    $ ssh-keygen -t rsa -P ""
    # 경로는 기존에 생성한 키가 없다면 기본 경로로 해도 된다.
    $ cat /home/ubuntu/.ssh/id_rsa.pub >> /home/ubuntu/.ssh/authorized_keys
    # 추가한 ssh key를 허용된 키로 등록해준다.
    

키가 제대로 설정되었는지는 다음의 명령어로 확인해볼 수 있다.

    $ ssh localhost
    # 이러면 localhost에 다시 접속된다.
    $ exit
    

## Hadoop 실행하기

    $ pwd
    /home/ubuntu/hadoop-1.2.1
    

Hadoop을 실행하기 이전에 namenode를 초기화한다.

    $ bin/hadoop namenode -format
    

그다음 `start-all.sh`를 실행한다.

    $ bin/start-all.sh
    starting namenode, logging to /home/ubuntu/hadoop-1.2.1/libexec/../logs/hadoop-ubuntu-namenode-ip-10-240-106-45.out
    localhost: starting datanode, logging to /home/ubuntu/hadoop-1.2.1/libexec/../logs/hadoop-ubuntu-datanode-ip-10-240-106-45.out
    localhost: starting secondarynamenode, logging to /home/ubuntu/hadoop-1.2.1/libexec/../logs/hadoop-ubuntu-secondarynamenode-ip-10-240-106-45.out
    starting jobtracker, logging to /home/ubuntu/hadoop-1.2.1/libexec/../logs/hadoop-ubuntu-jobtracker-ip-10-240-106-45.out
    localhost: starting tasktracker, logging to /home/ubuntu/hadoop-1.2.1/libexec/../logs/hadoop-ubuntu-tasktracker-ip-10-240-106-45.out
    

namenode, datanode, jobtracker, tasktracker가 순서대로 실행되는 것을 확인할 수 있다. 현재 실행되고 있는지 확인하려면 `jps`로 jvm에서 구동되고 있는 프로세스 항목을 확인할 수 있다.

    $ jps
    10379 NameNode
    11044 TaskTracker
    10852 JobTracker
    11192 Jps
    10562 DataNode
    10753 SecondaryNameNode
    

종료는 `stop-all.sh`를 실행하면 된다.

    $ bin/stop-all.sh
    

## Hadoop Mode

Hadoop은 아래 세가지의 모드로 설치할 수 있다.

  * Local (Standalone) Mode
  * Pseudo-Distributed Mode
  * Fully-Distributed Mode

위에서 진행한 방식은 **Pseudo-Distributed Mode**로 하나의 서버에서 namenode, datanode, job tracker, task tracker를 모두 운용하는 모드다. 진짜(?) hadoop은 3번째 모드라고 하니 다음 글에선 3번째 모드로 진행하는 방법을 알아볼 것이다.

[^1]:    
    잘 모른다;;

[^2]:    
    내부적으로 어떻게 동작하는지는 잘 모름;

[^3]:    
    이 복제 수를 hdfs-site.xml에서의 dfs.replication 프로퍼티로 제어한다.

 [1]: /wp-content/uploads/2013/10/hadoop-logo.jpg
 [2]: http://www.apache.org/dyn/closer.cgi/hadoop/common/