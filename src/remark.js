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
import {visit} from 'unist-util-visit'

import {parseRoute} from './route.js'

const pipeline = unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkParseFrontmatter)
    .use(collectImages)
    .use(updateRoute)
    .use(updateImagePath)
    .use(updateYoutube)
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

function updateYoutube(options = {width: 600, height: 300}) {
    function isUrlValid(userInput) {
        const res = userInput.match(
            /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
            )
        return res != null
    }

    return (tree, file) => {
        visit(tree, 'inlineCode', node => {
            const { value } = node

            if (value.startsWith(`youtube:`)) {
                const videoUrl = value.substr(8)

                if (isUrlValid(videoUrl)) {
                    node.type = `html`
                    node.value = `<div>
                        <iframe
                            src="${videoUrl}"
                            width="${options.width}"
                            height="${options.height}"></iframe>
                    </div>`
                }
            }

        })
    }
}

export async function load(filename) {
    return pipeline.process(await read(filename));
}

