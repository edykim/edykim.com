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
          <SectionTitle hero={true}>안녕하세요, 김용균입니다 👨🏻‍💻</SectionTitle>
          <p>
            문제를 해결하기 위해 작고 단단한 코드를 작성하는 일을 합니다. 웹의
            자유로운 접근성을 좋아합니다. 프로그래밍 언어, 소프트웨어 아키텍처,
            커뮤니티에 관심이 많습니다.
          </p>
          <SectionLink to={"/about"}>저는 이런 사람입니다</SectionLink>
        </Section>

        <Section isOdd={true} overwrap={true}>
          <SectionTitle>블로그</SectionTitle>
          <p>
            다양한 주제로 포스트를 작성하고 있습니다. 주로 개발 관련 경험,
            일상을 기록하며 개발 관련 번역도 하고 있습니다.
          </p>
          <SectionLink to={"/archives"}>전체 목록 보기</SectionLink>
          <Cards data={featuredArticles.concat(posts)} />
        </Section>

        <Section>
          <SectionTitle>링크</SectionTitle>
          <SectionList>
            <li>
              <SectionOutLink href={"https://twitter.com/haruair"}>
                트위터 @haruair
              </SectionOutLink>
            </li>
            <li>
              <SectionOutLink href={"https://github.com/edykim"}>
                깃허브 @edykim
              </SectionOutLink>
            </li>
            <li>
              <SectionOutLink href={"https://weirdx.io"}>
                이상한모임
              </SectionOutLink>
            </li>
          </SectionList>
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
