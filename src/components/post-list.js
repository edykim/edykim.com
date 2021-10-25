import React from "react"
import styled from "styled-components"
import { layouts } from "~/constraint"
import PostItem from "./post-item"

const Wrapper = styled.div`
  max-width: ${layouts.content};
  margin: 0 auto 2rem;
`
const Container = styled.div`
  padding: 0 ${layouts.sidePadding};
`

const PostList = ({ nodes }) => (
  <Wrapper>
    <Container>
      <ul style={{ listStyle: "square" }}>
        {nodes.length > 0 &&
          nodes.map((node, index) => (
            <PostItem post={node} key={`node-${index}`} />
          ))}
      </ul>
    </Container>
  </Wrapper>
)

export default PostList
