import { graphql } from "gatsby"

import BlogPostTemplate from "../post"
const KoBlogPostTemplate = BlogPostTemplate

export default KoBlogPostTemplate

export const pageQuery = graphql`
  query KoBlogPostBySlug(
    $id: String!
    $previousItemId: String
    $nextItemId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(format: PLAIN, truncate: true, pruneLength: 160)
      htmlAst
      frontmatter {
        title
        date(formatString: "YYYY년 M월 D일")
        description
        headline
        lang
        type
        categories
        tags
      }
      fields {
        url
      }
    }
    previous: markdownRemark(id: { eq: $previousItemId }) {
      excerpt(format: PLAIN, truncate: true, pruneLength: 16)
      fields {
        url
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextItemId }) {
      excerpt(format: PLAIN, truncate: true, pruneLength: 16)
      fields {
        url
      }
      frontmatter {
        title
      }
    }
  }
`
