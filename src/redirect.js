import fs from 'fs'
import path from 'path'
import {mkdirp} from 'mkdirp'

export function createRedirects({baseUrl, templatePath, filename}) {
    const redirectsContent = fs.readFileSync(templatePath, {encoding: 'utf-8'});

    return (nodes, outputDir) => {
        const redirects = [];
        for(const node of nodes) {
            if (! node.data.frontmatter?.history) continue;

            for(const url of node.data.frontmatter.history) {
                if (url.from !== '') {
                    redirects.push([url.from, baseUrl + node.data.fields.url]);
                }
            }
        }

        // netlify format
        const output = redirects
            .filter(v => ! v[0].startsWith('http://') && ! v[0].startsWith('https://'))
            .map(v => [...v, '302!'].join('\t'))
            .join('\n');

        const generated = redirectsContent.replace('## generated', output);

        fs.writeFileSync(path.join(outputDir, filename), generated);

        externalWebsiteRedirects(nodes, baseUrl, outputDir);
    }
}

async function externalWebsiteRedirects(nodes, baseUrl, outputDir) {
    for (const node of nodes) {
        if (! node.data.frontmatter?.history) continue;
        for(const url of node.data.frontmatter.history) {
            if (url.from !== '' && url.from.includes('://')) {
                const fromUrl = url.from.split('://')[1];
                const fromPath = path.join(outputDir, '__redirects', fromUrl);
                await mkdirp(fromPath);
                const moveTo = baseUrl + node.data.fields.url;
                fs.writeFileSync(path.join(fromPath, 'index.html'), `<!doctype html>
<html lang="${node.data.frontmatter.lang}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="refresh" content="0;url=${moveTo}">
    <title>${node.data.frontmatter.lang === 'ko' ? '페이지 이동' : 'Page moved'}</title>
</head>
<body>
    ${
        node.data.frontmatter.lang === 'ko'
            ? `<p>이 페이지는 새로운 주소로 이동했습니다.</p>
               <p>자동으로 이동하지 않는 경우 <a href="${moveTo}">여기를 클릭하여 이동하세요.</a></p>`
            : `<p>This page has moved to a new location.</p>
               <p>If you are not redirected automatically, <a href="${moveTo}">continue to the new page</a>.</p>`
    }
</body>
</html>
                `);
            }
        }
    }
}
