import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Subject, { Headline } from "../components/subject"
import Content from "../components/content"

import PostShortList from "../components/post-short-list"
import TaxonomyLinks from "../components/taxonomy-links"

const ShowcaseTemplate = ({ data, location }) => {
  const { post, items, featuredItems } = data

  const headline = post.frontmatter.headline?.join(" ")
  const siteTitle = data.site.siteMetadata?.title || `Title`

  return (
    <Layout location={location} title={siteTitle} item={post}>
      <Seo
        lang={post.frontmatter.lang}
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <Subject>
        <h1 itemProp="headline">{post.frontmatter.title}</h1>
        {headline && <Headline>{headline}</Headline>}
      </Subject>
      <Content
        style={{
          lineHeight: 1.76,
          fontSize: "1rem",
          wordBreak: "keep-all",
        }}
        page={post}
      />
      <Content>
        <h2>주제별</h2>
        <TaxonomyLinks />
        {featuredItems.edges.length > 0 && (
          <PostShortList title={"인기 글"} posts={featuredItems.edges} />
        )}
        <PostShortList
          title={"최근 글"}
          posts={items.edges}
          linkTitle={"전체 글 보기"}
          link={"/ko/archives/"}
        />
      </Content>
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
