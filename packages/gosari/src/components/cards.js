import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { colors, layouts, fonts } from "styles/schema"

const CardContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-left: -${layouts.sidePadding};
  margin-right: -${layouts.sidePadding};
  margin-bottom: 0;
  @media all and (max-width: 900px) {
    display: block;
  }
`

const Card = styled.li`
  margin: 5px;
  padding: ${layouts.sidePadding};
  position: relative;
  min-width: 40%;
  flex: 1;
  flex-grow: 1;
  border: 1px solid ${colors.backgroundAlt};
  flex-direction: column;
  display: flex;
  justify-content: space-between;
  transition: transform ease-out 0.1s;

  @media all and (min-width: 900px) {
    min-height: 100px;
  }
  @media all and (max-width: 900px) {
    border: 0;
    border-bottom: 1px solid ${colors.backgroundAlt};
  }
`
const Title = styled.h1`
  margin: 0;
  word-break: keep-all;
  font-size: ${fonts.card.title};
  color: ${colors.body};
`
const Headline = styled.p`
  word-break: keep-all;
  margin: 0;
  font-size: ${fonts.card.headline};
  width: 80%;
  color: ${colors.subtext};
`
const ReadMore = styled(Link)`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  text-indent: -2000em;

  &:after {
    text-indent: 0;
    color: ${colors.subtext};
    position: absolute;
    right: 20px;
    bottom: 15px;
    font-size: 18px;
    content: "→";
    transition: transform ease-out 0.3s;
    transform: scale(1);
  }

  @media all and (max-width: 900px) {
    &:after {
      display: none;
    }
  }
`

export const Cards = ({ data }) => {
  return (
    <CardContainer>
      {data.map(({ node }) => {
        return (
          <Card key={node.fields.slug}>
            <Title>{node.frontmatter.title}</Title>
            <Headline>{node.frontmatter.headline}</Headline>
            <ReadMore to={`/${node.fields.url}`}>본문 읽기</ReadMore>
          </Card>
        )
      })}
    </CardContainer>
  )
}
