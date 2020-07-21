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
    text-decoration: none;
    box-shadow: 0 2px 0;
  }
  > * {
    padding-top: 1em;
    padding-bottom: 5em;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  @media all and (max-width: 900px) {
    > * {
      flex-direction: column;
      align-items: flex-start;
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

const Inner = styled.div``

const Section = styled.div``

const SiteLink = styled(Link)`
  color: ${colors.subtext};
  font-weight: 400;
  text-decoration: none;
`

export const Footer = () => (
  <Wrapper>
    <Container>
      <SiteLink to={"/"}>매일 성장하기</SiteLink>
      <ul>
        <li>
          <Link to={"/archives"}>블로그</Link>
        </li>
        <li>
          <Link to={"/notes"}>노트</Link>
        </li>
        <li>
          <a href="https://twitter.com/haruair">트위터 @haruair</a>
        </li>
        <li>
          <a href="https://github.com/edykim">깃허브 @edykim</a>
        </li>
      </ul>
    </Container>
  </Wrapper>
)
