module.exports = {
  siteMetadata: {
    title: `edykim.com`,
    description: `I'm an open web developer who loves focusing on problems and creating quick prototypes. I'm excited about web technology, software architecture and community.`,
    author: `@edykim`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: process.env.WATTLE_CONTENT_PATH || `${__dirname}/content`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },

    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `edykim.com`,
        short_name: `edykim.com`,
        start_url: `/`,
        background_color: `#6700ee`,
        theme_color: `#6700ee`,
        display: `minimal-ui`,
        icon: `src/images/edykim-icon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-remove-serviceworker`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // 'gatsby-plugin-offline',

    {
      resolve: `@edykim/gatsby-plugin-url`,
      options: {
        urlHandler: ({ node }, { slugFieldName }) => {
          let url = node.fields[slugFieldName]

          if (node.frontmatter) {
            if (node.frontmatter.url) {
              url = node.frontmatter.url
            } else if (node.frontmatter.slug) {
              if (node.frontmatter.type !== `page`) {
                url = `${node.frontmatter.type}/${node.frontmatter.slug}`
              } else {
                url = `${node.frontmatter.slug}`
              }
            }
          }

          // clean up double slashes
          url = url.replace(/\/\//g, `/`)

          // add trailing slash
          if (url.substr(-1) !== `/`) url += `/`
          return url
        },
      },
    },
    {
      resolve: `@edykim/gatsby-plugin-template`,
      options: {
        query: `{
          pages: allMarkdownRemark(
            sort: { fields: [frontmatter___date], order: DESC }
          ) {
            edges {
              node {
                excerpt(format: PLAIN, truncate: true)
                frontmatter {
                  type
                  lang
                  title
                  date(formatString: "MMMM DD, YYYY")
                }
                fields {
                  slug
                  url
                }
              }
            }
          }
        }`,
      },
    },
  ],
}
