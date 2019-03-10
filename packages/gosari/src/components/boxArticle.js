import React from "react"
import { Link } from "gatsby"
import { Box } from "./box"
import { InBoxLink } from "./inBoxLink"

export const BoxArticle = ({ style, article }) => {
  const { frontmatter, fields, excerpt } = article
  return (
    <Box style={style} color="#ffffff">
      <span style={{ color: "#545454", textTransform: "uppercase" }}>
        {frontmatter.date}
      </span>
      <h1
        style={{
          lineHeight: 1.6,
          fontWeight: 900,
          fontSize: 24,
          marginTop: 0,
        }}
      >
        <Link
          style={{ color: "inherit", textDecoration: "none" }}
          to={`${__PATH_PREFIX__}/${fields.url}`}
        >
          {frontmatter.title}
        </Link>
      </h1>
      <p
        style={{
          color: "#545454",
        }}
      >
        {excerpt}
      </p>
      <div style={{ textAlign: "right" }}>
        <InBoxLink
          style={{ display: "inline-block" }}
          to={`${__PATH_PREFIX__}/${fields.url}`}
        >
          더 읽기
        </InBoxLink>
      </div>
    </Box>
  )
}
