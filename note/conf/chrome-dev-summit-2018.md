# Chrome Dev Summit 2018

## Day 1 Keynote

https://www.youtube.com/watch?v=zPHyxvPT0gg

chrome://dino

270 milion times per month

Site isolation

HTTPS for all traffic (Not Secure more stronger)

V8

optimize mordern js, wasm

welcome from "vintage code"

- AV1: royalty-free codec
- webp

The cost of javascript

- Lighthouse
- PageSpeed Insights
- CrUX

Performance Budgets
Preact?
300k e.g. based on budgets

Example: Pinterest
mobile web first, PWA

wayfair performance portal

- Web Packaging via signing
- Portals: iframe-like element but you can access the page from the outside

Squoosh.app

- web assembly
- background service worker
- PWA

New features

- Offscreen Canvas
- Worklets: new background thing
- Virtual Scroller: Smooth scroller for huge dataset
- Scheduler: How to spend the time

Devices

- Background audio (spotify)
- Desktop PWA
- input API (4 keyboards and controllers)
- PiP feature
- WebAuthN, PayPal: integrated with device

web-platform-tests project

web.dev

Resources, playground, lighthouse integration

get.dev

serviceworkies.com
PWA Mastery Game

Project VisBug

https://github.com/GoogleChromeLabs/ProjectVisBug

---

# Get Down to Business: Why the Web Matters

Reliable, fast 4G is still a privilege

Instant loading experiences for everyone.

The web meets user expectations on mobile.

# Unlocking the power of the web

How Spotify went from 0 to 100 real quick

@mrizzo10

## Friction

Millions of potential users were failing to play music because of app download friction. Was this friction inhibiting our growth potential?

Storage space is small. In Brazil, many of our users have less than 1GB of space free on their phone. App downloads are a large commitment from a storage-conscious user.

Awareness. If you've never used Spotify before, why would you go through the process of downloading a new app to hear a song? especially if you have no space left on your phone.

## Start small

First test was simple to build. Let visitors play one track on web before download app.

Day one plays increased by 25%.

A/B testing. Download app vs optional mobile web.

- Media Session API
- PWA install (add to home screen)
- Protected content

## Huge growth driver

- 54% increase in day one plays
- 14% increase in day 60 active users
- 30% of logins from churned users

## No cannibalization

When users had access to a mobile web experience, they were more likely to download the app.

30% of mobile web users went on to download the native app.

# Meeting customers where they are

Bringing the Starbucks app to the web

@davidbrunelle

Customer Reach. 6,000,000 more monthly active users than iOS native app.

Ofline support: Slow cellular networks, no cell signal, airport WiFi, Capitve Wifi portals. (Yes starbucks can be vary)

Caching: Service worker, workbox, indexeddb, precaching, runtime caching

## Focus on perf basics first

Less code, Caching, Image Optimization

## Better Sign In

PWA is indistinguisable from native apps
Core function is 2 taps away

Thoughtful animations
Accessibility treated as a priority

[Starbucks Pattern Library](https://www.starbucks.com/developer/pattern-library)

Reusable react components

Over 25% of all orders come from desktop browsers

65% increase in starbucks rewards registrations via the web

# We've shipped, now what?

@zackargyle

How can you fight performance entropy?

Performance budgets

3 Matric approaches: Logging, Alerting, Prevention

Measuring the changes and recognise the difference.

+103% weekly users, +300% session duration

Low-bandwidth areas

+300% weekly users, +600% Pins seen

Performance has directly impacted the company's bottom line.

https://goo.gl/YDoFNd

## Three things

- Spotify: Get more users, reduce friction
	- Activation: 54% increase in day one plays
	- Retention: 14% increase in day 60 active users
- Starbucks: Meet users where they are, Use workbox caching strategies
  - 65% increase in number of customers joining Starbucks Rewards via the web
- Pinterest: Focus on performance, Seta performance budget
	- 600% increase in number of Pins seen - has positively impacted Pinterest's revenue.

# State of the Union: Speed Tooling

https://www.youtube.com/watch?v=ymxs8OSXiUA&index=3&list=PLNYkxOF6rcIDjlCx1PcphPpmf43aKOAdF

@paul\_irish @egsweeny






