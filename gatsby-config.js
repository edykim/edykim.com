module.exports = {
  siteMetadata: {
    title: 'Here, Edward 👨🏻‍💻',
    author: 'Edward Kim',
    description: 'A blog talking about web and life.',
    keywords: 'web lover, software developer, translator',
    siteUrl: 'https://edykim.com',
    prefetchedDomains: [
      '//www.haruair.com',
      '//edykim.com',
      '//secure.gravatar.com',
      '//fonts.googleapis.com',
      '//s.w.org',
    ],
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/content/`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'src',
        path: `${__dirname}/src/pages/`,
      },
    },
    require('./config/feed.js'),
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'edykim.com',
        short_name: 'edykim',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/gatsby-icon.png', // This path is relative to the root of the site.
      },
    },
    'gatsby-plugin-offline',
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: null,
              aliases: {},
            },
          },
        ],
      },
    },
    'gatsby-plugin-catch-links',

    // generate sitemap file for google webmaster tool
    'gatsby-plugin-sitemap',

    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-126646768-1',
        head: false,
        respectDNT: true,
        sampleRate: 5,
        siteSpeedSampleRate: 10,
        cookieDomain: 'edykim.com',
      },
    },

    `edykim-url`,
    `edykim-redirect-json`,
    `edykim-template`,
    {
      resolve: `edykim-taxonomy`,
      options: require(`./config/taxonomy`),
    },
    `gatsby-plugin-netlify`,
    `gatsby-plugin-twitter`,
    `edykim-plugin-instagram`,
  ],
}
