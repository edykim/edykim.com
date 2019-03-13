import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

class NotFoundPage extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="404: Not Found" />
        <h1>404 Not Found</h1>
        <p>요청한 페이지가 웹사이트에 존재하지 않습니다.</p>

        <ul>
          <li>
            <Link to={`/`}>첫 페이지로 이동</Link>
          </li>
          <li>
            <Link to={`/`}>글 전체 목록으로 이동</Link>
          </li>
        </ul>
      </Layout>
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
