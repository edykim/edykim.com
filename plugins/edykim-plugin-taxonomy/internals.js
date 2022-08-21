const path = require(`path`)
const { uniq, groupBy } = require("lodash")

const sanitizeUrl = require("./utils").sanitizeUrl
exports.sanitizeUrl = sanitizeUrl

const languagePrefix = lang => {
  return lang !== `en` ? `/${lang}` : ``
}

exports.languagePrefix = languagePrefix

const createTaxonomyPage = (taxonomy, name, options) => {
  const { createPage, lang, sanitizeUrl, languagePrefix } = options
  const taxonomyPath = `${languagePrefix(lang)}/${name}/${sanitizeUrl(
    taxonomy,
    options
  )}/`

  createPage({
    path: taxonomyPath,
    component: path.resolve(
      `src/templates/${lang !== "en" ? `${lang}/` : ""}${name}.js`
    ),
    context: {
      name,
      taxonomy,
      lang,
    },
  })
}

exports.createTaxonomyPages = (data, { createPage }, options) => {
  const { createTaxonomyPage } = options

  const grouped = groupBy(data, v => v.node.frontmatter.lang || `en`)

  Object.keys(grouped).forEach(lang => {
    const posts = grouped[lang]

    options.keys.forEach(({ key, singular }) => {
      let taxonomies = []
      posts.forEach(({ node }) => {
        if (node.frontmatter[key]) {
          taxonomies = taxonomies.concat(node.frontmatter[key])
        }
      })

      taxonomies = uniq(taxonomies.map(t => t.toLowerCase()))
      taxonomies.forEach(t => {
        createTaxonomyPage(t, singular, { createPage, lang, ...options })
      })
    })
  })
}

exports.convertTags = ({ node }, { taxonomyFieldName }) => {
  return Array.isArray(node.frontmatter[taxonomyFieldName])
    ? node.frontmatter[taxonomyFieldName].map(t => t.toLowerCase())
    : []
}

exports.defaultOptions = {
  keys: [
    { key: `tags`, singular: `tag` },
    { key: `categories`, singular: `category` },
  ],
  mappedUrls: [],
  sanitizeUrl,
  languagePrefix,
  createTaxonomyPage,
  query: `
  {
    posts: allMarkdownRemark(
      filter: {
        frontmatter: {
          private: {ne: true},
          draft: {ne: true},
          type: {eq: "post"},
        },
      }
      sort: {fields: [frontmatter___date], order: DESC}
      ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            lang
            tags
            categories
          }
        }
      }
    }
  }`,
  // Target Types of additional url handling.
  targetTypes: [`MarkdownRemark`],
  taxonomyFieldName: `tags`,
  taxonomyHandler: exports.convertTags,
}
