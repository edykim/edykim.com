import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

import Header from './header'
import Footer from './footer'
import "prismjs/themes/prism-solarizedlight.css"
import "../styles/highlight.css"
import '../styles/fonts.css'
import './layout.css'

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
            description
            author
            keywords
          }
        }
      }
    `}
    render={data => (
      <>
        <Helmet
          titleTemplate={"%s - " + data.site.siteMetadata.title}
          meta={[
            { name: 'description', content: data.site.siteMetadata.description },
            { name: 'keywords', content: data.site.siteMetadata.keywords },
          ]}
        >
          <html lang="en" />
          <meta name="viewport" content="width=device-width" />
          <link rel='dns-prefetch' href='//www.haruair.com' />
          <link rel='dns-prefetch' href='//edykim.com' />
          <link rel='dns-prefetch' href='//secure.gravatar.com' />
          <link rel='dns-prefetch' href='//fonts.googleapis.com' />
          <link rel='dns-prefetch' href='//s.w.org' />
        </Helmet>
        <Header siteTitle={data.site.siteMetadata.title} />
        <div
          style={{
            margin: '0 auto',
            maxWidth: 760,
            padding: '0px 1.0875rem 1.45rem',
            paddingTop: 0,
          }}
        >
          {children}
        </div>
        <Footer author={data.site.siteMetadata.author} />
      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
