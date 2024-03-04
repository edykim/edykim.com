import {copyImages} from './image.js'
import {loadNodesFromGlob, createPages, setupStatic} from './file.js'
import {createRedirects} from './redirect.js'
import {publicOnly, publicNodeOnly, publicPostOnly, hasTag} from './filters.js'
import {fetchTaxonomies} from './tag.js'
import {templateFactory} from './template.js'
import {createSitemap} from './sitemap.js'
import {latestFirst} from './sort.js'
import {createFeed} from './feed.js'

import config from './../config/config.js'
import {getMappedTags} from './../config/tag.js'

const {outputDir, staticDir, contentGlob} = config;

// setup with static as init
setupStatic(staticDir, outputDir);

const nodes = latestFirst( publicOnly( await loadNodesFromGlob(contentGlob) ) );
const template = await templateFactory(config.template);
const CreatePages = createPages({nodes, template});

[
    CreatePages,
    copyImages,
    createRedirects(config.redirects),
    // generate sitemap

].forEach(f => f(nodes, outputDir));

// taxonomy pages
const tagNodes = fetchTaxonomies(nodes, 'ko');
[
    CreatePages,
].forEach(f => f(tagNodes, outputDir));

// sitemap
const CreateSitemap = createSitemap(config.sitemap);
CreateSitemap(publicNodeOnly(nodes, 'ko'), '/ko/sitemap', outputDir);
CreateSitemap(publicNodeOnly(nodes, 'en'), '/sitemap', outputDir);

// rss
const CreateFeed = createFeed(config.feed);
const feedNodes = publicPostOnly(nodes, 'ko');
CreateFeed(feedNodes, {path: '/ko'}, outputDir);

getMappedTags().forEach(tag => {
    const taggedNodes = hasTag(feedNodes, tag.key);
    if (taggedNodes.length == 0) {
        return;
    }
    CreateFeed(taggedNodes, {path: `/ko/${tag.url}`, name: tag.key}, outputDir);
});

// SEO: meta tag on template

