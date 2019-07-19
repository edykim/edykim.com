import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { color, layout } from "styles/schema"

const Container = styled.div`
  display: flex;
  flex-direction: column-reverse;
  box-sizing: border-box;
  margin: 6rem auto 1rem;
  max-width: ${layout.medium};
  padding-left: ${layout.sidePadding};
  padding-right: ${layout.sidePadding};
  @media (max-width: 800px) {
    margin-top: 2rem;
    margin-bottom: 0rem;
  }
`

const Title = styled.h1`
  font-size: 1.3rem;
  font-weight: 500;
  letter-spacing: -0.08rem;
  line-height: 1.6;
  margin: 0 auto 1rem;
  word-break: keep-all;
  a {
    text-decoration: none;
    color: ${color.plain};
  }
`

const PublishedAt = styled.time`
  display: block;
  font-size: 0.78rem;
  color: ${color.caption};
`

export const Headline = styled.p`
  font-size: 0.85rem;
  line-height: 1.7;
  word-break: keep-all;
  margin: -0.8rem auto 2rem;
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
