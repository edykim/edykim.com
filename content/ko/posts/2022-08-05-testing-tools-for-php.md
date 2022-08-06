---
title: "PHP 테스팅 관련 도구 메모"
author: haruair
type: post
date: "2022-08-05T23:36:06.081Z"
lang: ko
tags:
  - 개발 이야기
  - php
slug: "testing-tools-for-php"
---

### 테스팅 프레임워크

- [phpunit](https://phpunit.de/): 사실상 표준이라 볼 수 있는 php 테스팅 프레임워크.
- [behat](https://docs.behat.org/en/latest/index.html): 행위주도 개발(Behavior-Driven Development) php 프레임워크. 사용자 스토리를 작성하고 테스트를 작성할 수 있음.
- [phpspec](http://phpspec.net/en/stable/): BDD php 프레임워크. spec 기반.
- [pestphp](https://pestphp.com/): 내부적으론 phpunit이지만 더 간편한 문법으로 테스트를 작성할 수 있는 프레임워크.
- [codeception](https://codeception.com/): 유닛 테스트, 기능 테스트, 인수 테스트(PhpBrowser 또는 WebDriver) 모두 가능한 프레임워크.

### 테스트 유틸리티

- [faker](https://github.com/FakerPHP/Faker): 모의 데이터 생성을 돕는 라이브러리.
- [mockery](https://github.com/mockery/mockery): 모의 개체를 생성하는 php 프레임워크. 개체의 어떤 메소드를 호출하면 어떤 반환값을 반환하는 지 등을 지정해서 테스트 대역으로 활용할 수 있음.
- [Infection](https://infection.github.io/): 변조 테스트를 수행해서 각 경계값이 제대로 테스트되는지 확인하는 도구. 예를 들면 `count($this->products) === 0` 과 같은 코드를 `count($this->products) > 0` 등으로 변조해서 테스트를 통과하는지 실패하는지 확인하는 방식.
- [churn-php](https://github.com/bmitch/churn-php): 리팩토링 후보를 찾는데 도움 주는 도구. 얼마나 많은 커밋에서 해당 파일이 변경되었는지와 로직의 순환 복잡도를 기준으로 순위를 보여줌. 
- [ParaTest](https://github.com/paratestphp/paratest): phpunit 병렬로 구동하는 도구.
- [roave/better-reflection](https://github.com/Roave/BetterReflection): 내장 reflection API를 좀 더 사용하기 깔끔하게 만든 라이브러리.

### 리포트, 코드 분석 도구

- [Psalm](https://psalm.dev/) *많이 사용
- [PHPStan](https://phpstan.org/) *많이 사용
- [PHP Insights](https://phpinsights.com/)
- [detrac](https://github.com/qossmic/deptrac)
- [grumphp](https://github.com/phpro/grumphp)
