import React from "react"
import { graphql } from "gatsby"

import { Header, Content, Bio, ColophonLinks, Tags, Meta } from "components"
import { Site } from "components/layout"

export default ({ data, location, pageContext }) => {
  const post = data.markdownRemark
  const { previous, next } = pageContext
  const { date, title, headline } = post.frontmatter
  const { url } = post.fields

  return (
    <Site location={location}>
      <Meta
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />

      <Header
        publishedAt={date}
        title={title}
        headline={headline}
        linkTo={url}
      />

      <Content html={post.html} />
      <Bio />

      <Tags post={post} />
      <ColophonLinks links={[next, previous]} />
    </Site>
  )
}

export const query = graphql`
  query PostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      excerpt(format: PLAIN, truncate: true)
      frontmatter {
        title
        lang
        tags
        categories
        date(formatString: "MMMM D, YYYY")
        rawDate: date
        headline
      }
      fields {
        url
      }
    }
  }
`
