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
        <h1 style={{ fontWeight: "900", fontSize: '2.5rem', letterSpacing: -1 }}>
          안녕하세요, 김용균입니다 👋
        </h1>
        <p>
          반갑습니다! 저는 웹서비스와 유용한 도구를 만드는 일을 합니다. 작은
          도구 만들기를 좋아하며 사진과 커피에도 관심이 많습니다. 지금은 미
          캘리포니아에서 컴퓨터 공부를 하고 있습니다.
        </p>
        <p>
          항상 성장에 대한 욕심이 많아서 늘 배우려고 노력하고 있습니다. 아무리
          작은 경험이라도 글로 적어두면 나에게도, 남에게도 도움이 된다는
          생각으로 웹페이지를 꾸리고 있습니다. 함께 무럭무럭 성장합시다 🪴
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
