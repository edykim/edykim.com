import { graphql } from "gatsby"
import ShowcaseTemplate from "../showcase"
const KoShowcaseTemplate = ShowcaseTemplate
export default KoShowcaseTemplate

export const pageQuery = graphql`
  query KoShowcaseBySlug($id: String!, $lang: String!, $contentType: String!) {
    site {
      siteMetadata {
        title
      }
    }
    post: markdownRemark(id: { eq: $id }) {
      id
      excerpt(format: PLAIN, truncate: true, pruneLength: 160)
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
    featuredItems: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 10
      filter: {
        frontmatter: {
          private: { ne: true }
          draft: { ne: true }
          featured: { eq: true }
          lang: { eq: $lang }
          type: { eq: $contentType }
        }
      }
    ) {
      edges {
        node {
          excerpt(format: PLAIN, truncate: true, pruneLength: 30)
          fields {
            url
          }
          frontmatter {
            date(formatString: "YYYY-MM-DD")
            dateSort: date(formatString: "YYYY")
            title
          }
        }
      }
    }
    items: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 10
      filter: {
        frontmatter: {
          private: { ne: true }
          draft: { ne: true }
          lang: { eq: $lang }
          type: { eq: $contentType }
        }
      }
    ) {
      edges {
        node {
          excerpt(format: PLAIN, truncate: true, pruneLength: 30)
          fields {
            url
          }
          frontmatter {
            date(formatString: "YYYY-MM-DD")
            dateSort: date(formatString: "YYYY")
            title
          }
        }
      }
    }
  }
`
