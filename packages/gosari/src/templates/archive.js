import React from "react"
import { graphql } from "gatsby"
import { CategoryList } from "components/CategoryList"
import { Header, Content, PostList } from "components"
import { Site } from "components/layout"

export default ({ data, location }) => {
  const { archive, articles } = data
  const sorted = articles.edges.reduce((carry, { node }) => {
    carry[node.frontmatter.dateSort] = carry[node.frontmatter.dateSort] || []
    carry[node.frontmatter.dateSort].push(node)
    return carry
  }, {})
  const categories = articles.edges.reduce((carry, { node }) => {
    node.frontmatter.categories.map(category => {
      carry[category] = carry[category] || 0
      carry[category]++
    })
    return carry
  }, {})

  const years = Object.keys(sorted).sort((a, b) => b - a)
  return (
    <Site location={location}>
      <Header
        title={archive.frontmatter.title}
        headline={archive.frontmatter.headline}
        linkTo={archive.fields.url}
      />

      <Content html={archive.html} />

      <CategoryList summary={categories} />

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
  query ArchiveQuery($slug: String!) {
    archive: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
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
            tags
            categories
          }
        }
      }
    }
  }
`
