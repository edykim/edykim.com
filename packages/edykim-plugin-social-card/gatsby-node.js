const path = require(`path`)
const puppeteer = require('puppeteer')
const template = require('./template')

const opts = {
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  headless: true,
}

const resolution = {
  width: 1200,
  height: 628,
}

exports.createPages = async ({ actions, graphql }, pluginOptions) => {
  const browser = await puppeteer.launch(opts)

  const query = `
  {
    site {
      siteMetadata {
        siteUrl
        title
        author
      }
    }
    posts: allMarkdownRemark(filter: {
      frontmatter: {
        private: { ne: true }
        draft: { ne: true }
        type: { eq: "post" }
      }
    }) {
      edges {
        node {
          frontmatter {
            title
            headline
          }
          fields {
            slug
            url
          }
        }
      }
    }
  }`

  const {
    data: {
      site: { siteMetadata },
      posts: { edges },
    },
  } = await graphql(query)

  const page = await browser.newPage()
  await page.setViewport({ ...resolution, deviceScaleFactor: 2 })
  await page.setContent(template({ ...siteMetadata }), {
    waitUntil: 'networkidle0',
  })
  await page.waitFor('body > div')
  const section = await page.$('body > div')

  for (let i = 0; i < edges.length; i++) {
    const {
      node: {
        frontmatter: { title, headline },
        fields: { url },
      },
    } = edges[i]

    await page.evaluate(
      ({ title, headline }) => {
        setCard(title, headline)
      },
      { title, headline }
    )
    await section.screenshot({
      path: './' + path.join('public', url, 'social.png'),
    })
  }
  await browser.close()
}
