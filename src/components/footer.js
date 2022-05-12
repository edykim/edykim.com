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
  margin: 3rem auto;
  max-width: ${layouts.content};
  padding: 0 1.0875rem;
  font-size: 0.8rem;
`

const Form = styled.form`
  @media screen and (max-width: 430px) {
    order: -1;
    margin-bottom: 0.8rem;
    fieldset {
      margin-bottom: 0;
    }
  }
  input {
    box-sizing: border-box;
    border: 1px solid #ccc;
    min-height: 1.5rem;
    line-height: 1;
    appearance: none;
    font-size: 0.7rem;
    border-radius: 0;
    color: #000;
  }
  input[type="text"] {
    margin-right: 0.5rem;
  }
  input[type="submit"] {
    padding: 0 0.4rem;
    background-color: #eeeeee;
  }
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
          <div className="copyright">김용균 · Edward Kim</div>
        </div>
        {/* <Form
          name="google-search"
          action="https://google.com/search"
          method="get"
        >
          <fieldset style={{ border: 0 }}>
            <input type="hidden" name="sitesearch" value="https://edykim.com" />
            <input name="q" type="text" />
            <input
              type="submit"
              name="btn-search"
              value={lang === "ko" ? "검색" : "Search"}
            />
          </fieldset>
        </Form> */}
      </FooterContainer>
    </FooterWrapper>
  )
}

export default Footer
