import React from "react"
import Content from "./styled"
import renderer from "./renderer"

export { button } from "./styled"

const ContentWithCustomComponents = ({ page, children }) => {
  return (
    <Content
      itemProp="articleBody"
      style={{
        lineHeight: 1.76,
        fontSize: "1rem",
        wordBreak: "keep-all",
      }}
    >
      {children ? children : page ? renderer(page.htmlAst) : null}
    </Content>
  )
}

export default ContentWithCustomComponents
