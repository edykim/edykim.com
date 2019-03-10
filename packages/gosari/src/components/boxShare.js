import React from "react"
import { Box } from "./box"
import { InBoxLink } from "./inBoxLink"

export const BoxShare = ({ article, color = "#333333", style, linkStyle }) => {
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
        이 글 공유하기
      </h1>
      <p
        style={{
          marginTop: 5,
          display: "block",
          color: "rgba(255,255,255,0.8)",
        }}
      >
        이 글이 유익했다면 주변에도 알려주세요!
      </p>

      <InBoxLink
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          document.location.href
        )}`}
        style={{ color: `#ffffff`, backgroundColor: `#4267b2` }}
      >
        페이스북으로 공유하기
      </InBoxLink>
      <InBoxLink
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
          article.frontmatter.title
        )}&url=${encodeURIComponent(document.location.href)}`}
        style={{ color: `#ffffff`, backgroundColor: `#1da1f2` }}
      >
        트위터로 공유하기
      </InBoxLink>
      <InBoxLink
        href={`https://www.linkedin.com/shareArticle/?mini=true&url=${encodeURIComponent(
          document.location.href
        )}`}
        style={{ color: `#ffffff`, backgroundColor: `#0073b1` }}
      >
        링크드인으로 공유하기
      </InBoxLink>
      <InBoxLink
        href={`mailto:?to=&subject=${encodeURIComponent(
          `참조: ${article.frontmatter.title}`
        )}&body=${encodeURIComponent(
          `이 글을 확인해보세요.\n\n${document.location.href}`
        )}`}
        style={{ color: `#ffffff`, backgroundColor: `#6700ee` }}
      >
        Email 보내기
      </InBoxLink>
    </Box>
  )
}
