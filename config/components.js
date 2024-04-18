import {getTagTree} from './tag.js'
import {publicPostOnly, publicListablePostOnly} from './../src/filters.js'

const components = [
    {
        key: 'posts',
        template: '_insert/posts.html',
        props: (node, nodes) => ({
            nodes: publicPostOnly(nodes, node.data.frontmatter.lang)
        })
    },
    {
        key: 'tag',
        template: '_insert/posts.html',
        props: (node, nodes) => ({
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
];

export default components;

