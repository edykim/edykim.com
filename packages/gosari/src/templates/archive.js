import React from "react"
import { graphql } from "gatsby"

import { Header, Content, PostList } from "components"
import { Site } from "components/layout"

export default ({ data, location }) => {
  const { archive, articles } = data
  const sorted = articles.edges.reduce((carry, { node }) => {
    carry[node.frontmatter.dateSort] = carry[node.frontmatter.dateSort] || []
    carry[node.frontmatter.dateSort].push(node)
    return carry
  }, {})
  const years = Object.keys(sorted).sort((a, b) => b - a)
  return (
    <Site location={location}>
      <Header
        title={archive.frontmatter.title}
        linkTo={archive.fields.url}
      ></Header>

      <Content html={archive.html} />

      {years.map(date => {
        const nodes = sorted[date]

        return <PostList key={date} nodes={nodes} />
      })}
    </Site>
  )
}

export const query = graphql`
  query ArchiveQuery($slug: String!) {
    archive: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        lang
        tags
        categories
        date
      }
      fields {
        url
      }
    }
    articles: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: {
          private: { ne: true }
          draft: { ne: true }
          type: { eq: "post" }
        }
      }
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
          }
        }
      }
    }
  }
`
