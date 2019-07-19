import React from "react"
import { graphql } from "gatsby"
import styled from "styled-components"

import { Site } from "components/layout"
import { ButtonTypeLink, PostItem, Meta } from "components"
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

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const { profile } = data.site.siteMetadata
    const posts = data.allMarkdownRemark.edges

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
            title={`소개 👨🏻‍💻`}
            subtext={`질의, 제안, 무엇이든 환영합니다`}
            linkTo={`/about`}
          />
        </Section>

        <Section>
          <SectionInner>
            <Title>최근 포스트</Title>

            {posts.map(({ node }, index) => {
              return <PostItem key={index} post={node} />
            })}
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
            date(formatString: "MMMM D")
            title
          }
        }
      }
    }
  }
`
