// Create url from the node. It uses strongly coupled frontmatter in edykim.com
exports.generateUrl = ({ node }, { slugFieldName }) => {
  var url = node.fields[slugFieldName]

  // remove trailing slash
  if (url.substr(-1) === `/`) url = url.substr(0, url.length - 1)

  // remove leading slash
  if (url.substr(0, 1) === `/`) url = url.substr(1)

  if (node.frontmatter) {
    if (node.frontmatter.url) {
      url = node.frontmatter.url
    } else if (node.frontmatter.slug) {
      url = `${node.frontmatter.type}/${node.frontmatter.slug}`
    }

    // put lang in url
    if (node.frontmatter.lang && node.frontmatter.lang !== `en`) {
      url = `${node.frontmatter.lang}/${url}`
    }
  }

  // add trailing slash
  if (url.substr(-1) !== `/`) url += `/`

  // add leading slash
  if (url.substr(0, 1) !== `/`) url = `/${url}`

  // clean up double slashes
  url = url.replace(/\/\//g, `/`)

  return url
}

// Default plugin options
exports.defaultOptions = {
  // Additional slug fields from `gatsby-source-filesystem`
  // Override this field name if others already use this field name.
  slugFieldName: `slug`,

  // Additional url fields via url handler.
  // Override this field name if others already use this field name.
  urlFieldName: `url`,

  // Target Types of additional url handling.
  targetTypes: [`MarkdownRemark`],

  // node and options will pass to this function and
  // will create a value of the url field.
  urlHandler: exports.generateUrl,
}
