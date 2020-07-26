import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { Container } from "../components/container"
import { Title, TitleLink } from "../components/title"
import { Time } from "../components/post"

export default ({ data, location }) => {
  const post = data.post
  return (
    <Layout location={location}>
      <SEO title={post.frontmatter.title} description={post.excerpt} />
      <Container>
        <Title>
          <TitleLink to={post.fields.url}>{post.frontmatter.title}</TitleLink>
        </Title>
        <Time>{post.frontmatter.date}</Time>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </Container>
    </Layout>
  )
}

export const query = graphql`
  query PostQuery($slug: String!) {
    post: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      excerpt(format: PLAIN, truncate: true)
      frontmatter {
        title
        lang
        date(formatString: "MMM D, Y")
      }
      fields {
        url
      }
    }
  }
`
