import React from "react"
import { Link } from "gatsby"
import { usePageLanguage } from "../components/LocationContext"

const Navigation = () => {
  const language = usePageLanguage()
  if (language === "ko") {
    return (
      <>
        <Link to="/ko/post/">Blog</Link>
        <Link to="/ko/notes/">Notes</Link>
        <Link to="/ko/photos/">Photos</Link>
        <Link to="/ko/about/">About</Link>
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
