import chunk from 'lodash.chunk'
import {latestFirst} from './sort.js'
import {getMappedTags} from './../config/tag.js'

const POST_PER_PAGE = 10;

const mapped = getMappedTags()
    .reduce((carry, value) => {
        if (value.url) {
            carry[value.key] = value.url;
        }
        return carry;
    }, {});

export function taxRoute(tag) {
    return (`${mapped[tag] || tag}`)
        .toLowerCase()
        .replace('.net', 'dotnet')
        .replace(/[ \.]/gi, '-');
}

export function fetchTaxonomies(nodes, lang) {

    const collection = new Map();

    const insertIntoTag = (tag, node) => {
        const col = collection.get(tag) || [];
        col.push(node);
        collection.set(tag, col);
    }

    let years = {};
    for (const node of nodes) {
        if (
            node.data.frontmatter.lang != lang
            || ! node.data.frontmatter.tags
        ) {
            continue;
        }

        for(const tag of node.data.frontmatter.tags) {
            insertIntoTag(tag, node);
        }

        if(node.data.frontmatter.date) {
            const year = node.data.frontmatter.date.substr(0,4);
            const tag = `year:${year}`
            insertIntoTag(tag, node);
            years[year] = years[year] || 0;
            years[year]++;
        }

        insertIntoTag('posts', node);
    }

    const pages = [];

    const yearSummary = [];

    Object.keys(years).sort((a,b) => b - a).forEach(y => {
        yearSummary.push({
            label: y,
            link: `${lang}/archives/${y}`,
            count: years[y],
        })
    });

    Array.from(collection.keys()).forEach(tag => {
        const posts = collection.get(tag);
        const chunked = chunk(latestFirst(posts), POST_PER_PAGE);
        const totalPage = chunked.length;

        const urlBase = tag === 'posts'
            ? `${lang}/post`
            : tag.substr(0,5) === 'year:' 
            ? `${lang}/archives/${tag.substr(5)}`
            : `${lang}/tag/${taxRoute(tag)}`

        const title = tag === 'posts'
                ? (lang === 'ko' ? '글목록' : 'Posts')
                : tag.substr(0,5) === 'year:'
                ? ((lang === 'ko' ? '보관함' : 'Archives') + `: ${tag.substr(5)}`)
                :`Tag: ${tag}`;

        chunked.forEach((rels, idx) => {
            const pageUrl = idx > 0 ? `${urlBase}/page/${idx + 1}` : urlBase;
            const olderUrl = idx == totalPage - 1 ? null : `${urlBase}/page/${idx + 2}`;
            const newerUrl = idx == 0 ? null : (idx == 1) ? urlBase : `${urlBase}/page/${idx}`;

            const p = {
                data: {
                    frontmatter: {
                        title,
                        type: 'tag',
                        noIndex: true,
                        lang,
                    },
                    fields: {
                        url: pageUrl,
                        rels,
                        total: totalPage,
                        current: idx,
                        olderUrl,
                        newerUrl,
                        years: yearSummary,
                        raw: true,
                    }
                },
                value: '<!-- @template tag -->',
            }
            pages.push(p);
        });
    });

    return pages;
}

