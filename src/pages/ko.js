import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout, { ContentContainer } from "../components/layout"
import Seo from "../components/seo"
import PostShortList from "../components/post-short-list"

const KoIndexPage = ({ data, location }) => {
  const { items, featuredItems } = data
  return (
    <Layout>
      <Seo title="Home" />
      <ContentContainer>
        <h1>안녕하세요, 김용균입니다.</h1>
        <p>
          저는 소프트웨어 엔지니어로 웹서비스와 유용한 도구를 만드는 일을
          합니다. 작은 것을 만드는 일, 사진 찍는 일, 그리고 맛있는 커피를
          좋아합니다.
        </p>
        <p>
          문제를 해결하기 위해 작고 단단한 코드를 작성하는 일을 합니다. 웹의
          자유로운 접근성을 좋아합니다. 프로그래밍 언어, 소프트웨어 아키텍처,
          커뮤니티에 관심이 많습니다. 사진으로 기록 남기는 일도 좋아하며 무언가
          만드는 일에 항상 흥미를 느낍니다. 요즘은 요리에 관심이 많습니다.
        </p>
        <p>
          오랜 시간을 제주에서 보냈고 호주 멜버른에서 다년간 거주한 경험도
          있습니다. 2018년에 미국으로 이주했으며 현재는 캘리포니아에서 공부하고
          있습니다.
        </p>
        <p>
          <a href="https://twitter.com/haruair">@haruair</a>{" "}
          <Link to={"/ko/notes/"}>노트</Link>
        </p>

        {featuredItems.edges.length > 0 && (
          <PostShortList title={"인기 글"} posts={featuredItems.edges} />
        )}
        <PostShortList title={"최근 글"} posts={items.edges} />
        <p>
          <Link to="/ko/archives/">전체 글 보기</Link>
        </p>
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
    items: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 5
      filter: {
        frontmatter: {
          private: { ne: true }
          draft: { ne: true }
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
