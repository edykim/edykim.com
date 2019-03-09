import React from "react"
import { graphql } from "gatsby"

export default ({ data }) => {
  const post = data.markdownRemark
  return <div>CATEGORY</div>
}

export const query = graphql`
  query CategoryTaxonomyQuery($taxonomy: [String]!) {
    articles: allMarkdownRemark(
      filter: {
        frontmatter: {
          private: { ne: true }
          draft: { ne: true }
          type: { eq: "post" }
          categories: { in: $taxonomy }
        }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
      edges {
        node {
          frontmatter {
            title
            date
          }
          fields {
            url
          }
        }
      }
    }
  }
`
