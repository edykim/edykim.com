import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Subject, { Headline } from "../components/subject"
import Content from "../components/content"

const PageTemplate = ({ data, location }) => {
  const post = data.markdownRemark
  const headline = post.frontmatter.headline?.join(" ")
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const noTitle = post.frontmatter?.noTitle
  const redirect = post.frontmatter?.redirect

  return (
    <Layout location={location} title={siteTitle} item={post}>
      <Seo
        redirect={redirect}
        lang={post.frontmatter.lang}
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        {!noTitle && (
          <Subject>
            <h1 itemProp="headline">{post.frontmatter.title}</h1>
            {headline && <Headline>{headline}</Headline>}
          </Subject>
        )}
        <Content
          style={{
            lineHeight: 1.76,
            fontSize: "1rem",
            wordBreak: "keep-all",
          }}
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />
      </article>
    </Layout>
  )
}

export default PageTemplate

export const pageQuery = graphql`
  query PageBySlug($id: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(format: PLAIN, truncate: true, pruneLength: 160)
      html
      frontmatter {
        title
        noTitle
        description
        headline
        lang
        type
        redirect
      }
      fields {
        url
      }
    }
  }
`
