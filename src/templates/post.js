import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import PostTemplate from "../components/post"

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata?.title || `Title`

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        lang={post.frontmatter.lang}
        date={post.frontmatter.date}
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
        noindex={post.frontmatter?.noIndex}
      />
      <PostTemplate data={data} location={location} />
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousItemId: String
    $nextItemId: String
    $beforePreviousItemId: String
    $afterNextItemId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(format: PLAIN, truncate: true, pruneLength: 160)
      htmlAst
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        headline
        lang
        type
        categories
        tags
        noIndex
      }
      fields {
        url
      }
    }
    previous: markdownRemark(id: { eq: $previousItemId }) {
      excerpt(format: PLAIN, truncate: true, pruneLength: 32)
      fields {
        url
      }
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
    next: markdownRemark(id: { eq: $nextItemId }) {
      excerpt(format: PLAIN, truncate: true, pruneLength: 32)
      fields {
        url
      }
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
    beforePrevious: markdownRemark(id: { eq: $beforePreviousItemId }) {
      excerpt(format: PLAIN, truncate: true, pruneLength: 32)
      fields {
        url
      }
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
    afterNext: markdownRemark(id: { eq: $afterNextItemId }) {
      excerpt(format: PLAIN, truncate: true, pruneLength: 32)
      fields {
        url
      }
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`
