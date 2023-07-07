import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Subject, { Headline } from "../components/subject"
import Content from "../components/content"
import PostList from "../components/post-list"

const ArchiveTemplate = ({ data, location }) => {
  const { post, items } = data

  const headline = post.frontmatter.headline?.join(" ")
  const siteTitle = data.site.siteMetadata?.title || `Title`

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        lang={post.frontmatter.lang}
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
        noindex={post.frontmatter.contentType === "micro"}
      />
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <Subject>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          {headline && <Headline>{headline}</Headline>}
        </Subject>
        <Content page={post}>
        </Content>
        <Content>
          <PostList
            key={"archive"}
            nodes={items.edges.map(({ node }) => node)}
          />
        </Content>
      </article>
    </Layout>
  )
}

export default ArchiveTemplate

export const pageQuery = graphql`
  query ArchiveBySlug($id: String!, $lang: String!, $contentType: String!) {
    site {
      siteMetadata {
        title
      }
    }
    post: markdownRemark(id: { eq: $id }) {
      id
      excerpt(format: PLAIN, truncate: true, pruneLength: 160)
      htmlAst
      frontmatter {
        title
        description
        headline
        contentType
        lang
        type
      }
      fields {
        url
      }
    }
    items: allMarkdownRemark(
      sort: {frontmatter: {date: DESC}}
      filter: {
        frontmatter: {
          private: { ne: true }
          draft: { ne: true }
          lang: { eq: $lang }
          type: { eq: $contentType }
        }
      }
    ) {
      totalCount
      edges {
        node {
          excerpt(format: PLAIN, truncate: true, pruneLength: 36)
          fields {
            slug
            url
          }
          frontmatter {
            date(formatString: "MMM DD, YYYY")
            title
            tags
            categories
            featured
          }
        }
      }
    }
  }
`
