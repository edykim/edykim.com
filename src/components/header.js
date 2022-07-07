import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import styled from "styled-components"
import Navigation from "../pieces/Navigation"
import { usePageLanguage } from "./LocationContext"

const HeaderContainer = styled.div`
  padding: 3rem 0 1rem;
  width: var(--site-width);
  @media screen and (max-width: 620px) {
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
    position: relative;
    &.active:before {
      content: "";
      display: block;
      position: absolute;
      height: 30px;
      left: 0;
      bottom: -0.8rem;
      right: 0;
      background-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' viewBox='0 0 6 8' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xml:space='preserve' xmlns:serif='http://www.serif.com/' style='fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;'%3E%3Cpath d='M-0.07,6.135C-0.058,6.135 0.049,6.048 0.056,6.042C0.107,6.004 0.157,5.968 0.208,5.929C0.399,5.782 0.596,5.629 0.817,5.53C0.883,5.501 0.908,5.486 0.971,5.453C0.978,5.448 1.019,5.434 1.075,5.461C1.095,5.47 1.128,5.481 1.143,5.496C1.201,5.554 1.227,5.594 1.29,5.648C1.478,5.81 1.681,5.947 1.866,6.111C1.933,6.17 1.999,6.229 2.069,6.283C2.078,6.29 2.108,6.329 2.126,6.323C2.167,6.309 2.213,6.253 2.245,6.227C2.341,6.152 2.438,6.075 2.536,6.002C2.705,5.875 2.897,5.804 3.095,5.738C3.192,5.706 3.289,5.672 3.384,5.634C3.393,5.631 3.459,5.608 3.461,5.61C3.535,5.712 3.583,5.838 3.658,5.942C3.766,6.092 3.895,6.221 4.017,6.357C4.071,6.417 4.128,6.477 4.193,6.523C4.202,6.529 4.24,6.576 4.252,6.576C4.262,6.576 4.265,6.56 4.272,6.552C4.308,6.512 4.346,6.47 4.386,6.432C4.499,6.327 4.632,6.239 4.754,6.142C4.854,6.061 5.082,5.957 5.136,5.907C5.197,5.851 5.336,5.775 5.463,5.634C5.465,5.632 5.461,5.633 5.463,5.634C5.51,5.681 5.586,5.734 5.637,5.776C5.814,5.92 5.856,5.901 6.007,6.068C6.061,6.128 6.43,6.371 6.487,6.428' style='fill:none;stroke:black;stroke-width:0.3px;stroke-linecap:round;stroke-miterlimit:1.5;'/%3E%3C/svg%3E");
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
      {lang === "ko" ? "보통의 비망록" : siteTitle}
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
