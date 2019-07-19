import React from "react"
import { graphql } from "gatsby"

import { Header, Content, Meta } from "components"
import { Site } from "components/layout"

export default ({ data: { page }, location }) => {
  const { title } = page.frontmatter
  const { url } = page.fields

  return (
    <Site location={location}>
      <Meta title={page.frontmatter.title} description={page.excerpt} />
      <Header title={title} linkTo={url} />

      <Content html={page.html} />
    </Site>
  )
}

export const query = graphql`
  query PageQuery($slug: String!) {
    page: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      excerpt(format: PLAIN, truncate: true)
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
