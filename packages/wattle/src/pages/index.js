import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { Container } from "../components/container"
import { Headline } from "../components/headline"

const headline = `I'm a software engineer who loves to make web services and useful tools. I'm currently studying computer science and living in Riverside. Plus, I enjoy building small things and taking photographs in my free time.`

const List = styled.ul`
  font-weight: 500;
  display: block;
  padding-left: 0;
  li {
    display: inline-block;
    &:before {
      display: none;
    }
  }

  a {
    display: inline-block;
    font-family: "Poppins", sans-serif;
    border-color: var(--site-color-primary);
    color: var(--site-color-primary);
    border: 1px solid;
    padding: 8px 14px;
    border-radius: 3px;
    box-shadow: none !important;
    margin-bottom: 10px;
    margin-right: 10px;
    font-size: 16px;
    font-weight: bold;
  }

  &.sub a {
    border-color: var(--site-color-subtext);
    color: var(--site-color-subtext) !important;
    padding: 6px 12px;
    font-weight: 500;
  }
`

const IndexPage = ({ location }) => (
  <Layout location={location} isMain={true}>
    <SEO title="Home" keywords={[`edykim`]} />
    <Container>
      <Headline>{headline}</Headline>
      <List>
        <li>
          <Link to={`/about`}>More about me</Link>
        </li>
        <li>
          <a href={`https://twitter.com/heyedykim`}>Say hi on Twitter</a>
        </li>
      </List>
      <hr />
      <List className={"sub"}>
        <li>
          <Link to={`/archives`}>Posts</Link>
        </li>
        <li>
          <Link to={`/note`}>Notes</Link>
        </li>
        <li>
          <a href="/ko/">한국어</a>
        </li>
      </List>
    </Container>
  </Layout>
)

export default IndexPage
