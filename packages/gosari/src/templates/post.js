import React from "react"
import { graphql } from "gatsby"

export default ({ data }) => {
  const post = data.markdownRemark
  return (
    <div>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </div>
  )
}

export const query = graphql`
  query PostQuery($slug: String!) {
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
