/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"

import Header from "./header"
import Footer from "./footer"
import "./layout.css"

const MainContainer = styled.div`
  margin: 0 auto;
  min-height: calc(100vh - 250px);
  @media screen and (max-width: 720px) {
    min-height: initial;
  }
`
export const ContentContainer = styled.div`
  margin: 0 auto;
  padding: 0 1.0875rem 1rem;
  max-width: 820px;
  word-break: keep-all;
`

export const HeroContainer = styled.div`
  margin: 0 auto;
  padding: 0;
  max-width: 1140px;
`

const Layout = ({ item, children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <Header
        siteTitle={data.site.siteMetadata?.title || `Title`}
        item={item}
      />
      <MainContainer>
        <main>{children}</main>
      </MainContainer>
      <Footer />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
