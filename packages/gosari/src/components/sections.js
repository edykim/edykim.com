import React from "react"
import styled, { css } from "styled-components"
import { colors, fonts } from "styles/schema"
import { Link } from "gatsby"
import Container from "components/layout/Container"

export const SectionContainer = styled.section`
  > div > p {
    word-break: keep-all;
    line-height: 1.6;
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
  line-height: 1.6;
  font-weight: 600;
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
  text-decoration: none;
  box-shadow: 0 1px 0;
  &:focus,
  &:hover,
  &:active {
    background-color: ${colors.highlight};
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
