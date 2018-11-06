---
title: 단일 리포지터리의 장점
author: haruair
type: post
date: 2018-11-05T20:52:00-07:00
lang: ko
slug: advantages-of-monorepos
headline:
  - 단일 리포지터리(monorepos)를 적용하려면 블라블라
categories:
  - 개발 이야기
  - 번역
tags:
  - monorepos
draft: true

---

이 글은 [Dan Luu](https://twitter.com/danluu)의 [Advantages of monorepos](http://danluu.com/monorepo/) 번역입니다.

---

# 단일 리포지터리의 장점

다음 같은 대화를 자주 합니다.

> **누군가**: 페이스북/구글에서 거대한 단일 리포지터리를 사용한다는 얘기 들었어? 뭐임 대체!
>
> **나**: 그래, 엄청 편하겠다. 그럴 것 같지 않아?
>
> **누군가**: 엥 내가 들어본 얘기 중에 가장 황당한 얘기다. 페이스북이나 구글은 단일 리포지터리에 모든 코드를 넣는 게 얼마나 끔찍한 아이디어인지 모르는 건가?
>
> **나**: 내 생각에는 페이스북, 구글에서 일하는 엔지니어도 작은 크기 리포지터리가 익숙할 거야. ([Junio Hamano](http://en.wikipedia.org/wiki/Junio_Hamano)도 구글에서 일하지 않나?) 그리고 여전히 단일 거대 리포지터리를 선호하는데 거기에는 이런 \[이유\]가 있어.
>
> **누군가**: 흠, 그래, 꽤 괜찮은 것 같네. 내 생각엔 여전히 이상하긴 하지만 왜 이런 리포지터리를 원하는지도 이해 할 수 있을 것 같다.

"\[이유\]"는 생각보다 꽤 깁니다. 그러니 같은 대화를 계속 반복하는 것보다 글로 작성해서 이유를 설명하려고 합니다.

## 조직 단순화하기

With multiple repos, you typically either have one project per repo, or an umbrella of related projects per repo, but that forces you to define what a “project” is for your particular team or company, and it sometimes forces you to split and merge repos for reasons that are pure overhead. For example, having to split a project because it's too big or has too much history for your VCS is not optimal.

다중 리포지터리를 사용한다면 일반적으로 프로젝트 당 리포지터리가 있거나 연관된 프로젝트를 기준으로 리포지터리가 있을 겁니다. 하지만 "프로젝트"가 무엇인가에 대한 정의는 어떤 팀 또는 회사에 있는가에 따라 달라질 겁니다. 이런 이유로 리포지터리를 합치거나 분리하게 되는데 이런 작업은 순수하게 부가적인 비용이 됩니다. 어떤 경우에 프로젝트를 분리하게 되는지 예를 들면 프로젝트가 너무 큰 경우, 또는 버전 관리 도구의 히스토리가 너무 많아 최적화가 필요한 경우에 프로젝트를 분리하게 됩니다.

With a monorepo, projects can be organized and grouped together in whatever way you find to be most logically consistent, and not just because your version control system forces you to organize things in a particular way. Using a single repo also reduces overhead from managing dependencies.

단일 리포지터리를 사용하면 논리적으로 일관성을 지키기 위한 어떤 방법을 사용하더라도 프로젝트를 조직화하고 함께 묶을 수 있습니다. 그 이유는 버전 관리 도구가 특정 방식으로 구성하도록 강제하지 않기 때문입니다. 또한 단일 리포지터리를 사용하면 의존성을 관리하는 부하를 줄일 수 있습니다.

A side effect of the simplified organization is that it's easier to navigate projects. The monorepos I've used let you essentially navigate as if everything is on a networked file system, re-using the idiom that's used to navigate within projects. Multi repo setups usually have two separate levels of navigation -- the filesystem idiom that's used inside projects, and then a meta-level for navigating between projects.

조직 단순화의 부수 효과는 프로젝트 간 탐색을 더 쉽게 할 수 있다는 점입니다. 제가 그동안 사용한 단일 리포지터리는 파일 시스템 위에서 

A side effect of that side effect is that, with monorepos, it's often the case that it's very easy to get a dev environment set up to run builds and tests. If you expect to be able to navigate between projects with the equivalent of `cd`, you also expect to be able to do `cd; make`. Since it seems weird for that to not work, it usually works, and whatever tooling effort is necessary to make it work gets done[^1]. While it's technically possible to get that kind of ease in multiple repos, it's not as natural, which means that the necessary work isn't done as often.

## Simplified dependencies

This probably goes without saying, but with multiple repos, you need to have some way of specifying and versioning dependencies between them. That sounds like it ought to be straightforward, but in practice, most solutions are cumbersome and involve a lot of overhead.

With a monorepo, it's easy to have one universal version number for all projects. Since atomic cross-project commits are possible, the repository can always be in a consistent state -- at commit #X, all project builds should work. Dependencies still need to be specified in the build system, but whether that's a make Makefiles or bazel BUILD files, those can be checked into version control like everything else. And since there's just one version number, the Makefiles or BUILD files or whatever you choose don't need to specify version numbers.

## Tooling

The simplification of navigation and dependencies makes it much easier to write tools. Instead of having tools that must understand relationships between repositories, as well as the nature of files within repositories, tools basically just need to be able to read files (including some file format that specifies dependencies between units within the repo).

This sounds like a trivial thing but, [take this example by Christopher Van Arsdale](https://github.com/chrisvana/repobuild/wiki/Motivation) on how easy builds can become:

> [The build system inside of Google](http://bazel.io/) makes it incredibly easy to build software using large modular blocks of code. You want a crawler? Add a few lines here. You need an RSS parser? Add a few more lines. A large distributed, fault tolerant datastore? Sure, add a few more lines. These are building blocks and services that are shared by many projects, and easy to integrate. … This sort of Lego-like development process does not happen as cleanly in the open source world. … As a result of this state of affairs (more speculation), there is a complexity barrier in open source that has not changed significantly in the last few years. This creates a gap between what is easily obtainable at a company like Google versus a\[n\] open sourced project.

The system that Arsdale is referring to is so convenient that, before it was open sourced, ex-Google engineers at [Facebook](https://facebook.github.io/buck/) and [Twitter](https://pantsbuild.github.io/) wrote their own versions of bazel in order to get the same benefits.

It's theoretically possible to create a build system that makes building anything, with any dependencies, simple without having a monorepo, but it's more effort, enough effort that I've never seen a system that does it seamlessly. Maven and sbt are pretty nice, in a way, but it's not uncommon to lose a lot of time tracking down and fixing version dependency issues. Systems like rbenv and virtualenv try to sidestep the problem, but they result in a proliferation of development environments. Using a monorepo where HEAD always points to a consistent and valid version removes the problem of tracking multiple repo versions entirely[^2].

Build systems aren't the only thing that benefit from running on a mono repo. Just for example, static analysis can run across project boundaries without any extra work. Many other things, like cross-project integration testing and [code search](https://github.com/google/codesearch) are also greatly simplified.

## Cross-project changes

With lots of repos, making cross-repo changes is painful. It typically involves tedious manual coordination across each repo or hack-y scripts. And even if the scripts work, there's the overhead of correctly updating cross-repo version dependencies. Refactoring an API that's used across tens of active internal projects will probably a good chunk of a day. Refactoring an API that's used across thousands of active internal projects is hopeless.

With a monorepo, you just [refactor the API and all of its callers](http://research.google.com/pubs/pub41342.html) in one commit. That's not always trivial, but it's much easier than it would be with lots of small repos. I've seen APIs with thousands of usages across hundreds of projects get refactored and with a monorepo setup it's so easy that it's no one even thinks twice.

Most people now consider it absurd to use a version control system like CVS, RCS, or ClearCase, where it's impossible to do a single atomic commit across multiple files, forcing people to either manually look at timestamps and commit messages or keep meta information around to determine if some particular set of cross-file changes are “really” atomic. SVN, hg, git, etc solve the problem of atomic cross-file changes; monorepos solve the same problem across projects.

This isn't just useful for large-scale API refactorings. David Turner, who worked on twitter's migration from many repos to a monorepo gives this example of a small cross-cutting change and the overhead of having to do releases for those:

> I needed to update \[Project A\], but to do that, I needed my colleague to fix one of its dependencies, \[Project B\]. The colleague, in turn, needed to fix \[Project C\]. If I had had to wait for C to do a release, and then B, before I could fix and deploy A, I might still be waiting. But since everything's in one repo, my colleague could make his change and commit, and then I could immediately make my change.
> 
> I guess I could do that if everything were linked by git versions, but my colleague would still have had to do two commits. And there's always the temptation to just pick a version and "stabilize" (meaning, stagnate). That's fine if you just have one project, but when you have a web of projects with interdependencies, it's not so good.
> 
> \[In the other direction,\] Forcing _dependees_ to update is actually another benefit of a monorepo.

It's not just that making cross-project changes is easier, tracking them is easier, too. To do the equivalent of `git bisect` across multiple repos, you must be disciplined about using another tool to track meta information, and most projects simply don't do that. Even if they do, you now have two really different tools where one would have sufficed.

## Mercurial and git are awesome; it's true

The most common response I've gotten to these points is that switching to either git or hg from either CVS or SVN is a huge productivity win. That's true. But a lot of that is because git and hg are superior in multiple respects (e.g., better merging), not because having small repos is better per se.

In fact, Twitter has been patching git and [Facebook has been patching Mercurial](https://code.facebook.com/posts/218678814984400/scaling-mercurial-at-facebook/) in order to support giant monorepos.

## Downsides

Of course, there are downsides to using a monorepo. I'm not going to discuss them because the downsides are already widely discussed. Monorepos aren't strictly superior to manyrepos. They're not strictly worse, either. My point isn't that you should definitely switch to a monorepo; it's merely that using a monorepo isn't totally unreasonable, that folks at places like Google, Facebook, Twitter, Digital Ocean, and Etsy might have good reasons for preferring a monorepo over hundreds or thousands or tens of thousands of smaller repos.

## Other discussion

[Gregory](http://gregoryszorc.com/blog/2014/09/09/on-monolithic-repositories/) [Szorc](http://gregoryszorc.com/blog/2015/02/17/lost-productivity-due-to-non-unified-repositories/). [Face](https://developers.facebooklive.com/videos/561/big-code-developer-infrastructure-at-facebook-s-scale)[book](https://code.facebook.com/posts/218678814984400/scaling-mercurial-at-facebook/). [Benjamin Pollack](http://bitquabit.com/post/unorthodocs-abandon-your-dvcs-and-return-to-sanity/) (one of the co-creators of Kiln). [Benjamin Eberlei](https://qafoo.com/resources/presentations/froscon_2015/monorepos.html). [Simon Stewart](http://blog.rocketpoweredjetpants.com/2015/04/monorepo-one-source-code-repository-to.html). [Digital Ocean](https://www.digitalocean.com/company/blog/taming-your-go-dependencies/). [Goo](http://www.infoq.com/presentations/Development-at-Google)[gle](https://www.youtube.com/watch?v=W71BTkUbdqE). [Twitter](http://git-merge.com/videos/scaling-git-at-twitter-wilhelm-bierbaum.html). [thedufer](http://www.reddit.com/r/programming/comments/1unehr/scaling_mercurial_at_facebook/cek9nkq). [Paul Hammant](http://paulhammant.com/categories.html#trunk_based_development).

Thanks to Kamal Marhubi, David Turner, and Leah Hanson for extensive discussion on this topic. At least half of the ideas here come from them. Also, thanks to Leah Hanson, Mindy Preston, Chris Ball, Daniel Espeset, Joe Wilder, Nicolas Grilly, Giovanni Gherdovich, Paul Hammant, and Simon Thulbourn for finding typos and other mistakes in this post.

[^1]: This was even true at a hardware company I worked at which created a monorepo by versioning things in RCS over NFS. Of course you can't let people live edit files in the central repository so someone wrote a number of scripts that basically turned this into perforce. I don't recommend this system, but even with an incredibly hacktastic monorepo, you still get a lot of the upsides of a monorepo.
[^2]:  At least as long as you have some mechanism for [vendoring upstream dependencies](https://news.ycombinator.com/item?id=10604168). While this works great for Google because Google writes a large fraction of the code it relies on, and has enough employees that tossing all external dependencies into the monorepo has a low cost amortized across all employees, I could imagine this advantage being too expensive to take advantage of for smaller companies.
