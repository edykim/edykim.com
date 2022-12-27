import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../../components/layout"
import PostShortList from "../../components/post-short-list"
import Seo from "../../components/seo"
import Content from "../../components/content/styled"

const KoIndexPage = ({ location, data: { featuredItems } }) => {
  return (
    <Layout location={location}>
      <Seo title="Home" lang={"ko"} />
      <Content>
        <p style={{width: '30rem'}}>
          안녕하세요, <strong>김용균</strong>입니다. 🪴
        </p>
        <p style={{width: '30rem'}}>
          저는 일상에서 유용하게 사용할 수 있는 디지털 도구와 웹서비스를 만드는 일을 합니다.
          이 공간에는 번역, 개발 관련 글을 주로 게시하며 일상 주제로도 자주 작성하고 있습니다.
        </p>
        {featuredItems.edges.length > 0 && (
          <PostShortList posts={featuredItems.edges} />
        )}
      </Content>
    </Layout>
  )
}

export default KoIndexPage

export const pageQuery = graphql`
  query KoIndexPage {
    site {
      siteMetadata {
        title
      }
    }
    featuredItems: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 10
      filter: {
        frontmatter: {
          private: { ne: true }
          draft: { ne: true }
          featured: { eq: true }
          lang: { eq: "ko" }
          type: { eq: "post" }
        }
      }
    ) {
      edges {
        node {
          excerpt(format: PLAIN, truncate: true, pruneLength: 30)
          fields {
            url
          }
          frontmatter {
            date(formatString: "YYYY-MM-DD")
            dateSort: date(formatString: "YYYY")
            title
          }
        }
      }
    }
  }
`
