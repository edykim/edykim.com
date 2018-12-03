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

A showcase of [squoosh.app](https://squoosh.app)

In Firefox, webp doens't support yet. Squoosh support webp it via wasm.

MozJPEG, OptiPNG, WebP -> emscripten -> wasm

It's better than inbuilt browser encoder.

[Emscripting a C library to Wasm](https://developers.google.com/web/updates/2018/03/emscripting-a-c-library)

Preact + webpack

Generate 2 workers, so that the intensive work doens't freeze UI.

When the work need to be changed, just terminate the worker and start it.


worker doesn't give good API so it wrapped via comlink. [comlink](https://github.com/GoogleChromeLabs/comlink) gives all bookkeeping chore work.


```js
// In the worker
import { expose } from 'comlink';

async function webpEncode(data, options) {
    const { encode } = await import('./webp/encoder');
    return encode(data, options);
}

// In the page
import { proxy } from 'comlink';

const leftWorker = new Worker('processor.7a100.js');
const workerApi = proxy(leftWorker);

workerApi.webpEncode(data, options).then(() => {
    // ...
});
```

Code spliting via `import()`

emerging market...

Preact + <web-components>

- [file-drop](https://github.com/GoogleChromeLabs/file-drop)
- [pinch-zoom](https://github.com/GoogleChromeLabs/pinch-zoom)
- [two-up](https://github.com/GoogleChromeLabs/two-up)

[custom-elements-everywhere.com](https://custom-elements-everywhere.com/)

- [pointer tracker](https://github.com/GoogleChromeLabs/pointer-tracker)
- [critters](https://github.com/GoogleChromeLabs/critters)

[squoosh.app](https://github.com/GoogleChromeLabs/squoosh)


----

# Building Modern Web Media Experiences: Picture-in-Picture and AV1

https://plus.google.com/+FrancoisBeaufort

Angie Chiang

- Picture-in-Picture
- AV1 video codec
- Codec Switching
- Media Capabilities

## Why Media on the Web matters

- 40,000 years of video watched daily in Chrome
- 30% of all time spent watching video on Chrome Desktop

## Picture-in-Picture

Perfect for:

- Multi-tasking
- Record desktop with camera
- Always on top media center

```js
button.addEventListener('click', async (event) => {
    if (video !== document.pictureInPictureElement)
        await video.requestPictureInPicture()
    else
        await document.exitPictureInPicture()
})

video.addEventListener('enterpictureinpicture', (event) => {
    pipWindow = event.pictureInPictureWindow
    console.log(`Window size is ${pipWindow.width} x ${pipWindow.height}`)
    pipWindow.addEventListener('resize', onPipWindowResize)
})

video.addEventListener('leavepictureinpicture', (event) => {
    pipWindow = event.pictureInPictureWindow
    pipWindow.removeEventListener('resize', onPipWindowResize)
})

// check the window size and change the resolution of video
function onPipWindowResize(event) {
    pipWindow = event.pictureInPictureWindow
    console.log(`Window size changed to ${pipWindow.width} x ${pipWindow.height}`)
}

if ('pictureInPictureEnabled' in document) {
    // Set button ability depending on whether Picture-in-Picture can be used.
    setPipButton()
    video.addEventListener('loadedmetadata', setPipButton)
    video.addEventListener('emptied', setPipButton)
} else {
    // Hide if the feature is not support
    togglePipButton.hidden = true
}

function setPipButton() {
    togglePipButton.disabled = !document.pictureInPictureEnabled ||
    video.disablePictureInPicture ||
    (video.readyState === 0)
}

video.srcObject = await navigator.mediaDevices.getUserMedia({ video: true })

await video.requestPictureInPicture()

const screenVideoStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
const voiceAudioStream = await navigator.mediaDevices.getUserMedia({ audio: true })

const stream = new MediaStream([
    ...screenVideoStream.getTracks(),
    ...voiceAudioStream.getTracks(),
])
```

[cds-pip.glitch.me](https://cds-pip.glitch.me)

Window Media Controls

- seekbackward
- seekforward
- previoustrack
- nexttrack

## AV1

- Video codec for the web
  - better than VP9
- Open source & royalty-free
  - Alliance For Open Media 
- Deploy widely & openly

```js
if (MediaSource.isTypeSupported('video/mp4; codecs=av01.0.05M.08')) {
    // play AV1 video
}
```

- [bit.ly/av1decoder](bit.ly/av1decoder)
- [bit.ly/changetype](bit.ly/changetype)

## Media Capabilities

- Smooth Playback
- Power Efficient

[cds-media-capabilities](https://bit.ly/cds-media-capabilities)



----

# Modern Websites for E-commerce in the Real World

@cheneytsai @ramyaaraghavan

Toolbox for Modern E-commerce

- PWA
- Web Authentication
- Autofill (credit)
- AMP and Lighthouse
- Sign in with Google
- Google Pay

How is the Solution Improving the User's Journey?

Saatva

AMP -> PDP -> Cart
AMP -> Cart (Inside AMP)

- 50% Conversions Uplift
- 3X First step of checkout

Expedia: Users Value **Consistent** Journeys

Actually Reduce Friction

Challenges:

- Organizational Alignment
  - Cross-functional Buy-in is Key to the Success of Performance Initiatives
  - Performance is Not Just an Engineering Priority
- Technical Approach
  - Balance Long-term Visions With Achievable Short-term Goals
  - Have a Long-term Vision, Plan for Short-term Goals, Align Goals Against the Long-term Vision
- Measurement
  - Create a Measurement Strategy that is Shared, Automated, and Actionable

https://developers.google.com/web/progressive-web-apps/checklist

- Define a Vision then Iterate, And Don't be Afraid to Explore New Paths (Walmart)
- Predictive Prefetching of Listing Pages (eBay)
  - Prefetch first 5 items of Search Results for a likely future navigation (postMessage to Service Worker)
- Moving to Client-Side Routing (7-8x speed improvement, 88% search result loads are client side rendered) (AirBnB)

Measurement Strategy

- Shared Metrics
- Automated Tools
- Actionable Next Steps

Common Goals Tied to Specific Metrics e.g. More pageviews -> SpeedIndex < 3s, Seamless checkout -> Time to checkout < 30s

Performance budget

Bundle Size check in CI process

Performance budget indicators: Socialize the budget first, so everyone can see the changes. (wayfair)


----

# Progressive Content Management Systems

@iAlbMedina @WestonRuter

https://www.youtube.com/watch?v=s1WrBaAyzAI&list=PLNYkxOF6rcIDjlCx1PcphPpmf43aKOAdF&index=10

Pillars of a delightful UX:

- Performance and Reliability
- Trust and Safety
- Accessibility and Integration
- Great Content Quality

## Progressive Web Development

Developing user-first experiences using:

- Modern Workflows and Web APIs
- Coding and Performance Best Practices
- Effective Incentives and Validation Structures

The CMS Space, small subset

## CMS Ecosystem Challenges

On advancing along the progressive road:

- High Complexity
- Architectural Choices
- High levels of Fragmentation
- Lack of effective incentives

## CMS Ecosystem

- Core
- Extensions (Plugin, Themes, etc.)
- Developers
- Users

Work with Wordpress..

- AMP: a well-lit path to modern web development
- PWA in WordPress (PoC): Progressive WordPress, the WordPress Way
  - Service Workers
  - Offline Capabilities
  - Background Sync
  - Smooth Transitions

## PWA in WordPress

POC Challenges to Success

- No Unified Access to SW API (e.g. single SW)
- High Complexity (e.g. working with SW is hard)
- Lack of Constraints (e.g. no sandboxing)

Service Worker API Core Integration

- Service Worker API
- Abstraction Library (Workbox)
- WordPress Core (Actions and Filters)
- PHP Developers

App Shell Model: A way to build a Progressive Web App that reliably and instantly loads, similar to what you see in native applications.

It is hard because the plugins and themes will affect the content so it uses the way that AMP plugin applies.

- https://github.com/Automattic/amp-wp
- https://github.com/xwp/pwa-wp
- https://bit.ly/amp-drupal
- https://bit.ly/pwa-drupal
- https://pwastudio.io - Magento
- https://bit.ly/aem-spa - Adobe Experience Manager
- https://en.ec-cube.net - EC-CUBE


# Making Modern Web Content Discoverable for Search

- @tcmg
- @g33konaut

https://twitter.com/g33konaut/status/991609951574519808

> The rendering of JavaScript-powered websites in Google Search is **deferred** until Googlebot has resources available to process that content.

## Dynamic Rendering

Identify Crawler user agent and parse through dynamic renderer.

- Rapidly changing sites
- Modern (>Chrome 41) Javascript features
- Sites with a strong social media presence

Tools are,

- https://github.com/GoogleChrome/puppeteer
- https://github.com/GoogleChrome/rendertron

```js
const express = require('express')
const app = express()
const rendertron = require('rendertron-middleware')

const BOTS = rendertron.botUserAgents.concat('googlebot').join('|')

app.use(rendertron.makeMiddleware({
  proxyUrl: 'https://your.rendertron.example/render',
  userAgentPattern: new RegExp(BOTS, 'i'),
}))

app.listen(process.env.PORT || 8080)
```

## Testing

- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
  - Page loading info (this test includes rendering steps)
- [Rich Results Test](https://search.google.com/test/rich-results)
- Lighthouse
  - SEO Audits
- https://developers.google.com/search

GoogleBot supports,

- ES5 & ES6
- Stateless (no index db, session storage, local storage, cookie...)

- https://polyfill.io
- https://caniuse.com/#compare=chrome+41

## Future Enhancesments

- Crawling & rendering integrated (matched js engine in GoogleBot and chrome)
- Modern Chrome
- More sustainable update process


# Day 2 Keynote

- @stubbornella
- @cramforce

## Web frameworks

> You can't not use a framework. The only real choice is to either:
>
> a) use one that is open source, documented, tested, supported,
> maintained, mature, proven and has a community or
>
> b) use one you cobble together yourself that's probably unusable,
> unmaintainable garbage.
>
> -- Yevgeniy Brikman @brikis98

## The web stack

- Web primitives
- Built-in modules
- Frameworks
- Web Components

## Framework Improvements

- React
- Angular
- Vue
- Polymer
- Svelte
- AMP
- Ember

Frameworks + integrated best practices = great outcomes for everyone

- Include frameworks in the Chrome Intent to Implement process
- $200,000 of funding for improving performance best practices in frameworks.
  (https://bit.ly/framework-perf)
- Increased collaboration with frameworks from the Chrome team

## Features

- Display Locking: Don't want to update the DOM inadvertently? You can lock it!
- Page Transitions with Portals
  - Modern Navigations
  - CORS issue resolved via this feature.
  - Web pages are the new SPAs
- Feature Policies
  - Report-only, Enforce mode
  - Types
    - Sync XHR
    - Unoptimized images
    - Oversized images
    - Unsized media
- Web Packaging for Instant Loading
  - Document author signs the content with their certificate.
  - Anyone can deliver it.
  - Browser treats it as coming from their domain.
  - Web Packaging can bring back cell tower edge caching into a HTTPS world
  - https://bit.ly/try-sxg (Signed Exchange Origin Trial)
- Scheduling API
  - Grand Central Dispatch
- Animation Worklet
  - CSS and Animation API is working well with time based animation.
- Virtual Scroller
  - Just like UITableView


# Feature Policy & the Well-Lit Path for Web Development

- @jasonpchase

https://www.youtube.com/watch?v=igHvSUrLqXc&index=16&list=PLNYkxOF6rcIDjlCx1PcphPpmf43aKOAdF
























