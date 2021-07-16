import * as React from "react"
import { graphql } from "gatsby"

import Taxonomy from "../components/taxonomy"

const TagsTemplate = props => {
  return <Taxonomy {...props} format={num => `Total ${num} posts.`} />
}

export default TagsTemplate

export const query = graphql`
  query TagsQuery($taxonomy: [String]!) {
    site {
      siteMetadata {
        title
      }
    }
    articles: allMarkdownRemark(
      filter: {
        frontmatter: {
          private: { ne: true }
          draft: { ne: true }
          type: { eq: "post" }
          tags: { in: $taxonomy }
        }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
      edges {
        node {
          excerpt(format: PLAIN, truncate: true)
          fields {
            slug
            url
          }
          frontmatter {
            date(formatString: "MMMM D")
            dateSort: date(formatString: "YYYY")
            title
            lang
            type
          }
        }
      }
    }
  }
`
