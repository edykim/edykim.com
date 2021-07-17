const remarkDirective = require("remark-directive")
const visit = require("unist-util-visit")
const h = require("hastscript")

module.exports = ({ markdownAST }, pluginOptions = {}) => {
  visit(
    markdownAST,
    ["textDirective", "leafDirective", "containerDirective"],
    node => {
      var data = node.data || (node.data = {})
      var hast = h(node.name, node.attributes)

      data.hName = hast.tagName
      data.hProperties = hast.properties
    }
  )
}
module.exports.setParserPlugins = options => {
  return [[remarkDirective, options]]
}
