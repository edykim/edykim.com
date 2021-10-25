import * as React from "react"
import { Link } from "gatsby"

import Layout from "./layout"
import Seo from "./seo"
import Subject from "./subject"
import Content from "./content"
import PostList from "./post-list"

const Taxonomy = ({ data, location, pageContext, format }) => {
  const { articles } = data
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const title = `${pageContext.name}: ${pageContext.taxonomy}`

  return (
    <Layout
      location={location}
      title={siteTitle}
      item={articles.edges[0]?.node}
    >
      <Seo
        lang={articles.edges[0]?.node.frontmatter.lang}
        title={title}
        noindex={true}
      />
      <section>
        <Subject>
          <h1>
            <Link to={location.pathname}>{title}</Link>
          </h1>
        </Subject>
        <Content>
          <p style={{ textIndent: 0 }}>{format(articles.totalCount || 0)}</p>
        </Content>
        <PostList nodes={articles.edges.map(({ node }) => node)} />
      </section>
    </Layout>
  )
}

export default Taxonomy
