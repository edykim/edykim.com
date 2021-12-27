import React from "react"
import { Link } from "gatsby"
import { usePageLanguage } from "../components/LocationContext"

const Navigation = () => {
  const language = usePageLanguage()
  if (language === "ko") {
    return (
      <>
        <Link to="/ko/post/">블로그</Link>
        <Link to="/ko/notes/">노트</Link>
        <Link to="/ko/about/">소개</Link>
      </>
    )
  }
  return (
    <>
      <Link to="/crafts/">crafts</Link>
      <Link to="/writings/">writings</Link>
      <Link to="/notes/">notes</Link>
      <Link to="/memories/">memories</Link>
      <Link to="/about/">about</Link>
    </>
  )
}

export default Navigation
