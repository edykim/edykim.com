import React from 'react'
import { Link } from 'gatsby'
import DateTime from '../components/DateTime'
import Layout from '../components/layout'
import Helmet from 'react-helmet'

class TaxonomyTemplate extends React.Component {
  render() {
    const { articles } = this.props.data
    const taxonomy = this.props.pageContext.taxonomy
    const lang = this.props.pageContext.lang
    return (
      <Layout>
        <Helmet title={`Archives: ${taxonomy}`}>
          <meta name="robots" content="noindex" />
        </Helmet>

        <h1>{taxonomy}</h1>
        {
          lang === 'ko' ? <p>총 {articles.totalCount || 0}편의 글이 있습니다.</p> : null
        }
        {
          lang === 'en' ? <p>Total {articles.totalCount || 0} article{articles.totalCount === 1 ? `` : `s`} found.</p> : null
        }
        <ul>
        {articles.edges.map(({node}, index) =>
          <li key={index}>
            <Link to={`/${node.fields.url}`}>
              {node.frontmatter.title}
            </Link>
            <DateTime at={node.frontmatter.date}></DateTime>
          </li>
        )}
        </ul>
      </Layout>
    )
  }
}

export default TaxonomyTemplate
