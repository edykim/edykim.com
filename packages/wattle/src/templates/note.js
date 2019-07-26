import React from "react"
import { graphql } from "gatsby"
import Layout from "components/layout"
import SEO from "components/seo"
import { Content } from "components/note"

import "katex/dist/katex.min.css"

export default ({ data, location }) => {
  const page = data.page
  return (
    <Layout location={location}>
      <SEO title={page.frontmatter.title} description={page.excerpt} />
      <h1>{page.frontmatter.title}</h1>

      <Content html={page.html} />
    </Layout>
  )
}

export const query = graphql`
  query NoteQuery($slug: String!) {
    page: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      excerpt(format: PLAIN, truncate: true)
      frontmatter {
        title
        lang
        date
      }
      fields {
        url
      }
    }
  }
`
