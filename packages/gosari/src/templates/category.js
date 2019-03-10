import { graphql } from "gatsby"
import TaxonomyTemplate from "./tag"

export default TaxonomyTemplate

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
          excerpt(format: PLAIN, truncate: true)
          fields {
            slug
            url
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            dateSort: date(formatString: "MMMM YYYY")
            title
          }
        }
      }
    }
  }
`
