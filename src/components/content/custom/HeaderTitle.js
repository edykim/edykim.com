import GithubSlugger from "github-slugger"
import React from "react"

const slugger = new GithubSlugger()

const targets = ["h1", "h2", "h3", "h4", "h5", "h6", "h7"]

function toString({ children }) {
  return (
    children
      ?.map(c => (typeof c === "string" ? c : toString(c.props)))
      .join("") ?? null
  )
}

function headerWith(ContainerElement) {
  return function (props) {
    const id = slugger.slug(toString(props))
    return <ContainerElement id={id} {...props} />
  }
}

const headers = targets.reduce((carry, key) => {
  carry[key] = headerWith(key)
  return carry
}, [])

export default headers

export const resetCount = () => {
  slugger.reset()
}
