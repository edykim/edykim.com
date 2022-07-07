import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../../components/layout"
import Seo from "../../components/seo"
import Subject, { Headline } from "../../components/subject"
import Content from "../../components/content"

import PostShortList from "../../components/post-short-list"
import TaxonomyLinks from "../../components/taxonomy-links"

const TagsTemplate = ({ data, location }) => {
  const { post, items } = data

  const headline = post.frontmatter.headline?.join(" ")
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const tags = Array.from(
    new Set(
      items.edges
        .map(
          ({
            node: {
              frontmatter: { tags },
            },
          }) => tags
        )
        .reduce((carry, value) => {
          carry = carry.concat(value)
          return carry
        }, [])
        .filter(v => v)
    )
  ).sort((a, b) => a.localeCompare(b))

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        lang={post.frontmatter.lang}
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
        noindex={true}
      />
      <Subject>
        <h1 itemProp="headline">{post.frontmatter.title}</h1>
        {headline && <Headline>{headline}</Headline>}
      </Subject>
      <Content>
        <TaxonomyLinks tags={tags} />
      </Content>
    </Layout>
  )
}

export default TagsTemplate

export const pageQuery = graphql`
  query TagBySlug($id: String!, $lang: String!) {
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
      filter: {
        frontmatter: {
          private: { ne: true }
          draft: { ne: true }
          lang: { eq: $lang }
          type: { eq: "post" }
        }
      }
    ) {
      edges {
        node {
          frontmatter {
            tags
          }
        }
      }
    }
  }
`
