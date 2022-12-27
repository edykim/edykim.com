import React from "react"
import Content from "./styled"
import renderer from "./renderer"

export { button } from "./styled"

const ContentWithCustomComponents = ({ page, children, ...props }) => {
  return (
    <Content
      itemProp="articleBody"
      style={{
        fontSize: "1rem",
        wordBreak: "keep-all",
      }}
      {...props}
    >
      {page ? renderer(page.htmlAst) : null}
      {children ? children : null}
    </Content>
  )
}

export default ContentWithCustomComponents
