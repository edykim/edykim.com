---
title: MS PowerShell에서 텔레그램 메시지 전송하기
author: haruair
uuid: "88b1f93d-6272-4c83-87a4-05e84484bb58"
type: post
date: "2016-07-08T13:46:50"
history:
  - 
    from: https://www.haruair.com/blog/3664
    movedAt: 2018-09-13T22:02:42+00:00
lang: ko
slug: sending-telegram-messages-in-ms-powershell
headline:
  - 웹페이지를 가공해서 텔레그램 메시지 보내기, Windows의 강력한 내장 쉘인 파워쉘을 이용하는 방법
tags:
  - 개발 이야기
  - powershell

---
얼마 전에 Windows 환경이 필요해 lubuntu 설치해서 사용하던 노트북을 Windows 10으로 전환했다. 이 노트북은 32GB eMMC 내장이라 사실 공간이 엄청 부족한 편이다. Windows 10을 설치하고 나니 5GB만 남아서 Visual Studio는 설치할 엄두조차 내지 못했다. 때마침 Microsoft PowerShell이 정말 좋다는 이야기를 계속 들었던 것이 생각나서 잠깐 살펴보게 되었다. 이런 강력한 쉘이 Windows에 기본 내장인걸 이제야 알았다는 게 분할 정도로 많은 기능이 기본으로 제공되고 있었다. 그래서 몇 가지 간단한 도구를 공부 삼아 만들어봤고 정말 만족스러웠다.

<img src="/resources/live.staticflickr.com/8/7287/28094262431_05df2d93d9_o.webp?w=660&#038;ssl=1" style="max-width: 800px; width: 100%;" alt="PowerShell Website" class="aligncenter" />

Microsoft PowerShell은 Windows XP 이후로 꾸준히 탑재된 명령행 쉘로 .Net Framework으로 개발된 스크립트 언어가 내장되어 있다. 이전에도 JScript나 VBScript가 있었지만 쉘과 연동하기 어려운 문제와 보안 등의 이유로 인해 문제가 계속 제기되었고 그 대안으로 개발된 것이 이 PowerShell이다. .Net Framework과 연동해 다양한 기능을 제공하는 cmdlet과 스크립트, 기본 함수 등은 정말 이 파워쉘 하나만 갖고도 수많은 작업을 쉽게 처리할 수 있을 정도로 탄탄하며 세세하면서도 넓은 영역의 기능을 제공하고 있다. PowerShell Gallery라는 별도의 모듈 관리자도 존재한다. 심지어 dll을 불러서 호출하는 것도 가능하기 때문에 스크립트 언어가 제공하는 기능에 제한받지 않는다는 점이 인상적이다. 너무 자랑만 한 것 같아서 단점은 Windows에서만 제대로 돌아간다는 정도<sup id="fnref-3664-1"><a href="#fn-3664-1">1</a></sup>가 아닐까 싶다. 😛

이 포스트에서는 Microsoft PowerShell을 사용해서 간단한 스크립트를 작성해보고 어떤 방식으로 동작하는지, 얼마나 간편한지 확인(및 영업)을 하려고 한다. 다음은 이 포스트에서 살펴보게 될 내용이다.

  * 텔레그램 봇을 생성하고 토큰 발급하기
  * 텔레그램 봇의 정보를 API로 확인하기 (getMe, getUpdates)
  * 봇 API의 token과 사용자의 chat_id를 설정 파일로 분리하기
  * 웹페이지 호출한 다음 결과물 가공하기
  * 텔레그램 봇 API로 메시지 전송하기
  * 새 메시지만 전송하도록 메시지 비교하고 csv로 저장하기

이 글에서 필요한 준비물은 다음과 같다.

  * PowerShell 구동 가능한 Windows 환경
  * 메신저 서비스인 텔레그램(telegram) 계정

전체 코드는 [haruair/ps-telegram-message][1]에서 확인할 수 있다.

## 텔레그램 봇 생성하기

텔레그램 봇을 생성하려면 [@BotFather][2] 계정에 대화를 신청해서 쉽게 생성할 수 있다. [telegram.me/BotFather][2] 링크를 누르거나 @BotFather를 직접 검색해서 추가한다. 봇을 생성하면 이 봇을 사용할 때 넣어야 하는 API 토큰을 발급해주는데 모바일에서는 컴퓨터로 복사하기 불편할 수 있다. [텔레그램 웹][3]에서 생성하면 편리하다.

@BotFather에게 `/newBot`을 입력하면 새로운 봇 이름과 봇 계정명을 순서대로 입력하라고 안내한다. 순서대로 입력하고 나면 API 토큰과 해당 봇 링크를 알려준다.

<img src="/resources/live.staticflickr.com/8/7508/28138173196_8ed5ea9481_o.webp?w=400&#038;ssl=1" class="aligncenter" alt="botfather" />

이 토큰을 이용해서 API를 사용하는 방법은 [Telegram Bots][4]에서 자세히 확인할 수 있다. (참고로, 위 이미지의 API 토큰은 더이상 동작하지 않는다.)

## 텔레그램 봇 정보 확인하기

앞에서 생성한 토큰을 사용해서 텔레그램 봇에 정상적으로 접근할 수 있는지 확인하려 한다. 파워쉘은 `ps1`이라는 확장자를 사용한다. `status.ps1`라는 파일을 다음 내용으로 작성한 후에 저장한다.

```
$response = Invoke-WebRequest -Uri "https://api.telegram.org/bot<API 토큰>/getMe"
echo $response.RawContent
pause
```

[텔레그램 봇 API의 getMe 메서드][5] 주소로 요청을 보내는 코드를 작성했다.

이 코드에서 `Invoke-WebRequest` 라는 함수를 확인할 수 있다. 이런 함수는 PowerShell 환경에서만 사용할 수 있도록 구현된 함수로 Cmdlet으로 부른다. (Command-let으로 읽는다.) [`Invoke-WebRequest` cmdlet][6]은 HTTP, HTTPS, FTP 또는 FILE 프로토콜로 웹페이지나 웹서비스에 요청을 보낼 수 있는 기능을 제공한다. 이 함수가 반환한 `HtmlWebResponseObject` 개체를 `$response`에 저장했다.

`Invoke-WebRequest`에서 오류가 발생하면 포스트 마지막에 있는 문제 해결을 참고한다.

2행에서 `echo`를 사용해서 `$response`의 `RawContent` 프로퍼티를 출력한다. `echo`는 `Write-Output` cmdlet의 축약 표현이다.

파워쉘을 실행하면 결과를 처리하고 바로 창이 닫힌다. 3행의 `pause`로 엔터 키를 입력하기 전까지 창이 닫히지 않게 된다. 이후의 코드에서는 별도로 표기하지 않으니 언급이 없으면 코드 마지막 행에는 `pause`가 있다고 생각하자.

파일을 더블 클릭으로 열면 설정에 따라 메모장으로 열릴 수도 있다. 파일에서 오른쪽 클릭 후 **PowerShell에서 실행 (Run with PowerShell)**을 클릭한다. 이 저장한 파일을 실행하면 다음처럼 출력되는 것을 확인할 수 있다.

파워쉘 명령행에서 실행했을 때 오류가 발생하면 이 포스트의 문제 해결 부분을 참고한다.

    HTTP/1.1 200 OK
    Connection: keep-alive
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Methods: GET, POST, OPTIONS
    Access-Control-Expose-Headers: Content-Length,Content-Type,Date,Server,Connection
    Strict-Transport-Security: max-age=31536000; includeSubdomains
    Content-Length: 98
    Content-Type: application/json
    Date: Fri, 08 Jul 2016 09:50:00 GMT
    Server: nginx/1.10.0
    
    {"ok":true,"result":{"id":2775591989,"first_name":"webscrapbot","username":"haruair_webscrap_bot"}}
    
    Press Enter to continue...:
    

응답 헤더와 json 형식의 응답 내용을 확인할 수 있다. `pause`로 인해 창이 닫히지 않고 엔터를 입력하면 그제서야 닫힌다.

```
$info = Invoke-RestMethod -Uri "https://api.telegram.org/bot<API 토큰>/getMe"
echo $info.ok
```

이 코드에서는 앞과 다르게 `Invoke-RestMethod` 라는 함수를 확인할 수 있다. [`Invoke-RestMethod` cmdlet][6]은 REST 웹서비스를 호출하고 그 반환된 결과를 구조화된 데이터로 사용할 수 있는 기능을 제공한다. 별도의 라이브러리 없이 간편하게 REST 호출이 가능할 정도로 기본적으로 제공하는 기능이 다양하다.

앞에서 확인한 코드에서는 `HtmlWebResponseObject`를 반환해서 `RawContent` 프로퍼티로 접근할 수 있었던 반면에 `Invoke-RestMethod`는 `PSCustomObject`를 반환한다. 그래서 JSON 개체를 쉽게 프로퍼티처럼 접근해서 사용할 수 있기 때문에 편리하다. 2행의 `$info.ok`는 앞에서 확인했던 응답 내용과 같이 `true`를 반환한다.

앞 응답 내용에서 first_name, username처럼 `result` 내에 있는 데이터는 어떻게 확인할 수 있을까? 다음과 같은 코드를 추가하면 쉽게 확인할 수 있다.

```
$info = Invoke-RestMethod -Uri "https://api.telegram.org/bot<API 토큰>/getMe"

if ($info.ok) {
    echo $info.result | Format-List
}
```

`$info.ok`가 참이면 `$info.result`의 내용을 출력한다. 여기서 `|` 기호를 사용해서 `Format-List`를 추가했다. 코드를 실행하면 다음과 같은 결과를 확인할 수 있다.

    id         : 2775591989
    first_name : webscrapbot
    username   : haruair_webscrap_bot
    

`|` 기호 즉, 파이프라인(pipeline)은 다른 쉘에서도 쉽게 볼 수 있는 기능으로 파워쉘도 동일하게 지원한다. 이 파이프라인을 사용하면 순서대로 앞 결과를 뒤 명령에서 입력으로 사용한다. 위 코드에서는 `$info.result`를 `Format-List`의 입력으로 사용하게 된다. 파워쉘에서는 결과를 보기 쉽게 목록으로 변환하는 [`Format-List`][7]를 제공한다. 이 cmdlet도 `fl`로 줄여 쓸 수 있다. 비슷하게 `Format-Table`은 표로 변환하며 특정 양식으로 변환할 수 있는 `Format-Custom`도 있다.

지금까지 텔레그램에 등록한 봇을 API로 접근할 수 있다는 점을 확인했다. 이제 텔레그램에 메시지를 전송하기 전에 사용자의 chatId를 알아내야 한다. 이 chatId를 알아내려면 어떻게 해야 할까? 봇이 받은 메시지를 확인하면 그 메시지를 보낸 사용자의 chatId를 찾을 수 있다. 받은 메시지는 [getUpdates 메서드][8]를 사용해서 확인 가능하다. 다음 코드를 추가해보자.

```
$updates = Invoke-RestMethod -Uri "https://api.telegram.org/bot<API 토큰>/getUpdates"

if ($updates.ok) {
    $updates.result | Select-Object -expandProperty message | Select-Object -expandProperty from text | Format-Table
}
```

앞에서 본 내용과 거의 비슷하다. `Select-Object` cmdlet은 개체 또는 개체의 프로퍼티에서 필요한 부분만 선택하는 기능을 제공한다. 이 cmdlet과 함께 사용한 `-expandProperty` 매개 변수는 특정 프로퍼티의 내용을 확장해서 데이터를 처리할 수 있게 한다. 각 파이프 별로 잘라서 실행해보면 그 변화를 확인할 수 있다. 이처럼 파이프라인은 여러 결과를 이어서 사용할 수 있으며 마지막 cmdlet으로 `Format-Table`을 사용해 표 형식으로 출력했다.

앞과 다르게 `echo`를 입력하지 않았다. `echo` 없이 작성해도 넣고 작성한 것과 동일한 결과가 나온다.

이제 이 코드를 실행해보면 빈 표가 출력되거나 에러가 발생한다. 그 이유는 봇과 텔레그램을 통해 메시지를 전송한 적이 없기 때문이다. 스팸 문제 때문인지 이 chatId는 실제로 해당 봇과 대화를 한 적이 있는 경우에만 얻을 수 있다. 텔레그램 봇 생성하기에서 받은 봇 링크(http://telegram.me/<생성한 Bot ID>)를 클릭한 다음에 `/start` 또는 아무 내용이나 메시지를 작성해서 전송한다. 전송한 다음에 스크립트를 실행하면 다음과 같은 결과를 확인할 수 있을 것이다.

```
       id first_name last_name username  text  
       -- ---------- --------- --------  ----  
138389563 Edward     Kim       haruair   /start
138389563 Edward     Kim       haruair   Hello
```

결과에서 확인할 수 있는 것처럼 내 chatId는 138389563이다. 이 chatId를 사용하면 봇이 나에게 메시지를 전송하게끔 할 수 있다.

지금까지 작성한 `status.ps1`을 정리하면 다음과 같다.

```
$info = Invoke-RestMethod -Uri "https://api.telegram.org/bot$($config.token)/getMe"

if ($info.ok) {
    echo $info.result | Format-List
}

$updates = Invoke-RestMethod -Uri "https://api.telegram.org/bot$($config.token)/getUpdates"

if ($updates.ok) {
    $updates.result | Select-Object -expandProperty message | Select-Object -expandProperty from text | Format-Table
}
pause
```

## 설정 파일 분리하기

Bot API를 호출할 때 사용하는 토큰과 chatId는 별도의 설정 파일로 분리하면 깔끔하게 사용할 수 있다. `config.json` 파일을 생성하고 다음처럼 내용을 작성한다. 각 항목은 내용에 맞게 입력한다.

```json
{
    "token": "<API 토큰>",
    "chatId": "<메시지를 받을 chat_id>" 
}
```

이 json 파일을 사용하도록 `status.ps1`을 다음 코드를 추가한다.

```
$config = Get-Content .\config.json | ConvertFrom-Json
```

[`Get-Content` cmdlet][9]은 파일 내용을 불러온 후에 `ConvertFrom-Json` cmdlet에게 그 내용을 전달한다. [`ConvertFrom-Json`][10]는 JSON을 개체로 변환해서 `$config`에 저장한다.

이제 토큰은 `$config.token` 식으로 접근해서 사용할 수 있다. 이제 코드를 수정해보자. 파워쉘의 문자열 내에서는 `$(변수)` 형식으로 문자열 보간(String Interpolation)이 가능하다. 여기까지 진행한 `status.ps1`은 다음과 같다.

```
$config = Get-Content .\config.json | ConvertFrom-Json

$info = Invoke-RestMethod -Uri "https://api.telegram.org/bot$($config.token)/getMe"

if ($info.ok) {
    echo $info.result | Format-List
}

$updates = Invoke-RestMethod -Uri "https://api.telegram.org/bot$($config.token)/getUpdates"

if ($updates.ok) {
    $updates.result | Select-Object -expandProperty message | Select-Object -expandProperty from text | Format-Table
}

pause
```

`Get-Content`를 사용할 때 주의해야 하는 점은 기본 인코딩이 따로 지정되어 있지 않다는 부분이다. 인코딩을 지정하지 않아도 큰 문제가 되지 않는 범위의 내용을 저장한다면 문제가 없지만 한글은 제대로 불러오지 못한다. 그래서 `-encoding` 매개 변수를 이용해서 `utf8`로 불러오면 문제 없이 불러올 수 있게 된다. 다음 코드를 참고하자.

```
$config = Get-Content .\config.json -Encoding utf8 | ConvertFrom-Json
```

## 웹페이지 호출한 다음 결과물 가공하기

이제 본격적으로 메시지를 통해 보낼 데이터를 가공하려고 한다. `message.ps1`을 생성해서 다음 내용을 작성한다.

```
$haruair = Invoke-WebRequest -Uri "http://haruair.com/blog/"
$titles = $haruair.ParsedHtml.getElementsByTagName("h2") | Where-Object { $_.className -eq "entry-title" }
$links = $titles.getElementsByTagName("a") | Select-Object innerText, href
```

1행에서는 <http://haruair.com/blog/> 페이지의 내용을 `Invoke-WebRequest` cmdlet으로 가져왔다. 이 페이지에는 여러 포스트가 한번에 출력된 목록 페이지로 각각의 제목과 링크를 가져와서 메시지를 보내는데 활용하려고 한다.

2행은 `ParsedHtml` 프로퍼티에 접근한 다음에 `getElementsByTagName` 메서드를 사용해서 포스트 제목에 해당하는 엘리먼트인 `<h2>`를 선택했다. 그 다음에 파이프라인을 이용해서 [`Where-Object` cmdlet][11]으로 넘겼고 html 엘리먼트의 클래스명을 기준으로 필요한 제목만 선택했다. `Where-Object`는 개체 컬렉션에서 특정 프로퍼티의 값을 사용해 개체를 선택할 수 있는 cmdlet이다. `Where` 또는 `?`로 표기할 수 있다.

이제 제목 엘리먼트에서 제목과 해당 포스트로 이동할 링크를 찾을 차례다. 3행을 보면 선택한 `<h2>` 엘리먼트에서 `<a>`를 다시 선택한 후에 앞에서 봤던 `Select-Object`를 활용해서 엘리먼트 내용과 링크만 선택한 다음 `$links`에 반환했다.

## 텔레그램 봇 API로 메시지 전송하기

이제 텔레그램으로 메시지를 전송하려고 한다. `message.ps1`에 다음 내용을 추가한다.

```
foreach ($link in $links) {
    $message = "New Post! $($link.innerText) $($link.href)"
    $encodedMessage = [System.Web.HttpUtility]::UrlEncode($message)
    $info = Invoke-RestMethod -Uri "https://api.telegram.org/bot$($config.token)/sendMessage?text=$encodedMessage&chat_id=$($config.chatId)"
}
```

`$links`를 `foreach` 문으로 반복했다. `$message`에 전송할 메시지를 작성했다.

3행에서는 지금까지 보지 못했던 특이한 문법이 존재한다. [_System.Web.HttpUtility_][12]는 .Net Framework에 포함된 클래스로 URL을 인코딩 또는 디코딩 하는 메서드를 제공한다. 파워쉘에서는 .Net의 클래스와 메서드를 직접적으로 사용할 수 있다. 여기서는 `[System.Web.HttpUtility]::UrlEncode`를 사용해서 메시지를 인코딩했다.

4행은 [API의 `sendMessage` 메서드][13]를 사용해서 메시지와 메시지를 받을 chat_id를 전달했다.

지금까지 작성한 `message.ps1`을 종합하면 아래 코드와 같다.

```
$config = Get-Content .\config.json -Encoding utf8 | ConvertFrom-Json

$haruair = Invoke-WebRequest -Uri "http://haruair.com/blog/"
$titles = $haruair.ParsedHtml.getElementsByTagName("h2") | Where-Object { $_.className -eq "entry-title" }
$links = $titles.getElementsByTagName("a") | Select-Object innerText, href

foreach ($link in $links) {
    $message = "New Post! $($link.innerText) $($link.href)"
    $encodedMessage = [System.Web.HttpUtility]::UrlEncode($message)
    $info = Invoke-RestMethod -Uri "https://api.telegram.org/bot$($config.token)/sendMessage?text=$encodedMessage&chat_id=$($config.chatId)"
}
```

이 파일을 실행하면 메시지가 잘 전달되는 것을 확인할 수 있다. 하지만 스크립트를 실행 할 때마다 글이 전송된다. 이전에 전송한 글은 전송하지 않게 하려면 어떻게 해야 할까?

## 메시지 비교하고 csv로 저장하기

파워쉘은 `Import-Csv`와 `Export-Csv` cmdlet으로 손쉽게 CSV를 다룰 수 있다. 또한 개체를 비교하는 `Compare-Object` cmdlet을 사용해서 항목을 비교할 수 있고 `SideIndicator` 프로퍼티로 비교 결과를 확인할 수 있다.

`Import-Csv` cmdlet이 존재하지 않는 파일을 불러오려고 할 때는 오류가 발생한다. 파워쉘도 [try catch finally][14]문법을 지원한다. 코드에서는 .Net Framework의 _System.IO.FileNotFoundException_로 catch하는 것을 확인할 수 있다.

아래는 최종적인 `message.ps1` 코드 내용이다.

```
$config = Get-Content .\config.json -raw -encoding utf8 | ConvertFrom-Json

$haruair = Invoke-WebRequest -Uri "http://haruair.com/blog/"
$titles = $haruair.ParsedHtml.getElementsByTagName("h2") | Where-Object { $_.className -eq "entry-title" }
$links = $titles.getElementsByTagName("a") | Select-Object innerText, href

try {
  $oldLinks = Import-Csv .\data.csv
}
catch [System.IO.FileNotFoundException] {
  $oldLinks = @()
}

$diff = Compare-Object $oldLinks $links -property innerText, href | Where-Object { $_.SideIndicator -eq '=>' }
$measure = $diff | Measure-Object

if ($measure.Count -ne 0) {
  foreach ($link in $diff) {
    $message = "New Post! $($link.innerText) $($link.href)"
    $encodedMessage = [System.Web.HttpUtility]::UrlEncode($message)
    $info = Invoke-RestMethod -Uri "https://api.telegram.org/bot$($config.token)/sendMessage?text=$encodedMessage&chat_id=$($config.chatId)"
  }

  $links | Export-Csv .\data.csv -Encoding utf8
}
```

[`Measure-Object`][15]는 개체의 수를 셀 때 사용한다. `measure`로 줄여서 사용할 수 있다. 위 코드에서는 다소 장황하게 사용했는데 다른 방식으로 작성하는 방법도 존재한다. 아래 코드처럼 [`ForEach-Object` cmdlet][16]도 사용할 수 있다. `ForEach-Object`의 축약은 `%`로도 줄여서 사용 가능하다. 가장 간단한 방법은 괄호를 이용한 마지막 방법이다.

```
$measure = $diff | Measure-Object
if ($measure.Count -ne 0) {
    // do something
}

if (($diff | Measure-Object | ForEach-Object { $_.Count }) -ne 0) {
    // do something
}

if (($diff | measure | % { $_.Count }) -ne 0) {
    // do something
}

if (($diff | measure).Count -ne 0) {
    // do something
}
```

이제 `message.ps1`을 실행하면 `data.csv`에 파일이 생성되고 새 글이 올라오지 않는 경우에는 메시지를 전송하지 않는다. `data.csv`를 열어보면 개체 목록이 csv로 변환된 내용을 확인할 수 있다. 모든 과정이 끝났다. 필요에 따라서 `message.ps1`을 Windows 작업 스케줄러를 사용해 반복적으로 호출하면 최신의 업데이트 상황을 수시로 확인해서 메시지로 전송받을 수 있다.

<img src="/resources/live.staticflickr.com/8/7281/28172339985_217d47feb4_o.webp?w=600&#038;ssl=1" class="aligncenter"  />

위 스크린샷에서 메시지를 전송 받은 결과를 볼 수 있다.

* * *

## 문제 해결

스크립트를 작성하고 구동하는 과정에서 겪은 문제를 정리했다.

### 실행 정책 ExecutionPolicy

파워쉘 스크립트를 파워쉘 명령행에서 실행하면 다음과 같은 에러가 출력된다.

    .\status.ps1 : File W:\path\to\status.ps1 cannot be loaded because running scripts is disabled on this system. For more information, see about_Execution_Policies at 
    http://go.microsoft.com/fwlink/?LinkID=135170.
    At line:1 char:1
    + .\message.ps1
    + ~~~~~~~~~~~~~
        + CategoryInfo          : SecurityError: (:) [], PSSecurityException
        + FullyQualifiedErrorId : UnauthorizedAccess
    

서명되지 않은 스크립트 파일은 보안상 기본적으로 실행할 수 없다. 현재 실행 정책은 `Get-ExecutionPolicy`로 확인할 수 있고 `Set-ExcutionPolicy` cmdlet으로 조정할 수 있다. 기본 정책은 _Restricted_인데 다음 명령을 사용하면 정책 수준을 낮출 수 있다.

```
Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser
```

테스트를 모두 완료한 다음에는 보안을 위해 다시 원래대로 돌려놓도록 하자.

```
Set-ExecutionPolicy -ExecutionPolicy Restricted -Scope CurrentUser
```

높은 정책 수준에서도 실행 가능하게 하려면 스크립트에 서명을 하는 방법이 있고 제한적인 용도라면 직접 서명(Self-Signing)을 하는 것도 가능하다.

### Invoke-WebRequest 오류

`Invoke-WebRequest`은 Windows에 내장된 Internet Explorer를 내부적으로 참조한다. 그래서 Internet Explorer를 단 한 번도 실행한 적이 없다면 다음과 같은 메시지가 출력된다.

    Invoke-WebRequest : The response content cannot be parsed because the Internet Explorer engine is not available, or Internet Explorer's first-launch configuration is not complete. Specify the UseBasicParsing 
    parameter and try again. 
    At W:\path\to\status.ps1:4 char:6
    + $response = Invoke-WebRequest -Uri "https://api.telegram.org/bot$($config.token ...
    +      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        + CategoryInfo          : NotImplemented: (:) [Invoke-WebRequest], NotSupportedException
        + FullyQualifiedErrorId : WebCmdletIEDomNotSupportedException,Microsoft.PowerShell.Commands.InvokeWebRequestCommand
    

IE를 한 번 켰다 끄면 해결 된다.

* * *

간단하게 텔레그램을 통해 메시지를 전송하는 스크립트를 파워쉘에서 작성했다. 여기서 다룬 파워쉘의 기능도 극히 일부에 불과하다. 2006년에 출시해서 무려 9년 넘는 기간 동안 성숙해 온 파워쉘은 타입 지원, 클래스 등 쉘 스크립트 답지 않게 폭넓은 기능을 제공한다. 더 자세히 보고 싶다면 [MSDN PowerShell][17]에 있는 글이 많은 도움이 될 것이다. 윈도 환경에서 개발을 한다면 꼭 파워쉘을 살펴보도록 하자. 😀

<li id="fn-3664-1">
  Mono 기반의 구현인 <a href="https://github.com/Pash-Project/Pash">Pash</a>도 있다. 조만간 dotnet core 기반의 구현도 나오지 않을까 기대된다.&#160;<a href="#fnref-3664-1">&#8617;</a> </fn></footnotes>

 [1]: https://github.com/haruair/ps-telegram-message
 [2]: https://telegram.me/BotFather
 [3]: https://web.telegram.org
 [4]: https://core.telegram.org/bots
 [5]: https://core.telegram.org/bots/api#making-requests
 [6]: https://technet.microsoft.com/ko-kr/library/hh849971.aspx
 [7]: https://technet.microsoft.com/ko-kr/library/hh849957.aspx
 [8]: https://core.telegram.org/bots/api#getupdates
 [9]: https://technet.microsoft.com/ko-kr/library/hh849787.aspx
 [10]: https://technet.microsoft.com/ko-kr/library/hh849898.aspx
 [11]: https://technet.microsoft.com/ko-kr/library/hh849715.aspx
 [12]: https://msdn.microsoft.com/ko-kr/library/system.web.httputility.aspx
 [13]: https://core.telegram.org/bots/api#sendmessage
 [14]: https://technet.microsoft.com/ko-kr/library/hh847793.aspx
 [15]: https://technet.microsoft.com/ko-kr/library/hh849965.aspx
 [16]: https://technet.microsoft.com/ko-kr/library/dd347608.aspx
 [17]: https://msdn.microsoft.com/en-us/powershell