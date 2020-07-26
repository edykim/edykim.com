import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { Container } from "../components/container"
import { Headline } from "../components/headline"

const List = styled.ul`
  font-size: 1.3rem;
  font-weight: 500;
  display: block;
  padding: 0;
  margin-left: -1rem;
  li {
    display: inline-block;
    margin: 0 1rem;
  }
`

const IndexPage = ({ location }) => (
  <Layout location={location} isMain={true}>
    <SEO title="Home" keywords={[`edykim`]} />
    <Container>
      <Headline>
        Hi there! My name is Edward. I'm passionate about solving complexities
        and problems through development with a strong background in
        communication and software engineering.
      </Headline>
      <List>
        <li>
          <Link to={`/about`}>About</Link>
        </li>
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
