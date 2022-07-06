import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import styled from "styled-components"
import Navigation from "../pieces/Navigation"
import { usePageLanguage } from "./LocationContext"

const HeaderContainer = styled.div`
  padding: 3rem 0 1rem;
  @media screen and (max-width: 640px) {
    padding: 1rem 0;
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
    :after {
      font-weight: 400;
      content: "·";
      margin: 0 0.4rem;
      color: #aaa;
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
    color: black;
    text-decoration: none;
    margin: 0 0.3rem;
  }
`

const TitleLink = () => {
  const lang = usePageLanguage()
  return (
    <Link
      to={lang === "ko" ? "/ko/" : "/"}
      style={{
        color: "#000000",
        textDecoration: `none`,
      }}
    >
      {`보통의 비망록`}
    </Link>
  )
}

const Header = ({ siteTitle }) => {
  return (
      <HeaderContainer>
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
