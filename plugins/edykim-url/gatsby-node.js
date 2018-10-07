const { createFilePath } = require(`gatsby-source-filesystem`)
const { defaultOptions } = require(`./internals`)

const isInTargetResources = (node, targetTypes) => {
  return targetTypes.indexOf(node.internal.type) !== -1
}

// Create slug based on file path so that posts keep path based route and
// also maintains configurable urls.
const createSlugField = ({node, getNode, createNodeField}) => {
  const slug = createFilePath({ node, getNode, basePath: `pages` })

  createNodeField({
    node,
    name: `slug`,
    value: slug
  })
}

// Create url based on generating rules of the website
const createUrlField = ({ node, createNodeField }, urlHandler) => {
  const url = urlHandler(node)
  createNodeField({
    node,
    name: `url`,
    value: url,
  })
}

exports.onCreateNode = ({ node, getNode, actions }, pluginOptions) => {
  const { createNodeField } = actions

  const options = {
    ...defaultOptions,
    ...pluginOptions,
  }

  if (isInTargetResources(node, options.targetTypes)) {
    createSlugField({node, getNode, createNodeField})
    createUrlField({node, createNodeField}, options.urlHandler)
  }
};
