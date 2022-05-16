import * as React from "react"
import { graphql } from "gatsby"

import Seo from "../components/seo"
import Subject, { Headline } from "../components/subject"
import Content from "../components/content"

const MiniTemplate = ({ data }) => {
  const { page } = data

  const headline = page.frontmatter.headline?.join(" ")
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const noTitle = page.frontmatter?.noTitle
  const redirect = page.frontmatter?.redirect
  const noIndex = page.frontmatter?.noIndex

  return (
    <>
      <Seo
        noindex={noIndex}
        redirect={redirect}
        lang={page.frontmatter.lang}
        title={page.frontmatter.title}
        description={page.frontmatter.description || page.excerpt}
      />
      <article
        style={{ margin: "2rem 0" }}
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
        <Content page={page} />
      </article>
    </>
  )
}

export default MiniTemplate

export const pageQuery = graphql`
  query MiniPageBySlug($id: String!) {
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
  }
`
