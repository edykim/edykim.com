import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../../components/layout"
import Seo from "../../components/seo"
import PostTemplate from "../../components/post"

const KoMicroTemplate = ({ data, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata?.title || `Title`

  return (
    <Layout location={location} title={siteTitle} item={post}>
      <Seo
        lang={post.frontmatter.lang}
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
        noindex={true}
      />
      <PostTemplate data={data} location={location} />
    </Layout>
  )
}

export default KoMicroTemplate

export const pageQuery = graphql`
  query KoMicroBySlug(
    $id: String!
    $previousItemId: String
    $nextItemId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "YYYY년 M월 D일")
        description
        headline
        lang
        type
      }
      fields {
        url
      }
    }
    previous: markdownRemark(id: { eq: $previousItemId }) {
      fields {
        url
      }
      frontmatter {
        title
        date(formatString: "YYYY년 M월 D일")
      }
    }
    next: markdownRemark(id: { eq: $nextItemId }) {
      fields {
        url
      }
      frontmatter {
        title
        date(formatString: "YYYY년 M월 D일")
      }
    }
  }
`
