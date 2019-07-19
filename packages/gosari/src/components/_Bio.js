import React from "react"
import styled from "styled-components"
import { graphql, StaticQuery, Link } from "gatsby"
import Image from "gatsby-image"
import { layout, color } from "styles/schema"

const Wrapper = styled.div`
  margin-top: 2rem;
  margin-bottom: 3rem;
`

const InnerWrapper = styled.div`
  box-sizing: border-box;
  max-width: ${layout.medium};
  margin: 0 auto;
  padding: 0 ${layout.sidePadding};
`

const Name = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  a {
    text-decoration: none;
    color: ${color.primary};
  }
`
const Description = styled.div`
  font-size: 0.7rem;
  letter-spacing: -0.01rem;
  line-height: 1.6;
  color: ${color.plain};
`

const StyledImageWrapper = styled.div`
  width: 64px;
  height: 64px;
  margin-right: 1rem;
`

const StyledImage = styled(Image)`
  display: block;
  border-radius: 100%;
  vertical-align: middle;
  margin-right: ${layout.sidePadding};
`

const NameTag = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const Bio = () => (
  <StaticQuery
    query={query}
    render={({
      site: {
        siteMetadata: { author, description },
      },
      avatar: {
        image: { fixed },
      },
    }) => (
      <Wrapper>
        <InnerWrapper>
          <NameTag className={"byline"}>
            <StyledImageWrapper>
              <StyledImage fixed={fixed} />
            </StyledImageWrapper>
            <div>
              <Name>
                <Link to={`/about`}>{author}</Link>
              </Name>
              <Description>{description}</Description>
            </div>
          </NameTag>
        </InnerWrapper>
      </Wrapper>
    )}
  />
)

const query = graphql`
  query BioCardQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      image: childImageSharp {
        fixed(width: 64, height: 64) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        title
        author
        description
        social {
          github
          twitter
        }
      }
    }
  }
`
