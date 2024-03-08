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
        return 'night';
    }

    return 'day';
}

function setMode(name) {
    const current = getCurrentMode();
    cl.add(`mode--${name}`);

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

const darkThemeNames = ['night'];
const darkGiscusThemeName = 'dark_dimmed';
const lightGiscusThemeName = 'light';

function toggleGiscusTheme(name) {
    const frame = document.querySelector('.giscus-frame');
    if (!frame) {
        const scr = document.querySelector('.commments script');
        if (scr) {
            scr.dataset.theme = darkThemeNames.includes(name)
                ? darkGiscusThemeName : lightGiscusThemeName
        }
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

const head = document.querySelector('head');

const loaded = {};
window.onload = () => {
    const modal = document.querySelector('#website-setting');
    document.querySelector('#website-setting .close-btn')
        .addEventListener('click', () => {
            modal.close();
        });
    document.querySelectorAll('#website-setting .color-select')
        .forEach(ele => ele
            .addEventListener('click', (e) => {
                setMode(e.target.dataset.color);
            }));

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
            button.textContent = 'Random';
            el.prepend(button);

            const ul = el.querySelector('ul');
            const links = el.querySelectorAll('a');
            links.forEach(l => {
                l.setAttribute('target', '_blank');
                if (Math.random() < 0.5) {
                    ul.append(document.createTextNode(' '));
                    ul.append(l.parentNode);
                }
            });
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

    toggleGiscusTheme(getCurrentMode());
}

