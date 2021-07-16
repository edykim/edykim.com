const path = require("path")

const siteUrl = `https://edykim.com/`

module.exports = {
  siteMetadata: {
    title: `edykim`,
    author: {
      name: `Edward Kim`,
      summary: `who loves to make web services and useful tools.`,
    },
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    siteUrl,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-root-import`,
      options: {
        "~": path.join(__dirname, "src"),
        "@": __dirname,
      },
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/content`,
      },
    },
    `edykim-plugin-url`,
    {
      resolve: `edykim-plugin-taxonomy`,
      options: require(`./config/taxonomy`),
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `edykim`,
        short_name: `edykim`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#a0d6db`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-gatsby-cloud`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1200,
              quality: 80,
            },
          },
          {
            resolve: "gatsby-remark-embed-youtube",
            options: {
              width: 800,
              height: 300,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-katex`,
        ],
      },
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /assets/, // See below to configure properly
        },
      },
    },
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-catch-links`,
      options: {
        excludePattern: /(excluded-link|external)/,
      },
    },
    `edykim-plugin-redirect-json`,
    require("./config/ko/feeds"),

    `gatsby-plugin-netlify`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        excludes: [
          `/ko/micro/`,
          `/ko/archives/**`,
          `/ko/micro/**`,
          `/ko/category/**`,
          `/ko/tag/**`,
        ],
        resolveSiteUrl: () => siteUrl,
        filterPages: (page, _, { withoutTrailingSlash, resolvePagePath }) => {
          return (
            withoutTrailingSlash(resolvePagePath(page)).indexOf("/ko") !== 0
          )
        },
        output: "/ko/sitemap",
        query: `
          {
            allSitePage {
              nodes {
                path
              }
            }
        }`,
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        excludes: [`/ko`, `/ko/**`],
        resolveSiteUrl: () => siteUrl,
        output: "/sitemap",
        query: `
          {
            allSitePage {
              nodes {
                path
              }
            }
        }`,
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
