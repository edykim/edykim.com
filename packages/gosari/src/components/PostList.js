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
  font-weight: 600;
  font-size: ${fonts.title};
`

const Container = styled.div`
  padding: 0 ${layouts.sidePadding};
`

const Button = styled.button`
  appearance: none;
  margin-left: 10px;
  border: 0;
  background: none;
  font-size: ${fonts.tag};
  color: ${colors.text};
  padding: 0;
  cursor: pointer;
  &:focus,
  &:active,
  &:hover {
    background-color: ${colors.highlight};
  }
`

const Count = styled.small`
  color: ${colors.subtext};
`

export class PostList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isCollapsed: props.isCollapsed,
    }
  }
  render() {
    const { nodes } = this.props
    const { isCollapsed } = this.state
    const first = nodes[0]
    const date = first.frontmatter.dateSort

    return (
      <Wrapper>
        <Container>
          <Title id={`in-${date}`}>
            {date} <Count>({nodes.length})</Count>{" "}
            {isCollapsed && (
              <Button
                onClick={() => {
                  this.setState({ isCollapsed: false })
                }}
              >
                목록 열기 ▼
              </Button>
            )}
          </Title>

          {!isCollapsed &&
            nodes.length > 0 &&
            nodes.map((node, index) => (
              <PostItem post={node} key={`${date}-${index}`} />
            ))}
        </Container>
      </Wrapper>
    )
  }
}
