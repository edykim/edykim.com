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
  justify-content: space-between;
  flex-direction: row;
  margin-top: 2rem;

  @media screen and (max-width: 720px) {
    flex-direction: column;
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
