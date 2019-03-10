const componentNameResolver = ({ node }) => {
  return node.frontmatter.type
}

const contextDispatcher = ({ node }, context) => {
  return {
    ...context,
    lang: node.frontmatter.lang,
  }
}

const isPublic = ({ node }) => {
  return node.frontmatter.private || node.frontmatter.draft
}

// Default options
exports.defaultOptions = {
  // Default target contents. It requires alias `pages` in query.
  query: `{
    pages: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {frontmatter: { draft: { ne: true }, private: {ne: true} }}
    ) {
      edges {
        node {
          excerpt(format: PLAIN, truncate: true)
          frontmatter {
            type
            private
            draft
            lang
            title
            date(formatString: "MMMM DD, YYYY")
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
  componentNameResolver,

  // Context passes as a param so it can be editable.
  contextDispatcher,
}
