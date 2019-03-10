import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import { Title, Content } from "../components/article"
import { Tiles } from "../components/tiles"
import { BoxArticle } from "../components/boxArticle"
import { Hr } from "../components/hr"

export default ({ data, location }) => {
  const { archive, articles } = data
  const sorted = articles.edges.reduce((carry, { node }) => {
    carry[node.frontmatter.dateSort] = carry[node.frontmatter.dateSort] || []
    carry[node.frontmatter.dateSort].push(node)
    return carry
  }, {})
  return (
    <Layout location={location}>
      <Title>{archive.frontmatter.title}</Title>
      <Content
        className="content"
        dangerouslySetInnerHTML={{ __html: archive.html }}
      />

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
            date(formatString: "MMMM DD, YYYY")
            dateSort: date(formatString: "MMMM YYYY")
            title
          }
        }
      }
    }
  }
`
