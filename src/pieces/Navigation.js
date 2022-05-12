import React from "react"
import { Link } from "gatsby"
import { usePageLanguage } from "../components/LocationContext"
import styled from "styled-components"

const NavLink = props => (
  <Link activeStyle={{ fontWeight: "700" }} partiallyActive={true} {...props} />
)

const Subtext = styled.span`
  font-size: 0.7em;
  color: #666;
`

const Navigation = () => {
  const language = usePageLanguage()
  if (language === "ko") {
    return (
      <>
        <NavLink to="/ko/post/">
          블로그 <Subtext>blog</Subtext>
        </NavLink>
        <NavLink to="/ko/notes/">
          노트 <Subtext>notes</Subtext>
        </NavLink>
        <NavLink to="/ko/about/">
          소개 <Subtext>about</Subtext>
        </NavLink>
      </>
    )
  }
  return (
    <>
      <NavLink to="/crafts/">crafts</NavLink>
      <NavLink to="/writings/">writings</NavLink>
      <NavLink to="/notes/">notes</NavLink>
      <NavLink to="/about/">about</NavLink>
    </>
  )
}

export default Navigation
