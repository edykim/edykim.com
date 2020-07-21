import React, { Component } from "react"
import styled from "styled-components"
import { colors, fonts, layouts } from "styles/schema"
import { PostItem } from "."

const Wrapper = styled.div`
  max-width: ${layouts.content};
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

export class Featured extends Component {
  render() {
    const { posts } = this.props
    return (
      <Wrapper>
        <Container>
          <Title>인기 글</Title>

          {posts.length > 0 &&
            posts.map(({ node }, index) => (
              <PostItem
                post={node}
                key={`featured-${index}`}
                showYears={true}
              />
            ))}
        </Container>
      </Wrapper>
    )
  }
}
