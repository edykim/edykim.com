import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

import { Title, Content } from "../components/article"

export default ({ data, location }) => {
  const page = data.page
  return (
    <Layout location={location}>
      <SEO title={page.frontmatter.title} />
      <Title>
        <Link
          to={page.fields.url}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {page.frontmatter.title}
        </Link>
      </Title>
      <Content
        className="content"
        dangerouslySetInnerHTML={{ __html: page.html }}
      />
    </Layout>
  )
}

export const query = graphql`
  query PageQuery($slug: String!) {
    page: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        lang
        tags
        categories
        date
      }
      fields {
        url
      }
    }
  }
`
