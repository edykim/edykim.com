const componentNameResolver = ({ node }, context) => {
  var componentName = `post`

  if (node.frontmatter.type === `archive`) {
    componentName = `archive`
  } else if (node.frontmatter.type === `page`) {
    componentName = `page`
  } else if (node.frontmatter.type === `category`
    || node.frontmatter.type === `tag`) {
    componentName = node.frontmatter.type
    context[`taxonomy`] = node.frontmatter.taxonomy
  }

  return componentName
}

const isPublic = ({ node }) => {
  return node.frontmatter.private
    || node.frontmatter.draft
}

// Default options
exports.defaultOptions = {
  // Default target contents. It requires alias `pages` in query.
  query: `{
    pages: allMarkdownRemark {
      edges {
        node {
          frontmatter {
            type
            taxonomy
            private
            draft
          }
          fields {
            slug
            url
          }
        }
      }
    }
  }`,

  // Base path of the template path.
  baseTemplatePath: `./src/templates/`,

  // Base extension of the template. It can be `jsx`.
  templateExtension: `js`,

  // Path field name. It will generate the file based on this field.
  pathFieldName: `url`,

  // Default context field. React page will be created based on this slug.
  contextField: `slug`,

  // Check the page is public or not.
  isPublic,

  // Resolver for find a matched component name.
  // Context also passes as a param so it can be editable.
  componentNameResolver,
}
