---
title: 인지과학개론 노트
author: haruair
type: page
date: "2022-01-12T12:53:11.239Z"
lang: ko
url: /intro-cog-sci/
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
