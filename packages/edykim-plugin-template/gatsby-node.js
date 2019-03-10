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
    contextDispatcher,
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

      const pagesGrouped = data.pages.edges.reduce((carry, page) => {
        const componentName = componentNameResolver(page)
        carry[componentName] = carry[componentName] || []
        carry[componentName].push(page)
        return carry
      }, {})

      const componentNames = Object.keys(pagesGrouped)

      componentNames.forEach(componentName => {
        const pages = pagesGrouped[componentName]

        pages.forEach(({ node }, index) => {
          if (isPublic({ node })) return
          const previous =
            index === pages.length - 1 ? null : pages[index + 1].node
          const next = index === 0 ? null : pages[index - 1].node

          var context = {
            [contextField]: node.fields[contextField],
            previous,
            next,
          }

          context = contextDispatcher({ node }, context)

          createPage({
            path: node.fields[pathFieldName],
            component: path.resolve(
              `${baseTemplatePath}${componentName}.${templateExtension}`
            ),
            context,
          })
        })
      })

      resolve()
    })
  })
}
