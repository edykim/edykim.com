---
title: MS PowerShell 버전과 확장자 ps1
author: haruair
type: post
date: "2016-07-17T12:30:52"
history:
  - 
    from: https://www.haruair.com/blog/3681
    movedAt: 2018-09-13T22:02:42+00:00
lang: ko
slug: ms-powershell-version-and-extension-ps1
tags:
  - 개발 이야기
  - powershell
  - version

---
파워쉘을 가장 처음 접했을 때 확장자에 숫자가 있어서 어떤 의미인지 궁금했는데 오늘 잠시 검색해보고 내용을 정리했다. 먼저 결론을 얘기하면 버전과 상관 없이 `.ps1`이 파워쉘 스크립트의 확장자다.

파워쉘은 이전까지 [Monad Manifesto][1]라는 Windows Command Shell 프로젝트였는데 파워쉘이라는 이름으로 [릴리즈 되면서][2] 이전까지 쉘에서 사용하던 `.msh` 확장자를 `.ps1`으로 변경했다. `.ps`는 포스트스크립트(PostScript)의 확장자로 오랜 기간 동안 사용해왔다. 그래서 `.ps`를 선택할 수 있는 옵션은 아니였던 것으로 보인다. 그리고 버전을 표기하기 위해서 `.ps1` 이라는 확장자를 선택하게 되었다.

하지만 PowerShell의 2 버전을 내면서 1) 1 버전의 스크립트가 2 버전에서 호환된다, 2) 2 버전이 1 버전을 대체한다는 이유로 [`.ps1` 확장자를 그대로 사용하기로 했다][3]. 대신 각 스크립트에서 요구하는 버전을 선언할 수 있도록 `#REQUIRES` 문을 제공하게 되었다. 그 이후로는 그냥 `.ps1`을 아무 고민 없이 사용하게 되었다는 훈훈한 이야기다.

`#REQUIRES`문을 다음과 같이 추가해서 사용할 버전을 지정할 수 있다.

```powershell
#REQUIRES -version 5
```

현재 구동하고 있는 파워쉘보다 높은 버전이라면 다음처럼 오류가 발생한다. (6 버전은 아직 존재하지 않는다. 그냥 큰 숫자를 넣어서 구동한 결과다.)

    .\req.ps1 : The script 'req.ps1' cannot be run because it contained a "#requires" statement for Windows PowerShell 6.0. The version of Windows PowerShell that is required by the script 
    does not match the currently running version of Windows PowerShell 5.0.10586.122.
    At line:1 char:1
    + .\req.ps1
    + ~~~~~~~~~~
        + CategoryInfo          : ResourceUnavailable: (req.ps1:String) [], ScriptRequiresException
        + FullyQualifiedErrorId : ScriptRequiresUnmatchedPSVersion
    

현재 구동하고 있는 파워쉘의 버전은 `$PSVersionTable`에서 확인할 수 있다.

```powershell
PS> $PSVersionTable.PSVersion

Major  Minor  Build  Revision
-----  -----  -----  --------
5      0      10586  122
```

`Get-Host`로 확인할 수 있는 버전은 파워쉘에 접속하는 호스트의 버전을 의미하지 쉘의 버전을 뜻하지 않기 떄문에 주의해야 한다.

만약 상위 호환에 문제가 있는 파워쉘 스크립트를 구동하려면 어떻게 해야 할까? 그런 경우는 PowerShell의 플래그 `-Version`을 이용해서 구동할 수 있다.

    PowerShell -Version 2 .\hello.ps1
    

실제로 구동 결과를 보면 하위 호환이 지원 되는 가장 마지막 쉘로 구동하는 방식이다. `$PSVersionTable`을 출력하도록 확인해보면 1, 2 버전은 2 버전으로, 3 버전 이상은 그냥 현재 버전으로 구동하게 된다.

psh 같은 확장자를 선택했으면 좀 멋지지 않았을까 생각이 든다.

## 더 읽을 거리

  * [Monad Manifesto][1]: 파워쉘의 모태가 된 Monad Manifesto
  * [REQUIRES 문][4]

 [1]: http://www.jsnover.com/Docs/MonadManifesto.pdf
 [2]: https://blogs.msdn.microsoft.com/powershell/2006/04/25/windows-powershell-monad-has-arrived/
 [3]: https://blogs.msdn.microsoft.com/powershell/2007/11/02/ctp-versioning/
 [4]: https://technet.microsoft.com/en-us/library/hh847765.aspx