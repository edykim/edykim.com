import React from "react"
import styled from "styled-components"
import Footnote from '../pieces/Footnote'

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

const Footer = () => (
  <div
    style={{
      margin: `0 auto`,
      maxWidth: 960,
      padding: `0 1.0875rem 1.45rem`,
      fontSize: "0.8rem",
    }}
  >
    <FooterContainer>
      <SocialNav>
          <Footnote />
      </SocialNav>
      <div className="copyright">© {new Date().getFullYear()} edward kim</div>
    </FooterContainer>
  </div>
)

export default Footer
