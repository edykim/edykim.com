import React from 'react'
import PropTypes from 'prop-types'

import Head from '../head'

import Header from './header'
import Footer from '../footer'

import '../layout.css'

const Layout = ({ site, lang, children }) => (
  <>
    <Head site={site} lang={lang} />

    <Header siteTitle={`${site.siteMetadata.title}`} />
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
    <Footer author={site.siteMetadata.author} />
  </>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
