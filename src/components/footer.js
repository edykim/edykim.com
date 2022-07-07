import React from "react"
import styled from "styled-components"
import Footnote from "../pieces/Footnote"

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
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  row-gap: 0.5rem;
  flex-wrap: wrap;

  .copyright {
    margin-top: 0.5rem;
    font-weight: 700;
  }

  @media screen and (max-width: 430px) {
    flex-direction: column;
  }
`

const FooterWrapper = styled.div`
  margin: 3rem var(--site-margin);
  width: var(--site-width);
  font-size: 0.8rem;
`

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContainer>
        <div>
          <SocialNav>
            <Footnote />
          </SocialNav>
          <div className="copyright">김용균 · Edward Kim</div>
        </div>
      </FooterContainer>
    </FooterWrapper>
  )
}

export default Footer
