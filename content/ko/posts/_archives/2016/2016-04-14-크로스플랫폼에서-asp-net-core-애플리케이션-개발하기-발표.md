---
title: 크로스플랫폼에서 ASP.NET Core 애플리케이션 개발하기 발표 자료
author: haruair
type: post
date: "2016-04-14T03:47:18"
history:
  - 
    from: https://www.haruair.com/blog/3556
    movedAt: 2018-09-13T22:02:42+00:00
lang: ko
slug: developing-crossplatform-asp.net-core-applications
tags:
  - 개발 이야기
  - aspnet
  - dotnet core

---
올해부터 호주 멜버른에서 IT 개발 직군에 종사하는 한국어 구사자를 위한 [Weird Developer Melbourne][1]이 운영되고 있다. [2월 16일 밋업][2]에 발표했던 자료인데 정리해서 올린다고 하고 두 달이나 지나서야 올리게 되었다.

  * [발표 영상][3]
  * [슬라이드][4]
  * [발표 리포지터리][5]

`dnx` 대신 `dotnet`으로 변경한다는 이야기가 한참 있었는데 그 이후로 follow up 하지 못했다. 아래 내용은 발표 당시를 기준으로 한 환경 설정이다. 발표에서 Entity Framework을 사용하기 위해 sqlite3도 포함되어 있다.

## `Vagrantfile`

    # -*- mode: ruby -*-
    # vi: set ft=ruby :
    Vagrant.configure(2) do |config|
      config.vm.box = "ubuntu/vivid64"
      config.vm.network "forwarded_port", guest: 5000, host: 8080
      config.vm.network "public_network"
      #config.vm.network :private_network, id: "192.168.33.20"
      config.vm.synced_folder ".", "/home/vagrant/weirdnote"
      config.vm.provider "virtualbox" do |vb|
        vb.memory = "1024"
      end
      config.vm.provision "shell", path: "tools/vagrant/provision.sh"
    end
    

## 의존 패키지 설치

    $ sudo apt-get update
    # DNX prerequisites
    $ sudo apt-get install -y unzip curl libunwind8 gettext libssl-dev \
      libcurl4-openssl-dev zlib1g libicu-dev uuid-dev
    # install libuv for KestrelHttpServer
    $ sudo apt-get install -y automake libtool
    # sqlite3
    $ sudo apt-get install libsqlite3-dev
    $ curl -sSL https://github.com/libuv/libuv/archive/v1.4.2.tar.gz \
     | sudo tar zxfv - -C /usr/local/src
    $ cd /usr/local/src/libuv-1.4.2
    $ sudo sh autogen.sh
    $ sudo ./configure
    $ sudo make
    $ sudo make install
    $ sudo rm -rf /usr/local/src/libuv-1.4.2 && cd ~/
    $ sudo ldconfig
    

## DNVM 설치

    # install DNVM
    $ curl -sSL https://raw.githubusercontent.com/aspnet/Home/dev/dnvminstall.sh \
     | DNX_BRANCH=dev sh && source ~/.dnx/dnvm/dnvm.sh
    # dnvm set as coreclr
    $ dnvm upgrade -r coreclr
    

## NodeJS 설치

    # nvm install
    $ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.30.2/install.sh \
    | bash
    $ source ~/.nvm/nvm.sh
    # install node
    $ nvm install v5.5.0
    $ nvm alias default v5.5.0
    # node related
    $ npm install -g yo bower grunt-cli gulp
    $ npm install -g generator-aspnet

 [1]: http://www.meetup.com/Weird-Developers-Melbourne/
 [2]: http://www.meetup.com/Weird-Developers-Melbourne/events/228395845/
 [3]: https://www.youtube.com/watch?v=_QcU1-YpkFQ&list=PLJ0BuvoGAkXs7m6w0mWFNOriX7Ko2bAKk
 [4]: http://haruair.github.io/weirdnote/
 [5]: https://github.com/haruair/weirdnote/tree/feature/initial-model