import React from "react"
import { Link, graphql } from "gatsby"
import styled from "styled-components"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { BulkyButton } from "../components/bulkyButton"
import { BoxArticle } from "../components/boxArticle"

const Tiles = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: -10px;
  margin-right: -10px;
  & > * {
    margin-left: 10px;
    margin-right: 10px;
    width: 40%;
    flex-grow: 1;
  }
  @media (max-width: 800px) {
    display: block;
    margin-left: 0;
    margin-right: 0;
    & > * {
      width: 100%;
      display: block;
      margin-left: 0;
      mragin-right: 0;
    }
  }
`

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="All posts"
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        <div style={{ marginBottom: 60, marginTop: 80 }}>
          <div
            style={{
              color: "#222222",
              fontFamily: "Noto Sans KR",
              fontWeight: 900,
              fontSize: 50,
              lineHeight: 1.3,
              marginBottom: 20,
            }}
          >
            안녕하세요, 김용균입니다.
          </div>
          <div
            style={{
              color: "#545454",
              fontFamily: "Noto Sans KR",
              fontSize: 20,
              lineHeight: 1.6,
            }}
          >
            문제를 해결하기 위해 작고 단단한 코드를 작성하는 일을 합니다. 웹의
            자유로운 접근성을 좋아합니다. 프로그래밍 언어, 소프트웨어 아키텍처,
            커뮤니티에 관심이 많습니다.
          </div>
        </div>
        <Tiles>
          <BulkyButton
            color={`#6700ee`}
            title={`프로필`}
            subtext={`저에 대해 더 알고 싶다면`}
            link={`${__PATH_PREFIX__}/about-me`}
          />
          <BulkyButton
            color={`#e91e63`}
            title={`연락하기`}
            subtext={`질의와 제언 모두 환영합니다`}
            link={`${__PATH_PREFIX__}/contact`}
          />

          {posts.map(({ node }, index) => {
            return <BoxArticle key={index} article={node} />
          })}

          <BulkyButton
            color={`#6700ee`}
            title={`포스트 전체 목록 보기`}
            subtext={`개발, 일상 등 다양한 주제`}
            link={`${__PATH_PREFIX__}/archive`}
          />
        </Tiles>
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: {
          private: { ne: true }
          draft: { ne: true }
          type: { eq: "post" }
        }
      }
      limit: 5
    ) {
      edges {
        node {
          excerpt(format: PLAIN, truncate: true)
          fields {
            slug
            url
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
          }
        }
      }
    }
  }
`
