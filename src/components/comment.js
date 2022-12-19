import React, { useEffect, useRef } from "react"
import styled from "styled-components"

const CommentContainer = styled.div`
  margin: 2rem var(--site-margin);
  width: var(--site-width);
  .utterances {
    max-width: var(--site-width) !important;
    margin: 0 -2px;
  }
`

function assignAttrs(el, attrs) {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key])
  }
}

const Comment = () => {
  const ref = useRef(null)
  useEffect(() => {
    const se = document.createElement("script")
    assignAttrs(se, {
      src: "https://utteranc.es/client.js",
      repo: "edykim/edykim.com",
      "issue-term": "pathname",
      label: "💬 comment",
      theme: "preferred-color-scheme",
      crossorigin: "anonymous",
      async: true,
    })
    ref.current.appendChild(se)
  }, [])
  return (
    <CommentContainer>
      <div ref={ref}></div>
    </CommentContainer>
  )
}

export default Comment
