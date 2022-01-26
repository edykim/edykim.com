import * as React from "react"
import { graphql } from "gatsby"

import Layout, { ContentContainer } from "../../components/layout"
import PostShortList from "../../components/post-short-list"
import Seo from "../../components/seo"

const KoIndexPage = ({ location, data: { featuredItems } }) => {
  return (
    <Layout location={location}>
      <Seo title="Home" lang={"ko"} />
      <ContentContainer>
        <h1>안녕하세요, 김용균입니다.</h1>
        <p>
          저는 소프트웨어 엔지니어로 웹서비스와 유용한 도구를 만드는 일을
          합니다. 작은 것을 만드는 일, 사진 찍는 일, 그리고 맛있는 커피를
          좋아합니다.
        </p>
        {featuredItems.edges.length > 0 && (
          <PostShortList title={"인기 글"} posts={featuredItems.edges} />
        )}
      </ContentContainer>
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
