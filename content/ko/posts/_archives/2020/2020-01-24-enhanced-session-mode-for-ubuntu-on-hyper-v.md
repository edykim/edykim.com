---
title: Hyper-V 상의 Ubuntu에 고급 세션 모드 사용하기
author: haruair
type: post
date: "2020-01-24T13:02:23"
lang: ko
slug: enhanced-session-mode-for-ubuntu-on-hyper-v
headline:
 - 고급 세션 모드(enhanced session mode)로 느린 사용성 개선하는 방법
categories:
 - 두루두루 IT
tags:
 - hyper-v
 - windows
---

Windows에 Hyper-V로 Ubuntu를 설치한 후에 제공하는 도구로 접속해보면 마우스도 느리게 움직이고 키보드 입력도 답답하다.

이 문제를 해소하기 위해 [고급 세션 모드(enhanced session mode)](https://docs.microsoft.com/ko-kr/virtualization/hyper-v-on-windows/user-guide/enhanced-session-mode)가 추가되었다. 내부적으로 RDP를 이용해서 해당 가상 컴퓨터(VM)에 접속하는 방식이다. Windows 10 버전 1709 이후로 제공되는 Hyper-V 빨리 만들기 (Quick Create) 프로그램에서는 이 고급 세션 모드를 기본적으로 사용할 수 있도록 설정된 Ubuntu VM을 제공하고 있다.

하지만 직접 리눅스 이미지를 사용해서 VM을 생성했다면 별도의 설정이 필요하다. 해당 설정을 위한 스크립트는 [microsoft/linux-vm-tools](https://github.com/microsoft/linux-vm-tools)에서 제공하고 있다. 해당 스크립트에는 linux-virtual 관련 툴 설치, xrdp 설치 및 설정이 포함되어 있고 각 항목마다 주석으로 설명이 있어서 어떤 도구가 설치되는지 궁금하다면 확인해보자.

설치한 Ubuntu는 19.10이며 위 스크립트는 18.04인데 설치에 큰 차이가 없었다. 16대 버전은 다른 설치파일이 존재하므로 위 링크를 참조해야 한다.

1. Ubuntu 새 이미지를 받아서 빨리 만들기 프로그램을 사용해 VM에 설치한다.
2. Ubuntu VM을 구동해서 root 권한으로 설치 스크립트를 실행한다.

   ```bash
   $ wget https://raw.githubusercontent.com/microsoft/linux-vm-tools/master/ubuntu/18.04/install.sh
   $ bash install.sh
   ```
3. 필요에 따라 VM을 재시작한 후 다시 스크립트를 실행한다.
4. 설치가 완료되면 VM을 종료한다.
5. Windows PowerShell을 관리자 권한으로 실행한 후에 다음 명령으로 해당 VM의 고급 세션 모드를 활성화한다. `<VM_NAME>`은 VM 이름으로 바꿔야 한다.

   ```powershell
   Set-VM -VMName "<VM_NAME>" -EnhancedSessionTransportType HvSocket
   ```
6. Hyper-V 관리자에서 VM을 실행하면 VM이 구동된 후 해상도 선택 화면이 나온다. 선택 후 접속한다.
7. xrdp 로그인 화면이 나온다. 로그인하면 세션이 시작된다.

여전히 느린 부분도 있긴 하지만 마우스 커서가 버벅이거나 키보드 입력이 느린 현상은 확실히 개선되었다.

----

- [microsoft/linux-vm-tools](https://github.com/microsoft/linux-vm-tools)
- [Using Enhanced Mode Ubuntu 18.04 for Hyper-V on Windows 10](https://www.hanselman.com/blog/UsingEnhancedModeUbuntu1804ForHyperVOnWindows10.aspx)
- [Hyper-V를 사용하여 가상 컴퓨터 만들기](https://docs.microsoft.com/ko-kr/virtualization/hyper-v-on-windows/quick-start/quick-create-virtual-machine)
- [가상 컴퓨터와 장치 공유](https://docs.microsoft.com/ko-kr/virtualization/hyper-v-on-windows/user-guide/enhanced-session-mode)
- [Use local resources on Hyper-V virtual machine with VMConnect](https://docs.microsoft.com/ko-kr/windows-server/virtualization/hyper-v/learn-more/use-local-resources-on-hyper-v-virtual-machine-with-vmconnect)
