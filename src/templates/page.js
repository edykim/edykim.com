import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Subject, { Headline } from "../components/subject"
import Content from "../components/content"

const PageTemplate = ({ data, location }) => {
  const { page } = data

  const headline = page.frontmatter.headline?.join(" ")
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const noTitle = page.frontmatter?.noTitle
  const redirect = page.frontmatter?.redirect
  const noIndex = page.frontmatter?.noIndex

  return (
    <Layout location={location} title={siteTitle} item={page}>
      <Seo
        noindex={noIndex}
        redirect={redirect}
        lang={page.frontmatter.lang}
        title={page.frontmatter.title}
        description={page.frontmatter.description || page.excerpt}
      />
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        {!noTitle && (
          <Subject>
            <h1 itemProp="headline">{page.frontmatter.title}</h1>
            {headline && <Headline>{headline}</Headline>}
          </Subject>
        )}
        <Content
          style={{
            fontSize: "1rem",
            wordBreak: "keep-all",
          }}
          page={page}
        />
      </article>
    </Layout>
  )
}

export default PageTemplate

export const pageQuery = graphql`
  query PageBySlug(
    $id: String!
    $lang: String!
    $type: String!
    $tags: [String]!
  ) {
    site {
      siteMetadata {
        title
      }
    }
    page: markdownRemark(id: { eq: $id }) {
      id
      excerpt(format: PLAIN, truncate: true, pruneLength: 160)
      htmlAst
      frontmatter {
        title
        noTitle
        description
        headline
        lang
        type
        redirect
        noIndex
      }
      fields {
        url
      }
    }
    relatedPages: allMarkdownRemark(
      sort: {frontmatter: {date: ASC}}
      limit: 10
      filter: {
        frontmatter: {
          private: { ne: true }
          draft: { ne: true }
          lang: { eq: $lang }
          type: { eq: $type }
          tags: { in: $tags }
        }
      }
    ) {
      edges {
        node {
          excerpt(format: PLAIN, truncate: true)
          id
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
