import React from "react"
import { Link, StaticQuery, graphql } from "gatsby"
import styled from "styled-components"
import { color, layout } from "styles/schema"

const Wrapper = styled.div`
  margin 2rem auto 0;
  max-width: ${layout.full};
  border-bottom: 1px solid ${color.separator};
  @media (max-width: 1200px) {
    margin-top: 0;
    max-width: none;
  }
`

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 0.83rem;
`

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const Title = styled.div`
  margin: 0 1rem;
  font-weight: 700;
  letter-spacing: -0.05rem;
  padding: 0.5rem 0;
  a {
    color: ${color.plain};
    text-decoration: none;
  }
`

const Links = styled.div`
  a {
    font-size: 0.7rem;
    padding: 0.5rem;
    color: ${color.plain};
    text-decoration: none;
  }
  a.active {
    color: ${color.primary};
    border-bottom: 2px solid ${color.primary};
  }
`

const QuickLinks = styled.div`
  margin: 0.5rem;
  a {
    font-size: 0.7rem;
    padding: 0.5rem;
    color: ${color.primary};
    text-decoration: none;
  }
  @media (max-width: 650px) {
    display: none;
  }
`

export const Header = () => (
  <StaticQuery
    query={siteHeaderQuery}
    render={({
      site: {
        siteMetadata: {
          title,
          social: { github, twitter },
        },
      },
    }) => (
      <Wrapper>
        <HeaderContainer>
          <Container>
            <Title>
              <Link to={"/"}>{title}</Link>
            </Title>
            <Links>
              <Link activeClassName="active" to={`/about`}>
                소개
              </Link>
              <Link activeClassName="active" to={`/notes`}>
                노트
              </Link>
              <Link activeClassName="active" to={`/archives`}>
                블로그
              </Link>
            </Links>
          </Container>
          <Container>
            <QuickLinks>
              <a href={`https://github.com/${github}`}>Github</a>
              <a href={`https://twitter.com/${twitter}`}>Twitter</a>
            </QuickLinks>
          </Container>
        </HeaderContainer>
      </Wrapper>
    )}
  />
)

const siteHeaderQuery = graphql`
  query SiteHeaderQuery {
    site {
      siteMetadata {
        title
        author
        social {
          github
          twitter
        }
      }
    }
  }
`
