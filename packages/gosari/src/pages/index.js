import React from "react"
import { graphql } from "gatsby"
import { Site } from "components/layout"
import { Meta } from "components"
import { Section, SectionTitle, SectionLink } from "components/sections"
import { Cards } from "components/cards"

class SiteIndex extends React.Component {
  render() {
    const { data } = this.props
    const posts = data.recents.edges
    const featuredArticles = data.featuredArticles.edges

    return (
      <Site location={this.props.location} hero={true}>
        <Meta
          title="첫 페이지"
          keywords={[`블로그`, `프로그래밍`, `소프트웨어 아키텍처`, `커뮤니티`]}
        />

        <Section>
          <SectionTitle hero={true}>매일 성장하기</SectionTitle>

          <p>안녕하세요! 김용균입니다. 작고 단단한 코드를 작성하는 일을 좋아합니다. 만나서 반갑고 잘 부탁드립니다 :)</p>
          <SectionLink to={"/about"}>
            <span role={"img"} aria-label="사람">
              💁🏻‍♂️
            </span>{" "}
           제 소개 
          </SectionLink>
        </Section>

        <Section>
          <SectionTitle>블로그</SectionTitle>
          <p>주로 소프트웨어, 웹, 그리고 일상을 주제로 기록합니다.</p>
          <SectionLink to={"/archives"}>
            <span role={"img"} aria-label="수첩">
              📝
            </span>{" "}
            전체 목록 보기
          </SectionLink>
          <Cards data={featuredArticles.concat(posts)} />
        </Section>
      </Site>
    )
  }
}

export default SiteIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        profile
      }
    }
    recents: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: {
          private: { ne: true }
          draft: { ne: true }
          type: { eq: "post" }
        }
      }
      limit: 3
    ) {
      edges {
        node {
          fields {
            slug
            url
          }
          frontmatter {
            date(formatString: "MMMM D")
            title
            headline
          }
        }
      }
    }

    featuredArticles: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: {
          private: { ne: true }
          draft: { ne: true }
          type: { eq: "post" }
          featured: { eq: true }
        }
      }
      limit: 3
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
            url
          }
          frontmatter {
            date(formatString: "MMMM D")
            title
            headline
          }
        }
      }
    }
  }
`
