import React, { Component } from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { layouts, colors } from "styles/schema"
import Container from "./Container"

const Wrapper = styled.footer`
  ul {
    list-style: none;
    margin-left: -5px;
    margin-right: -5px;
  }
  li {
    display: inline-block;
    margin: 0 5px;
  }
  li a {
    color: ${colors.subtext};
  }
  > * {
    padding-top: 1em;
    padding-bottom: 5em;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  @media all and (max-width: 900px) {
    > * {
      display: block;
    }
    ul {
      margin: 0;
      padding: 0;
      margin-top: 10px;
    }
    li {
      margin: 0;
      margin-right: 5px;
      margin-bottom: 5px;
    }
  }
`

const Section = styled.div`
  display: flex;
  flex-direction: row;
  @media screen and (max-width: 900px) {
    flex-direction: column;
  }
`

const SiteLink = styled(Link)`
  color: ${colors.subtext};
  font-weight: 400;
  text-decoration: none;
`

export const Footer = () => (
  <Wrapper>
    <Container>
      <SiteLink to={"/"}>매일 성장하기</SiteLink>
    </Container>
  </Wrapper>
)
