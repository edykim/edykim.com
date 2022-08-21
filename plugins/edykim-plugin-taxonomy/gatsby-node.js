const { createTaxonomyPages, defaultOptions } = require(`./internals`)

exports.createPages = ({ actions, graphql }, pluginOptions) => {
  const { createPage } = actions
  const options = {
    ...defaultOptions,
    ...pluginOptions,
  }

  return graphql(options.query).then(({ errors, data }) => {
    if (errors) {
      errors.forEach(e => console.error(e.toString()))
      return Promise.reject(errors)
    }

    const posts = data.posts.edges
    createTaxonomyPages(posts, { createPage }, options)
  })
}

const isInTargetResources = (node, { targetTypes }) => {
  return targetTypes.indexOf(node.internal.type) !== -1
}

const createTaxonomyIndexField = ({ node, createNodeField }, options) => {
  const { taxonomyHandler, taxonomyFieldName } = options
  const taxonomy = taxonomyHandler({ node }, { ...options })

  if (!taxonomy) {
    return
  }

  createNodeField({
    node,
    name: taxonomyFieldName,
    value: taxonomy,
  })
}

exports.onCreateNode = ({ node, actions }, pluginOptions) => {
  const { createNodeField } = actions

  const options = {
    ...defaultOptions,
    ...pluginOptions,
  }

  if (isInTargetResources(node, options)) {
    createTaxonomyIndexField({ node, createNodeField }, options)
  }
}
