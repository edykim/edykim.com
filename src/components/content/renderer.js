import React from "react"
import rehypeReact from "rehype-react"
import components from "./custom"

const renderAst = new rehypeReact({
  createElement: React.createElement,
  Fragment: React.Fragment,
  components,
}).Compiler

export default renderAst
