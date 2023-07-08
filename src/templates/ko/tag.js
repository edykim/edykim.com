import * as React from "react"
import { graphql } from "gatsby"

import Taxonomy from "../../components/taxonomy"

const KoTagsTemplate = props => {
  return (
    <Taxonomy {...props} format={num => `총 ${num} 건의 포스트가 있습니다.`} />
  )
}

export default KoTagsTemplate

export const query = graphql`
  query KoTagsQuery($taxonomy: [String]!) {
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
        }
        fields: {
          tags: { in: $taxonomy }
        }
      }
      sort: {frontmatter: {date: DESC}}
    ) {
      totalCount
      edges {
        node {
          excerpt(format: PLAIN, truncate: true, pruneLength: 80)
          fields {
            slug
            url
          }
          frontmatter {
            date(formatString: "YYYY년 M월 D일")
            dateSort: date(formatString: "YYYY")
            title
            headline
            lang
            type
          }
        }
      }
    }
  }
`
