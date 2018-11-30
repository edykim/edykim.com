import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'

import Frontispiece from '../components/Frontispiece'
import Colophon from '../components/Colophon'

import Card from '../components/Card'

export default ({ data }) => {
  const post = data.markdownRemark

  return (
    <Layout lang={post.frontmatter.lang}>
      <Card info={post} />

      <Frontispiece frontmatter={post.frontmatter} />

      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      <Colophon content={post} />
    </Layout>
  )
}

export const query = graphql`
  query BlogPostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date
        lang
        headline
        categories
        tags
        history {
          from
          movedAt
        }
      }
      fields {
        url
      }
    }
  }
`
