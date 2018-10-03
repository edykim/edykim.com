# Chapter 1 What is refactoring?

## How do you guarantee that behaviour does not change?

- testing: Red, Green, Refactor
- version control

> 'Mechanics' of the refactoring: steps of altering code that minimise unsafe states.

Not primary concern:

- Details of implementation: Cares Input and Output only. If you cares too much, it becomes an environment test rather than application test.
- Unspecified, Untested Behaviour: Anyone cannot refactor the code before test exists. We won't able to verify that the behaviour doesn't change.
- Performance: "Write for humans first." Behaviour comes first before performance.

## What is the point of changing the code if the behaviour doesn't change?

> The point is to improve quality while preserving behaviour.

- Balancing quality and Getting Things Done
- Quality
  - Principles: SOLID, DRY, KISS, GRASP, YAGNI
  - Metrics: coverage, complexity, etc.
  - Human readability (balance warning!)

EVAN: Author made one using his own name which is awesome.

- Extact funcitons and modules to simplify interfaces
- Verify code behaviour through tests
- Avoid impure functions when possible
- Name variables and functions well

Testing is foundation of gradual improvement. Refactoring to safely change code but not behaviour, in order to imporve quality.

### Refactoring as Exploration

> Refactoring also helps build confidence in coding generally, as well as familiarity with what you are working on.

> You will learn a lot by writing tests and moving in small steps, but that's not always the easiest or most fun and liberating path to exploration.

> Changes to the underlying details of implementation should not break tests.

