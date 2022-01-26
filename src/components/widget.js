import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { colors, layouts } from "~/constraint"

const FloatContainer = styled.aside`
  position: sticky;
  top: 0;
  width: 100vw;
  a {
    font-size: 0.8rem;
    color: ${colors.text};
  }
  @media screen and (max-width: ${layouts.wide}) {
    display: none;
  }
`

const Container = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  margin-top: 60px;
  margin-left: ${layouts.halfContent};
  ul {
    margin-top: 0;
    margin-bottom: 0;
  }
`

const Title = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
`

export const AsideWidget = ({
  nodes,
  node: {
    fields: { url: pageUrl },
  },
}) => {
  if (!nodes || nodes.length === 0) return null
  return (
    <FloatContainer>
      <Container>
        <Title>{"관련된 페이지"}</Title>
        <ul>
          {nodes.map(
            ({
              node: {
                id,
                frontmatter: { title },
                fields: { url },
              },
            }) => (
              <li key={id}>
                <Link
                  to={url}
                  style={{ color: url === pageUrl ? "red" : "#000000" }}
                >
                  {title}
                </Link>
              </li>
            )
          )}
        </ul>
      </Container>
    </FloatContainer>
  )
}
