import React from "react"
import { graphql } from "gatsby"

import { Header, Content, PostList, Meta } from "components"
import { Site } from "components/layout"

export default ({ data, location, pageContext }) => {
  const { articles } = data
  const { taxonomy } = pageContext
  const sorted = articles.edges.reduce((carry, { node }) => {
    carry[node.frontmatter.dateSort] = carry[node.frontmatter.dateSort] || []
    carry[node.frontmatter.dateSort].push(node)
    return carry
  }, {})
  const years = Object.keys(sorted).sort((a, b) => b - a)
  const title = `"${taxonomy}" 태그된 글`
  return (
    <Site location={location} linkTitle={"블로그"} linkTo={"/archives"}>
      <Meta title={title} />

      <Header title={title} linkTo={location.pathname} />
      <Content>
        <p style={{ textIndent: 0 }}>{`총 ${articles.totalCount ||
          0}건의 포스트가 있습니다.`}</p>
      </Content>

      {years.map(date => {
        const nodes = sorted[date]

        return <PostList key={date} nodes={nodes} />
      })}
    </Site>
  )
}

export const query = graphql`
  query TagTaxonomyQuery($taxonomy: [String]!) {
    articles: allMarkdownRemark(
      filter: {
        frontmatter: {
          private: { ne: true }
          draft: { ne: true }
          type: { eq: "post" }
          tags: { in: $taxonomy }
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
            date(formatString: "MMMM D")
            dateSort: date(formatString: "YYYY")
            title
          }
        }
      }
    }
  }
`
