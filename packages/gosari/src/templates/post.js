import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { Tiles } from "../components/tiles"
import { Title, Tagline, Content, Date } from "../components/article"
import { BoxArticle, BoxTaxonomy, BoxShare } from "../components/boxes"
import { Bio } from "../components/bio"

export default ({ data, location, pageContext }) => {
  const post = data.markdownRemark
  const { previous, next } = pageContext

  return (
    <Layout location={location}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
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

      <Date datetime={post.frontmatter.rawDate}>{post.frontmatter.date}</Date>

      <Bio />

      <Tiles style={{ marginTop: 50 }}>
        <BoxShare article={post} location={location} />
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
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      excerpt(format: PLAIN, truncate: true)
      frontmatter {
        title
        lang
        tags
        categories
        date(formatString: "MMMM DD, YYYY")
        rawDate: date
        headline
      }
      fields {
        url
      }
    }
  }
`
