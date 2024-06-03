export function latestFirst(nodes) {
    return nodes.sort((a, b) => ! a.data.frontmatter.date
        ? -1
        : ! b.data.frontmatter.date
        ? 1
        : -a.data.frontmatter.date?.localeCompare(b.data.frontmatter.date))
}

