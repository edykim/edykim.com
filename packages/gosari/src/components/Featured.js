import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { layout, color } from "styles/schema"

const Wrapper = styled.div`
  max-width: ${layout.medium};
  margin: 0 auto;
`
const Container = styled.div`
  background-color: ${color.white};
  border: 5px solid ${color.white};
  border-radius: 20px;
  box-shadow: 0 1rem 30px rgba(0, 0, 0, 0.03);
  padding: ${layout.sidePadding};
  font-size: 0.8rem;
  a {
    color: ${color.primary};
    text-decoration: none;
    border-bottom: 2px solid ${color.underline};
    margin: 0.2em 0;
    display: inline-block;
  }

  @media (max-width: 600px) {
    border-radius: 0;
  }
`

const Title = styled.div`
  font-size: 0.78em;
  color: ${color.caption};
  margin-bottom: 0.3rem;
`

export const Featured = ({ posts: { edges } }) => {
  return (
    <Wrapper>
      <Container>
        <Title>인기글</Title>
        {edges.map(({ node }, index) => {
          return (
            <div key={`featured-${index}`}>
              <Link to={`/${node.fields.url}`}>{node.frontmatter.title}</Link>
            </div>
          )
        })}
      </Container>
    </Wrapper>
  )
}
