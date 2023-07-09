import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../../components/layout"
import Seo from "../../components/seo"
import PostTemplate from "../../components/post"
import PostListNav from "../../components/post-list-nav"
import Subject from "../../components/subject"

const BlogPostListTemplate = ({ data, location, pageContext }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        lang={"ko"}
        title={`tag: ${pageContext.taxonomy} | ${pageContext.currentPage} / ${pageContext.numPages} 페이지`}
        noindex={true}
      />

      <Subject>
        <h1>
          tag: {pageContext.taxonomy}
        </h1>
      </Subject>

      <PostListNav pageContext={pageContext} />

      {data.posts.edges.map(({ node }) => (
        <PostTemplate
          key={`post-${node.fields.slug || node.fields.url}`}
          data={{ markdownRemark: node }}
          showLinkCaret={true}
          location={location}
        />
      ))}

      <PostListNav pageContext={pageContext} />
    </Layout>
  )
}

export default BlogPostListTemplate

export const pageQuery = graphql`
  query blogTagListQuery(
    $lang: String!
    $contentType: String!
    $taxonomy: [String]
    $skip: Int!
    $limit: Int!
  ) {
    site {
      siteMetadata {
        title
      }
    }
    posts: allMarkdownRemark(
      sort: {frontmatter: {date: DESC}}
      filter: {
        frontmatter: {
          private: { ne: true }
          draft: { ne: true }
          lang: { eq: $lang }
          type: { eq: $contentType }
        }
        fields: {
          tags: { in: $taxonomy }
        }
      }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          id
          excerpt(format: PLAIN, truncate: true, pruneLength: 160)
          htmlAst
          frontmatter {
            title
            date(formatString: "YYYY년 M월 D일")
            description
            headline
            lang
            type
            categories
            tags
          }
          fields {
            url
          }
        }
      }
    }
  }
`
