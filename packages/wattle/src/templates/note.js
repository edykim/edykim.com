import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "components/layout"
import SEO from "components/seo"
import { Content } from "components/note"

import "katex/dist/katex.min.css"

export default ({
  data: {
    page: {
      excerpt,
      html,
      frontmatter: { title, linkToParent },
      fields: { url },
    },
  },
  location,
}) => {
  const parentLink = linkToParent ? (
    <Link to={`${url}/../`}>Go to Parent Page</Link>
  ) : null

  return (
    <Layout location={location}>
      <SEO title={title} description={excerpt} />
      <h1>
        <Link to={url} className={`post__title`}>
          {title}
        </Link>
      </h1>
      {html.length > 0 ? (
        <>
          {parentLink && (
            <header className={`parent__meta`}>{parentLink}</header>
          )}
          <Content html={html} />
          {parentLink && (
            <footer className={`parent__meta`}>{parentLink}</footer>
          )}
        </>
      ) : (
        <>
          <div className="empty">This page is empty for now.</div>
          {parentLink}
        </>
      )}
    </Layout>
  )
}

export const query = graphql`
  query NoteQuery($slug: String!) {
    page: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      excerpt(format: PLAIN, truncate: true)
      frontmatter {
        title
        lang
        date
        linkToParent
      }
      fields {
        url
      }
    }
  }
`
