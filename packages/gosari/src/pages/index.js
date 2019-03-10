import React from "react"
import { Link, graphql } from "gatsby"
import styled from "styled-components"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { BulkyButton } from "../components/bulkyButton"
import { BoxArticle } from "../components/boxArticle"
import { Logo } from "../components/logo"
import { Tiles } from "../components/tiles"

const HeroDiv = styled.div`
  margin-bottom: 60px;
  margin-top: 80px;
  @media (max-width: 800px) {
    margin-top: 30px;
    margin-bottom: 30px;
  }
`

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const { siteTitle, profile } = data.site.siteMetadata
    const posts = data.allMarkdownRemark.edges
    const totalCount = data.allMarkdownRemark.totalCount

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="All posts"
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        <HeroDiv>
          <Logo size={50} leftColor={"#6700ee"} rightColor={"#e91e63"} />
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
            {profile}
          </div>
        </HeroDiv>
        <Tiles>
          <BulkyButton
            color={`#6700ee`}
            title={`프로필 👨🏻‍💻`}
            subtext={`저에 대해 더 알고 싶다면`}
            link={`${__PATH_PREFIX__}/about`}
          />
          <BulkyButton
            color={`#e91e63`}
            title={`연락하기 📫`}
            subtext={`질의, 제언, 무엇이든 환영합니다`}
            link={`${__PATH_PREFIX__}/contact`}
          />

          {posts.map(({ node }, index) => {
            return <BoxArticle key={index} article={node} />
          })}

          <BulkyButton
            color={`#6700ee`}
            title={`포스트 전체 목록 보기`}
            subtext={`개발, 일상 등 다양한 주제를 다룹니다. 총 ${totalCount}건의 포스트가 있습니다.`}
            link={`${__PATH_PREFIX__}/archives`}
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
        profile
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
      totalCount
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
