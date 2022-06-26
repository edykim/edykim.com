import React from "react"
import rehypeReact from "rehype-react"
import components from "./custom"
import { resetCount } from "./custom/HeaderTitle"

const renderAst = new rehypeReact({
  createElement: React.createElement,
  Fragment: React.Fragment,
  components,
}).Compiler

export default content => {
  const rendered = renderAst(content)
  resetCount() // for slugger count
  return rendered
}
