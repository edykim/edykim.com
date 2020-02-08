import React from "react"
import { graphql } from "gatsby"
import styled from "styled-components"

import { Site } from "components/layout"
import { ButtonTypeLink, PostItem, Meta, TagLink as Link } from "components"
import { layout, color } from "styles/schema"

const Hero = styled.div`
  margin: 6rem auto 3rem;
  max-width: ${layout.medium};
  color: ${color.plain};
  div {
    padding: 0 ${layout.sidePadding};
  }
  h1 {
    font-weight: 900;
    font-size: 1.5rem;
  }
  p {
    font-size: 0.8rem;
    line-height: 1.8;
    word-break: keep-all;
  }
  @media (max-width: 800px) {
    margin-top: 30px;
    margin-bottom: 30px;
  }
`

const Section = styled.div`
  max-width: ${layout.medium};
  margin: 2rem auto;
`
const SectionInner = styled.div`
  padding: 0 ${layout.sidePadding};
`
const Title = styled.div`
  margin-bottom: 0.8rem;
`

const Links = styled.div`
  margin-top: 2rem;
  text-align: center;
`

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const { profile } = data.site.siteMetadata
    const posts = data.recents.edges
    const featuredArticles = data.featuredArticles.edges

    return (
      <Site location={this.props.location}>
        <Meta
          title="안녕하세요, 김용균입니다"
          keywords={[`블로그`, `프로그래밍`, `소프트웨어 아키텍처`, `커뮤니티`]}
        />

        <Hero>
          <div>
            <h1>안녕하세요, 김용균입니다.</h1>
            <p>{profile}</p>
          </div>
        </Hero>

        <Section>
          <ButtonTypeLink
            title={`제 소개 👨🏻‍💻`}
            subtext={"궁금한 점, 제안 및 기타 사항은 연락처로 남겨주세요"}
            linkTo={`/about`}
          />
        </Section>

        <Section>
          <SectionInner>
            <Title>인기 글</Title>

            {featuredArticles.map(({ node }, index) => {
              return <PostItem key={index} post={node} />
            })}
          </SectionInner>
        </Section>

        <Section>
          <SectionInner>
            <Title>최근 글</Title>

            {posts.map(({ node }, index) => {
              return <PostItem key={index} post={node} />
            })}

            <Links>
              <Link to={`/archives`}>전체 포스트 보기</Link>
            </Links>
          </SectionInner>
        </Section>
      </Site>
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
    recents: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: {
          private: { ne: true }
          draft: { ne: true }
          type: { eq: "post" }
        }
      }
      limit: 6
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
            dateSort: date(formatString: "YYYY")
            title
          }
        }
      }
    }
  }
`
