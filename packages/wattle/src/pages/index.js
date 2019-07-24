import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = ({ location }) => (
  <Layout location={location}>
    <SEO title="Home" keywords={[`edykim`]} />
    <h1>
      Howdy{" "}
      <span role="img" aria-label="wave hand">
        👋
      </span>
    </h1>
    <p>
      Hey! I'm Edward. I'm passionate about solving complexities and problems
      through development with a strong background in communication and software
      engineering.
    </p>

    <ul>
      <li>
        <Link to={`/about`}>About Me</Link>
      </li>
      <li>
        <a href="https://edykim.com/ko/">한국어 (Korean)</a>
      </li>
    </ul>

    <h2>Contact</h2>
    <ul>
      <li>
        <a href="mailto:edward@edykim.com?subject=Hello">edward@edykim.com</a>
      </li>
      <li>
        <a href="https://twitter.com/heyedykim">twitter (@heyedykim)</a>
      </li>
      <li>
        <a href="https://github.com/edykim">Github (@edykim)</a>
      </li>
      <li>
        <a href="https://www.linkedin.com/in/edwardykim/">Linkedin</a>
      </li>
    </ul>
  </Layout>
)

export default IndexPage
