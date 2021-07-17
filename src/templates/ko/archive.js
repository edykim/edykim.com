import { graphql } from "gatsby"
import ArchiveTemplate from "../archive"
const KoArchiveTemplate = ArchiveTemplate
export default KoArchiveTemplate

export const pageQuery = graphql`
  query KoArchiveBySlug($id: String!, $lang: String!, $contentType: String!) {
    site {
      siteMetadata {
        title
      }
    }
    post: markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        description
        headline
        contentType
        lang
        type
      }
      fields {
        url
      }
    }
    items: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: {
          private: { ne: true }
          draft: { ne: true }
          lang: { eq: $lang }
          type: { eq: $contentType }
        }
      }
    ) {
      totalCount
      edges {
        node {
          excerpt(format: PLAIN, truncate: true, pruneLength: 36)
          fields {
            slug
            url
          }
          frontmatter {
            date(formatString: "M월 D일")
            dateSort: date(formatString: "YYYY")
            title
            tags
            categories
            featured
          }
        }
      }
    }
  }
`