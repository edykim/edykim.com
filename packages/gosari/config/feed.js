const { URL } = require("url")
const { join } = require("path")

const createUrl = (base, rest) => {
  const u = new URL(base)
  u.pathname = join(u.pathname, rest)
  return u.toString()
}

const serialize = ({ query: { site, allMarkdownRemark } }) => {
  return allMarkdownRemark.edges.map(edge => {
    const u = createUrl(
      site.siteMetadata.siteUrl,
      edge.node.fields.url || edge.node.fields.slug
    )

    return Object.assign({}, edge.node.frontmatter, {
      description: edge.node.excerpt,
      date: edge.node.frontmatter.date,
      url: u,
      guid: u,
      custom_elements: [{ "content:encoded": edge.node.html }],
    })
  })
}

module.exports = {
  resolve: `gatsby-plugin-feed`,
  options: {
    query: `
      {
        site {
          siteMetadata {
            title
            description
            siteUrl
            site_url: siteUrl
          }
        }
      }
    `,
    feeds: [
      {
        serialize,
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
            allMarkdownRemark(
              limit: 5,
              sort: { order: DESC, fields: [frontmatter___date] },
              filter: {frontmatter: { draft: { ne: true }, private: {ne: true}, type: {eq: "post"}, lang: {eq: "ko"} }}
            ) {
              edges {
                node {
                  excerpt
                  html
                  fields {
                    slug
                    url
                  }
                  frontmatter {
                    title
                    date
                  }
                }
              }
            }
          }
        `,
        output: "feed.xml",
        title: "edykim.com 블로그 RSS 피드",
      },
    ],
  },
}
