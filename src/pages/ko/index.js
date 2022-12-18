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
        <h1 style={{ fontWeight: "100", fontSize: '3rem', letterSpacing: -1 }}>
          안녕하세요, 김용균입니다 👋
        </h1>
        <p>
          반갑습니다! 저는 웹서비스와 유용한 도구를 만드는 일을 합니다. 작은
          도구 만들기를 좋아하며 사진과 커피에도 관심이 많습니다. 지금은 미
          캘리포니아에서 컴퓨터 공부를 하고 있습니다. 🪴
        </p>
        {featuredItems.edges.length > 0 && (
          <PostShortList title={"인기 글"} posts={featuredItems.edges} />
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
