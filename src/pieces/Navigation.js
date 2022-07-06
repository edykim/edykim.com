import React from "react"
import { Link } from "gatsby"
import { usePageLanguage } from "../components/LocationContext"

const NavLink = props => (
  <Link activeClassName={'active'} partiallyActive={true} {...props} />
)

const Navigation = () => {
  const language = usePageLanguage()
  if (language === "ko") {
    return (
      <>
        <NavLink to="/ko/post/">블로그</NavLink>
        <NavLink to="/ko/archives/">아카이브</NavLink>
        <NavLink to="/ko/about/">소개</NavLink>
      </>
    )
  }
  return (
    <>
      <NavLink to="/crafts/">crafts</NavLink>
      {/* <NavLink to="/writings/">writings</NavLink> */}
      <NavLink to="/notes/">notes</NavLink>
      <NavLink to="/about/">about</NavLink>
    </>
  )
}

export default Navigation
