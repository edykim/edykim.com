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
                  fields { slug }
                  frontmatter {
                    title
                    date
                  }
                }
              }
            }
          }
        `,
        output: '/ko/feed.xml',
        title: 'edykim.com 블로그 RSS 피드',
      },
      {
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
              filter: {frontmatter: { draft: { ne: true }, private: {ne: true}, type: {eq: "post"}, lang: {eq: "en"} }}
            ) {
              edges {
                node {
                  excerpt
                  html
                  fields { slug }
                  frontmatter {
                    title
                    date
                  }
                }
              }
            }
          }
        `,
        output: '/feed.xml',
        title: 'edykim.com RSS Feed',
      },
    ],
  },
}
