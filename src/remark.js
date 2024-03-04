import rehypeStringify from 'rehype-stringify'
import remarkFrontmatter from 'remark-frontmatter'
import remarkParseFrontmatter from 'remark-parse-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkImages from 'remark-images'
import rehypeSlug from 'rehype-slug'
import {unified} from 'unified'
import {read} from 'to-vfile'
import {selectAll} from 'unist-util-select'

import {parseRoute} from './route.js'

const pipeline = unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkParseFrontmatter)
    .use(collectImages)
    .use(updateRoute)
    .use(updateImagePath)
    .use(remarkGfm)
    .use(remarkRehype, {allowDangerousHtml: true})
    .use(rehypeStringify, {allowDangerousHtml: true})
    .use(rehypeSlug)

function collectImages() {
    return (tree, file) => {
        file.data.images = selectAll('image', tree)
    }
}

function updateRoute() {
    return (tree, node) => {
        node.data.fields = node.data.fields || {};

        const url = parseRoute(node);
        node.data.fields.url = url;
    }
}

function updateImagePath() {
    return (tree, file) => {
        function updater(node) {
            if (node.type === 'image') {
                return {
                    ...node,
                    url: node.url.indexOf(':') !== -1
                    ? node.url
                    : ('/' + file.data.fields.url + '/' + node.url)
                }
            }
            return node;
        }

        function itr(t) {
            for(const i in t.children) {
                t.children[i] = itr(t.children[i]);
            }
            return updater(t);
        }

        tree.children = tree.children.map(t => itr(t));
    }
}


export async function load(filename) {
    return pipeline.process(await read(filename));
}

