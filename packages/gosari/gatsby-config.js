module.exports = {
  pathPrefix: `/ko`,
  siteMetadata: {
    title: `매일성장하기`,
    author: `김용균`,
    description: `A starter blog demonstrating what Gatsby can do.`,
    profile: `문제를 해결하기 위해 작고 단단한 코드를 작성하는 일을 합니다. 웹의 자유로운 접근성을 좋아합니다. 프로그래밍 언어, 소프트웨어 아키텍처, 커뮤니티에 관심이 많습니다.`,
    siteUrl: `https://edykim.com/ko/`,
    social: {
      github: `edykim`,
      twitter: `haruair`,
      linkedin: `edwardykim`,
    },
  },
  plugins: [
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
        name: `매일성장하기`,
        short_name: `매일성장하기`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `content/assets/gatsby-icon.png`,
      },
    },
    // `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
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
    `@edykim/gatsby-plugin-redirect-json`,
    `@edykim/gatsby-plugin-template`,
    {
      resolve: `@edykim/gatsby-plugin-taxonomy`,
      options: require(`./config/taxonomy`),
    },
    `gatsby-plugin-styled-components`,
  ],
}
