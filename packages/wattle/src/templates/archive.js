import React from "react"
import styled from "styled-components"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { Container } from "../components/container"
import { Title } from "../components/title"
import { Time } from "../components/post"

const List = styled.ul``

const ArchivePage = ({
  data: {
    articles: { edges },
  },
  location,
}) => (
  <Layout location={location}>
    <SEO title="Posts" keywords={[`edykim`]} />
    <Container>
      <Title>Posts</Title>
      {edges.length > 0 ? (
        <List>
          {edges.map(
            ({
              node: {
                fields: { url, slug },
                frontmatter: { title, date },
              },
            }) => (
              <li key={slug}>
                <Link to={`/${url}`}>{title}</Link>
                <Time style={{ marginLeft: "0.5rem" }}>{date}</Time>
              </li>
            )
          )}
        </List>
      ) : (
        <div>Coming soon.</div>
      )}
    </Container>
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
