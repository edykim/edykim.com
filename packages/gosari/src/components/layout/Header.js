import React from "react"
import { Link } from "gatsby"
import styled, { css } from "styled-components"
import { colors, layouts, fonts } from "styles/schema"
import ModeSwitch from "./ModeSwitch"

const ContainerWrapper = styled.header`
  max-width: ${layouts.content};
  margin: 0 auto;
  border-bottom: 1px solid ${colors.border};
  padding-bottom: 30px;
  z-index: 100;
  @media screen and (min-width: 62rem) {
    position: absolute;
    left: 50%;
    margin: 0;
    margin-left: -31rem;
    border-bottom: 0;
    background-color: ${colors.background};
    width: 9rem;
    padding-bottom: 0;
  }
`

const Container = styled.div`
  padding: ${layouts.sidePadding};
  padding-top: ${layouts.headerPadding};
  font-size: ${fonts.body};
`

const titleStyle = css`
  letter-spacing: -0.05em;
  line-height: 1.6;
  margin: 0;
  word-break: keep-all;
  text-decoration: none;
`

const Title = styled(Link)`
  ${titleStyle};
  color: ${colors.text};
`

const List = styled.ul`
  list-style: none;
  padding: 0;
  li {
    margin-bottom: 0.4em;
  }
  a {
    color: ${colors.text};
  }
`

export const Header = () => (
  <ContainerWrapper>
    <Container>
      <div>
        <Title to={"/"}>매일 성장하기</Title>
        <List>
          <li>
            <Link to={"/about"}>소개</Link>
          </li>
          <li>
            <Link to={"/archives"}>포스트</Link>
          </li>
          <li>
            <Link to={"/notes"}>노트</Link>
          </li>
        </List>
      </div>

      <ModeSwitch />
    </Container>
  </ContainerWrapper>
)
