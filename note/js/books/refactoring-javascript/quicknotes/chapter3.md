# Chapter 3 Testing

> The main purpose of testing is to have _confidence_ in your code.

- Feedback loop: The gap between writing code and knowing if it is correct. A "tight" or "small" feedback loop is good. (vs, loose or long one) Because you know right away when your code is functioning as expected.
- Mocking and stubbing: These are both ways of avoiding directly exercising a function, by replacing it with a dummy version. The difference between the two is that mocking creates an _assertion_(pass/fail part of a test), whereas stubbing does not.

and the reasons why you need to do the testing.

## The many ways of testing

3 stages: setup, assertion, teardown.

- Manual Testing
- Documented Manual Testing
- Approval Tests (setup and teardowns are automated, but assertion is manual)
- End-to-End Tests
- Unit Tests
- Nonfuncitonal Testing (Performance, Usability, Play, Security, Accessibility, Localization)
- Feature tests
- Regression tests
- Characterisation tests

A Guide for Private functions: Following "Code to an innterface, not an implementation", but sometimes need testing for these functions cause of "code confidence." e.g. randomness.

## Tools and processes

### Processes for Quality

- Coding standards and style guides
- Developer happiness meeting
- Pair programming
- Code review
- TDD (Remember! Red, Green, Refactor)

### Tools for Quality

- Version control
- Test frameworks
- Assertion/expectation syntax libraries
- Domain-specific libraries (DB Adapters, web drivers, etc.)
- Factories and fixtures
- Mocking/Stubbing libraries
- Build/Task/Packaging tools
- Loaders and Watchers
- Test run parallelizers
- Continuous Integration (CI) Services
- Coverage reporters
- Style checkers a.k.a. linters
- Debuggers and loggers
- Staging/QA Servers

Check out Mutation Testing.

