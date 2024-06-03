export function postNeighborFriendly(nodes) {
    const recentNode = {};

    const _nodes = nodes.map(node => {
        if (node.data.frontmatter.type !== 'post') {
            return node;
        }

        const {lang} = node.data.frontmatter;
        const {url} = node.data.fields;

        if (recentNode[lang]) {
            recentNode[lang].data.fields.prev = {
                url: node.data.fields.url,
                title: node.data.frontmatter.title,
            }
        }

        node.data.fields.next = recentNode[lang] ? {
            url: recentNode[lang].data.fields.url,
            title: recentNode[lang].data.frontmatter.title,
        } : null;
        node.data.fields.prev = null;

        recentNode[lang] = node;
        return node;
    });

    return _nodes;
}

