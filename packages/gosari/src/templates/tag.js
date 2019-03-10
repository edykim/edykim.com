import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import { Title, Content } from "../components/article"
import { Tiles } from "../components/tiles"
import { BoxArticle } from "../components/boxArticle"
import SEO from "../components/seo"
import { Hr } from "../components/hr"

export default ({ data, location, pageContext }) => {
  const { articles } = data
  const { taxonomy } = pageContext
  const sorted = articles.edges.reduce((carry, { node }) => {
    carry[node.frontmatter.dateSort] = carry[node.frontmatter.dateSort] || []
    carry[node.frontmatter.dateSort].push(node)
    return carry
  }, {})
  const title = `"${taxonomy}" 태그된 글`
  return (
    <Layout location={location}>
      <SEO title={title} />
      <Title>{title}</Title>
      <Content className="content">
        총 {articles.totalCount || 0}건의 포스트가 있습니다.
      </Content>

      {Object.keys(sorted).map(date => {
        const nodes = sorted[date]

        return (
          <div key={date}>
            <Hr />
            <h1>{date}</h1>
            <p>{nodes.length}건의 포스트가 있습니다.</p>
            <Tiles>
              {nodes.length > 0 &&
                nodes.map((node, index) => (
                  <BoxArticle
                    article={node}
                    key={index}
                    style={{ flexGrow: 1 }}
                  />
                ))}
            </Tiles>
          </div>
        )
      })}
    </Layout>
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
            date(formatString: "MMMM DD, YYYY")
            dateSort: date(formatString: "MMMM YYYY")
            title
          }
        }
      }
    }
  }
`
