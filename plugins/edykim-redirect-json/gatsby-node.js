const path = require(`path`)
const urlResolve = require(`url`).resolve

const fs = require(`fs`)
const pify = require(`pify`)
const mkdirp = require(`mkdirp`)
const config = require(`./../../gatsby-config`)

const writeFile = pify(fs.writeFile)

const runQuery = (handler, query) =>
  handler(query).then(r => {
    if (r.errors) {
      throw new Error(r.errors.join(`, `))
    }

    return r.data
  })

exports.onPostBuild = async ({ graphql, actions }) => {
  const query = `
  {
    redirects: allMarkdownRemark {
      edges {
        node {
          frontmatter {
            private
            draft
            history {
              from
            }
          }
          fields {
            url
          }
        }
      }
    }
  }`

  const filename = `redirect.json`
  const publicPath = `./public`
  const { createRedirect } = actions

  const result = await runQuery(graphql, query)

  var redirects = []
  result.redirects.edges.forEach(({ node }) => {
    if (node.frontmatter.private || node.frontmatter.draft) return
    if (!node.frontmatter.history || node.frontmatter.history.length === 0)
      return

    const to = urlResolve(config.siteMetadata.siteUrl, node.fields.url)
    const result = node.frontmatter.history.map(v => ({
      from: v.from,
      to,
    }))

    redirects = redirects.concat(result)
  })

  const outputPath = path.join(publicPath, filename)
  const outputDir = path.dirname(publicPath)
  if (!fs.existsSync(outputDir)) {
    mkdirp.sync(outputDir)
  }

  await writeFile(outputPath, JSON.stringify(redirects, null, 2))

  redirects.forEach(redirect => {
    createRedirect({
      fromPath: redirect.from,
      toPath: redirect.to,
      isPermanent: false,
    })
  })

  console.log(`${redirects.length} of redirections generated. (${outputPath})`)

  return Promise.resolve()
}
