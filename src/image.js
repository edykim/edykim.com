import fs from 'fs'
import path from 'path'
import {mkdirp} from 'mkdirp'

export async function copyImages(nodes, outputDir) {
    for (const node of nodes) {
        if (! node.data.images) continue;
        for (const image of node.data.images) {
            if (image.url.indexOf(':') !== -1) {
                continue;
            }
            const dir = path.join(outputDir, node.data.fields.url)
            await mkdirp(dir);
            const subdir = path.dirname(path.join(dir, image.url))
            await mkdirp(subdir);

            fs.copyFile(
                path.join(path.dirname(node.data.fields.filePath), image.url),
                path.join(dir, image.url),
                err => {
                    if (err) throw err;
                });
        }
    }
}

