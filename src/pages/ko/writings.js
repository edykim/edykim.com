import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout, { ContentContainer } from "../../components/layout"
import Seo from "../../components/seo"
import PostShortList from "../../components/post-short-list"
import TaxonomyLinks from "../../components/taxonomy-links"

const KoBlogPage = ({ data, location }) => {
  const { items, featuredItems } = data
  return (
    <Layout location={location}>
      <Seo title="Home" />
      <ContentContainer>
        <h1>블로그</h1>
        <h2>주제별</h2>
        <TaxonomyLinks />
        {featuredItems.edges.length > 0 && (
          <PostShortList title={"인기 글"} posts={featuredItems.edges} />
        )}
        <PostShortList title={"최근 글"} posts={items.edges} />
        <p style={{ marginBottom: "2rem" }}>
          <Link to="/ko/archives/">전체 글 보기</Link>
        </p>
      </ContentContainer>
    </Layout>
  )
}

export default KoBlogPage

export const pageQuery = graphql`
  query KoBlogPage {
    site {
      siteMetadata {
        title
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
          lang: { eq: "ko" }
          type: { eq: "post" }
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
      limit: 5
      filter: {
        frontmatter: {
          private: { ne: true }
          draft: { ne: true }
          lang: { eq: "ko" }
          type: { eq: "post" }
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
