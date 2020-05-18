import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

const ArchivePage = ({
  data: {
    articles: { edges },
  },
  location,
}) => (
  <Layout location={location}>
    <SEO title="Posts" keywords={[`edykim`]} />
    <h1>Posts</h1>
    {edges.length > 0 ? (
      <ul className="archive">
        {edges.map(
          ({
            node: {
              fields: { url, slug },
              frontmatter: { title, date },
            },
          }) => (
            <li key={slug}>
              <time className="datetime">{date}</time>
              <Link to={`/${url}`}>{title}</Link>
            </li>
          )
        )}
      </ul>
    ) : (
      <div>Coming soon.</div>
    )}
  </Layout>
)

export default ArchivePage

export const query = graphql`
  query ArchiveQuery {
    articles: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { private: { ne: true }, type: { eq: "post" } } }
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
            date(formatString: "MMM D, Y")
            dateSort: date(formatString: "YYYY")
            title
          }
        }
      }
    }
  }
`
