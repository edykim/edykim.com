import React from "react"
import { graphql } from "gatsby"

export default ({ data }) => {
  const post = data.markdownRemark
  return (
    <div>
      afwf
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </div>
  )
}

export const query = graphql`
  query PageQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
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
