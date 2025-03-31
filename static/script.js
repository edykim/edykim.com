if (navigator && navigator.serviceWorker) {
    navigator.serviceWorker.register('/sw.js');
}

const cl = document.querySelector("html").classList;

function getCurrentMode() {
    const mode = localStorage.getItem('mode');

    if (mode) {
        return mode;
    }

    if (
        window.matchMedia
        && window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
        return 'dark';
    }

    return 'day';
}

const codeLight = ['day', 'sepia'];

function setMode(name) {
    const current = getCurrentMode();
    cl.add(`mode--${name}`);

    cl.remove(`code---light`);
    cl.remove(`code--dark`);

    if (codeLight.includes(name)) {
        cl.add('code--light');
    } else {
        cl.add('code--dark');
    }

    if (current != name) {
        cl.remove(`mode--${current}`);
        localStorage.setItem('mode', name);
    }

    toggleGiscusTheme(name);
}

function createModeToggle() {
    const $button = document.createElement('button');
    $button.classList.add('setting-btn');
    $button.textContent = 'setting';
    document.querySelector('body').prepend($button);
}

setMode(getCurrentMode());

const darkThemeNames = ['night', 'dark', 'tumblr'];
const darkGiscusThemeName = 'dark_dimmed';
const lightGiscusThemeName = 'light';

function toggleGiscusTheme(name) {
    const frame = document.querySelector('.giscus-frame');
    if (!frame) {
        return;
    }
    const src = frame.getAttribute('src');
    if (darkThemeNames.includes(name)) {
        if (src.indexOf(`theme=${lightGiscusThemeName}`) != -1) {
            frame.setAttribute('src',
                src.replace(
                    `theme=${lightGiscusThemeName}`,
                    `theme=${darkGiscusThemeName}`));
        }
    } else {
        if (src.indexOf(`theme=${darkGiscusThemeName}`) != -1) {
            frame.setAttribute('src',
                src.replace(
                    `theme=${darkGiscusThemeName}`,
                    `theme=${lightGiscusThemeName}`));
        }
    }
}

function loadGiscus() {
    const section = document.querySelector('.comments');
    if (!section) {
        return;
    }

    const comment = document.createElement('script');
    comment.setAttribute('src', 'https://giscus.app/client.js');
    comment.setAttribute('data-repo', 'edykim/edykim.com');
    comment.setAttribute('data-repo-id', 'MDEwOlJlcG9zaXRvcnkxMDgxMTYwNDY=');
    comment.setAttribute('data-category', 'General');
    comment.setAttribute('data-category-id', 'DIC_kwDOBnG4Ts4CTVMY');
    comment.setAttribute('data-mapping', 'pathname');
    comment.setAttribute('data-strict', '0');
    comment.setAttribute('data-reactions-enabled', '1');
    comment.setAttribute('data-emit-metadata', '0');
    comment.setAttribute('data-input-position', 'bottom');
    comment.setAttribute('data-theme',
        darkThemeNames.includes(getCurrentMode())
        ? darkGiscusThemeName
        : lightGiscusThemeName);
    comment.setAttribute('data-lang',
        document.querySelector('html')?.getAttribute('lang') ?? 'en');
    comment.setAttribute('data-loading', 'lazy');
    comment.setAttribute('crossorigin', 'anonymous');
    comment.setAttribute('async', 'async');

    section.append(comment);
}

const head = document.querySelector('head');

const loaded = {};
window.onload = () => {
    const modal = document.querySelector('#website-setting');
    document.querySelector('#website-setting .close-btn')
        .addEventListener('click', () => {
            modal.close();
        });
    document.querySelectorAll('#website-setting .color-select input')
        .forEach(ele => {
            if (ele.value === getCurrentMode()) {
                ele.setAttribute('checked', true);
            }
            ele.addEventListener('click', (e) => {
                if (e.target.checked) {
                    setMode(e.target.value);
                }
            })
        });

    document.querySelector('.setting-btn')
        .addEventListener('click', () => {
            modal.showModal();
        });

    const subnav = document.querySelector('.subnav')
    const subnavTitle = document.querySelector('.subnav-title a')
    subnavTitle?.addEventListener('click', () => {
            if (subnav.classList.contains('opened')) {
                subnav.classList.remove('opened');
            } else {
                subnav.classList.add('opened');
            }
        });

    document.querySelectorAll('.with-random-button')
        .forEach(el => {
            const button = document.createElement('button');
            button.classList.add('random-btn');
            button.textContent = 'Random 🎲 ';
            el.prepend(button);

            const ul = el.querySelector('ul');
            const links = el.querySelectorAll('a');
            // // TODO: disable random order for now..
            // links.forEach(l => {
            //     l.setAttribute('target', '_blank');
            //     if (Math.random() < 0.5) {
            //         ul.append(document.createTextNode(' '));
            //         ul.append(l.parentNode);
            //     }
            // });
            button.addEventListener('click', () => {
                const idx = Math.floor(Math.random() * links.length);
                links[idx]?.click();
            });
        });

    document.querySelectorAll('.with-fold-button')
        .forEach(el => {
            const container = document.createElement('div');
            const button = document.createElement('button');
            button.classList.add('fold-btn');
            button.textContent = el.dataset.openLabel;
            container.append(button);
            el.parentNode.insertBefore(container, el);

            el.style.display = 'none';

            button.addEventListener('click', () => {
                button.textContent = el.style.display !== 'none'
                    ? el.dataset.openLabel : el.dataset.closeLabel;
                el.style.display = el.style.display === 'none' ? '' : 'none';
            });
        });

    document.querySelectorAll('.with-details-toggle-button')
        .forEach(el => {
            const container = document.createElement('p');
            const button = document.createElement('button');
            button.classList.add('details-toggle-btn');
            button.textContent = '전부 펼치기';
            container.append(button);
            el.prepend(container);

            button.addEventListener('click', () => {
                if (button.textContent === '전부 펼치기') {
                    el.querySelectorAll('details').forEach(details => {
                        details.setAttribute('open', 'open');
                    });
                    button.textContent = '전부 접기';
                } else {
                    el.querySelectorAll('details').forEach(details => {
                        details.removeAttribute('open');
                    });
                    button.textContent = '전부 펼치기';
                }
            });
        });

    // 나는 늘 코멘트를 기대하면서 기대하지 않는다. 그러니까 다시 또 끈다.
    // loadGiscus();
}

window.addEventListener('DOMContentLoaded', () => {
    pageMarkApp();
    initLikeButtons();
});

function pageMarkApp() {
    const SET_MARK_KEY = 'm'
    const GOTO_MARK_KEY = "'"

    const NONE_MODE = 'none'
    const SET_MODE = 'set'
    const GOTO_MODE = 'goto'

    let markMode = 'none'

    function mark(key) {
        return `mark-${key}`;
    }

    document.addEventListener('keydown', e => {
        const active = document.activeElement;
        if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) {
            return;
        }

        if (markMode === NONE_MODE) {
            if (e.key === SET_MARK_KEY) {
                e.preventDefault();
                markMode = SET_MODE;
            } else if (e.key === GOTO_MARK_KEY) {
                e.preventDefault();
                markMode = GOTO_MODE;
            }
        } else {
            if (e.key.match(/[a-zA-Z]/)) {
                if (markMode === SET_MODE) {
                    localStorage
                        .setItem(mark(e.key), window.location.href);
                } else if (markMode === GOTO_MODE) {
                    const url = localStorage.getItem(mark(e.key));
                    if (url) {
                        window.location.href = url;
                    }
                }
            }
            markMode = NONE_MODE
        }
    })
}

function initLikeButtons() {
    document.querySelectorAll('.likes-widget').forEach(function (el) {
        const $btn = el.querySelector('button');
        const $count = el.querySelector('.cnt');

        if (localStorage.getItem('liked-' + el.dataset.uuid)) {
            $btn.classList.add('liked');
        }

        fetch(el.getAttribute('action'), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            $count.dataset.cnt = data.cnt;

            if (data.cnt > 0) {
                $count.textContent = $count.dataset.cnt;
            }
        });

        el.addEventListener('submit', function (e) {
            e.preventDefault();

            fetch(el.getAttribute('action'), {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
            }).then(function (response) {
                return response.json();
            });

            localStorage.setItem('liked-' + el.dataset.uuid, '1');
            $btn.classList.add('liked');
            $count.dataset.cnt = parseInt($count.dataset.cnt) + 1;
            $count.textContent = $count.dataset.cnt;
            return false;
        });
    });
}