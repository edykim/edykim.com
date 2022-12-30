import React, { useEffect, useRef } from "react"
import styled from "styled-components"

const CommentContainer = styled.div`
  margin: 2rem var(--site-margin);
  .giscus-frame {
    max-width: var(--site-width) !important;
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
      src: "https://giscus.app/client.js",
      "data-repo":"edykim/edykim.com",
      "data-repo-id":"MDEwOlJlcG9zaXRvcnkxMDgxMTYwNDY=",
      "data-category":"Announcements",
      "data-category-id":"DIC_kwDOBnG4Ts4CTVMX",
      "data-mapping":"pathname",
      "data-strict":"0",
      "data-reactions-enabled":"0",
      "data-emit-metadata":"0",
      "data-input-position":"bottom",
      "data-theme":"preferred_color_scheme",
      "data-lang":"en",
      "data-loading":"lazy",
      "crossorigin":"anonymous",
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
