import React, { useState } from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import styled, {createGlobalStyle} from "styled-components"
import Navigation from "../pieces/Navigation"

const collapsedWidth = '480px';

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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    row-gap: 2rem;
    `
        : `display: none;`}
  }
`

const FloatContainer = styled.div`
  position: fixed;
  right: 1rem;
  top: 1.5rem;
  z-index: 200;
  @media screen and (min-width: ${collapsedWidth}) {
    display: none;
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
    <FloatContainer>
      <StyleWrapper>
        <CollapseButton onClick={() => toggleMenu()}>Menu</CollapseButton>
      </StyleWrapper>
    </FloatContainer>
  )
}

const Header = ({ siteTitle }) => {
  const [showCollpaseMenu, setCollpaseMenu] = useState(false)
  return (
    <header
      style={{
        marginBottom: `2rem`,
      }}
    >
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
          <Navigation />
        </Nav>
      </HeaderContainer>
    </header>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
