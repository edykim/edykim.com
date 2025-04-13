import rehypeStringify from 'rehype-stringify'
import remarkFrontmatter from 'remark-frontmatter'
import remarkParseFrontmatter from 'remark-parse-frontmatter'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkImages from 'remark-images'
import rehypeSlug from 'rehype-slug'
import {unified} from 'unified'
import {read} from 'to-vfile'
import {selectAll} from 'unist-util-select'
import {h} from 'hastscript'
import {visit} from 'unist-util-visit'

import {parseRoute} from './route.js'
import getUuidByString from 'uuid-by-string'

const pipeline = unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkParseFrontmatter)
    .use(remarkDirective)
    .use(updateHtmlDirectives)
    .use(tableWrapper)
    .use(collectImages)
    .use(updateRoute)
    .use(updateBookmark)
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
        node.data.fields.urlUuid = getUuidByString('ed059c22a9e8' + url);
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

// ref: https://unifiedjs.com/explore/package/remark-directive/
function updateHtmlDirectives() {
    return function (tree) {
        visit(tree, function (node) {
            if (
                node.type === 'containerDirective' ||
                node.type === 'leafDirective' ||
                node.type === 'textDirective'
            ) {
                const data = node.data || (node.data = {})
                const hast = h(node.name, node.attributes || {})

                data.hName = hast.tagName
                data.hProperties = hast.properties
            }
        })
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

function parseAttributes(attributeString) {
  const result = {}
  const classNames = []
  // Match: .class, #id, or key=value
  const regex = /([.#]?\w[\w-]*)(?:=(("[^"]*")|('[^']*')|([^'" ]+)))?/g
  let match

  while ((match = regex.exec(attributeString)) !== null) {
    const [raw, key, , doubleQuoted, singleQuoted, unquoted] = match

    if (key.startsWith('.')) {
      classNames.push(key.slice(1))
    } else if (key.startsWith('#')) {
      result.id = key.slice(1)
    } else {
      let value = doubleQuoted || singleQuoted || unquoted || ''
      value = value.replace(/^['"]|['"]$/g, '') // remove any surrounding quotes
      result[key] = value
    }
  }

  if (classNames.length > 0) {
    result.class = classNames.join(' ')
  }

  return result
}

function updateBookmark() {
    return (tree, file) => {
        visit(tree, 'link', function (node, index, parent) {
            if (!parent || !Array.isArray(parent.children)) return;

            const next = parent.children[index + 1];
            if (
                next &&
                next.type === 'text' &&
                /^\{\s*[\w\-]+=[^}]+\s*\}$/.test(next.value)
            ) {
                const attrText = next.value.trim().slice(1, -1);
                const attributes = parseAttributes(attrText);

                node.data = node.data || {};
                node.data.hProperties = {
                    ...node.data.hProperties,
                    ...attributes,
                };

                parent.children.splice(index + 1, 1);
            }
        })
    }
}

function tableWrapper() {
    return function (tree) {
        visit(tree, "table", function (node, index, parent) {
            let data = {};
            if (node.data) {
                data = node.data;
            }
            node.data = Object.assign({}, {
                hProperties: {
                    className: 'content-table'
                }
            }, data)

            parent.children[index] = {
                type: 'container',
                children: [
                    node
                ],
                data: {
                    hName: 'div',
                    hProperties: {
                        className: 'content-table-wrapper'
                    },
                },
            }

        })
    }
}

export async function load(filename) {
    return pipeline.process(await read(filename));
}

