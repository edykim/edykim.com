const baseUrl = 'https://edykim.com/'

const config = {
    outputDir: './public',
    staticDir: './static',
    contentGlob: './content/**/*.md',
    redirects: {
        baseUrl,
        templatePath: './config/_redirects',
        filename: '_redirects',
    },
    template: {
        path: 'templates',
    },
    sitemap: {
        baseUrl,
    },
    feed: {
        title: 'edykim.com 블로그 RSS 피드',
        desc: '이것저것 작성합니다.',
        baseUrl,
        count: 5,
    }
}

export default config;

