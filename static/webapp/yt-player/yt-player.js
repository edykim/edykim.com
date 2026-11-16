/*!
 * YouTube playlist music player
 *
 * Progressively enhances markup like:
 *
 *   <div class="playlist-cover"><p><img src="cover.webp" alt="..."></p></div>
 *   <h1>Playlist title</h1>
 *   <div class="youtube-playlist"><ol>
 *     <li><a href="https://www.youtube.com/watch?v=ID">Artist - Title</a> [5:16]</li>
 *   </ol></div>
 *
 * into a compact player backed by the YouTube IFrame Player API.
 * If this script never runs, the original list of links still works.
 */
(() => {
  'use strict';

  const SELECTOR = '.youtube-playlist';
  const COVER_SELECTOR = '.playlist-cover';
  const HEADING_SELECTOR = 'h1, h2, h3, h4';

  // Edit these to localize the UI.
  const LABELS = {
    play: 'Play',
    pause: 'Pause',
    prev: 'Previous track',
    next: 'Next track',
    seek: 'Seek',
    showVideo: 'Show video',
    hideVideo: 'Show cover',
    openYouTube: 'Open on YouTube',
    tracks: (n) => `${n} track${n === 1 ? '' : 's'}`,
    minutes: (m) => `${m} min`,
    hours: (h, m) => (m ? `${h} hr ${m} min` : `${h} hr`),
    unavailable: 'Unavailable',
    apiError: 'Could not load YouTube',
  };

  const ICONS = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.52.85l10.4-6.5a1 1 0 0 0 0-1.7L9.52 4.65A1 1 0 0 0 8 5.5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.2"/><rect x="14" y="5" width="4" height="14" rx="1.2"/></svg>',
    prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="2.6" height="14" rx="1.2"/><path d="M19 6.3v11.4a1 1 0 0 1-1.55.83L9.3 13.1a1.3 1.3 0 0 1 0-2.2l8.15-5.43A1 1 0 0 1 19 6.3z"/></svg>',
    next: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="16.4" y="5" width="2.6" height="14" rx="1.2"/><path d="M5 6.3v11.4a1 1 0 0 0 1.55.83l8.15-5.43a1.3 1.3 0 0 0 0-2.2L6.55 5.47A1 1 0 0 0 5 6.3z"/></svg>',
    video: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5.5" width="13" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M17 10.2l3.6-2.4a.9.9 0 0 1 1.4.75v6.9a.9.9 0 0 1-1.4.75L17 13.8z"/></svg>',
    external: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/></svg>',
  };

  const instances = new Set();
  let apiPromise = null;

  /* ---------- helpers ---------- */

  function loadYouTubeAPI() {
    if (apiPromise) return apiPromise;
    apiPromise = new Promise((resolve, reject) => {
      if (window.YT && window.YT.Player) return resolve(window.YT);
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof previous === 'function') previous();
        resolve(window.YT);
      };
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = () => {
        apiPromise = null; // allow a retry on the next click
        reject(new Error('YouTube IFrame API failed to load'));
      };
      document.head.append(script);
    });
    return apiPromise;
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }

  function parseVideoId(href) {
    try {
      const url = new URL(href, location.href);
      if (url.hostname === 'youtu.be') return url.pathname.slice(1, 12) || null;
      const v = url.searchParams.get('v');
      if (v) return v;
      const m = url.pathname.match(/\/(?:embed|shorts|live)\/([\w-]{11})/);
      return m ? m[1] : null;
    } catch {
      return null;
    }
  }

  function toSeconds(str) {
    return str.split(':').reduce((acc, part) => acc * 60 + Number(part), 0);
  }

  function formatTime(sec) {
    sec = Number.isFinite(sec) && sec > 0 ? Math.floor(sec) : 0;
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = String(sec % 60).padStart(2, '0');
    return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
  }

  function formatTotal(sec) {
    const mins = Math.round(sec / 60);
    return mins >= 60 ? LABELS.hours(Math.floor(mins / 60), mins % 60) : LABELS.minutes(mins);
  }

  function thumbnail(id) {
    return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  }

  function parseTracks(list) {
    return [...list.querySelectorAll('li')].map((li) => {
      const link = li.querySelector('a[href]');
      const id = link && parseVideoId(link.getAttribute('href'));
      if (!id) return null;
      const text = link.textContent.trim();
      const sep = text.indexOf(' - ');
      const dur = li.textContent.match(/\[\s*(\d{1,2}(?::\d{2}){1,2})\s*\]/);
      return {
        id,
        url: link.href,
        artist: sep > 0 ? text.slice(0, sep).trim() : '',
        title: sep > 0 ? text.slice(sep + 3).trim() : text,
        duration: dur ? toSeconds(dur[1]) : 0,
      };
    }).filter(Boolean);
  }

  // Cover and heading are siblings that come before the list.
  function findMeta(list) {
    let cover = null;
    let heading = null;
    for (let el = list.previousElementSibling; el && !el.matches(SELECTOR); el = el.previousElementSibling) {
      if (!cover && el.matches(COVER_SELECTOR)) cover = el;
      if (!heading && el.matches(HEADING_SELECTOR)) heading = el;
      if (cover && heading) break;
    }
    return { cover, heading };
  }

  /* ---------- cover color ---------- */

  function extractColor(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const size = 24;
          const canvas = document.createElement('canvas');
          canvas.width = canvas.height = size;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          ctx.drawImage(img, 0, 0, size, size);
          const data = ctx.getImageData(0, 0, size, size).data;
          let r = 0, g = 0, b = 0, total = 0;
          for (let i = 0; i < data.length; i += 4) {
            const pr = data[i], pg = data[i + 1], pb = data[i + 2];
            const max = Math.max(pr, pg, pb), min = Math.min(pr, pg, pb);
            // Favor saturated, mid-brightness pixels over grays, blacks and whites.
            const weight = ((max - min) / 255) * (1 - Math.abs(max + min - 255) / 255) + 0.02;
            r += pr * weight; g += pg * weight; b += pb * weight; total += weight;
          }
          resolve([r / total, g / total, b / total]);
        } catch {
          resolve(null); // tainted canvas (no CORS headers)
        }
      };
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min) return [0, 0, l];
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h;
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    return [h * 60, s, l];
  }

  /* ---------- player ---------- */

  class MusicPlayer {
    constructor(list, tracks) {
      this.tracks = tracks;
      this.index = 0;
      this.player = null;
      this.ready = false;
      this.playing = false;
      this.wantPlay = false;
      this.seeking = false;
      this.failed = new Set();
      this.timer = 0;

      const { cover, heading } = findMeta(list);
      this.render(list, cover, heading);
      this.bind();
      this.update();
      instances.add(this);

      // Warm up the iframe before the first click so play() runs inside the
      // user gesture (needed for reliable playback on mobile).
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io.disconnect();
            this.init();
          }
        }, { rootMargin: '300px' });
        io.observe(this.root);
      }
    }

    render(list, coverEl, heading) {
      const root = document.createElement('section');
      root.className = 'ymp';
      const uid = `ymp-${Math.random().toString(36).slice(2, 8)}`;
      const total = this.tracks.reduce((sum, t) => sum + t.duration, 0);
      const meta = [LABELS.tracks(this.tracks.length), total ? formatTotal(total) : '']
        .filter(Boolean).join(' · ');

      const rows = this.tracks.map((t, i) => `
        <li>
          <button type="button" class="ymp-track" data-index="${i}">
            <span class="ymp-num"><span class="ymp-n">${i + 1}</span><span class="ymp-eq" aria-hidden="true"><i></i><i></i><i></i></span></span>
            <span class="ymp-tt">
              <span class="ymp-track-title">${escapeHTML(t.title)}</span>
              ${t.artist ? `<span class="ymp-track-artist">${escapeHTML(t.artist)}</span>` : ''}
            </span>
            <span class="ymp-track-dur">${t.duration ? formatTime(t.duration) : ''}</span>
          </button>
        </li>`).join('');

      root.innerHTML = `
        <div class="ymp-head">
          <div class="ymp-art">
            <div class="ymp-video"><div></div></div>
            <img class="ymp-cover" alt="" decoding="async">
            <button type="button" class="ymp-video-toggle" aria-pressed="false" aria-label="${LABELS.showVideo}" title="${LABELS.showVideo}">${ICONS.video}</button>
          </div>
          <div class="ymp-info">
            <div class="ymp-heading"></div>
            <p class="ymp-meta">${escapeHTML(meta)}</p>
            <p class="ymp-now" aria-live="polite"></p>
            <div class="ymp-controls">
              <a class="ymp-btn ymp-yt" target="_blank" rel="noopener" aria-label="${LABELS.openYouTube}" title="${LABELS.openYouTube}">${ICONS.external}</a>
              <span class="ymp-spacer"></span>
              <button type="button" class="ymp-btn ymp-prev" aria-label="${LABELS.prev}" title="${LABELS.prev}">${ICONS.prev}</button>
              <button type="button" class="ymp-btn ymp-next" aria-label="${LABELS.next}" title="${LABELS.next}">${ICONS.next}</button>
              <button type="button" class="ymp-play" aria-label="${LABELS.play}">${ICONS.play}</button>
            </div>
          </div>
        </div>
        <div class="ymp-progress">
          <span class="ymp-time ymp-elapsed">0:00</span>
          <input type="range" class="ymp-seek" min="0" max="1" step="1" value="0" aria-label="${LABELS.seek}" disabled>
          <span class="ymp-time ymp-duration">0:00</span>
        </div>
        <ol class="ymp-tracks">${rows}</ol>`;

      const $ = (sel) => root.querySelector(sel);
      this.root = root;
      this.els = {
        cover: $('.ymp-cover'),
        videoHost: $('.ymp-video > div'),
        videoToggle: $('.ymp-video-toggle'),
        now: $('.ymp-now'),
        yt: $('.ymp-yt'),
        prev: $('.ymp-prev'),
        next: $('.ymp-next'),
        play: $('.ymp-play'),
        seek: $('.ymp-seek'),
        elapsed: $('.ymp-elapsed'),
        duration: $('.ymp-duration'),
        list: $('.ymp-tracks'),
        rows: [...root.querySelectorAll('.ymp-track')],
      };

      // Move the page's own heading in so it keeps its place in the document outline.
      const headingSlot = $('.ymp-heading');
      let title = heading;
      if (!title) {
        title = document.createElement('h2');
        title.textContent = 'Playlist';
      }
      list.parentNode.insertBefore(root, coverEl || heading || list);
      title.classList.add('ymp-title');
      title.id ||= uid;
      headingSlot.append(title);
      root.setAttribute('aria-labelledby', title.id);

      // Cover: the given image, falling back to the first video's thumbnail.
      const img = coverEl && coverEl.querySelector('img');
      const cover = this.els.cover;
      const fallback = this.tracks[0] && thumbnail(this.tracks[0].id);
      cover.alt = (img && img.alt) || '';
      cover.addEventListener('load', () => this.applyTheme(cover.currentSrc || cover.src));
      cover.addEventListener('error', () => {
        if (fallback && cover.src !== fallback) {
          cover.classList.add('is-thumb');
          cover.src = fallback;
        }
      });
      if (img) cover.src = img.currentSrc || img.src;
      else if (fallback) {
        cover.classList.add('is-thumb');
        cover.src = fallback;
      }

      if (coverEl) coverEl.remove();
      list.remove();
    }

    async applyTheme(src) {
      const rgb = await extractColor(src);
      if (!rgb) return;
      const [h, s] = rgbToHsl(...rgb);
      this.root.style.setProperty('--ymp-h', h.toFixed(0));
      this.root.style.setProperty('--ymp-s', `${Math.min(s * 100, 65).toFixed(0)}%`);
    }

    bind() {
      const { play, prev, next, seek, list, videoToggle } = this.els;
      play.addEventListener('click', () => this.toggle());
      prev.addEventListener('click', () => this.prev());
      next.addEventListener('click', () => this.next());
      list.addEventListener('click', (e) => {
        const row = e.target.closest('.ymp-track');
        if (!row) return;
        const i = Number(row.dataset.index);
        if (i === this.index && this.ready) this.toggle();
        else this.select(i, true);
      });
      seek.addEventListener('input', () => {
        this.seeking = true;
        this.renderTime(Number(seek.value), Number(seek.max));
      });
      seek.addEventListener('change', () => {
        this.seeking = false;
        if (this.ready) this.player.seekTo(Number(seek.value), true);
      });
      videoToggle.addEventListener('click', () => {
        const on = this.root.classList.toggle('is-video');
        videoToggle.setAttribute('aria-pressed', String(on));
        const label = on ? LABELS.hideVideo : LABELS.showVideo;
        videoToggle.setAttribute('aria-label', label);
        videoToggle.title = label;
      });
    }

    init() {
      if (this.initStarted) return;
      this.initStarted = true;
      loadYouTubeAPI().then((YT) => {
        this.player = new YT.Player(this.els.videoHost, {
          width: '100%',
          height: '100%',
          videoId: this.tracks[this.index].id,
          playerVars: {
            playsinline: 1,
            controls: 0,
            rel: 0,
            iv_load_policy: 3,
            origin: location.origin,
          },
          events: {
            onReady: () => this.onReady(),
            onStateChange: (e) => this.onStateChange(e.data),
            onError: (e) => this.onError(e.data),
          },
        });
      }).catch(() => {
        this.initStarted = false;
        this.wantPlay = false;
        this.setBuffering(false);
        this.els.now.textContent = LABELS.apiError;
      });
    }

    onReady() {
      this.ready = true;
      this.els.seek.disabled = false;
      // The track may have changed while the iframe was loading.
      const id = this.tracks[this.index].id;
      const loaded = this.player.getVideoData && this.player.getVideoData().video_id;
      if (this.wantPlay) {
        if (loaded === id) this.player.playVideo();
        else this.player.loadVideoById(id);
      } else if (loaded !== id) {
        this.player.cueVideoById(id);
      }
    }

    onStateChange(state) {
      const S = window.YT.PlayerState;
      if (state === S.PLAYING) {
        this.failed.delete(this.index);
        this.setPlaying(true);
        this.setBuffering(false);
        for (const other of instances) if (other !== this && other.playing) other.pause();
      } else if (state === S.BUFFERING) {
        this.setBuffering(true);
      } else if (state === S.PAUSED || state === S.CUED) {
        this.setPlaying(false);
        this.setBuffering(false);
      } else if (state === S.ENDED) {
        this.setPlaying(false);
        if (this.index < this.tracks.length - 1) this.select(this.index + 1, true);
        else this.select(0, false);
      }
      this.tick();
    }

    onError() {
      // 2: bad id, 5: HTML5 error, 100: removed/private, 101/150: embedding disabled.
      this.failed.add(this.index);
      this.els.rows[this.index].classList.add('is-unavailable');
      this.els.rows[this.index].querySelector('.ymp-track-dur').textContent = LABELS.unavailable;
      this.setBuffering(false);
      this.setPlaying(false);
      if (this.wantPlay && this.failed.size < this.tracks.length) this.next();
    }

    toggle() {
      if (!this.ready) {
        this.wantPlay = !this.wantPlay;
        this.setBuffering(this.wantPlay);
        this.init();
        return;
      }
      if (this.playing) this.pause();
      else {
        this.wantPlay = true;
        this.player.playVideo();
      }
    }

    pause() {
      this.wantPlay = false;
      if (this.ready) this.player.pauseVideo();
    }

    select(i, play) {
      this.index = (i + this.tracks.length) % this.tracks.length;
      this.wantPlay = play;
      this.update();
      this.scrollToCurrent();
      if (!this.ready) {
        this.setBuffering(play);
        this.init();
        return;
      }
      const id = this.tracks[this.index].id;
      if (play) this.player.loadVideoById(id);
      else this.player.cueVideoById(id);
    }

    step(dir) {
      // Skip tracks that already failed to play.
      let i = this.index;
      for (let n = 0; n < this.tracks.length; n++) {
        i = (i + dir + this.tracks.length) % this.tracks.length;
        if (!this.failed.has(i)) break;
      }
      this.select(i, this.wantPlay || this.playing || !this.ready);
    }

    next() { this.step(1); }

    prev() {
      if (this.ready && this.player.getCurrentTime() > 3) this.player.seekTo(0, true);
      else this.step(-1);
    }

    setPlaying(on) {
      this.playing = on;
      this.root.classList.toggle('is-playing', on);
      this.els.play.innerHTML = on ? ICONS.pause : ICONS.play;
      this.els.play.setAttribute('aria-label', on ? LABELS.pause : LABELS.play);
      clearInterval(this.timer);
      if (on) this.timer = setInterval(() => this.tick(), 250);
    }

    setBuffering(on) {
      this.root.classList.toggle('is-buffering', on);
    }

    update() {
      const track = this.tracks[this.index];
      this.els.rows.forEach((row, i) => {
        const current = i === this.index;
        row.classList.toggle('is-current', current);
        if (current) row.setAttribute('aria-current', 'true');
        else row.removeAttribute('aria-current');
      });
      this.els.now.innerHTML = `<span class="ymp-now-title">${escapeHTML(track.title)}</span>` +
        (track.artist ? `<span class="ymp-now-artist">${escapeHTML(track.artist)}</span>` : '');
      this.els.yt.href = track.url;
      this.renderTime(0, track.duration);
    }

    tick() {
      if (!this.ready || this.seeking) return;
      const duration = this.player.getDuration() || this.tracks[this.index].duration;
      this.renderTime(this.player.getCurrentTime() || 0, duration);
    }

    renderTime(current, duration) {
      const { seek, elapsed, duration: durEl } = this.els;
      seek.max = Math.max(1, Math.floor(duration));
      if (!this.seeking) seek.value = Math.floor(current);
      seek.style.setProperty('--p', `${duration ? (current / duration) * 100 : 0}%`);
      elapsed.textContent = formatTime(current);
      durEl.textContent = formatTime(duration);
    }

    // Scroll inside the list only; never move the page.
    scrollToCurrent() {
      const list = this.els.list;
      const li = this.els.rows[this.index].parentElement;
      const top = li.offsetTop;
      const bottom = top + li.offsetHeight;
      if (top < list.scrollTop || bottom > list.scrollTop + list.clientHeight) {
        list.scrollTo({ top: top - (list.clientHeight - li.offsetHeight) / 2, behavior: 'smooth' });
      }
    }
  }

  function init(scope = document) {
    scope.querySelectorAll(SELECTOR).forEach((list) => {
      if (list.dataset.ympInit) return;
      list.dataset.ympInit = '1';
      const tracks = parseTracks(list);
      if (tracks.length) new MusicPlayer(list, tracks);
    });
  }

  window.YouTubeMusicPlayer = { init };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init());
  } else {
    init();
  }
})();
