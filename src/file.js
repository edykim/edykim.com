import fsExtra from 'fs-extra'
import fs from 'fs'
import {mkdirp} from 'mkdirp'
import path from 'path'
import {glob} from 'glob'
import {createHash} from 'crypto'
import {load} from './remark.js'

export function setupStatic(src, dest) {
    fsExtra.copy(src, dest);
}

export async function loadNodesFromGlob(globPath) {
    const nodes = [];
    const mdFiles = await glob(globPath);

    // prepare all files
    for (const filepath of mdFiles) {
        const node = await load(filepath);

        node.data.frontmatter.title = parseTitle(node);
        node.data.fields.excerpt = parseExcerpt(node);
        node.data.fields.filePath = filepath;
        nodes.push(node);
    }
    return nodes;
}

export function createPages({nodes, template}) {
    return async (_nodes, outputDir) => {
        let cache = {};
        try {
            cache = JSON.parse(
                fs.readFileSync(
                    `${outputDir}/.cache.json`, {encoding: 'utf-8'}));
            console.log(`cache loaded: ${Object.keys(cache).length} entries`);
        } catch(e) {
        }

        for (const node of _nodes) {
            const dir = path.join(outputDir, node.data.fields.url);
            await mkdirp(dir);

            const page = template(node, nodes);
            const hash = createHash('sha256').update(page).digest('hex');
            const filePath = `${dir}/index.html`;

            if (cache[filePath] === hash) {
                continue;
            }

            fs.writeFile(filePath, page, err => {
                if (err) {
                    console.error(err);
                }
                cache[filePath] = hash;
            });
        }

        storeCache(`${outputDir}/.cache.json`, cache);
    }
}

export function storeCache(filePath, cache) {
    fs.writeFileSync(filePath, JSON.stringify(cache));
}

function parseTitle(node) {
    if (node.data.frontmatter?.title) {
        return node.data.frontmatter.title;
    }
    if (node.data.frontmatter?.lang == 'ko') {
        const date = new Date(node.data.frontmatter.date.substr(0, 10));
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 메모`;
    }
    return '#';
}

function parseExcerpt(node) {
    const excerpt = node.value
        .substr(0, 80)
        .replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "")
        .trim();

    if (excerpt) {
        return excerpt + '...';
    }
    return excerpt;
}

