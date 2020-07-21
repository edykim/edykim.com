import React from "react"
import styled, { css } from "styled-components"
import { colors, fonts } from "styles/schema"
import { Link } from "gatsby"
import Container from "components/layout/Container"

export const SectionContainer = styled.section`
  > div > p {
    font-size: ${fonts.section};
    font-weight: 500;
    word-break: keep-all;
  }
  ${props =>
    props.isOdd &&
    css`
      background-color: ${colors.backgroundAlt};
    `}
`

export const SectionTitle = styled.h1`
  margin: 0;
  font-size: ${fonts.title};
  font-weight: 900;
  color: ${colors.text};
  ${props =>
    props.hero &&
    css`
      color: ${colors.primary};
    `}
`

export const SectionList = styled.ul`
  list-style: square;
  > * {
    margin: 10px 0;
  }
`

const linkStyle = css`
  color: ${colors.link};
  font-weight: 900;
  font-size: ${fonts.button};
  text-decoration: none;
  box-shadow: 0 3px 0;
  &:focus,
  &:hover,
  &:active {
    background-color: ${colors.highlight};
  }
  &:after {
    position: absolute;
    content: "→";
    transition: transform ease-out 0.3s;
    transform: scale(1) translateX(5px);
  }
  &:focus:after,
  &:hover:after,
  &:active:after {
    transition: transform ease-out 0.3s;
    transform: scale(1.3) translateX(10px) rotateZ(-360deg);
  }
`

export const SectionOutLink = styled.a`
  ${linkStyle}
`
export const SectionLink = styled(Link)`
  ${linkStyle}
`

export const Section = ({ isOdd, overwrap, children }) => (
  <SectionContainer isOdd={isOdd}>
    <Container overwrap={overwrap}>{children}</Container>
  </SectionContainer>
)
