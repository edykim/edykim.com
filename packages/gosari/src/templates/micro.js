import React from "react"
import { graphql } from "gatsby"
import { Header, Content, ColophonLinks, Meta, ContentHr } from "components"
import { Site } from "components/layout"

export default ({ data, location, pageContext }) => {
  const { micro } = data
  const { date, title = null, description = null } = micro.frontmatter
  const { url } = micro.fields
  const { previous, next } = pageContext

  return (
    <Site location={location} linkTitle={"마이크로"} linkTo={"/micros"}>
      <Meta
        title={title || date}
        description={description || micro.excerpt}
        url={url}
      />
      <Header title={title || "#"} publishedAt={date} linkTo={url} />

      <Content html={micro.html} />
      <ContentHr />

      <ColophonLinks links={[previous, next]} />
    </Site>
  )
}

export const query = graphql`
  query MicroQuery($slug: String!) {
    micro: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      excerpt(format: PLAIN, truncate: true)
      frontmatter {
        title
        date(formatString: "YYYY년 M월 D일")
        rawDate: date
      }
      fields {
        url
      }
    }
  }
`
