import React, { useState } from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import styled, { createGlobalStyle } from "styled-components"
import { Helmet } from "react-helmet"
import Navigation from "../pieces/Navigation"
import Footnote from "../pieces/Footnote"
import { usePageLanguage } from "./LocationContext"
import { layouts } from "~/constraint"

const collapsedWidth = "480px"

const HeaderContainer = styled.div`
  margin: 0 auto;
  max-width: ${layouts.content};
  padding: 2rem 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  @media screen and (max-width: ${collapsedWidth}) {
    flex-direction: column;
    align-items: flex-start;
    row-gap: 0.5rem;
  }
`

const CollpasedOnly = styled.div`
  display: none;
  @media screen and (max-width: ${collapsedWidth}) {
    display: block;
  }
`

const DocumentFixation = createGlobalStyle`
  html, body {
    overflow-y: hidden;
  }
`

const Nav = styled.nav`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0 -0.6rem;
  font-size: 0.9rem;
  a {
    display: block;
    margin: 0 0.6rem;
    color: #000000;
    text-decoration: none;
  }
  @media screen and (max-width: ${collapsedWidth}) {
    ${props =>
      props.showCollpaseMenu
        ? `
    position: fixed;
    z-index: 100;
    background: rgba(255, 255, 255, 0.95);
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    padding: 1.8rem 1.5rem;
    overflow-y: scroll;
    padding-top: 1.5rem;
    &, div {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      font-size: 1.5rem;
      row-gap: 1rem;
    }
    div {
      margin-top: 1rem;
    }
    a {
      margin: 0;
    }
    a[aria-current="page"] {
      font-weight: bold;
    }
    ul + ul {
      margin-top: 2rem;
    }
    `
        : `display: none;`}
  }
`

const FloatContainer = styled.div`
  position: fixed;
  right: 1rem;
  top: 1.5rem;
  z-index: 200;
  display: none;
  @media screen and (max-width: ${collapsedWidth}) {
    display: block;
  }
`
const StyleWrapper = styled.div`
  border: 2px solid #000000;
  border-radius: 3px;
`
const CollapseButton = styled.button`
  appearance: none;
  color: #000000;
  font-family: monospace;
  font-weight: bold;
  border-width: 2px;
  background-color: #c0c0c0;
  border-top-color: #ffffff;
  border-left-color: #ffffff;
  border-right-color: #aaaaaa;
  border-bottom-color: #aaaaaa;
  outline: none;
  &:focus {
    background-color: #dddddd;
  }
`

const CollapsedMenu = ({ toggleMenu }) => {
  return (
    <FloatContainer className={"global-nav-toggle"}>
      <StyleWrapper>
        <CollapseButton onClick={() => toggleMenu()}>Menu</CollapseButton>
      </StyleWrapper>
    </FloatContainer>
  )
}

const HeaderWrapper = styled.header`
  margin-bottom: 2rem;
  margin-top: 2rem;

  @media screen and (max-width: 1140px) {
    margin-bottom: 1rem;
  }
  @media screen and (max-width: ${layouts.content}) {
    margin-bottom: 0rem;
    margin-top: 0rem;
  }
`

const noscriptStyle = `
@media screen and (max-width: ${collapsedWidth}) {
  .global-nav-toggle {
    display: none !important;
  }
  .global-nav {
    display: flex !important;
  }
  .global-nav > div {
    display: none;
  }
}
`

const TitleLink = ({ siteTitle }) => {
  const lang = usePageLanguage()
  return (
    <Link
      to={lang === "ko" ? "/ko/" : "/"}
      style={{
        color: "#000000",
        textDecoration: `none`,
      }}
    >
      {`${siteTitle}${lang === "ko" ? "/ko" : ""}`}
    </Link>
  )
}
const NavHeaderLink = ({ siteTitle }) => {
  const lang = usePageLanguage()
  return (
    <Link to={lang === "ko" ? "/ko/" : "/"}>
      {lang === "ko" ? "첫 페이지" : "home"}
    </Link>
  )
}

const Header = ({ siteTitle }) => {
  const [showCollpaseMenu, setCollpaseMenu] = useState(false)
  return (
    <HeaderWrapper>
      <HeaderContainer>
        <h1 style={{ margin: 0, fontSize: "1rem" }}>
          <TitleLink siteTitle={siteTitle} />
        </h1>
        <CollapsedMenu
          toggleMenu={() => {
            setCollpaseMenu(!showCollpaseMenu)
            if (typeof window !== "undefined") {
              window.addEventListener("keydown", function keydown({ code }) {
                if (code === "Escape") {
                  window.removeEventListener("keydown", keydown)
                  setCollpaseMenu(false)
                }
              })
            }
          }}
        />
        {showCollpaseMenu && <DocumentFixation />}
        <Nav className={"global-nav"} showCollpaseMenu={showCollpaseMenu}>
          <CollpasedOnly>
            <NavHeaderLink />
          </CollpasedOnly>
          <Navigation />
          <CollpasedOnly>
            <Footnote />
          </CollpasedOnly>
        </Nav>
      </HeaderContainer>
      <Helmet>
        <noscript>{`<style>${noscriptStyle}</style>`}</noscript>
      </Helmet>
    </HeaderWrapper>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
