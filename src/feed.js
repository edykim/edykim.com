import fs from 'fs'
import esc from 'lodash.escape'
import moment from 'moment'
import {mkdirp} from 'mkdirp'

export function createFeed(config) {
    return async (nodes, {path, name}, outputDir) => {
        await mkdirp(`${outputDir}${path}`);

        fs.writeFileSync(`${outputDir}${path}/feed.xml`,
            `<?xml version="1.0" encoding="UTF-8"?>
            <rss xmlns:dc="http://purl.org/dc/elements/1.1/"
                 xmlns:content="http://purl.org/rss/1.0/modules/content/"
                 xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
                <channel>
                    <title><![CDATA[${config.title}: ${name}]]></title>
                    <description><![CDATA[${config.desc}]]></description>
                    <link>${config.baseUrl}</link>
                    <generator>edykim.com</generator>
                    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
                    ${nodes.slice(0, config.count).map(node => `
                    <item>
                        <title><![CDATA[${node.data.frontmatter.title}]]></title>
                        <description><![CDATA[${node.data.fields.excerpt}]]></description>
                        <link>${config.baseUrl}${node.data.fields.url}/</link>
                        <guid isPermaLink="false">${config.baseUrl}${node.data.fields.url}/</guid>
                        <pubDate>${moment(node.data.frontmatter.date).toDate().toUTCString()}</pubDate>
                        <content:encoded>${esc(node.value)}</content:encoded>
                    </item>
                    `).join('\n')}
                </channel>
            </rss>
            `);
    }
}

