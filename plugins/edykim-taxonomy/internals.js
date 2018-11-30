const path = require(`path`)
const { uniq, groupBy } = require('lodash')

const sanitizeUrl = (taxonomy, { mappedUrls }) => {
  const map = mappedUrls.find(({ key }) => key === taxonomy)
  const _taxonomy = map && map.url ? map.url : taxonomy

  return _taxonomy
    .replace(/ /gi, '-')
    .replace(/#/gi, 'sharp')
    .toLowerCase()
}

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
    component: path.resolve(`src/templates/${name}.js`),
    context: {
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
      taxonomies = uniq(taxonomies)
      taxonomies.forEach(t => {
        createTaxonomyPage(t, singular, { createPage, lang, ...options })
      })
    })
  })
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
}
