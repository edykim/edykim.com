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
