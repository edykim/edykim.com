import React from "react"
import styled from "styled-components"
import Footnote from "../pieces/Footnote"
import { layouts } from "~/constraint"
import { usePageLanguage } from "~/components/LocationContext"

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
  padding-top: 1.5rem;
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  row-gap: 0.5rem;
  flex-wrap: wrap;

  .copyright {
    font-weight: 600;
  }

  @media screen and (max-width: 430px) {
    flex-direction: column;
  }
`

const FooterWrapper = styled.div`
  margin: 3rem auto;
  max-width: ${layouts.content};
  padding: 0 1.0875rem;
  font-size: 0.8rem;
`

const Footer = () => {
  const lang = usePageLanguage()
  return (
    <FooterWrapper>
      <FooterContainer>
        <div>
          <SocialNav>
            <Footnote />
          </SocialNav>
          <div className="copyright">Edward Kim</div>
        </div>
        <form
          name="google-search"
          action="https://google.com/search"
          method="get"
        >
          <fieldset style={{ border: 0 }}>
            <input type="hidden" name="sitesearch" value="https://edykim.com" />
            <input
              name="q"
              type="text"
              style={{
                border: "1px solid #ccc",
                appearance: "none",
                marginRight: "0.5rem",
              }}
            />
            <input
              type="submit"
              name="btn-search"
              value={lang === "ko" ? "검색" : "Search"}
              style={{ border: "1px solid #ccc", appearance: "none" }}
            />
          </fieldset>
        </form>
      </FooterContainer>
    </FooterWrapper>
  )
}

export default Footer
