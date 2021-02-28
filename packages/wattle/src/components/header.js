import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { Container } from "./container"

const HeaderComponent = styled.header`
  font-size: 10px;
  > div {
    padding-top: 3rem;
    padding-bottom: 1rem;
  }
  @media screen and (max-width: 1024px) {
    > div {
      padding-top: 1rem;
      padding-bottom: 0;
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

const SiteHeadline = styled.p`
  display: inline-block;
  margin: 0;
  margin-top: 0.8rem;
  font-size: 1rem;
  line-height: 1.4;
  color: var(--site-color-primary);
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
        <SiteHeadline>Software Engineer, Web, Community</SiteHeadline>
      </Container>
    </HeaderComponent>
  )
}
