import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { Container } from "./container"

const HeaderComponent = styled.header`
  font-size: 10px;
  > div {
    padding-top: 4rem;
    padding-bottom: 1rem;
  }
  @media screen and (max-width: 1024px) {
    > div {
      padding-top: 3rem;
      padding-bottom: 0.5rem;
    }
  }
`

const SiteTitle = styled.h1`
  line-height: 1;
  margin: 0;
  display: inline-block;
  color: var(--site-color-primary);
  margin-right: 10px;
`

const MainSiteTitle = styled.h1`
  line-height: 1;
  margin: 0;
  display: inline-block;
  color: var(--site-color-primary);
  margin-right: 10px;
  font-size: 2rem;
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`

export const Header = () => {
  return (
    <HeaderComponent>
      <Container>
        <SiteTitle>
          <StyledLink to={"/"}>Edward Kim</StyledLink>
        </SiteTitle>
      </Container>
    </HeaderComponent>
  )
}

export const MainHeader = () => {
  return (
    <HeaderComponent>
      <Container>
        <MainSiteTitle>
          <StyledLink to={"/"}>Hi, I'm Edward Kim.</StyledLink>
        </MainSiteTitle>
      </Container>
    </HeaderComponent>
  )
}
