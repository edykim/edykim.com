const path = require(`path`)
const fs = require("fs")
const groupby = require("lodash.groupby")
const memoize = require("lodash.memoize")

const getItemKey = item => `${item.frontmatter.lang}-${item.frontmatter.type}`

const getItemKeyWithTags = item => `${item.frontmatter.lang}-${item.frontmatter.type}${
  item.frontmatter?.tags?.length > 0 ? '-' + item.frontmatter?.tags[0] : ''}`
  
const _getTemplatePath = (lang, type) => {
  if (lang !== "en") {
    const langTypeTemplatePath = path.resolve(
      `./src/templates/${lang}/${type}.js`
    )
    if (fs.existsSync(langTypeTemplatePath)) return langTypeTemplatePath
  }

  const typeTemplatePath = path.resolve(`./src/templates/${type}.js`)
  if (fs.existsSync(typeTemplatePath)) return typeTemplatePath

  // default template
  return path.resolve(`./src/templates/page.js`)
}

const getTemplatePath = memoize(
  _getTemplatePath,
  (lang, type) => `${lang}_${type}`
)

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Define a template for blog post
  const blogPost = path.resolve(`./src/templates/blog-post.js`)

  // Get all markdown blog posts sorted by date
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          filter: {
            frontmatter: { private: { ne: true }, draft: { ne: true } }
          }
          sort: { fields: [frontmatter___date], order: ASC }
          limit: 1000
        ) {
          nodes {
            id
            frontmatter {
              type
              lang
              contentType
              tags
            }
            fields {
              slug
              url
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const items = result.data.allMarkdownRemark.nodes

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL
  if (items.length > 0) {
    const sortedItems = groupby(items, getItemKeyWithTags)

    Object.keys(sortedItems).forEach(key => {
      const _items = sortedItems[key]

      _items.forEach((item, index) => {
        const beforePreviousItemId = _items?.[index - 2]?.id
        const previousItemId = _items?.[index - 1]?.id
        const nextItemId = _items?.[index + 1]?.id
        const afterNextItemId = _items?.[index + 2]?.id

        const context = {
          id: item.id,
          type: item.frontmatter?.type,
          lang: item.frontmatter?.lang,
          tags: item.frontmatter?.tags || [],
          contentType: item.frontmatter?.contentType,
          previousItemId,
          nextItemId,
          beforePreviousItemId,
          afterNextItemId,
        }

        createPage({
          path: item.fields.url,
          component: getTemplatePath(
            item.frontmatter.lang,
            item.frontmatter.type
          ),
          context,
        })
      })
    })

    // create blog-list pages
    const sortedItemsByTypes = groupby(items, getItemKey)
    const blogPages = sortedItemsByTypes['ko-post']
    const postsPerPage = 6
    const numPages = Math.ceil(blogPages.length / postsPerPage)
    Array.from({ length: numPages }).forEach((_, i) => {
      createPage({
        path: i === 0 ? `/ko/post/` : `/ko/post/page/${i + 1}`,
        component: path.resolve("./src/templates/ko/post-list.js"),
        context: {
          lang: 'ko',
          contentType: 'post',
          limit: postsPerPage,
          skip: i * postsPerPage,
          numPages,
          currentPage: i + 1,
        },
      })
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }
    type Author {
      name: String
      summary: String
    }
    type Social {
      twitter: String
    }
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }
    type Frontmatter {
      title: String
      description: String
      type: String
      lang: String
      url: String
      date: Date @dateformat
      tags: [String]
      noIndex: Boolean
    }
    type Fields {
      slug: String
    }
  `)
}
