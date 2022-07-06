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
import { LocationContextProvider } from "./LocationContext"

const MainContainer = styled.div`
  margin: 0 auto;
`
export const ContentContainer = styled.div`
> * {
  max-width: 42rem;
}
`

export const HeroContainer = styled.div`
  margin: 0 auto;
  padding: 0;
  max-width: 1140px;
`

const Main = styled.main``

const Layout = ({ item, location, children }) => {
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
    <LocationContextProvider location={location}>
      <Header
        siteTitle={data.site.siteMetadata?.title || `Title`}
        item={item}
      />
      <MainContainer>
        <Main>{children}</Main>
      </MainContainer>
      <Footer />
    </LocationContextProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
