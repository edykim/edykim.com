import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { colors, layouts } from "~/constraint"

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: ${layouts.content};
  padding-left: 1rem;
  padding-right: 1rem;
  box-sizing: border-box;
`

const Container = styled.div`
  background-color: ${colors.backgroundAlt};
  padding: 1rem;
  ul {
    margin-top: 0;
    margin-bottom: 0;
  }
`

const Title = styled.div`
  font-weight: 700;
`

export const AsideWidget = ({
  nodes,
  node: {
    frontmatter: { lang },
    fields: { url: pageUrl },
  },
}) => {
  if (!nodes || nodes.length === 0) return null
  return (
    <Wrapper>
      <Container>
        <Title>{lang === "ko" ? "관련 페이지" : "Related Pages"}</Title>
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
                  style={{
                    color: url === pageUrl ? colors.highlight : colors.link,
                  }}
                >
                  {title}
                </Link>
              </li>
            )
          )}
        </ul>
      </Container>
    </Wrapper>
  )
}
