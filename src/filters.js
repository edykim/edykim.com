export function publicOnly(nodes) {
    return nodes.filter(node => !node.data.frontmatter.private &&
        !node.data.frontmatter.draft)
}

export function publicPostOnly(nodes, lang) {
    return nodes.filter(node => node.data.frontmatter.type === 'post'
        && node.data.frontmatter.lang === lang
        && !node.data.frontmatter.private
        && !node.data.frontmatter.draft
        && !node.data.frontmatter.noIndex)
}

export function publicNodeOnly(nodes, lang) {
    return nodes.filter(node => node.data.frontmatter.lang === lang
        && !node.data.frontmatter.private
        && !node.data.frontmatter.draft
        && !node.data.frontmatter.noIndex)
}

export function hasTag(nodes, tag) {
    return nodes.filter(node => node.data.frontmatter.tags?.includes(tag))
}

