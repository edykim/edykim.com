import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import styled from "styled-components"
import Navigation from "../pieces/Navigation"
import { usePageLanguage } from "./LocationContext"

const HeaderContainer = styled.div`
  padding: 3rem 0 1rem;
  width: var(--site-width);
  ${({hasSidebar}) => hasSidebar && `
  @media screen and (min-width: 1000px) {
    padding-left: 9rem;
  }`}
  @media screen and (max-width: 780px) {
    padding: 1.5rem 0px 1rem;
  }
  margin: 0 var(--site-margin);
  line-height: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  h1 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--site-title);
    :after {
      font-weight: 400;
      content: "·";
      margin: 0 0.8rem 0 0.5rem;
      color: #aaa;
      @media (prefers-color-scheme: dark) {
        color: #49433d;
      }
    }
  }
`
const NavContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: -0.5rem;
  margin-right: -0.5rem;
  a {
    line-height: 1;
    color: inherit;
    text-decoration: none;
    margin: 0 0.3rem;
    position: relative;
    &.active:before {
      content: "";
      display: block;
      position: absolute;
      height: 2px;
      left: 0;
      bottom: -5px;
      right: 0;
      background-color: #888888;
    }
  }
`

const TitleLink = ({ siteTitle }) => {
  const lang = usePageLanguage()
  return (
    <Link
      to={lang === "ko" ? "/ko/" : "/"}
      style={{
        color: "inherit",
        textDecoration: `none`,
      }}
    >
      {lang === "ko" ? "edykim" : siteTitle}
    </Link>
  )
}

const Header = ({ siteTitle, hasSidebar }) => {
  return (
    <HeaderContainer hasSidebar={hasSidebar}>
      <h1>
        <TitleLink siteTitle={siteTitle} />
      </h1>
      <NavContainer>
        <Navigation />
      </NavContainer>
    </HeaderContainer>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
