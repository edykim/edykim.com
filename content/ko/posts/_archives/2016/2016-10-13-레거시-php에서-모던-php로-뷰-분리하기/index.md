---
title: 레거시 PHP에서 모던 PHP로 – 뷰 분리하기
author: haruair
uuid: "3ba03c73-abbf-41e4-9a61-fb9f54446e9a"
type: post
date: "2016-10-12T23:30:55"
history:
  - 
    from: https://www.haruair.com/blog/3748
    movedAt: 2018-09-13T22:02:42+00:00
lang: ko
slug: legacy-php-to-modern-php-split-views
headline:
  - 먼 길을 가도 그 시작은 첫 발을 내딛는 일에서, 구렁이 담 넘어가듯 모던 PHP 넘어가기 시리즈.
tags:
  - 개발 이야기
  - composer
  - php
  - view

---
흔히 모던 PHP라고 말하는 현대적인 PHP 개발 방식에 대해 많은 이야기가 있다. 새 방식을 사용하면 협의된 명세를 통해 코드 재사용성을 높이고 패키지를 통해 코드 간 의존성을 낮출 수 있는 등 다른 프로그래밍 언어에서 사용 가능했던 좋은 기능을 PHP에서도 활용할 수 있게 된 것이다. 이 방식은 과거 PHP 환경에 비해 확실히 개선되었다. 하지만 아무리 좋은 개발 방식이라 해도 현장에서 쉽게 도입하기 어렵다. 코드 기반이 너무 커서 일괄 전환이 어렵거나, 이전 환경에 종속적인 경우(mysql_* 함수를 여전히 사용), 새로운 개발 방식을 적용하기 위한 재교육 비용이 너무 크고, 신규 프로젝트와 구 프로젝트가 공존하는 동안 전환 비용이 발생할 수 있다는 점이 걸림돌이 된다. 이런 이유로 사내 정책 상 예전 환경을 계속 사용하기로 결정할 수도 있고, 개개인의 선택에 따라 계속 이전 버전을 사용하는 경우도 있을 것이다. 그 결과, 좋은 개발 방식임을 이미 알고 있지만 마치 다른 나라 이야기처럼 느끼는 사람도 많다.

<figure class="wp-caption aligncenter">

<img src="https://i.giphy.com/xTiTnfNthWH7DWPiKI.gif?w=660" style="width:100%; max-width: 600px;" class="aligncenter" scale="0" /><figcaption class="wp-caption-text"> 

<div>
  A: 팀장님 모던 PHP 도입합시다 +_+
</div>

<div>
  B:
</div></figcaption></figure> 

지금 다니고 있는 회사에서도 모든 코드를 일괄적으로 모던 PHP로 이전할 수 없었다. 가장 큰 문제는 코드란 혼자서만 작성하는 것이 아니며 다른 개발자와의 협업도 고려해야 하기 때문에 구성원 간의 협의가 필요하다. 그래서 일괄적인 도입보다는 점진적으로 코드는 개선해 가면서 새 개발 방식에 천천히 적응하는 방법은 없는지 고민하게 되었다. 작은 코드부터 시작해서 먼저 도입할 수 있는 부분부터 차근차근 도입하기 시작했다. 아직 회사에서 사용하는 대다수의 프레임워크와 CMS가 이전 방식을 기반으로 하고 있기 때문에 100% 모던 PHP를 사용하는 것은 아직 멀었지만, 팀 내에서 작은 크기의 코드인데도 새 방식의 장점과 필요성을 설득하기에 충분한 역할을 할 수 있었다.

<p class="h3">
  레거시 PHP 코드에서 모던 PHP 코드로
</p>

이전 PHP 코드를 사용하면서도 현대적인 PHP를 도입하기 위해 고민하고 있다면 도움이 되지 않을까 하는 생각으로 이렇게 정리하게 되었다. 이 글에서 다루는 내용은 내가 소속된 회사에서도 현재 진행형이다. 즉, 이 글을 따라서 해야만 정답인 것은 아니다. 프로젝트의 수 만큼 다양한 경우의 수가 존재하기 때문에 하나의 방법만 고집할 수는 없다. 이 글이 그 정답을 찾기 위한 과정에서 도움이 되었으면 좋겠다.

먼 길을 가도 그 시작은 첫 발을 내딛는 일에서 시작한다. 이전의 코드 기반에서 여전히 작업하고 있고, 그 코드 양이 너무 많다 하더라도 점진적으로 코드를 개선할 수 있는 방법이 있다. 여기에서 다룰 내용은 모던 PHP를 도입하기 위해 회사에서 작업했던 작은 부분을 정리한 것이다. 코드를 개선하면서 전혀 지식이 없는 구성원도 자연스레 학습할 수 있도록 학습 곡선을 완만하게 만들기 위해 노력했던 부분도 함께 정리해보려고 한다. 가장 먼저 뷰를 분리하는 것에 대해 다뤄보려고 한다.

* * *

# 뷰 분리하기

코드를 분리해서 작성하는 과정은 중요하다. 각 코드가 서로에게 너무 의존적이거나 한 쪽이 다른 한 쪽을 너무 잘 아는 경우에는 코드 재사용도 어렵고 제대로 구동되는지 확인하기도 어렵다. PHP는 언어적인 특징 때문인지 몰라도 뷰 부분이 특히 심하게 붙어있는 모습을 자주 발견할 수 있다.

MVC 패턴을 사용하는 PHP 프레임워크 또는 플랫폼을 사용하는 프로젝트라면 별도로 뷰를 분리하는 노력 없이도 자연스럽게 로직과 뷰를 구분해서 작성할 수 있다. 하지만 여전히 많은 PHP 프로젝트는 `echo`로 HTML 문자열을 직접 출력하거나 `include`를 사용해서 별도의 파일을 불러오는 방식으로 개발되어 있다. 예를 먼저 확인해 보자.

직접 출력하는 방식은 대략 다음처럼 작성되어 있을 것이다.

```php
<?php
// user_list.php
require_once('lib.php');
$config = get_config();
?>
<body>
    <?php
    $session = get_session();
    if (isset($session['user'])) { ?>
        <p><?php echo $session['user']['username'];?>님 환영합니다.</p>
    <?php } else { ?>
        <p>손님 환영합니다.</p>
    <?php } ?>
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>사용자명</th>
                <th>별명</th>
            </tr>
        </thead>
        <tbody>
        <?php
        $users = get_users();
        foreach($users as $user){?>
            <tr>
                <td><?php echo $user['id'];?></td>
                <td><?php echo $user['username'];?></td>
                <td><?php echo $user['nickname'];?></td>
            </tr>
        <?php }?>
        </tbody>
    </table>
</body>
```

이렇게 데이터를 가져오는 부분과 페이지를 출력하는 부분이 뒤범벅되기 쉽다. 이 방식보다는 조금 더 개선된 형태로 `include`를 사용해서 외부 파일을 불러오는 경우도 있다.

```php
<?php
// user_list.php
require_once('lib.php');

$config = get_config();
$session = get_session();
$users = get_users();

include('themes/' . $config['theme_name'] . '/user/list.php');
?>
```

```php
<!--themes/default/user/list.php-->
<body>
    <?php if (isset($session['user'])) { ?>
        <p><?php echo $session['user']['username'];?>님 환영합니다.</p>
    <?php } else { ?>
        <p>손님 환영합니다.</p>
    <?php } ?>
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>사용자명</th>
                <th>별명</th>
            </tr>
        </thead>
        <tbody>
        <?php foreach($users as $user){?>
            <tr>
                <td><?php echo $user['id'];?></td>
                <td><?php echo $user['username'];?></td>
                <td><?php echo $user['nickname'];?></td>
            </tr>
        <?php }?>
        </tbody>
    </table>
</body>
```

이 코드를 보면 앞서 방식보다는 뷰가 분리된 것처럼 보인다. 하지만 이 코드는 뷰를 분리했다기 보다는 두개의 PHP 파일로 나눠서 작성하는 방식에 가깝다.

여기서 살펴본 두 경우는 이전에 작성된 코드라면 쉽게 찾을 수 있는 방식이다. 빠르고 간편하게 작성할 수 있을지 몰라도 재사용성이 높지 않고 관리가 쉽지 않다. 그나마 두 번째 방식은 분리되어 있지만 그렇다고 편리하다고는 할 수 없는 구석이 많다. 왜 이렇게 작성된 코드는 불편한 것일까?

전자의 경우는 외부의 함수를 그대로 사용하고 있어서 뷰의 의존도가 높다. 함수의 반환 값이나 사용 방식이 달라지면 뷰에서 해당 함수를 사용한 모든 위치를 찾아서 변경해야 할 것이다. 그리고 이렇게 생성된 html을 다른 곳에서 다시 사용하기는 쉽지 않다. 이 파일을 다른 파일에서 불러오게 되면 파일 내에 포함되어 있는 모든 기능을 호출하게 된다. 이 파일을 다시 사용하더라도 작성했을 당시의 의도를 바꾸기 어렵다.

그래도 후자의 경우는 뷰가 분리되어 있어서 뷰를 다시 사용하는 것은 가능하게 느껴진다. 하지만 뷰에서 전역 변수에 접근하는 방식으로 데이터에 접근하고 있다. 이런 상황에서는 뷰에서 어떤 변수를 사용하고 있는지 뷰 코드를 들여다보기 전까지는 알기 어렵다. 이런 방식으로 뷰를 재사용하게 되면 해당 파일을 `include` 하기 전에 어떤 변수를 php 내부에서 사용하고 있는지 살펴본 후, 모두 전역 변수로 선언한 다음 `include`를 수행해야 한다.

## 결과를 예측할 수 없는 코드

PHP에서는 결과를 출력하는데 수고가 전혀 필요 없다. 위 코드에서 보는 것처럼 `<?php ?>`로 처리되지 않은 부분과 `echo`를 사용해서 출력한 부분은 바로 화면에 노출되기 때문이다. 이 특징은 짧은 코드를 작성할 때 큰 고민 없이 빠르게 작성할 수 있도록 하지만 조금이라도 규모가 커지기 시작하면 관리를 어렵게 만든다.

앞에서 확인한 예제처럼 작성한 PHP 코드가 점점 관리하기 어렵게 변하는 이유는 바로 **출력되는 결과를 예측하는 것이 불가능하다는 점** 에서 기인한다. (물론 e2e 테스트를 수행할 수 있지만 이런 코드를 작성하는 곳에서 e2e 테스트를 사용한다면 특수한 경우다.) 두 파일에서 출력하는 내용은 변수로 받은 후 출력 여부를 결정하는 흐름이 존재하지 않는다. 전자는 데이터를 직접 가져와서 바로 출력하고 있고 후자는 가져올 데이터를 전역 변수를 통해 접근하고 있다. 개발자의 의도에 따라서 통제되는 방식이라고 하기 어렵다. 오히려 물감을 가져와서 종이 위에 어떻게 뿌려지는지 쏟아놓고 보는 방식에 가깝다. 이전 코드를 사용하는 PHP는 대부분 일단 코드를 쏟은 후에 눈과 손으로 직접 확인하는 경우가 많다. 이는 코드가 적을 경우에 문제 없지만 커지면 그만큼 번거로운 일이 된다. 결국에는 통제가 안되는 코드를 수정하는 일은 꺼림칙하고 두려운 작업이 되고 만다.

<img src="https://i.giphy.com/Mn3N0uOhS5pRK.gif?w=660" alt="페이지를 열기 전까지 알 수 없는 결과물" style="margin: 0 auto; display: block;" />

함수에 대해 생각해보자. 프로그래밍을 하게 되면 필연적으로 함수를 작성하게 된다. 함수는 인자로 값을 입력하고, 가공한 후에 결과를 반환한다. 대부분의 함수는 특수한 용도가 아닌 이상에는 같은 값을 넣었을 때 항상 같은 결과를 반환한다. 수학에서는 함수에 인자로 전달할 수 있는 값의 집합을 정의역으로, 결과로 받을 수 있는 값의 집합을 치역으로 정의한다. 프로그래밍에서의 함수도 동일하게 입력으로 사용할 수 있는 집합과 그 입력으로 출력되는 결과 값 집합이 존재한다. 즉, 입력의 범위를 명확히 알면 출력되는 결과물도 명확하게 알 수 있다는 뜻이다.

<figure>

![](f.png)

<figcaption>수학에서의 함수</figcaption></figure>

뷰를 입력과 출력이 존재하는 함수라는 관점에서 생각해보자. 위에서 작성했던 코드를 다시 보면 `$session`과 `$users`를 입력받고 html로 변환한 값을 반환하는 함수로 볼 수 있다. 함수 형태로 뷰를 사용한다면 뷰에서 사용할 변수를 인자로 사용할 수 있어서 입력을 명확하게 통제할 수 있다. 앞서 본 함수의 특징처럼 이 뷰 함수도 입력에 따라 그 결과인 html을 예측할 수 있게 된다. 다시 말해, 그동안 사용한 뷰를 함수처럼 바꾼다면 입력과 출력의 범위를 명확하게 파악할 수 있게 되는 것이다.

<figure>

![](fphp.png)

<figcaption>php의 뷰 함수</figcaption></figure>

## 뷰 함수로 전환하기

간단하게 뷰를 불러오는 함수를 구현해보자. 파일을 불러오더라도 출력하는 결과를 예측할 수 있도록 만들 수 있다. 다음처럼 `include`로 불러온 내용을 결과로 반환하도록 작성한다.

```php
<?php
function view($template) {
    if (is_file($template)) {
        ob_start();
        include $template;
        return ob_get_clean();
    }
    return new Exception("Template not found");
}
?>
```

출력 버퍼를 제어하는 함수 `ob_start()`, `ob_get_clean()`을 사용해서 불러온 결과를 반환했다. 이 함수를 사용해서 외부 파일을 불러와도 바로 출력되지 않고 변수로 받은 후 출력할 수 있게 되었다.

```php
<?php // templates/helloworld.php ?>
<p>Hello World!</p>
```

이 `helloworld.php` 템플릿을 사용하려고 한다. 다음은 php에 내장되어 있는 `assert()` 함수를 사용한 간단한 테스트 코드다.

```php
<?php // helloworld.test.php

$response = view('templates/helloworld.php');
$expected = '<p>Hello World!</p>';
assert($response === $expected, 'Load a template using view');
```

위 테스트 코드는 `php helloworld.test.php` 명령으로 구동할 수 있다. `$response`와 `$expected`를 비교해서 값이 동일하지 않다면 2번째 인자와 함께 오류를 출력한다.

이 글에서는 별다른 설치없이 테스트를 실행해볼 수 있도록 내장된 `assert()` 함수만 사용할 것이다. 실제로는 이 함수만 사용해서는 제대로 된 테스트를 구성하기 힘들기 때문에 [phpunit][1]과 같은 더 나은 테스트 도구를 사용하기를 권장한다.

이제 불러온 파일이 어떤 값을 갖고 있는지 측정할 수 있게 되었다. 뷰는 최종적으로 `echo` 또는 `print`로 출력하게 된다.

```php
<?php // helloworld.php
require_once('lib.php');

echo view('templates/helloworld.php');
```

이렇게 불러온 php 파일은 함수 내에서 불러왔기 때문에 함수 외부에 있는 전역 변수에 접근할 수 없다. 함수 스코프에 의해 전역 변수로부터 통제된 환경이 만들어진 것이다. 덕분에 외부의 영향을 받지 않는 방식으로 php 파일을 불러올 수 있게 되었다.

이제 뷰 파일 내에서 사용하려는 변수를 뷰 함수의 인자로 넘겨주려고 한다. 넘어온 변수를 해당 php 파일을 불러오는 환경에서 사용할 수 있도록 다음처럼 함수를 수정한다.

```php
<?php
function view($template, $data = []) {
    if (is_file($template)) {
        ob_start();
        extract($data);
        include $template;
        return ob_get_clean();
    }
    return new Exception("Template not found");
}
?>
```

`$data`로 외부 값을 배열로 받은 후에 `extract()` 함수를 사용해서 내부 변수로 전환했다. 새로 작성한 함수를 사용한 예시다.

```php
<?php // templates/dashboard.php ?>
<?php if ( isset($user) ): ?>
<div>Welcome, <?php echo $user['nickname'];?>!</div>
<?php else: ?>
<div>I don't know who you are. Welcome, Stranger!</div>
<?php endif; ?>
```

다음처럼 테스트를 작성할 수 있다.

```php
<?php // dashboard.test.php

$response_not_logged_in = view('templates/dashboard.php');
$expected_not_logged_in = "<div>I don't know who you are. Welcome, Stranger!</div>";

assert($response_not_logged_in === $expected_not_logged_in,
    'Load dashboard without user');

$user = [
    'nickname' => 'Haruair',
];

$response_logged_in = view('templates/dashboard.php', [ 'user' => $user ]);
$expected_logged_in = '<div>Welcome, Haruair!</div>';

assert($response_logged_in === $expected_logged_in,
    'Load dashboard with user');
```

테스트 코드에서 뷰로 출력할 결과를 명확하게 확인할 수 있다는 점을 볼 수 있다. 이 함수를 실제로 사용한다면 다음과 같을 것이다.

```php
<?php // dashboard.php
require_once('lib.php');

$session = get_session();

if ( $session->is_logged_in() ) {
    $user = get_user($session->get_current_user_id());
} else {
    $user = null;
}

echo view('templates/dashboard.php', [ 'user' => $user ]);
```

여기서 사용한 뷰 함수는 간단한 예시로, 뷰를 불러오는 환경을 보여주기 위한 예제에 불과하다. 실제로 사용하게 될 때는 레이아웃 내 다양한 계층과 구성 요소를 처리해야 하는 경우가 많다. 이럴 때는 이 함수로는 부족하며 이런 함수 대신 다양한 환경을 고려해서 개발된 템플릿 패키지를 적용하는 게 바람직하다.

## 템플릿 패키지 사용하기

다양한 PHP 프레임워크는 각자 개성있고 많은 기능을 가진 템플릿 엔진을 사용하고 있다. `Laravel`은 `Blade`, `Symfony`는 `Twig`을 채택하고 있다. 모두 좋은 템플릿 엔진이고, PHP와는 다르게 독자적인 문법을 채택해서 작성하는 파일이 뷰의 역할만 할 수 있도록 PHP 전체의 기능을 제한하고 최대한 뷰 역할을 수행하도록 적절한 문법을 제공한다. 이런 템플릿 엔진을 사용할 수 있는 환경이라면 편리하고 가독성 높은 템플릿 문법을 사용할 수 있다.

프레임워크를 사용하지 않는 환경이라면 이런 템플릿 엔진이 학습 곡선을 더한다는 인상을 받을 수 있으며 같이 유지보수 하는 사람에게 부담을 줄 수도 있다. 이런 경우에는 PHP를 템플릿으로 사용하는 템플릿 엔진을 선택할 수 있다. 사용하는 템플릿이 여전히 PHP 파일과 같은 문법을 사용하면서도 앞에서 작성해본 뷰 함수와 같이 통제된 환경을 제공할 수 있는 패키지가 있다. 여기서는 [Plates][2]를 사용해서 앞에서 작성한 코드를 수정해볼 것이다.

먼저 `Plates`를 `composer`로 설치한다.

```bash
$ composer require league/plates
```

그리고 php 앞에서 `autoload.php`를 불러와 내려받은 plates를 사용할 수 있도록 한다.

```php
<?php // dashboard.php
require_once('vendor/autoload.php');
require_once('lib.php');

// templates을 기본 경로와 함께 초기화
$templates = new League\Plates\Engine('templates');

$session = get_session();

if ( $session->is_logged_in() ) {
    $user = get_user($session->get_current_user_id());
} else {
    $user = null;
}

// 앞서 view 함수처럼 사용
echo $templates->render('dashboard', [ 'user' => $user ]);
```

Plates는 레이아웃, 중첩, 내부 함수 사용이나 템플릿 상속 등 편리한 기능을 제공한다. 자세한 내용은 [Plates의 문서][3]를 확인한다.

## 정리

지금까지 뷰를 분리하는 과정을 간단하게 살펴봤다. MVC 프레임워크처럼 구조가 잘 잡힌 코드를 사용하는 것이 가장 바람직하겠지만, 점진적으로 코드를 개선하려면 여기서 살펴본 방식대로 뷰를 먼저 분리하는 것부터 작게 시작할 수 있다.

뷰 함수 또는 템플릿 엔진을 사용해서 외부 환경의 영향을 받지 않는 독립적인 뷰를 만들 수 있다. 뷰가 결과로 반환되기 때문에 출력 범위를 예측하고 테스트 할 수 있게 된다. 또한 뷰에 집어넣는 값을 통제할 수 있다. 전역 변수 접근을 차단하는 것으로 외부 요인의 영향을 최대한 줄일 수 있다.

그리고 새로운 내용을 배우거나 도입하는데 거리낌이 있는 경우라도 타 템플릿 엔진과 달리 `Plates` 같은 템플릿 엔진은 PHP 로직을 그대로 사용할 수 있기 때문에 상대적으로 자연스럽게 도입할 수 있다.

이상적인 상황을 가정해보면 이 패키지를 composer를 사용해서 설치하는 것으로 새로운 개발 흐름에 조금씩 관심을 갖게 만들 수 있고 새로운 패키지를 도입하는 것에 대해 좋은 인상을 남길 수 있다. 또한 추후에 MVC 프레임워크를 도입해도 뷰를 분리해서 작성하는 방식에 자연스럽게 녹아들 수 있을 것이다.

* * *

글을 리뷰해주신 [chiyodad][4]님, [minieetea][5]님 감사드립니다.

[1]: https://phpunit.de/
[2]: http://platesphp.com/
[3]: http://platesphp.com/templates/
[4]: https://twitter.com/chiyodad
[5]: https://twitter.com/minieetea