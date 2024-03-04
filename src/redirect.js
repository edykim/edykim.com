import fs from 'fs'
import path from 'path'

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
            .map(v => [...v, '302!'].join('\t'))
            .join('\n');

        const generated = redirectsContent.replace('## generated', output);

        fs.writeFileSync(path.join(outputDir, filename), generated);
    }
}

