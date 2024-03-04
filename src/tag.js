import {getMappedTags} from './../config/tag.js'

const mapped = getMappedTags()
    .reduce((carry, value) => {
        if (value.url) {
            carry[value.key] = value.url;
        }
        return carry;
    }, {});

function taxRoute(tag) {
    return (`${mapped[tag] || tag}`)
        .toLowerCase()
        .replace('.net', 'dotnet')
        .replace(/[ \.]/gi, '-');
}

export function fetchTaxonomies(nodes, lang) {

    const collection = new Map();
    for (const node of nodes) {
        if (
            node.data.frontmatter.lang != lang
            || ! node.data.frontmatter.tags
        ) {
            continue;
        }

        for(const tag of node.data.frontmatter.tags) {
            const col = collection.get(tag) || [];
            col.push(node);
            collection.set(tag, col);
        }
    }

    return Array.from(collection.keys()).map(tag => {
        return {
            data: {
                frontmatter: {
                    title: `Tag: ${tag}`,
                    type: 'tag',
                    lang,
                },
                fields: {
                    url: `${lang}/tag/${taxRoute(tag)}`,
                    rels: collection.get(tag),
                }
            },
            value: '<!-- @template tag -->',
        }
    });
}

