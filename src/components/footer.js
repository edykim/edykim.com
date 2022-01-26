import React from "react"
import styled from "styled-components"
import Footnote from "../pieces/Footnote"
import { layouts } from "~/constraint"

const SocialNav = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0 -0.3rem;
  a {
    text-decoration: none;
    color: #666666;
    display: block;
    margin: 0 0.3rem;
  }
`

const FooterContainer = styled.footer`
  border-top: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  row-gap: 0.5rem;
  flex-wrap: wrap;
  padding-top: 1.5rem;
  
  .copyright {
    font-weight: 600;
  }
`

const FooterWrapper = styled.div`
  margin: 3rem auto;
  max-width: ${layouts.content};
  padding: 0 1.0875rem;
  font-size: 0.8rem;
`

const Footer = () => (
  <FooterWrapper>
    <FooterContainer>
      <SocialNav>
        <Footnote />
      </SocialNav>
      <div className="copyright">Edward Kim</div>
    </FooterContainer>
  </FooterWrapper>
)

export default Footer
