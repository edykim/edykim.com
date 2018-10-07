const { createFilePath } = require(`gatsby-source-filesystem`)
const { defaultOptions } = require(`./internals`)

const isInTargetResources = (node, { targetTypes }) => {
  return targetTypes.indexOf(node.internal.type) !== -1
}

// Create slug based on file path so that posts keep path based route and
// also maintains configurable urls.
const createSlugField = ({ node, getNode, createNodeField }, { slugFieldName }) => {
  const slug = createFilePath({ node, getNode, basePath: `pages` })

  createNodeField({
    node,
    name: slugFieldName,
    value: slug
  })
}

// Create url based on generating rules of the website
const createUrlField = ({ node, createNodeField }, options) => {
  const { urlHandler, urlFieldName } = options
  const url = urlHandler({ node }, { ...options })

  createNodeField({
    node,
    name: urlFieldName,
    value: url,
  })
}

exports.onCreateNode = ({ node, getNode, actions }, pluginOptions) => {
  const { createNodeField } = actions

  const options = {
    ...defaultOptions,
    ...pluginOptions,
  }

  if (isInTargetResources(node, options)) {
    createSlugField({node, getNode, createNodeField}, options)
    createUrlField({node, createNodeField}, options)
  }
};
