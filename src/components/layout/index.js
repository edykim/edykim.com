import React from 'react'
import PropTypes from 'prop-types'

import { StaticQuery, graphql } from 'gatsby'

import LayoutEn from './en'
import LayoutKo from './ko'

const Layout = ({ lang, children }) => (
  <StaticQuery
    query={graphql`
      query SiteMetadataQuery {
        site {
          siteMetadata {
            title
            description
            author
            keywords
            prefetchedDomains
          }
        }
      }
    `}
    render={({ site }) => (
      <>
        {
          lang === 'ko'
            ? <LayoutKo site={site} lang={lang}>{children}</LayoutKo>
            : <LayoutEn site={site} lang={lang}>{children}</LayoutEn>
        }
      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  lang: PropTypes.string.isRequired,
}

export default Layout
