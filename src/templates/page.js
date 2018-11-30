import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import Frontispiece from '../components/Frontispiece'
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
    </Layout>
  )
}

export const query = graphql`
  query PageQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        lang
        tags
        categories
        date
      }
      fields {
        url
      }
    }
  }
`
