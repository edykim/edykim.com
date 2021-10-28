import React, { useState } from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import styled, { createGlobalStyle } from "styled-components"
import Navigation from "../pieces/Navigation"
import Footnote from "../pieces/Footnote"

const collapsedWidth = "480px"

const HeaderContainer = styled.div`
  margin: 0 auto;
  max-width: 960px;
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
  margin: 0 -0.5rem;
  font-size: 0.9rem;
  a {
    display: block;
    margin: 0 0.5rem;
    color: #000000;
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
    padding-top: 5rem;
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
    :before {
      position: fixed;
      top: 1.8rem;
      font-weight: bold;
      font-size: 1rem;
      content: "edykim";
      display: block;
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
const FloatImg = styled.img`
  width: 64px;
  image-rendering: pixelated;
  position: fixed;
  right: 2rem;
  bottom: 1rem;
`

const CollapsedMenu = ({ toggleMenu }) => {
  return (
    <FloatContainer>
      <StyleWrapper>
        <CollapseButton onClick={() => toggleMenu()}>Menu</CollapseButton>
      </StyleWrapper>
    </FloatContainer>
  )
}

const HeaderWrapper = styled.header`
margin-bottom: 2rem;

@media screen and (max-width: 1140px) {
  margin-bottom: 1rem;
}
@media screen and (max-width: ${collapsedWidth}) {
  margin-bottom: 0rem;
}`

const Header = ({ siteTitle }) => {
  const [showCollpaseMenu, setCollpaseMenu] = useState(false)
  return (
    <HeaderWrapper>
      <HeaderContainer>
        <h1 style={{ margin: 0, fontSize: "1rem" }}>
          <Link
            to="/"
            style={{
              color: "#000000",
              textDecoration: `none`,
            }}
          >
            {siteTitle}
          </Link>
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
        <Nav showCollpaseMenu={showCollpaseMenu}>
          <CollpasedOnly>
            <Link to={"/"}>home</Link>
          </CollpasedOnly>
          <Navigation />
          <CollpasedOnly>
            <Footnote />
            <FloatImg src="/PROGM001.png" alt="Some cute Windows 3.1 icon :)" />
          </CollpasedOnly>
        </Nav>
      </HeaderContainer>
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
