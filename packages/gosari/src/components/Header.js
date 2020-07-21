import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { color, layout, fonts, colors, layouts } from "styles/schema"

const Container = styled.div`
  font-size: ${fonts.body};
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin: 0 auto 3rem;
  max-width: ${layouts.content};
  padding-left: ${layouts.sidePadding};
  padding-right: ${layouts.sidePadding};
`

const Title = styled.h1`
  font-size: ${fonts.hero};
  font-weight: 900;
  letter-spacing: -0.1rem;
  line-height: 1.2;
  margin: 0 auto;
  word-break: keep-all;
  a {
    text-decoration: none;
    color: ${color.plain};
  }
`

const PublishedAt = styled.time`
  display: block;
  font-size: 0.78rem;
  color: ${colors.subtext};
`

export const Headline = styled.p`
  font-size: ${fonts.title};
  line-height: 1.7;
  word-break: keep-all;
  color: ${colors.subtext};
  margin: ${fonts.title} auto 0.2rem;
  @media (max-width: 800px) {
    margin-bottom: 0rem;
  }
`

export const Header = ({ title, publishedAt, headline, linkTo }) => (
  <Container>
    <div>
      <Title>
        <Link to={linkTo}>{title}</Link>
      </Title>
      {headline && <Headline>{headline}</Headline>}
    </div>
    {publishedAt && (
      <PublishedAt datetime={publishedAt}>{publishedAt}</PublishedAt>
    )}
  </Container>
)
