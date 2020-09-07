import React from "react"
import { graphql } from "gatsby"
import styled from "styled-components"
import { Site } from "components/layout"
import { ButtonTypeLink, PostItem, Meta, TagLink as Link } from "components"
import { layout, color } from "styles/schema"
import {
  Section,
  SectionTitle,
  SectionLink,
  SectionOutLink,
  SectionList,
} from "components/sections"
import { Cards } from "components/cards"

class SiteIndex extends React.Component {
  render() {
    const { data } = this.props
    const { profile } = data.site.siteMetadata
    const posts = data.recents.edges
    const featuredArticles = data.featuredArticles.edges

    return (
      <Site location={this.props.location} hero={true}>
        <Meta
          title="안녕하세요, 김용균입니다"
          keywords={[`블로그`, `프로그래밍`, `소프트웨어 아키텍처`, `커뮤니티`]}
        />

        <Section>
          <SectionTitle hero={true}>매일 성장하기</SectionTitle>
          <p>
            저는 문제를 해결하기 위해 작고 단단한 코드를 작성하는 일을 합니다.
            더 멀리 가기 위해서는 꾸준한 기록이 중요하다고 생각합니다. 그래서 제
            성장을 꿈꾸며 그 여정을 이 공간에 남기고 있습니다. 작지만 이 기록이
            같은 방향을 보며 달리는 사람에게 도움이 되었으면 하는 바람도
            있습니다.
          </p>
          <p>만나서 반갑고 잘 부탁드립니다.</p>

          <SectionLink to={"/about"}>💁🏻‍♂️ 저는 이런 사람입니다</SectionLink>
        </Section>

        <Section>
          <SectionTitle>블로그</SectionTitle>
          <p>주로 소프트웨어, 웹, 그리고 일상을 주제로 기록합니다.</p>
          <SectionLink to={"/archives"}>📝 전체 목록 보기</SectionLink>
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
