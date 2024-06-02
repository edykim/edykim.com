import {getTagTree} from './tag.js'
import {publicPostOnly, publicListablePostOnly} from './../src/filters.js'

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
];

export default components;

