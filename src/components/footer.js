import React from "react"
import styled from "styled-components"
import Footnote from "../pieces/Footnote"

const SocialNav = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0 -0.3rem;
  a {
    color: #000000;
    display: block;
    margin: 0 0.3rem;
  }
`

const FooterContainer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @media screen and (max-width: 720px) {
    align-items: flex-start;
    row-gap: 0.5rem;
    flex-wrap: wrap;
  }
`

const FooterWrapper = styled.div`
  margin: 0 auto;
  max-width: 960px;
  padding: 2rem 1.0875rem 2rem;
  font-size: 0.8rem;
`

const Footer = () => (
  <FooterWrapper>
    <FooterContainer>
      <SocialNav>
        <Footnote />
      </SocialNav>
      <div className="copyright">© {new Date().getFullYear()} edward kim</div>
    </FooterContainer>
  </FooterWrapper>
)

export default Footer
