---
title: 인지과학개론 노트
author: haruair
type: page
date: "2022-01-12T12:53:11.239Z"
lang: ko
url: /intro-cog-sci/
tags:
  - test
  - test2
  - test3
---

[Introduction to Cognitive Science 실라버스](https://perception.yale.edu/Brian/courses/IntroCogSci-Syllabus.pdf) 따라서 리딩 읽고 요약/정리.

# Related

- [Yale Perception & Cognition Lab](https://perception.yale.edu/)

# Readings

## An Introduction to Your Mind

리딩 없음.

## Foundations of Cognitive Science

#### [Bisson (1991), “They’re made out of meat” (Omni)](https://www.mit.edu/people/dpolicar/writing/prose/text/thinkingMeat.html)

외계인이 인간에 대해 얘기하는 SF.

### [Marcus et al. (2014), “How to study the brain” (Chronicle of Higher Education)](https://www.chronicle.com/article/how-to-study-the-brain/)

[(구글 캐시)](http://webcache.googleusercontent.com/search?q=cache:https://www.chronicle.com/article/how-to-study-the-brain/&strip=1&vwsrc=0)

현재까지의 뇌 연구 정리와 한계점 논의.

- 한계
  - 복잡도가 매우 높아서 연관성 파악에 어려움
    - 세포 단위 기능 파악의 한계: 860억개 뉴런과 수 조의 상호 연결
    - 수영하는 모습을 본 물고기의 반응: 뇌세포 반응이 시신경인지, 움직임 감지인지, 따라서 수영하려는 것인지 구분 불가
  - 가설 검증의 어려움
    - 인간 대상 실험 불가
    - 특정 부분의 뇌가 특정 행동을 담당한다는 것도 낡은 이론
    - 언어를 담당하는 뇌를 절제해도 언어 기능 회복하는 경우가 있었음
    - 뇌는 계속 변화하고 적응함
  - 이론 연구는 실험 연구에 비해 펀딩이 어려움
- 어려움에도 불구하고 계속 연구 되어야 함

### [Carandini (2012), “From circuits to behavior: A bridge too far?”](https://www.nature.com/articles/nn.3043.pdf)

[(Semantic Scholar)](https://www.semanticscholar.org/paper/From-circuits-to-behavior%3A-a-bridge-too-far-Carandini/de02b93c9fc2a022046ece1ae6bc59464e4314d0)

- 신경과학은 신경망이 어떻게 인식, 생각, 행동을 야기하는지 연구하는 분야
- 아직 신경망과 행동의 연관성이 명확하게 정의되진 않음
- 연구의 어려움과 목표:
  - 뇌 대신 랩탑을 연구한다고 가정. 모델마다, 회사마다 다른 랩탑. 회로도 다 다름. 결국 입력과 출력을 연구하는데 비지니스 프로그램 입출력과 게임 입출력은 당연히 다를 것.
  - 운영체제와 연산 언어의 대한 연구로 소프트웨어와 하드웨어의 연결 고리를 알 수 있음. 그런 적당한 수준 연구가 필요. (너무 세세한 것, 너무 광범위한 것 피하기)
- 최근 연구 성과: 표준적인 신경 연산 코어 세트가 존재. 뇌 전역에 걸쳐 반복, 조합되어 다른 문제를 해결.
  - 표준 연산
    - 선형 필터링과 제산 정규화 linear filtering, divisive normalization와 같은 표준 신경망 연산이 존재. 이 두 조합으로 인간 광학 감지 표준 모델도 만들 수 있음.
    - 다른 연산 예시: thresholding, exponentiation, recurrent amplification, associative learning rules, cognitive spatial maps, coincidence detection, gain changes resulting from input history and cognitive demands, population vectors, constrained trajectories in dynamical systems
    - 이런 연산은 생물물리와 직접 연관이 없는 경우도 있음: 추상화된 기능이라서 세포 지역이나 종에 따라 다른 구성으로 동일한 기능을 구현
  - 한계: 기능은 파악하더라도 그 위에서 무엇이 연산되고 있는지 이해하는데 어려움
- 질문을 구분: 무엇이 연산되는가 vs. 어떻게, 왜 연산되는가. -> 세부 구현을 알 필요가 있는가
- 개선된 기술로 더 많은 정보를 얻을 수 있게 됨. 이해하기 위한 이론 필요.
  - e.g. Hodgkin and Huxley's model of the action potential: 화학적 표현 대신 전자기판 비유. 생물 하드웨어.
  - e.g. Marr's connectome. 뉴런 연결 지도 연구.
    - 한계: 마이크로프로세서의 기능을 배선표만 보고 판단할 수 있을까
    - 다른 접근: simulome. 뇌 전체를 분석하면 이해에 도움이 될지도 -> 별로 좋은 결과 못보고 있음
- 신경망과 행동 사이는 간격이 커서 연결해주는 중간 단계가 분명 존재. 새 기술, 연구, 이론으로 일반 연산과 행동을 이해할 수 있을 것.

## Crossed Wires (Brain Damage and the Architecture of the Mind)

### [Rafal (2001), “Bálint’s syndrome”](https://www.google.com/books/edition/Handbook_of_Neuropsychology_Volume_4/8qywq48-sl8C?hl=en&gbpv=1&pg=PA121&printsec=frontcover)

발린트 증후군

- 후두엽 측면 손상으로 인해 정면에 있는 것만 인지하고 주변을 전혀 인지하지 못함. (앞 뒤로 물건이 있으면 앞에 있는 물건만 인지)
- 인지한 것에 대해 위치를 판단하거나 잡거나 하지 못함. (물건이 나타났다 사라짐)
- 이 증후군이 있는 환자를 대상으로 시각 인지 연구.
- 시각 인지에서의 의미 (p. 134):
  - attention selects from object-based represenatations of space
  - There are independent neural mechanisms, which operate in parallel, for orienting attention within objects and between objects.
  - The candidate objects on which attention operates are generated preattentively by early vision in the absence of explicit awareness.
  - Attention is involved in affording explicit (conscious) access to spatial representations needed for goal-directed action and for binding features of objects.

### [Sacks (2004), “Speed” (New Yorker)](https://www.newyorker.com/magazine/2004/08/23/speed-5)

시간에 대한 인식 연구, 약간 가십성 기사.

- Albert Heim (1892): 왜 생사를 가르는 상황에서 시간은 느리게 느껴지는가?
- Russell Noyes and Roy Kletti 연구 (1970년대): 생각의 속도가 급격하게 빨라진 탓에 경험의 속도는 상대적으로 느려짐
- Christof Koch: 연속적인 상황을 더 많은 프레임으로 나눠 판단하게 돼서
- William James (1890): 약물에 의한 꿈 속 시간 관념 왜곡
- Beth Abraham hospital: 극단적인 파킨슨 경우, 시간에 대한 관념이 아예 멈춰버림

## What’s Within? (How Nature Supports Nurture)

### [Bouchard (2008), selection from “Genes and human psychological traits”](https://www.google.com/books/edition/The_Innate_Mind/WoA8DwAAQBAJ?hl=en&gbpv=1&pg=PA69&printsec=frontcover)

유전적 다양성은 개인의 특질에 중대한 영향이 있으므로 인간 행동 분석에 꼭 필요한 부분. 다만 주변 환경 등 통제 및 관측이 어려운 부분이 있기 때문에 양적 유전학적 접근 방식을 사용.

- 특질의 유전적 변이는 생물학적/진화적 관련성이 없다는 의미가 아님
  - 인간 행동의 이해 -> 왜 사람은 모두 닮았지만 서로 차이가 있을까?
  - 자연 선택에서는 가장 적합한 것이 생존하는 것이 아니라 적당히 적합하면서도 운이 좋은 것들이 생존
  - 변이도 다양성을 보장하지만 적합성을 높이는 쪽으로는 잘 나타나지 않음
  - 적응(adaptation)은 자연 선택에서 환경 요인을 해석하기 위해 고안됨 (유기체의 내적/외적 정보)
    - 적응의 예시: 언어
    - 개인의 어휘량은 지적 능력을 측정에 사용. 유전성이 높은 특질 중 하나. (_g 팩터_)
- 현대 양적 유전학적 접근 방법의 역할
  - 예시: 농경혁명 (지난 몇 세기 동안 농산물 생산량이 비약적 발전)
  - 양적 유전학은 멘델의 유전학을 다유전자성과 함께 일반화함
  - 쌍둥이 연구: (동일|다른) 유전자 + (동일|다른) 환경
    - 식물 연구에서는 통하는 방법이었지만 동물 행동 연구에는 안통함 (Boake et al., 2002)
    - 대신 새를 대상으로 한 유전성 높은 특질 연구에서는 성격 연관성을 찾음
  - 양적 유전학적 연구의 장점
    - 공평성: 환경이나 유전적 설명에 치우치지 않음
      - 특정 종교적 믿음에 대한 유전성은 낮지만 종교적인 성향은 유전성 높음 (Bouchard et al. 2004)
      - 정당 선호는 유전성이 낮지만 보수주의적 경향은 유전성 높음 (Alford, Funk, and Hibbing, 2005)
      - 이 방식과 달리 특정 행동을 분석하는 연구는 편향이 나타날 가능성이 높음
      - 다수의 다양한 동족을 대상으로한 양적 유전성 모델은 다채로운 유전적, 환경적 영향을 동시에 파악할 수 있음
    - 유연성: 어떤 가설이든 양적 유전학의 언어로 풀어낼 수 있음
      - 이 방식이 비판받는 부분은 모든 양적 연구가 받는 비판과 비슷함
      - 비판을 받는다면 더 나은 연구에 대한 비판이지 연구 방식에 대한 비판은 아님
- 양적 유전학의 제 1 법칙: 거의 모든 종의 대부분의 특징에서 절대적으로 유전성이 없는 경우(0)는 없음.
  - 플린 효과(Flynn effect): 20세기에 들어 IQ가 엄청 높아진 현상
- 인간 지능
  - g 팩터: 지적 능력을 측정.
  - 지능은 유전인가? 계속 연구되는 분야.
    - Bouchard의 IQ 유전성 g 팩터: 평범한 환경의 산업화된 나라에서의 일반 성인은 0.65 ~ 0.80
  - 유전적 영향은 환경적 영향에 희석된다는 연구 결과도 있음
- 성격
  - 지적 능력 측정과 달리 일반적인 성격 단일 팩터는 없음. 대신 여러 모델 존재 (3팩터 모델, 5팩터 모델)
  - 유전적 성격 특질 연구 데이터 (본문 참조)
- 심리적 흥미: 평균 0.40, 환경 영향은 적은 편
- 사회적 태도
  - 특질: 권위주의, 보수주의, 종교성 (각 연구 본문 참조)
- 유전과 환경은 서로 어떻게 상호작용하는가에 대한 연구는 계속 되고 있음
  - 다 흥미로운 부분인데 부가적 유전자 변이도 유전되는 것으로 관측.
- 생물학이나 심리학에서 알려진 현상이 유전적 현상에도 얼마나 연관성이 있는가?
  - 양적 유전학 연구와 사회과학의 연구 결과를 비교
- 행동을 야기하는 유전자를 찾을 수 있는가?
  - 해결 가능한 문제: 시계 유전자 (clockwork genes)
    - 포유류의 생체 주기
    - 연구를 통해 증명됨
  - 해결하기 어려울 수 있는 문제: 옥수수 기름
    - 100 여 년 이상 교잡으로 기름 함유량 높은 품종으로 계량해왔지만 아직도 정확하게 어느 유전자가 이 기름 함유량과 연관되어 있는지 밝혀내지 못함. (이 논문 참여자 10명 중 7명이 몬산토에서 일한다고)
- 분자 유전학이 양적 유전학을 대체할까?
  - 양적 유전학 연구가 오래된 방식이라고 비판받긴 함
  - 시계 유전자 연구처럼 분자 유전학이 유용한 경우도 있음
  - 분자 단위까지 내려가지 않아도 유의한 연구 가능 (멘델의 사례)
  - 과학적으로 흥미로운 이론은 근본적인 원인을 파악하고 환경에 어떻게 영향을 주고 행동까지 연결되는지 알기 위해 특정 분자 단위 원리를 이해하는 것이 중요.
  - 하지만 그렇게 깊이 들어가기 전에 큰 그림을 그리기 위한 양적 유전학적 분석도 중요. 서로 상호보완적으로 필요.

### [Gandhi et al. (2015), “Immediate susceptibility to visual illusions after sight onset”](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4863640/)

후천적으로 시각을 획득한 9명의 어린이(8~16세)를 대상으로 공감각 인식 실험을 수행. 수술 직후 48시간 이내에 공간 위 시각적 착시를 만드는 이미지로 실험. 시각적 착시는 시각적 경험에 따른 개별 학습이 아닌 시각적 처리 메커니즘에서 발생하는 것으로 관측.

### [Sugita (2008), “Face perception in monkeys reared with no exposure to faces”](https://www.pnas.org/content/105/1/394)

원숭이에게 얼굴을 보여주지 않고 사육. 조금씩 다른 사람 사진과 조금씩 다른 원숭이 사진을 보여주니 다 구분함. 한 달 간 사람 얼굴 또는 원숭이 얼굴을 직접 본 후에 동일한 실험을 수행. 얼굴을 본 종만 구분을 잘하고 얼굴 보지 못한 종은 구분을 잘 하지 못함.

- 얼굴 인식은 경험과 무관한 능력이지만 민감한 기간에 접한 얼굴을 통해 익숙한 얼굴을 더 효과적으로 인식하게 됨.

## Pieces of Mind (Modularity and ‘Mental Organs’)

### Carston (1996), “The architecture of mind: Modularity and modularization”

너무 오래된 책이라서.. [(요약본)](http://www.bcp.psych.ualberta.ca/~mike/Pearl_Street/Margin/GREEN/Chap3.html)

