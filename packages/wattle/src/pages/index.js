import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = ({ location }) => (
  <Layout location={location}>
    <SEO title="Home" keywords={[`edykim`]} />
    <blockquote className="hero">Think simple, do more and better.</blockquote>
    <p>
      Hey{" "}
      <span role="img" aria-label="wave hand">
        👋
      </span>{" "}
      I'm Edward. I'm passionate about solving complexities and problems through
      development with a strong background in communication and software
      engineering.
    </p>
    <ul className="main__links">
      <li>
        <Link to={`/about`}>About</Link>
      </li>
      <li>
        <Link to={`/archives`}>Posts</Link>
      </li>
      <li>
        <Link to={`/note`}>Notes</Link>
      </li>
    </ul>
    I have other pages written in Korean,{" "}
    <a href="https://edykim.com/ko/">check here</a>.
  </Layout>
)

export default IndexPage
