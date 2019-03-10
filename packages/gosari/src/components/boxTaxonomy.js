import React from "react"
import { Box } from "./box"
import { Taxonomy } from "./taxonomy"

export const BoxTaxonomy = ({
  article,
  color = "#333333",
  style,
  linkStyle,
}) => {
  return (
    <Box color={color} style={style}>
      <h1
        style={{
          fontSize: 30,
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1,
          marginTop: 0,
        }}
      >
        주제별 목록
      </h1>
      <p
        style={{
          marginTop: 5,
          display: "block",
          color: "rgba(255,255,255,0.8)",
        }}
      >
        같은 주제의 다른 글을 읽어보고 싶다면 아래 링크를 확인하세요.
      </p>
      <Taxonomy
        post={article}
        style={{ marginTop: 10 }}
        linkStyle={linkStyle}
      />
    </Box>
  )
}
