import moment from 'moment'
import fs from 'fs'
import {glob} from 'glob'
import {createHash} from 'crypto'

import components from '../config/components.js'
import utils from './template/utils.js'

const externalDeps = {
    moment,
}

export async function templateFactory({ path }) {
    const templateFilenames = await glob(`./${path}/**/*.html`);
    const templateFiles = {};

    for (const filename of templateFilenames) {
        templateFiles[filename.replace(path, '')] = fs.readFileSync(
            filename, {encoding: 'utf-8'})
    }

    function partial(url, templateName, data, additional = {}) {
        let urlLookup = '/' + url;
        while (!templateFiles[urlLookup + '/' + templateName]) {
            const _url = urlLookup.split('/');
            if (_url.length === 1 && _url[0] === '') {
                break;
            }
            _url.pop();
            urlLookup = _url.join('/');
        }
        const t = templateFiles[urlLookup + '/' + templateName] || '';
        const nextUrl = urlLookup.slice(0, urlLookup.lastIndexOf('/'));
        const parent = () => partial(nextUrl, templateName, data);
        const _template = (templateName, data) => partial(url, templateName, data);

        return Function(
            'data',
            'parent',
            'template',
            // some dependencies
            Object.keys(externalDeps),
            'utils',
            'return `' + t + '`'
        )(
            data || {},
            parent,
            _template,
            ...Object.values(externalDeps),
            {
                ...utils,
                ...additional,
            }
        );
    }

    return (node, nodes) => {
        return template(node, nodes, {partial});
    }
}

function parseTemplateTag(data, identifier, producer) {
    if (data.indexOf(identifier) !== -1) {
        data = data.replace(identifier, producer());
    }
    return data;
}

function createDisplayContent(node, nodes, {partial}) {
    return () => {
        let data = node.value;

        data = components.reduce((carry, component) => {
            carry = parseTemplateTag(carry, `<!-- @template ${component.key} -->`,
                () => partial(
                    node.data.fields.url,
                    component.template,
                    component.props(node, nodes)
                ));
            return carry;
        }, data);

        return data;
    }
}

function template(node, nodes, {partial}) {
    const {data, value} = node;
    const page = partial(data.fields.url, 'index.html', data, {
        displayContent: createDisplayContent(node, nodes, {partial})
    });
    return page.replace(
        "%%PAGE_HASH%%",
        createHash('sha256').update(page).digest('hex')
    );
}

