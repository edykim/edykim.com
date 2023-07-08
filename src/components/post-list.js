import React from "react"
import styled from "styled-components"
import PostItem from "./post-item"

const Wrapper = styled.div`
  width: var(--site-width);
  margin: 0 0 2rem;
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    max-width: 32rem;
  }
  li + li {
    border-top: 1px solid var(--color-separator);
  }
`

const PostList = ({ nodes }) => (
  <Wrapper>
    <ul>
      {nodes.length > 0 &&
        nodes.map((node, index) => (
          <PostItem post={node} key={`node-${index}`} />
        ))}
    </ul>
  </Wrapper>
)

export default PostList
