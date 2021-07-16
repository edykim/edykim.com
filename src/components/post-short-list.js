import React, { Component } from "react"
import styled from "styled-components"
import { colors, fonts, layouts } from "~/constraint"
import PostItem from "./post-item"

const Wrapper = styled.div`
  max-width: ${layouts.narrow};
  margin: 0 auto 2rem;
`

const Title = styled.div`
  margin-bottom: 0.8rem;
  color: ${colors.text};
  font-weight: 800;
  font-size: ${fonts.title};
`

const Container = styled.div`
  padding: 0 ${layouts.sidePadding};
`

export default class PostShortList extends Component {
  render() {
    const { posts, title } = this.props
    return (
      <Wrapper>
        <Container>
          <Title>{title}</Title>

          {posts.length > 0 &&
            posts.map(({ node }, index) => (
              <PostItem
                post={node}
                key={`${title}-${index}`}
                showYears={true}
              />
            ))}
        </Container>
      </Wrapper>
    )
  }
}
