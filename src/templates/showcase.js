import * as React from "react"
import { graphql, Link } from "gatsby"

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
    <Layout location={location} title={siteTitle}>
      <Seo
        lang={post.frontmatter.lang}
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <Subject>
        <h1 itemProp="headline">{post.frontmatter.title}</h1>
        {headline && <Headline>{headline}</Headline>}
      </Subject>
      <Content page={post} itemProp={null}>
        <h2>분류로 찾기</h2>
        <h3>주제별</h3>
        <TaxonomyLinks />

        <h3>태그별</h3>
        <p>전체 태그를 보려면 <Link to={'/ko/archives/tag/'}>여기</Link>를 확인하세요.</p>

        {featuredItems.edges.length > 0 && (
          <PostShortList title={"인기 글"} posts={featuredItems.edges} />
        )}
        <PostShortList
          title={"최근 글"}
          posts={items.edges}
          linkTitle={"전체 글 보기"}
          link={"/ko/archives/posts/"}
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
      sort: {frontmatter: {date: DESC}}
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
      sort: {frontmatter: {date: DESC}}
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
