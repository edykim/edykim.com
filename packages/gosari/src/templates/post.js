import React from "react"
import { graphql } from "gatsby"

import { Header, Content, ColophonLinks, Tags, Meta } from "components"
import { Site } from "components/layout"

export default ({ data, location, pageContext }) => {
  const post = data.markdownRemark
  // const {
  //   file: { publicURL },
  // } = data.socialCard
  const { previous, next } = pageContext
  const { date, title, headline } = post.frontmatter
  const { url } = post.fields

  return (
    <Site location={location} linkTitle={"블로그"} linkTo={"/archives"}>
      <Meta
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
        url={url}
        // socialCardUrl={publicURL}
      />

      <Header
        publishedAt={date}
        title={title}
        headline={headline}
        linkTo={url}
      />

      <Content html={post.html} />

      <Tags post={post} />
      <ColophonLinks links={[previous, next]} />
    </Site>
  )
}

export const query = graphql`
  query PostQuery($slug: String!) {
    # socialCard(fields: { slug: { eq: $slug } }) {
    #   file {
    #     publicURL
    #   }
    # }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      excerpt(format: PLAIN, truncate: true)
      frontmatter {
        title
        lang
        tags
        categories
        date(formatString: "YYYY년 M월 D일")
        rawDate: date
        headline
      }
      fields {
        url
      }
    }
  }
`
