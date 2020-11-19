const path = require("path")
const createSocialCardTemplate = require("./config/socialCardTemplate")

const desc = `문제를 해결하기 위해 작고 단단한 코드를 작성하는 일을 합니다.`
const profile = `${desc} 웹의 자유로운 접근성을 좋아합니다. 프로그래밍 언어, 소프트웨어 아키텍처, 커뮤니티에 관심이 많습니다.`

const siteMetadata = {
  title: `매일 성장하기`,
  author: `김용균`,
  description: desc,
  profile,
  siteUrl: `https://edykim.com/ko/`,
  siteUrlForSitemap: `https://edykim.com`,
  social: {
    github: `edykim`,
    twitter: `haruair`,
    linkedin: `edwardykim`,
  },
}

module.exports = {
  pathPrefix: `/ko`,
  siteMetadata,
  plugins: [
    {
      resolve: `gatsby-plugin-root-import`,
      options: {
        components: path.join(__dirname, "src", "components"),
        styles: path.join(__dirname, "src", "styles"),
        config: path.join(__dirname, "config"),
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: process.env.GOSARI_CONTENT_PATH || `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1024,
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
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              className: `title-anchor`,
            },
          },
          `gatsby-remark-attr`,
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-126646768-1",
        head: false,
        respectDNT: true,
        sampleRate: 5,
        siteSpeedSampleRate: 10,
        cookieDomain: "edykim.com",
      },
    },
    require("./config/feed"),
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `매일 성장하기`,
        short_name: `매일 성장하기`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#6700ee`,
        display: `minimal-ui`,
        icon: `content/assets/edykim-icon.png`,
      },
    },
    `gatsby-plugin-remove-serviceworker`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `@edykim/gatsby-plugin-url`,
      options: {
        targetTypes: [`MarkdownRemark`, `SocialCard`],
        urlHandler: ({ node }, { slugFieldName }) => {
          if (node.internal.type === `SocialCard`) {
            return null
          }

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
    // {
    //   resolve: `@edykim/gatsby-plugin-social-card`,
    //   options: {
    //     targetNodeFilter: node => {
    //       return (
    //         node.frontmatter &&
    //         node.frontmatter.type === "post" &&
    //         node.frontmatter.draft !== true &&
    //         node.frontmatter.private !== true
    //       )
    //     },
    //     targetElement: "body > div",
    //     createCardHtml: createSocialCardTemplate(siteMetadata),
    //     puppeteerQueueSize: 8,
    //   },
    // },
    `@edykim/gatsby-plugin-redirect-json`,
    `@edykim/gatsby-plugin-template`,
    {
      resolve: `@edykim/gatsby-plugin-taxonomy`,
      options: require(`./config/taxonomy`),
    },
    {
      resolve: `gatsby-plugin-catch-links`,
      options: {
        excludePattern: /(static)/,
      },
    },
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-netlify`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        exclude: [
          `/micro/`,
          `/archives/*`,
          `/micro/*`,
          `/category/*`,
          `/tag/*`,
        ],
        query: `
          {
            site {
              siteMetadata {
                siteUrl: siteUrlForSitemap
              }
            }
            allSitePage {
              edges {
                node {
                  path
                }
              }
            }
        }`,
      },
    },
    `gatsby-plugin-netlify-cache`,
  ],
}
