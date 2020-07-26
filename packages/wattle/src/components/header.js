import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { Container } from "./container"

const HeaderComponent = styled.header`
  background-color: var(--site-color-primary);
  font-size: 30px;
  > div {
    padding-top: 5rem;
    padding-bottom: 5rem;
  }
  @media screen and (max-width: 1024px) {
    font-size: 20px;
  }
`
const SubHeaderComponent = styled.header`
  background-color: var(--site-color-primary);
  font-size: 10px;
  > div {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  @media screen and (max-width: 1024px) {
    font-size: 6px;
  }
`

const SiteTitle = styled.h1`
  line-height: 1;
  margin: 0;
  font-size: 3em;
  color: #ffffff;
`

const SiteHeadline = styled.p`
  margin: 0;
  font-size: 1.2em;
  color: #ffffff;
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`

export const MainHeader = () => {
  return (
    <HeaderComponent>
      <Container>
        <SiteTitle>
          <StyledLink to={"/"}>Edward Kim</StyledLink>
        </SiteTitle>
        <SiteHeadline>Software Engineer, Web, Community</SiteHeadline>
      </Container>
    </HeaderComponent>
  )
}

export const Header = () => {
  return (
    <SubHeaderComponent>
      <Container>
        <SiteTitle>
          <StyledLink to={"/"}>Edward Kim</StyledLink>
        </SiteTitle>
      </Container>
    </SubHeaderComponent>
  )
}
