import React from "react"
import { graphql } from "gatsby"
import { Header, Content, Meta, PostList } from "components"
import { Site } from "components/layout"

export default ({ data, location }) => {
  const { archive, micros } = data
  const sorted = micros.edges.reduce((carry, { node }) => {
    carry[node.frontmatter.dateSort] = carry[node.frontmatter.dateSort] || []
    carry[node.frontmatter.dateSort].push(node)
    return carry
  }, {})

  const years = Object.keys(sorted).sort((a, b) => b - a)

  return (
    <Site location={location} linkTitle={"마이크로"} linkTo={"/micros"}>
      <Meta title={archive.frontmatter.title} description={archive.excerpt} />
      <Header
        title={archive.frontmatter.title}
        headline={archive.frontmatter.headline}
        linkTo={archive.fields.url}
      />

      <Content html={archive.html} />

      {years.map(date => {
        const nodes = sorted[date]

        return (
          <PostList
            key={date}
            nodes={nodes}
            isCollapsed={date <= new Date().getFullYear() - 3}
          />
        )
      })}
    </Site>
  )
}

export const query = graphql`
  query MicroArchiveQuery($slug: String!) {
    archive: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      excerpt(format: PLAIN, truncate: true)
      frontmatter {
        headline
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
    micros: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { type: { eq: "micro" } } }
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
            date(formatString: "MMMM D")
            dateSort: date(formatString: "YYYY")
            title
          }
        }
      }
    }
  }
`
