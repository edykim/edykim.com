const path = require("path")

const siteUrl = `https://edykim.com/`

module.exports = {
  siteMetadata: {
    title: `edykim`,
    author: {
      name: `Edward Kim`,
      summary: `who loves to make web services and useful tools.`,
    },
    description: `Hello, I'm Edward. I'm writing about the web, tech, and my journey. Good to see you here!`,
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
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-gatsby-cloud`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `edykim-remark-directive`,
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
          {
            resolve: `gatsby-remark-copy-linked-files`,
            options: {
              ignoreFileExtensions: [`png`, `jpg`, `jpeg`, `bmp`, `tiff`],
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
          `!/ko/**`,
          `/ko/micro/`,
          `/ko/archives/**`,
          `/ko/micro/**`,
          `/ko/category/**`,
          `/ko/tag/**`,
        ],
        resolveSiteUrl: () => siteUrl,
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
