import fs from 'fs'
import {mkdirp} from 'mkdirp'

export function createSitemap(config) {
    return async (nodes, path, outputDir) => {
        await mkdirp(`${outputDir}${path}`);
        fs.writeFileSync(`${outputDir}${path}/sitemap-index.xml`,
            `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${config.baseUrl}${path.substr(1)}/sitemap-0.xml</loc></sitemap></sitemapindex>`);


        fs.writeFileSync(`${outputDir}${path}/sitemap-0.xml`,
            `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
            ${nodes.map(node => `<url><loc>${config.baseUrl}${node.data.fields.url}</loc><changefreq>daily</changefreq><priority>0.7</priority></url>`).join('\n')}</urlset>`);

        console.log("Generate sitemap on", path, "with", nodes.length, "nodes");
    }
}

