import { graphql } from "gatsby"

import BlogPostTemplate from "../post"
const KoBlogPostTemplate = BlogPostTemplate

export default KoBlogPostTemplate

export const pageQuery = graphql`
  query KoBlogPostBySlug(
    $id: String!
    $relatedIds: [String]
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
        noIndex
      }
      fields {
        url
      }
    }
    relatedPosts: allMarkdownRemark(
      sort: {frontmatter: {date: DESC}}
      filter: {
        id: { in: $relatedIds }
      }
    ) {
      edges {
        node {
          excerpt(format: PLAIN, truncate: true, pruneLength: 80)
          fields {
            url
          }
          frontmatter {
            title
            date(formatString: "YYYY.MM.DD")
            headline
          }
        }
      }
    }
  }
`
