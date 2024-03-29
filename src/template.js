import moment from 'moment'
import fs from 'fs'
import {glob} from 'glob'
import {createHash} from 'crypto'

import {getTagTree} from './../config/tag.js'
import {publicPostOnly} from './filters.js'
import {taxRoute} from './tag.js'

export async function templateFactory({ path }) {
    const templateFilenames = await glob(`./${path}/**/*.html`);
    const templateFiles = {};

    for (const filename of templateFilenames) {
        templateFiles[filename.replace(path, '')] = fs.readFileSync(
            filename, {encoding: 'utf-8'})
    }

    function partial(url, templateName, data) {
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

        return Function('data', 'parent', 'template', 'return `' + t + '`')(data || {}, parent, _template);
    }

    return (node, nodes) => {
        return template(node, nodes, {partial});
    }
}

function templateList(nodes) {
    const list = nodes
        .map(node => `<li>
            <span class="post-item">
                <span class="post-item--title">
                    <a href="/${node.data.fields.url}/">${displayTitle(node)}</a>
                </span>
                <date>${displayDate(node.data.frontmatter.date)}</date> 
            </span>
        </li>`).join('\n');
    return list;
}

function templatePosts(nodes) {
    const byYears = nodes.reduce((carry, node) => {
        const year = node.data.frontmatter.date.substr(0, 4);
        carry[year] = carry[year] || [];
        carry[year].push(node);
        return carry;
    }, {});

    let result = '';
    const years = Object.keys(byYears).sort().reverse();
    for(const year of years) {
        const nodesByYear = byYears[year];
        result += `<h2>${year}</h2>\n`;
        result += `<ul class="post-list">${templateList(nodesByYear)}</ul>\n`;
    }
    return result;
}

function parseTemplateTag(data, identifier, producer) {
    if (data.indexOf(identifier) !== -1) {
        data = data.replace(identifier, producer());
    }
    return data;
}

function templateTags() {
    const t = getTagTree();
    return `<h2>태그별</h2><ul>${t.children.map(n => parseTreeNode(n)).join('\n')}</ul>`;
}

function parseTreeNode(t) {
    let result = '';

    if (t.hidden) {
        return '';
    }

    if (t.url) {
        result += `<a href="/ko/tag/${t.url}/">${t.key}</a>`;
    } else {
        result += '<li>';
        result += `<span class="tag-title">${t.key}</span>: `;
        result += t.children.map(c => parseTreeNode(c)).join('\n');
        result += '</li>';
    }

    return result;
}

function displayTitle(node) {
    return node.data.frontmatter.title;
}

function displayContent(node, nodes) {
    let data = node.value;

    data = parseTemplateTag(data, '<!-- @template posts -->',
        () => templatePosts(publicPostOnly(nodes, node.data.frontmatter.lang)));
    data = parseTemplateTag(data, '<!-- @template tag -->',
        () => templatePosts(publicPostOnly(node.data.fields.rels, node.data.frontmatter.lang)));
    data = parseTemplateTag(data, '<!-- @template tags -->',
        () => templateTags());

    return data;
}

function displayDate(date) {
    return `${date}`.substr(0, 10)
}

function displayPublishedOn({data}) {
    if (! data.frontmatter.date) {
        return '';
    }
    const d = moment(data.frontmatter.date).format('LLLL');
    return `<div class="published-on">Published on <date>${d}</date></div>`;
}

function displayUpdatedOn({data}) {
    if (! data.frontmatter.updatedOn) {
        return '';
    }
    const d = moment(data.frontmatter.updatedOn).format('LLLL');
    return `<div class="updated-on">Updated on <date>${d}</date></div>`;
}

function displayTaxonomy({data}) {
    if (! data.frontmatter.tags || data.frontmatter.type != 'post') {
        return '';
    }
    
    const tagUrl = t => `/${
        data.frontmatter.lang != 'en'
        ? `${data.frontmatter.lang}/`
        : ''}tag/${taxRoute(t)}`;

    return `<div class="tags">Tags: ${data.frontmatter.tags.map(tagName => `
        <a href="${tagUrl(tagName)}">${tagName}</a>
    `).join(' ')}</div>`;
}

function displayHeadline({data}) {
    if (! data.frontmatter.headline) {
        return '';
    }
    return `<div class="headline">${data.frontmatter.headline.join('')}</div>`;
}

function template(node, nodes, {partial}) {
    const {data, value} = node;
    const page = `<!doctype html>
<html lang="${data.frontmatter.lang}" data-hash="%%PAGE_HASH%%">
<head>
${partial(data.fields.url, 'head.html', data)}
</head>
<body>
${partial(data.fields.url, 'site-header.html')}
${partial(data.fields.url, 'header.html')}
<div class="page">
    ${data.frontmatter.noTitle
        ? ''
        : `<header class="page-header">
        <h1><a href="/${!data.fields.url ? '' : `${data.fields.url}/`}">${displayTitle(node)}</a></h1>
        ${displayHeadline(node)}
    </header>`}

    <div class="content">${displayContent(node, nodes)}</div>

    <footer class="page-footer">
        ${displayPublishedOn(node)}
        ${displayUpdatedOn(node)}
        ${displayTaxonomy(node)}
    </footer>
</div>
${partial(data.fields.url, 'footer.html', data)}
${partial(data.fields.url, 'site-footer.html')}
</body>
</html>
`;
    return page.replace(
        "%%PAGE_HASH%%",
        createHash('sha256').update(page).digest('hex')
    );
}

