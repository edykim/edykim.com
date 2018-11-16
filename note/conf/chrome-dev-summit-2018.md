Chrome Dev Summit 2018
======================

# Day 1 Keynote

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

## Unlocking the power of the web

How Spotify went from 0 to 100 real quick

@mrizzo10 from Spotify

### Friction

Millions of potential users were failing to play music because of app download friction. Was this friction inhibiting our growth potential?

Storage space is small. In Brazil, many of our users have less than 1GB of space free on their phone. App downloads are a large commitment from a storage-conscious user.

Awareness. If you've never used Spotify before, why would you go through the process of downloading a new app to hear a song? especially if you have no space left on your phone.

### Start small

First test was simple to build. Let visitors play one track on web before download app.

Day one plays increased by 25%.

A/B testing. Download app vs optional mobile web.

- Media Session API
- PWA install (add to home screen)
- Protected content

### Huge growth driver

- 54% increase in day one plays
- 14% increase in day 60 active users
- 30% of logins from churned users

### No cannibalization

When users had access to a mobile web experience, they were more likely to download the app.

30% of mobile web users went on to download the native app.

## Meeting customers where they are

Bringing the Starbucks app to the web

@davidbrunelle

Customer Reach. 6,000,000 more monthly active users than iOS native app.

Ofline support: Slow cellular networks, no cell signal, airport WiFi, Capitve Wifi portals. (Yes starbucks can be vary)

Caching: Service worker, workbox, indexeddb, precaching, runtime caching

### Focus on perf basics first

Less code, Caching, Image Optimization

### Better Sign In

PWA is indistinguisable from native apps
Core function is 2 taps away

Thoughtful animations
Accessibility treated as a priority

[Starbucks Pattern Library](https://www.starbucks.com/developer/pattern-library)

Reusable react components

Over 25% of all orders come from desktop browsers

65% increase in starbucks rewards registrations via the web

## We've shipped, now what?

@zackargyle from Pinterest

How can you fight performance entropy?

Performance budgets

3 Metric approaches: Logging, Alerting, Prevention

Measuring the changes and recognise the difference.

+103% weekly users, +300% session duration

Low-bandwidth areas

+300% weekly users, +600% Pins seen

Performance has directly impacted the company's bottom line.

https://goo.gl/YDoFNd

## Three things as a summary

- Spotify: Get more users, reduce friction
    - Activation: 54% increase in day one plays
    - Retention: 14% increase in day 60 active users
- Starbucks: Meet users where they are, Use workbox caching strategies
  - 65% increase in number of customers joining Starbucks Rewards via the web
- Pinterest: Focus on performance, Seta performance budget
    - 600% increase in number of Pins seen - has positively impacted Pinterest's revenue.

----

# State of the Union: Speed Tooling

https://www.youtube.com/watch?v=ymxs8OSXiUA&index=3&list=PLNYkxOF6rcIDjlCx1PcphPpmf43aKOAdF

@paul\_irish @egsweeny

- Metrics
- Lighthouse
- Chrome UX Report
- Unified Tooling

> You can't improve what you don't measure. -- Peter Drucker

## Filmstrip metric terms

- First Contentful Paint
- First Input Deplay
- Time to Interactive

If something is going on Main stream, input event will be delayed.

```
          |--------------------------------------------------|--------------|
          |        Speed Index                Time to        |              |
          |                                 Interactive      |  Lab Metrics |
          |--------------------------------------------------|              |
          | First Contentful   DOM Content Loaded     Onload |--------------|
----------|       Paint                                      |
|         |---------------------------------------------------
|  Field  |    First Input Delay                             |
| Metrics |--------------------------------------------------|
|----------Early load                                 Late load
```

- Lab: Lighthouse, PageSpeed
- Field: PageSpeed, Chrome UX Report, Web Perf API

## Lighthouse

- PWA Refactor
- Runtime Reduction
- Score Bucketing (colour legend change)
- Throttling Simulation
- Integration
  - CI, npm package
  - Calibre, Treo, SpeedCurve
  - web.dev
  - e.g. Squarespace -- Web Performance Data Pipeline

# Chrome UX Report CrUX

- Regional Analysis
- Custom Site Performance Reports (https://g.co/chromeuxdash)

# Unified Tooling

## [PageSpeed Insights](http://developers.google.com/speed/pagespeed/insights)

- Featuring all Lighthouse Performance details: metrics, opportunities, diagnostics
- Top score is the Lighthouse Perf Category score
- CrUX data shon in "Field Data"
- With [an API](https://develers.google.com/speed/docs/insights/v5/)

## Unified analysis - Development Lifecycle

- Benchmarking
  - PageSpeed Insights
  - Need a snapshot of a page's performance?
- Iteration & Continuous improvement
  - Lighthouse Chrome Extension, DevTools Audits Panel, Lighthouse CLI
  - Want to make changes, test, and iterate?
- Production monitoring
  - Pagespeed API
  - Want to monitor your production sites and set budgets?

## Summary

- Measure well, measure often.
- Use PageSpeed Insights for quick Lighthouse analysis.
- Utilize CrUX real world data to round out your performance perspective.
- Evaluate performance at every stage, now aided by the PageSpeed Insights API.


----

# Speed Essentials: Key techniques for fast websites

@katiehempenius
@hdjirdeh

- images
- webfonts
- js

## Images

Format, compression, display size & density, lazy-loaded and.. should be automated!

### Format

#### GIF -> Video

```
$ ffmpeg -i dog.gif dog.mp4
```

No more `<img src="dog.gif">`!

```html
<video autoplay loop muted playsinline>
    <source src="dog.mp4" type="video/mp4">
</video>
```

#### WebP

25-35% smaller than png or jpg

```html
<picture>
    <source type="image/webp" srcset="flower.webp">
    <source type="image/jpeg" srcset="flower.jpg"> <!-- Only the first supported format will be downloaded -->
    <img src="flower.jpg">
</picture>
```

#### AV1

It's new and better.

### Compression

Lossy Compression

[Imagemin](https://github.com/imagemin/imagemin)

### Sizing

Oversized images have transmission, decoding, and resizing costs.

Serve Multiple Image Sizes will reduce image transfer size by avg ~20%

[sharp](https://github.com/lovell/sharp) -- c/c++ required, [jimp](https://github.com/oliver-moran/jimp)

```html
<img srcset="flower-small.jpg 480w, flower-large.jpg 1080w"
    sizes="50vw"
    src="flower-large.jpg">
```

### Lazy Loading

Initial Page Load and performance.

[lazysizes](https://github.com/aFarkas/lazysizes) [lozad](https://github.com/ApoorvSaxena/lozad.js)

Native Lazy Loading

```html
<img src="flower.jpg" lazyload="<auto|on|off>">
```

## Fonts

Flash of Invisible Text (FOIT)
Flash of Unstyled Text (FOUT)

```
font-display: swap;
```

## JavaScript

Why is so big nowadays?

- Split your bundle: dynamic components loading [vue](https://bit.ly/lazy-vue), [angular](https://bit.ly/lazy-angular), [react](https://bit.ly/lazy-react) (`lazy()` method with `<Suspense>`)
- Preload: fetch earlier with preload `<link rel="preload" as="script" href="critical.js">`
- Transpile what acutally needed
  - Use `@babel/preset-env` with `targets` and `useBuiltIns`
- Differential Serving e.g. [NY 2018 midterm elections](https://bit.ly/nyt-midterms) using [SAPPER](https://github.com/sveltejs/sapper) and [rollup](https://github.com/rollup/rollup)
- Keep an eye on things
  - coverage tab in devTools
  - webpack bundle analyzer
  - [bundlephobia.com](https://bundlephobia.com/)
- Set budgets
  - Run Lighthouse in CI so that the project can have a minimum score

```html
<script type="module" src="main.mjs"></script>
<script nomodule src="legacy.js"></script>

<link rel="modulepreload" href="critical-module.mjs">
```

e.g. Uniqlo

## What can Chrome do for you?

- Lite page delivered: Minimized data usage for data saver users
  - use the Network Information API
  - `navigator.connection.saveData` // true
  - `navigator.connection.effectiveType` // "4G"

----

# Building Faster, More Resilient Apps with Service Worker

@philwalton @devnook

Most of browsers support service worker.

## The Costs & Benefits of service worker

## Benefits

- Requests can skip the network entirely
- Stale responses can be returned immediately, while fetching updates in the background
- Use custom templating logic to minimize the content that needs to be fetched from network
- Automatically store the bytecode representation of JS in the cache

## Costs

- Service worker startup time isn't free
  - How long does a service worker typically take to boot up?
    ```js
    // get the performance entry for the page or resource.
    const entry = performance.getEntriesByName(url)[0];

    // Service Worker startup time is the delta between when the browser
    // starts the service worker and when it dispathces the fetch event.
    const swStartupTime = entry.requestStart - entry.workerStart;
    ```
- Cache reads aren't necessarily always instant (miss, or slow)
  - The worst case can be SW boot latency + cache miss + network latency
    ```js
    // get the performance entry for the page or resource.
    const entry = performance.getEntriesByName(url)[0];

    // A transfer size of 0 means this was handled by the cache.
    if (entry.transferSize === 0) {
        const cacheTIme = entry.responseStart - entry.requestStart;
    }

    // Measure befoe and after the cache read.
    const cacheStart = performance.now();
    const response = await caches.match(event.request);
    const cacheEnd = performance.now();
    ```
- Aggressive precaching in the service worker can deprive network bandwidth from the main page

## Service Worker Design

[workbox](https://workboxjs.org)

## Serving stratgy

How can I ensure my site actually loads faster when using service worker?

Not all requests are equal.

Navigation, Resource.

## 3 Ways to speed up navigations

- respond from cache right away (then check for updates afterward)
  ```js
  // Use a cache-first strategy
  workbox.routing.registerRoute(
      '/about',
      workbox.strategies.cacheFirst()
  );

  // Or, use a stale-while-revalidate strategy
  workbox.routing.registerRoute(
      '/about',
      workbox.strategies.staleWhileRevalidate()
  );
  ```
- When network is needed, fetch partial content and stream the rest from cache
  ```js
  workbox.routing.registerRoute(
      '/about',
      workbox.streams.strategy([
          cacheFirst.makeRequest({
              request: new Request('./_header.html'),
          }),
          networkFirst.makeRequest({
              request: new Request('./about.content.html'),
          }),
          cacheFirst.makeRequest({
              request: new Request('./_footer.html'),
          }),
      ]),
  );
  ```
- Use **navigation preload** so network requests and service worker startup can happen in parallel
  ```
  GET /index.html HTTP/2
  ...
  Service-Worker-Navigation-Preload: true
  ```
  ```js
  // In the activate event, enable Navigation Preload (if supported).
  if (self.registration.navigationPreload) {
      self.registration.navigationPreload.enable();
  }

  // In the fetch event, respond with the preloaded response.
  event.responseWith(event.preloadResponse);
  ```

## Caching strategy

Cache management

- Store the right resources at the right time
- Control size
- Prevent quota overflow
- Update efficiently


Precaching on install

- Similar to "Installing a package"
- Good solution for critical resources
- Easy to update
- Known size
- Arbitrary
- Upfront network cost
- Possibly caching unnecessary URLs

Runtime caching

- Great for non-critical assets
- You can cache in response to user's behavior
- Risk of inconsistent update (dependency corrupt)
- Cache will grow over time

```js
// Use the StorageManager API's estimate() method to get
// a sense for both your usage and total available quota.
const {usage, quota} = await navigator.storage.estimate();
```

Avoid quote overflow

- The size is vary depends on devices
- Store partials insted of full HTML page
- separate critical and non-critical assets into different caches, so that you can evict non-critical assets first if needed
- Cache conditionally
- Put size of max entry constraints on your cache

```js
const {usage, quota} = await navigator.storage.estimate();
const SIZE_TRESHOLD = 0.25;

if (usage / quota < SIZE_TRESHOLD) {
    cacheVideo('path/to/video')
}
```

```js
workbox.strategies.cacheFirst({
    cacheName: 'non-critical-assets',
    plugins: [
        new workbox.expiration.Plugin({
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 90, // 90 days
            purgeOnQuotaError: true,
        }),
    ],
});
```

### How to update?

- Remove and reinstall (easy but not efficient)
- Update versioned files on a new SW installation

```js
workbox.precaching.precacheAndRoute([
    // Versioned by content hash
    '/styles/index.0c9a31.css',
    '/scripts/main.0d5770.js',
    // Versioned by revision data
    {
        url: '/index.html',
        revision: '383676',
    },
]);
```

Also, cli tool supports generating a manifest file.

```
$ workbox wizard --injectManifest
```

## Respect the User

Respect the User's Resources

- Always test on Slow 3G and include slower devices (via devTools)
- Check overall storage taken by app, not only the homepage
- Don't cache speculatively if `save-data` mode is in use
- Use `effectiveType` to decide how much to cache or adjust your strategy
  ```js
  const type = navigator.connection.effectiveType;
  if (['slow-2g', '2g'].includes(type)) {
      precacheSome();
  } else {
      precacheAll();
  }
  ```
- Use opt-in UX patterns if appropriate (e.g. Save for later button)

## Summary

- Have a plan
- Don't just re-invent the HTTP cache
- Optimize navigation requests
- Make performance decisions based on data
- Control app size and quota usage
- Respect the user

----

# Smooth Moves: Rendering at the Speed of Right ®

@argyleink
@_developit

[ Connected, Silky, Asynchronous ] = Smooth

## RAIL Guildline

```
[ Response, Animation, Idle, Load ] = RAIL
  100ms     16ms       50ms  1s       GOAL
   50ms     10ms             5s
```

Smooth everywhere. 60FPS on low-end dev.

## quick guide to measuring performance via devtools

- Rendering section from the drawer
- Layers
- Performance monitor section from the drawer
- Audits tab

## 3 keys to smooth moves

1. Efficient Animations
2. Read.then(write)
3. Lazy Wins

## Efficient animations

Concern rendering process

on `div.style.left = '200px'`
Calculate styles (css) -> Layout -> Paint -> compositing

on `div.style.transform = 'translateX(100px)'`
Calculate styles (css) --------------------> compositing

changing text-shadow? compose two elements and change opacity,

GPUs are really good at transforming composited layers.

## Read.then(write)

The script is also a part of the rendering

If DOM changed by scripts, rendering process kicked in forcefully as a syncronus process. Then invalid if changed again.

So read first then write at the end.

## Lazy Wins

[ Happiness, Engagement, Adoption, Retention, Task Success ] = HEART

### browser scrolling

```css
.avatar {
    position: sticky;
}
```

```js
element.scrollIntoView({
    behavior: 'smooth',
})

function scrollToEnd() {
    requestIdleCallback(() => {
        scrollView.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
        })
    })
}
```

### Panning in JS

Needs to feel like we're physically moving content on the screen.

Handled by the compositor, doesn't have to wait for rendering.

```html
<div class="carousel">
    <img src="dog.jpg">
    <img src="cat.jpg">
</div>

<style>
.carousel {
    display: flex;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
}

.carousel > img {
    scroll-snap-align: start;
}
</style>
```


----

# Complex JS-heavy Web Apps, Avoiding the Slow

@kosamari
@jaffathecake

https://www.youtube.com/watch?v=ipNW6lJHVEs&index=7&list=PLNYkxOF6rcIDjlCx1PcphPpmf43aKOAdF
