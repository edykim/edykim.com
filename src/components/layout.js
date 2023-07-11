/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React, { useState } from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"

import Header from "./header"
import Footer from "./footer"
import Sidebar from "./sidebar"
import "./layout.css"
import { LocationContextProvider } from "./LocationContext"

const MainContainer = styled.div`
  margin: 0 auto;
  position: relative;
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

const Main = styled.main`
  ${({ forceHide }) =>
    forceHide &&
    `
    @media screen and (max-width: 999px) {
      display: none;
    }
`}
`

const ToggleButton = styled.div`
  position: absolute;
  right: 0;
  margin: 0 var(--site-margin);
  top: 2.5rem;
  z-index: 10000;
  button {
    background: transparent;
    border: 0;
    color: var(--color-subtitle);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    padding: 0;
    margin-right: -10px;
    margin-top: -6px;
    appearance: none;
    cursor: pointer;
    &:after {
      content: "";
      display: block;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 448 512"><path fill="%23cccccc" d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>');
      width: 20px;
      height: 20px;
    }
    &.opened:after {
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 384 512"><path fill="%23cccccc" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>');
    }
  }

  ${({ hasSidebar }) =>
    !hasSidebar ? `display: none !important;` : `display: none;`}

  @media screen and (max-width: 1150px) {
    display: block;
  }
  @media screen and (max-width: 780px) {
    top: 1rem;
  }
`

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
  const LayoutWrapper = styled.div`
    padding-left: 9rem;
    @media screen and (max-width: 1150px) {
      padding-left: 0;
    }
  `

  const hasSidebar = location.pathname.startsWith("/ko/")
  const [toggleSidebar, setToggleSidebar] = useState(false)

  return (
    <LocationContextProvider location={location}>
      <LayoutWrapper>
        {hasSidebar && <Sidebar forceShow={toggleSidebar} />}
        <div>
          <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
          <ToggleButton hasSidebar={hasSidebar}>
            <button
              aria-expanded={toggleSidebar ? "true" : "false"}
              className={toggleSidebar ? "opened" : undefined}
              onClick={() => {
                setToggleSidebar(!toggleSidebar)
              }}
            ></button>
          </ToggleButton>
          <MainContainer>
            <Main forceHide={toggleSidebar}>{children}</Main>
          </MainContainer>
          <Footer />
        </div>
      </LayoutWrapper>
    </LocationContextProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
