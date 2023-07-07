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
      sort: {frontmatter: {date: DESC}}
    ) {
      totalCount
      edges {
        node {
          excerpt(format: PLAIN, truncate: true, pruneLength: 160)
          fields {
            slug
            url
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
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
