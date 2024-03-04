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
}

function createModeToggle() {
    const $button = document.createElement('button');
    $button.classList.add('setting-btn');
    $button.textContent = 'setting';
    document.querySelector('body').prepend($button);
}

setMode(getCurrentMode());

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
}

