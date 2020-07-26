import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { Container } from "../components/container"
import { Title, TitleLink } from "../components/title"

export default ({ data, location }) => {
  const page = data.page
  return (
    <Layout location={location}>
      <SEO title={page.frontmatter.title} description={page.excerpt} />
      <Container>
        <Title>
          <TitleLink to={page.fields.url}>{page.frontmatter.title}</TitleLink>
        </Title>
        <div dangerouslySetInnerHTML={{ __html: page.html }} />
      </Container>
    </Layout>
  )
}

export const query = graphql`
  query PageQuery($slug: String!) {
    page: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      excerpt(format: PLAIN, truncate: true)
      frontmatter {
        title
        lang
        date
      }
      fields {
        url
      }
    }
  }
`
