---
title: JetBrains PHPverse 2025 메모
author: haruair
uuid: "c16637fe-0468-4cd3-a9f0-a9d7464f1ab4"
type: post
date: "2025-06-23T16:25:43"
lang: ko
slug: phpverse-2025
tags:
  - 개발 이야기
  - PHP
---

JetBrains [PHPverse 2025](https://lp.jetbrains.com/phpverse-2025/)을 보면서 짧게
적었다. PHP 30주년을 맞아 즐겁고 축하 분위기 속에 진행되었다. 다년간 서로 영향을
주고 받으면서 성장한 라라벨과 심포니, 새로운 방향성을 제시하고 있는 FrankenPHP와
발족 이후 풍성한 활동을 하고 있는 PHP 재단까지 PHP의 현재를 폭넓게 살펴볼 수
있었던 시간이었다.

## Table of Contents

# FrankenPHP: Reinventing PHP for the Modern Web - Kévin Dunglas

[FrankenPHP](https://frankenphp.dev/) 에 대한 간략한 소개와 함께 현재 개발 상황을
공유했다. FrankenPHP는 go로 작성된 현대적 PHP 앱서버로 요즘 뜨거운 프로젝트 중
하나로 최근엔 PHP 재단의 지원도 받기 시작했다.

- NGINX+FPM 또는 Apache+mod_php를 대체
- 상당한 성능 향상 (~25%)
- 쉬운 배포: 도커도 가능하고 바이너리애 임베딩도 가능
- 가장 빠른 PHP 엔진
- 103 early hints 지원
- 실시간 데이터 전송 지원
  ([Mercure](https://symfony.com/doc/current/mercure.html) 사용, [Server-sent
  events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
  참조)
- 대부분 프레임워크 문제 없이 지원
- HTTPS 자동화
- HTTP/2, HTTP/3 네이티브 지원
- Brotli, zstandard, gzip 압축 지원
- 구조화된 로그 지원
- prometheus/openmetrics, opentelementry 등 메트릭과 트레이싱 지원
- 클라우드 네이티브

Go로 작성된 만큼 go의 가볍고 강력한 동시성, 성능의 혜택을 그대로 누릴 수 있게
됐다. 또한 go의 `Caddy` 웹서버를 기반으로 하고 있어서 `Caddy`의 모든 기능과
모듈을 사용할 수 있게 되었다. 거인의 어깨에 서서 고성능 달성!

```bash
$ docker run -v $PWD:/app \
    -p 80:80 -p 443:443 -p 443:443/udp \
    duglas/frankenphp
```

정적 바이너리로도 사용 가능해서 php 코드와 함께 번들해서 배포도 가능하게 되었다.
homebrew나 리눅스 패키지로도 이미 다 배포되어 있어 손쉽게 사용할 수 있다.

```bash
$ curl https://frankenphp.dev/install.sh | sh
$ mv frankenphp /usr/local/bin/
$ frankenphp php-server -r public/
```

```bash
$ composer install --no-dev -a
$ git clone https://github.com/dunglas/frankenphp && cd frankenphp
$ EMBED=/path/to/my/app ./build-static.sh
$ ./dist/frankenphp-<os>-<arch> php-server
$ ./dist/frankenphp-<os>-<arch> php-cli my-command
```

다른 특징은 워커 모드의 지원인데 goroutines과 채널을 활용해서 더 빠르게 요청을
처리할 수 있다고 한다. 근래 대부분의 프레임워크와 라이브러리, 서비스(Symfony,
Laravel Octane, Platform.sh, Laravel Cloud, Clever Cloud 등)에서 이미 잘
지원하고 있다고 한다.

```
frankenphp {
  worker {
    file ./public/worker.php
  }
}
```

`103 Early Hints`도 지원한다. 웹서버의 응답이 완전히 처리되기 전에는
브라우저에서 html을 받을 때까지 기다리게 되는데 정보성 응답으로 에셋을 미리 받을
수 있도록 돕는다.

```php
// 바닐라
header('Link: </styles.css>; rel=preload; as=style');
header_send(103);
echo << 'HTML'
<!doctype html>
<title>Hello FrankenPHP</title>
<link rel="stylesheet" href="style.css">
HTML;

// symfony, 또는 laravel
$r = new Response();
$r->headers->set('Link', '</style.css>; rel=preload; as=style');
$r->sendHeaders(103);
// ...
```

go로 확장을 작성하고 php에서 쉽게 접근이 가능한 것도 재미있는 부분이었다. 물론
확장을 사용하기 위해서는 정적 컴파일이 필요하다. Zend 엔진 타입을 Go 타입으로
변환하는 등의 헬퍼를 제공해서 사용성을 높였다. 지원하는 타입은 계속 추가하는
과정에 있다고 한다.

```go
//export_php:function background_hello(string $name): void
func BackgroundHello(*C.zend_string foo) {
  go func() {
    time.Sleep(10*time.Second)
    slog.Info("Hello", "name", franken.GoString(unsafe.Pointer(foo))
  }
}
```

위 함수를 다음처럼 간편하게 확장으로 빌드할 수 있다.

```bash
$ go mod init example.com/myextension
$ cd myextension
$ frankenphp extension-init myextension.go
 ...
$ xcaddy build \
    --output frankenphp \
    --with github.com/dunglas/frankenphp/caddy \
    --with example.com/myextension
```

```php
<?php
background_hello("Alexandre Daubois"); // 직접 사용 가능
```

# Symfony: Current State and Future Plans - Nicolas Grekas

Symfony도 라라벨과 함께 PHP 생태계에 큰 역할을 하는 프로젝트로 강력한 PHP
프레임워크이기도 하면서 작고 강력하면서도 다양한 라이브러리를 만들고 있다.

- 지속적인 발전과 하위 호환성: 반년 주기로 새 기능 배포, 안정성 5년 보장, 대규모
  업그레이드는 레거시 코드 제거에 관한 부분 (deprecation을 미리 정리하는 것으로
  대비하기)
- 개발자 경험 향상
  - 다양한 개발용 CLI 지원 (`symfony`)
  - API 플랫폼 (`#[ApiResource]`)
  - [ux.symfony.com](https://ux.symfony.com) 별도 빌드 없이 사용 가능한 UI
    컴포넌트 (Stimulus랑 Turbo 사용)
  - autowiring & autoconfiguration: yaml 설정 없이도 알잘딱 붙음, 물론
    어트리뷰트도 활용 가능
    ```php
    <?php
    class ChannelBroadcaster
    {
      public function __construct(
        #[AutowireIterator(ChannelInterface::class)
        private iterable $channels
      ) {
      }
    }
    ```
  - 다양한 개발도구 지원: `dd()`, `dump()`, 에러페이지, 디버그 툴바,
    `bin/console debug:router, debug:autowiring` 등등
  - 쉽게 설정 가능한 앱: `%env(...)%`로 동적 환경변수 설정, 시크릿 관리,
    워커모드, 컴파일, SymfonyCloud
- 단독 컴포넌트: 엄청 많음. [문서 참조](https://symfony.com/packages)
  - **Messenger**: 메시지 버스 + 큐 시스템. 비동기 잡, CQRS, 이벤트 관리
    - Doctrine, RabbitMQ, Redis 등과 잘 동작
  - **HttpClient**: 비동기, 스트리밍 가능 재시도, 캐시, 프로파일러, SSE 지원
    안정성, 실패 안전성, Interoperable (이식성)
  - JSONStreamer: `json_encode`/`json_decode`와 다르게 스트림 가능
  - ObjectMapper: DDO 작성 돕는
  - Twig 확장: 쉽게 twig 헬퍼 연결 가능
  - Console 확장: 어트리뷰트로 쉽게 정의 가능

이외에도 최신 PHP 기능에도 잘 동작하고 PHP에 기여를 많이 한다, 문서화도 많이
신경 쓴다, 큰 규모의 건강한 커뮤니티가 잘 운영되고 있다는 등 이야기로 정리했다.

행사 디스코드에서 누가 Symfony 직장 잡기 힘들지 않냐고 푸념했는데 자기네는
Symfony만 엄청 뽑는다며 온갖 유럽 국가 이름이 쏟아졌다.

# Building MCP Servers With PHP - Marcel Pociot

LLM이 어떻게 MCP 서버를 활용해서 서비스에 접근하는지 설명하고
[php-mcp/server](http://github.com/php-mcp/server)를 사용해서 MCP 서버를
작성하는 예제를 선보였다.

- [Tinkerwell](https://tinkerwell.app/): REPL 도구
- [Expose](https://expose.dev/): 로컬 터널링, ReactPHP 사용
- [Laravel Herd](https://herd.laravel.com/)
- MCP (Model - Context - Protocol)
  - LLM이 MCP 서버를 통해 컨텍스트를 이해
  - 컨텍스트 타입
    - MCP 클라이언트(예를 들면 JetBrains IDE, Claude Desktop)에서 처리할 수 있는
      타입들
    - tools, resources, prompts, sampling 
  - JSON-RPC 프로토콜로 MCP 클라이언트-서버 소통
    - 사용 가능한 Transports: 표준 입출력 (stdio), Server-Sent Events (SSE), 웹소켓
  - e.g. claude에 정의해서 사용하기
    [@automattic/mcp-wordpress-remote](https://github.com/Automattic/mcp-wordpress-remote)
- MCP 직접 만들기: 많은 패키지 있지만 여기서는
  [php-mcp/server](http://github.com/php-mcp/server) 사용
  ```bash
  composer require php-mcp/server
  ```
  ```php
  <?php
  namespace App\MCP;
  
  use PhpMcp\Server\Attributes\McpTool;
  use App\Models\DownloadStatistic;

  class FetchDownloads
  {
    /**
     * Retrieve the number of Herd downloads.
     *
     * @return int The number of downloads.
     */
    #[McpTool(name: 'fetch_downloads')]
    public function count(): int
    {
      return DownloadStatistic::count();
    }
  }
  ```
  ```php
  #!/usr/bin/env php
  <?php
  declare(strict_types=1);
  require_once __DIR__ . '/vendor/autoload-php';

  use PhpMcp\Server\Server;
  use PhpMcp\Server\Transports\StdioServerTransport;

  try {
    $server = Server::make()
      ->withServerInfo('My MCP Server', '1.0.0')
      ->build();
    $server->discover(
      basePath:__DIR__,
      scanDirs: ['app/MCP'],
    );
    $transport = new StdioServerTransport();
    $server->listen($transport);
    exit(0);
  } catch(\Throwable $e) {
    fwrite(STDERR, "[MCP SERVER CRITICAL ERRPR]\n" . $e . "\n");
    exit(1);
  }
  ```
  ```json
  // claude_desktop_config.json
  {
    "mcpServers": {
      "php-mcp": {
        "command": "php",
        "args": [ "/path/to/mcp-server.php" ]
      }
    }
  }
  ```
- `McpResource`로 리소스 정의 제공 가능

# How AI Is Changing the Tech Industry - [Cheuck Ting Ho](https://cheuk.dev/)

- 바이브코딩은 죄악이 아니지만 무책임한 코딩은 죄악임
- LLM을 활용하는 워크플로우: 액션 플랜 수립/수행하고 결과를 평가하기
- 개인정보와 사용 동의 유의하기, AI의 응답에 비판적으로 접근, 맞는 내용인지
  확인하기, 저작권 유의하기, AI 사용하는 것에 대해 정직하기, AI 책임감 있게
  사용하기

# Laravel: Q&A With Its Creator - Taylor Otwell

- 엔터프라이즈 닷넷, COBOL으로 개발 경력 시작, 당시 환경적으로 쉽게 사용할 수
  있던 PHP를 사이드로 사용하다가 자연스럽게 프레임워크로 성장했고 그게 라라벨의
  시작점이라고.
- php 5.3에서 중요한 현대적 기능이 소개된 덕분에 시너지를 얻어 라라벨이 큰
  성장을 할 수 있었다고 (5.3의 네임스페이스, 익명함수, 지연 바인딩 등, 5.4의
  traits 등)
- 라라벨에서 쉽게 해결할 수 있는 대부분의 문제는 솔루션이 존재. 새로운 무언가를
  만들어내는 일에서 어려움을 느끼지만 그래도 때가 되면 자연스럽게 새로운 것이
  도출되는 경험을 함.
- 서버리스에 대한 생각은 서버를 전혀 고려하지 않고도 개발할 수 있는, 어디
  로그인해서 뭘 생성하고 하는 것 조차도 숨길 수 있으면 좋겠다고 생각하는 편.
  아직도 Laravel Forge에서는 많은 부분을 알고 있어야 하는 상황이긴 하지만 최대한
  쉽고 간단하게 사용할 수 있도록 하기 위해 노력하고 있음 (Laravel Nightwatch는
  이 날 발표된 프로젝트)
- 1인 기업으로 시작했지만 2024에는 10여명 규모였고 지금은 70여명 규모로 성장.
  (개발 외에도 디자인, 마케팅, 운영 등) 다양한 커뮤니티, 중소규모, 대기업
  엔터프레이즈까지 지원하기 위해 노력하고 있음.
- FrankenPHP에 긍정적. 라라벨에서도 적극 돕고 있음.
- PHP는 오래 사용되어 왔기 때문에 AI, LLM에서도 라라벨이나 PHP 코드를 잘 작성함.
  MCP 등 로컬 환경에서 PHP를 잘 작성할 수 있도록 가장 최신 명세를 제공하고 최근
  버전에서 사용하고 있는 코딩 규칙을 사용할 수 있게 하는 실험이 진행중.
- 심포니를 프레임워크로 직접 사용한 적은 없지만 컴포넌트를 많이 사용하고 있음.
  PHP는 성숙하고 잘 관리되고 있는 두 프레임워크 덕분에 좋은 생태계가 조성됨.
- 교육에 관해:
  - PHP 쉽게 시작할 수 있도록 [php.new](https://php.new/) 개발에 관여. 어떤
    환경에서든 쉽게 설치 가능.
  - 라라벨 부트캠프를 새로운 도구/프레임워크에 맞게 업데이트 진행중.
  - 입문자가 쉽게 읽고 사용할 수 있는 문서화에 집중.
- API 구축에 촛점을 둔 Lumen이 있었는데 더이상 지원하지 않고 라라벨 11에서 기본
  파일 구조를 대폭 줄였음. 프로젝트 생성에서 `--api`를 사용하면 블레이드 등 API
  구축에서 불필요한 부분을 간소화. Lumen에서 얻은 교훈은 가벼운 구조에 집중한
  프레임워크지만 규모가 커지면 결국 라라벨에 있는 기능이 필요해질 때가 있는데
  그걸 지원하는게 오히려 더 복잡한 구현을 야기한다는 점을 배움.

# The Future of PHP Education - Jeffrey Way, Povilas Korop, Kevin Bond

[Laracasts](https://laracasts.com/)의 Jeffery Way,
[LaravelDaily](https://laraveldaily.com/)의 Povilas Korop,
[SymfonyCasts](https://symfonycasts.com/)의 Kevin Bond가 PHP 교육에 관한 패널
토의를 진행했다.

- 과거의 학습 방식과 비교하면 근래 교육 환경은 많이 변화되었음. 무엇보다도 AI
  도구들이 즉각적인 피드백을 제공한다는 점에서 입문자 수준의 질문은 거의
  사라지고 고급 주제의 질문이 늘어남.
- 컨텐츠 소비에 있어 긴 코스보다 짧고 핵심적인 영상을 선호. 교육자의 입장에서는
  길게 자세히 가르쳐야 할지, 아니면 짧고 빠르게 접근해야 할지 고민이 됨.
- 입문 수준의 컨텐츠는 여전히 중요하지만 접근 방식과 매체를 달리해야 함. 짧은
  튜토리얼, 실무 워크플로우, 문제 해결 중심.
- PHP 언어 자체에 대한 부정적인 인식은 분홍 코끼리 효과, 즉 분홍 코끼리를
  떠올리지 말라는 말에 분홍 코끼리를 먼저 떠올리는 것과 같은 효과가 있음. PHP
  자체를 홍보하는 접근보다 Laravel이나 Symfony와 같은 실용적인 도구를 중심으로
  관심을 유도하는 것이 오히려 효과적.

# PHP Foundation: Growing PHP for the Future - Roman Pronskiy, Gina Banyard

PHP 재단에 대한 개괄적인 이야기와 현재 무엇이 진행되고 있는지를 설명했다.

- 재단 출범 이전의 역사적 배경
  - 1998 PHP3 리부트: 확장 아키텍처를 완전히 재작성
  - 2000 PHP4 객체 모델: 불완전한 객체지향 프로그래밍 지원
  - 2004 PHP5: Zend Engine 2로 제대로 된 객체지향 프로그래밍 지원
  - 2007-2010 PHP6: 결국 완료되지 못하고 폐기됨
  - 2014 PHP7 이전 성능 문제: HHVM의 상승세
  - 2021 지속가능성 문제: 펀딩 없음, 유급 개발자는 한 명 남음, 불투명한 미래,
    규모 있는 커뮤니티 부재
    - JetBrains 및 여러 회사와 함께 The PHP Foundation를 시작하게 됨
    - 언어가 지속될 수 있도록 펀딩 모델과 예산, 잘하는 메인테이너 확보
- 개발인력 10명, 보드 멤버 8명, 커뮤니티 맴버
- 2024년 독일 정부에서 펀딩을 받아 중요 프로젝트 수행
  - 코드 전체에 대한 보안 감리 수행 및 완료
  - FPM 테스팅
  - 문서화 개선 (+ 보안 리뷰)
  - PECL 재작업 (packagist, 보안 향상 및 새 인스톨러 PIE 개발)
  - 새로운 기능들
    - lazy objects, property hooks, asymmetric visibility, BCMath
    - 많은 RFC, 재단에서 업데이트 및 지속 지원
  - 재단 내에서의 프로젝트 외에도 커뮤니티 기여가 상당히 많아짐
  - 유럽 연합 집행위원회의 사이버 복원력법(Cyber Resilience Act) 워킹 그룹에
    회원으로 참여
- 2025년 목표: 파트너십과 마케팅, 커뮤니티 성장 및 언어 향상
  - FrankenPHP도 재단에서 지원
  - 현재 재단에서 개발중인 기능들
    - BC Math 최적화
    - XSSE 라이브러리 (streaming SIMD Extensions) API (ARM 관련인듯)
    - 새 `URI` API: WhatWG, RFC 3986 명세 지원
    - PIE (PHP Installer for Extensions) 확장 설치를 위한 인스톨러
      - 발표 당일 첫 안정 버전 출시 v1.0
    - 꼬리 호출 관련 구현 (개념 증명)
    - 패턴 매칭
    - SAPI 테스팅 프레임워크
    - 내장 JSON Schema 지원
    - 새로운 DateTime API
    - Windows용 php 빌더
    - PIE 확장 개발을 위한 GitHub Action flow
    - 리눅스 패킷 필터링
    - 인터페이스 수준에서의 제한적인 추상 제네릭 타입 (개념 증명)

