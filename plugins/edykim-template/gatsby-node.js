const path = require(`path`)
const { defaultOptions } = require(`./internals`)

exports.createPages = ({ graphql, actions }, pluginOptions) => {
  const { createPage } = actions
  const options = {
    ...defaultOptions,
    ...pluginOptions,
  }

  const {
    query,
    componentNameResolver,
    isPublic,
    contextField,
    pathFieldName,
    baseTemplatePath,
    templateExtension,
  } = options

  return new Promise((resolve, reject) => {
    graphql(query).then(({ data }) => {
      if (!data || !data.pages) {
        return reject()
      }

      data.pages.edges.forEach(({ node }) => {
        if (isPublic({ node })) return

        var context = {
          [contextField]: node.fields[contextField],
        }
        const componentName = componentNameResolver({ node }, context)

        createPage({
          path: node.fields[pathFieldName],
          component: path.resolve(
            `${baseTemplatePath}${componentName}.${templateExtension}`
          ),
          context,
        })
      })

      resolve()
    })
  })
}
