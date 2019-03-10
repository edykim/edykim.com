import React from "react"
import { sanitizeUrl } from "@edykim/gatsby-plugin-taxonomy"
import options from "../../config/taxonomy"
import { InBoxLink } from "./inBoxLink"

export const Taxonomy = ({ post, style, linkStyle }) => {
  let links = []

  if (post.frontmatter.categories) {
    links = links.concat(
      post.frontmatter.categories.map(category => {
        const path = `/category/${sanitizeUrl(category, options)}/`
        return (
          <InBoxLink
            style={linkStyle}
            key={category}
            className={`taxonomy`}
            to={path}
          >
            {category}
          </InBoxLink>
        )
      })
    )
  }

  if (post.frontmatter.tags) {
    links = links.concat(
      post.frontmatter.tags.map(tag => {
        const path = `/tag/${sanitizeUrl(tag, options)}/`
        return (
          <InBoxLink
            style={linkStyle}
            key={tag}
            className={`taxonomy`}
            to={path}
          >
            {tag}
          </InBoxLink>
        )
      })
    )
  }

  return (
    <div className={`taxonomies`} style={style}>
      {links}
      <InBoxLink
        to={`/archives`}
        style={{ backgroundColor: "rgba(0,0,0,0.1)", color: "#ffffff" }}
      >
        전체보기
      </InBoxLink>
    </div>
  )
}
