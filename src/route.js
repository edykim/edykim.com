export function parseRoute(file) {
    let ps = [];
    const frontmatter = file.data.frontmatter;

    if (frontmatter.lang != 'en') {
        ps.push(frontmatter.lang);
    }

    if (frontmatter.url) {
        ps.push(frontmatter.url);
    } else {
        if (frontmatter.type != 'page') {
            ps.push(frontmatter.type);
        }
        ps.push(frontmatter.slug);
    }

    let result = ps.filter(v => v).join('/')
        .replace(/\/[\/]+/gi, '/')
        .replace(/(^\/|\/$)/gi, '');

    if (! /\.html/.test(result)) {
        result = result.replace(/\./gi, '-');
    }

    return result;
}

