---
title: 2015 Global Azure Bootcamp Melbourne 후기
author: haruair
type: post
date: "2015-04-25T23:09:44"
history:
  - 
    from: https://www.haruair.com/blog/2875
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: 2015-global-azure-bootcamp-melbourne-reviews
headline:
  - Azure의 다양한 서비스를 살펴볼 수 있었던 GAB 참가 이야기.
  - 멜번 사는 이야기
tags:
  - 두루두루 IT
  - Azure
  - Azure Bootcamp

---
[2014년에 다녀왔던 Global Windows Azure Bootcamp][1]를 이번에도 다녀왔다. 작년에도 다녀 온 후기를 써야지 하고 쓰질 않았는데 이번엔 잊지 않고 적는다. Microsoft Windows Azure가 Microsoft Azure로 브랜딩이 변경되어 이번 행사명은 Global Azure Bootcamp가 되었다. 오늘 보고 들은 내용을 간단하게 정리한 포스트다. 들으면서 메모한 부분만 있어서 내용이 불친절 할 수 있다. MSDN이 있으면 좋고 없으면 Azure가 제공하는 Free Trial로도 충분히 둘러볼 수 있는 내용이다. GAB는 세계 각 지역에서 진행되고 있는데 아쉽게도 한국에서는 진행되고 있지 않는 것 같다.

함께 참석하기로 했던 모든 분들이 사정이 생겨 혼자만 참석하게 되었다. 9시 쯤 도착해서 [티셔츠 받고][2] 자리에 앉았다. 오늘은 ANZAC 데이라고 참전용사를 추모하는 호주 국경일이라서 키노트 시작 전에 관련 영상과 함께 추모 묵념을 했다.

시작 키노트에서는 간략하게 MS Azure에 대한 설명이 있었다. 현재 17개의 region을 제공하고 있고 region당 16개의 데이터 센터로 구성되어 있다고 한다. 데이터 센터 하나 당 풋볼 경기장, 보잉 747 2대 규모 정도 되어 물리적으로는 60만 대 가량의 서버가 있다고 한다. 현재 Azure에서 제공하는 서비스들을 소개했는데 지난번과 다르게 눈에 띄였던 부분은 Direct Access 였다. Azure의 VM을 사용하면 Azure를 거쳐 일종의 VPN과 같은 형태로 서버에 접속하게 되는데 이 경우 속도 등의 문제가 있었다고 한다. Direct Access는 지역 네트워크 제공자를 통해 지역 데이터 센터에 직접 접근하는 방식을 제공한다고 하는데 다른 곳에서 들어보지 못한 얘기 같아서 기억에 남았다.

그 외에도 다양한 서비스를 소개했는데 자세한 내용이 궁금하면 로드맵을 참고하라고 했고 Azure 관련 자격을 취득하고 싶으면 exam 70-532~4을 확인해보라고 한다. 늘 느끼는 것이지만 Azure 서비스는 전반적으로 브랜드 네이밍이 엉망으로 설명을 듣지 않고서는 정확하게 판단하기 어렵고 비슷한 서비스도 많아 복잡한 느낌이다.

이번 행사는 Developer Track과 IT Pro Track으로 구분해 각각 6개의 세션을 운영했다. 중간 중간 쉬는 시간까지 포함해 9시부터 5시까지 진행되었다. 장소는 Saxons였는데 Wifi가 자꾸 끊겨 인터넷이 연결 되어야만 하는 세션은 계속 새로고침 하고 기다리는 수 밖에 없어 아쉬웠다.

## Azure App Services 1 &#8211; Websites and Mobile Services

깔끔한 새 [azure portal][3]과 함께 진행된 세션으로 Web App과 Azure Mobile App을 만들었다. 이전에는 훨씬 이상한 명칭이었는데 이제는 Web + Mobile 카테고리에서 쉽게 찾을 수 있다. 이 두 서비스는 PaaS로 ASP.Net MVC 프로젝트를 쉽게 올릴 수 있도록 돕는다. Azure Mobile App은 iOS, Android, Windows Mobile 등에서 백엔드로 사용할 수 있는 API를 쉽게 구성할 수 있도록 ASP.Net Web API로 만들어진 기본적인 코드를 제공한다.

Standard 이상의 요금 티어를 선택하면 Deployment Slots, Traffic Routing 등의 기능을 추가적으로 제공한다. 전자는 디플로이 할 수 있는 슬롯을 여러개 제공해 Staging과 Production 환경 구성을 돕는다. 후자는 이 PaaS 접근했을 때 어느 지역으로 연결해야 하는지 설정할 수 있다. 그 외에도 GitHub이나 Bitbucket도 지원하고 여러가지 세세한 설정이 많아져서 많이 편리해졌음을 알 수 있었다. 이 세션을 진행할 때 wifi 사정이 많이 안좋아 실습은 물론 진행까지 더뎌 아쉬웠다.

## Getting started with Azure Operational Insights

[Azure Operational Insights][4]는 예전 Microsoft System Center Advisor 라는 이름으로 제공되던 서비스로 클라우드 기반의 분석 도구다. Windows 환경에서 사용할 수 있는 NewRelic라 볼 수 있는데 과거 System Center Operations Manager(SCOM)으로 확인할 수 있던 자료를 웹에서 바로 확인할 수 있도록 지원한다. MS Monitoring agent로 직접 접속하는 방법이 있고 SCOM 콘솔을 통해 접속하는 방법이 있다고 한다.

App services 2 Logic Apps and API Apps를 들을까 하다가 분석과 관련된 세션이라길래 가서 들었는데 생각과 많이 다르고 잘 알지 못하는 부분이었다.

## Azure Storage Services

데이터를 저장할 수 있는데 사용할 수 있는 서비스인 Azure Storage Service는 Blobs, Tables, Queues, Files 4가지 방식으로 데이터를 저장할 수 있다. 이 4가지를 합쳐 account 당 500TB을 사용할 수 있고 azure 섭스크립션 하나 당 100 account가 허용된다.

  * Blobs: 사진, 음악, 비디오, 문서 등을 저장할 수 있고 여러 blob을 하나의 그룹으로 다룰 수 있도록 지원
  * Tables: noSQL과 같은 Key-value. 행 당 1MB이며 252개의 커스텀 어트리뷰트, 5개의 필수 어트리뷰트 지정 가능
  * Queues: 64KB 크기로 최소 1회 딜리버리를 보장
  * Files: 클라우드 기반 파일 공유 (Preview)

그리고 Document DB도 지원한다. Document-based NoSQL 이란 표현을 처음 들었는데 MongoDB 등이 Document DB라고 한다. 그 외에는 Azure Redis Cache도 지원한다. Azure에서 Storage Services 생성하면 예제 코드를 제공해서 쉽게 사용 가능하다.

누가 발표자에게 IaaS에 직접 설치하는 것에 비해 무엇이 장점인지를 물어봤다. 발표자가 ERP/CRM 관련 개발을 하는데 사용하고 있고 규모가 커져도 느려지지 않고 스케일링이 자유로워서 편리하다고 답변했다. 그 얘기를 듣고 좋은 서비스로 만들어서 괜찮은 API 레퍼를 제공해 사용자가 쉽게 사용할 수 있도록 만든 것은 박수칠 일이긴 하지만, 이 서비스가 아니고서 사용할 수 없는 형태라면, 서비스가 없어지거나 서비스 제약에 닿게 되면 생길 불편함도 염두해야 할 것 같다.

## Building Apps Using Azure Active Directory

Azure Active Directory(Azure AD)를 적용해 만든 프로젝트를 시연했다. Azure AD는 기존에 있던 Active Directory를 온라인, 오프라인, MS에서 제공하는 오피스 365와 같은 클라우드 서비스, Azure AD 인증을 도입한 웹 어플리케이션 등에서 통합적으로 활용할 수 있도록 돕는다. 쉽게 설명하면 요즘 자주 보이는 페이스북 소셜 로그인 같은 기능을 Active Directory의 정보와 함께 사용할 수 있다는 뜻이다.(Single Sign On)

Visual Studio에서 ASP.Net Web Application 프로젝트를 생성하는 마법사에서 `Change Authentication > Organizational accounts`를 선택해 도메인 정보를 입력하면 바로 사용해볼 수 있다. 마법사를 사용하면 Azure AD 설정을 자동으로 생성해줘 기본적인 데이터를 입력하는 수고를 덜어준다. 이 구현은 wsfederation 프로토콜로 인증을 진행한다고 한다. Azure AD와 토큰을 주고 받고 토큰이 오면 사용자 정보를 사용할 수 있도록 바로 만들어준다.

OpenId로도 로그인이 가능하고 필요한 라이브러리는 다음과 같다.

    Microsoft.Owin.Security
    Microsoft.Owin.Security.Cookies
    Microsoft.Owin.Security.OpenIdConnect
    

이 경우는 마법사가 제공하지 않는 방법이라 직접 개발해야 한다. ActiveDirectory 구현은 `Microsoft.Owin.Security.ActiveDirectory`를 활용할 수 있다.

다중 factor 인증도 지원한다. 시연에서는 전화, 문자 인증 두가지 방식을 보여줬는데 Azure AD와 연동도 깔끔한 SDK로 제공한다. 이 과정에서는 암호화를 위한 키를 필요로 했다. 이 기능으로 회원 인증과 같은 서비스를 활용할 수 있지 않을까 싶어 살펴봤는데 다중 factor 인증은 Azure AD 플랜 중 Premium에서만 제공하고 있었다. (사용자 당 $6 USD)

Azure AD의 예제는 [Azure AD Samples 깃헙 페이지][5]에서 확인할 수 있다.

## Azure and Big Data

영화 Manhunt를 소개하면서 세션을 시작했다. 데이터를 수집하고 활용하는 일은 기존에도 있었지만 이전과 같은 접근으로 인사이트를 얻기에는 어렵기 때문에 더 방대하고 세세한 데이터를 수집해 가공/활용하는 방향으로 진화하고 있다고 한다.

최근의 추세는 Lambda Architecture로 데이터를 수집/가공을 한다고 한다. Batch layer, Speed layer, Serving layer 세가지로 구성된 이 아키텍쳐에 각각 필요한 라이브러리를 가지고 문장 분석을 하는 시연을 했다.

  * Batch layer: Storage (Hadoop, Azure Storage), Compute (Hadoop, Spark)
  * Speed layer: Storm, Spark Streaming, Azure stream analytics
  * Serving layer

Map Reduce로 Hortonworks 또는 Cloudera를 사용하는 방법과 HDInsight를 사용하는 방법이 있는데 시연은 HDInsight를 사용했다. HDInsight는 Hadoop as a service로 Azure Blob Storage에 데이터를 저장한다. HBase, Stork, Spark와 호환이 된다고 한다.

전반적인 라이브러리 추세를 다 설명한 덕분에 시간이 모자라 후반 시연은 진행하지 못했다. Hadoop은 많이 성숙했고 요즘은 Spark를 많이 사용한다고 한다.

## IoT in Azure

다른 세션을 들으려고 했다가 자리 옮기기 귀찮아서 그냥 들었는데 재미있었다. Azure Event Hubs를 이용해 데이터를 수집하고 가공하는 것을 시연했는데 실제 사례를 기반으로 설명했다.

호주의 농장에서 트랙터와 같은 대형 장비를 사용하기 위해 오일 탱크를 가지고 있는데 이 탱크의 양을 수집해서 오일을 다시 주문해야 할 때 자동으로 주문하는 시스템을 개발했다고 한다. 호주의 네트워크 커버리지는 해안 지역 위주기 때문에 3G로 바로 전송을 할 수 없는 상황이고 현재로는 스마트폰이 다가가면 Bluetooth LE로 데이터를 수집하고 스마트폰이 3G 가능 지역으로 들어가면 그때 데이터를 클라우드로 올리는 방식으로 구현하고 있다고 한다.

Azure Event Hubs는 위와 같은 대량의 데이터 수집을 위한 이벤트 큐를 제공한다. 퍼블리셔가 허브로 이벤트를 보내면 이벤트를 Partition에 저장한 후 사용자에게 이벤트가 추가되었음을 호출한다. 파티션은 이벤트 규모에 따라 스케일링 할 수 있다. 사용자는 이 허브를 통해 변동값만 받는 형태로 구성되어 있고 허브에 쌓인 이벤트는 GC를 통해 자동으로 정리된다. 즉 허브가 앞에서 본 Batch layer의 Storage를 담당하고 사용자가 Compute를 하게 된다.

사용자의 구현은 event Process host model과 event receiver model로 구현할 수 있고 파티션 당 프로세서가 어떻게 배당되는가에 따라 구분된다. 후자는 각각의 파티션마다 receiver가 있는 형태고 전자는 여러 파티션이 하나의 프로세스에 배당되는 방식이다.

[Event Hubs][6]는 Azure에서 Data Analytics 항목에서 찾을 수 있다.

시연 중에 데이터 시각화에는 [Power BI][7]를 활용했는데 깔끔했다.

## 뒷얘기

작년에 했던 장소에 비해 좁고 Wifi 환경이 별로 좋지 않았다. 시연에 불편할 정도였는데 최소 발표자는 안정적으로 네트워크를 사용할 수 있는 상황을 제공해야 했다. 그래도 발표 사이사이 버퍼로 둔 시간이 커서 시간이 밀리거나 하진 않았다.

모닝티, 점심, 오후 간식 세번을 했는데 각각의 식단에서 글루틴 무첨가, 채식과 할랄 식단을 제공했다. 이제 이런 배려는 당연하게 느껴진다.

이번에도 행운권 추첨을 했는데 잘 모르는 프로그램 라이센스를 받았다. Azure Bootcamp는 항상 뽑히는 것 같은데 다음엔 DDD에서 서피스 프로 같은걸 받았으면 좋겠다. (만족할 줄 모르는 남자.)

[Microsoft Virtual Academy][8]를 대대적으로 홍보하고 있었다. 확실히 MS에서 열심히 밀고 있는 느낌이다. C# 관련 몇 강의를 수강해봤는데 내용도 괜찮고 재미있게 따라갈 수 있었다.

* * *

작년에 살펴본 Azure에 비해 훨씬 깔끔해졌고 세세한 서비스가 많아졌다. 여전히 서비스명이 복잡한 느낌이지만 새 포털에서 사용하면 쉽게 찾아서 사용할 수 있게 많이 개선되었다. AWS에 비해 free tier를 크게 홍보하지 않는게 각각 서비스마다 요금 책정 방식이 다르기 때문인 것 같다. 어떤 서비스는 기본이 무료고 어떤 서비스는 시작부터 비용을 청구해서 그런 것 같은데 Azure Websites나 Azure AD Free 등은 무료로 제공하고 있으니 살펴보는 것도 좋겠다.

다음에도 기회가 있으면 참석하고 싶다. 그때는 Azure도 사용하고 그래서 이것저것 물어볼 부분이 많았으면 좋겠다.

 [1]: https://twitter.com/haruair/status/449662009244545024
 [2]: https://twitter.com/haruair/status/591739068146257920
 [3]: https://portal.azure.com/
 [4]: https://preview.opinsights.azure.com/
 [5]: http://github.com/azureadsamples
 [6]: http://azure.microsoft.com/en-us/services/event-hubs/
 [7]: https://www.powerbi.com/
 [8]: http://www.microsoftvirtualacademy.com/
