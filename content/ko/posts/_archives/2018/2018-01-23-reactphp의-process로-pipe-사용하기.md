---
title: ReactPHP의 Process로 pipe 사용하기
author: haruair
type: post
date: "2018-01-23T10:47:14"
history:
  - 
    from: https://www.haruair.com/blog/4146
    movedAt: 2018-09-13T22:02:42+00:00
lang: ko
slug: using-pipe-with-reactphp-process
tags:
  - 개발 이야기
  - childprocess
  - pipe
  - reactphp

---
ReactPHP의 [child-process][1] 패키지를 사용하면 손쉽게 pipe를 사용할 수 있다. 아래 명령을 코드로 전환한다고 생각해보자.

```bash
$ cat app.php | wc -l
```

수작업으로 `proc_open` 열어서 pipe를 받아 `fread`, `fwrite` 해도 되지만 코드가 복잡해진다. ReactPHP를 사용하면 Child Process에 구현된 pipe로 데이터를 전달할 수 있다.

먼저 필요한 의존성을 추가한다.

```bash
$ composer require react/event-loop react/child-process react/stream
```

예시 코드는 다음과 같다.

```php
<?php

use React\EventLoop\Factory;
use React\ChildProcess\Process;
use React\Stream\ReadableResourceStream;
use React\Stream\WritableResourceStream;

// 이벤트 루프를 먼저 생성
$loop = Factory::create();

$catProc = new Process('cat hello.txt');
$wcProc = new Process('wc -l');

// 최종 결과를 표준출력으로 표시하기 위해 스트림을 추가
$stdout = new WritableResourceStream(STDOUT, $loop);

$catProc->start($loop);
$wcProc->start($loop);

// cat의 출력을 wc의 입력으로, wc의 출력을 표준 출력으로 pipe함
$catProc->stdout->pipe($wcProc->stdin);
$wcProc->stdout->pipe($stdout);

$loop->run();
?>
```

여기서의 pipe 예시는 간단해서 오히려 명령어를 직접 적는게 낫겠다.

```php
<?php
// ...
$countProc = new Process('cat hello.txt | wc -l');
// ...
```

보다시피 위 예시는 매우 단순하다. 하지만 xmodem 프로토콜 등으로 전송하는 경우에는 [파일 전송 명령][2]과 터미널의 입출력을 서로 연결하는 식으로 작성해야 한다. 예전에는 이런 프로토콜이 터미널 도구 자체에 내장되어 있어서 쉽게 전송할 수 있었다고 한다. 다음처럼 입출력 스트림을 양쪽으로 pipe하면 전송이 가능하다.

```php
<?php
// ...

$hose = new Process('hose 192.168.0.10 2000');
$sx = new Process('sx -k -v /foo/bar.bin');

$hose->start($loop);
$sx->start($loop);

$hose->stdout->on('data', function($chunk) use ($hose, $sx) {
    // 복사 초기화 명령을 전송
    $hose->stdin->write("\n");
    $hose->stdin->write("copy xmodem: flash:bar.bin\n");

    // 두 프로세스의 입출력을 연결
    $hose->stdout->pipe($sx->stdin);
    $sx->stdout->pipe($hose->stdin);
});

// xmodem에서는 stdin/stdout으로 파일을 전송하기 때문에 stderr에 현재 전송 상태를 출력함
$sx->stderr->on('data', function($chunk) {
    echo $chunk;
});

// 전송이 완료되면 해당 프로세스가 종료되고 메시지를 출력
$sx->on('exit', function($exitCode) {
    echo "Process exited with code {$exitCode}." . PHP_EOL;
});

$loop->run();
```

xmodem은 1977년에 개발되었다고 한다. 프로젝트에서 41년 된 파일 전송 프로토콜을 사용해보게 될 줄은 생각도 못했다.

 [1]: https://github.com/reactphp/child-process
 [2]: https://linux.die.net/man/1/sz