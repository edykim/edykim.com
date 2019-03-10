import React from "react"
import { StaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import styled from "styled-components"
import { InBoxLink } from "./inBoxLink"

const BioWrapper = styled.div`
  margin-top: 100px;
  margin-bottom: 50px;
  text-align: center;
  @media (max-width: 800px) {
    text-align: left;
  }
`

const StyledImage = styled(Image)`
  display: block;
  min-width: 100px;
  border-radius: 100%;
  vertical-align: middle;
  margin-bottom: 10px;
  border: 8px solid #eeeeee;
  transition: transform 0.5s ease-in-out;
  cursor: help;
  &:hover {
    transform: rotateZ(180deg);
  }
`

export const Bio = () => {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { author, social, profile } = data.site.siteMetadata
        return (
          <BioWrapper>
            <StyledImage
              fixed={data.avatar.childImageSharp.fixed}
              alt={author}
              style={{
                display: "inline-block",
              }}
              imgStyle={{
                borderRadius: `50%`,
              }}
            />
            <div style={{ maxWidth: 600, margin: "0 auto" }}>
              <div style={{ color: "#545454", fontSize: 16 }}>
                <p>
                  <strong
                    style={{
                      display: "block",
                      color: "#000000",
                      marginBottom: 10,
                      fontWeight: 600,
                    }}
                  >
                    안녕하세요, {author}입니다.
                  </strong>
                  {` `}
                  {profile}
                </p>
                <div>
                  <InBoxLink
                    href={`https://github.com/${social.github}`}
                    style={{ color: `#ffffff`, backgroundColor: `#24292e` }}
                  >
                    {`Github @${social.github}`}
                  </InBoxLink>
                  <InBoxLink
                    href={`https://twitter.com/${social.twitter}`}
                    style={{ color: `#ffffff`, backgroundColor: `#1da1f2` }}
                  >
                    {`트위터 @${social.twitter}`}
                  </InBoxLink>
                  <InBoxLink
                    href={`https://www.linkedin.com/in/${social.linkedin}`}
                    style={{ color: `#ffffff`, backgroundColor: `#0073b1` }}
                  >
                    {`링크드인 @${social.linkedin}`}
                  </InBoxLink>
                </div>
              </div>
            </div>
          </BioWrapper>
        )
      }}
    />
  )
}

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        fixed(width: 100, height: 100) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        profile
        social {
          github
          twitter
          linkedin
        }
      }
    }
  }
`
