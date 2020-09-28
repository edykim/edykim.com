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
  ${props =>
    props.tidy &&
    `
    margin-bottom: 2rem;
  `}
  max-width: ${layouts.content};
  padding-left: ${layouts.sidePadding};
  padding-right: ${layouts.sidePadding};
`

const Title = styled.h1`
  font-size: ${fonts.hero};
  font-weight: 600;
  line-height: 1.6;
  word-break: keep-all;
  overflow-wrap: break-word;
  margin: 3rem 0 0rem;
  max-width: 95%;
  color: ${colors.text};

  a {
    text-decoration: none;
    color: ${colors.text};
  }
`

const PublishedAt = styled.time`
  display: block;
  font-size: 0.78rem;
  margin-top: 1rem;
  color: ${colors.subtext};
`

export const Headline = styled.p`
  font-size: ${fonts.title};
  line-height: 1.7;
  word-break: keep-all;
  color: ${colors.subtext};
  margin: 0 auto -0.8rem;
`

export const Header = ({ title, publishedAt, headline, linkTo }) => (
  <Container tidy={!headline}>
    <div>
      <Title>{linkTo ? <Link to={linkTo}>{title}</Link> : title}</Title>
      {headline && <Headline>{headline}</Headline>}
    </div>
    {publishedAt && (
      <PublishedAt datetime={publishedAt}>{publishedAt}</PublishedAt>
    )}
  </Container>
)
