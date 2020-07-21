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

export class PostList extends Component {
  render() {
    const { nodes } = this.props
    const first = nodes[0]
    const date = first.frontmatter.dateSort

    return (
      <Wrapper>
        <Container>
          <Title id={`in-${date}`}>
            {date} ({nodes.length})
          </Title>
          {nodes.length > 0 &&
            nodes.map((node, index) => (
              <PostItem post={node} key={`${date}-${index}`} />
            ))}
        </Container>
      </Wrapper>
    )
  }
}
