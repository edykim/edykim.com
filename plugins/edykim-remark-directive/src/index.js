import remarkDirective from "remark-directive";
import {visit} from 'unist-util-visit';
import {h} from 'hastscript';

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
