import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Subject, { Headline } from "../components/subject"
import Content from "../components/content"

import PostShortList from "../components/post-short-list"

const ShowcaseTemplate = ({ data, location }) => {
  const { post, items, featuredItems } = data

  const headline = post.frontmatter.headline?.join(" ")
  const siteTitle = data.site.siteMetadata?.title || `Title`

  return (
    <Layout location={location} title={siteTitle} item={post}>
      <Seo
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
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
        <Content
          style={{
            lineHeight: 1.76,
            fontSize: "1rem",
            wordBreak: "keep-all",
            textIndent: "0.5rem",
          }}
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />
        {featuredItems.edges.length > 0 && (
          <PostShortList title={"인기 글"} posts={featuredItems.edges} />
        )}
        <PostShortList title={"최근 글"} posts={items.edges} />
      </article>
    </Layout>
  )
}

export default ShowcaseTemplate

export const pageQuery = graphql`
  query ShowcaseBySlug($id: String!, $lang: String!, $contentType: String!) {
    site {
      siteMetadata {
        title
      }
    }
    post: markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
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
    featuredItems: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 10
      filter: {
        frontmatter: {
          private: { ne: true }
          draft: { ne: true }
          featured: { eq: true }
          lang: { eq: $lang }
          type: { eq: $contentType }
        }
      }
    ) {
      edges {
        node {
          excerpt(format: PLAIN, truncate: true)
          fields {
            url
          }
          frontmatter {
            date(formatString: "MMM D")
            dateSort: date(formatString: "YYYY")
            title
          }
        }
      }
    }
    items: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 10
      filter: {
        frontmatter: {
          private: { ne: true }
          draft: { ne: true }
          lang: { eq: $lang }
          type: { eq: $contentType }
        }
      }
    ) {
      edges {
        node {
          excerpt(format: PLAIN, truncate: true)
          fields {
            url
          }
          frontmatter {
            date(formatString: "MMM D")
            dateSort: date(formatString: "YYYY")
            title
          }
        }
      }
    }
  }
`
