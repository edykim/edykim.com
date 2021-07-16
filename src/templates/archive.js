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

  const sorted = items.edges.reduce((carry, { node }) => {
    carry[node.frontmatter.dateSort] = carry[node.frontmatter.dateSort] || []
    carry[node.frontmatter.dateSort].push(node)
    return carry
  }, {})
  // const categories = items.edges.reduce((carry, { node }) => {
  //   node.frontmatter.categories &&
  //     node.frontmatter.categories.forEach(category => {
  //       carry[category] = carry[category] || 0
  //       carry[category]++
  //     })
  //   return carry
  // }, {})

  const years = Object.keys(sorted).sort((a, b) => b - a)

  return (
    <Layout location={location} title={siteTitle} item={post}>
      <Seo
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
        {years.map(date => {
          const nodes = sorted[date]

          return (
            <PostList
              key={date}
              nodes={nodes}
              isCollapsed={date <= new Date().getFullYear() - 4}
            />
          )
        })}
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
    items: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
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
            date(formatString: "MMM D")
            dateSort: date(formatString: "YYYY")
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
