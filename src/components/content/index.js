import React from "react"
import Content from "./styled"
import renderer from "./renderer"

export { button } from "./styled"

const ContentWithCustomComponents = ({ page, children, ...props }) => {
  return (
    <Content
      itemProp="articleBody"
      style={{
        lineHeight: 1.76,
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
