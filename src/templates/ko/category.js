import * as React from "react"
import { graphql } from "gatsby"

import Taxonomy from "../../components/taxonomy"

const KoCategoriesTemplate = props => {
  return (
    <Taxonomy {...props} format={num => `총 ${num} 건의 포스트가 있습니다.`} />
  )
}

export default KoCategoriesTemplate

export const query = graphql`
  query KoCategoriesQuery($taxonomy: [String]!) {
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
          categories: { in: $taxonomy }
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
            date(formatString: "M월 D일")
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
