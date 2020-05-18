import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

export default ({ data, location }) => {
  const post = data.post
  return (
    <Layout location={location}>
      <SEO title={post.frontmatter.title} description={post.excerpt} />
      <h1>
        <Link className="post__title" to={post.fields.url}>
          {post.frontmatter.title}
        </Link>
      </h1>
      <time className="datetime">{post.frontmatter.date}</time>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
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
