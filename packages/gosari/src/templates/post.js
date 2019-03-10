import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import { Title, Tagline, Content, Date } from "../components/article"
import { Bio } from "../components/bio"
import { Tiles } from "../components/tiles"
import { BoxArticle } from "../components/boxArticle"
import { BoxTaxonomy } from "../components/boxTaxonomy"
import { BoxShare } from "../components/boxShare"

export default ({ data, location, pageContext }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title
  const { previous, next } = pageContext

  return (
    <Layout location={location} title={siteTitle}>
      <Title>
        <Link
          to={post.fields.url}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {post.frontmatter.title}
        </Link>
      </Title>

      {post.frontmatter.headline && (
        <Tagline>{post.frontmatter.headline}</Tagline>
      )}

      <Content
        className="content"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      <Date>{post.frontmatter.date}</Date>

      <Bio />

      <Tiles style={{ marginTop: 50 }}>
        <BoxShare article={post} />
        <BoxTaxonomy
          article={post}
          color={`#6700ee`}
          linkStyle={{ color: `#444444`, backgroundColor: `#ffffff` }}
        />
        {next && <BoxArticle article={next} />}
        {previous && <BoxArticle article={previous} />}
      </Tiles>
    </Layout>
  )
}

export const query = graphql`
  query PostQuery($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        lang
        tags
        categories
        date(formatString: "MMMM DD, YYYY")
        headline
      }
      fields {
        url
      }
    }
  }
`
