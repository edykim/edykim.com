import React from "react"
import styled from "styled-components"
import { Container } from "./container"

const FooterComponent = styled.footer`
  padding: 3rem 0 5rem;
`

const Title = styled.div`
  font-family: "Poppins", sans-serif;
  font-size: 0.8rem;
  color: var(--site-color-subtext);
  font-weight: 900;
`

const Small = styled.small`
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--site-color-subtext);
`

const Link = styled.a`
  color: var(--site-color-text);
  text-decoration: none;
  box-shadow: 0;
`

export const Footer = () => {
  return (
    <FooterComponent>
      <Container>
        <Title>Edward Kim</Title>
        <Small>
          This page is maintianed by{" "}
          <Link href="https://github.com/edykim">edykim</Link>.
        </Small>
      </Container>
    </FooterComponent>
  )
}
