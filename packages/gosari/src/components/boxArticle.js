import React from "react"
import { Link } from "gatsby"
import { Box } from "./box"

export const BoxArticle = ({ style, article }) => {
  const { frontmatter, fields, excerpt } = article
  return (
    <Box style={style}>
      <span style={{ color: "#545454", textTransform: "uppercase" }}>
        {frontmatter.date}
      </span>
      <h1
        style={{
          lineHeight: 1.6,
          fontWeight: 900,
          fontFamily: "Noto Sans KR",
          fontSize: 24,
          marginTop: 0,
        }}
      >
        {frontmatter.title}
      </h1>
      <p
        style={{
          color: "#545454",
        }}
      >
        {excerpt}
      </p>
      <div style={{ textAlign: "right" }}>
        <ReadMoreButton style={{ display: "inline-block" }} link={fields.url} />
      </div>
    </Box>
  )
}

const ReadMoreButton = ({ style, link }) => {
  return (
    <Link
      style={{
        textDecoration: "none",
        backgroundColor: "#eeeeee",
        borderRadius: 50,
        color: "#6700ee",
        fontSize: 14,
        fontWeight: 900,
        padding: "5px 20px",
        ...style,
      }}
      to={link}
    >
      더 읽기
    </Link>
  )
}
