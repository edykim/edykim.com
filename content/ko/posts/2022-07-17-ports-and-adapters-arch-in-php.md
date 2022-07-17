---
title: "포트와 어댑터 아키텍처: PHP 예제"
author: haruair
type: post
date: "2022-07-17T15:08:49.885Z"
lang: ko
tags:
 - 개발 이야기
 - 디자인 패턴
slug: "ports-and-adapters-architecture-in-php"
---

[포트와 어뎁터 아키텍처(ports and adapters architecture)](https://alistair.cockburn.us/hexagonal-architecture/)는 육각형 아키텍처(hexagonal architecture)로도 불린다.

> (육각형 아키텍처를 통해) UI나 데이터베이스 없이 동작하는 어플리케이션을 만듭니다. 그래서 어플리케이션을 자동화된 테스트를 반복해서 수행할 수 있고, 데이터베이스가 없을 때도 동작 가능하며, 사용자 없이도 애플리케이션을 연결할 수 있습니다.

외부와 어플리케이션, 도메인을 육각형 도식으로 명확하게 분리한다. 각 분리된 영역은 항구(port)를 통해 소통하는 구조를 따른다. 코드의 의존성을 "설정"하는 것으로 필요에 따라서, 재사용 할 수 있다는 점을 강조한다.

[만들면서 배우는 클린 아키텍처](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=283437942)의 예제 코드를 보면서 php로 작성했다. 어느 스터디 그룹에서 정리한 [리포지터리](https://github.com/Meet-Coder-Study/Get-Your-Hands-Dirty-on-Clean-Architecture)에도 잘 정리되어 있어서 같이 보면 유익하다.

## 코드

- [thombergs/buckpal](https://github.com/thombergs/buckpal) Java로 작성된 예제
- [edykim/buckpal-php](https://github.com/edykim/buckpal-php) PHP로 옮긴 예제

다만 의존성 구조를 체크하는 테스트는 아직 옮기지 못했다. (Alistair의 글에서 보면 이 부분도 매우 중요하다고 언급한다.)

## 패키지 구조

```
./src
├── Account
│   ├── Adapter
│   │   ├── In
│   │   │   ├── Console
│   │   │   │   ├── BalanceConsoleCommand.php
│   │   │   │   └── SendConsoleCommand.php
│   │   │   └── Web
│   │   └── Out
│   │       └── Persistence
│   │           ├── AccountMapper.php
│   │           ├── AccountObjectEntity.php
│   │           ├── AccountObjectEntityRepository.php
│   │           ├── AccountPersistenceAdapter.php
│   │           ├── ActivityObjectEntity.php
│   │           └── ActivityObjectEntityRepository.php
│   ├── Application
│   │   ├── Port
│   │   │   ├── In
│   │   │   │   ├── GetAccountBalanceQuery.php (interface)
│   │   │   │   ├── SendMoneyCommand.php
│   │   │   │   └── SendMoneyUseCase.php (interface)
│   │   │   └── Out
│   │   │       ├── AccountLock.php (interface)
│   │   │       ├── LoadAccountPort.php (interface)
│   │   │       └── UpdateAccountStatePort.php (interface)
│   │   └── Service
│   │       ├── GetAccountBalanceService.php
│   │       ├── MoneyTransferProperties.php
│   │       ├── NoOpAccountLock.php
│   │       ├── SendMoneyService.php
│   │       └── ThresholdExceededException.php
│   └── Domain
│       ├── Account.php
│       ├── AccountId.php
│       ├── Activity.php
│       ├── ActivityId.php
│       ├── ActivityWindow.php
│       └── Money.php
├── Common
│   ├── ConsoleAdapter.php (interface)
│   ├── PersistenceAdapter.php (interface)
│   └── UseCase.php (interface)
└── Kernel.php

./tests
├── Account
│   ├── Adapter
│   │   ├── In
│   │   │   └── Console
│   │   │       ├── BalanceCommandTest.php
│   │   │       └── SendCommandTest.php
│   │   └── Out
│   │       └── Persistence
│   │           └── AccountPersistenceAdapterTest.php
│   ├── Application
│   │   └── Service
│   │       └── SendMoneyServiceTest.php
│   └── Domain
│       ├── AccountTest.php
│       ├── ActivityWindowTest.php
│       └── MoneyTest.php
├── DataFixtures
│   └── AppFixtures.php
├── Helpers
│   └── CommandTestTrait.php
├── TestData
│   ├── AccountBuilder.php
│   ├── AccountTestData.php
│   ├── ActivityBuilder.php
│   └── ActivityTestData.php
└── bootstrap.php
```
