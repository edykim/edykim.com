import {getTagTree} from './tag.js'
import {publicPostOnly, publicListablePostOnly, hasTag} from './../src/filters.js'

const components = [
    {
        key: 'posts',
        template: '_insert/posts.html',
        props: (node, nodes) => ({
            node,
            nodes: publicPostOnly(nodes, node.data.frontmatter.lang)
        })
    },
    {
        key: 'tag',
        template: '_insert/posts.html',
        props: (node, nodes) => ({
            node,
            nodes: publicListablePostOnly(node.data.fields.rels, node.data.frontmatter.lang)
        })
    },
    {
        key: 'tags',
        template: '_insert/tags.html',
        props: (node, nodes) => ({
            tags: getTagTree()
        })
    },
    {
        key: 'years',
        template: '_insert/years.html',
        props: (node, nodes) => ({
            node,
        })
    },
    {
        key: 'profile',
        template: '_insert/profile.html',
        props: (node, nodes) => ({
            node,
        })
    },
    {
        key: 'searchbar',
        template: '_insert/searchbar.html',
        props: (node, nodes) => ({
            node,
        })
    },
    {
        key: 'post-list',
        template: '_insert/post-list.html',
        props: (node, nodes, args) => {
            let opts = {};
            try {
                opts = JSON.parse(args);
            } catch (e) {}

            const _nodes = opts.publicOnly
                ? publicPostOnly(nodes, node.data.frontmatter.lang)
                : publicListablePostOnly(nodes, node.data.frontmatter.lang)

            let __nodes = opts.tag ? hasTag(_nodes, opts.tag) : _nodes;

            if (opts.limit) {
                __nodes = __nodes.slice(0, opts.limit)
            }

            return {
                node,
                nodes: __nodes,
            }
        },
    },
    {
        key: 'list-nav',
        template: '_insert/list-nav.html',
        props: (node, nodes) => ({
            node,
        })
    },
];

export default components;

