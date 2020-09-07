import React from "react"
import { graphql, Link } from "gatsby"

import { Header, Meta, Content } from "components"
import { Site } from "components/layout"

class NotFoundPage extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title

    return (
      <Site location={this.props.location} title={siteTitle}>
        <Meta title="404 Not Found" />
        <Header title={"404 Not Found"} />
        <Content>
          <p>요청한 페이지를 찾을 수 없습니다.</p>
          <ul>
            <li>
              <Link to={`/`}>첫 페이지로 이동</Link>
            </li>
            <li>
              <Link to={`/archives`}>글 전체 목록으로 이동</Link>
            </li>
          </ul>
        </Content>
      </Site>
    )
  }
}

export default NotFoundPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
