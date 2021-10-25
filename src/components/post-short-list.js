import React, { Component } from "react"
import styled from "styled-components"
import { colors } from "~/constraint"
import PostItem from "./post-item"

const Wrapper = styled.div`
  margin: 0 auto 2rem;
`

const Title = styled.h2`
  color: ${colors.text};
`

export default class PostShortList extends Component {
  render() {
    const { posts, title } = this.props
    return (
      <Wrapper>
        <Title>{title}</Title>
        <ul style={{ listStyle: "square" }}>
          {posts.length > 0 &&
            posts.map(({ node }, index) => (
              <PostItem
                post={node}
                key={`${title}-${index}`}
                showYears={true}
              />
            ))}
        </ul>
      </Wrapper>
    )
  }
}
