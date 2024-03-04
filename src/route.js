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

    return ps.filter(v => v).join('/')
        .replace(/\/[\/]+/gi, '/')
        .replace(/\./gi, '-')
        .replace(/(^\/|\/$)/gi, '');
}

